(function (global) {
  "use strict";

  const TAU = Math.PI * 2;

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
    return "#" + ["r", "g", "b"].map((key) => {
      return Math.round(a[key] + (b[key] - a[key]) * t).toString(16).padStart(2, "0");
    }).join("");
  }

  function circlePath(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
  }

  function fillCircle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    circlePath(ctx, x, y, radius);
    ctx.fill();
  }

  function strokeCircle(ctx, x, y, radius, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    circlePath(ctx, x, y, radius);
    ctx.stroke();
  }

  function strokePolyline(ctx, points, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    ctx.stroke();
  }

  function drawTeardrop(ctx, x, y, length, width, angle, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -length * 0.58);
    ctx.bezierCurveTo(width * 0.62, -length * 0.18, width * 0.55, length * 0.4, 0, length * 0.5);
    ctx.bezierCurveTo(-width * 0.55, length * 0.4, -width * 0.62, -length * 0.18, 0, -length * 0.58);
    ctx.fill();
    ctx.restore();
  }

  function drawSparkle(ctx, x, y, radius, color, alpha) {
    if (radius <= 0.001) return;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x + radius * 0.16, y - radius * 0.16);
    ctx.lineTo(x + radius, y);
    ctx.lineTo(x + radius * 0.16, y + radius * 0.16);
    ctx.lineTo(x, y + radius);
    ctx.lineTo(x - radius * 0.16, y + radius * 0.16);
    ctx.lineTo(x - radius, y);
    ctx.lineTo(x - radius * 0.16, y - radius * 0.16);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawSeams(ctx, r, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width * r;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.lineTo(r, 0);
    ctx.moveTo(0, -r);
    ctx.lineTo(0, r);
    ctx.moveTo(-0.58 * r, -0.84 * r);
    ctx.quadraticCurveTo(0.22 * r, 0, -0.58 * r, 0.84 * r);
    ctx.moveTo(0.58 * r, -0.84 * r);
    ctx.quadraticCurveTo(-0.22 * r, 0, 0.58 * r, 0.84 * r);
    ctx.stroke();
  }

  function drawAnnularWedge(ctx, inner, outer, start, end, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, outer, start, end);
    ctx.arc(0, 0, inner, end, start, true);
    ctx.closePath();
    ctx.fill();
  }

  function drawCapsule(ctx, x1, y1, x2, y2, width, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function classicBase(ctx, r, art) {
    drawSeams(ctx, r, art.seams, 0.11);
  }

  function invertedBase(ctx, r, art) {
    drawSeams(ctx, r, art.seams, 0.1);
  }

  function watermelonBase(ctx, r, art) {
    const seeds = [
      [-0.38, -0.35, -0.72], [0, -0.47, 0], [0.4, -0.28, 0.72],
      [-0.5, 0.1, -1.18], [-0.16, 0.2, -2.7], [0.23, 0.19, 2.7], [0.5, 0.2, 1.18]
    ];
    for (const seed of seeds) {
      drawTeardrop(ctx, seed[0] * r, seed[1] * r, 0.23 * r, 0.13 * r, seed[2], art.seed);
      fillCircle(ctx, (seed[0] - Math.sin(seed[2]) * 0.045) * r, (seed[1] - Math.cos(seed[2]) * 0.045) * r, 0.025 * r, "#ffffff");
    }
    strokeCircle(ctx, 0, 0, r * 0.82, art.innerRind, 0.06 * r);
  }

  const MAGMA_CRACKS = [
    [[-0.92, -0.24], [-0.46, -0.12], [-0.18, -0.34], [0.08, -0.12]],
    [[0.08, -0.12], [0.35, -0.02], [0.62, -0.22], [0.92, -0.12]],
    [[-0.2, -0.98], [-0.12, -0.58], [0.08, -0.35], [0.08, -0.12]],
    [[0.08, -0.12], [0.2, 0.2], [0.06, 0.5], [0.24, 0.94]],
    [[-0.72, 0.64], [-0.42, 0.38], [-0.18, 0.48], [0.06, 0.5]]
  ];

  function magmaBase(ctx, r, art) {
    ctx.fillStyle = art.plate;
    const plates = [[-0.5, -0.5, 0.32], [0.42, -0.46, 0.29], [-0.48, 0.42, 0.27], [0.48, 0.48, 0.25]];
    for (const plate of plates) {
      ctx.beginPath();
      ctx.arc(plate[0] * r, plate[1] * r, plate[2] * r, 0.2, Math.PI * 1.7);
      ctx.lineTo(plate[0] * r, plate[1] * r);
      ctx.fill();
    }
  }

  function magmaGlow(ctx, r, art, time, heat) {
    const pulse = 1 + 0.15 * Math.sin(time * 4);
    const boost = 1 + heat * 0.4;
    for (const crack of MAGMA_CRACKS) {
      const points = crack.map((point) => [point[0] * r, point[1] * r]);
      strokePolyline(ctx, points, art.crackOuter, 0.16 * r * pulse * boost);
      strokePolyline(ctx, points, heat > 0 ? mixColor(art.crackInner, "#fff7cf", heat) : art.crackInner, 0.06 * r * pulse * boost);
    }
  }

  function toxicBase(ctx, r, art) {
    fillCircle(ctx, 0, 0, 0.14 * r, art.symbol);
    for (let i = 0; i < 3; i += 1) {
      const center = -Math.PI * 0.5 + i * TAU / 3;
      drawAnnularWedge(ctx, 0.24 * r, 0.72 * r, center - 0.48, center + 0.48, art.symbol);
    }
  }

  function toxicGlow(ctx, r, art, time, heat) {
    const bubbles = [[-0.55, -0.42, 0.1, 0], [0.54, 0.12, 0.13, 1.8], [-0.2, 0.58, 0.08, 3.4]];
    ctx.globalAlpha *= 0.7 + 0.3 * heat;
    for (const bubble of bubbles) {
      const pulse = 1 + 0.16 * Math.sin(time * 4.5 + bubble[3]);
      strokeCircle(ctx, bubble[0] * r, bubble[1] * r, bubble[2] * r * pulse, mixColor(art.bubble, "#ffffff", heat * 0.55), 0.055 * r);
    }
  }

  function bloodMoonBase(ctx, r, art) {
    const craters = [[-0.42, -0.32, 0.25], [0.38, -0.42, 0.16], [0.4, 0.3, 0.23], [-0.35, 0.48, 0.14]];
    for (const crater of craters) {
      fillCircle(ctx, crater[0] * r, crater[1] * r, crater[2] * r, art.crater);
      ctx.strokeStyle = art.craterLip;
      ctx.lineWidth = 0.055 * r;
      ctx.beginPath();
      ctx.arc(crater[0] * r, crater[1] * r, crater[2] * r * 0.78, 0.15, Math.PI * 0.92);
      ctx.stroke();
    }
  }

  // [centre y, start x, end x, wave phase]; bands taper at both ends and alternate sides.
  const ZEBRA_STRIPES = [
    [-0.74, -0.85, 0.55, 0.4], [-0.38, -0.25, 1.1, 1.6], [0, -1.1, 0.6, 3.1],
    [0.38, -0.45, 1.1, 4.2], [0.74, -0.95, 0.45, 5.3]
  ];

  function zebraBase(ctx, r, art) {
    ctx.fillStyle = art.stripe;
    for (const stripe of ZEBRA_STRIPES) {
      const top = [];
      const bottom = [];
      for (let i = 0; i <= 10; i += 1) {
        const u = i / 10;
        const x = stripe[1] + (stripe[2] - stripe[1]) * u;
        const y = stripe[0] + 0.1 * Math.sin(x * 2.4 + stripe[3]);
        const half = 0.1 * Math.pow(Math.sin(Math.PI * u), 0.6);
        top.push([x * r, (y - half) * r]);
        bottom.push([x * r, (y + half) * r]);
      }
      ctx.beginPath();
      ctx.moveTo(top[0][0], top[0][1]);
      for (const point of top) ctx.lineTo(point[0], point[1]);
      for (let i = bottom.length - 1; i >= 0; i -= 1) ctx.lineTo(bottom[i][0], bottom[i][1]);
      ctx.closePath();
      ctx.fill();
    }
  }

  function continent(ctx, r, points, fill, stroke) {
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 0.05 * r;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(points[0][0] * r, points[0][1] * r);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0] * r, points[i][1] * r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function earthBase(ctx, r, art, time, heat, options) {
    continent(ctx, r, [[-0.86, -0.4], [-0.52, -0.66], [-0.18, -0.48], [-0.3, -0.08], [-0.62, 0.02]], art.land, art.coast);
    continent(ctx, r, [[0.12, -0.62], [0.6, -0.52], [0.78, -0.16], [0.42, 0.02], [0.08, -0.22]], art.land, art.coast);
    continent(ctx, r, [[-0.1, 0.12], [0.3, 0.1], [0.5, 0.48], [0.12, 0.78], [-0.28, 0.52]], art.land, art.coast);
    ctx.save();
    ctx.rotate((options.rotation || 0) * 0.15 + time * 0.15);
    ctx.globalAlpha = 0.9;
    drawCapsule(ctx, -0.74 * r, -0.25 * r, -0.1 * r, -0.35 * r, 0.12 * r, art.cloud);
    drawCapsule(ctx, 0.12 * r, 0.43 * r, 0.7 * r, 0.28 * r, 0.1 * r, art.cloud);
    ctx.restore();
  }

  function cyberpunkBase(ctx, r, art) {
    ctx.save();
    ctx.rotate(-0.62);
    drawCapsule(ctx, -1.2 * r, 0, 1.2 * r, 0, 0.28 * r, art.band);
    ctx.restore();
  }

  function cyberpunkGlow(ctx, r, art, time, heat) {
    const traces = [
      [[-0.72, -0.5], [-0.36, -0.5], [-0.36, -0.2], [-0.08, -0.2]],
      [[0.14, -0.7], [0.14, -0.36], [0.48, -0.36], [0.48, -0.1]],
      [[-0.62, 0.14], [-0.22, 0.14], [-0.22, 0.52], [0.08, 0.52]],
      [[0.26, 0.1], [0.58, 0.1], [0.58, 0.52], [0.74, 0.52]]
    ];
    const lit = Math.floor(time / 0.25) % traces.length;
    for (let i = 0; i < traces.length; i += 1) {
      const points = traces[i].map((point) => [point[0] * r, point[1] * r]);
      const bright = i === lit;
      const color = bright ? mixColor(art.circuit, "#ffffff", 0.72) : mixColor(art.circuit, "#ffffff", heat * 0.4);
      strokePolyline(ctx, points, color, (bright ? 0.105 : 0.08) * r);
      const end = points[points.length - 1];
      fillCircle(ctx, end[0], end[1], (bright ? 0.115 : 0.085) * r, color);
    }
  }

  function neonGlow(ctx, r, art, time, heat) {
    const phase = time % 3.4;
    const flicker = phase > 3.18 && phase < 3.28 ? 0.42 : 1;
    ctx.globalAlpha *= flicker;
    const core = mixColor(art.tubeCore, "#ffffff", heat * 0.6);
    const drawTube = (path) => {
      ctx.beginPath();
      path();
      ctx.strokeStyle = art.tubeHalo;
      ctx.lineWidth = 0.24 * r;
      ctx.globalAlpha *= 0.35;
      ctx.stroke();
      ctx.globalAlpha /= 0.35;
      ctx.strokeStyle = art.tube;
      ctx.lineWidth = 0.12 * r;
      ctx.stroke();
      ctx.strokeStyle = core;
      ctx.lineWidth = 0.045 * r;
      ctx.stroke();
    };
    ctx.lineCap = "round";
    drawTube(() => { ctx.moveTo(-r, 0); ctx.lineTo(r, 0); });
    drawTube(() => { ctx.moveTo(0.52 * r, -0.84 * r); ctx.quadraticCurveTo(-0.25 * r, 0, 0.52 * r, 0.84 * r); });
  }

  function goldBase(ctx, r, art) {
    drawSeams(ctx, r, art.engraving, 0.08);
  }

  function goldGlow(ctx, r, art, time) {
    const phase = time % 1.8;
    const u = phase < 0.4 ? phase / 0.4 : 0;
    const size = u > 0 ? Math.sin(u * Math.PI) * 0.35 * r : 0;
    drawSparkle(ctx, -0.34 * r, -0.43 * r, size, art.sparkle, 0.95);
  }

  function ghostBase(ctx, r, art, time, heat, options) {
    const blinkPhase = time % 3.2;
    const blink = blinkPhase > 2.98 && blinkPhase < 3.1 ? 0.12 : 1;
    const look = options.look || { x: 0, y: 0 };
    const shiftX = clamp(look.x || 0, -1, 1) * 0.08 * r;
    const shiftY = clamp(look.y || 0, -1, 1) * 0.08 * r;
    for (const side of [-1, 1]) {
      ctx.fillStyle = art.face;
      ctx.beginPath();
      ctx.ellipse(side * 0.3 * r + shiftX, -0.08 * r + shiftY, 0.12 * r, 0.19 * r * blink, 0, 0, TAU);
      ctx.fill();
      if (blink > 0.5) fillCircle(ctx, side * 0.3 * r + shiftX - 0.035 * r, -0.13 * r + shiftY, 0.025 * r, "#ffffff");
    }
    const baseAlpha = ctx.globalAlpha;
    ctx.globalAlpha = baseAlpha * 0.6;
    fillCircle(ctx, -0.58 * r, 0.24 * r, 0.12 * r, art.cheek);
    fillCircle(ctx, 0.58 * r, 0.24 * r, 0.12 * r, art.cheek);
    ctx.globalAlpha = baseAlpha;
    ctx.fillStyle = art.face;
    ctx.beginPath();
    ctx.ellipse(0, 0.3 * r, 0.1 * r, 0.07 * r, 0, 0, TAU);
    ctx.fill();
  }

  function matrixGlow(ctx, r, art, time, heat) {
    const columns = [-0.68, -0.34, 0, 0.34, 0.68];
    const baseAlpha = ctx.globalAlpha;
    ctx.lineCap = "round";
    for (let c = 0; c < columns.length; c += 1) {
      const speed = 0.42 + c * 0.08;
      const offset = ((time * speed + c * 0.19) % 1.45) * 2.0 - 1.15;
      for (let i = 0; i < 7; i += 1) {
        let y = offset - i * 0.24;
        while (y < -1.15) y += 2.3;
        while (y > 1.15) y -= 2.3;
        const head = i === 0;
        ctx.globalAlpha = baseAlpha * (head ? 1 : 0.36 + (6 - i) * 0.07);
        drawCapsule(ctx, columns[c] * r, y * r, columns[c] * r, (y + 0.16) * r, 0.1 * r, head ? mixColor(art.rainHead, "#ffffff", heat * 0.45) : art.rain);
      }
    }
  }

  function sunUnder(ctx, r, art, time, heat) {
    ctx.save();
    ctx.rotate(time * 0.6);
    const drawRays = (color, inner, long, short) => {
      ctx.fillStyle = color;
      for (let i = 0; i < 10; i += 1) {
        const angle = i * TAU / 10;
        const tip = (i % 2 ? short : long) * (1 + heat * 0.2) * r;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle - 0.14) * inner * r, Math.sin(angle - 0.14) * inner * r);
        ctx.lineTo(Math.cos(angle) * tip, Math.sin(angle) * tip);
        ctx.lineTo(Math.cos(angle + 0.14) * inner * r, Math.sin(angle + 0.14) * inner * r);
        ctx.closePath();
        ctx.fill();
      }
    };
    drawRays(art.coronaEdge, 0.96, 1.39, 1.27);
    drawRays(art.corona, 0.98, 1.32, 1.2);
    ctx.restore();
  }

  function sunBase(ctx, r, art) {
    fillCircle(ctx, 0, 0, 0.55 * r, art.core);
    ctx.strokeStyle = art.flare;
    ctx.lineWidth = 0.1 * r;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(-0.1 * r, -0.08 * r, 0.7 * r, -2.75, -1.18);
    ctx.moveTo(-0.58 * r, 0.42 * r);
    ctx.arc(0.06 * r, 0.12 * r, 0.7 * r, 2.7, 1.22, true);
    ctx.stroke();
  }

  const PAINTERS = {
    classic: { base: classicBase }, inverted: { base: invertedBase }, watermelon: { base: watermelonBase },
    magma: { base: magmaBase, glow: magmaGlow }, toxic: { base: toxicBase, glow: toxicGlow },
    bloodMoon: { base: bloodMoonBase }, zebra: { base: zebraBase }, earth: { base: earthBase },
    cyberpunk: { base: cyberpunkBase, glow: cyberpunkGlow }, neon: { glow: neonGlow },
    gold: { base: goldBase, glow: goldGlow, worldGlow: true }, ghost: { base: ghostBase, worldUpright: true },
    matrix: { glow: matrixGlow, worldGlow: true }, sun: { under: sunUnder, base: sunBase }
  };

  const SKIN_IDS = Object.freeze(Object.keys(PAINTERS));

  function fillCrescent(ctx, r, cutX, cutY, cutRadius, color, alpha, mode) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    if (mode) ctx.globalCompositeOperation = mode;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.arc(cutX * r, cutY * r, cutRadius * r, 0, TAU, true);
    ctx.fill("evenodd");
    ctx.restore();
  }

  function drawWorldLighting(ctx, r, art, heat, heatColors) {
    if (art.emissive) return;
    const outer = heatColors ? heatColors[2] : art.shadow;
    const core = heatColors ? heatColors[0] : art.rim;
    const shadow = heatColors ? mixColor(art.shadow, outer, 0.55 * heat) : art.shadow;
    const rim = heatColors ? mixColor(art.rim, core, heat) : art.rim;
    fillCrescent(ctx, r, -0.24, -0.28, 1, shadow, art.shadowAlpha === undefined ? 0.55 : art.shadowAlpha, art.shadowMode === "multiply" ? "multiply" : null);
    const rimAlpha = art.rimAlpha === undefined ? 0.5 : art.rimAlpha;
    // On fire the lit edge widens and takes the flame's core colour.
    fillCrescent(ctx, r, -0.09 - 0.1 * heat, -0.1 - 0.12 * heat, 0.98, rim, rimAlpha + heat * (0.95 - rimAlpha));
  }

  function drawSpecular(ctx, r, art) {
    const alpha = art.highlightAlpha === undefined ? 0.8 : art.highlightAlpha;
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.fillStyle = art.highlight || "#ffffff";
    ctx.beginPath();
    ctx.ellipse(-0.36 * r, -0.44 * r, 0.3 * r, 0.15 * r, -0.72, 0, TAU);
    ctx.fill();
    fillCircle(ctx, -0.07 * r, -0.66 * r, 0.07 * r, art.highlight || "#ffffff");
    ctx.restore();
  }

  function drawGoldLightBand(ctx, r, art) {
    if (art.id !== "gold") return;
    ctx.save();
    ctx.globalAlpha *= 0.7;
    ctx.fillStyle = art.metalBand;
    ctx.translate(-0.28 * r, -0.38 * r);
    ctx.rotate(-0.62);
    ctx.fillRect(-1.1 * r, -0.12 * r, 2.2 * r, 0.24 * r);
    ctx.restore();
  }

  function drawBall(ctx, art, options) {
    if (!ctx || !art || !PAINTERS[art.id]) return;
    const config = options || {};
    const r = Math.max(0.01, Number(config.radius) || 1);
    const rotation = Number(config.rotation) || 0;
    const time = Number(config.time) || 0;
    const heat = clamp(Number(config.heat) || 0, 0, 1);
    const flash = clamp(Number(config.flash) || 0, 0, 1);
    const heatColors = Array.isArray(config.heatColors) && config.heatColors.length >= 3 ? config.heatColors : null;
    const painter = PAINTERS[art.id];

    ctx.save();
    ctx.globalAlpha *= art.alpha === undefined ? 1 : art.alpha;
    if (painter.under) painter.under(ctx, r, art, time, heat, config);

    ctx.save();
    circlePath(ctx, 0, 0, r);
    ctx.clip();
    fillCircle(ctx, 0, 0, r, art.body);

    if (painter.base) {
      ctx.save();
      if (!painter.worldUpright) ctx.rotate(rotation);
      painter.base(ctx, r, art, time, heat, config);
      ctx.restore();
    }

    drawWorldLighting(ctx, r, art, heat, heatColors);
    drawGoldLightBand(ctx, r, art);
    drawSpecular(ctx, r, art);

    if (painter.glow) {
      ctx.save();
      if (!painter.worldGlow) ctx.rotate(rotation);
      painter.glow(ctx, r, art, time, heat, config);
      ctx.restore();
    }
    ctx.restore();

    const outlineWidth = (art.outlineWidth === undefined ? 0.13 : art.outlineWidth) * r;
    // The ink outline only warms a little: it keeps the ball readable against its own flame.
    const outline = heatColors ? mixColor(art.outline, heatColors[2], heat * 0.35) : art.outline;
    if (heat > 0 && heatColors) {
      ctx.save();
      ctx.globalAlpha *= heat;
      strokeCircle(ctx, 0, 0, r - outlineWidth - 0.035 * r, heatColors[0], 0.08 * r);
      ctx.restore();
    }
    strokeCircle(ctx, 0, 0, r - outlineWidth * 0.5, outline, outlineWidth);
    if (art.darkBody && config.darkBackground) {
      ctx.save();
      ctx.globalAlpha *= 0.35;
      strokeCircle(ctx, 0, 0, r + 0.5, "#ffffff", 1);
      ctx.restore();
    }
    if (flash > 0) {
      ctx.save();
      ctx.globalAlpha *= flash;
      fillCircle(ctx, 0, 0, r, "#ffffff");
      ctx.restore();
    }
    ctx.restore();
  }

  global.HoopFlickBallArt = Object.freeze({ drawBall, SKIN_IDS });
})(typeof globalThis !== "undefined" ? globalThis : this);
