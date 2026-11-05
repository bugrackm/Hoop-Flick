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
      if (key in state) return state[key];
      if (key in target) return target[key];
      return () => {};
    },
    set(target, key, value) {
      if (key === 'shadowBlur' || key === 'filter') forbidden.push(key);
      if (key === 'globalAlpha') alphaWrites.push(value);
      state[key] = value;
      return true;
    }
  });
}

test('module surface is frozen, exact and free of forbidden drawing features', () => {
  const Obstacles = loadObstacles();
  assert.ok(Object.isFrozen(Obstacles));
  assert.ok(Object.isFrozen(Obstacles.KINDS));
  assert.deepEqual(Array.from(Obstacles.KINDS), ['bar', 'peg', 'slider', 'spinner']);
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
  for (const obstacle of [bar, peg]) {
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
    assert.ok(ctx.__alphaWrites.every((value) => value <= 0.45), `${kind} alpha writes do not exceed the option`);
    assert.equal(ctx.globalAlpha, 0.8, `${kind} restores the caller alpha`);
  }
});

test('getBounds contains every sampled pose including capsule thickness', () => {
  const Obstacles = loadObstacles();
  const obstacles = [
    Obstacles.create({ kind: 'bar', x: 100, y: 140, length: 90, angle: 0.7, radius: 8 }),
    Obstacles.create({ kind: 'peg', x: 180, y: 200, radius: 15 }),
    Obstacles.create({ kind: 'slider', x: 220, y: 280, length: 70, angle: -0.2, axisAngle: 1.1, amplitude: 80, speed: 2.3, radius: 4 }),
    Obstacles.create({ kind: 'spinner', x: 250, y: 380, length: 95, speed: -3.1, radius: 6 })
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
