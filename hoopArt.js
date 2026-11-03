(function (global) {
  "use strict";

  // Cel-shaded hoop in two layers so the ball can pass between them:
  // drawHoopBack (shadow, board post, back net strands, back half of the rim) and
  // drawHoopFront (front net strands, front half of the rim, net hooks).
  // Coordinates are hoop-local: rim centre at (0, 0), y down. No gradients, blur or Math.random.

  const TAU = Math.PI * 2;
  const HOOK_COUNT = 12;
  const NET_ROWS = 9;
  const NET_DEPTH = 47;
  const RIM_RY = 7.2;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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

  // Net strands: from each hook two strands spiral down in opposite directions, so they cross
  // into diamonds. The net bulges a little below the rim, then tapers; a score ripple pinches it
  // in a band that travels from the rim to the bottom.
  function buildNet(options) {
    const halfWidth = options.halfWidth;
    const depth = NET_DEPTH + (options.stretch || 0);
    const swing = options.swing || 0;
    const ripple = options.ripple;
    const twist = (TAU / HOOK_COUNT) * 1.5;
    const strands = [];
    for (let hook = 0; hook < HOOK_COUNT; hook += 1) {
      const start = (hook / HOOK_COUNT) * TAU;
      for (const direction of [-1, 1]) {
        const points = [];
        for (let row = 0; row <= NET_ROWS; row += 1) {
          const t = row / NET_ROWS;
          const bulge = Math.sin(Math.min(1, t * 1.6) * Math.PI) * 0.06;
          let radius = halfWidth * (0.9 - 0.58 * t * t + bulge);
          let y = 3 + t * depth;
          if (ripple >= 0 && ripple < 1) {
            const centre = ripple * 1.5 - 0.15;
            const pinch = Math.exp(-Math.pow((t - centre) / 0.2, 2)) * (1 - ripple) * 0.3;
            radius *= 1 - pinch;
            y += pinch * 9;
          }
          const angle = start + direction * t * twist;
          points.push({
            x: Math.cos(angle) * radius + swing * Math.pow(t, 1.4),
            y: y + Math.sin(angle) * RIM_RY * (1 - t * 0.55),
            facing: Math.sin(angle)
          });
        }
        strands.push(points);
      }
    }
    return strands;
  }

  function strokeNetSegments(ctx, strands, front) {
    ctx.beginPath();
    for (const points of strands) {
      for (let i = 1; i < points.length; i += 1) {
        const a = points[i - 1];
        const b = points[i];
        // A segment belongs to the side (towards or away from the viewer) its midpoint faces.
        if ((a.facing + b.facing > 0) !== front) continue;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
    }
  }

  function drawStrands(ctx, art, strands, front) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    strokeNetSegments(ctx, strands, front);
    if (front) {
      ctx.strokeStyle = art.ink;
      ctx.lineWidth = art.chainNet ? 3 : 2.8;
      ctx.stroke();
      ctx.strokeStyle = art.net;
      ctx.lineWidth = 1.5;
      if (art.chainNet) ctx.setLineDash([2.4, 1.5]);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      ctx.strokeStyle = art.netShade;
      ctx.lineWidth = art.chainNet ? 1.6 : 1.4;
      if (art.chainNet) ctx.setLineDash([2.2, 1.6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
  }

  // Half of the rim as a thick elliptical band: ink, body, then cel shadow and light bands.
  function drawRimHalf(ctx, art, options, front) {
    const rx = options.halfWidth * (options.rimScaleX || 1);
    const ry = RIM_RY * (options.rimScaleY || 1);
    const thickness = art.rimThickness || 5.4;
    const start = front ? 0 : Math.PI;
    const end = front ? Math.PI : TAU;
    const heat = clamp(options.heat || 0, 0, 1);
    const flash = clamp(options.flash || 0, 0, 1);
    const heatColors = Array.isArray(options.heatColors) && options.heatColors.length >= 3 ? options.heatColors : null;
    let body = front ? art.rim : mixColor(art.rim, art.rimDark, 0.35);
    if (heatColors && heat > 0) body = mixColor(body, heatColors[1], heat * 0.45);
    if (flash > 0) body = mixColor(body, options.flashColor || "#ffffff", flash * 0.8);

    const arc = (radiusOffset, width, color, from, to) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx + radiusOffset, ry + radiusOffset * 0.2, 0, from, to);
      ctx.stroke();
    };

    ctx.save();
    ctx.lineCap = "round";
    if (art.glow && options.darkBackground) {
      ctx.save();
      ctx.globalAlpha *= 0.22 + heat * 0.2;
      arc(0, thickness + 9, art.rimLight, start, end);
      ctx.restore();
    }
    arc(0, thickness + 3.2, art.ink, start, end);
    arc(0, thickness, body, start, end);
    if (front) {
      // Underside in shadow, upper lip catches the light: world-fixed, like the ball.
      arc(thickness * 0.24, thickness * 0.38, flash > 0 ? body : art.rimDark, 0.12, Math.PI - 0.12);
      arc(-thickness * 0.26, thickness * 0.3, heatColors && heat > 0 ? mixColor(art.rimLight, heatColors[0], heat) : art.rimLight, 0.35, Math.PI * 0.62);
    } else {
      arc(-thickness * 0.2, thickness * 0.3, mixColor(art.rimLight, art.rim, 0.45), Math.PI * 1.15, Math.PI * 1.55);
    }
    ctx.restore();
  }

  function drawHooks(ctx, art, options) {
    const rx = options.halfWidth * (options.rimScaleX || 1);
    const ry = RIM_RY * (options.rimScaleY || 1);
    ctx.save();
    for (let hook = 0; hook < HOOK_COUNT; hook += 1) {
      const angle = (hook / HOOK_COUNT) * TAU;
      if (Math.sin(angle) <= 0.05) continue;
      const x = Math.cos(angle) * rx * 0.97;
      const y = Math.sin(angle) * ry + 3.6;
      ctx.fillStyle = art.ink;
      ctx.beginPath();
      ctx.ellipse(x, y, 2.3, 3.2, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = art.rimDark;
      ctx.beginPath();
      ctx.ellipse(x, y + 0.3, 1.2, 1.9, 0, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawBoardPost(ctx, art, board) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = art.ink;
    ctx.lineWidth = 11.5;
    ctx.beginPath();
    ctx.moveTo(board.x, board.top);
    ctx.lineTo(board.x, board.bottom);
    ctx.stroke();
    ctx.strokeStyle = art.post || art.rim;
    ctx.lineWidth = 7.5;
    ctx.stroke();
    ctx.strokeStyle = art.rimLight;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(board.x - 1.6, board.top + 3);
    ctx.lineTo(board.x - 1.6, board.bottom - 6);
    ctx.stroke();
    ctx.restore();
  }

  function drawHoopBack(ctx, art, options) {
    if (!ctx || !art) return;
    const config = options || {};
    const halfWidth = Math.max(1, Number(config.halfWidth) || 36);
    const opts = { ...config, halfWidth, ripple: Number.isFinite(config.ripple) ? config.ripple : -1 };
    ctx.save();
    ctx.fillStyle = art.shadow;
    ctx.beginPath();
    ctx.ellipse(2, 48 + (opts.stretch || 0) * 0.55, halfWidth * 0.54, 4.2, 0, 0, TAU);
    ctx.fill();
    if (config.board) drawBoardPost(ctx, art, config.board);
    drawStrands(ctx, art, buildNet(opts), false);
    drawRimHalf(ctx, art, opts, false);
    ctx.restore();
  }

  function drawHoopFront(ctx, art, options) {
    if (!ctx || !art) return;
    const config = options || {};
    const halfWidth = Math.max(1, Number(config.halfWidth) || 36);
    const opts = { ...config, halfWidth, ripple: Number.isFinite(config.ripple) ? config.ripple : -1 };
    ctx.save();
    drawStrands(ctx, art, buildNet(opts), true);
    drawRimHalf(ctx, art, opts, true);
    drawHooks(ctx, art, opts);
    ctx.restore();
  }

  global.HoopFlickHoopArt = Object.freeze({ drawHoopBack, drawHoopFront, buildNet });
})(typeof globalThis !== "undefined" ? globalThis : this);
