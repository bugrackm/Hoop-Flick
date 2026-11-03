import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { ballArtSource, loadGame } from './helpers/game-harness.mjs';

function loadBallArtWithRandomGuard() {
  const sandbox = vm.createContext({});
  vm.runInContext('Math.random = () => { throw new Error("Math.random used while drawing"); };', sandbox);
  vm.runInContext(ballArtSource, sandbox);
  return sandbox.HoopFlickBallArt;
}

function createRecordingContext() {
  const state = {
    globalAlpha: 0.63,
    globalCompositeOperation: 'xor'
  };
  const stack = [];
  const calls = [];
  const forbiddenAssignments = [];
  let depth = 0;
  const methods = {
    save() {
      stack.push({ ...state });
      depth += 1;
      calls.push(['save']);
    },
    restore() {
      assert.ok(depth > 0, 'restore must have a matching save');
      Object.assign(state, stack.pop());
      depth -= 1;
      calls.push(['restore']);
    }
  };
  const context = new Proxy(methods, {
    get(target, key) {
      if (key === '__depth') return depth;
      if (key === '__calls') return calls;
      if (key === '__forbiddenAssignments') return forbiddenAssignments;
      if (key in state) return state[key];
      if (key in target) return target[key];
      return (...args) => calls.push([key, ...args]);
    },
    set(target, key, value) {
      if (key === 'shadowBlur' || key === 'filter') forbiddenAssignments.push([key, value]);
      state[key] = value;
      return true;
    }
  });
  return context;
}

test('every ball skin has a supported art definition', () => {
  const game = loadGame();
  const skins = JSON.parse(game.evaluate('JSON.stringify(BALL_SKINS)'));
  const supported = new Set(loadBallArtWithRandomGuard().SKIN_IDS);
  assert.equal(Object.keys(skins).length, 14);
  for (const [skinId, skin] of Object.entries(skins)) {
    assert.ok(skin.art, `${skinId} needs an art definition`);
    assert.equal(skin.art.id, skinId);
    assert.ok(supported.has(skin.art.id), `${skinId} needs a registered painter`);
  }
});

test('all ball art variants draw deterministically without leaking canvas state', () => {
  const game = loadGame();
  const skins = JSON.parse(game.evaluate('JSON.stringify(BALL_SKINS)'));
  const BallArt = loadBallArtWithRandomGuard();
  const context = createRecordingContext();
  const times = [0, 1.37, 4.82];
  const rotations = [-0.35, 0.8, 3.1];

  for (const skin of Object.values(skins)) {
    for (const heat of [0, 1]) {
      for (const flash of [0, 1]) {
        for (const darkBackground of [false, true]) {
          for (let index = 0; index < times.length; index += 1) {
            assert.doesNotThrow(() => BallArt.drawBall(context, skin.art, {
              radius: 12.95,
              rotation: rotations[index],
              time: times[index],
              heat,
              heatColors: ['#fff0a6', '#ff8a2e', '#c4702c'],
              flash,
              darkBackground,
              look: { x: 0.7, y: -0.4 }
            }), `${skin.id} should draw for heat=${heat}, flash=${flash}, dark=${darkBackground}`);
            assert.equal(context.__depth, 0, `${skin.id} must balance save/restore`);
            assert.equal(context.globalAlpha, 0.63, `${skin.id} must restore globalAlpha`);
            assert.equal(context.globalCompositeOperation, 'xor', `${skin.id} must restore compositing`);
          }
        }
      }
    }
  }
  assert.deepEqual(context.__forbiddenAssignments, [], 'drawBall must not assign shadowBlur or filter');
});
