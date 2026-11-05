import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from './helpers/game-harness.mjs';

function loadQuietGame() {
  const game = loadGame();
  game.evaluate('ensureAudio = () => {}; playGameSound = () => {}; gameBooted = true;');
  return game;
}

// Fires the ghost hand's pull from the resting ball and steps until a basket or a reset.
function shootGhostPull(game) {
  return game.evaluate(`(() => {
    const pull = tutorial.guide.pull;
    const velocity = Physics.getLaunchVelocity(pull, FLIGHT_PARAMS);
    const target = targetHoopId;
    ball.vx = velocity.vx; ball.vy = velocity.vy; ball.held = false;
    ball.touchedHoop = false; ball.touchedWall = false; ball.wallBounceCount = 0; ball.apexY = ball.y;
    ball.launchHoopId = currentHoopId; ball.launchInsideNet = true; ball.launchFrame = getLaunchFrame(getHoopById(currentHoopId), pull);
    for (let i = 0; i < 400 && targetHoopId === target; i += 1) updateFixedStep(1 / 120);
    return { scored: targetHoopId !== target, perfect: lastWasPerfect };
  })()`);
}

test('new players get the lesson, players with progress skip it, settings can replay it', () => {
  const fresh = loadQuietGame();
  fresh.evaluate('best = 0; stats = createDefaultStats(); initTutorial()');
  assert.equal(fresh.evaluate('isLessonDone()'), false);
  const veteran = loadQuietGame();
  veteran.evaluate('best = 40; initTutorial()');
  assert.equal(veteran.evaluate('isLessonDone()'), true);
  assert.equal(veteran.evaluate('tutorial.seen.size'), veteran.evaluate('BASIC_TIP_IDS.length'));
  // Players who finished the old tutorial ("aim" seen) are not sent back to school.
  const oldTutorial = loadQuietGame();
  oldTutorial.evaluate('tutorial.seen = new Set(["aim"])');
  assert.equal(oldTutorial.evaluate('isLessonDone()'), true);
  veteran.evaluate('replayTutorial()');
  assert.equal(veteran.evaluate('isLessonDone()'), false, 'settings can replay it');
});

// The ghost hand must demonstrate a shot that really scores, and cleanly (a swish).
test('the lesson teaches the pull and the swish with shots that really work, then returns to the menu', () => {
  for (let run = 0; run < 20; run += 1) {
    const game = loadQuietGame();
    game.evaluate('best = 0; stats = createDefaultStats(); initTutorial(); startGame()');
    assert.equal(game.evaluate('lesson.active'), true);
    assert.equal(game.evaluate('tutorial.tipId'), 'aim');
    assert.equal(game.evaluate('Boolean(tutorial.guide && tutorial.guide.pull)'), true, 'a working pull was found');
    const result = shootGhostPull(game);
    assert.equal(result.scored, true, `run ${run}: the demonstrated shot scores`);
    assert.equal(result.perfect, true, `run ${run}: the demonstrated shot is a swish`);
    assert.equal(game.evaluate('tutorial.tipId'), 'lessonDone');
    // The last line shows briefly, then the player lands on the menu, taught.
    game.evaluate('for (let i = 0; i < 400 && state === "playing"; i += 1) updateFixedStep(1 / 120)');
    assert.equal(game.evaluate('state'), 'menu');
    assert.equal(game.evaluate('isLessonDone()'), true);
    assert.equal(game.evaluate('lesson.active'), false);
    // Practice never counts.
    assert.equal(game.evaluate('best'), 0);
    assert.equal(game.evaluate('stats.perfectBaskets || 0'), 0);
  }
});

test('a rim-touching basket asks for a swish, and a miss in the lesson never ends the run', () => {
  const game = loadQuietGame();
  game.evaluate('best = 0; stats = createDefaultStats(); initTutorial(); startGame()');
  game.evaluate(`
    const target = getHoopById(targetHoopId);
    const entry = hoopToWorld(target, 0, 6);
    Object.assign(ball, { x: entry.x, y: entry.y, prevX: entry.x, prevY: entry.y - 4, vx: 0, vy: 300, held: false, touchedHoop: true, touchedWall: false, apexY: entry.y });
    scoreTargetHoop(target);
  `);
  assert.equal(game.evaluate('lesson.step'), 'swish');
  assert.equal(game.evaluate('tutorial.tipId'), 'lessonSwish');
  assert.equal(game.evaluate('lesson.active'), true);
  // Let the ball settle, then throw it away: the lesson puts it back instead of game over.
  game.evaluate('for (let i = 0; i < 60; i += 1) updateFixedStep(1 / 120); updatePresentation(1 / 60)');
  assert.equal(game.evaluate('Boolean(tutorial.guide && tutorial.guide.pull)'), true, 'a new demo for the next hoop');
  game.evaluate(`
    Object.assign(ball, { held: false, settle: null, vx: 0, vy: 900, launchHoopId: -1, launchInsideNet: false });
    for (let i = 0; i < 400 && !ball.held; i += 1) updateFixedStep(1 / 120);
  `);
  assert.equal(game.evaluate('state'), 'playing');
  assert.equal(game.evaluate('ball.held'), true);
  assert.equal(game.evaluate('lesson.active'), true);
});

test('tips show once and are remembered', () => {
  const game = loadQuietGame();
  game.evaluate('best = 0; stats = createDefaultStats(); initTutorial(); resetGame(false)');
  game.evaluate('showTip("coin")');
  assert.equal(game.evaluate('tutorial.tipId'), 'coin');
  assert.equal(game.evaluate('tutorial.seen.has("coin")'), true);
  game.evaluate('hideTip(); showTip("coin")');
  assert.equal(game.evaluate('tutorial.tipId'), null, 'a seen tip does not come back');
});

test('returning players go straight into a normal run', () => {
  const game = loadQuietGame();
  game.evaluate('best = 10; initTutorial(); startGame()');
  assert.equal(game.evaluate('lesson.active'), false);
  assert.equal(game.evaluate('tutorial.guide'), null);
  assert.equal(game.evaluate('tutorial.tipId'), null);
});
