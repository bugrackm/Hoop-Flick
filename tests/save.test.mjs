import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGame } from './helpers/game-harness.mjs';

const MAIN = 'hoop-flick-save-v4';
const BACKUP = 'hoop-flick-save-backup';
const NOW = 1800000000000;
const ISO = '2027-01-15T08:00:00.000Z';
function setup(entries = [], options = {}) {
  const storage = new Map(entries);
  return { ...loadGame({ storage, now: NOW, ...options }), storage };
}
function load(game) {
  return game.evaluate(`(() => {
    const record = readLocalSaveRecord();
    const migrated = migrateSaveData(record.save, true);
    applyMigratedSave(migrated);
    return { record, migrated };
  })()`);
}
function currentSave() {
  return JSON.parse(setup().evaluate('JSON.stringify(makeSaveObject())'));
}

test('current save loads score, coins and settings without migration', () => {
  const save = currentSave();
  Object.assign(save, { highScore: 12, coins: 37 });
  Object.assign(save.settings, { language: 'en', muted: true, darkMode: true });
  const game = setup([[MAIN, JSON.stringify(save)]]);
  const result = load(game);
  assert.equal(result.record.shouldPersist, false);
  assert.equal(result.migrated.needsMigration, false);
  assert.equal(game.evaluate('best'), 12);
  assert.equal(game.evaluate('coins'), 37);
  assert.equal(game.evaluate('language'), 'en');
  assert.equal(game.evaluate('muted && darkMode'), true);
});

test('missing save loads defaults without requesting migration', () => {
  const game = setup();
  const result = load(game);
  assert.equal(result.record.save, null);
  assert.equal(result.record.shouldPersist, false);
  assert.equal(game.evaluate('best + coins'), 0);
});

test('older save migrates while retaining score and resetting old economy', () => {
  const game = setup([[MAIN, JSON.stringify({ version: 3, highScore: 19, coins: 300, settings: { language: 'en' } })]]);
  assert.equal(load(game).migrated.needsMigration, true);
  assert.equal(game.evaluate('best'), 19);
  assert.equal(game.evaluate('coins'), 0);
  assert.equal(game.evaluate('language'), 'en');
});

test('legacy separate keys load and request unified persistence', () => {
  const game = setup([['hoop-flick-best', '23'], ['hoop-flick-muted', 'true'], ['hoop-flick-language', 'en']]);
  assert.equal(load(game).record.shouldPersist, true);
  assert.equal(game.evaluate('best'), 23);
  assert.equal(game.evaluate('muted'), true);
  assert.equal(game.evaluate('language'), 'en');
});

test('future save keeps understood fields and requests version migration', () => {
  const save = currentSave();
  Object.assign(save, { version: save.version + 1, highScore: 17, coins: 99, futureField: 'keep raw' });
  const game = setup([[MAIN, JSON.stringify(save)]]);
  assert.equal(load(game).migrated.needsMigration, true);
  assert.equal(game.evaluate('best'), 17);
  assert.equal(game.evaluate('coins'), 99);
});

function boot(game) {
  game.evaluate('bootGame()');
}
function checkBackup(game, raw, reason) {
  assert.deepEqual(JSON.parse(game.storage.get(BACKUP)), { at: ISO, reason, raw });
  const backupIndex = game.storageWrites.findIndex(write => write.key === BACKUP);
  const mainIndex = game.storageWrites.findIndex(write => write.key === MAIN);
  assert.ok(backupIndex >= 0 && (mainIndex < 0 || backupIndex < mainIndex), 'backup precedes main save overwrite');
}
function checkNoticeOnce(game, key) {
  assert.equal(game.evaluate('achievementToastName.textContent'), game.evaluate(`t('${key}')`));
  assert.equal(game.evaluate('achievementToastEntry.kind'), 'saveRecovery');
  assert.equal(game.evaluate('achievementToastQueue.length'), 0);
  game.evaluate('achievementToastTimer = null; showNextAchievementToast()');
  assert.equal(game.evaluate('achievementToastTimer'), null, 'no second notice is scheduled');
}

for (const raw of ['{not json', '42', 'null', '[]', '', '   ']) {
  test(`unreadable save ${JSON.stringify(raw)} is backed up, reset, announced once and replaced`, async () => {
    const game = setup([[MAIN, raw]]);
    boot(game);
    checkBackup(game, raw, 'corrupt');
    assert.equal(game.evaluate('best + coins'), 0);
    checkNoticeOnce(game, 'saveRecovered');
    await game.evaluate('requestSave(true); drainSaveQueue()');
    assert.equal(JSON.parse(game.storage.get(MAIN)).version, game.evaluate('SAVE_VERSION'));
  });
}

test('corrupt save preserves legacy fallback and announces in saved language', () => {
  const game = setup([[MAIN, '{not json'], ['hoop-flick-best', '8'], ['hoop-flick-language', 'en']]);
  boot(game);
  assert.equal(game.evaluate('best'), 8);
  checkNoticeOnce(game, 'saveRecovered');
  assert.equal(game.evaluate('achievementToastName.textContent'), "Your save couldn't be read; it was backed up and a fresh save started.");
});

test('future save is backed up before rewrite and keeps understood progress', () => {
  const save = currentSave();
  Object.assign(save, { version: save.version + 1, highScore: 17, coins: 99 });
  const raw = JSON.stringify(save);
  const game = setup([[MAIN, raw]]);
  boot(game);
  checkBackup(game, raw, 'future-version');
  assert.equal(game.evaluate('best'), 17);
  assert.equal(game.evaluate('coins'), 99);
  checkNoticeOnce(game, 'saveFutureRecovered');
  assert.equal(JSON.parse(game.storage.get(MAIN)).version, save.version - 1);
});

test('backup quota failure still boots, resets and shows the notice', () => {
  const game = setup([[MAIN, '{not json']], { failStorageKey: BACKUP });
  boot(game);
  assert.equal(game.evaluate('gameBooted'), true);
  assert.equal(game.evaluate('best + coins'), 0);
  assert.equal(game.storage.has(BACKUP), false);
  checkNoticeOnce(game, 'saveRecoveryFailed');
});

test('newest unreadable record replaces the previous backup', () => {
  const game = setup([[MAIN, 'null'], [BACKUP, '{"raw":"older"}']]);
  boot(game);
  checkBackup(game, 'null', 'corrupt');
});

test('valid save creates neither a backup nor a recovery message', () => {
  const game = setup([[MAIN, JSON.stringify(currentSave())]]);
  boot(game);
  assert.equal(game.storage.has(BACKUP), false);
  assert.equal(game.evaluate('achievementToastEntry'), null);
  assert.equal(game.evaluate('achievementToastQueue.length'), 0);
});


test('recovery notice waits for boot and has complete TR and EN translations', () => {
  const game = setup([[MAIN, 'null']]);
  load(game);
  assert.equal(game.evaluate('achievementToastEntry'), null);
  for (const language of ['tr', 'en']) {
    for (const key of ['saveNotice', 'saveRecovered', 'saveFutureRecovered', 'saveRecoveryFailed', 'saveFutureRecoveryFailed']) {
      assert.equal(game.evaluate(`typeof TRANSLATIONS.${language}.${key}`), 'string');
    }
  }
});

test('future backup failure keeps understood progress and announces failure', () => {
  const save = currentSave();
  Object.assign(save, { version: save.version + 1, highScore: 17 });
  const game = setup([[MAIN, JSON.stringify(save)]], { failStorageKey: BACKUP });
  boot(game);
  assert.equal(game.evaluate('best'), 17);
  checkNoticeOnce(game, 'saveFutureRecoveryFailed');
});

test('normal saves preserve an existing recovery backup', () => {
  const game = setup([[MAIN, JSON.stringify(currentSave())], [BACKUP, 'previous backup']]);
  boot(game);
  assert.equal(game.storage.get(BACKUP), 'previous backup');
  assert.equal(game.evaluate('achievementToastEntry'), null);
});

for (const [name, makeRaw] of [
  ['corrupt', () => '{not json'],
  ['future-version', () => { const s = currentSave(); s.version += 1; return JSON.stringify(s); }]
]) {
  test(`${name} save: a second boot on the same storage keeps the backup and shows no notice`, async () => {
    const raw = makeRaw();
    const first = setup([[MAIN, raw]]);
    boot(first);
    await first.evaluate('drainSaveQueue()');
    const backupAfterFirst = first.storage.get(BACKUP);
    const second = setup([...first.storage]);
    boot(second);
    assert.equal(second.storage.get(BACKUP), backupAfterFirst, 'backup untouched');
    assert.equal(JSON.parse(backupAfterFirst).raw, raw);
    assert.equal(second.evaluate('achievementToastQueue.length'), 0);
    assert.equal(second.evaluate('achievementToastTimer'), null, 'no notice on the second boot');
  });
}

test('the recovery notice stays on screen long enough to read and is not cut to one line', () => {
  const game = setup();
  const notice = game.evaluate('getAchievementToastDuration("saveRecovery", false)');
  const achievement = game.evaluate('getAchievementToastDuration("achievement", false)');
  assert.ok(notice >= 4500, `notice shows for ${notice} ms`);
  assert.equal(achievement, 2400, 'other toasts keep their timing');
  assert.equal(game.evaluate('getAchievementToastDuration("achievement", true)'), 1700);
  assert.ok(game.evaluate('getAchievementToastDuration("saveRecovery", true)') >= 4500, 'also during play');
});
