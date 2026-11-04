import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from './helpers/game-harness.mjs';

function loadQuietGame() {
  const game = loadGame();
  game.evaluate('ensureAudio = () => {}; playGameSound = () => {}');
  return game;
}

test('new players get the tutorial, players with progress skip it', () => {
  const fresh = loadQuietGame();
  fresh.evaluate('best = 0; stats = createDefaultStats(); initTutorial()');
  assert.equal(fresh.evaluate('tutorial.seen.size'), 0);
  const veteran = loadQuietGame();
  veteran.evaluate('best = 40; initTutorial()');
  assert.equal(veteran.evaluate('tutorial.seen.size'), veteran.evaluate('TUTORIAL_TIP_IDS.length'));
  veteran.evaluate('gameBooted = true; replayTutorial()');
  assert.equal(veteran.evaluate('tutorial.seen.size'), 0, 'settings can replay it');
});

// The ghost hand must demonstrate a shot that really scores with the real flight.
test('the ghost hand shows a pull that scores the first basket', () => {
  for (let run = 0; run < 30; run += 1) {
    const game = loadQuietGame();
    game.evaluate('best = 0; stats = createDefaultStats(); initTutorial(); resetGame(false); beginAimGuide()');
    assert.equal(game.evaluate('Boolean(tutorial.guide && tutorial.guide.pull)'), true, 'a working pull was found');
    const scored = game.evaluate(`(() => {
      const pull = tutorial.guide.pull;
      const velocity = Physics.getLaunchVelocity(pull, FLIGHT_PARAMS);
      ball.vx = velocity.vx; ball.vy = velocity.vy; ball.held = false;
      ball.touchedHoop = false; ball.touchedWall = false; ball.wallBounceCount = 0;
      ball.launchHoopId = currentHoopId; ball.launchInsideNet = true;
      for (let i = 0; i < 400 && score === 0; i += 1) updateFixedStep(1 / 120);
      return score > 0;
    })()`);
    assert.equal(scored, true, `run ${run}: the demonstrated shot scores`);
    assert.equal(game.evaluate('tutorial.guide'), null, 'scoring ends the guide');
    assert.equal(game.evaluate('tutorial.seen.has("aim")'), true);
  }
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

test('returning players never see the aim guide', () => {
  const game = loadQuietGame();
  game.evaluate('best = 10; initTutorial(); resetGame(false); beginAimGuide()');
  assert.equal(game.evaluate('tutorial.guide'), null);
  assert.equal(game.evaluate('tutorial.tipId'), null);
});
