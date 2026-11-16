import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { performance } from 'node:perf_hooks';

export const gamePath = new URL('../../game.js', import.meta.url);
export const physicsSource = readFileSync(new URL('../../physics.js', import.meta.url), 'utf8');
export const ballArtSource = readFileSync(new URL('../../ballArt.js', import.meta.url), 'utf8');
export const hoopArtSource = readFileSync(new URL('../../hoopArt.js', import.meta.url), 'utf8');
export const progressionSource = readFileSync(new URL('../../progression.js', import.meta.url), 'utf8');
export const obstaclesSource = readFileSync(new URL('../../obstacles.js', import.meta.url), 'utf8');

export function loadPhysics() {
  const sandbox = vm.createContext({});
  vm.runInContext(physicsSource, sandbox);
  return sandbox.HoopFlickPhysics;
}

// Execute the real IIFE with inert DOM/audio, without boot or event registration.
// The evaluation hook exists only in this test copy, never in the shipped game.
// Math.random is seeded (`randomSeed`) before any script runs, so the run seed the game picks
// and every cosmetic roll repeat exactly: no test depends on unseeded randomness.
export function loadGame({ source = readFileSync(gamePath, 'utf8'), search = '', storage = new Map(), failStorageKey = null, now = null, randomSeed = 0x2545f491 } = {}) {
  const calls = [];
  const storageWrites = [];
  const noop = () => {};
  const context = new Proxy({}, {
    get: (_, key) => (...args) => {
      calls.push([key, ...args]);
      return { addColorStop: noop };
    }
  });
  const element = () => ({
    getContext: () => context,
    classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    style: { setProperty: noop }, setAttribute: noop, removeAttribute: noop,
    hasPointerCapture: () => false, setPointerCapture: noop, releasePointerCapture: noop,
    focus: noop, blur: noop, querySelector: () => null, querySelectorAll: () => [],
    append: noop, appendChild: noop, replaceChildren: noop, addEventListener: noop,
    dataset: {},
    getBoundingClientRect: () => ({ width: 420, height: 746, left: 0, top: 0 })
  });
  let rafId = 0;
  const rafs = new Map();
  const sandbox = vm.createContext({
    performance, URLSearchParams, console,
    ...(now === null ? {} : { Date: class extends Date {
      constructor(...args) { super(...(args.length ? args : [now])); }
      static now() { return now; }
    } }),
    setTimeout: () => 0, clearTimeout: noop,
    window: {
      location: { search },
      setInterval: () => 0,
      setTimeout: () => 0, clearTimeout: noop,
      requestAnimationFrame: fn => { rafs.set(++rafId, fn); return rafId; },
      cancelAnimationFrame: id => rafs.delete(id)
    },
    document: { getElementById: element, createElement: element, createDocumentFragment: element, createTextNode: text => ({ textContent: String(text) }), querySelector: () => null, querySelectorAll: () => [], body: element(), documentElement: element() },
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => {
        if (key === failStorageKey) throw new Error('Storage quota exceeded');
        storageWrites.push({ key, value: String(value) });
        storage.set(key, String(value));
      }
    }
  });
  vm.runInContext(`(() => {
    let seed = ${randomSeed >>> 0};
    Math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  })();`, sandbox);
  vm.runInContext(physicsSource, sandbox);
  vm.runInContext(ballArtSource, sandbox);
  vm.runInContext(hoopArtSource, sandbox);
  vm.runInContext(progressionSource, sandbox);
  vm.runInContext(obstaclesSource, sandbox);
  const cutoff = source.indexOf('  window.addEventListener("resize"');
  if (cutoff < 0) throw new Error('Cannot find game bootstrap boundary');
  vm.runInContext(source.slice(0, cutoff) + '\n globalThis.evaluateGame = code => eval(code);\n})();', sandbox);
  return { evaluate: sandbox.evaluateGame, calls, rafs, storageWrites };
}
