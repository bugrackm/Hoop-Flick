import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from './helpers/game-harness.mjs';

// A launcher on the left, a target up-right, and an obstacle right in the straight path.
function setUp(g, spec) {
  g.evaluate(`
    gameBooted = true;
    state = 'playing';
    playGameSound = () => {};
    showTip = () => {};
    const source = makeHoop(140, 563, 0, null);
    const target = makeHoop(290, 380, 1, source);
    target.obstacle = Obstacles.create(${JSON.stringify(spec)});
    hoops = [source, target];
    currentHoopId = 0;
    targetHoopId = 1;
    setHoopRoles(0, 1);
    placeBallInHoop(source);
    hasReachedSecondHoop = true;
  `);
}

function release(g, angle, power) {
  g.evaluate(`
    const radians = ${angle} * Math.PI / 180;
    activePointer = 1;
    drag = { pointerStartX: 0, pointerStartY: 0, pointerCurrentX: -Math.sin(radians) * MAX_PULL * ${power}, pointerCurrentY: Math.cos(radians) * MAX_PULL * ${power} };
  `);
}

for (const spec of [
  // Right on the 40° / 60 % shot (about step 20 of its flight).
  { kind: 'bar', x: 207, y: 532, length: 60, angle: -0.4 },
  { kind: 'peg', x: 207, y: 532, radius: 11 },
  { kind: 'slider', x: 207, y: 532, length: 50, amplitude: 24, speed: 1.5, phase: 0.3 },
  { kind: 'spinner', x: 207, y: 532, length: 64, speed: 1.4, angle: 0.2 }
]) {
  test(`the aim preview bounces off a ${spec.kind} exactly like the real ball`, () => {
    let hits = 0;
    for (const [angle, power] of [[40, 0.6], [38, 0.62], [42, 0.58], [35, 0.66], [45, 0.56]]) {
      const g = loadGame();
      setUp(g, spec);
      g.evaluate('for (let i = 0; i < 37; i++) updateFixedStep(Physics.FIXED_DT);');
      release(g, angle, power);
      const result = JSON.parse(g.evaluate(`
        const pull = getPullVector();
        const preview = Physics.predictTrajectory(ball, Physics.getLaunchVelocity(pull, FLIGHT_PARAMS), FLIGHT_PARAMS, {
          dotSteps: 1, pointCount: 70, maxPoints: 70, afterStep: makeLaunchNetAfterStep(pull)
        }).points;
        onPointerUp({ pointerId: 1, preventDefault() {} });
        const actual = [];
        for (let i = 0; i < 70 && !ball.held && !ball.settle && state === 'playing'; i++) {
          updateFixedStep(Physics.FIXED_DT);
          actual.push({ x: ball.x, y: ball.y, touchedHoop: ball.touchedHoop, hitObstacle: (hoops[1].obstacleFlash || 0) > 0 });
        }
        JSON.stringify({ preview, actual });
      `));
      // Compare until the real ball touches a rim or net: the preview never models hoops other
      // than the launcher's own net, exactly as before obstacles existed.
      let compared = 0;
      let bounced = false;
      for (let i = 0; i < result.actual.length; i++) {
        const point = result.actual[i];
        if (point.touchedHoop) break;
        assert.equal(result.preview[i].x, point.x, `${spec.kind} ${angle}° step ${i}`);
        assert.equal(result.preview[i].y, point.y, `${spec.kind} ${angle}° step ${i}`);
        compared += 1;
        if (point.hitObstacle) bounced = true;
      }
      assert.ok(compared > 6, `${spec.kind} ${angle}° compared ${compared} steps`);
      if (bounced) hits += 1;
    }
    assert.ok(hits > 0, `at least one of the shots bounces off the ${spec.kind}`);
  });
}

test('obstacle collisions are identical at any frame rate', () => {
  let reference;
  for (const hz of [30, 60, 120, 144]) {
    const g = loadGame();
    setUp(g, { kind: 'spinner', x: 205, y: 470, length: 64, speed: 1.4, angle: 0.2 });
    release(g, 38, 0.6);
    g.evaluate("onPointerUp({ pointerId: 1, preventDefault() {} });");
    let now = 0;
    for (let frame = 0; frame < hz; frame++) {
      now += 1000 / hz;
      g.evaluate(`loop(${now}, animationLoopGeneration, false)`);
    }
    const result = g.evaluate('JSON.stringify({ x: ball.x, y: ball.y, vx: ball.vx, vy: ball.vy, t: simulationTime, state })');
    if (!reference) reference = result;
    else assert.equal(result, reference, `${hz} Hz`);
  }
});

test('only the obstacle in front of the target is solid', () => {
  const g = loadGame();
  setUp(g, { kind: 'bar', x: 205, y: 470, length: 90, angle: 0 });
  const result = JSON.parse(g.evaluate(`
    const hits = [];
    for (const role of ['target', 'current']) {
      if (role === 'current') { setHoopRoles(1, 0); currentHoopId = 1; targetHoopId = 0; }
      Object.assign(ball, { x: 205, y: 500, prevX: 205, prevY: 505, vx: 0, vy: -600, held: false, settle: null, launchHoopId: -1, launchInsideNet: false });
      for (let i = 0; i < 8; i++) updateFixedStep(Physics.FIXED_DT);
      hits.push(ball.vy > 0);
    }
    JSON.stringify(hits);
  `));
  assert.deepEqual(result, [true, false]);
});
