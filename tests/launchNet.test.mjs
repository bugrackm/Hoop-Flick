import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from './helpers/game-harness.mjs';

// Shoots from the resting spot of the first hoop. `angle` is measured from straight up,
// positive to the right; full power unless `power` (0..1) says otherwise. Edge cases are
// measured in the aim frame the launcher turned to (ball.launchFrame).
function shoot(angle, { power = 1, steps = 60, rotation = 0 } = {}) {
  const g = loadGame();
  return g.evaluate(`
    resetGame(false);
    state = 'playing';
    // Keep the random target hoop out of the way: only the launcher is under test. A lost ball
    // ends the run instead of the first-hoop rescue, so a rescue is never mistaken for a catch.
    for (const other of hoops) if (other.id !== currentHoopId) other.x += 5000;
    hasReachedSecondHoop = true;
    const hoop = getHoopById(currentHoopId);
    hoop.rotation = ${rotation};
    placeBallInHoop(hoop);
    const radians = ${angle} * Math.PI / 180;
    const length = MAX_PULL * ${power};
    activePointer = 1;
    drag = { pointerStartX: 0, pointerStartY: 0, pointerCurrentX: -Math.sin(radians) * length, pointerCurrentY: Math.cos(radians) * length };
    onPointerUp({ pointerId: 1, preventDefault() {} });
    const frame = ball.launchFrame;
    let leftThroughNet = false;
    let touchedLaunchNet = false;
    let caughtAt = -1;
    let previous = worldToHoop(frame, ball.x, ball.y);
    let step = 0;
    let caughtWhileLeaving = false;
    for (; step < ${steps} && state === 'playing'; step++) {
      const leaving = ball.launchHoopId === hoop.id;
      updateFixedStep(Physics.FIXED_DT);
      if (ball.settle || ball.held) { caughtAt = step; caughtWhileLeaving = leaving; break; }
      // After it clears the launcher the ball may bounce off a wall back into the mouth: a fair catch.
      if (!leaving) continue;
      const local = worldToHoop(frame, ball.x, ball.y);
      // Crossing out past the net edge while below the rim line = through the side of the net.
      const inside = point => point.y > 7 && point.y < 52 && Math.abs(point.x) <= frame.w * 0.5;
      if (inside(previous) && local.y > 7 && local.y < 52 && Math.abs(local.x) > frame.w * 0.5) leftThroughNet = true;
      previous = local;
      if (ball.launchInsideNet && ball.touchedHoop) touchedLaunchNet = true;
    }
    const restY = hoopToWorld(hoop, 0, NET_REST_Y).y;
    ({ leftThroughNet, touchedLaunchNet, caughtAt, caughtWhileLeaving, held: ball.held || Boolean(ball.settle), state, score, rotation: frame.rotation, belowRest: ball.y - restY });
  `);
}

test('the launch frame faces the shot: up = 0, right = +90°, down = 180°', () => {
  for (const [angle, expected] of [[0, 0], [90, 90], [-90, -90], [45, 45], [180, 180]]) {
    const { rotation } = shoot(angle, { steps: 0 });
    assert.ok(Math.abs(Math.abs(rotation * 180 / Math.PI) - Math.abs(expected)) < 1e-9 && Math.sign(rotation || 1) === Math.sign(expected || 1) || expected === 180, `angle ${angle} → ${rotation}`);
  }
});

for (const angle of [-90, -80, -70, -60, 60, 70, 80, 90]) {
  test(`a sideways shot (${angle}°) leaves through the turned mouth without touching the net`, () => {
    for (const power of [0.6, 1]) {
      const result = shoot(angle, { power, steps: 40 });
      assert.equal(result.leftThroughNet, false, `power ${power}`);
      assert.equal(result.touchedLaunchNet, false, `power ${power}`);
      assert.equal(result.caughtWhileLeaving, false, `power ${power} must not be grabbed by its own hoop`);
    }
  });
}

test('no shot direction or power ever leaves through the side of the net', () => {
  for (let angle = -180; angle < 180; angle += 15) {
    for (const power of [0.1, 0.3, 0.6, 1]) {
      assert.equal(shoot(angle, { power, steps: 60 }).leftThroughNet, false, `angle ${angle}, power ${power}`);
    }
  }
});

for (const angle of [-20, 0, 20]) {
  test(`a weak upward shot (${angle}°) falls back into the pouch and is caught again`, () => {
    for (const power of [0.1, 0.2, 0.3]) {
      const result = shoot(angle, { power, steps: 160 });
      assert.ok(result.caughtAt > 0, `power ${power} caught`);
      assert.equal(result.state, 'playing');
      assert.equal(result.score, 0);
    }
  });
}

test('a downward shot leaves through the mouth facing down', () => {
  for (const power of [0.3, 1]) {
    const result = shoot(180, { power, steps: 30 });
    assert.equal(result.caughtWhileLeaving, false, `power ${power}`);
    assert.ok(result.belowRest > 20, `power ${power} went down (${result.belowRest})`);
  }
});

for (const angle of [-40, -20, 0, 20, 40]) {
  test(`an upward shot (${angle}°) leaves the hoop without touching the net`, () => {
    for (const power of [0.5, 1]) {
      const result = shoot(angle, { power, steps: 30 });
      assert.equal(result.leftThroughNet, false, `power ${power}`);
      assert.equal(result.touchedLaunchNet, false, `power ${power}`);
    }
  });
}

test('a launcher left turned by the last shot is upright again after a retry', () => {
  const g = loadGame();
  const result = JSON.parse(g.evaluate(`
    resetGame(false);
    state = 'playing';
    for (const other of hoops) if (other.id !== currentHoopId) other.x += 5000;
    const hoop = getHoopById(currentHoopId);
    const rest = hoopToWorld(hoop, 0, NET_REST_Y);
    activePointer = 1;
    drag = { pointerStartX: 0, pointerStartY: 0, pointerCurrentX: -MAX_PULL * 0.9, pointerCurrentY: 0 };
    onPointerUp({ pointerId: 1, preventDefault() {} });
    const turned = hoop.rotation;
    const turnedRest = hoopToWorld(hoop, 0, NET_REST_Y);
    for (let i = 0; i < 30; i++) updatePresentation(1 / 60);
    const drawnBefore = hoop.rotation + hoop.aimAngle;
    state = 'retry';
    retryShot();
    JSON.stringify({ turned, turnedRest, rest, rotation: hoop.rotation, ball: { x: ball.x, y: ball.y }, drawnBefore, drawn: hoop.rotation + hoop.aimAngle });
  `));
  assert.ok(Math.abs(result.turned - Math.PI / 2) < 1e-9, 'the launcher faced the shot');
  assert.ok(Math.abs(result.turnedRest.x - result.rest.x) < 1e-9 && Math.abs(result.turnedRest.y - result.rest.y) < 1e-9, 'turning pivots on the ball');
  assert.equal(result.rotation, 0);
  assert.ok(Math.abs(result.ball.x - result.rest.x) < 1e-9 && Math.abs(result.ball.y - result.rest.y) < 1e-9);
  assert.ok(Math.abs(result.drawnBefore - Math.PI / 2) < 0.05, 'the drawn launcher followed the shot');
  assert.ok(Math.abs(result.drawn - result.drawnBefore) < 1e-9, 'the drawn hoop swings back instead of popping');
});

test('the aim preview matches the real ball around the launcher, including net touches and catches', () => {
  let touches = 0;
  let catches = 0;
  for (const [angle, power] of [[90, 0.1], [-90, 0.1], [75, 0.12], [60, 0.15], [0, 0.15], [20, 0.25], [-35, 0.2], [120, 0.2], [45, 0.8]]) {
    const g = loadGame({ search: '?debugShots=1' });
    const result = g.evaluate(`
      resetGame(false);
      state = 'playing';
      // The preview only models the launcher; keep the random other hoops out of the path.
      for (const other of hoops) if (other.id !== currentHoopId) other.x += 5000;
      const radians = ${angle} * Math.PI / 180;
      activePointer = 1;
      drag = { pointerStartX: 0, pointerStartY: 0, pointerCurrentX: -Math.sin(radians) * MAX_PULL * ${power}, pointerCurrentY: Math.cos(radians) * MAX_PULL * ${power} };
      onPointerUp({ pointerId: 1, preventDefault() {} });
      const hoop = getHoopById(currentHoopId);
      let touched = false;
      let caught = false;
      const actual = [];
      // Compare only while the launcher rule applies: once the ball clears it, the hoop
      // collides normally again, which the preview never modelled.
      for (let i = 1; i <= debugShots.preview.points.at(-1).step && ball.launchHoopId === hoop.id; i++) {
        updateFixedStep(Physics.FIXED_DT);
        if (ball.settle) { caught = true; break; }
        if (ball.touchedHoop) touched = true;
        if (i % TRAJECTORY_DOT_STEPS === 0) actual.push({ x: ball.x, y: ball.y });
      }
      const pivot = hoopToWorld(hoop, 0, NET_REST_Y);
      ({ preview: debugShots.preview.points, actual, touched, caught, pivot });
    `);
    if (result.touched) touches += 1;
    if (result.caught) {
      catches += 1;
      // After the catch the dots rest in the pouch.
      assert.ok(Math.abs(result.preview.at(-1).x - result.pivot.x) < 1e-9, `angle ${angle}: preview ends in the pouch`);
      assert.ok(Math.abs(result.preview.at(-1).y - result.pivot.y) < 1e-9, `angle ${angle}: preview ends in the pouch`);
    }
    result.actual.forEach((point, i) => {
      assert.equal(result.preview[i].x, point.x, `angle ${angle}, sample ${i}`);
      assert.equal(result.preview[i].y, point.y, `angle ${angle}, sample ${i}`);
    });
  }
  assert.ok(touches > 0, 'at least one case meets a launch-net wall');
  assert.ok(catches > 0, 'at least one case falls back into the pouch');
});
