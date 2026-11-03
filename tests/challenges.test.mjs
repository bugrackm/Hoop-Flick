import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from './helpers/game-harness.mjs';

// Shop calls play UI sounds; the harness has no AudioContext.
function loadQuietGame() {
  const game = loadGame();
  game.evaluate('ensureAudio = () => {}; playGameSound = () => {}');
  return game;
}

const owned = (game, id) => game.evaluate(`ownedBallSkins.has(${JSON.stringify(id)})`);

test('challenge balls are never sold and cannot be bought with coins', () => {
  const game = loadQuietGame();
  const challengeIds = JSON.parse(game.evaluate('JSON.stringify(CHALLENGE_SKIN_ORDER)'));
  assert.equal(challengeIds.length, 6);
  game.evaluate('coins = 100000');
  for (const id of challengeIds) {
    assert.equal(game.evaluate(`ECONOMY_PRICES.ball[${JSON.stringify(id)}]`), undefined, `${id} has no price`);
    assert.equal(game.evaluate(`buyBallSkin(${JSON.stringify(id)})`), false);
    game.evaluate(`selectBallSkin(${JSON.stringify(id)})`);
    assert.equal(owned(game, id), false, `${id} stays locked after a tap`);
    game.evaluate('closeShopDialog()');
  }
  assert.equal(game.evaluate('coins'), 100000);
});

test('each challenge unlocks its ball exactly when its target is reached', () => {
  const game = loadQuietGame();
  const cases = [
    ['crystal', 'achievementState.perfectStreakBest = $'],
    ['phoenix', 'achievementState.runIgnitionsBest = $'],
    ['dragon', 'achievementState.dailyStreak = $'],
    ['storm', 'achievementState.bankPerfectBaskets = $'],
    ['disco', 'best = $'],
    ['galaxy', 'stats.perfectBaskets = $']
  ];
  for (const [id, setter] of cases) {
    const target = game.evaluate(`BALL_CHALLENGES.${id}.target`);
    game.evaluate(setter.replace('$', String(target - 1)));
    assert.equal(game.evaluate('evaluateBallChallenges(false)'), false, `${id} not yet`);
    assert.equal(owned(game, id), false);
    game.evaluate(setter.replace('$', String(target)));
    assert.equal(game.evaluate('evaluateBallChallenges(false)'), true, `${id} unlocks`);
    assert.equal(owned(game, id), true);
    assert.equal(game.evaluate('evaluateBallChallenges(false)'), false, `${id} unlocks once`);
  }
});

test('flame ignitions count per run and the best run persists', () => {
  const game = loadQuietGame();
  game.evaluate('resetGame(true)');
  game.evaluate('recordAchievementBasket(true, false, false, true); recordAchievementBasket(true, false, false, true)');
  assert.equal(game.evaluate('achievementState.runIgnitionsBest'), 2);
  assert.equal(owned(game, 'phoenix'), false);
  game.evaluate('resetGame(true)');
  assert.equal(game.evaluate('runIgnitions'), 0);
  assert.equal(game.evaluate('achievementState.runIgnitionsBest'), 2, 'best survives a new run');
  game.evaluate('recordAchievementBasket(true, false, false, true); recordAchievementBasket(true, false, false, true)');
  assert.equal(owned(game, 'phoenix'), false, 'two per run is not three');
  game.evaluate('recordAchievementBasket(true, false, false, true)');
  assert.equal(owned(game, 'phoenix'), true);
});

test('scoring counts an ignition when a perfect chain reaches the skin threshold', () => {
  const game = loadQuietGame();
  game.evaluate('resetGame(true); applyBallSkin("classic", false)');
  const threshold = game.evaluate('getFlameThreshold()');
  assert.equal(threshold, 3, 'classic lights on the third perfect');
  const swish = () => game.evaluate('ball.touchedHoop = false; ball.touchedWall = false; scoreTargetHoop(getHoopById(targetHoopId))');
  swish();
  swish();
  assert.equal(game.evaluate('runIgnitions'), 0);
  swish();
  assert.equal(game.evaluate('runIgnitions'), 1, 'third perfect lights the flame');
  swish();
  assert.equal(game.evaluate('runIgnitions'), 1, 'staying on fire is not a new ignition');
  game.evaluate('ball.touchedHoop = true; scoreTargetHoop(getHoopById(targetHoopId))');
  swish();
  swish();
  swish();
  assert.equal(game.evaluate('runIgnitions'), 2, 'a new chain lights it again');
});

test('unlocked balls are queued as ball toasts', () => {
  const game = loadQuietGame();
  game.evaluate('achievementState.perfectStreakBest = 8; stats.perfectBaskets = 150');
  assert.equal(game.evaluate('evaluateBallChallenges(true)'), true);
  const queue = JSON.parse(game.evaluate('JSON.stringify(achievementToastQueue)'));
  assert.deepEqual(queue.filter((entry) => entry.kind === 'ball').map((entry) => entry.id), ['crystal', 'galaxy']);
});

test('only perfect bank shots count toward the storm ball', () => {
  const game = loadQuietGame();
  game.evaluate('recordAchievementBasket(false, true, false, false); recordAchievementBasket(true, false, false, false)');
  assert.equal(game.evaluate('achievementState.bankPerfectBaskets'), 0);
  game.evaluate('recordAchievementBasket(true, true, false, false)');
  assert.equal(game.evaluate('achievementState.bankPerfectBaskets'), 1);
});

test('buying asks first and charges only after confirming', () => {
  const game = loadQuietGame();
  game.evaluate('coins = 500; selectedBallSkinId = "classic"');
  game.evaluate('selectBallSkin("zebra")');
  assert.equal(game.evaluate('coins'), 500, 'a tap alone never charges');
  assert.equal(owned(game, 'zebra'), false);
  assert.equal(game.evaluate('shopDialog.open'), true);
  game.evaluate('cancelShopDialog()');
  assert.equal(game.evaluate('coins'), 500);
  assert.equal(owned(game, 'zebra'), false, 'cancel buys nothing');

  game.evaluate('selectBallSkin("zebra"); confirmShopDialog()');
  assert.equal(game.evaluate('coins'), 300);
  assert.equal(owned(game, 'zebra'), true);
  assert.equal(game.evaluate('selectedBallSkinId'), 'zebra');
  assert.equal(game.evaluate('shopDialog.open'), false);

  game.evaluate('selectBallSkin("classic"); selectBallSkin("zebra")');
  assert.equal(game.evaluate('shopDialog.open'), false, 'owned balls switch without a dialog');
  assert.equal(game.evaluate('coins'), 300);
});

test('theme purchases also wait for confirmation', () => {
  const game = loadQuietGame();
  game.evaluate('resetGame(true); coins = 300');
  game.evaluate('selectTheme("sunset")');
  assert.equal(game.evaluate('coins'), 300);
  assert.equal(game.evaluate('ownedThemes.has("sunset")'), false);
  game.evaluate('confirmShopDialog()');
  assert.equal(game.evaluate('coins'), 100);
  assert.equal(game.evaluate('ownedThemes.has("sunset")'), true);
  assert.equal(game.evaluate('selectedThemeId'), 'sunset');
});

test('not enough coins shows no dialog', () => {
  const game = loadQuietGame();
  game.evaluate('coins = 10; selectBallSkin("zebra")');
  assert.equal(game.evaluate('shopDialog.open'), false);
  assert.equal(owned(game, 'zebra'), false);
});

test('challenge progress and unlocked balls survive a save round trip', () => {
  const game = loadQuietGame();
  game.evaluate('achievementState.runIgnitionsBest = 2; achievementState.bankPerfectBaskets = 4; ownedBallSkins.add("crystal"); selectedBallSkinId = "crystal"');
  const saved = game.evaluate('JSON.stringify(makeSaveObject())');
  const restored = loadQuietGame();
  const migrated = restored.evaluate(`(() => { const m = migrateSaveData(JSON.parse(${JSON.stringify(saved)}), true); applyMigratedSave(m); return m.needsMigration; })()`);
  assert.equal(migrated, false, 'a fresh save is already canonical');
  assert.equal(restored.evaluate('achievementState.runIgnitionsBest'), 2);
  assert.equal(restored.evaluate('achievementState.bankPerfectBaskets'), 4);
  assert.equal(owned(restored, 'crystal'), true);
  assert.equal(restored.evaluate('selectedBallSkinId'), 'crystal');
});

test('older saves without challenge counters migrate to zero', () => {
  const game = loadQuietGame();
  const save = JSON.parse(game.evaluate('JSON.stringify(makeSaveObject())'));
  delete save.achievements.runIgnitionsBest;
  delete save.achievements.bankPerfectBaskets;
  const result = JSON.parse(game.evaluate(`JSON.stringify((() => { const m = migrateSaveData(${JSON.stringify(save)}, true); return { needs: m.needsMigration, a: m.achievements }; })())`));
  assert.equal(result.needs, true);
  assert.equal(result.a.runIgnitionsBest, 0);
  assert.equal(result.a.bankPerfectBaskets, 0);
});

test('game over points at the locked challenge closest to done', () => {
  const game = loadQuietGame();
  game.evaluate('stats.perfectBaskets = 140; achievementState.perfectStreakBest = 2');
  assert.equal(game.evaluate('getNextBallChallengeId()'), 'galaxy');
  game.evaluate('ownedBallSkins.add("galaxy")');
  assert.equal(game.evaluate('getNextBallChallengeId()'), 'crystal', 'next best ratio: 2 of 8 perfects in a row');
  for (const id of JSON.parse(game.evaluate('JSON.stringify(CHALLENGE_SKIN_ORDER)'))) game.evaluate(`ownedBallSkins.add(${JSON.stringify(id)})`);
  assert.equal(game.evaluate('getNextBallChallengeId()'), null);
});

test('the all-balls achievement needs every shop ball and ignores challenge balls', () => {
  const game = loadQuietGame();
  const shopIds = JSON.parse(game.evaluate('JSON.stringify(BALL_SKIN_DISPLAY_ORDER)'));
  assert.equal(game.evaluate('ACHIEVEMENT_BY_ID.ball_collection_all.target'), shopIds.length);
  for (const id of JSON.parse(game.evaluate('JSON.stringify(CHALLENGE_SKIN_ORDER)'))) game.evaluate(`ownedBallSkins.add(${JSON.stringify(id)})`);
  for (const id of shopIds.slice(0, -1)) game.evaluate(`ownedBallSkins.add(${JSON.stringify(id)})`);
  game.evaluate('evaluateAchievements({ metrics: ["ballCollection", "shopBallCollection"], announce: false, persist: false })');
  assert.equal(game.evaluate('achievementState.unlockedIds.includes("ball_collection_all")'), false, 'one shop ball missing');
  game.evaluate(`ownedBallSkins.add(${JSON.stringify(shopIds.at(-1))})`);
  game.evaluate('evaluateAchievements({ metrics: ["shopBallCollection"], announce: false, persist: false })');
  assert.equal(game.evaluate('achievementState.unlockedIds.includes("ball_collection_all")'), true);
});

test('a newly earned challenge ball stays marked new until the ball shop is left', () => {
  const game = loadQuietGame();
  game.evaluate('achievementState.perfectStreakBest = 8; evaluateBallChallenges(false)');
  assert.deepEqual(JSON.parse(game.evaluate('JSON.stringify(getNewBallIds())')), ['crystal']);
  const saved = JSON.parse(game.evaluate('JSON.stringify(makeSaveObject())'));
  assert.deepEqual(saved.achievements.newBallIds, ['crystal'], 'the mark survives a reload');
  game.evaluate('setGameState("customize")');
  assert.deepEqual(JSON.parse(game.evaluate('JSON.stringify(getNewBallIds())')), ['crystal'], 'still new while browsing');
  game.evaluate('setGameState("menu")');
  assert.deepEqual(JSON.parse(game.evaluate('JSON.stringify(getNewBallIds())')), []);
});

test('bought shop balls and unknown ids are never marked new', () => {
  const game = loadQuietGame();
  game.evaluate('coins = 500; selectBallSkin("zebra"); confirmShopDialog()');
  assert.equal(owned(game, 'zebra'), true, 'the purchase went through');
  assert.deepEqual(JSON.parse(game.evaluate('JSON.stringify(getNewBallIds())')), []);
  const normalized = JSON.parse(game.evaluate('JSON.stringify(normalizeAchievementState({ newBallIds: ["zebra", "galaxy", "nope", 3, "crystal"] }).newBallIds)'));
  assert.deepEqual(normalized, ['crystal', 'galaxy'], 'challenge ids only, in shop order');
});
