import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(here, '..', 'obstacles.js'), 'utf8');

function loadObstacles() {
  const sandbox = vm.createContext({});
  vm.runInContext(source, sandbox);
  return sandbox.HoopFlickObstacles;
}

function capsuleDistance(x, y, pose, thickness = 0) {
  const dx = pose.bx - pose.ax;
  const dy = pose.by - pose.ay;
  const lengthSquared = dx * dx + dy * dy;
  const amount = lengthSquared > 0 ? Math.max(0, Math.min(1, ((x - pose.ax) * dx + (y - pose.ay) * dy) / lengthSquared)) : 0;
  return Math.hypot(x - pose.ax - dx * amount, y - pose.ay - dy * amount) - thickness;
}

function createRecordingContext(alpha = 0.8) {
  const state = { globalAlpha: alpha, lineDash: [] };
  const stack = [];
  const forbidden = [];
  const alphaWrites = [];
  const calls = [];
  let depth = 0;
  const methods = {
    save() { stack.push({ ...state, lineDash: state.lineDash.slice() }); depth += 1; },
    restore() { assert.ok(depth > 0, 'restore needs a matching save'); Object.assign(state, stack.pop()); depth -= 1; },
    setLineDash(dash) { state.lineDash = dash.slice(); },
    createLinearGradient() { forbidden.push('linear'); },
    createRadialGradient() { forbidden.push('radial'); },
    createPattern() { forbidden.push('pattern'); }
  };
  return new Proxy(methods, {
    get(target, key) {
      if (key === '__depth') return depth;
      if (key === '__forbidden') return forbidden;
      if (key === '__alphaWrites') return alphaWrites;
      if (key === '__calls') return calls;
      if (key in state) return state[key];
      if (key in target) return target[key];
      return (...args) => { calls.push([key, ...args]); };
    },
    set(target, key, value) {
      if (key === 'shadowBlur' || key === 'filter') forbidden.push(key);
      if (key === 'globalAlpha') alphaWrites.push(value);
      calls.push(['set', key, value]);
      state[key] = value;
      return true;
    }
  });
}

test('module surface is frozen, exact and free of forbidden drawing features', () => {
  const Obstacles = loadObstacles();
  assert.ok(Object.isFrozen(Obstacles));
  assert.ok(Object.isFrozen(Obstacles.KINDS));
  assert.deepEqual(Array.from(Obstacles.KINDS), ['bar', 'peg', 'slider', 'spinner', 'pad', 'blinker']);
  for (const token of ['Math.random', 'createLinearGradient', 'createRadialGradient', 'createPattern', 'shadowBlur', 'filter']) {
    assert.equal(source.includes(token), false, `source must not contain ${token}`);
  }
});

test('create applies kind defaults, clamps values and rejects invalid specs', () => {
  const { create } = loadObstacles();
  const bar = create({ kind: 'bar', x: 10, y: 20, length: 500, radius: 1, restitution: 9 });
  assert.ok(Object.isFrozen(bar));
  assert.deepEqual(JSON.parse(JSON.stringify(bar)), { kind: 'bar', x: 10, y: 20, length: 110, angle: 0, radius: 3, restitution: 1.2 });
  assert.deepEqual(JSON.parse(JSON.stringify(create({ kind: 'peg', x: 1, y: 2, length: 80, radius: 99 }))), { kind: 'peg', x: 1, y: 2, length: 0, angle: 0, radius: 16, restitution: 0.9 });
  assert.deepEqual(JSON.parse(JSON.stringify(create({ kind: 'slider', x: 1, y: 2, length: 1, amplitude: 999, speed: -2 }))), {
    kind: 'slider', x: 1, y: 2, length: 24, angle: 0, radius: 5, restitution: 0.62,
    axisAngle: 0, amplitude: 90, speed: 0, phase: 0
  });
  assert.deepEqual(JSON.parse(JSON.stringify(create({ kind: 'spinner', x: 1, y: 2, length: 1, speed: -99 }))), {
    kind: 'spinner', x: 1, y: 2, length: 30, angle: 0, radius: 5, restitution: 0.7, speed: -4
  });
  assert.equal(create({ kind: 'other', x: 0, y: 0 }), null);
  assert.equal(create({ kind: 'bar', x: Infinity, y: 0 }), null);
  assert.equal(create({ kind: 'bar', x: 0, y: NaN }), null);
});

test('getPose is deterministic and reports exact motion derivatives', () => {
  const Obstacles = loadObstacles();
  const slider = Obstacles.create({ kind: 'slider', x: 120, y: 230, length: 70, angle: 0.3, axisAngle: 0.8, amplitude: 55, speed: 2.1, phase: 0.4 });
  const time = 1.234;
  const first = Obstacles.getPose(slider, time);
  const second = Obstacles.getPose(slider, time);
  for (const key of Object.keys(first)) assert.ok(Object.is(first[key], second[key]), `${key} is bit-identical`);
  const h = 1e-5;
  const before = Obstacles.getPose(slider, time - h);
  const after = Obstacles.getPose(slider, time + h);
  assert.ok(Math.abs(first.vx - (after.x - before.x) / (2 * h)) <= Math.max(1, Math.abs(first.vx)) * 1e-6);
  assert.ok(Math.abs(first.vy - (after.y - before.y) / (2 * h)) <= Math.max(1, Math.abs(first.vy)) * 1e-6);
  const spinner = Obstacles.create({ kind: 'spinner', x: 0, y: 0, angle: -0.2, speed: -2.5 });
  const spinPose = Obstacles.getPose(spinner, 1.4);
  assert.equal(spinPose.angle, -0.2 - 2.5 * 1.4);
  assert.equal(spinPose.omega, -2.5);
});

test('collideBody resolves impacts, resting contacts, bumpers and moving surfaces', () => {
  const Obstacles = loadObstacles();
  const bar = Obstacles.create({ kind: 'bar', x: 100, y: 100, length: 80, radius: 5 });
  const body = Object.freeze({ x: 100, y: 115, vx: 0, vy: -600 });
  const result = Obstacles.collideBody(body, 12.95, bar, 0, 1 / 120);
  assert.deepEqual(body, { x: 100, y: 115, vx: 0, vy: -600 });
  assert.ok(result);
  assert.ok(Math.abs(result.vy - 600 * 0.62) < 1e-9);
  assert.ok(Math.abs(capsuleDistance(result.x, result.y, Obstacles.getPose(bar, 0)) - 17.95) < 1e-9);
  assert.equal(result.impact, true);

  const resting = Obstacles.collideBody({ x: 100, y: 116, vx: 40, vy: -10 }, 12.95, bar, 0, 1 / 120);
  assert.equal(resting.approachSpeed, 10);
  assert.equal(resting.impact, false);
  assert.equal(resting.kick, false);

  const peg = Obstacles.create({ kind: 'peg', x: 100, y: 100 });
  const bumper = Obstacles.collideBody({ x: 100, y: 120, vx: 0, vy: -100 }, 12.95, peg, 0, 1 / 120);
  assert.ok(bumper.vy >= 220);
  assert.equal(bumper.kick, true);

  const slider = Obstacles.create({ kind: 'slider', x: 200, y: 200, length: 60, angle: Math.PI / 2, axisAngle: 0, amplitude: 40, speed: 2, phase: 0 });
  const pose = Obstacles.getPose(slider, 0);
  assert.ok(pose.vx > 0);
  const pushed = Obstacles.collideBody({ x: pose.x + 15, y: pose.y, vx: 0, vy: 0 }, 12.95, slider, 0, 1 / 120);
  assert.ok(pushed.vx > 0, 'the slider transfers velocity in its travel direction');
});

test('a 1300 unit-per-second ball cannot tunnel through the thinnest bar', () => {
  const Obstacles = loadObstacles();
  const bar = Obstacles.create({ kind: 'bar', x: 100, y: 100, length: 100, radius: 3, restitution: 0.62 });
  const dt = 1 / 120;
  let body = { x: 100, y: 60, vx: 0, vy: 1300 };
  for (let step = 0; step < 12; step += 1) {
    body = { ...body, x: body.x + body.vx * dt, y: body.y + body.vy * dt };
    const collision = Obstacles.collideBody(body, 12.95, bar, step * dt, dt);
    if (collision) body = collision;
    assert.ok(body.y < bar.y, `step ${step} stays on the near side`);
  }
  assert.ok(body.vy < 0, 'the ball reflected instead of crossing');
});

test('sweptClearance is exact for static shapes and conservative for moving shapes', () => {
  const Obstacles = loadObstacles();
  const bar = Obstacles.create({ kind: 'bar', x: 140, y: 180, length: 75, angle: 0.6, radius: 4 });
  const peg = Obstacles.create({ kind: 'peg', x: 180, y: 210, radius: 11 });
  const pad = Obstacles.create({ kind: 'pad', x: 70, y: 140, angle: 0.4 });
  const blinker = Obstacles.create({ kind: 'blinker', x: 90, y: 160, angle: -0.4 });
  for (const obstacle of [bar, peg, pad, blinker]) {
    const pose = Obstacles.getPose(obstacle, 0);
    for (const point of [{ x: 0, y: 0 }, { x: 150, y: 190 }, { x: 300, y: 500 }]) {
      assert.ok(Math.abs(Obstacles.sweptClearance(point.x, point.y, obstacle) - capsuleDistance(point.x, point.y, pose, obstacle.radius)) < 1e-10);
    }
  }

  const slider = Obstacles.create({ kind: 'slider', x: 180, y: 260, length: 80, angle: 0.35, axisAngle: 1.2, amplitude: 65, speed: 1.7, phase: 0.3, radius: 6 });
  const spinner = Obstacles.create({ kind: 'spinner', x: 230, y: 350, length: 90, angle: -0.4, speed: -2.2, radius: 7 });
  let seed = 0x51f15e;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
  for (const obstacle of [slider, spinner]) {
    const period = Math.PI * 2 / Math.abs(obstacle.speed);
    for (let pointIndex = 0; pointIndex < 400; pointIndex += 1) {
      const x = obstacle.x + (random() * 2 - 1) * 170;
      const y = obstacle.y + (random() * 2 - 1) * 170;
      let sampled = Infinity;
      for (let sample = 0; sample < 720; sample += 1) {
        const pose = Obstacles.getPose(obstacle, period * 2 * sample / 719);
        sampled = Math.min(sampled, capsuleDistance(x, y, pose, obstacle.radius));
      }
      assert.ok(Obstacles.sweptClearance(x, y, obstacle) <= sampled + 1e-9, `${obstacle.kind} clearance is conservative`);
    }
  }
});

test('draw balances canvas state, avoids forbidden calls and respects alpha', () => {
  const Obstacles = loadObstacles();
  const palette = { ink: '#2b1c1a', body: '#5b6b86', shade: '#3d4a60', light: '#9fb0c9', accent: '#f2a93b', rail: '#263044' };
  for (const kind of Obstacles.KINDS) {
    const ctx = createRecordingContext();
    const obstacle = Obstacles.create({ kind, x: 100, y: 100, amplitude: 40, speed: 1.5 });
    Obstacles.draw(ctx, obstacle, 0.7, palette, { alpha: 0.45, flash: 0.8, squash: 0.9, darkBackground: true });
    assert.equal(ctx.__depth, 0, `${kind} balances save and restore`);
    assert.deepEqual(ctx.__forbidden, [], `${kind} avoids forbidden canvas features`);
    assert.ok(ctx.__alphaWrites.length > 0);
    assert.equal(ctx.__alphaWrites[0], 0.8 * 0.45, `${kind} multiplies caller alpha`);
    assert.ok(ctx.__alphaWrites.every((value) => value <= 0.8 * 0.45), `${kind} alpha writes do not exceed the multiplied option`);
    assert.equal(ctx.globalAlpha, 0.8, `${kind} restores the caller alpha`);
    assert.deepEqual(ctx.lineDash, [], `${kind} leaves no dash behind`);
  }
});

test('getBounds contains every sampled pose including capsule thickness', () => {
  const Obstacles = loadObstacles();
  const obstacles = [
    Obstacles.create({ kind: 'bar', x: 100, y: 140, length: 90, angle: 0.7, radius: 8 }),
    Obstacles.create({ kind: 'peg', x: 180, y: 200, radius: 15 }),
    Obstacles.create({ kind: 'slider', x: 220, y: 280, length: 70, angle: -0.2, axisAngle: 1.1, amplitude: 80, speed: 2.3, radius: 4 }),
    Obstacles.create({ kind: 'spinner', x: 250, y: 380, length: 95, speed: -3.1, radius: 6 }),
    Obstacles.create({ kind: 'pad', x: 120, y: 180, length: 90, angle: 1.1 }),
    Obstacles.create({ kind: 'blinker', x: 170, y: 220, length: 100, angle: -0.8 })
  ];
  for (const obstacle of obstacles) {
    const bounds = Obstacles.getBounds(obstacle);
    const period = obstacle.speed ? Math.PI * 2 / Math.abs(obstacle.speed) : 1;
    for (let sample = 0; sample < 720; sample += 1) {
      const pose = Obstacles.getPose(obstacle, period * sample / 719);
      for (const point of [{ x: pose.ax, y: pose.ay }, { x: pose.bx, y: pose.by }]) {
        assert.ok(point.x - obstacle.radius >= bounds.minX - 1e-9);
        assert.ok(point.x + obstacle.radius <= bounds.maxX + 1e-9);
        assert.ok(point.y - obstacle.radius >= bounds.minY - 1e-9);
        assert.ok(point.y + obstacle.radius <= bounds.maxY + 1e-9);
      }
    }
  }
});

test('pad and blinker defaults, limits and invalid input fallbacks', () => {
  const { create } = loadObstacles();
  const plain = (value) => JSON.parse(JSON.stringify(value));
  assert.deepEqual(plain(create({ kind: 'pad', x: 0, y: 0 })), {
    kind: 'pad', x: 0, y: 0, length: 56, radius: 5, angle: 0, restitution: 1
  });
  assert.deepEqual(plain(create({ kind: 'blinker', x: 0, y: 0 })), {
    kind: 'blinker', x: 0, y: 0, length: 60, radius: 5, angle: 0, restitution: 0.62,
    period: 2.4, onShare: 0.5, phase: 0
  });
  for (const [kind, min, max] of [['pad', 36, 90], ['blinker', 30, 100]]) {
    assert.equal(create({ kind, x: 0, y: 0, length: -10 }).length, min);
    assert.equal(create({ kind, x: 0, y: 0, length: 999 }).length, max);
    assert.equal(create({ kind, x: 0, y: 0, radius: 999 }).radius, 5);
    assert.equal(create({ kind, x: NaN, y: 0 }), null);
    assert.equal(create({ kind, x: 0, y: Infinity }), null);
  }
  const low = create({ kind: 'blinker', x: 0, y: 0, period: -1, onShare: -1, phase: -3 });
  assert.equal(low.period, 1.2);
  assert.equal(low.onShare, 0.3);
  assert.equal(low.phase, -3);
  const high = create({ kind: 'blinker', x: 0, y: 0, period: 99, onShare: 99 });
  assert.equal(high.period, 4);
  assert.equal(high.onShare, 0.7);
  const fallback = create({ kind: 'blinker', x: 0, y: 0, period: NaN, onShare: Infinity, phase: NaN });
  assert.equal(fallback.period, 2.4);
  assert.equal(fallback.onShare, 0.5);
  assert.equal(fallback.phase, 0);
});

test('pads boost impacts along the contact normal and keep resting contacts passive', () => {
  const { create, collideBody, getPose } = loadObstacles();
  for (const angle of [0, 0.7, Math.PI / 2]) {
    const pad = create({ kind: 'pad', x: 100, y: 100, angle });
    const nx = -Math.sin(angle), ny = Math.cos(angle);
    for (const speed of [41, 150, 600]) {
      const body = Object.freeze({ x: 100 + nx * 10, y: 100 + ny * 10, vx: -nx * speed, vy: -ny * speed });
      const result = collideBody(body, 10, pad, 2, 1 / 120);
      assert.equal(result.kick, true);
      assert.equal(result.impact, true);
      assert.ok(Math.abs(result.vx * nx + result.vy * ny - Math.max(300, speed)) < 1e-8);
      assert.deepEqual(result, collideBody(body, 10, pad, 2, 1 / 120));
      assert.ok(Math.abs(capsuleDistance(result.x, result.y, getPose(pad, 2)) - 15) < 1e-8);
    }
  }
  const pad = create({ kind: 'pad', x: 100, y: 100, restitution: 1.2 });
  for (const speed of [0, 10, 40]) {
    const result = collideBody({ x: 100, y: 86, vx: 0, vy: speed }, 10, pad, 0, 1 / 120);
    assert.equal(result.kick, false);
    assert.equal(result.impact, false);
    assert.ok(Math.hypot(result.vx, result.vy) <= speed);
  }
  let body = { x: 100, y: 85, vx: 0, vy: 0 };
  for (let step = 0; step < 1200; step++) {
    const vy = body.vy + 1000 / 120;
    body = { ...body, vy, y: body.y + vy / 120 };
    body = collideBody(body, 10, pad, step / 120, 1 / 120) || body;
    assert.ok(body.y >= 85 - 1e-9, 'resting ball never climbs above its starting height');
    assert.ok(Math.abs(body.vy) < 10);
  }
});

test('a ball hopping on a flat pad never gains height', () => {
  const { create, collideBody } = loadObstacles();
  for (const restitution of [1, 1.2]) {
    const pad = create({ kind: 'pad', x: 0, y: 0, length: 56, angle: 0, restitution });
    let body = { x: 0, y: -60, vx: 0, vy: 0 };
    let top = 0;
    const peaks = [];
    for (let step = 0; step < 120 * 8; step++) {
      body = { ...body, vy: body.vy + 1420 / 120 };
      body = { ...body, y: body.y + body.vy / 120 };
      top = Math.min(top, body.y);
      const contact = collideBody(body, 12.95, pad, step / 120, 1 / 120);
      if (contact && contact.impact) { peaks.push(-top); top = 0; }
      if (contact) body = { ...body, x: contact.x, y: contact.y, vx: contact.vx, vy: contact.vy };
    }
    assert.ok(peaks.length > 3, 'it keeps hopping');
    for (let i = 1; i < peaks.length; i++) assert.ok(peaks[i] <= peaks[0] + 1, `hop ${i} (${peaks[i].toFixed(1)}) no higher than the first (${peaks[0].toFixed(1)})`);
  }
});

test('blinker cycle boundaries, phase offsets and solidity are deterministic', () => {
  const { create, getPose, isSolid, collideBody, getBounds, sweptClearance } = loadObstacles();
  for (const phase of [0, 0.25, -0.25]) {
    const blink = create({ kind: 'blinker', x: 0, y: 0, period: 2, onShare: 0.5, phase });
    for (const [elapsed, solid, charge] of [[-2, true, 0], [-1, false, 0], [-0.5, false, 0.5], [0, true, 0], [0.5, true, 0.5], [1, false, 0], [1.5, false, 0.5], [2, true, 0]]) {
      const time = elapsed - phase;
      assert.equal(isSolid(blink, time), solid);
      assert.equal(getPose(blink, time).solid, solid);
      assert.equal(getPose(blink, time).charge, charge);
    }
    assert.equal(isSolid(blink, 1 - phase - 1e-9), true);
    assert.equal(isSolid(blink, 2 - phase - 1e-9), false);
    const body = Object.freeze({ x: 0, y: 10, vx: 15, vy: -200 });
    const bar = create({ kind: 'bar', x: 0, y: 0 });
    assert.equal(collideBody(body, 10, blink, 1.5 - phase, 1 / 120), null);
    assert.deepEqual(collideBody(body, 10, blink, -phase, 1 / 120), collideBody(body, 10, bar, 0, 1 / 120));
    assert.deepEqual(getBounds(blink), getBounds(bar));
    assert.equal(sweptClearance(10, 20, blink), sweptClearance(10, 20, bar));
  }
  for (const kind of ['bar', 'peg', 'slider', 'spinner', 'pad']) {
    const obstacle = create({ kind, x: 0, y: 0 });
    assert.equal(isSolid(obstacle, 123), true);
    assert.equal(getPose(obstacle, 123).solid, true);
    assert.equal(getPose(obstacle, 123).charge, 0);
  }
  for (const onShare of [0.3, 0.7]) {
    const obstacle = create({ kind: 'blinker', x: 0, y: 0, period: 4, onShare });
    const boundary = 4 * onShare;
    assert.equal(isSolid(obstacle, boundary - 1e-9), true);
    assert.equal(isSolid(obstacle, boundary), false);
    assert.equal(getPose(obstacle, boundary).charge, 0);
    assert.equal(isSolid(obstacle, 4), true);
    assert.equal(getPose(obstacle, 4).charge, 0);
  }
});

test('new art preserves canvas state in both themes and telegraphs phase and squash', () => {
  const { create, draw } = loadObstacles();
  const palette = { ink: '#201e30', body: '#657085', shade: '#364050', light: '#bacadd', accent: '#ed5577', rail: 'rgba(80,90,100,0.4)' };
  const render = (kind, time, squash, darkBackground, flash = 0) => {
    const ctx = createRecordingContext(0.6);
    draw(ctx, create({ kind, x: 20, y: 30 }), time, palette, { alpha: 0.5, squash, darkBackground, flash });
    assert.equal(ctx.__depth, 0);
    assert.equal(ctx.globalAlpha, 0.6);
    assert.deepEqual(ctx.lineDash, []);
    assert.deepEqual(ctx.__forbidden, []);
    assert.ok(ctx.__alphaWrites.every((value) => value <= 0.3));
    return ctx;
  };
  for (const dark of [false, true]) {
    const ghost = render('blinker', 1.3, 0, dark);
    assert.equal(ghost.__calls.some(([name]) => name === 'fill'), false, 'ghost is outline only');
    assert.notDeepEqual(ghost.__alphaWrites, render('blinker', 2.3, 0, dark).__alphaWrites, 'off-phase telegraphs switch');
    assert.notDeepEqual(render('blinker', 0, 0, dark).__calls, render('blinker', 1.1, 0, dark).__calls, 'solid surface drains');
    assert.notDeepEqual(render('pad', 0, 0, dark).__calls, render('pad', 0, 1, dark).__calls, 'band visibly dips');
    for (const kind of ['bar', 'peg', 'slider', 'spinner', 'pad', 'blinker']) {
      assert.notDeepEqual(render(kind, 0, 0, dark).__calls, render(kind, 0, 0, dark, 1).__calls, `${kind} flashes`);
    }
  }
});
