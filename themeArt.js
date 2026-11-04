(function (global) {
  "use strict";

  const TAU = Math.PI * 2;
  const THEME_IDS = Object.freeze(["gym", "sunset", "neon", "rooftop", "minimal"]);
  const WALL_X = 30;
  const WORLD_W = 420;
  const FAR_TILE_H = 760;
  const WALL_TILE_H = 360;

  function palette(sky, accent, wall, wallShade, wallLight, ink, uiTint) {
    return Object.freeze({
      sky: Object.freeze(sky.slice()), accent, wall, wallShade, wallLight, ink, uiTint
    });
  }

  const PALETTES = Object.freeze({
    gym: Object.freeze({
      light: palette(["#f3e9d7", "#ead9bd", "#f0bdae"], "#e8452f", "#2f5fb3", "#234a8f", "#4f80d6", "#2b1c1a", "#f3e9d7"),
      dark: palette(["#1b2433", "#222d40", "#3a2a35"], "#f25543", "#24427d", "#1a3060", "#3a62a8", "#0f0b0b", "#263247")
    }),
    sunset: Object.freeze({
      light: palette(["#ffe2b6", "#ffd3a3", "#ffc394", "#ffb18b", "#ff9f88", "#f88d8b", "#ee7d8c"], "#ec9437", "#c98a52", "#9c6237", "#e2ad74", "#3a1b22", "#ffe3c9"),
      dark: palette(["#251538", "#321a48", "#451d57", "#5d2262", "#7a2a6b", "#9a3672", "#b8467a"], "#f24cbf", "#6b3d4a", "#4a2635", "#8c5463", "#1d0a18", "#482047")
    }),
    neon: Object.freeze({
      light: palette(["#eafcff", "#dcf6fc", "#cdeff8", "#c0e8f4"], "#13a9f0", "#26334a", "#182438", "#52627c", "#0c2944", "#daf7fb"),
      dark: palette(["#070b1a", "#0a0f24", "#10102e", "#170f38", "#1f0f40"], "#14e0cc", "#0d1424", "#070c17", "#26334a", "#03111b", "#111c34")
    }),
    rooftop: Object.freeze({
      light: palette(["#e3e8ff", "#d6defc", "#c9d3f6", "#bcc7ef"], "#df62ea", "#8d95a3", "#666f80", "#d9dee6", "#2b1730", "#e0e4f8"),
      dark: palette(["#12172e", "#161c38", "#1b2242", "#20284c"], "#f27bc6", "#666f80", "#4d5565", "#d3d8e0", "#170d16", "#252c49")
    }),
    minimal: Object.freeze({
      light: palette(["#f6f3ee"], "#3e3a3a", "#fbfaf7", "#e2dcd2", "#ffffff", "#121010", "#f0ece5"),
      dark: palette(["#151517"], "#ebe6de", "#1e1e21", "#111114", "#343439", "#ebe6de", "#242428")
    })
  });

  const PARALLAX = Object.freeze({ gym: 0.5, sunset: 0.25, neon: 0.35, rooftop: 0.4, minimal: 0.6 });

  function themeKey(themeId) {
    return Object.prototype.hasOwnProperty.call(PALETTES, themeId) ? themeId : "gym";
  }

  function getParallax(themeId) {
    return PARALLAX[themeKey(themeId)];
  }

  function getPalette(themeId, dark) {
    return PALETTES[themeKey(themeId)][dark ? "dark" : "light"];
  }

  function fillRect(ctx, color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  function fillCircle(ctx, color, x, y, radius) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();
  }

  function hash(index) {
    let value = (index | 0) + 0x6d2b79f5;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }

  function paintBands(ctx, colors, x0, x1, height, weights) {
    const total = weights.reduce((sum, value) => sum + value, 0);
    let y = 0;
    for (let i = 0; i < colors.length; i += 1) {
      const next = i === colors.length - 1 ? height : y + height * weights[i] / total;
      fillRect(ctx, colors[i], x0, y, x1 - x0, next - y + 0.5);
      y = next;
    }
  }

  function paintSky(ctx, themeId, dark, x0, x1, height) {
    const id = themeKey(themeId);
    const art = getPalette(id, dark);
    ctx.save();
    if (id === "gym") {
      fillRect(ctx, art.sky[0], x0, 0, x1 - x0, height);
      fillRect(ctx, art.sky[1], x0, height * 0.64, x1 - x0, 26);
      fillRect(ctx, art.sky[2], x0, height * 0.64 + 31, x1 - x0, 8);
    } else if (id === "sunset") {
      paintBands(ctx, art.sky, x0, x1, height, [0.7, 0.78, 0.86, 0.96, 1.08, 1.22, 1.4]);
      const sunY = height * 0.32;
      fillCircle(ctx, dark ? "#ff7fa8" : "#fff0c2", 300, sunY, 74);
      const slitColor = art.sky[3];
      const slits = [[-13, 3], [1, 5], [18, 7], [38, 10]];
      for (const slit of slits) fillRect(ctx, slitColor, 225, sunY + slit[0], 150, slit[1]);
    } else if (id === "neon") {
      paintBands(ctx, art.sky, x0, x1, height, art.sky.map((_, i) => 1 + i * 0.2));
    } else if (id === "rooftop") {
      paintBands(ctx, art.sky, x0, x1, height, [0.8, 0.95, 1.1, 1.3]);
      if (dark) {
        fillCircle(ctx, "#f3eedb", 90, height * 0.2, 34);
        fillCircle(ctx, "#e2dcc4", 79, height * 0.18, 7);
        fillCircle(ctx, "#e2dcc4", 101, height * 0.22, 5);
      }
    } else {
      fillRect(ctx, art.sky[0], x0, 0, x1 - x0, height);
      fillCircle(ctx, dark ? "#1b1b1e" : "#efeae2", 300, height * 0.34, 128);
    }
    ctx.restore();
  }

  function roundedArch(ctx, x, y, width, height, frame, pane) {
    const radius = width * 0.5;
    ctx.fillStyle = frame;
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arc(x + radius, y + radius, radius, Math.PI, TAU);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.fill();
    const inset = 7;
    ctx.fillStyle = pane;
    ctx.beginPath();
    ctx.moveTo(x + inset, y + radius);
    ctx.arc(x + radius, y + radius, radius - inset, Math.PI, TAU);
    ctx.lineTo(x + width - inset, y + height - inset);
    ctx.lineTo(x + inset, y + height - inset);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = frame;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + radius, y + 7);
    ctx.lineTo(x + radius, y + height - 7);
    for (let row = 1; row <= 2; row += 1) {
      const lineY = y + radius + row * (height - radius) / 3;
      ctx.moveTo(x + 7, lineY);
      ctx.lineTo(x + width - 7, lineY);
    }
    ctx.stroke();
  }

  function paintGymFar(ctx, dark) {
    const frame = dark ? "#2b364a" : "#d9c9ac";
    const pane = dark ? "#22365c" : "#dcebee";
    roundedArch(ctx, 62, 70, 70, 130, frame, pane);
    roundedArch(ctx, 292, 420, 70, 130, frame, pane);
    if (dark) {
      for (const point of [[78, 103], [111, 142], [313, 465], [345, 500]]) fillCircle(ctx, "#d6dcf2", point[0], point[1], 1.5);
    }
    ctx.strokeStyle = dark ? "#39445a" : "#c8b99e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, 285);
    ctx.quadraticCurveTo(210, 330, 390, 285);
    ctx.stroke();
    const flags = dark ? ["#7e3f4a", "#d5c8ae", "#345176"] : ["#c86558", "#eee0c7", "#557a98"];
    for (let i = 0; i < 9; i += 1) {
      const x = 42 + i * 42;
      const y = 291 + Math.sin(i / 8 * Math.PI) * 34;
      ctx.fillStyle = flags[i % flags.length];
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 18, y + 3);
      ctx.lineTo(x + 10, y + 25);
      ctx.closePath();
      ctx.fill();
    }
    // A calm hanging banner: muted so it never competes with a hoop in front of it.
    const bannerBody = dark ? "#33293a" : "#e6c4b2";
    ctx.fillStyle = bannerBody;
    ctx.beginPath();
    ctx.moveTo(190, 540);
    ctx.lineTo(230, 540);
    ctx.lineTo(230, 612);
    ctx.lineTo(210, 600);
    ctx.lineTo(190, 612);
    ctx.closePath();
    ctx.fill();
    fillRect(ctx, dark ? "#45384b" : "#eed5c6", 190, 540, 40, 7);
    fillRect(ctx, dark ? "#4d3f52" : "#f3e3d6", 199, 562, 22, 4);
    fillRect(ctx, dark ? "#4d3f52" : "#f3e3d6", 199, 572, 22, 4);
  }

  function cloud(ctx, x, y, scale, body, underside) {
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(x, y + 12 * scale, 20 * scale, Math.PI, TAU);
    ctx.arc(x + 25 * scale, y, 27 * scale, Math.PI, TAU);
    ctx.arc(x + 57 * scale, y + 10 * scale, 22 * scale, Math.PI, TAU);
    ctx.lineTo(x + 78 * scale, y + 25 * scale);
    ctx.lineTo(x - 20 * scale, y + 25 * scale);
    ctx.closePath();
    ctx.fill();
    fillRect(ctx, underside, x - 18 * scale, y + 20 * scale, 94 * scale, 7 * scale);
  }

  function paintSunsetFar(ctx, dark) {
    const body = dark ? "#4a2459" : "#fff4e8";
    const underside = dark ? "#3a1b49" : "#ffd9c6";
    cloud(ctx, 75, 85, 0.65, body, underside);
    cloud(ctx, 268, 218, 0.82, body, underside);
    cloud(ctx, 20, 405, 0.9, body, underside);
    cloud(ctx, 300, 565, 0.58, body, underside);
    cloud(ctx, 145, 680, 0.7, body, underside);
    if (dark) {
      ctx.fillStyle = "#ffd8ee";
      for (let i = 0; i < 32; i += 1) {
        const x = 34 + hash(i * 2 + 1) * 352;
        const y = 18 + hash(i * 2 + 2) * 720;
        const r = i % 7 === 0 ? 1.8 : 1;
        fillCircle(ctx, "#ffd8ee", x, y, r);
        if (i % 9 === 0) {
          ctx.strokeStyle = "#ffd8ee";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x - 3, y);
          ctx.lineTo(x + 3, y);
          ctx.moveTo(x, y - 3);
          ctx.lineTo(x, y + 3);
          ctx.stroke();
        }
      }
    } else {
      ctx.strokeStyle = "#a76763";
      ctx.lineWidth = 2;
      for (const bird of [[205, 350], [335, 105]]) {
        ctx.beginPath();
        ctx.moveTo(bird[0] - 8, bird[1] - 3);
        ctx.lineTo(bird[0], bird[1] + 2);
        ctx.lineTo(bird[0] + 8, bird[1] - 3);
        ctx.stroke();
      }
    }
  }

  function neonShape(ctx, color, draw) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha *= 0.25;
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    draw();
    ctx.stroke();
    ctx.globalAlpha /= 0.25;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    draw();
    ctx.stroke();
    ctx.restore();
  }

  function paintNeonFar(ctx, dark) {
    if (dark) {
      const towers = [[45, 535, 55, 225], [125, 595, 75, 165], [250, 500, 65, 260], [338, 560, 48, 200]];
      for (let t = 0; t < towers.length; t += 1) {
        const tower = towers[t];
        fillRect(ctx, "#0e1430", tower[0], tower[1], tower[2], tower[3]);
        for (let y = tower[1] + 16; y < 748; y += 22) {
          fillRect(ctx, (t + y / 22) % 2 ? "#14e0cc" : "#ff3fd2", tower[0] + 10, y, 9, 2);
        }
      }
      for (let i = 0; i < 20; i += 1) fillCircle(ctx, "#8ddff0", 28 + hash(i) * 364, 20 + hash(i + 50) * 450, 1);
    }
    const cyan = dark ? "#14e0cc" : "#7fd8ec";
    const pink = dark ? "#ff3fd2" : "#ff9fe0";
    neonShape(ctx, cyan, () => {
      ctx.beginPath();
      ctx.moveTo(72, 92); ctx.lineTo(105, 145); ctx.lineTo(39, 145); ctx.closePath();
    });
    neonShape(ctx, pink, () => {
      ctx.beginPath(); ctx.arc(328, 175, 28, 0, TAU);
    });
    neonShape(ctx, cyan, () => {
      ctx.beginPath(); ctx.moveTo(110, 360); ctx.lineTo(137, 338); ctx.lineTo(164, 376); ctx.lineTo(194, 350);
    });
    neonShape(ctx, pink, () => {
      ctx.beginPath(); ctx.moveTo(315, 390); ctx.lineTo(315, 430); ctx.moveTo(295, 410); ctx.lineTo(335, 410);
    });
    neonShape(ctx, cyan, () => {
      ctx.beginPath(); ctx.arc(92, 610, 22, 0, TAU);
    });
  }

  function paintRooftopFar(ctx, dark, tileH) {
    // Towers leave gaps of sky between them and stay close to the sky tone: they set the scene
    // behind the hoops without becoming a busy wall of windows.
    const towers = dark
      ? [[-20, 74, "#1f2748"], [92, 66, "#232c50"], [214, 58, "#1f2748"], [318, 84, "#232c50"]]
      : [[-20, 74, "#bfc8ef"], [92, 66, "#b6c0ea"], [214, 58, "#bfc8ef"], [318, 84, "#b6c0ea"]];
    for (let t = 0; t < towers.length; t += 1) {
      const tower = towers[t];
      fillRect(ctx, tower[2], tower[0], 0, tower[1], tileH);
      const setback = 22 + (t * 17) % 45;
      fillRect(ctx, tower[2], tower[0] + setback, 0, Math.min(28, tower[1] - setback), 26);
      fillRect(ctx, tower[2], tower[0] + tower[1] * 0.5 - 1, 0, 2, 18 + t * 5);
      for (let y = 36; y < tileH - 8; y += 20) {
        for (let x = tower[0] + 10; x < tower[0] + tower[1] - 9; x += 15) {
          let color;
          if (dark) color = hash(t * 10000 + y * 31 + x) < 0.1 ? "#d9b46e" : "#283057";
          else color = hash(t * 10000 + y * 31 + x) < 0.3 ? "#d3dbf8" : "#abb5e2";
          fillRect(ctx, color, x, y, 7, 10);
        }
      }
    }
  }

  function paintMinimalFar(ctx, dark, x0, x1, tileH) {
    const dot = dark ? "#2a2a2e" : "#e2dcd2";
    for (let y = 12; y < tileH; y += 24) {
      for (let x = Math.floor(x0 / 24) * 24 + 12; x < x1; x += 24) fillCircle(ctx, dot, x, y, 1.5);
    }
    ctx.strokeStyle = dark ? "#222226" : "#e9e3d9";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0 + 20, 185); ctx.lineTo(x1 - 40, 85);
    ctx.moveTo(x0 + 80, 505); ctx.lineTo(x1 - 15, 395);
    ctx.moveTo(x0 + 5, 705); ctx.lineTo(x1 - 130, 625);
    ctx.stroke();
  }

  function paintFar(ctx, themeId, dark, x0, x1, tileH) {
    const id = themeKey(themeId);
    ctx.save();
    if (id === "gym") paintGymFar(ctx, dark);
    else if (id === "sunset") paintSunsetFar(ctx, dark);
    else if (id === "neon") paintNeonFar(ctx, dark);
    else if (id === "rooftop") paintRooftopFar(ctx, dark, tileH);
    else paintMinimalFar(ctx, dark, x0, x1, tileH);
    ctx.restore();
  }

  function wallBounds(side, x0, x1) {
    return side === "right"
      ? { outer: x1, face: WORLD_W - WALL_X, direction: 1 }
      : { outer: x0, face: WALL_X, direction: -1 };
  }

  function paintGymWall(ctx, art, dark, side, x0, x1, tileH) {
    const bounds = wallBounds(side, x0, x1);
    const bodyX = side === "right" ? bounds.face : bounds.outer;
    const bodyW = side === "right" ? bounds.outer - bounds.face : bounds.face - bounds.outer;
    fillRect(ctx, dark ? "#1a3060" : "#1c2f5a", bodyX, 0, bodyW, tileH);
    for (let y = 0; y < tileH; y += 120) {
      fillRect(ctx, art.wall, bodyX, y, bodyW, 114);
      fillRect(ctx, art.wallLight, bodyX, y, bodyW, 7);
      fillRect(ctx, art.wallShade, bodyX, y + 102, bodyW, 12);
      const shadeX = side === "left" ? bounds.outer : bounds.outer - 7;
      fillRect(ctx, art.wallShade, shadeX, y, 7, 114);
      ctx.save();
      ctx.globalAlpha *= 0.55;
      ctx.strokeStyle = "#f3e9d7";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(bodyX + 5, y + 5, Math.max(0, bodyW - 10), 104);
      ctx.restore();
    }
    const trim = dark ? "#f25543" : "#e8452f";
    const trimX = side === "right" ? bounds.face : bounds.face - 6;
    fillRect(ctx, trim, trimX, 0, 6, tileH);
    fillRect(ctx, "#ffa184", side === "right" ? bounds.face + 1 : bounds.face - 6, 0, 1.5, tileH);
  }

  function paintSunsetWall(ctx, art, side, x0, x1, tileH) {
    const bounds = wallBounds(side, x0, x1);
    const trunkOuter = side === "right" ? bounds.face + 20 : bounds.face - 20;
    const left = Math.min(bounds.face, trunkOuter);
    fillRect(ctx, art.wallShade, left, 0, 20, tileH);
    for (let y = 0; y < tileH; y += 24) {
      ctx.fillStyle = art.wall;
      ctx.beginPath();
      if (side === "left") {
        ctx.moveTo(bounds.face - 20, y); ctx.lineTo(bounds.face, y + 5); ctx.lineTo(bounds.face, y + 24); ctx.lineTo(bounds.face - 20, y + 19);
      } else {
        ctx.moveTo(bounds.face + 20, y); ctx.lineTo(bounds.face, y + 5); ctx.lineTo(bounds.face, y + 24); ctx.lineTo(bounds.face + 20, y + 19);
      }
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = art.ink; ctx.lineWidth = 1.3; ctx.stroke();
      ctx.strokeStyle = art.wallLight; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(left + 2, y + 3); ctx.lineTo(left + 18, y + 7); ctx.stroke();
    }
  }

  function tubeSegment(ctx, x, y0, y1, color, alpha) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.globalAlpha *= alpha;
    ctx.strokeStyle = color; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
    ctx.restore();
    ctx.lineCap = "round";
    ctx.strokeStyle = color; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
    ctx.strokeStyle = "#f4ffff"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
  }

  function paintNeonWall(ctx, art, dark, side, x0, x1, tileH) {
    const bounds = wallBounds(side, x0, x1);
    const bodyX = side === "right" ? bounds.face : bounds.outer;
    const bodyW = side === "right" ? bounds.outer - bounds.face : bounds.face - bounds.outer;
    fillRect(ctx, art.wall, bodyX, 0, bodyW, tileH);
    const tubeX = bounds.face + bounds.direction * 9;
    tubeSegment(ctx, tubeX, 7, 173, dark ? "#14e0cc" : "#13a9f0", dark ? 0.35 : 0.5);
    tubeSegment(ctx, tubeX, 187, 353, dark ? "#ff3fd2" : "#ff4fd8", dark ? 0.35 : 0.5);
    for (let y = 45; y < tileH; y += 90) {
      const bracketX = side === "right" ? bounds.face + 3 : bounds.face - 15;
      fillRect(ctx, art.wallShade, bracketX, y - 4, 12, 8);
      fillCircle(ctx, art.wallLight, side === "right" ? bracketX + 9 : bracketX + 3, y, 1.4);
    }
  }

  function paintRooftopWall(ctx, art, dark, side, x0, x1, tileH) {
    const bounds = wallBounds(side, x0, x1);
    const mesh = dark ? "#5a6273" : "#8d95a3";
    ctx.strokeStyle = mesh;
    ctx.lineWidth = 1.5;
    // Diamond mesh: two families of 45° lines on a 12-unit world grid, clipped analytically
    // to the wall strip so nothing is drawn inside the play column and the tile stays seamless.
    const left = side === "right" ? bounds.face : bounds.outer;
    const right = side === "right" ? bounds.outer : bounds.face - 3;
    ctx.beginPath();
    for (let c = Math.floor((left - tileH) / 12) * 12; c <= right + tileH; c += 12) {
      const riseStart = Math.max(left, c);
      const riseEnd = Math.min(right, c + tileH);
      if (riseEnd > riseStart) {
        ctx.moveTo(riseStart, riseStart - c);
        ctx.lineTo(riseEnd, riseEnd - c);
      }
      const fallStart = Math.max(left, c - tileH);
      const fallEnd = Math.min(right, c);
      if (fallEnd > fallStart) {
        ctx.moveTo(fallStart, c - fallStart);
        ctx.lineTo(fallEnd, c - fallEnd);
      }
    }
    ctx.stroke();
    const postX = side === "right" ? bounds.face : bounds.face - 6;
    fillRect(ctx, art.ink, postX, 0, 6, tileH);
    fillRect(ctx, art.wall, side === "right" ? bounds.face + 1.5 : bounds.face - 5, 0, 4.5, tileH);
    fillRect(ctx, art.wallLight, side === "right" ? bounds.face + 1.5 : bounds.face - 4.5, 0, 1.3, tileH);
    for (let y = 0; y < tileH; y += 180) {
      const railX = side === "right" ? bounds.face : bounds.outer;
      const railW = side === "right" ? bounds.outer - bounds.face : bounds.face - bounds.outer;
      fillRect(ctx, art.ink, railX, y, railW, 7);
      fillRect(ctx, art.wall, railX, y + 1, railW, 5);
      fillRect(ctx, art.wallLight, railX, y + 1, railW, 1.2);
    }
  }

  function paintMinimalWall(ctx, art, dark, side, x0, x1, tileH) {
    const bounds = wallBounds(side, x0, x1);
    const bodyX = side === "right" ? bounds.face : bounds.outer;
    const bodyW = side === "right" ? bounds.outer - bounds.face : bounds.face - bounds.outer;
    fillRect(ctx, art.wall, bodyX, 0, bodyW, tileH);
    ctx.strokeStyle = dark ? "#a29c93" : "#3e3a3a";
    for (let y = 0; y < tileH; y += 12) {
      const major = y % 60 === 0;
      const length = major ? 12 : 6;
      ctx.lineWidth = major ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.moveTo(bounds.face, y);
      ctx.lineTo(bounds.face + bounds.direction * length, y);
      ctx.stroke();
    }
  }

  function paintWall(ctx, themeId, dark, side, x0, x1, tileH) {
    const id = themeKey(themeId);
    const normalizedSide = side === "right" ? "right" : "left";
    const art = getPalette(id, dark);
    ctx.save();
    if (id === "gym") paintGymWall(ctx, art, dark, normalizedSide, x0, x1, tileH);
    else if (id === "sunset") paintSunsetWall(ctx, art, normalizedSide, x0, x1, tileH);
    else if (id === "neon") paintNeonWall(ctx, art, dark, normalizedSide, x0, x1, tileH);
    else if (id === "rooftop") paintRooftopWall(ctx, art, dark, normalizedSide, x0, x1, tileH);
    else paintMinimalWall(ctx, art, dark, normalizedSide, x0, x1, tileH);
    const face = normalizedSide === "right" ? WORLD_W - WALL_X : WALL_X;
    ctx.strokeStyle = art.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(face, 0);
    ctx.lineTo(face, tileH);
    ctx.stroke();
    ctx.restore();
  }

  global.HoopFlickThemeArt = Object.freeze({
    THEME_IDS, WALL_X, WORLD_W, FAR_TILE_H, WALL_TILE_H,
    getParallax, getPalette, paintSky, paintFar, paintWall
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
