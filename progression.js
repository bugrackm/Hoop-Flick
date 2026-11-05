(function (global) {
  "use strict";

  // The difficulty ladder (the game's signature): every stage adds exactly one new mechanic at a
  // fixed score, first shown alone and gently, then mixed in and slowly ramped to its cap.
  // Pure data + helpers, no DOM and no randomness of its own (callers pass a random source).

  // Points after a mechanic's unlock until it reaches full strength.
  const RAMP_SCORE = 120;
  // A freshly unlocked mechanic appears more often for this many points ("its" stage).
  const SPOTLIGHT_SCORE = 25;
  const SPOTLIGHT_WEIGHT = 2.6;
  // From here two features may share one hoop transition (hard transitions only).
  const COMBO_SCORE = 150;
  // Timed shots begin here (game.js TIMED_SHOT_START_SCORE); no mechanic unlocks on top of it.
  const SHOT_CLOCK_SCORE = 100;

  // intro: the mechanic's first appearance in a run is a gentle hoop on its own.
  // group: what a feature changes. Only one feature per group per hoop transition.
  //   turn  = the target hoop's orientation, move = its position, block = an obstacle, board = backboard.
  // params: [at unlock, at full strength]; angles in degrees, speeds in rad/s, lengths in world units.
  const MECHANICS = Object.freeze({
    board: Object.freeze({ unlock: 8, group: "board", weight: 0.7, intro: false, params: Object.freeze({}) }),
    tilt: Object.freeze({ unlock: 8, group: "turn", weight: 1, intro: true, params: Object.freeze({ degrees: [12, 38] }) }),
    slide: Object.freeze({ unlock: 15, group: "move", weight: 1, intro: true, params: Object.freeze({ amplitude: [24, 50], speed: [1.5, 2.3] }) }),
    bar: Object.freeze({ unlock: 30, group: "block", weight: 1, intro: true, params: Object.freeze({ length: [50, 72] }) }),
    peg: Object.freeze({ unlock: 40, group: "block", weight: 0.8, intro: true, params: Object.freeze({ radius: [9, 12] }) }),
    swing: Object.freeze({ unlock: 55, group: "turn", weight: 1, intro: true, params: Object.freeze({ degrees: [20, 40], speed: [1.2, 1.9] }) }),
    lift: Object.freeze({ unlock: 70, group: "move", weight: 0.9, intro: true, params: Object.freeze({ amplitude: [16, 30], speed: [1.4, 2] }) }),
    slider: Object.freeze({ unlock: 85, group: "block", weight: 1, intro: true, params: Object.freeze({ amplitude: [44, 68], speed: [1, 1.6], length: [40, 52] }) }),
    orbit: Object.freeze({ unlock: 115, group: "move", weight: 0.8, intro: true, params: Object.freeze({ radius: [14, 26], speed: [1.2, 1.9] }) }),
    spin: Object.freeze({ unlock: 130, group: "turn", weight: 1, intro: true, params: Object.freeze({ speed: [0.85, 1.45] }) }),
    spinner: Object.freeze({ unlock: 170, group: "block", weight: 1, intro: true, params: Object.freeze({ length: [56, 74], speed: [0.9, 1.6] }) })
  });

  // Unlock order, also the order of the intro hoops.
  const MECHANIC_ORDER = Object.freeze(Object.keys(MECHANICS).sort((a, b) => MECHANICS[a].unlock - MECHANICS[b].unlock));

  // Pairs that may share a transition once score >= COMBO_SCORE. Spin, orbit and the moving
  // obstacles stay alone: each is already the hardest version of its group.
  const COMBO_PAIRS = Object.freeze([
    ["slide", "tilt"], ["lift", "tilt"],
    ["slide", "bar"], ["slide", "peg"], ["lift", "bar"], ["lift", "peg"],
    ["tilt", "bar"], ["tilt", "peg"], ["swing", "bar"], ["swing", "peg"]
  ].map((pair) => Object.freeze(pair)));

  // Transition budget by score: how many "challenge units" (one feature or one hard geometry each).
  const DIFFICULTY_TIERS = Object.freeze([
    Object.freeze({ name: "start", minScore: 0, maxScore: 7, maxBudget: 0, weights: Object.freeze({ easy: 1, medium: 0, hard: 0 }) }),
    Object.freeze({ name: "light", minScore: 8, maxScore: 14, maxBudget: 1, weights: Object.freeze({ easy: 0.6, medium: 0.4, hard: 0 }) }),
    Object.freeze({ name: "medium", minScore: 15, maxScore: 29, maxBudget: 2, weights: Object.freeze({ easy: 0.4, medium: 0.5, hard: 0.1 }) }),
    Object.freeze({ name: "advanced", minScore: 30, maxScore: 49, maxBudget: 2, weights: Object.freeze({ easy: 0.3, medium: 0.5, hard: 0.2 }) }),
    Object.freeze({ name: "mastery", minScore: 50, maxScore: 99, maxBudget: 2, weights: Object.freeze({ easy: 0.25, medium: 0.5, hard: 0.25 }) }),
    Object.freeze({ name: "expert", minScore: 100, maxScore: 199, maxBudget: 2, weights: Object.freeze({ easy: 0.2, medium: 0.5, hard: 0.3 }) }),
    Object.freeze({ name: "master", minScore: 200, maxScore: Infinity, maxBudget: 3, weights: Object.freeze({ easy: 0.15, medium: 0.45, hard: 0.4 }) })
  ]);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function isUnlocked(mechanic, score) {
    const entry = MECHANICS[mechanic];
    return Boolean(entry) && score >= entry.unlock;
  }

  // 0 at the unlock score, 1 after RAMP_SCORE more points.
  function getIntensity(mechanic, score) {
    const entry = MECHANICS[mechanic];
    if (!entry || score < entry.unlock) return 0;
    return clamp((score - entry.unlock) / RAMP_SCORE, 0, 1);
  }

  function getUnlockedMechanics(score) {
    return MECHANIC_ORDER.filter((mechanic) => isUnlocked(mechanic, score));
  }

  // Selection weight: the newest mechanic gets the spotlight for a while after its unlock.
  function getMechanicWeight(mechanic, score) {
    const entry = MECHANICS[mechanic];
    if (!entry || score < entry.unlock) return 0;
    return entry.weight * (score - entry.unlock < SPOTLIGHT_SCORE ? SPOTLIGHT_WEIGHT : 1);
  }

  // Concrete parameters for one hoop/obstacle. `intro` = the first, gentlest appearance.
  // `random` returns [0, 1); a small spread keeps hoops at the same score from being identical.
  function getMechanicParams(mechanic, score, random, intro) {
    const entry = MECHANICS[mechanic];
    if (!entry) return null;
    const rand = typeof random === "function" ? random : () => 0.5;
    const base = intro ? 0 : getIntensity(mechanic, score);
    const params = {};
    for (const [key, range] of Object.entries(entry.params)) {
      const spread = intro ? 0 : (rand() - 0.5) * 0.3;
      params[key] = lerp(range[0], range[1], clamp(base + spread * base, 0, 1));
    }
    return params;
  }

  function canCombine(a, b) {
    return COMBO_PAIRS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
  }

  function getDifficultyTier(score) {
    return DIFFICULTY_TIERS.find((tier) => score >= tier.minScore && score <= tier.maxScore)
      || DIFFICULTY_TIERS[DIFFICULTY_TIERS.length - 1];
  }

  global.HoopFlickProgression = Object.freeze({
    RAMP_SCORE,
    SPOTLIGHT_SCORE,
    COMBO_SCORE,
    SHOT_CLOCK_SCORE,
    MECHANICS,
    MECHANIC_ORDER,
    COMBO_PAIRS,
    DIFFICULTY_TIERS,
    isUnlocked,
    getIntensity,
    getUnlockedMechanics,
    getMechanicWeight,
    getMechanicParams,
    canCombine,
    getDifficultyTier
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
