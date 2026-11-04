import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from './helpers/game-harness.mjs';

function loadQuietGame() {
  const game = loadGame();
  game.evaluate('ensureAudio = () => {}; playGameSound = () => {}');
  return game;
}

const json = (game, code) => JSON.parse(game.evaluate(`JSON.stringify(${code})`));

test('a day always gets the same three different missions, easy to hard', () => {
  const game = loadQuietGame();
  const a = json(game, 'generateDailyMissions("2026-11-04")');
  const b = json(game, 'generateDailyMissions("2026-11-04")');
  assert.deepEqual(a, b, 'same day, same set');
  assert.equal(a.missions.length, 3);
  assert.equal(new Set(a.missions.map((m) => m.type)).size, 3, 'no duplicate types');
  assert.deepEqual(a.missions.map((m) => m.tier), [0, 1, 2]);
  assert.deepEqual(a.missions.map((m) => m.reward), [15, 25, 40]);
  const days = new Set();
  for (let d = 1; d <= 20; d += 1) {
    days.add(game.evaluate(`generateDailyMissions("2026-12-${String(d).padStart(2, '0')}").missions.map((m) => m.type).join()`));
  }
  assert.ok(days.size > 5, 'different days give different sets');
});

test('score missions scale with the best score and stay within bounds', () => {
  const game = loadQuietGame();
  game.evaluate('best = 0');
  assert.deepEqual(json(game, '[0, 1, 2].map((tier) => getMissionTarget("runScore", tier))'), [15, 25, 40]);
  game.evaluate('best = 200');
  assert.deepEqual(json(game, '[0, 1, 2].map((tier) => getMissionTarget("runScore", tier))'), [70, 120, 170]);
  game.evaluate('best = 100000');
  assert.deepEqual(json(game, '[0, 1, 2].map((tier) => getMissionTarget("runScore", tier))'), [150, 250, 400]);
});

test('sum missions add up, max missions keep the best run, both stop at the target', () => {
  const game = loadQuietGame();
  game.evaluate(`missionState = {
    day: getLocalLoginDay(), bonusClaimed: false,
    missions: [
      { type: "baskets", tier: 0, target: 3, reward: 15, progress: 0, claimed: false },
      { type: "runScore", tier: 1, target: 50, reward: 25, progress: 0, claimed: false },
      { type: "coins", tier: 2, target: 2, reward: 40, progress: 0, claimed: false }
    ]
  }`);
  game.evaluate('recordMissionProgress({ baskets: 1, runScore: 30 }); recordMissionProgress({ baskets: 1, runScore: 20 })');
  assert.deepEqual(json(game, 'missionState.missions.map((m) => m.progress)'), [2, 30, 0]);
  game.evaluate('recordMissionProgress({ baskets: 5, runScore: 80, coins: 1 })');
  assert.deepEqual(json(game, 'missionState.missions.map((m) => m.progress)'), [3, 50, 1]);
  const toasts = json(game, 'achievementToastQueue.map((e) => e.kind + ":" + e.id)');
  const shown = game.evaluate('achievementToastEntry ? achievementToastEntry.kind + ":" + achievementToastEntry.id : ""');
  assert.deepEqual([shown, ...toasts].filter(Boolean).sort(), ['mission:baskets', 'mission:runScore'], 'one toast per completed mission');
});

test('rewards are claimed once; the bonus needs all three claimed', () => {
  const game = loadQuietGame();
  game.evaluate(`coins = 0; missionState = {
    day: getLocalLoginDay(), bonusClaimed: false,
    missions: [
      { type: "baskets", tier: 0, target: 1, reward: 15, progress: 1, claimed: false },
      { type: "perfects", tier: 1, target: 1, reward: 25, progress: 1, claimed: false },
      { type: "coins", tier: 2, target: 2, reward: 40, progress: 1, claimed: false }
    ]
  }`);
  assert.equal(game.evaluate('getClaimableMissionCount()'), 2);
  assert.equal(game.evaluate('claimMission(2)'), false, 'unfinished mission cannot be claimed');
  assert.equal(game.evaluate('claimMission(0)'), true);
  assert.equal(game.evaluate('claimMission(0)'), false, 'second claim does nothing');
  assert.equal(game.evaluate('claimMission(1)'), true);
  assert.equal(game.evaluate('claimMissionBonus()'), false, 'bonus waits for the third');
  assert.equal(game.evaluate('coins'), 40);
  game.evaluate('recordMissionProgress({ coins: 1 })');
  assert.equal(game.evaluate('claimMission(2)'), true);
  assert.equal(game.evaluate('getClaimableMissionCount()'), 1, 'bonus is now claimable');
  assert.equal(game.evaluate('claimMissionBonus()'), true);
  assert.equal(game.evaluate('claimMissionBonus()'), false);
  assert.equal(game.evaluate('coins'), 15 + 25 + 40 + 30);
  assert.equal(game.evaluate('getClaimableMissionCount()'), 0);
});

test('missions roll over to a new set on a new local day', () => {
  const game = loadQuietGame();
  game.evaluate('missionState = generateDailyMissions("2026-11-03"); missionState.missions[0].progress = 1');
  assert.equal(game.evaluate('ensureDailyMissions(new Date(2026, 10, 3, 23, 59))'), false);
  assert.equal(game.evaluate('ensureDailyMissions(new Date(2026, 10, 4, 0, 1))'), true);
  assert.equal(game.evaluate('missionState.day'), '2026-11-04');
  assert.deepEqual(json(game, 'missionState.missions.map((m) => m.progress)'), [0, 0, 0]);
});

test('mission state survives a save round trip and bad data is reset', () => {
  const game = loadQuietGame();
  game.evaluate(`missionState = generateDailyMissions(getLocalLoginDay());
    missionState.missions[0].progress = missionState.missions[0].target;
    missionState.missions[0].claimed = true;
    missionState.missions[1].progress = 1`);
  const before = json(game, 'missionState');
  const restored = json(game, 'migrateSaveData(JSON.parse(JSON.stringify(makeSaveObject())), false).missions');
  assert.deepEqual(restored, before);
  assert.deepEqual(json(game, 'normalizeMissionState({ day: "x", missions: [] })'), { day: '', missions: [], bonusClaimed: false });
  const forged = json(game, `normalizeMissionState({ day: "2026-11-04", bonusClaimed: true, missions: [
    { type: "baskets", target: 10, progress: 2, claimed: true },
    { type: "coins", target: 5, progress: 99 },
    { type: "games", target: 3, progress: -4 }
  ] })`);
  assert.equal(forged.missions[0].claimed, false, 'cannot be claimed before it is complete');
  assert.equal(forged.missions[1].progress, 5, 'progress is clamped to the target');
  assert.equal(forged.missions[2].progress, 0);
  assert.equal(forged.bonusClaimed, false);
  assert.equal(json(game, 'migrateSaveData({ version: 6 }, false).missions').missions.length, 0, 'old saves start empty');
});

test('a scored basket advances basket, perfect and score missions', () => {
  const game = loadQuietGame();
  game.evaluate('resetGame(true); setGameState("playing")');
  game.evaluate(`missionState = {
    day: getLocalLoginDay(), bonusClaimed: false,
    missions: [
      { type: "baskets", tier: 0, target: 10, reward: 15, progress: 0, claimed: false },
      { type: "perfects", tier: 1, target: 10, reward: 25, progress: 0, claimed: false },
      { type: "runScore", tier: 2, target: 100, reward: 40, progress: 0, claimed: false }
    ]
  }`);
  game.evaluate('ball.touchedHoop = false; ball.touchedWall = false; scoreTargetHoop(getHoopById(targetHoopId))');
  game.evaluate('ball.touchedHoop = true; ball.touchedWall = false; scoreTargetHoop(getHoopById(targetHoopId))');
  assert.deepEqual(json(game, 'missionState.missions.map((m) => m.progress)'), [2, 1, game.evaluate('score')]);
});

test('setting the clock back does not hand out a fresh set', () => {
  const game = loadQuietGame();
  game.evaluate('missionState = generateDailyMissions("2026-11-05"); missionState.missions[0].progress = 1');
  assert.equal(game.evaluate('ensureDailyMissions(new Date(2026, 10, 4, 12, 0))'), false);
  assert.equal(game.evaluate('missionState.day'), '2026-11-05');
  assert.equal(game.evaluate('missionState.missions[0].progress'), 1);
});

test('saved mission types must be real mission types', () => {
  const game = loadQuietGame();
  const hostile = JSON.parse(game.evaluate(`JSON.stringify(normalizeMissionState({ day: "2026-11-04", missions: [
    { type: "constructor", target: 1, progress: 1 }, { type: "baskets", target: 1 }, { type: "coins", target: 1 }
  ] }))`));
  assert.equal(hostile.missions.length, 0);
  game.evaluate('missionState = generateDailyMissions(getLocalLoginDay())');
  assert.equal(game.evaluate('recordMissionProgress(Object.create({ baskets: 5, coins: 5, perfects: 5, games: 5 }))'), false, 'inherited keys are ignored');
});
