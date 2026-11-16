import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from './helpers/game-harness.mjs';

// Aim feel ("the hoop slides / keeps moving when my finger stops"): the pull is measured on the
// screen, so camera motion never leaks into it, and the launcher points straight at the aim.

// The held ball in the first hoop, on a scaled, letterboxed canvas as on a phone.
const SETUP = `
  resetGame(false);
  state = 'playing';
  gameBooted = true;
  muted = true;
  for (const other of hoops) if (other.id !== currentHoopId) other.x += 5000;
  hasReachedSecondHoop = true;
  const hoop = getHoopById(currentHoopId);
  placeBallInHoop(hoop);
  scale = 2;
  offsetX = 12;
  offsetY = 30;
  const at = (x, y) => ({ pointerId: 1, clientX: x, clientY: y, preventDefault() {} });
  // After a basket the camera is still easing toward its new target when aim opens.
  const easeCamera = (distance, frames) => {
    previousTargetCameraY = targetCameraY = cameraY + distance;
    const start = cameraY;
    for (let i = 0; i < frames; i++) updatePresentation(1 / 60);
    return cameraY - start;
  };
`;

function cameraLeak() {
  const g = loadGame();
  return JSON.parse(g.evaluate(`${SETUP}
    onPointerDown(at(400, 900));
    onPointerMove(at(460, 1060));
    const before = getPullVector();
    const previewBefore = predictShot(before).points;
    const cameraMoved = easeCamera(-120, 12);
    // A finger held still keeps reporting moves at the same spot.
    onPointerMove(at(460, 1060));
    const after = getPullVector();
    const previewAfter = predictShot(after).points;
    // A fresh press while the camera eases, finger not moving at all.
    onPointerCancel(at(460, 1060));
    onPointerDown(at(300, 700));
    easeCamera(-120, 12);
    onPointerMove(at(300, 700));
    const still = getPullVector();
    JSON.stringify({ before, after, previewBefore, previewAfter, cameraMoved, still });
  `));
}

test('camera motion does not move the pull or the preview while the finger is still', () => {
  const r = cameraLeak();
  assert.ok(r.cameraMoved < -10, `the camera really eased (${r.cameraMoved})`);
  assert.ok(Math.abs(r.before.len - Math.hypot(30, 80)) < 1e-9, `pull is screen pixels / scale (${r.before.len})`);
  assert.deepEqual(r.after, r.before);
  assert.deepEqual(r.previewAfter, r.previewBefore);
  assert.equal(r.still.len, 0, 'a still finger never pulls');
});

function directAim() {
  const g = loadGame();
  return JSON.parse(g.evaluate(`${SETUP}
    onPointerDown(at(400, 900));
    // Pull left = shot to the right.
    onPointerMove(at(400 - 2 * MAX_PULL * 0.6, 900));
    updatePresentation(1 / 60);
    const target = getLauncherAimTarget(hoop);
    const first = { angle: hoop.aimAngle, velocity: hoop.aimVelocity };
    let heldDrift = 0;
    for (let i = 0; i < 30; i++) {
      updatePresentation(1 / 60);
      heldDrift = Math.max(heldDrift, Math.abs(hoop.aimAngle - target));
    }
    // A swing to a new aim is followed on the very next frame.
    onPointerMove(at(400 + 2 * MAX_PULL * 0.4, 900 + 2 * MAX_PULL * 0.4));
    updatePresentation(1 / 60);
    const swingTarget = getLauncherAimTarget(hoop);
    JSON.stringify({ target, first, heldDrift, swingTarget, swing: hoop.aimAngle, minPull: getPullVector().len >= MIN_SHOT_PULL });
  `));
}

test('while aiming the launcher points straight at the aim and stays there when the pull is held', () => {
  const r = directAim();
  assert.ok(r.minPull);
  assert.ok(Math.abs(r.target - Math.PI / 2) < 1e-9, `aim target faces right (${r.target})`);
  assert.ok(Math.abs(r.first.angle - r.target) < 1e-9, `on target after one frame (${r.first.angle})`);
  assert.equal(r.first.velocity, 0);
  assert.ok(r.heldDrift < 1e-9, `no drift while held (${r.heldDrift})`);
  assert.ok(Math.abs(r.swing - r.swingTarget) < 1e-9, 'a swing is followed at once');
});

test('the release flies the last preview and the launcher springs back upright', () => {
  const g = loadGame();
  const r = JSON.parse(g.evaluate(`${SETUP}
    onPointerDown(at(400, 900));
    // Pull down-left = shot up-right (about 45°), 90 % power.
    const d = 2 * MAX_PULL * 0.9 / Math.SQRT2;
    onPointerMove(at(400 - d, 900 + d));
    for (let i = 0; i < 20; i++) updatePresentation(1 / 60);
    const pull = getPullVector();
    const preview = predictShot(pull).points;
    const expected = Physics.getLaunchVelocity(pull, FLIGHT_PARAMS);
    // Lifted at the same spot while the camera is still moving.
    easeCamera(-60, 4);
    onPointerUp(at(400 - d, 900 + d));
    const launched = { vx: ball.vx, vy: ball.vy, held: ball.held };
    const actual = [];
    for (let i = 1; i <= preview.at(-1).step; i++) {
      updateFixedStep(Physics.FIXED_DT);
      if (i % TRAJECTORY_DOT_STEPS === 0) actual.push({ x: ball.x, y: ball.y });
    }
    const turned = hoop.rotation;
    state = 'retry';
    retryShot();
    const swingStart = hoop.aimAngle;
    let low = Infinity;
    for (let i = 0; i < 120; i++) {
      updatePresentation(1 / 60);
      low = Math.min(low, hoop.aimAngle);
    }
    JSON.stringify({ expected, launched, preview, actual, turned, swingStart, low, end: hoop.aimAngle, rotation: hoop.rotation });
  `));
  assert.equal(r.launched.held, false, 'the ball was shot');
  assert.equal(r.launched.vx, r.expected.vx);
  assert.equal(r.launched.vy, r.expected.vy);
  assert.ok(r.actual.length >= 2, `compared ${r.actual.length} preview dots`);
  r.actual.forEach((point, i) => {
    assert.equal(r.preview[i].x, point.x, `sample ${i}`);
    assert.equal(r.preview[i].y, point.y, `sample ${i}`);
  });
  assert.ok(Math.abs(r.turned - Math.PI / 4) < 1e-9, `the launcher faced the shot (${r.turned})`);
  assert.equal(r.rotation, 0);
  assert.ok(Math.abs(r.swingStart - Math.PI / 4) < 0.05, `the drawn launcher starts from the shot (${r.swingStart})`);
  assert.ok(r.low < -0.01, `the bouncy release spring overshoots upright (${r.low})`);
  assert.equal(r.end, 0, 'and comes to rest upright');
});

test('the launcher eases in over the first pixels of an aiming pull instead of snapping', () => {
  const g = loadGame();
  const r = JSON.parse(g.evaluate(`${SETUP}
    onPointerDown(at(400, 900));
    const sample = (len) => {
      // Pull left = shot to the right; the screen distance is len world units at scale 2.
      onPointerMove(at(400 - 2 * len, 900));
      updatePresentation(1 / 60);
      return { len: getPullVector().len, angle: hoop.aimAngle, target: getLauncherAimTarget(hoop) };
    };
    const samples = [MIN_SHOT_PULL + 0.25, MIN_SHOT_PULL + LAUNCHER_AIM_RAMP_PULL / 2, MIN_SHOT_PULL + LAUNCHER_AIM_RAMP_PULL + 0.5, MAX_PULL * 0.6].map(sample);
    JSON.stringify(samples);
  `));
  const [entry, mid, full, far] = r;
  assert.ok(Math.abs(entry.target - Math.PI / 2) < 1e-9);
  assert.ok(Math.abs(entry.angle) < 0.2 * Math.abs(entry.target), `no snap at the aim threshold (${entry.angle})`);
  assert.ok(Math.abs(mid.angle) > Math.abs(entry.angle) && Math.abs(mid.angle) < Math.abs(mid.target), `halfway in (${mid.angle})`);
  assert.ok(Math.abs(full.angle - full.target) < 1e-9, `fully on the aim past the ramp (${full.angle})`);
  assert.ok(Math.abs(far.angle - far.target) < 1e-9);
});
