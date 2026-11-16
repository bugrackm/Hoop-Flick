// Run: node tests/benchmark-spawns.mjs [path/to/original/game.js]
// Measures the real nextHoop(), including candidate rejection and reachability.
import { readFileSync } from 'node:fs';
import { loadGame } from './helpers/game-harness.mjs';

const source = process.argv[2] ? readFileSync(process.argv[2], 'utf8') : undefined;
// Seeded harness: the run seed (or, for an older game.js, Math.random itself) repeats every run.
const game = loadGame({ source, randomSeed: 0x12345678 });
game.evaluate(`
  globalThis.benchmarkSpawns = function(count) {
    const samples = [];
    const tiers = [0, 8, 15, 30, 50, 100, 500];
    Object.assign(transitionHistory, {
      lastDifficulty: 'easy', hardStreak: 0,
      lastWasLongShot: false, lastWasNear: false, lastWasEdge: false
    });
    for (let i = 0; i < count; i++) {
      score = tiers[i % tiers.length];
      hoops = [makeHoop(i % 2 ? 128 : 292, 400, i + 4, null)];
      const start = performance.now();
      nextHoop();
      samples.push(performance.now() - start);
    }
    samples.sort((a, b) => a - b);
    return {
      count,
      meanMs: samples.reduce((a, b) => a + b, 0) / count,
      p95Ms: samples[Math.floor(count * 0.95)],
      maxMs: samples[count - 1]
    };
  };
`);
game.evaluate('benchmarkSpawns(200)');
console.log(JSON.stringify(game.evaluate('benchmarkSpawns(1000)'), null, 2));
