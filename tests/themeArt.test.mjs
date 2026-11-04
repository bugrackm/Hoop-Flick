import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../themeArt.js', import.meta.url), 'utf8');

function loadThemeArt() {
  const sandbox = vm.createContext({});
  vm.runInContext('Math.random = () => { throw new Error("Math.random used while drawing"); };', sandbox);
  vm.runInContext(source, sandbox);
  return sandbox.HoopFlickThemeArt;
}

function createRecordingContext() {
  const state = { globalAlpha: 0.67, lineDash: [], lineWidth: 1 };
  const stack = [];
  const calls = [];
  const forbidden = [];
  let depth = 0;
  const methods = {
    save() {
      stack.push({ ...state, lineDash: state.lineDash.slice() });
      depth += 1;
    },
    restore() {
      assert.ok(depth > 0, 'restore needs a matching save');
      Object.assign(state, stack.pop());
      depth -= 1;
    },
    setLineDash(dash) { state.lineDash = dash.slice(); },
    createLinearGradient() { forbidden.push('createLinearGradient'); return { addColorStop() {} }; },
    createRadialGradient() { forbidden.push('createRadialGradient'); return { addColorStop() {} }; }
  };
  return new Proxy(methods, {
    get(target, key) {
      if (key === '__depth') return depth;
      if (key === '__calls') return calls;
      if (key === '__forbidden') return forbidden;
      if (key in state) return state[key];
      if (key in target) return target[key];
      return (...args) => calls.push([String(key), ...args]);
    },
    set(target, key, value) {
      if (key === 'shadowBlur' && Number(value) !== 0) forbidden.push(`shadowBlur=${value}`);
      if (key === 'filter' && value && value !== 'none') forbidden.push(`filter=${value}`);
      state[key] = value;
      return true;
    }
  });
}

function callXBounds(call) {
  const [name, ...a] = call;
  if (name === 'moveTo' || name === 'lineTo') return [a[0], a[0]];
  if (name === 'rect' || name === 'fillRect' || name === 'strokeRect') return [Math.min(a[0], a[0] + a[2]), Math.max(a[0], a[0] + a[2])];
  if (name === 'arc') return [a[0] - a[2], a[0] + a[2]];
  if (name === 'ellipse') return [a[0] - a[2], a[0] + a[2]];
  if (name === 'quadraticCurveTo') return [Math.min(a[0], a[2]), Math.max(a[0], a[2])];
  if (name === 'bezierCurveTo') return [Math.min(a[0], a[2], a[4]), Math.max(a[0], a[2], a[4])];
  return null;
}

test('exports the exact theme constants, parallax values and frozen palettes', () => {
  const art = loadThemeArt();
  assert.deepEqual(Array.from(art.THEME_IDS), ['gym', 'sunset', 'neon', 'rooftop', 'minimal']);
  assert.equal(art.WALL_X, 30);
  assert.equal(art.WORLD_W, 420);
  assert.equal(art.FAR_TILE_H, 760);
  assert.equal(art.WALL_TILE_H, 360);
  const expected = { gym: 0.5, sunset: 0.25, neon: 0.35, rooftop: 0.4, minimal: 0.6 };
  for (const [id, value] of Object.entries(expected)) assert.equal(art.getParallax(id), value);
  assert.equal(art.getParallax('missing'), 0.5);
  assert.equal(art.getPalette('missing', false).accent, art.getPalette('gym', false).accent);
  for (const id of art.THEME_IDS) {
    for (const dark of [false, true]) {
      const palette = art.getPalette(id, dark);
      for (const key of ['sky', 'accent', 'wall', 'wallShade', 'wallLight', 'ink', 'uiTint']) assert.ok(palette[key], `${id} needs ${key}`);
      assert.ok(Object.isFrozen(palette), `${id} palette is frozen`);
      assert.ok(Object.isFrozen(palette.sky), `${id} sky array is frozen`);
    }
  }
});

test('all painters run in both modes without leaking canvas state', () => {
  const art = loadThemeArt();
  for (const id of art.THEME_IDS) {
    for (const dark of [false, true]) {
      for (const paint of [
        ctx => art.paintSky(ctx, id, dark, -130, 550, 1000),
        ctx => art.paintFar(ctx, id, dark, -130, 550, art.FAR_TILE_H),
        ctx => art.paintWall(ctx, id, dark, 'left', -130, 550, art.WALL_TILE_H),
        ctx => art.paintWall(ctx, id, dark, 'right', -130, 550, art.WALL_TILE_H)
      ]) {
        const ctx = createRecordingContext();
        assert.doesNotThrow(() => paint(ctx), `${id} dark=${dark} painter should run`);
        assert.equal(ctx.__depth, 0, `${id} dark=${dark} balances save/restore`);
        assert.equal(ctx.globalAlpha, 0.67, `${id} dark=${dark} restores alpha`);
        assert.deepEqual(ctx.__forbidden, [], `${id} dark=${dark} avoids forbidden canvas features`);
      }
    }
  }
});

test('wall geometry stays outside the play column', () => {
  const art = loadThemeArt();
  for (const id of art.THEME_IDS) {
    for (const dark of [false, true]) {
      for (const side of ['left', 'right']) {
        const ctx = createRecordingContext();
        art.paintWall(ctx, id, dark, side, -130, 550, 360);
        for (const call of ctx.__calls) {
          const bounds = callXBounds(call);
          if (!bounds) continue;
          if (side === 'left') assert.ok(bounds[1] <= 31.5, `${id} left ${call[0]} reaches x=${bounds[1]}`);
          else assert.ok(bounds[0] >= 388.5, `${id} right ${call[0]} reaches x=${bounds[0]}`);
        }
      }
    }
  }
});

test('source contains no random, gradients, blur or filter effects', () => {
  assert.doesNotMatch(source, /Math\.random/);
  assert.doesNotMatch(source, /create(?:Linear|Radial)Gradient/);
  assert.doesNotMatch(source, /shadowBlur/);
  assert.doesNotMatch(source, /\.filter\s*=/);
});
