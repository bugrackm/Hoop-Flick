(function (global) {
  "use strict";

  const TAU = Math.PI * 2;
  const IMPACT_SPEED = 40;
  const BUMPER_SPEED = 220;
  // At the game's gravity 1420, 300 world units/s gives a visible ~32-unit hop.
  const PAD_SPEED = 300;
  const KINDS = Object.freeze(["bar", "peg", "slider", "spinner", "pad", "blinker"]);

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
      spinner: { length: 64, minLength: 30, maxLength: 100, radius: 5, minRadius: 3, maxRadius: 9, restitution: 0.7 },
      pad: { length: 56, minLength: 36, maxLength: 90, radius: 5, minRadius: 5, maxRadius: 5, restitution: 1 },
      blinker: { length: 60, minLength: 30, maxLength: 100, radius: 5, minRadius: 5, maxRadius: 5, restitution: 0.62 }
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
    } else if (kind === "blinker") {
      obstacle.period = clamp(finiteOr(spec.period, 2.4), 1.2, 4);
      obstacle.onShare = clamp(finiteOr(spec.onShare, 0.5), 0.3, 0.7);
      obstacle.phase = finiteOr(spec.phase, 0);
    }
    return Object.freeze(obstacle);
  }

  function getCycle(obstacle, time) {
    if (obstacle.kind !== "blinker") return { solid: true, charge: 0 };
    const elapsed = finiteOr(time, 0) + obstacle.phase;
    // Positive modulo supports negative times/offsets without shifting boundaries.
    let cycle = elapsed % obstacle.period;
    if (cycle < 0) cycle += obstacle.period;
    const onDuration = obstacle.period * obstacle.onShare;
    const solid = cycle < onDuration;
    return { solid, charge: clamp(solid ? cycle / onDuration : (cycle - onDuration) / (obstacle.period - onDuration), 0, 1) };
  }

  function isSolid(obstacle, time) {
    return getCycle(obstacle, time).solid;
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
    return { x, y, angle, ax: x - halfX, ay: y - halfY, bx: x + halfX, by: y + halfY, vx, vy, omega, ...getCycle(obstacle, t) };
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
    if (!pose.solid) return null;
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
    // A resting pad is passive, including when its restitution exceeds one.
    if (obstacle.kind === "pad" && !impact && approachSpeed > 0) outgoingNormal = approachSpeed * Math.min(0.62, obstacle.restitution);
    let kick = false;
    if (obstacle.kind === "peg" && impact && outgoingNormal < BUMPER_SPEED) {
      outgoingNormal = BUMPER_SPEED;
      kick = true;
    } else if (obstacle.kind === "peg" && impact) {
      kick = true;
    } else if (obstacle.kind === "pad" && impact) {
      // Never more than elastic: a restitution above 1 would compound on a ball hopping on a flat
      // pad (measured: hop 60 → 207 in ten bounces). Slow balls still leave at PAD_SPEED.
      outgoingNormal = Math.max(Math.min(outgoingNormal, approachSpeed), PAD_SPEED);
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

  // Cel ink sits ~1.5 px outside the collision capsule: bold outlines are the game's style.
  const INK_EXTRA = 3;

  function drawPlank(ctx, obstacle, pose, palette, flash, plain) {
    const body = mixColor(palette.body, "#ffffff", flash * 0.75);
    const shade = mixColor(palette.shade, "#ffffff", flash * 0.55);
    const light = mixColor(palette.light, "#ffffff", flash * 0.75);
    const shadeSide = Math.cos(pose.angle) >= 0 ? 1 : -1;
    ctx.save();
    ctx.translate(pose.x, pose.y);
    ctx.rotate(pose.angle);
    ctx.lineCap = "round";
    strokeSegment(ctx, obstacle.length, 0, obstacle.radius * 2 + INK_EXTRA, palette.ink);
    strokeSegment(ctx, obstacle.length, 0, obstacle.radius * 2, body);
    strokeSegment(ctx, obstacle.length * 0.94, shadeSide * obstacle.radius * 0.48, obstacle.radius * 0.58, shade);
    strokeSegment(ctx, obstacle.length * 0.9, -shadeSide * obstacle.radius * 0.52, Math.max(1.2, obstacle.radius * 0.32), light);
    // Inset end sleeves and seams keep all detail inside the collision capsule.
    for (const side of [-1, 1]) {
      const end = side * obstacle.length * 0.5;
      ctx.strokeStyle = shade;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(end - side * 4, -obstacle.radius * 0.6);
      ctx.lineTo(end - side * 4, obstacle.radius * 0.6);
      ctx.stroke();
    }
    if (obstacle.kind === "spinner") {
      ctx.strokeStyle = light;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (const side of [-1, 1]) {
        ctx.moveTo(side * obstacle.length * 0.18, -obstacle.radius * 0.35);
        ctx.lineTo(side * obstacle.length * 0.28, obstacle.radius * 0.35);
      }
      ctx.stroke();
    }
    if (!plain) {
      drawBolt(ctx, -obstacle.length * 0.34, palette);
      drawBolt(ctx, obstacle.length * 0.34, palette);
    }
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
    ctx.save();
    ctx.translate(obstacle.x, obstacle.y);
    ctx.fillStyle = palette.ink;
    ctx.beginPath();
    ctx.arc(0, 0, obstacle.radius + INK_EXTRA * 0.5, 0, TAU);
    ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(0, 0, obstacle.radius, 0, TAU);
    ctx.fill();
    ctx.fillStyle = mixColor(body, palette.ink, 0.35);
    ctx.beginPath();
    ctx.arc(0, 0, obstacle.radius - 0.5, 0, Math.PI);
    ctx.fill();
    // A white ring makes a bumper read as a bumper, not a coin, even at game size.
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = Math.max(2.2, obstacle.radius * 0.26);
    ctx.beginPath();
    ctx.arc(0, 0, obstacle.radius * 0.58, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = mixColor(body, "#ffffff", 0.2 + flash * 0.65);
    ctx.beginPath();
    ctx.arc(0, squash * obstacle.radius * 0.12, obstacle.radius * (0.32 - squash * 0.06), 0, TAU);
    ctx.fill();
    ctx.fillStyle = mixColor(palette.light, "#ffffff", flash);
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
    ctx.arc(obstacle.x, obstacle.y, obstacle.radius + INK_EXTRA * 0.5, 0, TAU);
    ctx.fill();
    ctx.fillStyle = mixColor(palette.shade, "#ffffff", flash * 0.6);
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacle.radius - 0.5, 0, TAU);
    ctx.fill();
    ctx.fillStyle = mixColor(palette.light, "#ffffff", flash * 0.8);
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacle.radius * 0.58, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(obstacle.x - 1.5, obstacle.y + 1);
    ctx.lineTo(obstacle.x + 1.5, obstacle.y - 1);
    ctx.stroke();
  }

  function drawCarriage(ctx, obstacle, pose, palette, flash) {
    ctx.save();
    ctx.translate(pose.x, pose.y);
    ctx.rotate(pose.angle);
    ctx.lineCap = "round";
    strokeSegment(ctx, 8, 0, obstacle.radius * 2 + 2, palette.ink);
    strokeSegment(ctx, 7, 0, obstacle.radius * 2 - 1, mixColor(palette.light, "#ffffff", flash));
    drawBolt(ctx, 0, palette);
    ctx.restore();
  }

  function drawPad(ctx, obstacle, pose, palette, flash, squash) {
    // Cyan is distinct from both gold collectibles and pink-red bumpers.
    const band = mixColor("#24cfc5", "#ffffff", flash * 0.85);
    const half = obstacle.length * 0.5;
    const dip = squash * 2;
    ctx.save();
    ctx.translate(pose.x, pose.y);
    ctx.rotate(pose.angle);
    ctx.lineCap = "round";
    for (const [width, color, offset] of [[8, palette.ink, 0], [6, band, 0], [1.2, "#d6fffa", -1.2]]) {
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(-half, offset);
      ctx.quadraticCurveTo(0, dip * 2 + offset, half, offset);
      ctx.stroke();
    }
    for (const side of [-1, 1]) {
      ctx.fillStyle = palette.ink;
      ctx.beginPath();
      ctx.arc(side * half, 0, obstacle.radius + 1, 0, TAU);
      ctx.fill();
      ctx.fillStyle = mixColor(palette.light, "#ffffff", flash);
      ctx.beginPath();
      ctx.arc(side * half, 0, obstacle.radius - 1, 0, TAU);
      ctx.fill();
      drawBolt(ctx, side * half, palette);
    }
    ctx.restore();
  }

  function drawBlinker(ctx, obstacle, pose, palette, flash, darkBackground) {
    const warning = darkBackground ? "#b9a4ff" : "#6945b8";
    const telegraph = pose.solid ? clamp((pose.charge - 0.75) / 0.25, 0, 1) : clamp((pose.charge - 0.7) / 0.3, 0, 1);
    ctx.save();
    if (pose.solid) {
      // Drain the surface as the solid window ends; the outline stays readable.
      drawPlank(ctx, obstacle, pose, { ...palette, body: mixColor(warning, palette.shade, telegraph * 0.7) }, flash, true);
    }
    ctx.translate(pose.x, pose.y);
    ctx.rotate(pose.angle);
    ctx.lineCap = "round";
    if (!pose.solid) {
      ctx.globalAlpha *= 0.25 + telegraph * 0.65;
      ctx.strokeStyle = mixColor(warning, "#ffffff", flash);
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(-obstacle.length * 0.5, -obstacle.radius);
      ctx.lineTo(obstacle.length * 0.5, -obstacle.radius);
      ctx.arc(obstacle.length * 0.5, 0, obstacle.radius, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(-obstacle.length * 0.5, obstacle.radius);
      ctx.arc(-obstacle.length * 0.5, 0, obstacle.radius, Math.PI / 2, Math.PI * 1.5);
      ctx.stroke();
      ctx.setLineDash([]);
      // The final off-phase closes the gaps, still with no filled ghost body.
      if (telegraph > 0) {
        ctx.lineWidth = 1 + telegraph;
        ctx.stroke();
      }
    } else {
      // Hazard stripes, clipped to the plank so they never poke out of the outline.
      ctx.save();
      ctx.beginPath();
      ctx.rect(-obstacle.length * 0.5, -obstacle.radius, obstacle.length, obstacle.radius * 2);
      ctx.clip();
      ctx.strokeStyle = mixColor(warning, "#ffffff", 0.55 + flash * 0.45);
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = -obstacle.length * 0.5 + 6; x < obstacle.length * 0.5; x += 9) {
        ctx.moveTo(x - 3, obstacle.radius);
        ctx.lineTo(x + 3, -obstacle.radius);
      }
      ctx.stroke();
      ctx.restore();
      strokeSegment(ctx, obstacle.length * (1 - telegraph), -obstacle.radius * 0.55, 1.2, palette.light);
    }
    ctx.restore();
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
    } else if (obstacle.kind === "pad") {
      drawPad(ctx, obstacle, pose, palette, flash, squash);
    } else if (obstacle.kind === "blinker") {
      drawBlinker(ctx, obstacle, pose, palette, flash, !!config.darkBackground);
    } else {
      drawPlank(ctx, obstacle, pose, palette, flash);
      if (obstacle.kind === "slider") drawCarriage(ctx, obstacle, pose, palette, flash);
      if (obstacle.kind === "spinner") drawHub(ctx, obstacle, palette, flash);
    }
    ctx.restore();
  }

  global.HoopFlickObstacles = Object.freeze({ KINDS, create, getPose, isSolid, collideBody, sweptClearance, getBounds, draw });
})(typeof globalThis !== "undefined" ? globalThis : this);
