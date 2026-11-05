(function (global) {
  "use strict";

  const TAU = Math.PI * 2;
  const IMPACT_SPEED = 40;
  const BUMPER_SPEED = 220;
  const KINDS = Object.freeze(["bar", "peg", "slider", "spinner"]);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function finiteOr(value, fallback) {
    return Number.isFinite(value) ? value : fallback;
  }

  function parseHex(color) {
    const match = /^#([0-9a-f]{6})$/i.exec(color || "");
    if (!match) return null;
    const value = parseInt(match[1], 16);
    return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
  }

  function mixColor(color, target, amount) {
    const a = parseHex(color);
    const b = parseHex(target);
    if (!a || !b) return color;
    const t = clamp(amount, 0, 1);
    return "#" + ["r", "g", "b"].map((key) => Math.round(a[key] + (b[key] - a[key]) * t).toString(16).padStart(2, "0")).join("");
  }

  function create(spec) {
    if (!spec || !KINDS.includes(spec.kind) || !Number.isFinite(spec.x) || !Number.isFinite(spec.y)) return null;
    const kind = spec.kind;
    const defaults = {
      bar: { length: 60, minLength: 24, maxLength: 110, radius: 5, minRadius: 3, maxRadius: 9, restitution: 0.62 },
      peg: { length: 0, minLength: 0, maxLength: 0, radius: 10, minRadius: 6, maxRadius: 16, restitution: 0.9 },
      slider: { length: 54, minLength: 24, maxLength: 96, radius: 5, minRadius: 3, maxRadius: 9, restitution: 0.62 },
      spinner: { length: 64, minLength: 30, maxLength: 100, radius: 5, minRadius: 3, maxRadius: 9, restitution: 0.7 }
    }[kind];
    const obstacle = {
      kind,
      x: spec.x,
      y: spec.y,
      length: kind === "peg" ? 0 : clamp(finiteOr(spec.length, defaults.length), defaults.minLength, defaults.maxLength),
      angle: finiteOr(spec.angle, 0),
      radius: clamp(finiteOr(spec.radius, defaults.radius), defaults.minRadius, defaults.maxRadius),
      restitution: clamp(finiteOr(spec.restitution, defaults.restitution), 0, 1.2)
    };
    if (kind === "slider") {
      obstacle.axisAngle = finiteOr(spec.axisAngle, 0);
      obstacle.amplitude = clamp(finiteOr(spec.amplitude, 40), 0, 90);
      obstacle.speed = clamp(finiteOr(spec.speed, 1.6), 0, 4);
      obstacle.phase = finiteOr(spec.phase, 0);
    } else if (kind === "spinner") {
      obstacle.speed = clamp(finiteOr(spec.speed, 1.4), -4, 4);
    }
    return Object.freeze(obstacle);
  }

  function getPose(obstacle, time) {
    const t = finiteOr(time, 0);
    let x = obstacle.x;
    let y = obstacle.y;
    let angle = obstacle.angle;
    let vx = 0;
    let vy = 0;
    let omega = 0;
    if (obstacle.kind === "slider") {
      const wave = obstacle.speed * t + obstacle.phase;
      const offset = obstacle.amplitude * Math.sin(wave);
      const travelSpeed = obstacle.amplitude * obstacle.speed * Math.cos(wave);
      const axisX = Math.cos(obstacle.axisAngle);
      const axisY = Math.sin(obstacle.axisAngle);
      x += axisX * offset;
      y += axisY * offset;
      vx = axisX * travelSpeed;
      vy = axisY * travelSpeed;
    } else if (obstacle.kind === "spinner") {
      angle += obstacle.speed * t;
      omega = obstacle.speed;
    }
    const halfX = Math.cos(angle) * obstacle.length * 0.5;
    const halfY = Math.sin(angle) * obstacle.length * 0.5;
    return { x, y, angle, ax: x - halfX, ay: y - halfY, bx: x + halfX, by: y + halfY, vx, vy, omega };
  }

  function closestPoint(x, y, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const lengthSquared = dx * dx + dy * dy;
    const amount = lengthSquared > 0 ? clamp(((x - ax) * dx + (y - ay) * dy) / lengthSquared, 0, 1) : 0;
    return { x: ax + dx * amount, y: ay + dy * amount };
  }

  function pointSegmentDistance(x, y, ax, ay, bx, by) {
    const point = closestPoint(x, y, ax, ay, bx, by);
    return Math.hypot(x - point.x, y - point.y);
  }

  function collideBody(body, radius, obstacle, time, dt) {
    const pose = getPose(obstacle, time);
    const point = closestPoint(body.x, body.y, pose.ax, pose.ay, pose.bx, pose.by);
    const dx = body.x - point.x;
    const dy = body.y - point.y;
    const distance = Math.hypot(dx, dy);
    const separation = radius + obstacle.radius;
    if (distance >= separation) return null;

    let nx;
    let ny;
    if (distance > 1e-9) {
      nx = dx / distance;
      ny = dy / distance;
    } else {
      nx = -Math.sin(pose.angle);
      ny = Math.cos(pose.angle);
      const facing = nx * body.vx + ny * body.vy;
      if (facing > 1e-9) {
        nx = -nx;
        ny = -ny;
      } else if (Math.abs(facing) <= 1e-9) {
        nx = 0;
        ny = -1;
      }
    }

    const armX = point.x - pose.x;
    const armY = point.y - pose.y;
    const surfaceVx = pose.vx - pose.omega * armY;
    const surfaceVy = pose.vy + pose.omega * armX;
    const relativeVx = body.vx - surfaceVx;
    const relativeVy = body.vy - surfaceVy;
    const normalSpeed = relativeVx * nx + relativeVy * ny;
    const approachSpeed = Math.max(0, -normalSpeed);
    const tangentVx = relativeVx - normalSpeed * nx;
    const tangentVy = relativeVy - normalSpeed * ny;
    const impact = approachSpeed > IMPACT_SPEED;
    const tangentDamping = impact ? 0.98 : Math.pow(0.98, Math.max(0, finiteOr(dt, 0)) * 60);
    let outgoingNormal = normalSpeed;
    if (approachSpeed > 0) outgoingNormal = approachSpeed * obstacle.restitution;
    let kick = false;
    if (obstacle.kind === "peg" && impact && outgoingNormal < BUMPER_SPEED) {
      outgoingNormal = BUMPER_SPEED;
      kick = true;
    } else if (obstacle.kind === "peg" && impact) {
      kick = true;
    }
    return {
      x: point.x + nx * separation,
      y: point.y + ny * separation,
      vx: surfaceVx + tangentVx * tangentDamping + nx * outgoingNormal,
      vy: surfaceVy + tangentVy * tangentDamping + ny * outgoingNormal,
      nx,
      ny,
      approachSpeed,
      impact,
      kick
    };
  }

  function cross(origin, a, b) {
    return (a.x - origin.x) * (b.y - origin.y) - (a.y - origin.y) * (b.x - origin.x);
  }

  // The convex hull is the exact centre-line sweep of a translating segment.
  function convexHull(points) {
    const sorted = points.slice().sort((a, b) => a.x - b.x || a.y - b.y);
    const unique = [];
    for (const point of sorted) {
      const previous = unique[unique.length - 1];
      if (!previous || point.x !== previous.x || point.y !== previous.y) unique.push(point);
    }
    if (unique.length <= 2) return unique;
    const lower = [];
    for (const point of unique) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) lower.pop();
      lower.push(point);
    }
    const upper = [];
    for (let i = unique.length - 1; i >= 0; i -= 1) {
      const point = unique[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) upper.pop();
      upper.push(point);
    }
    lower.pop();
    upper.pop();
    return lower.concat(upper);
  }

  function pointHullDistance(x, y, hull) {
    if (hull.length === 1) return Math.hypot(x - hull[0].x, y - hull[0].y);
    if (hull.length === 2) return pointSegmentDistance(x, y, hull[0].x, hull[0].y, hull[1].x, hull[1].y);
    let inside = true;
    let distance = Infinity;
    for (let i = 0; i < hull.length; i += 1) {
      const a = hull[i];
      const b = hull[(i + 1) % hull.length];
      if ((b.x - a.x) * (y - a.y) - (b.y - a.y) * (x - a.x) < -1e-10) inside = false;
      distance = Math.min(distance, pointSegmentDistance(x, y, a.x, a.y, b.x, b.y));
    }
    return inside ? 0 : distance;
  }

  function sliderHull(obstacle) {
    const halfX = Math.cos(obstacle.angle) * obstacle.length * 0.5;
    const halfY = Math.sin(obstacle.angle) * obstacle.length * 0.5;
    const travelX = Math.cos(obstacle.axisAngle) * obstacle.amplitude;
    const travelY = Math.sin(obstacle.axisAngle) * obstacle.amplitude;
    return convexHull([
      { x: obstacle.x - halfX - travelX, y: obstacle.y - halfY - travelY },
      { x: obstacle.x + halfX - travelX, y: obstacle.y + halfY - travelY },
      { x: obstacle.x - halfX + travelX, y: obstacle.y - halfY + travelY },
      { x: obstacle.x + halfX + travelX, y: obstacle.y + halfY + travelY }
    ]);
  }

  function sweptClearance(x, y, obstacle) {
    if (obstacle.kind === "spinner") return Math.hypot(x - obstacle.x, y - obstacle.y) - obstacle.length * 0.5 - obstacle.radius;
    if (obstacle.kind === "slider") return pointHullDistance(x, y, sliderHull(obstacle)) - obstacle.radius;
    const pose = getPose(obstacle, 0);
    return pointSegmentDistance(x, y, pose.ax, pose.ay, pose.bx, pose.by) - obstacle.radius;
  }

  function getBounds(obstacle) {
    if (obstacle.kind === "spinner") {
      const reach = obstacle.length * 0.5 + obstacle.radius;
      return { minX: obstacle.x - reach, maxX: obstacle.x + reach, minY: obstacle.y - reach, maxY: obstacle.y + reach };
    }
    const points = obstacle.kind === "slider" ? sliderHull(obstacle) : (() => {
      const pose = getPose(obstacle, 0);
      return [{ x: pose.ax, y: pose.ay }, { x: pose.bx, y: pose.by }];
    })();
    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);
    return {
      minX: Math.min(...xs) - obstacle.radius,
      maxX: Math.max(...xs) + obstacle.radius,
      minY: Math.min(...ys) - obstacle.radius,
      maxY: Math.max(...ys) + obstacle.radius
    };
  }

  function strokeSegment(ctx, length, offset, width, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(-length * 0.5, offset);
    ctx.lineTo(length * 0.5, offset);
    ctx.stroke();
  }

  function drawBolt(ctx, x, palette) {
    ctx.fillStyle = palette.ink;
    ctx.beginPath();
    ctx.arc(x, 0, 2.7, 0, TAU);
    ctx.fill();
    ctx.fillStyle = palette.shade;
    ctx.beginPath();
    ctx.arc(x, 0.3, 1.35, 0, TAU);
    ctx.fill();
  }

  function drawPlank(ctx, obstacle, pose, palette, flash) {
    const body = mixColor(palette.body, "#ffffff", flash * 0.75);
    const shade = mixColor(palette.shade, "#ffffff", flash * 0.55);
    const light = mixColor(palette.light, "#ffffff", flash * 0.75);
    const shadeSide = Math.cos(pose.angle) >= 0 ? 1 : -1;
    ctx.save();
    ctx.translate(pose.x, pose.y);
    ctx.rotate(pose.angle);
    ctx.lineCap = "round";
    strokeSegment(ctx, obstacle.length, 0, obstacle.radius * 2 + 3, palette.ink);
    strokeSegment(ctx, obstacle.length, 0, obstacle.radius * 2, body);
    strokeSegment(ctx, obstacle.length * 0.94, shadeSide * obstacle.radius * 0.48, obstacle.radius * 0.58, shade);
    strokeSegment(ctx, obstacle.length * 0.9, -shadeSide * obstacle.radius * 0.52, Math.max(1.2, obstacle.radius * 0.32), light);
    drawBolt(ctx, -obstacle.length * 0.34, palette);
    drawBolt(ctx, obstacle.length * 0.34, palette);
    ctx.restore();
  }

  function drawRail(ctx, obstacle, palette) {
    const axisX = Math.cos(obstacle.axisAngle);
    const axisY = Math.sin(obstacle.axisAngle);
    const perpendicularX = -axisY;
    const perpendicularY = axisX;
    const startX = obstacle.x - axisX * obstacle.amplitude;
    const startY = obstacle.y - axisY * obstacle.amplitude;
    const endX = obstacle.x + axisX * obstacle.amplitude;
    const endY = obstacle.y + axisY * obstacle.amplitude;
    ctx.save();
    ctx.strokeStyle = palette.rail;
    ctx.lineCap = "round";
    ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (const point of [{ x: startX, y: startY }, { x: endX, y: endY }]) {
      ctx.moveTo(point.x - perpendicularX * 7, point.y - perpendicularY * 7);
      ctx.lineTo(point.x + perpendicularX * 7, point.y + perpendicularY * 7);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawPeg(ctx, obstacle, palette, flash, squash) {
    const body = mixColor(palette.accent, "#ffffff", flash * 0.85);
    const scale = 1 + squash * 0.18;
    ctx.save();
    ctx.translate(obstacle.x, obstacle.y);
    ctx.scale(scale * (1 + squash * 0.05), scale);
    ctx.fillStyle = palette.ink;
    ctx.beginPath();
    ctx.arc(0, 0, obstacle.radius + 2.2, 0, TAU);
    ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(0, 0, obstacle.radius, 0, TAU);
    ctx.fill();
    // A white ring makes a bumper read as a bumper, not a coin, even at game size.
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = Math.max(2.2, obstacle.radius * 0.26);
    ctx.beginPath();
    ctx.arc(0, 0, obstacle.radius * 0.58, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = palette.light;
    ctx.beginPath();
    ctx.arc(-obstacle.radius * 0.34, -obstacle.radius * 0.38, Math.max(1.5, obstacle.radius * 0.13), 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawSpinnerGuide(ctx, obstacle, palette) {
    ctx.save();
    ctx.globalAlpha *= 0.35;
    ctx.strokeStyle = palette.rail;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacle.length * 0.5, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  function drawHub(ctx, obstacle, palette, flash) {
    ctx.fillStyle = palette.ink;
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacle.radius + 2.4, 0, TAU);
    ctx.fill();
    ctx.fillStyle = mixColor(palette.light, "#ffffff", flash * 0.8);
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacle.radius * 0.58, 0, TAU);
    ctx.fill();
  }

  function draw(ctx, obstacle, time, palette, options) {
    if (!ctx || !obstacle || !palette) return;
    const config = options || {};
    const alpha = clamp(finiteOr(config.alpha, 1), 0, 1);
    const flash = clamp(finiteOr(config.flash, 0), 0, 1);
    const squash = clamp(finiteOr(config.squash, 0), 0, 1);
    const pose = getPose(obstacle, time);
    ctx.save();
    ctx.globalAlpha *= alpha;
    if (obstacle.kind === "slider") drawRail(ctx, obstacle, palette);
    if (obstacle.kind === "spinner") drawSpinnerGuide(ctx, obstacle, palette);
    if (obstacle.kind === "peg") {
      drawPeg(ctx, obstacle, palette, flash, squash);
    } else {
      drawPlank(ctx, obstacle, pose, palette, flash);
      if (obstacle.kind === "spinner") drawHub(ctx, obstacle, palette, flash);
    }
    ctx.restore();
  }

  global.HoopFlickObstacles = Object.freeze({ KINDS, create, getPose, collideBody, sweptClearance, getBounds, draw });
})(typeof globalThis !== "undefined" ? globalThis : this);
