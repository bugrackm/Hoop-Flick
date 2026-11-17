import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from './helpers/game-harness.mjs';

function setup({ kind = 'bar', language = 'en', time = 0 } = {}) {
  const g = loadGame({ randomSeed: 0x17baba, now: Date.UTC(2026, 10, 17, 12) });
  g.evaluate(`
    gameBooted = true;
    state = 'playing';
    playGameSound = () => {};
    showTip = () => {};
    language = ${JSON.stringify(language)};
    simulationTime = ${time};
    const source = makeHoop(140, 563, 0, null);
    const target = makeHoop(290, 380, 1, source);
    target.obstacle = Obstacles.create({ kind: '${kind}', x: 210, y: 470, angle: 0, phase: 0 });
    hoops = [source, target];
    currentHoopId = 0;
    targetHoopId = 1;
    setHoopRoles(0, 1);
    placeBallInHoop(source);
    hasReachedSecondHoop = true;
    runShotCount = 1;
    missionState = {
      day: getLocalLoginDay(), bonusClaimed: false,
      missions: [
        { type: 'bankBaskets', tier: 0, target: 2, reward: 15, progress: 0, claimed: false },
        { type: 'baskets', tier: 1, target: 4, reward: 25, progress: 0, claimed: false },
        { type: 'runScore', tier: 2, target: 40, reward: 40, progress: 0, claimed: false }
      ]
    };
  `);
  return g;
}

// Exercise the live collision handler at the obstacle's current pose, without mocking contact.
function bounce(g, speed = 300) {
  return JSON.parse(g.evaluate(`
    const pose = Obstacles.getPose(hoops[1].obstacle, simulationTime);
    Object.assign(ball, { x: pose.x, y: pose.y - 1, vx: 0, vy: ${speed}, held: false, settle: null });
    collideActiveObstacle(Physics.FIXED_DT);
    JSON.stringify({ vy: ball.vy, touchedWall: ball.touchedWall, wallBounceCount: ball.wallBounceCount });
  `));
}

// Deliver the contacted flight through the real target-entry detection, without another collider.
function basket(g, { perfect = false, streak = 0, highArc = false } = {}) {
  return JSON.parse(g.evaluate(`
    swishStreak = ${streak};
    const target = getHoopById(targetHoopId);
    Object.assign(ball, {
      x: target.x, y: target.y + 6, prevX: target.x, prevY: target.y - 6,
      vx: 0, vy: 300, held: false, touchedHoop: ${!perfect},
      apexY: target.y - ${highArc ? 'HIGH_ARC_HEIGHT' : '0'}
    });
    detectHoopState();
    JSON.stringify({ gain: lastScoreGain, text: scoreFeedbackText, bounceCue: lastWasBounce });
  `));
}

test('wall banks double the swish gain once, with the high-arc point added afterward', () => {
  for (const walls of [0, 1, 2]) {
    for (const perfect of [false, true]) {
      const g = setup();
      g.evaluate(`for (let i = 0; i < ${walls}; i++) registerWallTouch(true);`);
      const result = basket(g, { perfect, streak: 2, highArc: true });
      assert.equal(result.gain, (perfect ? 4 : 1) * (walls ? 2 : 1) + 1);
      assert.equal(result.text.includes('Bounce'), walls > 0);
    }
  }
});

for (const kind of ['bar', 'peg', 'spinner', 'slider', 'pad', 'blinker']) {
  test(`a basket after a solid ${kind} contact earns the ricochet bonus`, () => {
    const g = setup({ kind });
    const contact = bounce(g);
    assert.ok(contact.vy < 0, 'the existing collision path reflects the ball');
    assert.equal(contact.touchedWall, false);
    assert.equal(contact.wallBounceCount, 0);
    const result = basket(g);
    assert.equal(result.gain, 2);
    assert.equal(result.text, 'Ricochet! · +2');
    assert.equal(result.bounceCue, true, 'use the bank popup styling and duration');
  });
}

test('obstacle-only banks get the same score shake, hoop effect and bank sound as wall banks', () => {
  for (const perfect of [false, true]) {
    const feedback = [];
    for (const contact of ['wall', 'obstacle']) {
      const g = setup();
      if (contact === 'wall') g.evaluate('registerWallTouch(true);');
      else bounce(g);
      g.evaluate(`
        globalThis.scoreSounds = [];
        globalThis.hoopEffects = [];
        playGameSound = (kind, options) => { if (kind === 'score') scoreSounds.push(options); };
        const originalHoopEffect = triggerHoopScoreEffect;
        triggerHoopScoreEffect = (hoop, result) => {
          hoopEffects.push(result);
          originalHoopEffect(hoop, result);
        };
      `);
      basket(g, { perfect, streak: 2 });
      feedback.push(JSON.parse(g.evaluate('JSON.stringify({ shake, scoreSounds, hoopEffects })')));
    }
    assert.equal(feedback[0].scoreSounds[0].wall, true);
    assert.equal(feedback[0].hoopEffects[0].wall, true);
    assert.deepEqual(feedback[1], feedback[0], `perfect=${perfect}`);
  }
});

test('a flight touching both wall and obstacle shows only the wall bank label', () => {
  const g = setup();
  bounce(g);
  g.evaluate('registerWallTouch(true);');
  assert.equal(basket(g).text, 'Bounce · +2');
});

test('no contact, an inactive obstacle and a non-solid blinker give no bonus', () => {
  for (const mode of ['no contact', 'inactive', 'non-solid']) {
    const g = setup({ kind: 'blinker' });
    if (mode === 'non-solid') g.evaluate(`
      const blinker = hoops[1].obstacle;
      simulationTime = blinker.period * (blinker.onShare + (1 - blinker.onShare) / 2) - blinker.phase;
      if (Obstacles.isSolid(blinker, simulationTime)) throw new Error('expected the off portion of the cycle');
    `);
    if (mode === 'inactive') g.evaluate('hoops[1].role = HOOP_ROLE.INACTIVE;');
    if (mode !== 'no contact') {
      assert.equal(bounce(g).vy, 300);
      g.evaluate('setHoopRoles(0, 1);');
    }
    assert.deepEqual(basket(g), { gain: 1, text: 'Nice · +1', bounceCue: false });
  }
});

test('wall and obstacle contacts share one multiplier, including swishes and high arcs', () => {
  for (const walls of [0, 1, 2]) {
    const g = setup();
    bounce(g);
    bounce(g);
    g.evaluate(`for (let i = 0; i < ${walls}; i++) registerWallTouch(true);`);
    const result = basket(g, { perfect: true, streak: 2, highArc: true });
    assert.equal(result.gain, 9);
    assert.equal((result.text.match(/Ricochet!/g) || []).length, walls ? 0 : 1);
    assert.equal(result.text.includes('Bounce'), walls > 0);
  }
});

test('obstacle-only baskets leave wall stats, missions and achievements untouched', () => {
  for (const walls of [0, 1, 2]) {
    const g = setup();
    bounce(g);
    g.evaluate(`for (let i = 0; i < ${walls}; i++) registerWallTouch(true);`);
    basket(g, { perfect: true });
    const result = JSON.parse(g.evaluate(`JSON.stringify({
      stats: stats.bounceBaskets, run: runBounceBaskets,
      best: achievementState.runBounceBest, lifetime: achievementState.lifetimeBounceBaskets,
      perfects: achievementState.bankPerfectBaskets, mission: missionState.missions[0].progress,
      first: achievementState.unlockedIds.includes('first_shot_bounce'),
      double: achievementState.unlockedIds.includes('double_bounce_basket')
    })`));
    const count = walls ? 1 : 0;
    assert.deepEqual(result, {
      stats: count, run: count, best: count, lifetime: count, perfects: count,
      mission: count, first: walls > 0, double: walls >= 2
    });
  }
});

test('ricochet feedback is translated in Turkish and English', () => {
  for (const [language, word] of [['tr', 'Sekme!'], ['en', 'Ricochet!']]) {
    const g = setup({ language });
    bounce(g);
    assert.equal(basket(g).text, `${word} · +2`);
  }
});

test('soft solid contact qualifies even below the impact-effects threshold', () => {
  const g = setup();
  assert.ok(bounce(g, 1).vy < 0);
  assert.equal(basket(g).gain, 2);
});

test('obstacle credit resets when placed in a hoop and on every release, including a recatch', () => {
  for (const reset of ['placement', 'release', 'recatch']) {
    const g = setup();
    bounce(g);
    assert.equal(g.evaluate('ball.touchedObstacle'), true);
    if (reset === 'placement') {
      g.evaluate('placeBallInHoop(hoops[0]);');
    } else {
      if (reset === 'recatch') g.evaluate('catchBallInCurrentHoop(hoops[0]);');
      g.evaluate(`
        activePointer = 1;
        drag = { pointerStartX: 0, pointerStartY: 0, pointerCurrentX: -60, pointerCurrentY: 80 };
        onPointerUp({ pointerId: 1, preventDefault() {} });
      `);
    }
    assert.equal(g.evaluate('ball.touchedObstacle'), false);
    assert.equal(basket(g).gain, 1);
  }
});

for (const contact of ['launcher rim', 'launcher net', 'target rim', 'launch-net walls']) {
  test(`${contact} contact leaves the obstacle flag clear`, () => {
    const g = setup();
    const result = JSON.parse(g.evaluate(`
      const hoop = hoops[${contact === 'target rim' ? 1 : 0}];
      const launchWall = ${contact === 'launch-net walls'};
      const net = ${contact === 'launcher net'};
      const point = hoopToWorld(hoop,
        launchWall ? hoop.w * 0.5 : net ? 0 : -hoop.w * 0.5 - 1,
        launchWall ? (LAUNCH_NET_TOP_Y + LAUNCH_NET_BOTTOM_Y) / 2
          : net ? LAUNCH_NET_BOTTOM_Y + ball.r - 1 : 0);
      Object.assign(ball, {
        x: point.x, y: point.y, prevX: point.x, prevY: point.y,
        vx: net ? 0 : 300, vy: net ? -300 : 0,
        held: false, settle: null, launchHoopId: launchWall ? hoop.id : -1,
        launchInsideNet: launchWall, launchFrame: launchWall ? getLaunchFrame(hoop, { x: 0, y: -1 }) : null
      });
      collideHoops(Physics.FIXED_DT);
      JSON.stringify({ touchedHoop: ball.touchedHoop, touchedObstacle: ball.touchedObstacle,
        reflected: ${contact === 'launcher net' ? 'ball.vy > 0' : 'ball.vx < 0'} });
    `));
    assert.equal(result.touchedHoop, true, 'the requested collider was actually touched');
    assert.equal(result.reflected, true, 'the collision reflected the incoming velocity');
    assert.equal(result.touchedObstacle, false);
    assert.equal(basket(g).gain, 1);
  });
}
