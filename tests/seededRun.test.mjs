import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from './helpers/game-harness.mjs';

// Everything the player faces in one hoop: geometry, movement, mechanics and the obstacle.
const SNAPSHOT = `
  function snapshotHoop(hoop) {
    const o = hoop.obstacle;
    return {
      id: hoop.id, x: hoop.baseX, y: hoop.baseY, w: hoop.w, board: hoop.board, narrow: hoop.narrow,
      fogReveal: hoop.fogReveal, intro: hoop.intro, moving: hoop.moving, movementType: hoop.movementType,
      moveAmplitude: hoop.moveAmplitude, moveSpeed: hoop.moveSpeed, movePhase: hoop.movePhase,
      turnType: hoop.turnType, turnAmplitude: hoop.turnAmplitude, turnSpeed: hoop.turnSpeed,
      turnPhase: hoop.turnPhase, turnDirection: hoop.turnDirection, baseRotation: hoop.baseRotation,
      obstacle: o ? { kind: o.kind, x: o.x, y: o.y, angle: o.angle, axisAngle: o.axisAngle, phase: o.phase, speed: o.speed, length: o.length, radius: o.radius, period: o.period } : null
    };
  }
`;

// Plans `count` hoops of one run like real baskets (the new hoop becomes the target, score
// climbs past every stage). `between` runs after each spawn, e.g. cosmetic effects.
function planRun(g, { seed, count = 60, between = '' }) {
  return JSON.parse(g.evaluate(`
    ${SNAPSHOT}
    globalThis.realPlayGameSound ??= playGameSound;
    playGameSound = () => {};
    showTip = () => {};
    resetGame(false${seed === undefined ? '' : `, ${seed}`});
    state = 'playing';
    const planned = hoops.map(snapshotHoop);
    for (let t = 0; t < ${count}; t++) {
      score = (t + 1) * 3;
      const last = hoops[hoops.length - 1];
      const hoop = nextHoop();
      planned.push(snapshotHoop(hoop));
      setHoopRoles(last.id, hoop.id);
      currentHoopId = last.id;
      targetHoopId = hoop.id;
      ${between}
    }
    JSON.stringify({ seed: runRandom.seed, planned });
  `));
}

test('the same run seed plans the same hoops in two fresh games; another seed plans others', () => {
  // Two fresh games whose cosmetic randomness differs.
  const a = planRun(loadGame({ randomSeed: 1 }), { seed: 20261116 });
  const b = planRun(loadGame({ randomSeed: 2 }), { seed: 20261116 });
  assert.equal(a.seed, 20261116);
  assert.equal(a.planned.length, 62);
  assert.deepEqual(b.planned, a.planned);
  // The sequence really covers the ladder: movement, turns and obstacles all appear.
  assert.ok(a.planned.some(hoop => hoop.moving), 'moving hoops planned');
  assert.ok(a.planned.some(hoop => hoop.turnType), 'turning hoops planned');
  assert.ok(a.planned.some(hoop => hoop.obstacle), 'obstacles planned');
  const c = planRun(loadGame(), { seed: 20261117 });
  assert.notDeepEqual(c.planned, a.planned);
  const differing = c.planned.filter((hoop, i) => hoop.x !== a.planned[i].x).length;
  assert.ok(differing > 50, `${differing} of 62 hoop positions differ`);
});

test('sound, embers, particles and art between spawns do not change the seeded hoops', () => {
  const quiet = planRun(loadGame(), { seed: 777 });
  const busy = planRun(loadGame(), {
    seed: 777,
    between: `
      muted = false;
      playTone = () => {};
      playNoise = () => {};
      for (const name of ['rim', 'net', 'board', 'wall', 'score']) realPlayGameSound(name, { strength: 1 });
      for (let i = 0; i < 25; i++) Math.random();
      burst(hoop.x, hoop.y);
      triggerHoopScoreEffect(hoop, { swish: true, wall: true });
      emitFlameEmber(getFlameStyle(BALL_EFFECT_PRESETS.classic, false), hoop.x, hoop.y);
      shake = 4;
      draw();
    `
  });
  assert.deepEqual(busy.planned, quiet.planned);
});

test('every new run starts its rng again from that run seed', () => {
  const g = loadGame();
  const first = planRun(g, { seed: 4242, count: 20 });
  const second = planRun(g, { seed: 4242, count: 20 });
  assert.deepEqual(second.planned, first.planned);
  // An ordinary run picks a fresh seed once, at its start.
  const seeds = new Set([planRun(g, { count: 1 }).seed, planRun(g, { count: 1 }).seed, planRun(g, { count: 1 }).seed]);
  assert.equal(seeds.size, 3);
  for (const seed of seeds) assert.ok(Number.isInteger(seed) && seed >= 0 && seed < 2 ** 32);
});

test('only cosmetic code and the run-seed pick use Math.random in game.js', async () => {
  const { readFileSync } = await import('node:fs');
  const source = readFileSync(new URL('../game.js', import.meta.url), 'utf8');
  const owners = [];
  for (const match of source.matchAll(/Math\.random\(/g)) {
    const before = source.slice(0, match.index);
    const functions = [...before.matchAll(/function (\w+)\(/g)];
    owners.push(functions.at(-1)[1]);
  }
  // createRunSeed: the single entry point that picks a normal run's seed.
  // The rest is presentation: flame embers, sound variation and noise, the cosmetic random().
  assert.deepEqual([...new Set(owners)].sort(), ['createRunSeed', 'playGameSound', 'playNoise', 'random', 'updateCelFlame']);
});

test('coin and shot-clock intervals come from the run seed, on a stream of their own', () => {
  const rollIntervals = (randomSeed) => JSON.parse(loadGame({ randomSeed }).evaluate(`
    resetGame(false, 99);
    const coins = [coinTargetsRemaining];
    const shots = [timedShotOpportunitiesRemaining];
    for (let i = 0; i < 12; i++) {
      scheduleNextCoin();
      coins.push(coinTargetsRemaining);
      timedShotActive = true;
      consumeTimedShotChallenge();
      shots.push(timedShotOpportunitiesRemaining);
    }
    JSON.stringify({ coins, shots, coinRange: [COIN_INTERVAL_MIN, COIN_INTERVAL_MAX], shotRange: [TIMED_SHOT_INTERVAL_MIN, TIMED_SHOT_INTERVAL_MAX] });
  `));
  // Different cosmetic randomness, same run seed: the same coins and shot clocks.
  const a = rollIntervals(1);
  assert.deepEqual(rollIntervals(2), a);
  for (const value of a.coins) assert.ok(value >= a.coinRange[0] && value <= a.coinRange[1]);
  for (const value of a.shots) assert.ok(value >= a.shotRange[0] && value <= a.shotRange[1]);
  assert.ok(new Set(a.coins).size > 1 && new Set(a.shots).size > 1, 'intervals still vary');
  // Collecting coins or meeting shot clocks never shifts the hoop sequence.
  const plain = planRun(loadGame(), { seed: 99, count: 30 });
  const busy = planRun(loadGame(), { seed: 99, count: 30, between: 'scheduleNextCoin(); timedShotActive = true; consumeTimedShotChallenge();' });
  assert.deepEqual(busy.planned, plain.planned);
});
