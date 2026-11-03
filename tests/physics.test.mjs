import test from 'node:test';
import assert from 'node:assert/strict';
import { loadPhysics, loadGame } from './helpers/game-harness.mjs';

const physics = loadPhysics();
const game = loadGame();
const params = game.evaluate('FLIGHT_PARAMS');
const dotSteps = game.evaluate('TRAJECTORY_DOT_STEPS');
const dt = physics.FIXED_DT;

function pull(x, y) {
  return game.evaluate(`drag = { pointerStartX: 0, pointerStartY: 0, pointerCurrentX: ${-x}, pointerCurrentY: ${-y} }; getPullVector()`);
}

function launch(x, y) {
  return physics.getLaunchVelocity(pull(x, y), params);
}

function seededRandom() {
  let seed = 0x12345678;
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
}

test('physics loads without DOM, is frozen, and never mutates flight inputs', () => {
  assert.ok(Object.isFrozen(physics));
  assert.equal(dt, 1 / 120);
  const body = Object.freeze({ x: 210, y: 500, vx: 320, vy: -900 });
  const config = Object.freeze({ ...params });
  const next = physics.stepBallFlight(body, config, dt);
  assert.equal(next.vx, body.vx * Math.pow(params.airDrag, dt * 60));
  assert.equal(next.vy, (body.vy + params.gravity * dt) * Math.pow(params.airDrag, dt * 60));
  assert.equal(next.x, body.x + next.vx * dt);
  assert.equal(next.y, body.y + next.vy * dt);
  assert.notEqual(next, body);
});

for (const [name, x, y, startX, bounces] of [
  ['straight', 0, -90, 210, false],
  ['maximum power', 0, -140, 210, false],
  ['right wall bounce', 110, -90, 300, true],
  ['left wall bounce', -110, -90, 120, true]
]) {
  test(`preview === real fixed-step flight: ${name}`, () => {
    const p = pull(x, y);
    const velocity = physics.getLaunchVelocity(p, params);
    const start = Object.freeze({ x: startX, y: 590 });
    const prediction = physics.predictTrajectory(start, velocity, params, {
      dotSteps, pointCount: Math.round(7 + p.ratio * 6), maxPoints: 15
    });
    let body = { ...start, ...velocity };
    const actualBounces = [];
    for (let step = 1; step <= prediction.points.at(-1).step; step++) {
      body = physics.stepBallFlight(body, params, dt);
      if (body.wallHit) actualBounces.push(step);
      const point = prediction.points.find(point => point.step === step);
      if (point) {
        assert.equal(point.x, body.x);
        assert.equal(point.y, body.y);
        assert.equal(point.step % dotSteps, 0);
      }
    }
    assert.equal(prediction.wallBounces.length > 0, bounces);
    assert.deepEqual(Array.from(prediction.wallBounces, b => b.step), actualBounces);
  });
}

test('late wall bounce extends once, to at most 15 points', () => {
  const prediction = physics.predictTrajectory({ x: 210, y: 500 }, { vx: 350, vy: -500 }, params, {
    dotSteps, pointCount: 13, maxPoints: 15
  });
  assert.equal(prediction.points.length, 15);
  assert.equal(prediction.wallBounces.length, 1);
});

test('reachability can explicitly disable wall reflection', () => {
  const body = { x: 43, y: 500, vx: -500, vy: -800 };
  const bounced = physics.stepBallFlight(body, params, dt);
  const free = physics.stepBallFlight(body, { ...params, walls: false }, dt);
  assert.equal(bounced.wallHit, true);
  assert.equal(bounced.x, params.wallInset + params.ballRadius);
  assert.equal(bounced.vx, Math.abs(free.vx) * params.wallRestitution);
  assert.equal(free.wallHit, false);
  assert.ok(free.x < bounced.x);
});

test('30/60/120/144 Hz, 20 Hz and seeded jitter produce bit-identical step histories', () => {
  const random = seededRandom();
  const jitter = [];
  let remaining = 2;
  while (remaining > 0) {
    const frame = Math.min(remaining, 1 / 180 + random() * 0.05);
    jitter.push(frame);
    remaining -= frame;
  }
  const sequences = [30, 60, 120, 144, 20].map(hz => Array(hz * 2).fill(1 / hz));
  sequences.push(jitter);
  let reference;
  for (const frames of sequences) {
    let accumulator = 0;
    let body = { x: 210, y: 590, ...launch(80, -110) };
    const history = [];
    for (const frame of frames) {
      const result = physics.advanceFixedSteps(accumulator, frame, 0.1, stepDt => {
        assert.equal(stepDt, dt);
        body = physics.stepBallFlight(body, params, stepDt);
        history.push([body.x, body.y, body.vx, body.vy]);
      });
      accumulator = result.accumulator;
      assert.ok(result.alpha >= 0 && result.alpha < 1);
    }
    assert.equal(history.length, 240);
    if (!reference) reference = history;
    else assert.deepEqual(history, reference);
  }
});

test('maximum launch displacement is less than ball radius + rim radius', () => {
  const radiusSum = game.evaluate('BALL_RADIUS + RIM_RADIUS');
  let maximum = 0;
  for (let angle = 0; angle < 360; angle++) {
    const radians = angle * Math.PI / 180;
    const velocity = launch(Math.cos(radians) * 140, Math.sin(radians) * 140);
    const start = { x: 210, y: 500, ...velocity };
    const next = physics.stepBallFlight(start, params, dt);
    maximum = Math.max(maximum, Math.hypot(next.x - start.x, next.y - start.y));
  }
  assert.ok(maximum < radiusSum, `${maximum} < ${radiusSum}`);
});

test('launch matches old release formula including min edge, curve and max clamp', () => {
  const min = game.evaluate('MIN_SHOT_PULL');
  for (const [x, y] of [[0, 0], [0, -min], [0, -min - 0.001], [30, -60], [-90, -100], [300, -400]]) {
    const p = pull(x, y);
    const oldImpulse = params.launchPowerScale * (1 + (params.maxPowerBoost - 1) * Math.pow(p.ratio, 4));
    const velocity = physics.getLaunchVelocity(p, params);
    assert.equal(velocity.vx, p.x * p.power * oldImpulse);
    assert.equal(velocity.vy, p.y * p.power * oldImpulse);
    assert.equal(p.len, Math.min(Math.hypot(x, y), game.evaluate('MAX_PULL')));
    const g = loadGame();
    const actual = g.evaluate(`
      activePointer = 1;
      drag = { pointerStartX: 0, pointerStartY: 0, pointerCurrentX: ${-x}, pointerCurrentY: ${-y} };
      onPointerUp({ pointerId: 1, preventDefault() {} });
      ({ vx: ball.vx, vy: ball.vy, held: ball.held });
    `);
    assert.equal(actual.held, p.len <= min);
    assert.equal(actual.vx, p.len > min ? velocity.vx : 0);
    assert.equal(actual.vy, p.len > min ? velocity.vy : 0);
  }
});

test('frame clamp bounds catch-up and preserves fractional remainder', () => {
  for (const frame of [0.1, 0.2, 2, 100]) {
    let calls = 0;
    const result = physics.advanceFixedSteps(dt / 2, frame, 0.1, () => calls++);
    assert.equal(calls, 12);
    assert.equal(result.steps, 12);
    assert.ok(Math.abs(result.alpha - 0.5) < 1e-12);
  }
  assert.equal(physics.advanceFixedSteps(0, -1, 0.1, () => assert.fail()).steps, 0);
});

test('segment damping retains full impact loss and time-based overlap loss', () => {
  const g = loadGame();
  for (const hz of [60, 120]) {
    for (const incoming of [true, false]) {
      const result = g.evaluate(`
        Object.assign(ball, { x: 10, y: 50, vx: ${incoming ? -100 : 100}, vy: 30 });
        collideSegment(0, 0, 0, 100, 0.54, 1 / ${hz});
        ({ vx: ball.vx, vy: ball.vy });
      `);
      const damping = incoming ? 0.96 : Math.pow(0.96, 60 / hz);
      assert.equal(result.vx, (incoming ? 54 : 100) * damping);
      assert.equal(result.vy, 30 * damping);
    }
  }
});

test('game release, preview and debug recording use the same flight samples', () => {
  const g = loadGame({ search: '?debugShots=1' });
  const result = g.evaluate(`
    state = 'playing';
    hoops = [makeHoop(210, 2000, 0, null), makeHoop(300, 1800, 1, null)];
    Object.assign(ball, { x: 210, y: 590 });
    activePointer = 1;
    drag = { pointerStartX: 0, pointerStartY: 0, pointerCurrentX: -110, pointerCurrentY: 90 };
    onPointerUp({ pointerId: 1, preventDefault() {} });
    for (let i = 0; i < debugShots.preview.points.at(-1).step; i++) updateFixedStep(Physics.FIXED_DT);
    ({ preview: debugShots.preview.points, actual: debugShots.actual });
  `);
  assert.equal(result.actual.length, result.preview.length);
  result.preview.forEach((point, i) => {
    assert.equal(point.x, result.actual[i].x);
    assert.equal(point.y, result.actual[i].y);
  });
  assert.equal(loadGame().evaluate('debugShots'), null);
});

test('render interpolation is separate from collision history and snaps on settle/reset', () => {
  const g = loadGame();
  g.evaluate(`
    state = 'playing';
    hoops = [makeHoop(210, 2000, 0, null), makeHoop(300, 1800, 1, null)];
    Object.assign(ball, { x: 210, y: 590, vx: 100, vy: -900, held: false, angularVelocity: 6 });
    snapBallRender();
    updateFixedStep(Physics.FIXED_DT);
    renderAlpha = 0.5;
    drawBall();
  `);
  const snapshot = g.evaluate('({ previous: {...previousBallRender}, current: {...currentBallRender}, prevX: ball.prevX })');
  const translate = g.calls.find(call => call[0] === 'translate');
  // Squash/stretch rotates in and out of its own axis first; the ball spin is the last rotate.
  const rotate = g.calls.filter(call => call[0] === 'rotate').at(-1);
  assert.equal(translate[1], (snapshot.previous.x + snapshot.current.x) / 2);
  assert.equal(translate[2], (snapshot.previous.y + snapshot.current.y) / 2);
  assert.equal(rotate[1], (snapshot.previous.rotation + snapshot.current.rotation) / 2);
  assert.equal(snapshot.prevX, 210);
  for (const action of ['beginBallSettle(hoops[0])', 'finishBallSettle()', 'placeBallInHoop(hoops[1])', 'recoverFirstTransition()', 'resetGame(false)']) {
    const value = g.evaluate(`${action}; ({ previous: {...previousBallRender}, current: {...currentBallRender}, x: ball.x, y: ball.y, rotation: ball.rotation })`);
    assert.deepEqual(value.previous, value.current);
    assert.equal(value.current.x, value.x);
    assert.equal(value.current.y, value.y);
    assert.equal(value.current.rotation, value.rotation);
  }
});

test('stopping/restarting clears accumulator and keeps a single guarded RAF', () => {
  const g = loadGame();
  g.evaluate('gameBooted = true; physicsAccumulator = 0.004; renderAlpha = 0.48; restartAnimationLoop(); restartAnimationLoop();');
  assert.equal(g.rafs.size, 1);
  assert.equal(g.evaluate('physicsAccumulator'), 0);
  assert.equal(g.evaluate('renderAlpha'), 0);
  g.evaluate('stopAnimationLoop()');
  assert.equal(g.rafs.size, 0);
});

test('real game loop keeps collisions, moving hoops, countdown and loss timing identical across frame rates', () => {
  const random = seededRandom();
  const jitter = [];
  let remaining = 2;
  while (remaining > 0) {
    const frame = Math.min(remaining, 1 / 180 + random() * 0.05);
    jitter.push(frame);
    remaining -= frame;
  }
  const sequences = [30, 60, 120, 144, 20].map(hz => Array(hz * 2).fill(1 / hz));
  sequences.push(jitter);
  let reference;
  for (const frames of sequences) {
    const g = loadGame();
    g.evaluate(`
      gameBooted = true;
      state = 'playing';
      const source = makeHoop(128, 563, 0, null);
      const target = makeHoop(280, 380, 1, source);
      target.moving = true;
      target.moveAmplitude = 28;
      target.movePhase = 0.5;
      target.role = HOOP_ROLE.TARGET;
      source.role = HOOP_ROLE.CURRENT;
      hoops = [source, target];
      Object.assign(ball, { x: 128, y: 593, vx: 500, vy: -900, held: false, launchHoopId: 0, angularVelocity: 6 });
      snapBallRender();
      timedShotActive = true;
      timedShotRemainingSeconds = 10;
      timedShotInitialSeconds = 10;
    `);
    let now = 0;
    for (const frame of frames) {
      now += frame * 1000;
      g.evaluate(`loop(${now}, animationLoopGeneration, false)`);
    }
    const result = JSON.parse(g.evaluate(`JSON.stringify({
      x: ball.x, y: ball.y, vx: ball.vx, vy: ball.vy, rotation: ball.rotation,
      held: ball.held, touchedHoop: ball.touchedHoop, wallBounceCount: ball.wallBounceCount,
      state, score, targetCameraY, simulationCameraY, airborneTime,
      simulationTime, timedShotRemainingSeconds,
      hoops: hoops.map(h => ({ x: h.x, y: h.y }))
    })`));
    if (!reference) reference = result;
    else assert.deepEqual(result, reference);
  }
});

test('presentation updates do not move the ball, advance shot time or consume physics steps', () => {
  const g = loadGame();
  g.evaluate(`
    state = 'playing';
    ball.held = false;
    ball.angularVelocity = 6;
    timedShotActive = true;
    timedShotRemainingSeconds = 5;
  `);
  const state = 'JSON.stringify({ ball, simulationTime, airborneTime, timedShotRemainingSeconds, physicsAccumulator })';
  const before = g.evaluate(state);
  g.evaluate('updatePresentation(0.1)');
  assert.equal(g.evaluate(state), before);
});

test('debug overlay persists after landing, resets on the next release, and draws hollow samples', () => {
  const g = loadGame({ search: '?debugShots=1' });
  g.evaluate(`
    state = 'playing';
    hoops = [makeHoop(210, 2000, 0, null), makeHoop(300, 1800, 1, null)];
    activePointer = 1;
    drag = { pointerStartX: 0, pointerStartY: 0, pointerCurrentX: 0, pointerCurrentY: 120 };
    onPointerUp({ pointerId: 1, preventDefault() {} });
    for (let i = 0; i < TRAJECTORY_DOT_STEPS; i++) updateFixedStep(Physics.FIXED_DT);
    placeBallInHoop(hoops[0]);
    drawDebugShots();
  `);
  assert.equal(g.evaluate('debugShots.actual.length'), 1);
  assert.equal(g.evaluate('debugShots.recording'), false);
  assert.ok(g.calls.some(call => call[0] === 'arc' && call[3] === 5));
  assert.ok(g.calls.some(call => call[0] === 'stroke'));
  g.evaluate(`
    activePointer = 2;
    drag = { pointerStartX: 0, pointerStartY: 0, pointerCurrentX: -40, pointerCurrentY: 110 };
    onPointerUp({ pointerId: 2, preventDefault() {} });
  `);
  assert.equal(g.evaluate('debugShots.actual.length'), 0);
  assert.equal(g.evaluate('debugShots.steps'), 0);
  assert.equal(g.evaluate('debugShots.recording'), true);
});

function slideSpeed(hz, seconds) {
  // Ball resting on a 30° slope (screen y down), released from rest: only gravity and segment contact.
  const g = loadGame();
  return g.evaluate(`(() => {
    const dir = { x: Math.cos(Math.PI / 6), y: Math.sin(Math.PI / 6) };
    const normal = { x: dir.y, y: -dir.x };
    const offset = BALL_RADIUS + 2.5;
    Object.assign(ball, { x: 40 * dir.x + normal.x * offset, y: 40 * dir.y + normal.y * offset, vx: 0, vy: 0 });
    const dt = 1 / ${hz};
    for (let i = 0; i < Math.round(${seconds} * ${hz}); i++) {
      const f = Physics.stepBallFlight(ball, REACHABILITY_PARAMS, dt);
      Object.assign(ball, { x: f.x, y: f.y, vx: f.vx, vy: f.vy });
      collideSegment(0, 0, 900 * dir.x, 900 * dir.y, 0.54, dt);
    }
    return Math.hypot(ball.vx, ball.vy);
  })()`);
}

test('sliding contact loses the same speed per second at 60 and 120 steps per second', () => {
  const at60 = slideSpeed(60, 0.8);
  const at120 = slideSpeed(120, 0.8);
  assert.ok(at60 > 100, `ball should slide, got ${at60}`);
  assert.ok(Math.abs(at120 - at60) / at60 < 0.02, `60 Hz ${at60} vs 120 Hz ${at120}`);
});

function runFrames(frames, { stallAt = -1, stallSeconds = 0 } = {}) {
  const g = loadGame();
  g.evaluate(`
    gameBooted = true;
    state = 'playing';
    hoops = [makeHoop(210, 2000, 0, null), makeHoop(300, 1800, 1, null)];
    Object.assign(ball, { x: 210, y: 590, vx: 300, vy: -1000, held: false, launchHoopId: 0, angularVelocity: 0 });
    snapBallRender();
  `);
  let now = 0;
  frames.forEach((frame, i) => {
    if (i === stallAt) now += stallSeconds * 1000;
    now += frame * 1000;
    g.evaluate(`loop(${now}, animationLoopGeneration, false)`);
  });
  return JSON.parse(g.evaluate('JSON.stringify({ x: ball.x, y: ball.y, airborneTime })'));
}

test('a long frame gap (background tab) is skipped, not caught up', () => {
  const frames = Array(40).fill(1 / 60);
  const smooth = runFrames(frames.slice(0, 39));
  const stalled = runFrames(frames, { stallAt: 20, stallSeconds: 2 });
  assert.deepEqual(stalled, smooth);
});

test('a release between fixed steps still follows the preview exactly', () => {
  const g = loadGame({ search: '?debugShots=1' });
  g.evaluate(`
    gameBooted = true;
    state = 'playing';
    // Keep hoops on screen: the start hoop is at the bottom, so the shot cannot be lost or recovered early.
    hoops = [makeHoop(210, 600, 0, null), makeHoop(300, 420, 1, null)];
    placeBallInHoop(hoops[0]);
  `);
  let now = 0;
  const frame = () => { now += 1000 / 144; g.evaluate(`loop(${now}, animationLoopGeneration, false)`); };
  for (let i = 0; i < 7; i++) frame();
  const alphaAtRelease = g.evaluate('renderAlpha');
  g.evaluate(`
    activePointer = 1;
    drag = { pointerStartX: 0, pointerStartY: 0, pointerCurrentX: -60, pointerCurrentY: 120 };
    onPointerUp({ pointerId: 1, preventDefault() {} });
  `);
  for (let i = 0; i < 120; i++) frame();
  const { preview, actual } = g.evaluate('({ preview: debugShots.preview.points, actual: debugShots.actual })');
  assert.ok(alphaAtRelease > 0, 'release should happen mid-step');
  assert.ok(actual.length >= preview.length);
  preview.forEach((point, i) => {
    assert.equal(actual[i].x, point.x);
    assert.equal(actual[i].y, point.y);
  });
});

test('impact feel ignores resting contact and fires once per impact cooldown', () => {
  const g = loadGame();
  const squash = (code) => JSON.parse(g.evaluate(`${code}; JSON.stringify(ballSquash)`));
  assert.equal(squash('onBallImpact(0, -1, 30, "rim")').value, 0);
  const hit = squash('simulationTime = 1; onBallImpact(0, -1, 600, "rim")');
  assert.ok(hit.value < -0.1, `hard rim hit should squash, got ${hit.value}`);
  assert.equal(g.evaluate('lastImpactFeedbackAt.rim'), 1);
  g.evaluate('simulationTime = 1.03; onBallImpact(0, -1, 600, "rim")');
  assert.equal(g.evaluate('lastImpactFeedbackAt.rim'), 1);
  g.evaluate('simulationTime = 1.2; onBallImpact(0, -1, 600, "rim")');
  assert.equal(g.evaluate('lastImpactFeedbackAt.rim'), 1.2);
});

test('impact feel never changes the ball: collisions match with feedback disabled', () => {
  const run = (disable) => {
    const g = loadGame();
    return g.evaluate(`
      const kinds = new Set();
      const feedback = onBallImpact;
      onBallImpact = (...args) => { if (args[2] >= IMPACT_FEEDBACK_MIN_SPEED) kinds.add(args[3]); if (!${disable}) feedback(...args); };
      scoreTargetHoop = () => { ball.held = true; };
      state = 'playing';
      hoops = [makeHoop(210, 600, 0, null), makeHoop(330, 420, 1, null)];
      currentHoopId = 0;
      targetHoopId = 1;
      setHoopRoles(0, 1);
      Object.assign(ball, { x: 210, y: 590, vx: 100, vy: -1300, held: false, launchHoopId: 0, angularVelocity: 6 });
      snapBallRender();
      const path = [];
      for (let i = 0; i < 300 && !ball.held; i += 1) {
        updateFixedStep(Physics.FIXED_DT);
        path.push(ball.x, ball.y, ball.vx, ball.vy);
      }
      JSON.stringify({ path, kinds: [...kinds].sort() });
    `);
  };
  const withFeedback = run(false);
  assert.deepEqual(JSON.parse(withFeedback).kinds, ['rim', 'wall'], 'shot must hit a rim and a wall');
  assert.equal(withFeedback, run(true));
});

test('squash spring settles back to round and stays bounded', () => {
  const g = loadGame();
  g.evaluate('kickBallSquash(0.4, -1)');
  assert.equal(g.evaluate('ballSquash.value'), -g.evaluate('SQUASH_MAX'));
  for (let i = 0; i < 60; i += 1) g.evaluate('updatePresentation(1 / 60)');
  assert.ok(Math.abs(g.evaluate('ballSquash.value')) < 0.005);
  g.evaluate('kickBallSquash(0, 0.2); updatePresentation(0.1)');
  const value = g.evaluate('ballSquash.value');
  assert.ok(Math.abs(value) <= g.evaluate('SQUASH_MAX') && Number.isFinite(value));
});

test('impact sounds still fire right after a restart rewinds the clock', () => {
  const g = loadGame();
  g.evaluate(`
    const sounds = [];
    playGameSound = (name) => sounds.push(name);
    globalThis.__sounds = sounds;
    simulationTime = 40;
    onBallImpact(0, -1, 600, "rim");
    resetGame(false);
    simulationTime = 0.02;
    onBallImpact(0, -1, 600, "rim");
  `);
  assert.equal(g.evaluate('JSON.stringify(__sounds.filter(name => name === "rim"))'), '["rim","rim"]');
});

test('flame colour helpers parse, invert and reject bad input', () => {
  const g = loadGame();
  assert.equal(g.evaluate('JSON.stringify(parseHexColor("#ff8a2e"))'), '{"r":255,"g":138,"b":46}');
  assert.equal(g.evaluate('parseHexColor("red")'), null);
  assert.equal(g.evaluate('invertHexColor("#000000")'), '#ffffff');
  assert.equal(g.evaluate('invertHexColor(invertHexColor("#3a7bc4"))'), '#3a7bc4');
  assert.equal(g.evaluate('mixHexColor("#000000", "#ffffff", 0.5)'), '#808080');
  const bands = JSON.parse(g.evaluate('JSON.stringify(ensureFlameBands(["#2cacf7", "#2cacf7", "#2cacf7"]))'));
  assert.equal(new Set(bands).size, 3);
  assert.equal(bands[1], '#2cacf7');
  assert.equal(g.evaluate('ensureFlameBands(["#fff0a6", "#ff8a2e", "#c4702c"]).join()'), '#fff0a6,#ff8a2e,#c4702c');
});

test('cel flame trail is bounded, draws a ribbon and clears when the streak ends', () => {
  const g = loadGame();
  g.evaluate(`
    state = 'playing';
    hoops = [makeHoop(210, 2000, 0, null), makeHoop(300, 1800, 1, null)];
    perfectChain = 6;
    swishStreak = 6;
    Object.assign(ball, { x: 60, y: 590, vx: 900, vy: -500, held: false, angularVelocity: 0 });
    snapBallRender();
  `);
  for (let i = 0; i < 120; i += 1) {
    g.evaluate(`ball.x = 60 + (${i} % 40) * 8; ball.y = 590 - (${i} % 40) * 4; snapBallRender(); updatePresentation(1 / 60)`);
  }
  assert.ok(g.evaluate('flameTrail.length') > 2);
  assert.ok(g.evaluate('flameTrail.length') <= 48);
  assert.ok(g.evaluate('countFlameParticles()') <= g.evaluate('MAX_FLAME_PARTICLES'));
  const spine = JSON.parse(g.evaluate('JSON.stringify(buildFlameSpine(ball.x, ball.y))'));
  let length = 0;
  for (let i = 1; i < spine.length; i += 1) length += Math.hypot(spine[i].x - spine[i - 1].x, spine[i].y - spine[i - 1].y);
  assert.ok(length <= g.evaluate('FLAME_TRAIL_MAX_LENGTH') + 1e-6, `spine length ${length}`);
  const before = g.calls.length;
  g.evaluate('drawBall()');
  const fills = g.calls.slice(before).filter(call => call[0] === 'fill').length;
  assert.ok(fills >= 3, `ribbon layers should fill, got ${fills}`);
  g.evaluate('perfectChain = 0; updatePresentation(1 / 60)');
  assert.equal(g.evaluate('flameTrail.length'), 0);
});

test('held ball on a streak burns upward instead of using a stale trail', () => {
  const g = loadGame();
  g.evaluate(`state = 'playing'; perfectChain = 4; Object.assign(ball, { x: 200, y: 400, held: true }); snapBallRender();`);
  const spine = JSON.parse(g.evaluate('JSON.stringify(buildFlameSpine(200, 400))'));
  assert.equal(spine.length, 7);
  assert.ok(spine.every((point, i) => i === 0 || point.y < 400));
});

test('a basket plays one combined score sound, not stacked cues', () => {
  const g = loadGame();
  const sounds = JSON.parse(g.evaluate(`
    const played = [];
    playGameSound = (name, detail) => played.push({ name, detail });
    recordAchievementBasket = () => false;
    state = 'playing';
    hoops = [makeHoop(210, 600, 0, null), makeHoop(300, 420, 1, null)];
    currentHoopId = 0;
    targetHoopId = 1;
    setHoopRoles(0, 1);
    swishStreak = 3;
    Object.assign(ball, { x: 300, y: 425, vx: 0, vy: 200, held: false, touchedHoop: false, touchedWall: true });
    scoreTargetHoop(hoops[1]);
    JSON.stringify(played);
  `));
  assert.deepEqual(sounds.map(sound => sound.name), ['score']);
  assert.deepEqual(sounds[0].detail, { perfect: true, wall: true, streak: 4 });
});

test('hit-stop delays fixed steps without changing them, and presentation keeps running', () => {
  const run = (freezeAtFrame) => {
    const g = loadGame();
    g.evaluate(`
      gameBooted = true;
      state = 'playing';
      hoops = [makeHoop(210, 600, 0, null), makeHoop(300, 420, 1, null)];
      placeBallInHoop(hoops[0]);
      ball.held = false;
      ball.launchHoopId = 0;
      ball.vx = 120;
      ball.vy = -700;
    `);
    let now = 0;
    const frame = () => { now += 1000 / 60; g.evaluate(`loop(${now}, animationLoopGeneration, false)`); };
    const path = [];
    let frozenSteps = null;
    for (let i = 0; i < 40; i++) {
      if (i === freezeAtFrame) {
        g.evaluate('hitStopTimer = HIT_STOP.ignite; pushParticle({ x: 0, y: 0, vx: 100, vy: 0, life: 1, maxLife: 1, size: 3 });');
        const before = g.evaluate('({ t: simulationTime, x: particles[particles.length - 1].x })');
        frame();
        const after = g.evaluate('({ t: simulationTime, x: particles[particles.length - 1].x })');
        frozenSteps = { simulation: after.t - before.t, particle: after.x - before.x };
      } else {
        frame();
      }
      path.push(g.evaluate('JSON.stringify([ball.x, ball.y])'));
    }
    return { path: [...new Set(path)], frozenSteps };
  };
  const plain = run(-1);
  const stopped = run(10);
  assert.equal(stopped.frozenSteps.simulation, 0, 'no fixed step runs while frozen');
  assert.ok(stopped.frozenSteps.particle > 0, 'particles keep moving while frozen');
  // The same positions occur in the same order; hit-stop only shifts them later in time.
  assert.deepEqual(stopped.path, plain.path.slice(0, stopped.path.length));
});

test('a perfect basket that lights the flame holds longer than a plain perfect', () => {
  const g = loadGame();
  g.evaluate(`
    gameBooted = true;
    state = 'playing';
    hoops = [makeHoop(210, 600, 0, null), makeHoop(300, 420, 1, null)];
    placeBallInHoop(hoops[0]);
    ball.touchedHoop = false;
    swishStreak = 0;
  `);
  const holds = [];
  const baskets = g.evaluate('getFlameThreshold()') + 1;
  for (let i = 0; i < baskets; i++) {
    g.evaluate(`hitStopTimer = 0; ball.touchedHoop = false; scoreTargetHoop(hoops[1]); hoops[1].id = 1;`);
    holds.push(g.evaluate('hitStopTimer'));
  }
  const threshold = g.evaluate('getFlameThreshold()');
  holds.forEach((hold, i) => {
    assert.equal(hold, i + 1 === threshold ? g.evaluate('HIT_STOP.ignite') : g.evaluate('HIT_STOP.perfect'));
  });
});

test('a new run clears a pending hit-stop', () => {
  const g = loadGame();
  g.evaluate('gameBooted = true; hitStopTimer = HIT_STOP.ignite; resetGame(false);');
  assert.equal(g.evaluate('hitStopTimer'), 0);
});

test('a basket kicks landing dust out of both sides of the net without touching the ball', () => {
  const run = (withDust) => {
    const g = loadGame();
    return JSON.parse(g.evaluate(`
      playGameSound = () => {};
      recordAchievementBasket = () => false;
      ${withDust ? '' : 'emitLandingDust = () => {};'}
      state = 'playing';
      hoops = [makeHoop(210, 600, 0, null), makeHoop(300, 420, 1, null)];
      currentHoopId = 0;
      targetHoopId = 1;
      setHoopRoles(0, 1);
      particles = [];
      Object.assign(ball, { x: 300, y: 425, vx: 0, vy: 600, held: false, touchedHoop: false, touchedWall: false });
      scoreTargetHoop(hoops[1]);
      const dust = particles.filter((p) => p.type === 'dust');
      JSON.stringify({
        dust: dust.length,
        left: dust.filter((p) => p.vx < 0).length,
        right: dust.filter((p) => p.vx > 0).length,
        ball: { x: ball.x, y: ball.y, vx: ball.vx, vy: ball.vy, settle: ball.settle }
      });
    `));
  };
  const withDust = run(true);
  const without = run(false);
  assert.equal(withDust.dust, 6);
  assert.ok(withDust.left >= 2 && withDust.right >= 2, 'puffs go both ways');
  assert.equal(without.dust, 0);
  assert.deepEqual(withDust.ball, without.ball, 'dust is presentation only');
});

test('every theme has a sound voice and the gym voice is the original marimba', () => {
  const g = loadGame();
  const themes = JSON.parse(g.evaluate('JSON.stringify(Object.keys(THEMES))'));
  const voices = JSON.parse(g.evaluate('JSON.stringify(THEME_SOUNDS)'));
  assert.deepEqual(Object.keys(voices).sort(), themes.sort());
  const malletCalls = JSON.parse(g.evaluate(`
    const calls = [];
    playTone = (...args) => calls.push(['tone', ...args]);
    playNoise = (...args) => calls.push(['noise', ...args]);
    selectedThemeId = 'gym';
    playMallet(523.25, 0.1, 0.03);
    JSON.stringify(calls);
  `));
  assert.deepEqual(malletCalls, [
    ['tone', 523.25, 0.32, 'sine', 0.03, 0.1, 0],
    ['tone', 2093, 0.06, 'sine', 0.009, 0.1, 0],
    ['noise', 0.015, 0.015, 'lowpass', 2500, 0, 0.7, 0.1]
  ]);
});

test('only the rooftop chain net jingles', () => {
  const g = loadGame();
  const jingles = JSON.parse(g.evaluate(`
    let count = 0;
    playTone = () => {};
    playNoise = () => {};
    playChainJingle = () => { count += 1; };
    muted = false;
    userPaused = false;
    const result = {};
    for (const id of Object.keys(THEMES)) {
      selectedThemeId = id;
      count = 0;
      playGameSound('net', { strength: 0.5 });
      playGameSound('score', { perfect: true, wall: false, streak: 1 });
      result[id] = count;
    }
    JSON.stringify(result);
  `));
  assert.deepEqual(jingles, { gym: 0, sunset: 0, neon: 0, rooftop: 2, minimal: 0 });
});

test('the gym rim, thump and score cues are unchanged by the theme voices', () => {
  const g = loadGame();
  const calls = JSON.parse(g.evaluate(`
    const calls = [];
    playTone = (...args) => calls.push(['tone', ...args]);
    playNoise = (...args) => calls.push(['noise', ...args]);
    Math.random = () => 0.5;
    muted = false;
    userPaused = false;
    selectedThemeId = 'gym';
    playGameSound('rim', { strength: 0.5 });
    playGameSound('board', { strength: 0.5 });
    playGameSound('wall', { strength: 0.5 });
    playGameSound('score', { perfect: false, wall: false, streak: 0 });
    JSON.stringify(calls);
  `));
  const rim = 420;
  const level = 0.014 + 0.5 * 0.034;
  assert.deepEqual(calls.slice(0, 7), [
    ['tone', rim, 0.13, 'triangle', level, 0, rim * 0.96],
    ['tone', rim * 2.7, 0.06, 'sine', level * 0.28, 0, 0],
    ['noise', 0.02, level * 0.6, 'lowpass', 2200, 700, 0.7],
    ['tone', 150, 0.09, 'triangle', 0.018 + 0.5 * 0.035, 0, 150 * 0.55],
    ['noise', 0.06, 0.02 + 0.5 * 0.04, 'lowpass', 900, 300, 0.7],
    ['tone', 120, 0.09, 'triangle', 0.018 + 0.5 * 0.035, 0, 120 * 0.55],
    ['noise', 0.06, 0.02 + 0.5 * 0.04, 'lowpass', 900, 300, 0.7]
  ]);
  const firstNote = calls.find((call, i) => i > 8 && call[0] === 'tone' && call[3] === 'sine' && call[2] === 0.32);
  assert.equal(firstNote[1], 523.25 * 0.75, 'score notes keep the C5 root');
});
