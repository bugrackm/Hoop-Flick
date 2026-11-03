import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from './helpers/game-harness.mjs';

// Shoots from the resting spot of the first hoop. `angle` is measured from straight up,
// positive to the right; full power unless `power` (0..1) says otherwise.
function shoot(angle, { power = 1, steps = 60, rotation = 0 } = {}) {
  const g = loadGame();
  return g.evaluate(`
    resetGame(false);
    state = 'playing';
    const hoop = getHoopById(currentHoopId);
    hoop.rotation = ${rotation};
    placeBallInHoop(hoop);
    const radians = ${angle} * Math.PI / 180;
    const length = MAX_PULL * ${power};
    activePointer = 1;
    drag = { pointerStartX: 0, pointerStartY: 0, pointerCurrentX: -Math.sin(radians) * length, pointerCurrentY: Math.cos(radians) * length };
    onPointerUp({ pointerId: 1, preventDefault() {} });
    let leftThroughNet = false;
    let touchedLaunchNet = false;
    let previous = worldToHoop(hoop, ball.x, ball.y);
    for (let i = 0; i < ${steps} && !ball.held && state === 'playing'; i++) {
      updateFixedStep(Physics.FIXED_DT);
      const local = worldToHoop(hoop, ball.x, ball.y);
      // Crossing out past the rim edge while below the rim line = through the net.
      const inside = point => point.y > 7 && point.y < 52 && Math.abs(point.x) <= hoop.w * 0.5;
      if (inside(previous) && local.y > 7 && Math.abs(local.x) > hoop.w * 0.5) leftThroughNet = true;
      previous = local;
      if (ball.launchInsideNet && ball.touchedHoop) touchedLaunchNet = true;
    }
    ({ leftThroughNet, touchedLaunchNet, held: ball.held });
  `);
}

for (const angle of [-90, -80, -70, -60, 60, 70, 80, 90]) {
  test(`a sideways shot (${angle}°) cannot leave through the side of the net`, () => {
    for (const power of [0.3, 0.6, 1]) {
      const result = shoot(angle, { power });
      assert.equal(result.leftThroughNet, false, `power ${power}`);
    }
  });
}

for (const angle of [-40, -20, 0, 20, 40]) {
  test(`an upward shot (${angle}°) leaves the hoop without touching the net`, () => {
    for (const power of [0.5, 1]) {
      const result = shoot(angle, { power, steps: 30 });
      assert.equal(result.leftThroughNet, false, `power ${power}`);
      assert.equal(result.touchedLaunchNet, false, `power ${power}`);
    }
  });
}

// Tilted hoops (up to MAX_HOOP_TILT) keep upright launch walls, so normal aim angles stay free.
for (const rotation of [-7, -2.5, 2.5, 7].map(degrees => degrees * Math.PI / 180)) {
  test(`a tilted hoop (${(rotation * 180 / Math.PI).toFixed(1)}°) still lets 40° shots out and holds sideways ones`, () => {
    for (const power of [0.5, 1]) {
      for (const angle of [-40, -20, 20, 40]) {
        const result = shoot(angle, { power, steps: 30, rotation });
        assert.equal(result.touchedLaunchNet, false, `angle ${angle}, power ${power}`);
      }
    }
    for (const power of [0.3, 0.6, 1]) {
      for (const angle of [-80, 80]) {
        assert.equal(shoot(angle, { power, rotation }).leftThroughNet, false, `angle ${angle}, power ${power}`);
      }
    }
  });
}

test('the aim preview bounces off the launch net exactly like the real ball', () => {
  for (const angle of [-75, 60, 80]) {
    const g = loadGame({ search: '?debugShots=1' });
    const result = g.evaluate(`
      resetGame(false);
      state = 'playing';
      // The preview only models the launch net; keep the random other hoops out of the path.
      for (const other of hoops) if (other.id !== currentHoopId) other.x += 5000;
      const radians = ${angle} * Math.PI / 180;
      activePointer = 1;
      drag = { pointerStartX: 0, pointerStartY: 0, pointerCurrentX: -Math.sin(radians) * MAX_PULL * 0.8, pointerCurrentY: Math.cos(radians) * MAX_PULL * 0.8 };
      onPointerUp({ pointerId: 1, preventDefault() {} });
      const hoop = getHoopById(currentHoopId);
      let bounced = false;
      // Compare only while the launch hoop is skipped: once the ball clears it, the hoop
      // collides normally again, which the preview never modelled.
      for (let i = 0; i < debugShots.preview.points.at(-1).step && !ball.held && ball.launchHoopId === hoop.id; i++) {
        updateFixedStep(Physics.FIXED_DT);
        if (ball.touchedHoop) bounced = true;
      }
      ({ preview: debugShots.preview.points, actual: debugShots.actual, bounced });
    `);
    assert.ok(result.bounced, `angle ${angle} should hit the net`);
    assert.ok(result.actual.length > 0, `angle ${angle} recorded samples`);
    result.actual.forEach((point, i) => {
      assert.equal(result.preview[i].x, point.x, `angle ${angle}, sample ${i}`);
      assert.equal(result.preview[i].y, point.y, `angle ${angle}, sample ${i}`);
    });
  }
});
