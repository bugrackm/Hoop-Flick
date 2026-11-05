import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { loadGame, progressionSource } from './helpers/game-harness.mjs';

function loadProgression() {
  const sandbox = vm.createContext({});
  vm.runInContext(progressionSource, sandbox);
  return sandbox.HoopFlickProgression;
}

const P = loadProgression();

// A quiet, seeded game: same spawns every run, no DOM side effects.
function loadSeededGame(seed = 0x2545f491) {
  const g = loadGame();
  g.evaluate(`
    let seed = ${seed};
    Math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    playGameSound = () => {};
    showTip = () => {};
  `);
  return g;
}

// Climbs one run: every new hoop becomes the target, then the current hoop, like real baskets.
// Returns one record per spawned transition.
function climb(g, { transitions = 140, pointsPerBasket = 2 } = {}) {
  return JSON.parse(g.evaluate(`
    resetGame(false);
    state = 'playing';
    const records = [];
    let s = 0;
    for (let t = 0; t < ${transitions}; t++) {
      s += ${pointsPerBasket};
      score = s;
      const last = hoops[hoops.length - 1];
      const previousBreather = transitionHistory.breather;
      const hoop = nextHoop();
      const features = [
        hoop.moving ? (hoop.movementType === 'vertical' ? 'lift' : hoop.movementType === 'orbit' ? 'orbit' : 'slide') : null,
        hoop.turnType || (Math.abs(hoop.baseRotation) > 0.001 ? 'tilt' : null),
        hoop.obstacle ? hoop.obstacle.kind : null,
        hoop.board ? 'board' : null
      ].filter(Boolean);
      records.push({
        score: s, id: hoop.id, intro: hoop.intro, features, previousBreather,
        reachable: features.length ? isReachableTransition(last, hoop) : true,
        obstacleFair: hoop.obstacle ? isObstaclePlacementFair(hoop.obstacle, last, hoop, getReachabilityPoses(hoop).all,
          getReachabilityPoses(hoop).all.map(pose => getReachingShots(last, hoop, pose))) : true
      });
      setHoopRoles(last.id, hoop.id);
      currentHoopId = last.id;
      targetHoopId = hoop.id;
    }
    JSON.stringify(records);
  `));
}

test('progression module is pure, frozen and ordered', () => {
  assert.ok(Object.isFrozen(P));
  assert.ok(Object.isFrozen(P.MECHANICS));
  assert.doesNotMatch(progressionSource, /Math\.random/);
  const unlocks = P.MECHANIC_ORDER.map(mechanic => P.MECHANICS[mechanic].unlock);
  assert.deepEqual([...unlocks], [...unlocks].sort((a, b) => a - b));
  // No mechanic unlocks on top of the shot clock.
  assert.ok(!P.MECHANIC_ORDER.some(mechanic => P.MECHANICS[mechanic].unlock === P.SHOT_CLOCK_SCORE));
});

test('mechanic intensity ramps from the unlock to full strength and intros are the gentlest', () => {
  for (const mechanic of P.MECHANIC_ORDER) {
    const { unlock } = P.MECHANICS[mechanic];
    assert.equal(P.getIntensity(mechanic, unlock - 1), 0);
    assert.equal(P.getIntensity(mechanic, unlock), 0);
    assert.equal(P.getIntensity(mechanic, unlock + P.RAMP_SCORE * 2), 1);
    const intro = P.getMechanicParams(mechanic, unlock + 90, () => 0.9, true);
    const later = P.getMechanicParams(mechanic, unlock + 90, () => 0.5, false);
    for (const [key, range] of Object.entries(P.MECHANICS[mechanic].params)) {
      assert.equal(intro[key], range[0], `${mechanic}.${key} intro`);
      const low = Math.min(...range);
      const high = Math.max(...range);
      assert.ok(later[key] >= low && later[key] <= high, `${mechanic}.${key} in range`);
    }
  }
  assert.ok(P.canCombine('tilt', 'slide') && P.canCombine('slide', 'tilt'), 'pairs are symmetric');
  assert.ok(!P.canCombine('spin', 'bar'), 'spin always stays alone');
});

test('every mechanic first appears at its unlock score, alone, in ladder order, then two calm hoops', () => {
  const records = climb(loadSeededGame(), { transitions: 140, pointsPerBasket: 2 });
  const intros = records.filter(record => record.intro);
  // vm realms: compare plain copies.
  assert.deepEqual(intros.map(record => record.intro), [...P.MECHANIC_ORDER.filter(mechanic => P.MECHANICS[mechanic].intro)]);
  for (const mechanic of P.MECHANIC_ORDER) {
    const { unlock } = P.MECHANICS[mechanic];
    for (const record of records) {
      if (record.score < unlock) assert.ok(!record.features.includes(mechanic), `${mechanic} before ${unlock} at ${record.score}`);
    }
  }
  for (const intro of intros) {
    assert.deepEqual(intro.features, [intro.intro], `${intro.intro} intro is alone`);
    const index = records.indexOf(intro);
    for (const calm of records.slice(index + 1, index + 3)) {
      assert.equal(calm.features.length, 0, `calm hoop after the ${intro.intro} intro`);
    }
  }
});

test('the ladder gets busier with score and combines two features only near the top', () => {
  const records = [];
  for (const seed of [11, 22, 33, 44, 55, 66]) records.push(...climb(loadSeededGame(seed), { transitions: 130, pointsPerBasket: 2 }));
  const share = (from, to) => {
    const band = records.filter(record => record.score >= from && record.score < to);
    return band.filter(record => record.features.length > 0).length / band.length;
  };
  const early = share(10, 50);
  const middle = share(50, 150);
  const late = share(150, 1e9);
  assert.ok(early < middle && middle < late, `featured share rises: ${early.toFixed(2)} < ${middle.toFixed(2)} < ${late.toFixed(2)}`);
  assert.ok(late > 0.5, `most late hoops carry a challenge (${late.toFixed(2)})`);
  assert.ok(!records.some(record => record.score < P.COMBO_SCORE && record.features.length > 1), 'no combos before COMBO_SCORE');
  assert.ok(records.some(record => record.features.length > 1), 'combos do appear');
  for (const record of records.filter(record => record.features.length > 1)) {
    assert.ok(P.canCombine(record.features[0], record.features[1]), `allowed pair ${record.features}`);
  }
});

test('every featured hoop is reachable and every obstacle placement is fair', () => {
  for (const seed of [7, 8, 9]) {
    const records = climb(loadSeededGame(seed), { transitions: 150, pointsPerBasket: 2 });
    for (const record of records) {
      assert.ok(record.reachable, `hoop ${record.id} (${record.features}) at ${record.score} is reachable`);
      assert.ok(record.obstacleFair, `obstacle on hoop ${record.id} at ${record.score} is fair`);
    }
    assert.ok(records.some(record => ['bar', 'peg', 'slider', 'spinner'].some(kind => record.features.includes(kind))), 'obstacles appear');
  }
});

test('spawning a hoop stays cheap even with obstacles', () => {
  const g = loadSeededGame(99);
  const result = JSON.parse(g.evaluate(`
    resetGame(false);
    state = 'playing';
    const times = [];
    for (let t = 0; t < 400; t++) {
      score = 40 + (t % 8) * 30;
      const before = performance.now();
      nextHoop();
      times.push(performance.now() - before);
    }
    times.sort((a, b) => a - b);
    JSON.stringify({ p95: times[Math.floor(times.length * 0.95)], max: times.at(-1) });
  `));
  // Generous for slow CI; on a desktop the worst case is ~5 ms.
  assert.ok(result.p95 < 8, `p95 ${result.p95.toFixed(2)} ms`);
  assert.ok(result.max < 60, `max ${result.max.toFixed(2)} ms`);
});

test('swinging and spinning hoops follow simulation time exactly at any frame rate', () => {
  let reference;
  for (const hz of [30, 60, 144]) {
    const g = loadSeededGame(5);
    g.evaluate(`
      gameBooted = true;
      state = 'playing';
      const source = makeHoop(140, 563, 0, null);
      const swing = makeHoop(280, 380, 1, source, { features: { motion: null, turn: 'swing', board: false, obstacle: null }, params: { swing: { degrees: 30, speed: 1.6 } } });
      const spin = makeHoop(200, 200, 2, swing, { features: { motion: 'orbit', turn: 'spin', board: false, obstacle: null }, params: { spin: { speed: 1.2 }, orbit: { radius: 20, speed: 1.5 } } });
      source.role = HOOP_ROLE.CURRENT;
      swing.role = HOOP_ROLE.TARGET;
      spin.role = HOOP_ROLE.TARGET;
      hoops = [source, swing, spin];
      placeBallInHoop(source);
    `);
    let now = 0;
    for (let frame = 0; frame < hz * 2; frame++) {
      now += 1000 / hz;
      g.evaluate(`loop(${now}, animationLoopGeneration, false)`);
    }
    const result = JSON.parse(g.evaluate(`JSON.stringify({ t: simulationTime, hoops: hoops.map(h => ({ x: h.x, y: h.y, r: h.rotation })) })`));
    if (!reference) reference = result;
    else assert.deepEqual(result, reference, `${hz} Hz`);
  }
  assert.notEqual(reference.hoops[1].r, 0, 'the swing hoop is turned');
});

test('a scored tilted or spinning hoop rights itself around the ball while it settles', () => {
  for (const turn of ['tilt', 'swing', 'spin']) {
    const g = loadGame();
    const result = JSON.parse(g.evaluate(`
      showTip = () => {};
      playGameSound = () => {};
      state = 'playing';
      const source = makeHoop(140, 563, 0, null);
      const params = { tilt: { degrees: 35 }, swing: { degrees: 30, speed: 1.6 }, spin: { speed: 1.2 } };
      const target = makeHoop(280, 380, 1, source, { features: { motion: null, turn: '${turn}', board: false, obstacle: null }, params });
      target.rotation = 0.6;
      hoops = [source, target];
      currentHoopId = 0;
      targetHoopId = 1;
      setHoopRoles(0, 1);
      const rest = hoopToWorld(target, 0, NET_REST_Y);
      const entry = hoopToWorld(target, 0, 6);
      Object.assign(ball, { x: entry.x, y: entry.y, prevX: entry.x, prevY: entry.y - 4, vx: 0, vy: 300, held: false, touchedHoop: false, touchedWall: false, apexY: entry.y });
      scoreTargetHoop(target);
      for (let i = 0; i < 60 && ball.settle; i++) updateFixedStep(Physics.FIXED_DT);
      const after = hoopToWorld(target, 0, NET_REST_Y);
      JSON.stringify({ rotation: target.rotation, turnType: target.turnType, held: ball.held, rest, after, ball: { x: ball.x, y: ball.y } });
    `));
    assert.equal(result.rotation, 0, `${turn} is upright`);
    assert.equal(result.turnType, null, `${turn} stopped turning`);
    assert.equal(result.held, true);
    assert.ok(Math.abs(result.after.x - result.rest.x) < 1e-6 && Math.abs(result.after.y - result.rest.y) < 1e-6, `${turn} pivots on the resting point`);
    assert.ok(Math.abs(result.ball.x - result.rest.x) < 1e-6 && Math.abs(result.ball.y - result.rest.y) < 1e-6, `${turn} ball rests there`);
  }
});

test('a high drop earns exactly one extra point, never doubled, inside the one score cue', () => {
  const g = loadGame();
  const result = JSON.parse(g.evaluate(`
    const played = [];
    playGameSound = (name, detail) => played.push({ name, detail });
    recordAchievementBasket = () => false;
    showTip = () => {};
    state = 'playing';
    const runs = [];
    for (const [apexAbove, wall] of [[HIGH_ARC_HEIGHT - 1, false], [HIGH_ARC_HEIGHT, false], [HIGH_ARC_HEIGHT + 80, true]]) {
      hoops = [makeHoop(210, 600, 0, null), makeHoop(300, 420, 1, null)];
      currentHoopId = 0;
      targetHoopId = 1;
      setHoopRoles(0, 1);
      score = 0;
      swishStreak = 0;
      Object.assign(ball, { x: 300, y: 425, vx: 0, vy: 200, held: false, touchedHoop: true, touchedWall: wall, apexY: 420 - apexAbove });
      played.length = 0;
      scoreTargetHoop(hoops[1]);
      runs.push({ gain: lastScoreGain, text: scoreFeedbackText, sounds: played.map(p => p.name), highArc: played[0].detail.highArc });
    }
    JSON.stringify(runs);
  `));
  assert.equal(result[0].gain, 1);
  assert.equal(result[0].highArc, false);
  assert.equal(result[1].gain, 2, 'plain basket + 1');
  assert.equal(result[1].highArc, true);
  assert.match(result[1].text, /Yüksek|High/);
  assert.equal(result[2].gain, 3, 'bank shot ×2, then + 1 (not doubled)');
  for (const run of result) assert.deepEqual(run.sounds, ['score']);
});

test('an intro that can never be placed steps aside instead of blocking the rest of the ladder', () => {
  const g = loadSeededGame(321);
  // No obstacle can ever be placed: bar, peg, slider and spinner intros all fail.
  g.evaluate('placeObstacle = () => null;');
  const records = climb(g, { transitions: 120, pointsPerBasket: 2 });
  const intros = records.filter(record => record.intro).map(record => record.intro);
  for (const mechanic of ['swing', 'lift', 'orbit', 'spin']) {
    assert.ok(intros.includes(mechanic), `${mechanic} is still introduced (${intros})`);
  }
  assert.ok(!intros.some(mechanic => ['bar', 'peg', 'slider', 'spinner'].includes(mechanic)), 'failed intros never count as shown');
});
