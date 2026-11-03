import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { hoopArtSource, loadGame } from './helpers/game-harness.mjs';

function loadHoopArtWithRandomGuard() {
  const sandbox = vm.createContext({});
  vm.runInContext('Math.random = () => { throw new Error("Math.random used while drawing"); };', sandbox);
  vm.runInContext(hoopArtSource, sandbox);
  return sandbox.HoopFlickHoopArt;
}

function createRecordingContext() {
  const state = { globalAlpha: 0.7, globalCompositeOperation: 'source-over', lineDash: [] };
  const stack = [];
  const forbidden = [];
  let depth = 0;
  const methods = {
    save() { stack.push({ ...state }); depth += 1; },
    restore() { assert.ok(depth > 0, 'restore needs a matching save'); Object.assign(state, stack.pop()); depth -= 1; },
    setLineDash(dash) { state.lineDash = dash; },
    createLinearGradient() { forbidden.push('gradient'); return { addColorStop() {} }; },
    createRadialGradient() { forbidden.push('gradient'); return { addColorStop() {} }; }
  };
  return new Proxy(methods, {
    get(target, key) {
      if (key === '__depth') return depth;
      if (key === '__forbidden') return forbidden;
      if (key === '__lineDash') return state.lineDash;
      if (key in state) return state[key];
      if (key in target) return target[key];
      return () => {};
    },
    set(target, key, value) {
      if (key === 'shadowBlur' || key === 'filter') forbidden.push(key);
      state[key] = value;
      return true;
    }
  });
}

test('every theme has a light and dark cel hoop palette that draws cleanly', () => {
  const game = loadGame();
  const themes = JSON.parse(game.evaluate('JSON.stringify(THEMES)'));
  const HoopArt = loadHoopArtWithRandomGuard();
  const ctx = createRecordingContext();
  const required = ['rim', 'rimDark', 'rimLight', 'ink', 'net', 'netShade', 'shadow'];
  for (const [id, theme] of Object.entries(themes)) {
    for (const mode of ['light', 'dark']) {
      const art = theme.hoopArt?.[mode];
      assert.ok(art, `${id} ${mode} needs a hoop palette`);
      for (const key of required) assert.ok(art[key], `${id} ${mode} needs ${key}`);
      for (const options of [
        { halfWidth: 36 },
        { halfWidth: 36, swing: 4, stretch: 3, ripple: 0.4, flash: 1, heat: 1, heatColors: ['#fff0a6', '#ff8a2e', '#c4702c'], darkBackground: mode === 'dark', board: { x: 50, top: -62, bottom: 20 } }
      ]) {
        HoopArt.drawHoopBack(ctx, art, options);
        HoopArt.drawHoopFront(ctx, art, options);
        assert.equal(ctx.__depth, 0, `${id} ${mode} balances save/restore`);
        assert.equal(ctx.globalAlpha, 0.7, `${id} ${mode} restores alpha`);
        assert.deepEqual(ctx.__lineDash, [], `${id} ${mode} clears the chain dash`);
      }
    }
  }
  assert.deepEqual(ctx.__forbidden, [], 'no gradients, blur or filters');
});

test('the net has strands in front of and behind the ball, and a score ripple pinches it', () => {
  const HoopArt = loadHoopArtWithRandomGuard();
  const rest = HoopArt.buildNet({ halfWidth: 36, ripple: -1 });
  const facing = rest.flat().map((point) => point.facing);
  assert.ok(facing.some((value) => value > 0.3) && facing.some((value) => value < -0.3));
  const width = (strands, row) => Math.max(...strands.map((points) => Math.abs(points[row].x)));
  const rippling = HoopArt.buildNet({ halfWidth: 36, ripple: 0.3 });
  assert.ok(width(rippling, 4) < width(rest, 4) * 0.9, 'the pinch narrows the middle of the net');
  const swung = HoopArt.buildNet({ halfWidth: 36, ripple: -1, swing: 6 });
  assert.ok(swung[0].at(-1).x > rest[0].at(-1).x + 4, 'swing moves the bottom more than the top');
  assert.ok(Math.abs(swung[0][0].x - rest[0][0].x) < 0.01, 'the top stays on the rim');
});

test('a swish flashes the rim white, or in flame colour when the ball burns', () => {
  const game = loadGame();
  const result = JSON.parse(game.evaluate(`
    playGameSound = () => {};
    const hoop = makeHoop(300, 420, 1, null);
    triggerHoopScoreEffect(hoop, { swish: true });
    const white = hoop.rimFlashColor;
    ballHeat = 1;
    lastBallHeatColors = ['#fff0a6', '#ff8a2e', '#c4702c'];
    triggerHoopScoreEffect(hoop, { swish: true });
    const plain = makeHoop(300, 420, 2, null);
    triggerHoopScoreEffect(plain, { swish: false });
    JSON.stringify({ white, fire: hoop.rimFlashColor, flash: hoop.rimFlash, plainFlash: plain.rimFlash || 0 });
  `));
  assert.equal(result.white, '#ffffff');
  assert.equal(result.fire, '#ff8a2e');
  assert.ok(result.flash > 0);
  assert.equal(result.plainFlash, 0, 'a rim-touching basket does not flash');
});

test('every net segment is drawn exactly once, in front of or behind the ball', () => {
  const HoopArt = loadHoopArtWithRandomGuard();
  const strands = HoopArt.buildNet({ halfWidth: 36, ripple: 0.4, swing: 3, stretch: 2 });
  let front = 0;
  let back = 0;
  for (const points of strands) {
    for (let i = 1; i < points.length; i += 1) {
      if (points[i - 1].facing + points[i].facing > 0) front += 1;
      else back += 1;
    }
  }
  const total = strands.reduce((sum, points) => sum + points.length - 1, 0);
  assert.equal(front + back, total);
  assert.ok(front > total * 0.3 && back > total * 0.3, 'both sides get a real share');
});
