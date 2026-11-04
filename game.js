(function () {  
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d", { alpha: true });
  const gameShell = document.getElementById("gameShell");
  const mainMenuOverlay = document.getElementById("mainMenuOverlay");
  const profileOverlay = document.getElementById("profileOverlay");
  const achievementsOverlay = document.getElementById("achievementsOverlay");
  const settingsOverlay = document.getElementById("settingsOverlay");
  const customizeOverlay = document.getElementById("customizeOverlay");
  const themeOverlay = document.getElementById("themeOverlay");
  const pauseOverlay = document.getElementById("pauseOverlay");
  const gameOverOverlay = document.getElementById("gameOverOverlay");
  const retryOverlay = document.getElementById("retryOverlay");
  const hud = document.getElementById("hud");
  const themeColor = document.getElementById("themeColor");
  const startButton = document.getElementById("startButton");
  const profileButton = document.getElementById("profileButton");
  const profileAchievementsButton = document.getElementById("profileAchievementsButton");
  const customizeButton = document.getElementById("customizeButton");
  const customizeThemeButton = document.getElementById("customizeThemeButton");
  const settingsButton = document.getElementById("settingsButton");
  const settingsSoundButton = document.getElementById("settingsSoundButton");
  const settingsHapticsButton = document.getElementById("settingsHapticsButton");
  const settingsDarkModeButton = document.getElementById("settingsDarkModeButton");
  const languageButton = document.getElementById("languageButton");
  const settingsBackButton = document.getElementById("settingsBackButton");
  const profileBackButton = document.getElementById("profileBackButton");
  const achievementsBackButton = document.getElementById("achievementsBackButton");
  const customizeBackButton = document.getElementById("customizeBackButton");
  const themeBackButton = document.getElementById("themeBackButton");
  const pauseContinueButton = document.getElementById("pauseContinueButton");
  const pauseMainMenuButton = document.getElementById("pauseMainMenuButton");
  const pauseSettingsButton = document.getElementById("pauseSettingsButton");
  const customizeBallPreview = document.getElementById("customizeBallPreview");
  const customizeBallName = document.getElementById("customizeBallName");
  const ballSkinList = document.getElementById("ballSkinList");
  const themeList = document.getElementById("themeList");
  const ballCoinBalance = document.getElementById("ballCoinBalance");
  const ballCoinBalanceValue = document.getElementById("ballCoinBalanceValue");
  const ballEconomyStatus = document.getElementById("ballEconomyStatus");
  const themeCoinBalance = document.getElementById("themeCoinBalance");
  const themeCoinBalanceValue = document.getElementById("themeCoinBalanceValue");
  const themeEconomyStatus = document.getElementById("themeEconomyStatus");
  const restartButton = document.getElementById("restartButton");
  const gameOverMenuButton = document.getElementById("gameOverMenuButton");
  const retryButton = document.getElementById("retryButton");
  const retryMenuButton = document.getElementById("retryMenuButton");
  const menuButton = document.getElementById("menuButton");
  const scoreValue = document.getElementById("scoreValue");
  const bestValue = document.getElementById("bestValue");
  const finalScore = document.getElementById("finalScore");
  const coinHud = document.getElementById("coinHud");
  const coinHudValue = document.getElementById("coinHudValue");
  const timedShotHud = document.getElementById("timedShotHud");
  const streakHud = document.getElementById("streakHud");
  const timedShotValue = document.getElementById("timedShotValue");
  const activePlayTimeValue = document.getElementById("activePlayTimeValue");
  const perfectBasketsValue = document.getElementById("perfectBasketsValue");
  const bounceBasketsValue = document.getElementById("bounceBasketsValue");
  const lifetimeScoreValue = document.getElementById("lifetimeScoreValue");
  const worldCoinsCollectedValue = document.getElementById("worldCoinsCollectedValue");
  const achievementCoinBalanceValue = document.getElementById("achievementCoinBalanceValue");
  const achievementSummary = document.getElementById("achievementSummary");
  const achievementClaimAllButton = document.getElementById("achievementClaimAllButton");
  const achievementList = document.getElementById("achievementList");
  const achievementToast = document.getElementById("achievementToast");
  const achievementToastName = document.getElementById("achievementToastName");
  const achievementToastTitle = document.getElementById("achievementToastTitle");
  const achievementToastMedal = document.getElementById("achievementToastMedal");
  const shopDialogOverlay = document.getElementById("shopDialogOverlay");
  const shopDialogPreview = document.getElementById("shopDialogPreview");
  const shopDialogTitle = document.getElementById("shopDialogTitle");
  const shopDialogText = document.getElementById("shopDialogText");
  const shopDialogDetail = document.getElementById("shopDialogDetail");
  const shopDialogProgress = document.getElementById("shopDialogProgress");
  const shopDialogCancelButton = document.getElementById("shopDialogCancelButton");
  const shopDialogConfirmButton = document.getElementById("shopDialogConfirmButton");
  const gameOverChallenge = document.getElementById("gameOverChallenge");
  const gameOverNewBest = document.getElementById("gameOverNewBest");
  const gameOverBestValue = document.getElementById("gameOverBestValue");
  const gameOverCoinsValue = document.getElementById("gameOverCoinsValue");
  const menuCoinValue = document.getElementById("menuCoinValue");
  const menuBestValue = document.getElementById("menuBestValue");
  const menuBallIcon = document.getElementById("menuBallIcon");
  const menuThemeIcon = document.getElementById("menuThemeIcon");
  const profileBestValue = document.getElementById("profileBestValue");
  const languageValue = document.getElementById("languageValue");
  const tipBanner = document.getElementById("tipBanner");
  const missionsOverlay = document.getElementById("missionsOverlay");
  const missionsButton = document.getElementById("missionsButton");
  const missionsBackButton = document.getElementById("missionsBackButton");
  const missionsCoinBalanceValue = document.getElementById("missionsCoinBalanceValue");
  const missionsDailyTab = document.getElementById("missionsDailyTab");
  const missionsBallsTab = document.getElementById("missionsBallsTab");
  const missionsDailyPanel = document.getElementById("missionsDailyPanel");
  const missionsBallsPanel = document.getElementById("missionsBallsPanel");
  const missionsResetText = document.getElementById("missionsResetText");
  const missionList = document.getElementById("missionList");
  const missionBallList = document.getElementById("missionBallList");
  const gameOverMissions = document.getElementById("gameOverMissions");
  const tipText = document.getElementById("tipText");
  const replayTutorialButton = document.getElementById("replayTutorialButton");

  const STORAGE_KEY = "hoop-flick-best";
  const DARK_MODE_KEY = "hoop-flick-dark-mode";
  const MUTED_KEY = "hoop-flick-muted";
  const HAPTICS_KEY = "hoop-flick-haptics";
  const LANGUAGE_KEY = "hoop-flick-language";
  // Seen tutorial steps live outside the save record, like the vibration preference.
  const TUTORIAL_KEY = "hoop-flick-tutorial";
  const BALL_SKIN_KEY = "hoop-flick-ball-skin";
  const THEME_KEY = "hoop-flick-theme";
  const LOCAL_SAVE_KEY = "hoop-flick-save-v4";
  const SAVE_VERSION = 6;
  const ECONOMY_SAVE_VERSION = 4;
  const STATS_SAVE_VERSION = 5;
  const ACHIEVEMENT_SAVE_VERSION = 6;
  const WORLD_W = 420;
  const WORLD_H = 746;
  const START_HOOP_BOTTOM_OFFSET = 183;
  const HOOP_WIDTH = 72;
  const GRAVITY = 1420;
  const AIR_DRAG = 0.998;

  // MANUAL SHOT TUNING
  // Lower LAUNCH_POWER_SCALE for a slower/shorter real shot; raise it for more reach.
  // TRAJECTORY_DOT_STEPS controls preview spacing in whole 1/120 s physics steps.
  // PULL_CURVE_EXPONENT changes how quickly power builds while dragging.
  const LAUNCH_POWER_SCALE = 7.48;
  const TRAJECTORY_DOT_STEPS = 5;
  const PULL_CURVE_EXPONENT = 1;

  const MAX_PULL = 140;
  const MIN_SHOT_PULL = 12;
  const MAX_POWER_BOOST = 1.12;

  const WALL_INSET = 30;
  const HOOP_WALL_CLEARANCE = 94;
  const MIN_HOOP_HORIZONTAL_GAP = 74;
  const MAX_HOOP_HORIZONTAL_GAP = 154;
  const MIN_HOOP_VERTICAL_GAP = 152;
  const MAX_HOOP_VERTICAL_GAP = 208;
  const AIRBORNE_RETRY_DELAY = 7.5;
  const RIM_RADIUS = 7;
  const BALL_RADIUS = 12.95;
  const WALL_RESTITUTION = 0.66;
  const MAX_FRAME_DT = 0.1;
  // Longer gaps (background tab, debugger) are stalls: skip them instead of catching up.
  const STALL_FRAME_DT = 0.25;
  // Approach speed that separates a real impact from gravity pressing a resting/sliding ball.
  const SEGMENT_IMPACT_SPEED = 40;
  // Feel tuning: sound, vibration, squash and shake only; never feeds back into physics.
  const IMPACT_FEEDBACK_MIN_SPEED = 60;
  const IMPACT_FEEDBACK_FULL_SPEED = 900;
  const IMPACT_SOUND_COOLDOWN = 0.07;
  const SQUASH_STIFFNESS = 900;
  const SQUASH_DAMPING = 18;
  const SQUASH_MAX = 0.4;
  const AIM_SQUASH = 0.22;
  const FLIGHT_STRETCH_MAX = 0.18;
  const FLIGHT_STRETCH_SPEED = 7500;
  const MAX_FLAME_PARTICLES = 90;
  const FLAME_TRAIL_LIFE = 0.22;
  const FLAME_TRAIL_SPACING = 6;
  const FLAME_TRAIL_MAX_LENGTH = 120;
  const SCORE_SHAKE = Object.freeze({ basket: 2.5, perfect: 3.5, perStreak: 0.5, wall: 1, max: 6 });
  // Brief simulation freeze that lands the moment; ignition (the streak reaching the flame) holds longer.
  const HIT_STOP = Object.freeze({ perfect: 0.05, ignite: 0.11 });
  const Physics = globalThis.HoopFlickPhysics;
  const BallArt = globalThis.HoopFlickBallArt;
  const HoopArt = globalThis.HoopFlickHoopArt;
  const ThemeArt = globalThis.HoopFlickThemeArt;
  const FLIGHT_PARAMS = Object.freeze({
    gravity: GRAVITY,
    airDrag: AIR_DRAG,
    launchPowerScale: LAUNCH_POWER_SCALE,
    maxPowerBoost: MAX_POWER_BOOST,
    wallInset: WALL_INSET,
    ballRadius: BALL_RADIUS,
    worldWidth: WORLD_W,
    wallRestitution: WALL_RESTITUTION
  });
  // Reachability historically ignores walls; retain that spawn rule.
  const REACHABILITY_PARAMS = Object.freeze({ ...FLIGHT_PARAMS, walls: false });
  const NET_REST_Y = 30;
  // Launch-net side walls (hoop-local): same line as collideNet, from the top
  // strand point down to the net mouth. The margin lets the ball press into the
  // net a little, so diagonal shots up to about 45° still leave cleanly.
  const LAUNCH_NET_TOP_Y = 7;
  const LAUNCH_NET_BOTTOM_Y = 52;
  const LAUNCH_NET_MARGIN = 4;
  const LAUNCH_NET_BOUNCE = 0.54;
  const BALL_SETTLE_DURATION = 0.24;
  const BALL_SETTLE_INPUT_DELAY = 0.1;
  const TIMED_SHOT_START_SCORE = 100;
  const TIMED_SHOT_MAX_SECONDS = 12;
  const TIMED_SHOT_MIN_SECONDS = 3;
  const TIMED_SHOT_SCORE_STEP = 40;
  const TIMED_SHOT_INTERVAL_MIN = 4;
  const TIMED_SHOT_INTERVAL_MAX = 6;
  const TIMED_SHOT_TICK_THRESHOLDS = Object.freeze([5, 4, 3, 2, 1]);
  const NET_ANIMATION_DURATION = 0.56;
  const HOOP_RELEASE_DURATION = 0.34;
  const HOOP_SPAWN_DURATION = 0.36;
  const HOOP_AIM_MAX_OFFSET = 9;
  const SHOT_RING_DURATION = 0.3;
  const NEW_HIGH_SCORE_DURATION = 1.35;
  const NEW_HIGH_SCORE_CONFETTI_COUNT = 22;
  const COIN_RADIUS = 9;
  const COIN_LOCAL_Y = -32;
  const COIN_INTERVAL_MIN = 4;
  const COIN_INTERVAL_MAX = 7;
  const COIN_FEEDBACK_DURATION = 0.72;
  const COIN_COLLECT_PARTICLE_COUNT = 8;
  const MAX_PARTICLES = 160;
  const MAX_SHOT_RINGS = 12;
  const SPAWN_ATTEMPTS = 14;
  const MIN_HOOP_TILT = 2.5 * (Math.PI / 180);
  const MAX_HOOP_TILT = 7 * (Math.PI / 180);

  const TUTORIAL_LAST_TARGET_ID = 4;
  const VARIETY_CHANCE_FULL_SCORE = 50;
  const MAX_HARD_TRANSITION_STREAK = 1;
  const LONG_SHOT_COOLDOWN_TRANSITIONS = 1;
  const WIDE_GAP_UNLOCK_SCORE = 8;
  const WIDE_GAP_BASE_CHANCE = 0.22;
  const WIDE_GAP_MAX_CHANCE = 0.38;
  const LONG_SHOT_UNLOCK_SCORE = 8;
  const LONG_SHOT_BASE_CHANCE = 0.08;
  const LONG_SHOT_MAX_CHANCE = 0.22;
  const LONG_SHOT_MIN_CENTER_DISTANCE = 248;
  const NORMAL_NEAR_MAX_SHARE = 0.22;
  const MAX_CONSECUTIVE_NEAR_TRANSITIONS = 1;
  const NORMAL_NEAR_MIN_CENTER_DISTANCE = 190;
  const EDGE_TRANSITION_UNLOCK_SCORE = 8;
  const EDGE_TRANSITION_BASE_CHANCE = 0.12;
  const EDGE_TRANSITION_MAX_CHANCE = 0.20;
  const EDGE_TRANSITION_COOLDOWN = 1;
  const EDGE_HOOP_WALL_GAP = 10;
  const EDGE_HOOP_INWARD_JITTER = 4;
  const FALLBACK_HORIZONTAL_GAP = 92;
  const FALLBACK_VERTICAL_GAP = 166;
  const CHALLENGED_MAX_VERTICAL_GAP = 190;
  const REACHABILITY_PULL_RATIOS = [0.6, 0.72, 0.82, 0.92, 1];
  const REACHABILITY_ELEVATION_DEGREES = [48, 56, 64, 72, 78, 84];
  const REACHABILITY_MAX_TIME = 1.65;

  const CHALLENGE_COSTS = {
    wide: 1,
    edge: 1,
    longShot: 1,
    moving: 1,
    board: 1,
    tilt: 1
  };

  const DIFFICULTY_TIERS = [
    { name: "start", minScore: 0, maxScore: 7, maxBudget: 0, weights: { easy: 1, medium: 0, hard: 0 } },
    { name: "light", minScore: 8, maxScore: 14, maxBudget: 1, weights: { easy: 0.6, medium: 0.4, hard: 0 } },
    { name: "medium", minScore: 15, maxScore: 29, maxBudget: 2, weights: { easy: 0.4, medium: 0.5, hard: 0.1 } },
    { name: "advanced", minScore: 30, maxScore: 49, maxBudget: 2, weights: { easy: 0.3, medium: 0.5, hard: 0.2 } },
    { name: "mastery", minScore: 50, maxScore: Infinity, maxBudget: 3, weights: { easy: 0.25, medium: 0.45, hard: 0.3 } }
  ];

  const DIFFICULTY_BUDGET_CAPS = {
    easy: 0,
    medium: 1,
    hard: 3
  };

  const SPAWN_GAP_PROFILES = {
    tutorial: { minX: 98, maxX: 130, minY: 166, maxY: 188 },
    normalNear: { minX: 96, maxX: 122, minY: 166, maxY: 188 },
    normalFar: { minX: 118, maxX: 148, minY: 180, maxY: 204 },
    wideHorizontal: { minX: 155, maxX: 166, minY: 158, maxY: 190 },
    wideVertical: { minX: 88, maxX: 130, minY: 209, maxY: 226 },
    wideBalanced: { minX: 132, maxX: 154, minY: 190, maxY: 214 },
    longShot: { minX: 132, maxX: 172, minY: 210, maxY: 242 },
    edge: { minX: 120, maxX: 260, minY: 170, maxY: 205 },
    fallback: {
      minX: MIN_HOOP_HORIZONTAL_GAP,
      maxX: MAX_HOOP_HORIZONTAL_GAP,
      minY: MIN_HOOP_VERTICAL_GAP,
      maxY: MAX_HOOP_VERTICAL_GAP
    }
  };

  const ECONOMY_PRICES = Object.freeze({
    ball: Object.freeze({
      classic: 0,
      inverted: 100,
      neon: 150,
      watermelon: 100,
      magma: 100,
      gold: 150,
      ghost: 150,
      toxic: 120,
      matrix: 150,
      earth: 130,
      cyberpunk: 150,
      bloodMoon: 175,
      zebra: 200,
      sun: 150
    }),
    theme: Object.freeze({
      gym: 0,
      sunset: 200,
      neon: 500,
      rooftop: 250,
      minimal: 450,
    })
  });

  // Each theme flavours the same cues; gym keeps the original marimba exactly.
  // root: score note, wave/decay/partial: mallet voice, rim: rim pitch, thump: wall/board pitch scale.
  const THEME_SOUNDS = Object.freeze({
    gym: Object.freeze({ root: 523.25, wave: "sine", waveGain: 1, decay: 0.32, partial: 4, bend: 0, click: 1, rim: 400, rimRing: 0.06, thump: 1, chainNet: false }),
    sunset: Object.freeze({ root: 440, wave: "sine", waveGain: 1, decay: 0.48, partial: 3, bend: 0, click: 0.6, rim: 370, rimRing: 0.08, thump: 0.92, chainNet: false }),
    neon: Object.freeze({ root: 523.25, wave: "square", waveGain: 0.3, decay: 0.16, partial: 0, bend: 1.02, click: 0.4, rim: 440, rimRing: 0.05, thump: 1.08, chainNet: false }),
    rooftop: Object.freeze({ root: 587.33, wave: "triangle", waveGain: 0.85, decay: 0.26, partial: 5, bend: 0, click: 1.2, rim: 500, rimRing: 0.16, thump: 0.86, chainNet: true }),
    minimal: Object.freeze({ root: 659.25, wave: "sine", waveGain: 0.9, decay: 0.6, partial: 0, bend: 0, click: 0.3, rim: 420, rimRing: 0.05, thump: 1, chainNet: false })
  });

  const BALL_SKIN_DISPLAY_ORDER = Object.freeze([
    "classic",
    "inverted",
    "watermelon",
    "magma",
    "toxic",
    "bloodMoon",
    "zebra",
    "earth",
    "cyberpunk",
    "neon",
    "gold",
    "ghost",
    "matrix",
    "sun"
  ]);
  const THEME_DISPLAY_ORDER = Object.freeze([
    "gym",
    "sunset",
    "rooftop",
    "minimal",
    "neon"
  ]);

  const BALL_EFFECT_PRESETS = {
    classic: {
      perfectStyle: "starBurst",
      perfectFlameColors: ["#fff0a6", "#ff8a2e", "#c4702c"],
      perfectFlameIntensity: 1,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.34,
      perfectFlameShape: "flame",
      comboThreshold: 3,
      trailInterval: 0.045,
      trailColors: ["#ffb347", "#f47b20", "#e95f1a"]
    },
    ice: {
      perfectStyle: "halo",
      perfectFlameColors: ["#ffffff", "#bcecff", "#62c7ff"],
      perfectFlameIntensity: 0.85,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.32,
      perfectFlameShape: "frost",
      comboThreshold: 2,
      trailInterval: 0.05,
      trailColors: ["#ffffff", "#bcecff", "#62c7ff"]
    },
    neon: {
      perfectStyle: "digitalRings",
      perfectFlameColors: ["#2cacf7", "#2cacf7", "#2cacf7"],
      perfectFlameIntensity: 1.08,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.34,
      perfectFlameShape: "energy",
      comboThreshold: 2,
      trailInterval: 0.04,
      trailColors: ["#2cacf7", "#2cacf7", "#2cacf7"]
    },
    gold: {
      perfectStyle: "starBurst",
      perfectFlameColors: ["#eed4d4", "#ffeb73", "#ffd900"],
      perfectFlameIntensity: 1.12,
      perfectFlameSize: 24,
      perfectFlameLifetime: 0.36,
      perfectFlameShape: "flame",
      trailColors: ["#ffd700", "#ffeb73", "#ffffff"],
      gravityModifier: 50,
      shrinkRate: 15
    },
    toxic: {
      perfectStyle: "splash",
      perfectFlameColors: ["#adff2f", "#39ff14", "#0a6f12"],
      perfectFlameIntensity: 1.13,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.38,
      perfectFlameShape: "acid",
      trailColors: ["#39ff14", "#adff2f", "#000000"],
      gravityModifier: -100,
      shrinkRate: 8
    },
    ghost: {
      perfectStyle: "halo",
      perfectFlameColors: ["#ffffff", "#e0e0e0", "#9fd7ff"],
      perfectFlameIntensity: 1.13,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.4,
      perfectFlameShape: "spirit",
      trailColors: ["#e0e0e0", "#ffffff", "#cccccc"],
      gravityModifier: -20,
      shrinkRate: 6
    },
    water: {
      perfectStyle: "splash",
      perfectFlameColors: ["#add8e6", "#1e90ff", "#00bfff"],
      perfectFlameIntensity: 0.95,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.36,
      perfectFlameShape: "splash",
      trailColors: ["#00bfff", "#1e90ff", "#add8e6"],
      gravityModifier: 300,
      shrinkRate: 10
    },
    plasma: {
      perfectStyle: "digitalRings",
      perfectFlameColors: ["#00ffff", "#ff00ff", "#8a2be2"],
      perfectFlameIntensity: 1.16,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.34,
      perfectFlameShape: "energy",
      trailColors: ["#8a2be2", "#ff00ff", "#00ffff"],
      gravityModifier: 0,
      shrinkRate: 20
    },
    inverted: {
      perfectStyle: "halo",
      perfectFlameColors: ["#000000", "#333333", "#666666"],
      perfectFlameIntensity: 0.9,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.4,
      perfectFlameShape: "spirit",
      trailColors: ["#333333", "#000000", "#666666"],
      gravityModifier: -20,
      shrinkRate: 6
    },
    magma: {
      perfectStyle: "splash",
      perfectFlameColors: ["#ff4500", "#c72828", "#ff0000"],
      perfectFlameIntensity: 1.2,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.36,
      perfectFlameShape: "lava",
      trailColors: ["#ff8c00", "#ff4500", "#ff0000"],
      gravityModifier: 100,
      shrinkRate: 12
    },
    watermelon: {
      perfectStyle: "starBurst",
      perfectFlameColors: ["#ff4d4d", "#e60000", "#006600"],
      perfectFlameIntensity: 1.1,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.36,
      perfectFlameShape: "splash",
      trailColors: ["#e60000", "#ff4d4d", "#006600"],
      gravityModifier: 50,
      shrinkRate: 10
    },
    earth: {
      perfectStyle: "splash",
      perfectFlameColors: ["#00bfff", "#228b22", "#8b4513"],
      perfectFlameIntensity: 1.0,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.36,
      perfectFlameShape: "splash",
      trailColors: ["#228b22", "#00bfff", "#8b4513"],
      gravityModifier: 50,
      shrinkRate: 10
    },
    bloodMoon: {
      perfectStyle: "splash",
      perfectFlameColors: ["#ff3333", "#990000", "#4d0000"],
      perfectFlameIntensity: 1.0,
      perfectFlameSize: 20,
      perfectFlameLifetime: 0.36,
      perfectFlameShape: "splash",
      trailColors: ["#990000", "#ff3333", "#4d0000"],
      gravityModifier: 50,
      shrinkRate: 10
    },
    zebra: {
      perfectStyle: "halo",
      perfectFlameColors: ["#ffffff", "#e6e6e6", "#b3b3b3"],
      perfectFlameIntensity: 1.0,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.36,
      perfectFlameShape: "spirit",
      trailColors: ["#e6e6e6", "#ffffff", "#b3b3b3"],
      gravityModifier: 50,
      shrinkRate: 10
    },
    phoenix: {
      perfectStyle: "starBurst",
      perfectFlameColors: ["#fff3b0", "#ff8a1f", "#d4213d"],
      perfectFlameIntensity: 1.18,
      perfectFlameSize: 24,
      perfectFlameLifetime: 0.38,
      perfectFlameShape: "flame",
      trailColors: ["#ffd23f", "#ff8a1f", "#d4213d"],
      gravityModifier: -160,
      shrinkRate: 10
    },
    dragon: {
      perfectStyle: "splash",
      perfectFlameColors: ["#f2ffb8", "#46e06f", "#0e7a47"],
      perfectFlameIntensity: 1.15,
      perfectFlameSize: 23,
      perfectFlameLifetime: 0.36,
      perfectFlameShape: "flame",
      trailColors: ["#46e06f", "#f2ffb8", "#0e7a47"],
      gravityModifier: -120,
      shrinkRate: 10
    },
    storm: {
      perfectStyle: "digitalRings",
      perfectFlameColors: ["#ffffff", "#ffe14d", "#6f5cff"],
      perfectFlameIntensity: 1.1,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.32,
      perfectFlameShape: "energy",
      trailColors: ["#ffe14d", "#ffffff", "#6f5cff"],
      gravityModifier: 0,
      shrinkRate: 18
    },
    disco: {
      perfectStyle: "starBurst",
      perfectFlameColors: ["#ffffff", "#ff4fd8", "#3fd0ff"],
      perfectFlameIntensity: 1.1,
      perfectFlameSize: 22,
      perfectFlameLifetime: 0.34,
      perfectFlameShape: "energy",
      trailColors: ["#ff4fd8", "#3fd0ff", "#ffe14d"],
      gravityModifier: 20,
      shrinkRate: 14
    },
    cosmic: {
      perfectStyle: "halo",
      perfectFlameColors: ["#fff0ff", "#ff5fd2", "#6a3cff"],
      perfectFlameIntensity: 1.12,
      perfectFlameSize: 23,
      perfectFlameLifetime: 0.4,
      perfectFlameShape: "energy",
      trailColors: ["#ff5fd2", "#fff0ff", "#6a3cff"],
      gravityModifier: -40,
      shrinkRate: 8
    }
  };
  const BALL_SKINS = {
    classic: {
      id: "classic",
      nameKey: "classicBall",
      descriptionKey: "selectedSkin",
      effectPreset: "classic",
      assetPath: "",
      art: {
        id: "classic", body: "#f4892a", shadow: "#c4560f", rim: "#ffd29a",
        outline: "#3b2416", seams: "#3b2416"
      },
      colors: {
        light: "#ffb24a",
        mid: "#f28a27",
        dark: "#d96a1b",
        seam: "#2f2923",
        outline: "#b95a18"
      }
    },
    inverted: {
      id: "inverted",
      nameKey: "invertedBall",
      descriptionKey: "selectSkin",
      effectPreset: "inverted",
      assetPath: "",
      art: {
        id: "inverted", body: "#2b2c35", shadow: "#0c0c12", rim: "#9aa6c4",
        rimAlpha: 0.45, outline: "#07070a", seams: "#f3f3f6", darkBody: true
      },
      colors: {
        light: "#5c5c5c",
        mid: "#2b2b2b",
        dark: "#141414",
        seam: "#ffffff",
        outline: "#0a0a0a"
      }
    },
    neon: {
      id: "neon",
      nameKey: "neonBall",
      descriptionKey: "selectSkin",
      effectPreset: "neon",
      assetPath: "",
      noSeams: true,
      art: {
        id: "neon", body: "#0b1531", shadow: "#040915", rim: "#38f2ff",
        rimAlpha: 0.35, outline: "#38f2ff", outlineWidth: 0.09, darkBody: true,
        highlightAlpha: 0.55, tubeHalo: "#00bfff", tube: "#38f2ff", tubeCore: "#eaffff"
      },
      colors: {
        light: "#38f2ff",
        mid: "#00bfff",
        dark: "#0056b3",
        seam: "transparent",
        outline: "#00264d"
      }
    },
    magma: {
      id: "magma",
      nameKey: "magmaBall",
      descriptionKey: "selectSkin",
      effectPreset: "magma",
      assetPath: "",
      art: {
        id: "magma", body: "#2c1712", shadow: "#0f0605", rim: "#ff7a3d",
        outline: "#140805", darkBody: true, plate: "#3d2119", highlightAlpha: 0.45,
        crackOuter: "#ff5a1f", crackInner: "#ffd84a"
      },
      colors: {
        light: "#fffa65",
        mid: "#ff6c00",
        dark: "#cc0000",
        seam: "#330000",
        outline: "#660000"
      }
    },
    watermelon: {
      id: "watermelon",
      nameKey: "watermelonBall",
      descriptionKey: "selectSkin",
      effectPreset: "watermelon",
      assetPath: "",
      art: {
        id: "watermelon", body: "#ff4f5f", shadow: "#b8132c", rim: "#ffb3ba",
        outline: "#1f8a3a", outlineWidth: 0.2, innerRind: "#d8f5a8", seed: "#1c1010"
      },
      colors: {
        light: "#ff4d4d",
        mid: "#e60000",
        dark: "#990000",
        seam: "#006600",
        outline: "#003300"
      }
    },
    gold: {
      id: "gold",
      nameKey: "goldBall",
      descriptionKey: "selectSkin",
      effectPreset: "gold",
      assetPath: "",
      noSeams: true,
      art: {
        id: "gold", body: "#ffc928", shadow: "#a86d00", rim: "#fff2a8",
        outline: "#5a3800", engraving: "#c98a00", metalBand: "#fff4b8", sparkle: "#ffffff"
      },
      colors: {
        light: "#ffef96",
        mid: "#ffcc00",
        dark: "#b38f00",
        seam: "transparent",
        outline: "#806600"
      }
    },
    ghost: {
      id: "ghost",
      nameKey: "ghostBall",
      descriptionKey: "selectSkin",
      effectPreset: "ghost",
      assetPath: "",
      noSeams: true,
      art: {
        id: "ghost", body: "#f3f6ff", shadow: "#b6c1e6", rim: "#ffffff",
        outline: "#7f8cbc", outlineWidth: 0.1, alpha: 0.9,
        face: "#262b46", cheek: "#ffb3c7"
      },
      colors: {
        light: "#ffffff",
        mid: "#f2f2f2",
        dark: "#cccccc",
        seam: "transparent",
        outline: "#a6a6a6"
      }
    },
    toxic: {
      id: "toxic",
      nameKey: "toxicBall",
      descriptionKey: "selectSkin",
      effectPreset: "toxic",
      assetPath: "",
      art: {
        id: "toxic", body: "#57e82e", shadow: "#1d7a12", rim: "#d6ff9e",
        outline: "#0d2a08", symbol: "#123a0c", bubble: "#e8ff9c"
      },
      colors: {
        light: "#b3ff66",
        mid: "#39ff14",
        dark: "#006600",
        seam: "#000000",
        outline: "#001a00"
      }
    },
    matrix: {
      id: "matrix",
      nameKey: "matrixBall",
      descriptionKey: "selectSkin",
      effectPreset: "toxic",
      assetPath: "",
      noSeams: true,
      art: {
        id: "matrix", body: "#03170a", shadow: "#000000", rim: "#00ff66",
        rimAlpha: 0.4, outline: "#00ff66", outlineWidth: 0.08, darkBody: true,
        highlightAlpha: 0.25, rain: "#00ff66", rainHead: "#ccffd9"
      },
      colors: {
        light: "#00ff00",
        mid: "#009900",
        dark: "#003300",
        seam: "transparent",
        outline: "#000000"
      }
    },
    earth: {
      id: "earth",
      nameKey: "earthBall",
      descriptionKey: "selectSkin",
      effectPreset: "earth",
      assetPath: "",
      art: {
        id: "earth", body: "#2f8fe0", shadow: "#143f80", rim: "#9fe6ff",
        rimAlpha: 0.85, outline: "#0b2547", land: "#4cc34a", coast: "#2e8f33", cloud: "#ffffff"
      },
      colors: {
        light: "#66ccff",
        mid: "#0073e6",
        dark: "#004080",
        seam: "#33cc33",
        outline: "#006600"
      }
    },
    cyberpunk: {
      id: "cyberpunk",
      nameKey: "cyberpunkBall",
      descriptionKey: "selectSkin",
      effectPreset: "plasma",
      assetPath: "",
      art: {
        id: "cyberpunk", body: "#ff2fa8", shadow: "#6e0f6a", rim: "#ffd1f0",
        outline: "#1a0630", band: "#ffe600", circuit: "#34f5ff"
      },
      colors: {
        light: "#ffff00",
        mid: "#ff00ff",
        dark: "#800080",
        seam: "#00ffff",
        outline: "#008080"
      }
    },
    bloodMoon: {
      id: "bloodMoon",
      nameKey: "bloodMoonBall",
      descriptionKey: "selectSkin",
      effectPreset: "bloodMoon",
      assetPath: "",
      art: {
        id: "bloodMoon", body: "#b8222c", shadow: "#4a0610", rim: "#ff8a8a",
        outline: "#24040a", crater: "#7c0f19", craterLip: "#e04f4f"
      },
      colors: {
        light: "#ff3333",
        mid: "#990000",
        dark: "#4d0000",
        seam: "#000000",
        outline: "#1a0000"
      }
    },
    zebra: {
      id: "zebra",
      nameKey: "zebraBall",
      descriptionKey: "selectSkin",
      effectPreset: "zebra",
      assetPath: "",
      art: {
        id: "zebra", body: "#f7f6f0", shadow: "#aeb0bf", rim: "#ffffff",
        outline: "#111111", stripe: "#141414"
      },
      colors: {
        light: "#ffffff",
        mid: "#e6e6e6",
        dark: "#b3b3b3",
        seam: "#000000",
        outline: "#000000"
      }
    },
    sun: {
      id: "sun",
      nameKey: "sunBall",
      descriptionKey: "selectSkin",
      effectPreset: "gold",
      assetPath: "",
      noSeams: true,
      art: {
        id: "sun", body: "#ffd21f", shadow: "#ff9a1f", rim: "#fff3a6",
        outline: "#e0560f", emissive: true, highlightAlpha: 0.5,
        corona: "#ffb020", coronaEdge: "#ff8a1f", core: "#fff3a6", flare: "#ff9a1f"
      },
      colors: {
        light: "#ffffff",
        mid: "#ffff00",
        dark: "#ff9900",
        seam: "transparent",
        outline: "#cc3300"
      }
    },
    // Challenge balls: never sold, unlocked only through BALL_CHALLENGES.
    crystal: {
      id: "crystal",
      nameKey: "crystalBall",
      descriptionKey: "selectSkin",
      effectPreset: "ice",
      assetPath: "",
      art: {
        id: "crystal", body: "#7fd0f5", shadow: "#3a86c8", rim: "#e8fbff",
        outline: "#173f66", highlightAlpha: 0.85,
        facetLight: "#c4efff", facetDark: "#4b9fd8", edge: "#effcff", sparkle: "#ffffff"
      },
      colors: { light: "#e8fbff", mid: "#7fd0f5", dark: "#3a86c8", seam: "#effcff", outline: "#173f66" }
    },
    phoenix: {
      id: "phoenix",
      nameKey: "phoenixBall",
      descriptionKey: "selectSkin",
      effectPreset: "phoenix",
      assetPath: "",
      art: {
        id: "phoenix", body: "#c4252f", shadow: "#6e0c22", rim: "#ffd36b",
        outline: "#36080f", highlightAlpha: 0.5,
        feather: "#ff7a1f", featherInner: "#ffc53d", featherTip: "#fff1a8"
      },
      colors: { light: "#ffd36b", mid: "#ff7a1f", dark: "#c4252f", seam: "#ffc53d", outline: "#36080f" }
    },
    dragon: {
      id: "dragon",
      nameKey: "dragonBall",
      descriptionKey: "selectSkin",
      effectPreset: "dragon",
      assetPath: "",
      art: {
        id: "dragon", body: "#1f9150", shadow: "#0b5530", rim: "#c4ffa8",
        outline: "#08291a", highlightAlpha: 0.55,
        scale: "#13703f", scaleEdge: "#62e38c", eye: "#ffd23f", pupil: "#08291a"
      },
      colors: { light: "#c4ffa8", mid: "#1f9150", dark: "#0b5530", seam: "#62e38c", outline: "#08291a" }
    },
    storm: {
      id: "storm",
      nameKey: "stormBall",
      descriptionKey: "selectSkin",
      effectPreset: "storm",
      assetPath: "",
      noSeams: true,
      art: {
        id: "storm", body: "#2b3456", shadow: "#121831", rim: "#93a6ff",
        rimAlpha: 0.4, outline: "#0b0f22", darkBody: true, highlightAlpha: 0.4,
        cloud: "#434e7d", cloudLight: "#5d6aa0", bolt: "#ffe14d", boltCore: "#ffffff"
      },
      colors: { light: "#ffe14d", mid: "#5d6aa0", dark: "#2b3456", seam: "transparent", outline: "#0b0f22" }
    },
    disco: {
      id: "disco",
      nameKey: "discoBall",
      descriptionKey: "selectSkin",
      effectPreset: "disco",
      assetPath: "",
      noSeams: true,
      art: {
        id: "disco", body: "#aab4c0", shadow: "#5c6878", rim: "#ffffff",
        outline: "#262d37", highlightAlpha: 0.75,
        tileLine: "#68737f", tileLight: "#dde5ee", tileColors: ["#ff4fd8", "#3fd0ff", "#ffe14d", "#7dff6a"],
        sparkle: "#ffffff"
      },
      colors: { light: "#ffffff", mid: "#aab4c0", dark: "#5c6878", seam: "transparent", outline: "#262d37" }
    },
    galaxy: {
      id: "galaxy",
      nameKey: "galaxyBall",
      descriptionKey: "selectSkin",
      effectPreset: "cosmic",
      assetPath: "",
      noSeams: true,
      art: {
        id: "galaxy", body: "#1c1446", shadow: "#0a0720", rim: "#c58bff",
        rimAlpha: 0.4, outline: "#07051a", darkBody: true, highlightAlpha: 0.35,
        nebula: "#5b2fa8", nebulaHot: "#d0459f", core: "#ffe7f7", star: "#fff6d8"
      },
      colors: { light: "#ffe7f7", mid: "#5b2fa8", dark: "#1c1446", seam: "transparent", outline: "#07051a" }
    }
  };
  // Each challenge ball unlocks once getBallChallengeProgress(metric) reaches target.
  const BALL_CHALLENGES = Object.freeze({
    crystal: Object.freeze({ metric: "perfectStreak", target: 8, descriptionKey: "challengeCrystal" }),
    phoenix: Object.freeze({ metric: "runIgnitions", target: 3, descriptionKey: "challengePhoenix" }),
    dragon: Object.freeze({ metric: "dailyStreak", target: 3, descriptionKey: "challengeDragon" }),
    storm: Object.freeze({ metric: "bankPerfects", target: 10, descriptionKey: "challengeStorm" }),
    disco: Object.freeze({ metric: "highScore", target: 300, descriptionKey: "challengeDisco" }),
    galaxy: Object.freeze({ metric: "lifetimePerfects", target: 150, descriptionKey: "challengeGalaxy" })
  });
  const CHALLENGE_SKIN_ORDER = Object.freeze(Object.keys(BALL_CHALLENGES));

  // Daily missions: three per local day (easy, medium, hard), picked from this pool with a
  // seed from the date, so a day's set is stable across reloads. "sum" metrics add up over the
  // day, "max" metrics keep the best single run. Targets are [easy, medium, hard].
  const MISSION_TYPES = Object.freeze({
    baskets: Object.freeze({ mode: "sum", targets: [15, 30, 50], icon: "◎" }),
    perfects: Object.freeze({ mode: "sum", targets: [5, 10, 20], icon: "✦" }),
    bankBaskets: Object.freeze({ mode: "sum", targets: [2, 4, 7], icon: "⇄" }),
    coins: Object.freeze({ mode: "sum", targets: [3, 6, 10], icon: "●" }),
    games: Object.freeze({ mode: "sum", targets: [3, 5, 8], icon: "▶" }),
    runScore: Object.freeze({ mode: "max", targets: null, icon: "★" }),
    perfectChain: Object.freeze({ mode: "max", targets: [2, 3, 5], icon: "≫" }),
    ignitions: Object.freeze({ mode: "sum", targets: [1, 2, 4], icon: "♨" })
  });
  const MISSION_TYPE_IDS = Object.freeze(Object.keys(MISSION_TYPES));
  const MISSION_REWARDS = Object.freeze([15, 25, 40]);
  const MISSION_BONUS_REWARD = 30;
  const MISSIONS_PER_DAY = 3;
  const THEMES = {
    gym: {
      id: "gym",
      nameKey: "themeGym",
      bgStyle: "classic",
      // Cel hoop palette (hoopArt.js): rim body/shadow/light, ink outline, net front/back strands.
      hoopArt: Object.freeze({
        light: Object.freeze({ rim: "#e8452f", rimDark: "#a52a1f", rimLight: "#ffa184", ink: "#2b1c1a", net: "#fffdf8", netShade: "#c9c1b6", shadow: "rgba(38, 48, 68, 0.13)" }),
        dark: Object.freeze({ rim: "#f25543", rimDark: "#9e2a22", rimLight: "#ffb196", ink: "#160c0b", net: "#f2f6f8", netShade: "#7f8d99", shadow: "rgba(0, 0, 0, 0.32)" })
      }),
      motif: "none",
      colors: {
        light: {
          backgroundTop: "#fbf7ee",
          backgroundBottom: "#f0eadf",
          backgroundAccent: "rgba(255, 255, 255, 0.1)",
          geometryLine: "rgba(255, 255, 255, 0)",
          geometryGlow: "rgba(255, 255, 255, 0)",
          ink: "#263044",
          ambient: "#fbf7ee",
          wallFill: "rgba(38, 48, 68, 0.08)",
          wallEdge: "rgba(38, 48, 68, 0.58)",
          trajectory: "rgba(38, 48, 68, 0.38)",
          trajectoryHot: "rgba(201, 42, 35, 0.58)",
          shotRing: "rgba(244, 123, 32, 0.82)",
          hint: "rgba(38, 48, 68, 0.28)",
          hintStrong: "rgba(38, 48, 68, 0.62)",
          hoopShadow: "rgba(38, 48, 68, 0.12)",
          boardShadow: "rgba(38, 48, 68, 0.13)",
          boardFill: "#ffffff",
          boardStroke: "#596477",
          netFill: "rgba(255, 255, 255, 0.14)",
          netEdge: "rgba(98, 111, 126, 0.24)",
          netOutline: "rgba(74, 87, 103, 0.2)",
          netLine: "rgba(255, 255, 255, 0.92)",
          netFront: "rgba(255, 255, 255, 0.98)",
          rimInner: "rgba(255, 246, 229, 0.42)",
          rimShadow: "#9f241f",
          rim: "#e43a31",
          rimHighlight: "rgba(255, 145, 119, 0.92)",
          motionPath: "rgba(64, 128, 151, 0.68)"
        },
        dark: {
          backgroundTop: "#111820",
          backgroundBottom: "#17202a",
          backgroundAccent: "rgba(255, 255, 255, 0.04)",
          geometryLine: "rgba(255, 210, 255, 0)",
          geometryGlow: "rgba(210, 120, 255, 0)",
          ink: "#e7e0ea",
          ambient: "#000000",
          wallFill: "rgba(2, 0, 0, 0.07)",
          wallEdge: "rgba(0, 0, 0, 0.42)",
          trajectory: "rgba(255, 156, 76, 0.9)",
          trajectoryHot: "rgba(255, 156, 76, 0.9)",
          shotRing: "rgba(255, 156, 76, 0.9)",
          hint: "rgba(225, 238, 247, 0.34)",
          hintStrong: "rgba(225, 238, 247, 0.72)",
          hoopShadow: "rgba(0, 0, 0, 0.24)",
          boardShadow: "rgba(0, 0, 0, 0.24)",
          boardFill: "#e9f0f2",
          boardStroke: "#758795",
          netFill: "rgba(218, 233, 240, 0.08)",
          netEdge: "rgba(221, 235, 241, 0.42)",
          netOutline: "rgba(7, 15, 23, 0.28)",
          netLine: "rgba(236, 246, 250, 0.82)",
          netFront: "rgba(250, 253, 255, 0.92)",
          rimInner: "rgba(7, 14, 21, 0.34)",
          rimShadow: "#8b241f",
          rim: "#f04a3f",
          rimHighlight: "rgba(255, 160, 135, 0.9)",
          motionPath: "rgba(122, 207, 225, 0.76)"
        }
      }
    },
    sunset: {
      id: "sunset",
      nameKey: "themeSunset",
      bgStyle: "sunset",
      hoopArt: Object.freeze({
        light: Object.freeze({ rim: "#ec9437", rimDark: "#a2452f", rimLight: "#ffd58a", ink: "#3a1b22", net: "#fffaf0", netShade: "#e2c3b0", shadow: "rgba(122, 52, 44, 0.14)" }),
        dark: Object.freeze({ rim: "#f24cbf", rimDark: "#87276a", rimLight: "#ffb9ea", ink: "#1d0a18", net: "#f7eefc", netShade: "#94739f", shadow: "rgba(0, 0, 0, 0.34)" })
      }),
      motif: "sun",
      colors: {
        light: {
          backgroundTop: "#fff1df",
          backgroundBottom: "#ffe0bd",
          backgroundAccent: "rgba(255, 111, 46, 0.1)",
          geometryLine: "rgba(255, 255, 255, 0.52)",
          geometryGlow: "rgba(255, 190, 219, 0.44)",
          ink: "#5a2a20",
          ambient: "#fff1df",
          wallFill: "rgba(177, 71, 42, 0.11)",
          wallEdge: "rgba(151, 54, 32, 0.72)",
          trajectory: "rgba(109, 47, 36, 0.46)",
          trajectoryHot: "rgba(255, 111, 46, 0.72)",
          shotRing: "rgba(255, 135, 51, 0.88)",
          hint: "rgba(109, 47, 36, 0.3)",
          hintStrong: "rgba(109, 47, 36, 0.68)",
          hoopShadow: "rgba(111, 48, 32, 0.14)",
          boardShadow: "rgba(111, 48, 32, 0.15)",
          boardFill: "#fff8ee",
          boardStroke: "#9b5b45",
          netFill: "rgba(255, 247, 232, 0.18)",
          netEdge: "rgba(147, 80, 55, 0.28)",
          netOutline: "rgba(106, 53, 38, 0.22)",
          netLine: "rgba(255, 252, 243, 0.94)",
          netFront: "rgba(255, 255, 250, 0.98)",
          rimInner: "rgba(255, 235, 207, 0.5)",
          rimShadow: "#9a3279",
          rim: "#e29339",
          rimHighlight: "rgba(255, 185, 238, 0.94)",
          motionPath: "rgba(188, 88, 53, 0.68)"
        },
        dark: {
          backgroundTop: "#2d1724",
          backgroundBottom: "#180d17",
          backgroundAccent: "rgba(255, 124, 211, 0.09)",
          geometryLine: "rgba(255, 205, 239, 0.2)",
          geometryGlow: "rgba(255, 124, 211, 0.2)",
          ink: "#f4ebff",
          ambient: "#6d4d89",
          wallFill: "rgba(226, 206, 255, 0.08)",
          wallEdge: "rgba(222, 198, 255, 0.64)",
          trajectory: "rgba(233, 216, 255, 0.56)",
          trajectoryHot: "rgba(255, 124, 211, 0.82)",
          shotRing: "rgba(255, 143, 225, 0.9)",
          hint: "rgba(230, 210, 255, 0.32)",
          hintStrong: "rgba(238, 224, 255, 0.74)",
          hoopShadow: "rgba(0, 0, 0, 0.3)",
          boardShadow: "rgba(0, 0, 0, 0.3)",
          boardFill: "#eee5f7",
          boardStroke: "#8b6ca3",
          netFill: "rgba(225, 210, 239, 0.08)",
          netEdge: "rgba(226, 207, 241, 0.4)",
          netOutline: "rgba(13, 6, 21, 0.34)",
          netLine: "rgba(246, 237, 252, 0.84)",
          netFront: "rgba(255, 249, 255, 0.94)",
          rimInner: "rgba(28, 8, 36, 0.42)",
          rimShadow: "#862a67",
          rim: "#f043bc",
          rimHighlight: "rgba(255, 172, 232, 0.92)",
          motionPath: "rgba(190, 132, 232, 0.78)"
        }
      }
    },
    neon: {
      id: "neon",
      nameKey: "themeNeon",
      bgStyle: "neon",
      hoopArt: Object.freeze({
        light: Object.freeze({ rim: "#13a9f0", rimDark: "#0b5fbd", rimLight: "#97f4ff", ink: "#0c2944", net: "#fbffff", netShade: "#a6d5e2", shadow: "rgba(12, 60, 90, 0.13)" }),
        dark: Object.freeze({ rim: "#14e0cc", rimDark: "#196a96", rimLight: "#c8fff5", ink: "#03111b", net: "#e4ffff", netShade: "#3b7b8f", shadow: "rgba(0, 0, 0, 0.36)", glow: true })
      }),
      motif: "geometry",
      colors: {
        light: {
          backgroundTop: "#f0fbff",
          backgroundBottom: "#e7fff9",
          backgroundAccent: "rgba(0, 191, 255, 0.11)",
          geometryLine: "rgba(255, 255, 255, 0.54)",
          geometryGlow: "rgba(150, 242, 255, 0.4)",
          ink: "#184250",
          ambient: "#effff5",
          wallFill: "rgba(24, 103, 78, 0.1)",
          wallEdge: "rgba(24, 103, 78, 0.7)",
          trajectory: "rgb(12, 139, 170)",
          trajectoryHot: "rgb(12, 139, 170)",
          shotRing: "rgb(12, 139, 170)",
          hint: "rgba(25, 88, 72, 0.28)",
          hintStrong: "rgba(25, 88, 72, 0.64)",
          hoopShadow: "rgba(20, 88, 69, 0.13)",
          boardShadow: "rgba(20, 88, 69, 0.14)",
          boardFill: "#f8fff9",
          boardStroke: "#4b7e70",
          netFill: "rgba(247, 255, 250, 0.16)",
          netEdge: "rgba(56, 122, 101, 0.26)",
          netOutline: "rgba(33, 91, 75, 0.21)",
          netLine: "rgba(252, 255, 253, 0.94)",
          netFront: "rgba(255, 255, 255, 0.98)",
          rimInner: "rgba(12, 31, 209, 0.46)",
          rimShadow: "#0671eb",
          rim: "#08a6f0",
          rimHighlight: "rgba(0, 255, 234, 0.92)",
          motionPath: "rgba(49, 139, 111, 0.7)"
        },
        dark: {
          backgroundTop: "#091923",
          backgroundBottom: "#050910",
          backgroundAccent: "rgba(56, 242, 255, 0.1)",
          geometryLine: "rgba(160, 250, 255, 0.2)",
          geometryGlow: "rgba(56, 242, 255, 0.2)",
          ink: "#e8fbff",
          ambient: "#173d4d",
          wallFill: "rgba(94, 241, 255, 0.08)",
          wallEdge: "rgba(152, 245, 255, 0.6)",
          trajectory: "rgba(176, 250, 255, 0.56)",
          trajectoryHot: "rgba(26, 219, 161, 0.78)",
          shotRing: "rgba(56, 242, 255, 0.9)",
          hint: "rgba(150, 242, 255, 0.28)",
          hintStrong: "rgba(200, 255, 255, 0.7)",
          hoopShadow: "rgba(0, 0, 0, 0.34)",
          boardShadow: "rgba(0, 0, 0, 0.32)",
          boardFill: "#dff8ff",
          boardStroke: "#4f8ba0",
          netFill: "rgba(210, 252, 255, 0.08)",
          netEdge: "rgba(200, 250, 255, 0.4)",
          netOutline: "rgba(2, 19, 24, 0.36)",
          netLine: "rgba(236, 255, 255, 0.86)",
          netFront: "rgba(248, 255, 255, 0.94)",
          rimInner: "rgba(0, 25, 30, 0.36)",
          rimShadow: "#245b9c",
          rim: "#0ddac8",
          rimHighlight: "rgba(220, 206, 255, 0.92)",
          motionPath: "rgba(156, 255, 87, 0.72)"
        }
      }
    },
    rooftop: {
      id: "rooftop",
      nameKey: "themeRooftop",
      bgStyle: "court",
      // Street court: a chain net to match the rooftop chain-net sound.
      hoopArt: Object.freeze({
        light: Object.freeze({ rim: "#df62ea", rimDark: "#863095", rimLight: "#ffc6f8", ink: "#2b1730", net: "#d9dee6", netShade: "#8d95a3", shadow: "rgba(40, 50, 70, 0.14)", chainNet: true }),
        dark: Object.freeze({ rim: "#f27bc6", rimDark: "#862b67", rimLight: "#ffc9ea", ink: "#170d16", net: "#d3d8e0", netShade: "#666f80", shadow: "rgba(0, 0, 0, 0.36)", chainNet: true })
      }),
      motif: "court",
      colors: {
        light: {
          backgroundTop: "#eef5ff",
          backgroundBottom: "#dde8f2",
          backgroundAccent: "rgba(64, 128, 151, 0.08)",
          geometryLine: "rgba(255, 255, 255, 0.48)",
          geometryGlow: "rgba(193, 223, 255, 0.38)",
          ink: "#27364a",
          ambient: "#eef5ff",
          wallFill: "rgba(39, 54, 74, 0.1)",
          wallEdge: "rgba(39, 54, 74, 0.7)",
          trajectory: "rgba(223, 20, 212, 0.84)",
          trajectoryHot: "rgba(223, 20, 212, 0.84)",
          shotRing: "rgba(223, 20, 212, 0.84)",
          hint: "rgba(39, 54, 74, 0.28)",
          hintStrong: "rgba(39, 54, 74, 0.62)",
          hoopShadow: "rgba(39, 54, 74, 0.13)",
          boardShadow: "rgba(39, 54, 74, 0.14)",
          boardFill: "#f8fbff",
          boardStroke: "#65768e",
          netFill: "rgba(248, 251, 255, 0.14)",
          netEdge: "rgba(89, 104, 124, 0.27)",
          netOutline: "rgba(58, 72, 91, 0.2)",
          netLine: "rgba(255, 255, 255, 0.92)",
          netFront: "rgba(255, 255, 255, 0.98)",
          rimInner: "rgba(255, 246, 229, 0.44)",
          rimShadow: "#ffffff",
          rim: "#e161ec",
          rimHighlight: "rgba(255, 255, 255, 0.88)",
          motionPath: "rgba(64, 128, 151, 0.68)"
        },
        dark: {
          backgroundTop: "#202936",
          backgroundBottom: "#101720",
          backgroundAccent: "rgba(255, 123, 84, 0.08)",
          geometryLine: "rgba(255, 215, 226, 0.18)",
          geometryGlow: "rgba(255, 123, 154, 0.18)",
          ink: "#ffe8e8",
          ambient: "#7d3038",
          wallFill: "rgba(255, 211, 211, 0.08)",
          wallEdge: "rgba(255, 205, 205, 0.62)",
          trajectory: "rgba(235, 95, 228, 0.88)",
          trajectoryHot: "rgba(235, 95, 228, 0.88)",
          shotRing: "rgba(235, 95, 228, 0.88)",
          hint: "rgba(255, 218, 218, 0.3)",
          hintStrong: "rgba(255, 230, 230, 0.72)",
          hoopShadow: "rgba(0, 0, 0, 0.32)",
          boardShadow: "rgba(0, 0, 0, 0.32)",
          boardFill: "#f3e7e7",
          boardStroke: "#9b696d",
          netFill: "rgba(244, 218, 218, 0.08)",
          netEdge: "rgba(247, 216, 216, 0.4)",
          netOutline: "rgba(24, 5, 7, 0.34)",
          netLine: "rgba(255, 238, 238, 0.84)",
          netFront: "rgba(255, 249, 249, 0.94)",
          rimInner: "rgba(34, 5, 8, 0.42)",
          rimShadow: "#7a2a66",
          rim: "#f077c3",
          rimHighlight: "rgba(255, 170, 226, 0.92)",
          motionPath: "rgba(221, 105, 112, 0.78)"
        }
      }
    },
    minimal: {
      id: "minimal",
      nameKey: "themeMinimal",
      bgStyle: "minimal",
      hoopArt: Object.freeze({
        light: Object.freeze({ rim: "#3e3a3a", rimDark: "#1c1a1a", rimLight: "#9a9393", ink: "#121010", net: "#ffffff", netShade: "#cfc9c0", shadow: "rgba(30, 28, 26, 0.12)", rimThickness: 4.2 }),
        dark: Object.freeze({ rim: "#ebe6de", rimDark: "#a29c93", rimLight: "#ffffff", ink: "#0a0a0c", net: "#f1ede6", netShade: "#78746d", shadow: "rgba(0, 0, 0, 0.34)", rimThickness: 4.2 })
      }),
      motif: "vignette",
      colors: {
        light: {
          backgroundTop: "#fbfaf7",
          backgroundBottom: "#ece8df",
          backgroundAccent: "rgba(38, 48, 68, 0.05)",
          geometryLine: "rgba(255, 255, 255, 0.42)",
          geometryGlow: "rgba(244, 241, 234, 0.38)",
          ink: "#2c3038",
          ambient: "#fbfaf7",
          wallFill: "rgba(44, 48, 56, 0.08)",
          wallEdge: "rgba(44, 48, 56, 0.64)",
          trajectory: "rgb(0, 0, 0)",
          trajectoryHot: "rgb(0, 0, 0)",
          shotRing: "rgb(0, 0, 0)",
          hint: "rgba(44, 48, 56, 0.24)",
          hintStrong: "rgba(44, 48, 56, 0.58)",
          hoopShadow: "rgba(44, 48, 56, 0.1)",
          boardShadow: "rgba(44, 48, 56, 0.12)",
          boardFill: "#fffdf9",
          boardStroke: "#74706a",
          netFill: "rgba(255, 255, 255, 0.12)",
          netEdge: "rgba(85, 84, 82, 0.23)",
          netOutline: "rgba(67, 66, 64, 0.18)",
          netLine: "rgba(255, 255, 255, 0.9)",
          netFront: "rgba(255, 255, 255, 0.98)",
          rimInner: "rgba(255, 246, 229, 0.4)",
          rimShadow: "#ffffff",
          rim: "#5a5353",
          rimHighlight: "rgb(255, 255, 255)",
          motionPath: "rgba(95, 103, 111, 0.58)"
        },
        dark: {
          backgroundTop: "#181a20",
          backgroundBottom: "#0d0f13",
          backgroundAccent: "rgba(255, 255, 255, 0.04)",
          geometryLine: "rgba(244, 241, 234, 0.16)",
          geometryGlow: "rgba(244, 241, 234, 0.14)",
          ink: "#f4f1ea",
          ambient: "#3d4149",
          wallFill: "rgba(244, 241, 234, 0.07)",
          wallEdge: "rgba(244, 241, 234, 0.56)",
          trajectory: "rgb(255, 255, 255)",
          trajectoryHot: "rgb(255, 255, 255)",
          shotRing: "rgb(255, 255, 255)",
          hint: "rgba(244, 241, 234, 0.28)",
          hintStrong: "rgba(244, 241, 234, 0.66)",
          hoopShadow: "rgba(0, 0, 0, 0.3)",
          boardShadow: "rgba(0, 0, 0, 0.28)",
          boardFill: "#e9e5dd",
          boardStroke: "#7c7a75",
          netFill: "rgba(233, 229, 221, 0.07)",
          netEdge: "rgba(233, 229, 221, 0.36)",
          netOutline: "rgba(8, 9, 11, 0.32)",
          netLine: "rgba(248, 245, 238, 0.82)",
          netFront: "rgba(255, 252, 245, 0.92)",
          rimInner: "rgba(11, 12, 15, 0.34)",
          rimShadow: "#e6d7e2",
          rim: "#3f303b",
          rimHighlight: "rgba(243, 237, 241, 0.88)",
          motionPath: "rgba(190, 196, 200, 0.6)"
        }
      }
    }
  };
  const ACHIEVEMENTS = Object.freeze([
    Object.freeze({ id: "perfect_streak_5", groupKey: "achievementGroupPerfect", nameKey: "achievementPerfect5Name", descriptionKey: "achievementPerfect5Description", tier: "bronze", metric: "perfectStreak", target: 5, reward: 15 }),
    Object.freeze({ id: "perfect_streak_10", groupKey: "achievementGroupPerfect", nameKey: "achievementPerfect10Name", descriptionKey: "achievementPerfect10Description", tier: "silver", metric: "perfectStreak", target: 10, reward: 30 }),
    Object.freeze({ id: "perfect_streak_20", groupKey: "achievementGroupPerfect", nameKey: "achievementPerfect20Name", descriptionKey: "achievementPerfect20Description", tier: "gold", metric: "perfectStreak", target: 20, reward: 60 }),
    Object.freeze({ id: "perfect_streak_30", groupKey: "achievementGroupPerfect", nameKey: "achievementPerfect30Name", descriptionKey: "achievementPerfect30Description", tier: "flame", metric: "perfectStreak", target: 30, reward: 100 }),
    Object.freeze({ id: "high_score_200", groupKey: "achievementGroupScore", nameKey: "achievementScore200Name", descriptionKey: "achievementScore200Description", tier: "bronze", metric: "highScore", target: 200, reward: 25 }),
    Object.freeze({ id: "high_score_350", groupKey: "achievementGroupScore", nameKey: "achievementScore350Name", descriptionKey: "achievementScore350Description", tier: "silver", metric: "highScore", target: 350, reward: 50 }),
    Object.freeze({ id: "high_score_500", groupKey: "achievementGroupScore", nameKey: "achievementScore500Name", descriptionKey: "achievementScore500Description", tier: "gold", metric: "highScore", target: 500, reward: 75 }),
    Object.freeze({ id: "high_score_700", groupKey: "achievementGroupScore", nameKey: "achievementScore700Name", descriptionKey: "achievementScore700Description", tier: "special", metric: "highScore", target: 700, reward: 125 }),
    Object.freeze({ id: "high_score_1000", groupKey: "achievementGroupScore", nameKey: "achievementScore1000Name", descriptionKey: "achievementScore1000Description", tier: "flame", metric: "highScore", target: 1000, reward: 250 }),
    Object.freeze({ id: "run_bounce_5", groupKey: "achievementGroupRunBounce", nameKey: "achievementRunBounce5Name", descriptionKey: "achievementRunBounce5Description", tier: "bronze", metric: "runBounce", target: 5, reward: 20 }),
    Object.freeze({ id: "run_bounce_10", groupKey: "achievementGroupRunBounce", nameKey: "achievementRunBounce10Name", descriptionKey: "achievementRunBounce10Description", tier: "silver", metric: "runBounce", target: 10, reward: 50 }),
    Object.freeze({ id: "run_bounce_20", groupKey: "achievementGroupRunBounce", nameKey: "achievementRunBounce20Name", descriptionKey: "achievementRunBounce20Description", tier: "gold", metric: "runBounce", target: 20, reward: 100 }),
    Object.freeze({ id: "lifetime_bounce_20", groupKey: "achievementGroupLifetimeBounce", nameKey: "achievementLifetimeBounce20Name", descriptionKey: "achievementLifetimeBounce20Description", tier: "bronze", metric: "lifetimeBounce", target: 20, reward: 15 }),
    Object.freeze({ id: "lifetime_bounce_50", groupKey: "achievementGroupLifetimeBounce", nameKey: "achievementLifetimeBounce50Name", descriptionKey: "achievementLifetimeBounce50Description", tier: "silver", metric: "lifetimeBounce", target: 50, reward: 35 }),
    Object.freeze({ id: "lifetime_bounce_100", groupKey: "achievementGroupLifetimeBounce", nameKey: "achievementLifetimeBounce100Name", descriptionKey: "achievementLifetimeBounce100Description", tier: "gold", metric: "lifetimeBounce", target: 100, reward: 75 }),
    Object.freeze({ id: "daily_login_7", groupKey: "achievementGroupDaily", nameKey: "achievementDaily7Name", descriptionKey: "achievementDaily7Description", tier: "bronze", metric: "dailyStreak", target: 7, reward: 25 }),
    Object.freeze({ id: "daily_login_14", groupKey: "achievementGroupDaily", nameKey: "achievementDaily14Name", descriptionKey: "achievementDaily14Description", tier: "silver", metric: "dailyStreak", target: 14, reward: 50 }),
    Object.freeze({ id: "daily_login_30", groupKey: "achievementGroupDaily", nameKey: "achievementDaily30Name", descriptionKey: "achievementDaily30Description", tier: "gold", metric: "dailyStreak", target: 30, reward: 125 }),
    Object.freeze({ id: "ball_collection_5", groupKey: "achievementGroupCollection", nameKey: "achievementBall5Name", descriptionKey: "achievementBall5Description", tier: "bronze", metric: "ballCollection", target: 5, reward: 25 }),
    Object.freeze({ id: "ball_collection_10", groupKey: "achievementGroupCollection", nameKey: "achievementBall10Name", descriptionKey: "achievementBall10Description", tier: "silver", metric: "ballCollection", target: 10, reward: 60 }),
    Object.freeze({ id: "ball_collection_all", groupKey: "achievementGroupCollection", nameKey: "achievementBallAllName", descriptionKey: "achievementBallAllDescription", tier: "gold", metric: "shopBallCollection", target: BALL_SKIN_DISPLAY_ORDER.length, reward: 125 }),
    Object.freeze({ id: "double_bounce_basket", groupKey: "achievementGroupSpecial", nameKey: "achievementDoubleBounceName", descriptionKey: "achievementDoubleBounceDescription", tier: "special", metric: "unlocked", target: 1, reward: 50 }),
    Object.freeze({ id: "theme_collection_all", groupKey: "achievementGroupSpecial", nameKey: "achievementThemeAllName", descriptionKey: "achievementThemeAllDescription", tier: "special", metric: "themeCollection", target: Object.keys(THEMES).length, reward: 100 }),
    Object.freeze({ id: "first_shot_bounce", groupKey: "achievementGroupSpecial", nameKey: "achievementFirstBounceName", descriptionKey: "achievementFirstBounceDescription", tier: "special", metric: "unlocked", target: 1, reward: 25 }),
    Object.freeze({ id: "last_second_timed_basket", groupKey: "achievementGroupSpecial", nameKey: "achievementLastSecondName", descriptionKey: "achievementLastSecondDescription", tier: "special", metric: "unlocked", target: 1, reward: 75 })
  ]);
  const ACHIEVEMENT_BY_ID = Object.freeze(Object.fromEntries(ACHIEVEMENTS.map((achievement) => [achievement.id, achievement])));

  const ballSkinImages = Object.create(null);
  const TRANSLATIONS = {
    tr: {
      arcadeEyebrow: "ARCADE BASKETBOL",
      tagline: "Çek, bırak ve yükselmeye devam et.",
      ballsTab: "Toplar",
      missionsTab: "Görevler",
      dailyMissions: "Günlük",
      dailyMissionsTitle: "Günlük Görevler",
      missionComplete: "Görev tamamlandı",
      missionBonus: "Bonus: bugünün 3 görevini de topla",
      missionsReset: "Yeni görevler {time} sonra",
      hoursMinutes: "{h} sa {m} dk",
      mission_baskets: "{n} basket at",
      mission_perfects: "{n} deliksiz atış yap",
      mission_bankBaskets: "Duvardan sektirerek {n} basket at",
      mission_coins: "{n} coin topla",
      mission_games: "{n} oyun oyna",
      mission_runScore: "Tek oyunda {n} puana ulaş",
      mission_perfectChain: "Üst üste {n} deliksiz at",
      mission_ignitions: "Topu {n} kez alev aldır",
      tip_aim: "Topu geri çek, nişan al ve bırak!",
      tip_perfect: "Çembere değmeden sok: DELİKSİZ! Seri yaptıkça puan artar.",
      tip_flame: "Deliksizleri art arda yap, top alev alsın!",
      tip_wall: "Duvardan sektirerek at: puan ×2!",
      tip_coin: "Coin'leri topla; yeni toplar ve temalar aç!",
      tip_timed: "Zamanlı atış! Süre bitmeden basket yap.",
      tutorialReplay: "Eğitimi Tekrarla",
      tutorialReady: "bir sonraki oyunda başlar",
      replay: "Başlat",
      themesTab: "Temalar",
      newBest: "YENİ REKOR!",
      play: "Oyna",
      profile: "Profil",
      activePlayTime: "Aktif Oynama Süresi",
      perfectBaskets: "Deliksiz Atışlar",
      bounceBaskets: "Duvardan Atışlar",
      lifetimeScore: "Toplam Skor",
      worldCoinsCollected: "Toplanan Dünya Coinleri",
      achievements: "Başarılar",
      achievementEyebrow: "ÖDÜL YOLCULUĞU",
      claimAllAchievements: "Tümünü Topla",
      backToProfile: "Profile Dön",
      achievementUnlocked: "Başarım açıldı",
      achievementCompleted: "Tamamlanan",
      achievementClaim: "Coini Al",
      achievementClaimed: "Alındı",
      achievementRewardsReady: "ödül hazır",
      achievementGroupPerfect: "Perfect Serisi",
      achievementGroupScore: "Skor Yolculuğu",
      achievementGroupRunBounce: "Tek Oyunda Bounce",
      achievementGroupLifetimeBounce: "Toplam Bounce",
      achievementGroupDaily: "Günlük Seri",
      achievementGroupCollection: "Top Koleksiyonu",
      achievementGroupSpecial: "Özel Başarılar",
      achievementTierBronze: "Bronz",
      achievementTierSilver: "Gümüş",
      achievementTierGold: "Altın",
      achievementTierFlame: "Alev Efsanesi",
      achievementTierSpecial: "Özel",
      achievementPerfect5Name: "Kıvılcım",
      achievementPerfect5Description: "Art arda 5 perfect basket at.",
      achievementPerfect10Name: "Alev Aldı",
      achievementPerfect10Description: "Art arda 10 perfect basket at.",
      achievementPerfect20Name: "Altın Dokunuş",
      achievementPerfect20Description: "Art arda 20 perfect basket at.",
      achievementPerfect30Name: "Hall of Flame",
      achievementPerfect30Description: "Art arda 30 perfect basketle efsaneler arasına gir.",
      achievementScore200Name: "Skor Kıvılcımı",
      achievementScore200Description: "En az 200 skora ulaş.",
      achievementScore350Name: "Skor Avcısı",
      achievementScore350Description: "En az 350 skora ulaş.",
      achievementScore500Name: "Yüksek Uçuş",
      achievementScore500Description: "En az 500 skora ulaş.",
      achievementScore700Name: "Pota Ustası",
      achievementScore700Description: "En az 700 skora ulaş.",
      achievementScore1000Name: "Hall of Flame",
      achievementScore1000Description: "1000 skora ulaşarak alev efsaneleri arasına gir.",
      achievementRunBounce5Name: "Sek Sek",
      achievementRunBounce5Description: "Tek bir oyunda 5 bounce basket at.",
      achievementRunBounce10Name: "Duvar Dansı",
      achievementRunBounce10Description: "Tek bir oyunda 10 bounce basket at.",
      achievementRunBounce20Name: "Pinball Kralı",
      achievementRunBounce20Description: "Tek bir oyunda 20 bounce basket at.",
      achievementLifetimeBounce20Name: "Duvarla Tanış",
      achievementLifetimeBounce20Description: "Başarılar güncellemesinden sonra toplam 20 bounce basket at.",
      achievementLifetimeBounce50Name: "Duvar Dostu",
      achievementLifetimeBounce50Description: "Başarılar güncellemesinden sonra toplam 50 bounce basket at.",
      achievementLifetimeBounce100Name: "Duvar Fısıldayan",
      achievementLifetimeBounce100Description: "Başarılar güncellemesinden sonra toplam 100 bounce basket at.",
      achievementDaily7Name: "Saha Müdavimi",
      achievementDaily7Description: "7 gün art arda oyuna gir.",
      achievementDaily14Name: "Ritim Tutturdu",
      achievementDaily14Description: "14 gün art arda oyuna gir.",
      achievementDaily30Name: "Potadan Kopamayan",
      achievementDaily30Description: "30 gün art arda oyuna gir.",
      achievementBall5Name: "Cool Ball",
      achievementBall5Description: "En az 5 top görünümüne sahip ol.",
      achievementBall10Name: "Top Bende",
      achievementBall10Description: "En az 10 top görünümüne sahip ol.",
      achievementBallAllName: "Tam Kadro",
      achievementBallAllDescription: "Mağazadaki bütün toplara sahip ol.",
      achievementDoubleBounceName: "Çifte Sek",
      achievementDoubleBounceDescription: "Tek atışta iki gerçek bounce yapıp basket at.",
      achievementThemeAllName: "Good Look",
      achievementThemeAllDescription: "Bütün temalara sahip ol.",
      achievementFirstBounceName: "Bounce Start",
      achievementFirstBounceDescription: "Yeni oyunun ilk gerçek atışında bounce basket at.",
      achievementLastSecondName: "Son Saniye",
      achievementLastSecondDescription: "Süreli atışta son 1 saniye içinde fırlattığın topu basket yap.",
      customize: "Topu Özelleştir",
      customizeTheme: "Temayı Özelleştir",
      settings: "Ayarlar",
      back: "Geri",
      collectionEyebrow: "TOP KOLEKSİYONU",
      chooseBall: "Topunu Seç",
      ballCollectionHint: "Yeni top stilleri için hazır koleksiyon.",
      backgroundTheme: "Arka Plan Teması",
      coins: "Coin",
      coinBalance: "Coin bakiyesi",
      locked: "Kilitli",
      owned: "Sahip",
      insufficientCoins: "Yetersiz coin",
      purchased: "Satın alındı",
      chooseTheme: "Tema seç",
      selectedTheme: "Seçili tema",
      themeGym: "Okul Salonu",
      themeSunset: "Sahil",
      themeNeon: "Atari",
      themeRooftop: "Gökdelen",
      themeMinimal: "Defter",
      classicBall: "Klasik Turuncu",
      invertedBall: "Karanlık Ters",
      neonBall: "Siber Neon",
      magmaBall: "Erimiş Magma",
      watermelonBall: "Karpuz",
      goldBall: "Saf Altın",
      ghostBall: "Hayalet",
      toxicBall: "Toksik Atık",
      matrixBall: "Matrix",
      earthBall: "Dünya",
      cyberpunkBall: "Siberpunk",
      bloodMoonBall: "Kanlı Ay",
      zebraBall: "Zebra",
      sunBall: "Güneş",
      crystalBall: "Buz Kristali",
      phoenixBall: "Anka",
      dragonBall: "Ejderha",
      stormBall: "Fırtına",
      discoBall: "Disko",
      galaxyBall: "Galaksi",
      shopBalls: "Mağaza Topları",
      challengeBalls: "Görev Topları",
      challengeBallsHint: "Satılmaz; yalnızca görevle açılır.",
      challengeCrystal: "Üst üste 8 deliksiz atış yap",
      challengePhoenix: "Tek oyunda alevi 3 kez yak",
      challengeDragon: "3 gün üst üste oyna",
      challengeStorm: "Duvardan sekip 10 deliksiz atış yap",
      challengeDisco: "Tek oyunda 300 puana ulaş",
      challengeGalaxy: "Toplam 150 deliksiz atış yap",
      challengeLocked: "Görev topu",
      challengeProgress: "İlerleme",
      newBallUnlocked: "Yeni top açıldı",
      newBadge: "YENİ",
      newBallsReady: "yeni top",
      nextChallengeBall: "Sıradaki görev topu",
      confirmPurchase: "{price} coin karşılığında satın almak istiyor musun?",
      balanceAfterPurchase: "Satın aldıktan sonra kalan: {coins} coin",
      buy: "Satın Al",
      cancel: "Vazgeç",
      ok: "Tamam",
      selectedSkin: "Seçili top",
      selectSkin: "Seç",
      comingSoon: "Yakında",
      comingSoonText: "Yeni toplar ve efektler sonraki güncellemede burada olacak.",
      gameOver: "Oyun Bitti",
      restart: "Yeniden Başlat",
      mainMenu: "Ana Menü",
      returnMainMenu: "Ana Menüye Dön",
      paused: "Duraklatıldı",
      pauseEyebrow: "OYUN DURAKLATILDI",
      pauseHint: "Oyuna dönmek için Devam Et düğmesine bas.",
      continue: "Devam Et",
      ballStuck: "Top Sıkıştı mı?",
      retryText: "Son hoop'a dön ve oynamaya devam et.",
      retry: "Tekrar Dene",
      score: "Skor",
      best: "En İyi",
      menu: "Menü",
      shot: "ATIŞ",
      shotTimeRemaining: "Atış için {seconds} saniye kaldı",
      sound: "Ses",
      haptics: "Titreşim",
      darkMode: "Karanlık Mod",
      language: "Dil",
      turkish: "Türkçe",
      english: "İngilizce",
      on: "Açık",
      off: "Kapalı",
      swish: "Deliksiz",
      wall: "Duvar",
      perfect: "Deliksiz",
      bounce: "Duvardan",
      nice: "Güzel",
      newHighScore: "YENİ REKOR!"
    },
    en: {
      arcadeEyebrow: "ARCADE BASKETBALL",
      tagline: "Drag, release, and keep climbing.",
      ballsTab: "Balls",
      missionsTab: "Missions",
      dailyMissions: "Daily",
      dailyMissionsTitle: "Daily Missions",
      missionComplete: "Mission complete",
      missionBonus: "Bonus: claim all 3 of today's missions",
      missionsReset: "New missions in {time}",
      hoursMinutes: "{h} h {m} min",
      mission_baskets: "Score {n} baskets",
      mission_perfects: "Make {n} swishes",
      mission_bankBaskets: "Bank {n} baskets off a wall",
      mission_coins: "Collect {n} coins",
      mission_games: "Play {n} games",
      mission_runScore: "Reach {n} points in one game",
      mission_perfectChain: "Swish {n} in a row",
      mission_ignitions: "Set the ball on fire {n} times",
      tip_aim: "Pull the ball back, aim and let go!",
      tip_perfect: "Miss the rim for a SWISH! Chains score more.",
      tip_flame: "Chain swishes to set the ball on fire!",
      tip_wall: "Bank it off a wall: points ×2!",
      tip_coin: "Grab coins to unlock balls and themes!",
      tip_timed: "Timed shot! Score before the clock runs out.",
      tutorialReplay: "Replay Tutorial",
      tutorialReady: "starts with your next game",
      replay: "Start",
      themesTab: "Themes",
      newBest: "NEW BEST!",
      play: "Play",
      profile: "Profile",
      activePlayTime: "Active Play Time",
      perfectBaskets: "Perfect Baskets",
      bounceBaskets: "Bounce Baskets",
      lifetimeScore: "Lifetime Score",
      worldCoinsCollected: "World Coins Collected",
      achievements: "Achievements",
      achievementEyebrow: "REWARD JOURNEY",
      claimAllAchievements: "Claim All",
      backToProfile: "Back to Profile",
      achievementUnlocked: "Achievement unlocked",
      achievementCompleted: "Completed",
      achievementClaim: "Claim Coins",
      achievementClaimed: "Claimed",
      achievementRewardsReady: "rewards ready",
      achievementGroupPerfect: "Perfect Streak",
      achievementGroupScore: "Score Climb",
      achievementGroupRunBounce: "Bounce in One Run",
      achievementGroupLifetimeBounce: "Lifetime Bounce",
      achievementGroupDaily: "Daily Streak",
      achievementGroupCollection: "Ball Collection",
      achievementGroupSpecial: "Special Achievements",
      achievementTierBronze: "Bronze",
      achievementTierSilver: "Silver",
      achievementTierGold: "Gold",
      achievementTierFlame: "Flame Legend",
      achievementTierSpecial: "Special",
      achievementPerfect5Name: "Spark",
      achievementPerfect5Description: "Make 5 perfect baskets in a row.",
      achievementPerfect10Name: "On Fire",
      achievementPerfect10Description: "Make 10 perfect baskets in a row.",
      achievementPerfect20Name: "Golden Touch",
      achievementPerfect20Description: "Make 20 perfect baskets in a row.",
      achievementPerfect30Name: "Hall of Flame",
      achievementPerfect30Description: "Join the legends with 30 perfect baskets in a row.",
      achievementScore200Name: "Score Spark",
      achievementScore200Description: "Reach a score of at least 200.",
      achievementScore350Name: "Score Hunter",
      achievementScore350Description: "Reach a score of at least 350.",
      achievementScore500Name: "High Flyer",
      achievementScore500Description: "Reach a score of at least 500.",
      achievementScore700Name: "Hoop Master",
      achievementScore700Description: "Reach a score of at least 700.",
      achievementScore1000Name: "Hall of Flame",
      achievementScore1000Description: "Reach a score of 1000 and join the flame legends.",
      achievementRunBounce5Name: "Hopscotch",
      achievementRunBounce5Description: "Make 5 bounce baskets in one run.",
      achievementRunBounce10Name: "Wall Dance",
      achievementRunBounce10Description: "Make 10 bounce baskets in one run.",
      achievementRunBounce20Name: "Pinball Royalty",
      achievementRunBounce20Description: "Make 20 bounce baskets in one run.",
      achievementLifetimeBounce20Name: "Meet the Wall",
      achievementLifetimeBounce20Description: "Make 20 bounce baskets after the achievements update.",
      achievementLifetimeBounce50Name: "Wall Buddy",
      achievementLifetimeBounce50Description: "Make 50 bounce baskets after the achievements update.",
      achievementLifetimeBounce100Name: "Wall Whisperer",
      achievementLifetimeBounce100Description: "Make 100 bounce baskets after the achievements update.",
      achievementDaily7Name: "Court Regular",
      achievementDaily7Description: "Visit the game for 7 consecutive days.",
      achievementDaily14Name: "In Rhythm",
      achievementDaily14Description: "Visit the game for 14 consecutive days.",
      achievementDaily30Name: "Hoop Devotee",
      achievementDaily30Description: "Visit the game for 30 consecutive days.",
      achievementBall5Name: "Cool Ball",
      achievementBall5Description: "Own at least 5 ball styles.",
      achievementBall10Name: "Ballin’",
      achievementBall10Description: "Own at least 10 ball styles.",
      achievementBallAllName: "Full Rack",
      achievementBallAllDescription: "Own every ball in the shop.",
      achievementDoubleBounceName: "Double Trouble",
      achievementDoubleBounceDescription: "Make a basket after two genuine bounces in one shot.",
      achievementThemeAllName: "Good Look",
      achievementThemeAllDescription: "Own every theme.",
      achievementFirstBounceName: "Bounce Start",
      achievementFirstBounceDescription: "Score a bounce basket with the first real shot of a new run.",
      achievementLastSecondName: "At the Buzzer",
      achievementLastSecondDescription: "Release during the final second of a timed shot and make the basket.",
      customize: "Customize Ball",
      customizeTheme: "Customize Theme",
      settings: "Settings",
      back: "Back",
      collectionEyebrow: "BALL COLLECTION",
      chooseBall: "Choose Your Ball",
      ballCollectionHint: "A collection ready for future ball styles.",
      backgroundTheme: "Background Theme",
      coins: "Coins",
      coinBalance: "Coin balance",
      locked: "Locked",
      owned: "Owned",
      insufficientCoins: "Not enough coins",
      purchased: "Purchased",
      chooseTheme: "Choose theme",
      selectedTheme: "Selected theme",
      themeGym: "School Gym",
      themeSunset: "Beach",
      themeNeon: "Arcade",
      themeRooftop: "Skyline",
      themeMinimal: "Notebook",
      classicBall: "Classic Orange",
      invertedBall: "Dark Inverted",
      neonBall: "Neon",
      magmaBall: "Molten Magma",
      watermelonBall: "Watermelon",
      goldBall: "Pure Gold",
      ghostBall: "Phantom",
      toxicBall: "Toxic Waste",
      matrixBall: "Matrix",
      earthBall: "Earth",
      cyberpunkBall: "Cyberpunk",
      bloodMoonBall: "Blood Moon",
      zebraBall: "Zebra",
      sunBall: "Sun",
      crystalBall: "Ice Crystal",
      phoenixBall: "Phoenix",
      dragonBall: "Dragon",
      stormBall: "Storm",
      discoBall: "Disco",
      galaxyBall: "Galaxy",
      shopBalls: "Shop Balls",
      challengeBalls: "Challenge Balls",
      challengeBallsHint: "Not for sale; unlocked only by challenges.",
      challengeCrystal: "Make 8 swishes in a row",
      challengePhoenix: "Light the flame 3 times in one run",
      challengeDragon: "Play 3 days in a row",
      challengeStorm: "Make 10 bank-shot swishes",
      challengeDisco: "Score 300 in one run",
      challengeGalaxy: "Make 150 swishes in total",
      challengeLocked: "Challenge ball",
      challengeProgress: "Progress",
      newBallUnlocked: "New ball unlocked",
      newBadge: "NEW",
      newBallsReady: "new balls",
      nextChallengeBall: "Next challenge ball",
      confirmPurchase: "Buy it for {price} coins?",
      balanceAfterPurchase: "Coins left after buying: {coins}",
      buy: "Buy",
      cancel: "Cancel",
      ok: "OK",
      selectedSkin: "Selected ball",
      selectSkin: "Select",
      comingSoon: "Coming Soon",
      comingSoonText: "New balls and effects will arrive here in a future update.",
      gameOver: "Game Over",
      restart: "Restart",
      mainMenu: "Main Menu",
      returnMainMenu: "Return to Main Menu",
      paused: "Paused",
      pauseEyebrow: "GAME PAUSED",
      pauseHint: "Press Continue to return to the game.",
      continue: "Continue",
      ballStuck: "Ball Stuck?",
      retryText: "Return to your last hoop and keep playing.",
      retry: "Retry",
      score: "Score",
      best: "Best",
      menu: "Menu",
      shot: "SHOT",
      shotTimeRemaining: "{seconds} seconds remaining to shoot",
      sound: "Sound",
      haptics: "Vibration",
      darkMode: "Dark Mode",
      language: "Language",
      turkish: "Turkish",
      english: "English",
      on: "On",
      off: "Off",
      swish: "Swish",
      wall: "Wall",
      perfect: "Perfect",
      bounce: "Bounce",
      nice: "Nice",
      newHighScore: "NEW HIGH SCORE!"
    }
  };
  const HOOP_ROLE = {
    INACTIVE: "inactive",
    CURRENT: "current",
    TARGET: "target"
  };

  let dpr = 1;
  let viewW = 1;
  let viewH = 1;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let lastTime = 0;
  let physicsAccumulator = 0;
  let renderAlpha = 0;
  let audioContext = null;
  let audioOutput = null;
  let noiseBuffer = null;
  let lastHapticAt = -Infinity;
  const lastImpactFeedbackAt = { rim: -Infinity, net: -Infinity, board: -Infinity, wall: -Infinity };
  let userPaused = false;
  let gameBooted = false;
  let animationFrameId = null;
  let animationLoopGeneration = 0;
  let saveTimer = null;
  let persistenceReady = false;
  let saveDirty = false;
  let saveRevision = 0;
  let savedRevision = 0;
  let saveInFlight = false;
  let saveDrainQueued = false;
  let settingsOrigin = "menu";
  let muted = readBooleanPreference(MUTED_KEY, false);
  let hapticsEnabled = readBooleanPreference(HAPTICS_KEY, true);
  // Desktop Chrome exposes vibrate() as a no-op, so also require a touch screen.
  const canVibrate = typeof navigator !== "undefined" && typeof navigator.vibrate === "function" && navigator.maxTouchPoints > 0;
  const reduceMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let darkMode = readBooleanPreference(DARK_MODE_KEY, false);
  let language = readLanguagePreference();
  let state = "menu";
  let stats = createDefaultStats();
  let achievementState = createDefaultAchievementState();
  let missionState = createEmptyMissionState();
  let missionsTab = "daily";
  let activePlaySegmentStartedAt = null;
  let runShotCount = 0;
  let runBounceBaskets = 0;
  let runIgnitions = 0;
  let runCoins = 0;
  const TUTORIAL_TIP_IDS = Object.freeze(["aim", "perfect", "flame", "wall", "coin", "timed"]);
  const TIP_DURATION = 3.6;
  const GHOST_CYCLE = 2.9;
  const tutorial = { seen: new Set(), guide: null, tipQueue: [], tipId: null, tipTimer: null, basketsThisRun: 0 };
  let achievementToastQueue = [];
  let achievementToastEntry = null;
  let achievementToastTimer = null;
  let score = 0;
  let best = readBestScore();
  let runStartBestScore = best;
  let cameraY = 0;
  let targetCameraY = 0;
  let previousTargetCameraY = 0;
  // Offscreen loss must not depend on the presentation frame rate.
  let simulationCameraY = 0;
  let simulationTime = 0;
  let shake = 0;
  let comboText = 0;
  // World point of the hoop that was just scored; the feedback text floats up from there.
  const comboAnchor = { x: WORLD_W * 0.5, y: 0 };
  let perfectChain = 0;
  let swishStreak = 0;
  let lastScoreGain = 1;
  let scoreFeedbackText = t("nice") + " +1";
  let lastWasPerfect = false;
  let lastWasBounce = false;
  let lastHoopSide = 1;
  let activePointer = null;
  let drag = null;
  let particles = [];
  let shotRings = [];
  let activeCoin = null;
  let coinTargetsRemaining = COIN_INTERVAL_MIN;
  let coinSpawnDue = false;
  let coinFeedback = null;
  let timedShotOpportunitiesRemaining = TIMED_SHOT_INTERVAL_MIN;
  let timedShotOpportunityProcessed = true;
  let timedShotFirstChallengeStarted = false;
  let timedShotActive = false;
  let timedShotAwaitingShotResult = false;
  let timedShotRemainingSeconds = 0;
  let timedShotInitialSeconds = 0;
  let timedShotTickMask = 0;
  let timedShotLastDisplayedSecond = null;
  let gameOverFinalized = false;
  let hoops = [];
  let currentHoopId = 0;
  let targetHoopId = 1;
  let airborneTime = 0;
  let hasReachedSecondHoop = false;
  const transitionHistory = {
    lastDifficulty: "easy",
    hardStreak: 0,
    lastWasLongShot: false,
    lastWasNear: false,
    lastWasEdge: false
  };
  const highScoreCelebration = {
    eligibleThisRun: best > 0,
    hasCelebratedThisRun: false,
    elapsed: 0,
    active: false,
    confetti: []
  };
  let selectedBallSkinId = readBallSkinPreference();
  let selectedThemeId = readThemePreference();
  let coins = 0;
  let ownedBallSkins = new Set(["classic"]);
  let ownedThemes = new Set(["gym"]);
  const economyStatusTimers = { ball: null, theme: null };
  const ballEffects = {
    selectedPreset: BALL_SKINS[selectedBallSkinId]?.effectPreset || "classic"
  };

  const ball = {
    x: WORLD_W * 0.5,
    y: WORLD_H - 172,
    prevX: WORLD_W * 0.5,
    prevY: WORLD_H - 172,
    vx: 0,
    vy: 0,
    r: BALL_RADIUS,
    held: true,
    touchedHoop: false,
    touchedWall: false,
    wallBounceCount: 0,
    lastSecondTimedShot: false,
    scoredHoopId: -1,
    rotation: 0,
    angularVelocity: 0,
    settle: null,
    launchHoopId: -1,
    launchInsideNet: false
  };

  const previousBallRender = { x: ball.x, y: ball.y, rotation: ball.rotation };
  const currentBallRender = { ...previousBallRender };
  // Visual-only squash/stretch spring: value > 0 stretches along angle, < 0 squashes.
  const ballSquash = { value: 0, velocity: 0, angle: 0 };
  const flameTrail = [];
  let flameClock = 0;
  let flameLickTimer = 0;
  let ballArtClock = 0;
  let ballHeat = 0;
  let ballIgnitionFlash = 0;
  let ballFlameWasActive = false;
  let hitStopTimer = 0;
  const streakHudState = { chain: -1, preset: "", dark: null };
  let lastBallHeatColors = BALL_EFFECT_PRESETS.classic.perfectFlameColors;
  const ballPreviewAnimation = { frameId: null, startedAt: 0 };
  const shopDialog = { open: false, onConfirm: null, ballSkin: null, canvas: null, returnFocus: null };
  const glowSprites = new Map();
  const flameStyles = new Map();
  const flameStyleKeys = new WeakMap();
  const debugShots = new URLSearchParams(window.location.search).get("debugShots") === "1"
    ? { preview: null, actual: [], steps: 0, recording: false, ratio: 0 }
    : null;
  const RIM_FLASH_DURATION = 0.32;
  // Dev aid: ?perf=1 shows frame timing, split by whether the flame trail is on.
  const perfStats = new URLSearchParams(window.location.search).get("perf") === "1"
    ? { windowStart: 0, frames: 0, worstMs: 0, cpuMs: 0, cpuMaxMs: 0, line: "", fire: { frames: 0, slow: 0, worstMs: 0 }, normal: { frames: 0, slow: 0, worstMs: 0 } }
    : null;

  function getBallRenderPosition() {
    return {
      x: previousBallRender.x + (currentBallRender.x - previousBallRender.x) * renderAlpha,
      y: previousBallRender.y + (currentBallRender.y - previousBallRender.y) * renderAlpha
    };
  }

  function snapBallRender() {
    previousBallRender.x = currentBallRender.x = ball.x;
    previousBallRender.y = currentBallRender.y = ball.y;
    previousBallRender.rotation = currentBallRender.rotation = ball.rotation;
  }

  function resetPhysicsClock() {
    physicsAccumulator = 0;
    renderAlpha = 0;
    snapBallRender();
    previousTargetCameraY = targetCameraY;
  }

  bestValue.textContent = String(best);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    viewW = Math.max(1, rect.width);
    viewH = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(viewW * dpr);
    canvas.height = Math.round(viewH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scale = Math.min(viewW / WORLD_W, viewH / WORLD_H);
    offsetX = (viewW - WORLD_W * scale) * 0.5;
    offsetY = (viewH - WORLD_H * scale) * 0.5;
    resetPhysicsClock();
    if (userPaused) draw();
  }

  function canAccumulateActivePlayTime() {
    return gameBooted && !userPaused && state === "playing";
  }

  function startActivePlayClock(now) {
    if (activePlaySegmentStartedAt !== null || !canAccumulateActivePlayTime()) return false;
    const timestamp = Number.isFinite(now) ? now : performance.now();
    activePlaySegmentStartedAt = timestamp;
    return true;
  }

  function commitActivePlaySegment(options) {
    if (activePlaySegmentStartedAt === null) return false;
    const config = options || {};
    const timestamp = Number.isFinite(config.now) ? config.now : performance.now();
    const elapsedMs = Math.max(0, Math.floor(timestamp - activePlaySegmentStartedAt));
    const keepRunning = Boolean(config.keepRunning) && canAccumulateActivePlayTime();
    activePlaySegmentStartedAt = keepRunning ? timestamp : null;
    if (elapsedMs <= 0) return false;
    stats.activePlayTimeMs = addSafeStat(stats.activePlayTimeMs, elapsedMs);
    return true;
  }

  function stopActivePlayClock(now) {
    return commitActivePlaySegment({ now, keepRunning: false });
  }

  function setGameState(nextState) {
    if (state === nextState) {
      startActivePlayClock();
      return false;
    }
    const activeTimeChanged = state === "playing" ? stopActivePlayClock() : false;
    if (state === "customize" && nextState !== "customize") {
      stopBallPreviewAnimation();
      markNewBallsSeen();
    }
    closeShopDialog();
    state = nextState;
    resetPhysicsClock();
    startActivePlayClock();
    return activeTimeChanged;
  }

  function resetGame(toMenu) {
    userPaused = false;
    clearTips();
    tutorial.guide = null;
    hitStopTimer = 0;
    settingsOrigin = "menu";
    score = 0;
    runShotCount = 0;
    runBounceBaskets = 0;
    runIgnitions = 0;
    runCoins = 0;
    runStartBestScore = best;
    highScoreCelebration.eligibleThisRun = runStartBestScore > 0;
    highScoreCelebration.hasCelebratedThisRun = false;
    highScoreCelebration.elapsed = 0;
    highScoreCelebration.active = false;
    highScoreCelebration.confetti = [];
    cameraY = 0;
    targetCameraY = 0;
    previousTargetCameraY = 0;
    simulationCameraY = 0;
    simulationTime = 0;
    resetPhysicsClock();
    if (debugShots) {
      debugShots.preview = null;
      debugShots.actual = [];
      debugShots.recording = false;
    }
    shake = 0;
    ballSquash.value = 0;
    ballSquash.velocity = 0;
    ballHeat = 0;
    ballIgnitionFlash = 0;
    ballFlameWasActive = false;
    for (const kind of Object.keys(lastImpactFeedbackAt)) lastImpactFeedbackAt[kind] = -Infinity;
    comboText = 0;
    perfectChain = 0;
    swishStreak = 0;
    lastScoreGain = 1;
    scoreFeedbackText = t("nice") + " +1";
    lastWasPerfect = false;
    lastWasBounce = false;
    lastHoopSide = 1;
    hasReachedSecondHoop = false;
    transitionHistory.lastDifficulty = "easy";
    transitionHistory.hardStreak = 0;
    transitionHistory.lastWasLongShot = false;
    transitionHistory.lastWasNear = false;
    transitionHistory.lastWasEdge = false;
    particles = [];
    shotRings = [];
    resetCoinRun();
    resetTimedShotRun();
    gameOverFinalized = false;
    if (activePointer !== null && canvas.hasPointerCapture(activePointer)) {
      canvas.releasePointerCapture(activePointer);
    }
    activePointer = null;
    drag = null;
    airborneTime = 0;
    const startHoop = makeStartHoop();
    const firstTarget = makeFirstTargetHoop(startHoop);
    hoops = [startHoop, firstTarget];
    lastHoopSide = firstTarget.x >= startHoop.x ? 1 : -1;
    currentHoopId = hoops[0].id;
    targetHoopId = hoops[1].id;
    setHoopRoles(currentHoopId, targetHoopId);
    placeBallInHoop(hoops[0]);
    ball.scoredHoopId = hoops[0].id;
    updateScore();
    setGameState(toMenu ? "menu" : "playing");
    mainMenuOverlay.classList.toggle("active", state === "menu");
    profileOverlay.classList.remove("active");
    achievementsOverlay?.classList.remove("active");
    settingsOverlay.classList.remove("active");
    customizeOverlay.classList.remove("active");
    themeOverlay?.classList.remove("active");
    missionsOverlay?.classList.remove("active");
    pauseOverlay.classList.remove("active");
    gameOverOverlay.classList.remove("active");
    retryOverlay.classList.remove("active");
    retryButton.blur();
    syncUiState();
  }

  function makeStartHoop() {
    const startOnLeft = Math.random() < 0.5;
    const x = startOnLeft ? random(128, 154) : random(WORLD_W - 154, WORLD_W - 128);
    return makeHoop(x, WORLD_H - START_HOOP_BOTTOM_OFFSET, 0, null);
  }

  function makeFirstTargetHoop(startHoop) {
    const startOnLeft = startHoop.x < WORLD_W * 0.5;
    const x = startOnLeft ? random(252, 292) : random(128, 168);
    const y = startHoop.y - random(174, 192);
    return makeHoop(x, y, 1, startHoop);
  }

  function makeHoop(x, y, id, sourceHoop, transitionPlan) {
    const difficulty = clamp(score / 30, 0, 1);
    const features = transitionPlan?.features || { moving: false, board: false, tilt: false };
    const moving = Boolean(features.moving);
    const board = Boolean(features.board) && !moving;
    return {
      id,
      x,
      y,
      baseX: x,
      baseY: y,
      w: HOOP_WIDTH,
      boardW: 74,
      boardH: 52,
      role: HOOP_ROLE.INACTIVE,
      moving,
      board,
      sourceX: sourceHoop ? sourceHoop.x : null,
      movementType: moving && id % 8 === 0 ? "vertical" : "horizontal",
      moveAmplitude: moving ? random(22, 34) : 0,
      movePhase: Math.random() * Math.PI * 2,
      rotation: getDirectionalHoopRotation(x, id, sourceHoop, difficulty, moving || board, features.tilt),
      spawnProgress: 0,
      entranceTimer: 0,
      netAnimation: 0,
      releaseAnimation: 0,
      releaseDirectionX: 0,
      releaseDirectionY: -1,
      releaseStrength: 0
    };
  }

  function getDirectionalHoopRotation(targetX, id, sourceHoop, difficulty, hasOtherChallenge, tiltEnabled) {
    if (!tiltEnabled || id < 2 || !sourceHoop || hasOtherChallenge || !shouldTiltHoop(id, difficulty)) return 0;
    const deltaX = sourceHoop.x - targetX;
    if (Math.abs(deltaX) < 1) return 0;
    const distanceRatio = clamp(Math.abs(deltaX) / 150, 0, 1);
    const allowedMax = MIN_HOOP_TILT + (MAX_HOOP_TILT - MIN_HOOP_TILT) * difficulty;
    const magnitude = MIN_HOOP_TILT + (allowedMax - MIN_HOOP_TILT) * distanceRatio;
    return Math.sign(deltaX) * magnitude;
  }

  function shouldTiltHoop(id, difficulty) {
    if (id < 2 || difficulty < 0.2) return false;
    return id % 3 === 2 || (difficulty >= 0.7 && id % 5 === 4);
  }

  function placeBallInHoop(hoop) {
    const restingPoint = hoopToWorld(hoop, 0, NET_REST_Y);
    ball.x = restingPoint.x;
    ball.y = restingPoint.y;
    ball.prevX = ball.x;
    ball.prevY = ball.y;
    ball.vx = 0;
    ball.vy = 0;
    ball.held = true;
    ball.touchedHoop = false;
    ball.touchedWall = false;
    ball.wallBounceCount = 0;
    ball.lastSecondTimedShot = false;
    ball.rotation = 0;
    ball.angularVelocity = 0;
    ball.settle = null;
    ball.launchHoopId = -1;
    ball.launchInsideNet = false;
    airborneTime = 0;
    snapBallRender();
    if (debugShots) debugShots.recording = false;
  }

  function startGame() {
    if (!gameBooted) return;
    ensureAudio();
    resetGame(false);
    playGameSound("start");
    beginAimGuide();
  }

  function beginGameOver() {
    if (gameOverFinalized) return false;
    consumeTimedShotChallenge();
    airborneTime = 0;
    ball.angularVelocity = 0;
    drag = null;
    if (activePointer !== null && canvas.hasPointerCapture(activePointer)) {
      canvas.releasePointerCapture(activePointer);
    }
    activePointer = null;
    return finalizeGameOver();
  }

  function finalizeGameOver() {
    if (gameOverFinalized) return false;
    gameOverFinalized = true;
    const activeTimeChanged = setGameState("gameover");
    clearTips();
    recordMissionProgress({ games: 1, runScore: score });
    if (activeTimeChanged) markSaveDirty();
    airborneTime = 0;
    ball.angularVelocity = 0;
    best = Math.max(best, score);
    writeBestScore(best);
    void flushSave();
    bestValue.textContent = String(best);
    renderGameOverSummary();
    renderGameOverMissions();
    renderGameOverChallenge();
    retryOverlay.classList.remove("active");
    gameOverOverlay.classList.add("active");
    syncUiState();
    playGameSound("gameover");
    triggerHaptic([40, 60, 70], true);
    return true;
  }

  function renderGameOverSummary() {
    finalScore.textContent = String(score);
    finalScore.setAttribute("aria-label", t("score") + " " + score);
    if (gameOverBestValue) gameOverBestValue.textContent = String(best);
    if (gameOverCoinsValue) gameOverCoinsValue.textContent = "+" + runCoins;
    if (gameOverNewBest) gameOverNewBest.hidden = !(score > 0 && score > runStartBestScore);
  }

  // Game over points at the locked challenge ball closest to done: a reason for one more run.
  function getNextBallChallengeId() {
    let nextId = null;
    let nextRatio = -1;
    for (const skinId of CHALLENGE_SKIN_ORDER) {
      if (ownedBallSkins.has(skinId)) continue;
      const challenge = BALL_CHALLENGES[skinId];
      const ratio = Math.min(1, getBallChallengeProgress(challenge) / challenge.target);
      if (ratio > nextRatio) {
        nextId = skinId;
        nextRatio = ratio;
      }
    }
    return nextId;
  }

  function renderGameOverChallenge() {
    if (!gameOverChallenge) return;
    const skinId = getNextBallChallengeId();
    gameOverChallenge.hidden = !skinId;
    if (!skinId) {
      gameOverChallenge.replaceChildren();
      return;
    }
    const skin = BALL_SKINS[skinId];
    const challenge = BALL_CHALLENGES[skinId];
    const preview = createBallPreviewElement("", skin);
    const copy = document.createElement("span");
    copy.className = "gameOverChallengeCopy";
    const label = document.createElement("small");
    label.textContent = t("nextChallengeBall") + " · " + t(skin.nameKey);
    const task = document.createElement("strong");
    task.textContent = t(challenge.descriptionKey);
    copy.append(label, task, createChallengeProgress(challenge));
    gameOverChallenge.replaceChildren(preview, copy);
    drawBallPreviewCanvas(preview, skin, { rotation: -0.35, time: 0, heat: 0, flash: 0 });
  }

  function recoverFirstTransition() {
    const startHoop = getHoopById(0);
    if (!startHoop) {
      resetGame(false);
      return;
    }
    swishStreak = 0;
    perfectChain = 0;
    ballHeat = 0;
    ballIgnitionFlash = 0;
    ballFlameWasActive = false;
    comboText = 0;
    shake = 0;
    particles = [];
    shotRings = [];
    drag = null;
    if (activePointer !== null && canvas.hasPointerCapture(activePointer)) {
      canvas.releasePointerCapture(activePointer);
    }
    activePointer = null;
    cameraY = 0;
    targetCameraY = 0;
    previousTargetCameraY = 0;
    simulationCameraY = 0;
    placeBallInHoop(startHoop);
    ball.scoredHoopId = startHoop.id;
    setHoopRoles(currentHoopId, targetHoopId);
    setGameState("playing");
    gameOverOverlay.classList.remove("active");
    retryOverlay.classList.remove("active");
    playGameSound("retry");
  }

  function updateScore() {
    scoreValue.textContent = String(score);
    bestValue.textContent = String(Math.max(best, score));
    const shownBest = String(Math.max(best, score));
    if (menuBestValue) menuBestValue.textContent = shownBest;
    if (profileBestValue) profileBestValue.textContent = shownBest;
  }

  function getHoopWidth() {
    return HOOP_WIDTH;
  }

  function getDifficultyTier(scoreValue, targetId) {
    if (targetId <= TUTORIAL_LAST_TARGET_ID) {
      return {
        ...DIFFICULTY_TIERS[0],
        name: "tutorial",
        tutorial: true
      };
    }
    const tier = DIFFICULTY_TIERS.find((entry) => scoreValue >= entry.minScore && scoreValue <= entry.maxScore)
      || DIFFICULTY_TIERS[DIFFICULTY_TIERS.length - 1];
    return { ...tier, tutorial: false };
  }

  function chooseTransitionDifficulty(tier) {
    if (tier.tutorial || tier.maxBudget === 0) return "easy";
    const weights = { ...tier.weights };
    if (
      transitionHistory.lastDifficulty === "hard"
      || transitionHistory.hardStreak >= MAX_HARD_TRANSITION_STREAK
    ) {
      weights.hard = 0;
    }
    const total = weights.easy + weights.medium + weights.hard;
    if (total <= 0) return "easy";
    const roll = Math.random() * total;
    if (roll < weights.easy) return "easy";
    if (roll < weights.easy + weights.medium) return "medium";
    return "hard";
  }

  function getVarietyChance(baseChance, maxChance, unlockScore) {
    const progress = clamp(
      (score - unlockScore) / Math.max(1, VARIETY_CHANCE_FULL_SCORE - unlockScore),
      0,
      1
    );
    return baseChance + (maxChance - baseChance) * progress;
  }

  function getSpawnDirection(source) {
    return source.x < WORLD_W * 0.5 ? 1 : -1;
  }

  function getAvailableHorizontalGap(source, direction) {
    const minX = WALL_INSET + HOOP_WALL_CLEARANCE;
    const maxX = WORLD_W - WALL_INSET - HOOP_WALL_CLEARANCE;
    return direction > 0 ? maxX - source.x : source.x - minX;
  }

  function chooseWideGeometry(availableHorizontalGap) {
    const choices = [];
    if (availableHorizontalGap >= SPAWN_GAP_PROFILES.wideHorizontal.minX) choices.push("wideHorizontal");
    if (availableHorizontalGap >= SPAWN_GAP_PROFILES.wideVertical.minX) choices.push("wideVertical");
    if (availableHorizontalGap >= SPAWN_GAP_PROFILES.wideBalanced.minX) choices.push("wideBalanced");
    if (!choices.length) return null;
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function chooseNormalGeometry() {
    const nearOffCooldown = MAX_CONSECUTIVE_NEAR_TRANSITIONS > 0 && !transitionHistory.lastWasNear;
    return nearOffCooldown && Math.random() < NORMAL_NEAR_MAX_SHARE ? "normalNear" : "normalFar";
  }

  function chooseTargetChallenge(targetId, geometryName, remainingBudget) {
    const features = { moving: false, board: false, tilt: false };
    if (
      remainingBudget < 1
      || geometryName === "longShot"
      || geometryName === "edge"
    ) return features;

    const difficulty = clamp(score / 30, 0, 1);
    const movingEligible = score >= 9 && targetId % 4 === 0;
    const boardEligible = score >= 7 && targetId % 3 === 0 && !movingEligible;
    const tiltEligible = shouldTiltHoop(targetId, difficulty);

    if (geometryName === "wideVertical" || geometryName === "wideBalanced") return features;
    if (geometryName === "wideHorizontal") {
      if (boardEligible) features.board = true;
      else if (tiltEligible) features.tilt = true;
      return features;
    }

    if (movingEligible) features.moving = true;
    else if (boardEligible) features.board = true;
    else if (tiltEligible) features.tilt = true;
    return features;
  }

  function getTransitionBudgetCost(plan) {
    return Number(plan.wide) * CHALLENGE_COSTS.wide
      + Number(plan.edge) * CHALLENGE_COSTS.edge
      + Number(plan.longShot) * CHALLENGE_COSTS.longShot
      + Number(plan.features.moving) * CHALLENGE_COSTS.moving
      + Number(plan.features.board) * CHALLENGE_COSTS.board
      + Number(plan.features.tilt) * CHALLENGE_COSTS.tilt;
  }

  function createTransitionPlan(source, targetId) {
    const tier = getDifficultyTier(score, targetId);
    const difficulty = chooseTransitionDifficulty(tier);
    const budgetLimit = Math.min(tier.maxBudget, DIFFICULTY_BUDGET_CAPS[difficulty]);
    const direction = getSpawnDirection(source);
    const availableHorizontalGap = getAvailableHorizontalGap(source, direction);
    let geometryName = tier.tutorial ? "tutorial" : chooseNormalGeometry();
    let longShot = false;
    let wide = false;
    let edge = false;

    if (
      !tier.tutorial
      && !hasBoard(source)
      && score >= EDGE_TRANSITION_UNLOCK_SCORE
      && budgetLimit >= CHALLENGE_COSTS.edge
      && (EDGE_TRANSITION_COOLDOWN <= 0 || !transitionHistory.lastWasEdge)
      && Math.random() < getVarietyChance(EDGE_TRANSITION_BASE_CHANCE, EDGE_TRANSITION_MAX_CHANCE, EDGE_TRANSITION_UNLOCK_SCORE)
    ) {
      geometryName = "edge";
      edge = true;
    }

    if (!edge && !tier.tutorial && budgetLimit >= CHALLENGE_COSTS.longShot) {
      const longShotAvailable = availableHorizontalGap >= SPAWN_GAP_PROFILES.longShot.minX;
      const longShotOffCooldown = LONG_SHOT_COOLDOWN_TRANSITIONS <= 0 || !transitionHistory.lastWasLongShot;
      if (
        score >= LONG_SHOT_UNLOCK_SCORE
        && longShotAvailable
        && longShotOffCooldown
        && Math.random() < getVarietyChance(LONG_SHOT_BASE_CHANCE, LONG_SHOT_MAX_CHANCE, LONG_SHOT_UNLOCK_SCORE)
      ) {
        geometryName = "longShot";
        longShot = true;
      }
    }

    if (!edge && !longShot && !tier.tutorial && budgetLimit >= CHALLENGE_COSTS.wide && score >= WIDE_GAP_UNLOCK_SCORE) {
      if (Math.random() < getVarietyChance(WIDE_GAP_BASE_CHANCE, WIDE_GAP_MAX_CHANCE, WIDE_GAP_UNLOCK_SCORE)) {
        const wideGeometry = chooseWideGeometry(availableHorizontalGap);
        if (wideGeometry) {
          geometryName = wideGeometry;
          wide = true;
        }
      }
    }

    const geometryCost = Number(wide) * CHALLENGE_COSTS.wide
      + Number(edge) * CHALLENGE_COSTS.edge
      + Number(longShot) * CHALLENGE_COSTS.longShot;
    const features = chooseTargetChallenge(targetId, geometryName, budgetLimit - geometryCost);
    const plan = {
      tier: tier.name,
      difficulty,
      budgetLimit,
      budget: 0,
      geometryName,
      profile: SPAWN_GAP_PROFILES[geometryName],
      direction,
      wide,
      edge,
      longShot,
      fallback: false,
      features
    };
    plan.budget = getTransitionBudgetCost(plan);
    return plan;
  }

  function createFallbackTransitionPlan(source) {
    return {
      tier: getDifficultyTier(score, source.id + 1).name,
      difficulty: "easy",
      budgetLimit: 0,
      budget: 0,
      geometryName: "fallback",
      profile: SPAWN_GAP_PROFILES.fallback,
      direction: getSpawnDirection(source),
      wide: false,
      edge: false,
      longShot: false,
      fallback: true,
      features: { moving: false, board: false, tilt: false }
    };
  }

  function sampleHoopCandidate(source, targetId, plan) {
    if (plan.edge) {
      const edgeCenterInset = WALL_INSET + HOOP_WIDTH * 0.5 + RIM_RADIUS + EDGE_HOOP_WALL_GAP;
      const inwardJitter = random(0, EDGE_HOOP_INWARD_JITTER);
      const x = plan.direction > 0
        ? WORLD_W - edgeCenterInset - inwardJitter
        : edgeCenterInset + inwardJitter;
      const yLift = random(plan.profile.minY, plan.profile.maxY);
      return makeHoop(x, source.y - yLift, targetId, source, plan);
    }
    const minX = WALL_INSET + HOOP_WALL_CLEARANCE;
    const maxX = WORLD_W - WALL_INSET - HOOP_WALL_CLEARANCE;
    const xDrift = random(plan.profile.minX, plan.profile.maxX);
    const yLift = random(plan.profile.minY, plan.profile.maxY);
    const x = clamp(source.x + plan.direction * xDrift, minX, maxX);
    return makeHoop(x, source.y - yLift, targetId, source, plan);
  }

  function isReachableTransition(source, target) {
    const targetPositions = [{ x: target.baseX, y: target.baseY }];
    if (target.moving && target.movementType === "horizontal") {
      targetPositions.push(
        { x: target.baseX - target.moveAmplitude, y: target.baseY },
        { x: target.baseX + target.moveAmplitude, y: target.baseY }
      );
    } else if (target.moving && target.movementType === "vertical") {
      targetPositions.push(
        { x: target.baseX, y: target.baseY - target.moveAmplitude },
        { x: target.baseX, y: target.baseY + target.moveAmplitude }
      );
    }
    return targetPositions.every((position) => isReachableTargetPosition(source, target, position));
  }

  // Wall-free flights do not depend on the start point, so each test shot is simulated once
  // (rightward) and reused as offsets; leftward shots mirror x. Saves a re-simulation per spawn candidate.
  let reachabilityPaths = null;

  function getReachabilityPaths() {
    if (reachabilityPaths) return reachabilityPaths;
    const stepCount = Math.ceil(REACHABILITY_MAX_TIME / Physics.FIXED_DT);
    reachabilityPaths = [];
    for (const pullRatio of REACHABILITY_PULL_RATIOS) {
      const pullLength = MAX_PULL * pullRatio;
      for (const elevationDegrees of REACHABILITY_ELEVATION_DEGREES) {
        const elevation = elevationDegrees * (Math.PI / 180);
        const velocity = Physics.getLaunchVelocity({
          x: Math.cos(elevation) * pullLength,
          y: -Math.sin(elevation) * pullLength,
          ratio: pullRatio,
          power: 1
        }, FLIGHT_PARAMS);
        let body = { x: 0, y: 0, ...velocity };
        const offsets = new Float64Array(stepCount * 2);
        for (let step = 0; step < stepCount; step += 1) {
          body = Physics.stepBallFlight(body, REACHABILITY_PARAMS, Physics.FIXED_DT);
          offsets[step * 2] = body.x;
          offsets[step * 2 + 1] = body.y;
        }
        reachabilityPaths.push(offsets);
      }
    }
    return reachabilityPaths;
  }

  function isReachableTargetPosition(source, target, position) {
    const start = hoopToWorld(source, 0, NET_REST_Y);
    const direction = position.x >= start.x ? 1 : -1;
    const mouthY = 4;
    const insideLimit = target.w * 0.35;
    // Same transform as worldToHoop() for the target at the candidate position.
    const cos = Math.cos(target.rotation);
    const sin = Math.sin(target.rotation);
    const startDx = start.x - position.x;
    const startDy = start.y - position.y;

    for (const offsets of getReachabilityPaths()) {
      let previousLocalX = startDx * cos + startDy * sin;
      let previousLocalY = -startDx * sin + startDy * cos;
      for (let index = 0; index < offsets.length; index += 2) {
        const dx = startDx + direction * offsets[index];
        const dy = startDy + offsets[index + 1];
        const localX = dx * cos + dy * sin;
        const localY = -dx * sin + dy * cos;
        if (localY > previousLocalY && previousLocalY <= mouthY && localY >= mouthY) {
          const localDeltaY = localY - previousLocalY;
          const ratio = localDeltaY < 0.001 ? 1 : clamp((mouthY - previousLocalY) / localDeltaY, 0, 1);
          const xAtMouth = previousLocalX + (localX - previousLocalX) * ratio;
          if (Math.abs(xAtMouth) < insideLimit) return true;
        }
        previousLocalX = localX;
        previousLocalY = localY;
      }
    }
    return false;
  }

  function nextHoop() {
    const last = hoops[hoops.length - 1];
    const targetId = last.id + 1;
    let transitionPlan = createTransitionPlan(last, targetId);
    lastHoopSide = transitionPlan.direction;
    let hoop = null;

    for (let attempt = 0; attempt < SPAWN_ATTEMPTS; attempt += 1) {
      const candidate = sampleHoopCandidate(last, targetId, transitionPlan);
      if (isFairSpawn(last, candidate, transitionPlan)) {
        hoop = candidate;
        break;
      }
    }

    if (!hoop) {
      transitionPlan = createFallbackTransitionPlan(last);
      const minX = WALL_INSET + HOOP_WALL_CLEARANCE;
      const maxX = WORLD_W - WALL_INSET - HOOP_WALL_CLEARANCE;
      const fallbackX = clamp(last.x + transitionPlan.direction * FALLBACK_HORIZONTAL_GAP, minX, maxX);
      hoop = makeHoop(fallbackX, last.y - FALLBACK_VERTICAL_GAP, targetId, last, transitionPlan);
    }

    commitTransitionHistory(transitionPlan);
    hoops.push(hoop);
    if (hoops.length > 5) hoops.shift();
    return hoop;
  }

  function rollCoinInterval() {
    return Math.floor(random(COIN_INTERVAL_MIN, COIN_INTERVAL_MAX + 1));
  }

  function resetCoinRun() {
    activeCoin = null;
    coinTargetsRemaining = rollCoinInterval();
    coinSpawnDue = false;
    coinFeedback = null;
  }

  function scheduleNextCoin() {
    coinTargetsRemaining = rollCoinInterval();
    coinSpawnDue = false;
  }

  function isCoinEligibleTarget(hoop) {
    return Boolean(
      hoop
      && hoop.id > TUTORIAL_LAST_TARGET_ID
      && !hoop.moving
      && !hoop.board
      && Math.abs(hoop.rotation) < 0.001
    );
  }

  function spawnCoinForTarget(hoop) {
    if (activeCoin || !isCoinEligibleTarget(hoop)) return false;
    activeCoin = {
      targetHoopId: hoop.id,
      localX: 0,
      localY: COIN_LOCAL_Y,
      r: COIN_RADIUS
    };
    coinTargetsRemaining = 0;
    coinSpawnDue = false;
    if (state === "playing") showTip("coin");
    return true;
  }

  function expireCoinForCompletedTarget(targetId) {
    if (!activeCoin || activeCoin.targetHoopId !== targetId) return false;
    activeCoin = null;
    scheduleNextCoin();
    return true;
  }

  function advanceCoinSchedule(completedTarget, nextTarget, intervalJustReset) {
    if (intervalJustReset || activeCoin || !completedTarget || completedTarget.id <= TUTORIAL_LAST_TARGET_ID) return;
    if (!coinSpawnDue) {
      coinTargetsRemaining = Math.max(0, coinTargetsRemaining - 1);
      if (coinTargetsRemaining === 0) coinSpawnDue = true;
    }
    if (coinSpawnDue) spawnCoinForTarget(nextTarget);
  }

  function getActiveCoinWorldPosition() {
    if (!activeCoin) return null;
    const target = getHoopById(activeCoin.targetHoopId);
    if (!target) return null;
    const position = hoopToWorld(target, activeCoin.localX, activeCoin.localY);
    return { x: position.x, y: position.y, r: activeCoin.r };
  }

  function segmentIntersectsCircle(x1, y1, x2, y2, cx, cy, radius) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
    const ratio = lengthSquared > 0
      ? clamp(((cx - x1) * dx + (cy - y1) * dy) / lengthSquared, 0, 1)
      : 0;
    const closestX = x1 + dx * ratio;
    const closestY = y1 + dy * ratio;
    const distanceX = closestX - cx;
    const distanceY = closestY - cy;
    return distanceX * distanceX + distanceY * distanceY <= radius * radius;
  }

  function detectActiveCoinCollection(flightX) {
    if (!activeCoin || activeCoin.targetHoopId !== targetHoopId) return;
    const position = getActiveCoinWorldPosition();
    if (!position) return;
    if (!segmentIntersectsCircle(
      ball.prevX,
      ball.prevY,
      flightX,
      ball.y,
      position.x,
      position.y,
      ball.r + position.r
    )) return;
    collectActiveCoin(position);
  }

  function collectActiveCoin(position) {
    if (!activeCoin) return false;
    activeCoin = null;
    coins = Math.min(Number.MAX_SAFE_INTEGER, normalizeCoins(coins) + 1);
    runCoins += 1;
    recordMissionProgress({ coins: 1 });
    stats.worldCoinsCollected = addSafeStat(stats.worldCoinsCollected, 1);
    scheduleNextCoin();
    coinFeedback = {
      x: position.x,
      y: position.y,
      life: COIN_FEEDBACK_DURATION,
      maxLife: COIN_FEEDBACK_DURATION
    };
    emitCoinCollectEffect(position.x, position.y);
    syncEconomyBalances();
    if (coinHud) restartHudAnimation(coinHud, "bump");
    requestSave(false);
    return true;
  }

  function emitCoinCollectEffect(x, y) {
    const colors = ["#ffe48a", "#f6bd2f", "#d78b12"];
    for (let i = 0; i < COIN_COLLECT_PARTICLE_COUNT; i += 1) {
      const angle = (Math.PI * 2 * i) / COIN_COLLECT_PARTICLE_COUNT;
      const speed = 42 + (i % 3) * 8;
      pushParticle({
        type: "coinSpark",
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 24,
        gravity: 100,
        life: 0.38,
        maxLife: 0.38,
        size: 2.8,
        shrinkRate: 6,
        color: colors[i % colors.length]
      });
    }
  }

  function pushParticle(particle) {
    if (particles.length >= MAX_PARTICLES) {
      particles.splice(0, particles.length - MAX_PARTICLES + 1);
    }
    particles.push(particle);
  }

  function pushShotRing(ring) {
    if (shotRings.length >= MAX_SHOT_RINGS) {
      shotRings.splice(0, shotRings.length - MAX_SHOT_RINGS + 1);
    }
    shotRings.push(ring);
  }

  function commitTransitionHistory(plan) {
    transitionHistory.lastDifficulty = plan.difficulty;
    transitionHistory.hardStreak = plan.difficulty === "hard" ? transitionHistory.hardStreak + 1 : 0;
    transitionHistory.lastWasLongShot = LONG_SHOT_COOLDOWN_TRANSITIONS > 0 && plan.longShot;
    transitionHistory.lastWasNear = plan.geometryName === "normalNear";
    transitionHistory.lastWasEdge = EDGE_TRANSITION_COOLDOWN > 0 && plan.edge;
  }

  function isFairSpawn(source, target, plan) {
    const horizontalGap = Math.abs(target.x - source.x);
    const verticalGap = source.y - target.y;
    if (horizontalGap < plan.profile.minX || horizontalGap > plan.profile.maxX) return false;
    if (verticalGap < plan.profile.minY || verticalGap > plan.profile.maxY) return false;

    const targetChallengeCost = Number(target.moving) * CHALLENGE_COSTS.moving
      + Number(target.board) * CHALLENGE_COSTS.board
      + Number(Math.abs(target.rotation) > 0.001) * CHALLENGE_COSTS.tilt;
    const totalBudget = Number(plan.wide) * CHALLENGE_COSTS.wide
      + Number(plan.edge) * CHALLENGE_COSTS.edge
      + Number(plan.longShot) * CHALLENGE_COSTS.longShot
      + targetChallengeCost;
    if (totalBudget > plan.budgetLimit || totalBudget !== plan.budget) return false;
    if (plan.longShot && targetChallengeCost > 0) return false;
    if (plan.longShot && Math.hypot(horizontalGap, verticalGap) < LONG_SHOT_MIN_CENTER_DISTANCE) return false;
    if (plan.wide && targetChallengeCost > 1) return false;
    if (plan.edge && (hasBoard(source) || hasBoard(target))) return false;
    if (plan.edge && (plan.wide || plan.longShot || targetChallengeCost > 0)) return false;
    if (plan.geometryName === "normalNear" && Math.hypot(horizontalGap, verticalGap) < NORMAL_NEAR_MIN_CENTER_DISTANCE) return false;
    if (targetChallengeCost && verticalGap > CHALLENGED_MAX_VERTICAL_GAP) return false;

    if (target.moving && (target.board || Math.abs(target.rotation) > 0.001)) return false;
    if (target.board && Math.abs(target.rotation) > 0.001) return false;

    if (target.moving && target.movementType === "horizontal") {
      if (target.baseX - target.moveAmplitude < WALL_INSET + HOOP_WALL_CLEARANCE) return false;
      if (target.baseX + target.moveAmplitude > WORLD_W - WALL_INSET - HOOP_WALL_CLEARANCE) return false;
    }
    if (target.moving && target.movementType === "vertical") {
      if (verticalGap - target.moveAmplitude < 142 || verticalGap + target.moveAmplitude > 210) return false;
    }
    if (!plan.wide && !plan.edge && !plan.longShot && !target.moving) return true;
    return isReachableTransition(source, target);
  }

  function screenToWorld(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left - offsetX) / scale,
      y: (clientY - rect.top - offsetY) / scale + cameraY
    };
  }

  function clearPointerDrag(pointerId) {
    if (pointerId !== null && canvas.hasPointerCapture(pointerId)) {
      canvas.releasePointerCapture(pointerId);
    }
    drag = null;
    activePointer = null;
  }

  function onPointerDown(event) {
    if (!gameBooted || userPaused || state !== "playing" || activePointer !== null) return;
    const settleCanBeSkipped = ball.settle && ball.settle.elapsed >= BALL_SETTLE_INPUT_DELAY;
    if (!ball.held && !settleCanBeSkipped) return;
    const p = screenToWorld(event.clientX, event.clientY);
    if (settleCanBeSkipped) finishBallSettle();
    event.preventDefault();
    activePointer = event.pointerId;
    canvas.setPointerCapture(activePointer);
    drag = {
      pointerStartX: p.x,
      pointerStartY: p.y,
      pointerCurrentX: p.x,
      pointerCurrentY: p.y
    };
  }

  function onPointerMove(event) {
    if (event.pointerId !== activePointer || !drag) return;
    event.preventDefault();
    const p = screenToWorld(event.clientX, event.clientY);
    drag.pointerCurrentX = p.x;
    drag.pointerCurrentY = p.y;
  }

  function isLastSecondTimedShotRelease() {
    return timedShotActive && timedShotRemainingSeconds > 0 && timedShotRemainingSeconds <= 1;
  }

  function onPointerUp(event) {
    if (event.pointerId !== activePointer) return;
    event.preventDefault();
    const pull = drag ? getPullVector() : null;
    if (pull && pull.len > MIN_SHOT_PULL) {
      const velocity = Physics.getLaunchVelocity(pull, FLIGHT_PARAMS);
      ball.vx = velocity.vx;
      ball.vy = velocity.vy;
      snapBallRender();
      kickBallSquash(Math.atan2(velocity.vy, velocity.vx), 0.14 + pull.ratio * 0.2);
      if (debugShots) {
        debugShots.preview = predictShot(pull, velocity);
        debugShots.actual = [];
        debugShots.steps = 0;
        debugShots.recording = true;
        debugShots.ratio = pull.ratio;
      }
      ball.held = false;
      ball.touchedHoop = false;
      ball.touchedWall = false;
      ball.wallBounceCount = 0;
      ball.lastSecondTimedShot = isLastSecondTimedShotRelease();
      runShotCount = addSafeStat(runShotCount, 1);
      ball.launchHoopId = currentHoopId;
      ball.launchInsideNet = true;
      const spinDirection = Math.sign(ball.vx) || 1;
      ball.angularVelocity = spinDirection * clamp(Math.abs(ball.vx) * 0.012, 5, 12);
      airborneTime = 0;
      const currentHoop = getHoopById(currentHoopId);
      if (currentHoop) playHoopReleaseAnimation(currentHoop, pull);
      emitShotRings(pull);
      playGameSound("shot", { power: pull.ratio });
      triggerHaptic(Math.round(6 + pull.ratio * 8));
    }
    clearPointerDrag(event.pointerId);
  }

  function onPointerCancel(event) {
    if (event.pointerId !== activePointer) return;
    event.preventDefault();
    clearPointerDrag(event.pointerId);
  }

  function getPullVector() {
    if (!drag) return { x: 0, y: 0, len: 0, ratio: 0, power: 0 };
    const rawX = drag.pointerStartX - drag.pointerCurrentX;
    const rawY = drag.pointerStartY - drag.pointerCurrentY;
    const len = Math.min(Math.hypot(rawX, rawY), MAX_PULL);
    const angle = Math.atan2(rawY, rawX);
    const ratio = len / MAX_PULL;
    const easedLen = MAX_PULL * Math.pow(ratio, PULL_CURVE_EXPONENT);
    return {
      x: Math.cos(angle) * easedLen,
      y: Math.sin(angle) * easedLen,
      len,
      ratio,
      power: 1
    };
  }

  function rollTimedShotOpportunityInterval() {
    return Math.floor(random(TIMED_SHOT_INTERVAL_MIN, TIMED_SHOT_INTERVAL_MAX + 1));
  }

  function getTimedShotDuration(scoreValue) {
    const scoreSteps = Math.floor((Math.max(TIMED_SHOT_START_SCORE, scoreValue) - TIMED_SHOT_START_SCORE) / TIMED_SHOT_SCORE_STEP);
    return clamp(TIMED_SHOT_MAX_SECONDS - scoreSteps, TIMED_SHOT_MIN_SECONDS, TIMED_SHOT_MAX_SECONDS);
  }

  function hideTimedShotHud() {
    timedShotLastDisplayedSecond = null;
    if (!timedShotHud) return;
    timedShotHud.hidden = true;
    timedShotHud.classList.remove("warning", "critical");
    timedShotHud.removeAttribute("aria-label");
  }

  function syncTimedShotHud(force) {
    if (!timedShotHud || !timedShotValue) return;
    if (!timedShotActive) {
      hideTimedShotHud();
      return;
    }

    const displaySeconds = Math.max(0, Math.ceil(timedShotRemainingSeconds));
    timedShotHud.hidden = false;
    if (!force && displaySeconds === timedShotLastDisplayedSecond) return;

    timedShotLastDisplayedSecond = displaySeconds;
    timedShotHud.classList.toggle("warning", displaySeconds <= 5 && displaySeconds > 3);
    timedShotHud.classList.toggle("critical", displaySeconds <= 3);
    timedShotValue.textContent = String(displaySeconds);
    timedShotHud.setAttribute(
      "aria-label",
      t("shotTimeRemaining").replace("{seconds}", String(displaySeconds))
    );
  }

  function resetTimedShotRun() {
    timedShotOpportunitiesRemaining = rollTimedShotOpportunityInterval();
    timedShotOpportunityProcessed = true;
    timedShotFirstChallengeStarted = false;
    timedShotActive = false;
    timedShotAwaitingShotResult = false;
    timedShotRemainingSeconds = 0;
    timedShotInitialSeconds = 0;
    timedShotTickMask = 0;
    hideTimedShotHud();
  }

  function startTimedShotChallenge() {
    if (timedShotActive || state !== "playing" || score < TIMED_SHOT_START_SCORE) return false;
    timedShotInitialSeconds = getTimedShotDuration(score);
    timedShotRemainingSeconds = timedShotInitialSeconds;
    timedShotTickMask = 0;
    timedShotLastDisplayedSecond = null;
    timedShotActive = true;
    timedShotAwaitingShotResult = false;
    syncTimedShotHud(true);
    showTip("timed");
    return true;
  }

  function processTimedShotOpportunity() {
    if (timedShotOpportunityProcessed) return false;
    timedShotOpportunityProcessed = true;
    if (timedShotActive || score < TIMED_SHOT_START_SCORE) return false;

    if (!timedShotFirstChallengeStarted) {
      const started = startTimedShotChallenge();
      if (started) timedShotFirstChallengeStarted = true;
      return started;
    }

    timedShotOpportunitiesRemaining = Math.max(0, timedShotOpportunitiesRemaining - 1);
    if (timedShotOpportunitiesRemaining > 0) return false;
    return startTimedShotChallenge();
  }

  function consumeTimedShotChallenge() {
    if (!timedShotActive) return false;
    timedShotActive = false;
    timedShotAwaitingShotResult = false;
    timedShotRemainingSeconds = 0;
    timedShotInitialSeconds = 0;
    timedShotTickMask = 0;
    timedShotOpportunitiesRemaining = rollTimedShotOpportunityInterval();
    hideTimedShotHud();
    return true;
  }

  function playTimedShotTick(seconds) {
    try {
      playGameSound("countdownTick", { seconds });
    } catch (error) {
      // Procedural audio is optional and must never block the countdown.
    }
  }

  function consumeCrossedTimedShotTicks(previousSeconds, nextSeconds) {
    let lowestCrossedThreshold = null;
    for (let index = 0; index < TIMED_SHOT_TICK_THRESHOLDS.length; index += 1) {
      const threshold = TIMED_SHOT_TICK_THRESHOLDS[index];
      const bit = 1 << index;
      if ((timedShotTickMask & bit) !== 0) continue;
      if (previousSeconds > threshold && nextSeconds <= threshold) {
        timedShotTickMask |= bit;
        lowestCrossedThreshold = threshold;
      }
    }
    if (lowestCrossedThreshold !== null) playTimedShotTick(lowestCrossedThreshold);
  }

  function updateTimedShotCountdown(dt) {
    if (!timedShotActive || timedShotAwaitingShotResult) return false;
    const previousSeconds = timedShotRemainingSeconds;
    const elapsedSeconds = Number.isFinite(dt) ? Math.max(0, dt) : 0;
    timedShotRemainingSeconds = Math.max(0, previousSeconds - elapsedSeconds);
    consumeCrossedTimedShotTicks(previousSeconds, timedShotRemainingSeconds);
    syncTimedShotHud(false);
    if (timedShotRemainingSeconds > 0) return false;

    if (!ball.held && !ball.settle) {
      timedShotAwaitingShotResult = true;
      return false;
    }

    consumeTimedShotChallenge();
    clearPointerDrag(activePointer);
    beginGameOver();
    return true;
  }

  function updateFixedStep(dt) {
    Object.assign(previousBallRender, currentBallRender);
    previousTargetCameraY = targetCameraY;
    updateSimulation(dt);
    currentBallRender.x = ball.x;
    currentBallRender.y = ball.y;
    currentBallRender.rotation = ball.rotation;
  }

  function updateSimulation(dt) {
    if (state === "playing") {
      if (updateTimedShotCountdown(dt)) return;
      simulationTime += dt;
      for (const hoop of hoops) {
        if (hoop.role !== HOOP_ROLE.INACTIVE && hoop.moving) {
          const wave = Math.sin(simulationTime * 1.8 + hoop.movePhase) * hoop.moveAmplitude;
          if (hoop.movementType === "vertical") {
            hoop.x = hoop.baseX;
            hoop.y = hoop.baseY + wave;
          } else {
            hoop.x = clamp(
              hoop.baseX + wave,
              WALL_INSET + HOOP_WALL_CLEARANCE,
              WORLD_W - WALL_INSET - HOOP_WALL_CLEARANCE
            );
            hoop.y = hoop.baseY;
          }
        }
      }

      if (ball.settle) {
        updateBallSettle(dt);
      } else if (!ball.held) {
        updateAirborneBall(dt);
      }

      const targetHoop = getHoopById(targetHoopId) || hoops[hoops.length - 1];
      const leadY = ball.held || ball.settle
        ? ball.y - WORLD_H * 0.62
        : Math.min(ball.y - WORLD_H * 0.54, targetHoop.y - WORLD_H * 0.38);
      targetCameraY = Math.min(0, leadY);
      simulationCameraY += (targetCameraY - simulationCameraY) * (1 - Math.pow(1 - 4.2 / 60, dt * 60));
    }
  }

  // In-place filter: the per-frame lists are compacted without allocating a new array.
  function removeExpired(list) {
    let kept = 0;
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].life > 0) list[kept++] = list[i];
    }
    list.length = kept;
  }

  function updatePresentation(dt) {
    ballArtClock += dt;
    updateTutorial(dt);
    for (const hoop of hoops) {
      hoop.entranceTimer = Math.min(1, (hoop.entranceTimer ?? hoop.spawnProgress ?? 1) + dt / HOOP_SPAWN_DURATION);
      hoop.spawnProgress = hoop.entranceTimer;
      hoop.netAnimation = Math.max(0, hoop.netAnimation - dt);
      hoop.rimFlash = Math.max(0, (hoop.rimFlash || 0) - dt);
      hoop.releaseAnimation = Math.max(0, hoop.releaseAnimation - dt);
    }

    updateBallSquash(dt);
    updateBallIgnition(dt);
    syncStreakHud();
    if (state === "playing") {
      const cameraTarget = previousTargetCameraY + (targetCameraY - previousTargetCameraY) * renderAlpha;
      cameraY += (cameraTarget - cameraY) * (1 - Math.pow(1 - 4.2 / 60, dt * 60));
      updateBallEffects(dt, !ball.held && !ball.settle);
    }

    removeExpired(particles);
    for (const p of particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += (p.gravity ?? 520) * dt;
      if (p.type !== "ring") p.size = Math.max(0, p.size - (p.shrinkRate ?? 12) * dt);
    }
    for (const ring of shotRings) {
      if (ring.delay > 0) {
        ring.delay -= dt;
        continue;
      }
      ring.life -= dt;
      ring.x += ring.vx * dt;
      ring.y += ring.vy * dt;
    }
    removeExpired(shotRings);
    updateHighScoreCelebration(dt);
    shake = Math.max(0, shake - dt * 26);
    comboText = Math.max(0, comboText - dt);
    if (coinFeedback) {
      coinFeedback.life -= dt;
      if (coinFeedback.life <= 0) coinFeedback = null;
    }
  }

  function updateBallIgnition(dt) {
    const preset = getActiveFlamePreset();
    const active = Boolean(preset);
    if (preset) lastBallHeatColors = getFlameStyle(preset).colors;
    if (active && !ballFlameWasActive) {
      const position = getBallRenderPosition();
      const style = getFlameStyle(preset);
      const colors = style.colors;
      ballIgnitionFlash = 1;
      // Ignition must read even when the ball sits behind the net: a thick mid-colour ring, a deeper
      // ring that follows (the pale core colour vanishes on light themes), and a burst of flame tongues.
      pushShotRing({
        x: position.x, y: position.y, vx: 0, vy: 0, delay: 0,
        life: 0.42, maxLife: 0.42, startRadius: ball.r * 0.9,
        growth: ball.r * 3.4, color: colors[1], width: 6
      });
      pushShotRing({
        x: position.x, y: position.y, vx: 0, vy: 0, delay: 0.07,
        life: 0.36, maxLife: 0.36, startRadius: ball.r * 0.8,
        growth: ball.r * 2.6, color: colors[2], width: 4
      });
      emitIgnitionBurst(style, position.x, position.y);
      kickBallSquash(-Math.PI * 0.5, 0.2);
    }
    ballFlameWasActive = active;
    const target = active ? 1 : 0;
    const response = target > ballHeat ? 0.12 : 0.35;
    ballHeat += (target - ballHeat) * (1 - Math.exp(-dt / response));
    if (Math.abs(target - ballHeat) < 0.001) ballHeat = target;
    ballIgnitionFlash = Math.max(0, ballIgnitionFlash - dt / 0.18);
  }

  function updateAirborneBall(dt) {
    airborneTime += dt;
    ball.rotation += ball.angularVelocity * dt;
    ball.prevX = ball.x;
    ball.prevY = ball.y;
    const flight = Physics.stepBallFlight(ball, FLIGHT_PARAMS, dt);
    ball.x = flight.x;
    ball.y = flight.y;
    ball.vx = flight.vx;
    ball.vy = flight.vy;

    detectActiveCoinCollection(flight.preWallX);
    if (flight.wallHit) {
      registerWallTouch(true);
      onBallImpact(Math.sign(flight.vx), 0, Math.abs(flight.vx) / WALL_RESTITUTION, "wall");
    }

    updateLaunchHoopSafety();
    detectHoopState();
    if (state !== "playing") return;
    if (!ball.held && !ball.settle) collideHoops(dt);
    if (debugShots && debugShots.recording) {
      debugShots.steps += 1;
      if (debugShots.steps % TRAJECTORY_DOT_STEPS === 0) {
        debugShots.actual.push({ x: ball.x, y: ball.y });
      }
    }

    if (!ball.settle && ball.y - simulationCameraY > WORLD_H + 90) {
      if (!hasReachedSecondHoop && currentHoopId === 0) recoverFirstTransition();
      else beginGameOver();
    } else if (!ball.settle && !ball.held && airborneTime >= AIRBORNE_RETRY_DELAY) {
      if (timedShotAwaitingShotResult) beginGameOver();
      else showRetry();
    }
  }

  function playHoopReleaseAnimation(hoop, pull) {
    const directionLength = Math.hypot(pull.x, pull.y) || 1;
    hoop.netAnimation = 0;
    hoop.releaseAnimation = HOOP_RELEASE_DURATION;
    hoop.releaseDirectionX = pull.x / directionLength;
    hoop.releaseDirectionY = pull.y / directionLength;
    hoop.releaseStrength = clamp(pull.ratio, 0.35, 1);
  }

  function emitShotRings(pull) {
    const length = Math.hypot(pull.x, pull.y) || 1;
    const directionX = pull.x / length;
    const directionY = pull.y / length;
    for (let i = 0; i < 3; i += 1) {
      pushShotRing({
        x: ball.x - directionX * (5 + i * 7),
        y: ball.y - directionY * (5 + i * 7),
        vx: -directionX * (22 + i * 8),
        vy: -directionY * (22 + i * 8),
        delay: i * 0.045,
        life: SHOT_RING_DURATION,
        maxLife: SHOT_RING_DURATION,
        startRadius: 7 + i * 1.5,
        growth: 30 + i * 5
      });
    }
  }

  function beginBallSettle(hoop) {
    const localBall = worldToHoop(hoop, ball.x, ball.y);
    emitLandingDust(hoop, Math.hypot(ball.vx, ball.vy));
    ball.vx = 0;
    ball.vy = 0;
    ball.angularVelocity = 0;
    ball.held = false;
    timedShotOpportunityProcessed = false;
    ball.settle = {
      hoopId: hoop.id,
      elapsed: 0,
      startX: localBall.x,
      startY: clamp(localBall.y, 3, 40),
      startRotation: ball.rotation
    };
    airborneTime = 0;
    snapBallRender();
    kickBallSquash(Math.PI * 0.5, -0.26);
    if (debugShots) debugShots.recording = false;
  }

  function updateBallSettle(dt) {
    const settle = ball.settle;
    const hoop = settle ? getHoopById(settle.hoopId) : null;
    if (!settle || !hoop) {
      ball.settle = null;
      return;
    }

    const wasAimReady = settle.elapsed >= BALL_SETTLE_INPUT_DELAY;
    settle.elapsed += dt;
    if (!wasAimReady && settle.elapsed >= BALL_SETTLE_INPUT_DELAY) processTimedShotOpportunity();
    const progress = clamp(settle.elapsed / BALL_SETTLE_DURATION, 0, 1);
    const eased = progress * progress * (3 - 2 * progress);
    const localX = settle.startX * (1 - eased);
    const localY = settle.startY + (NET_REST_Y - settle.startY) * eased;
    const point = hoopToWorld(hoop, localX, localY);
    ball.prevX = ball.x;
    ball.prevY = ball.y;
    ball.x = point.x;
    ball.y = point.y;
    ball.rotation = settle.startRotation * (1 - eased);

    if (progress >= 1) finishBallSettle();
  }

  function finishBallSettle() {
    const hoop = ball.settle ? getHoopById(ball.settle.hoopId) : null;
    if (hoop) placeBallInHoop(hoop);
  }

  function updateLaunchHoopSafety() {
    if (ball.launchHoopId < 0) return;
    const launchHoop = getHoopById(ball.launchHoopId);
    if (!launchHoop) {
      ball.launchHoopId = -1;
      return;
    }

    const localBall = worldToHoop(launchHoop, ball.x, ball.y);
    const safeMargin = ball.r + RIM_RADIUS + 5;
    const clearedAbove = localBall.y < -safeMargin;
    const clearedSide = Math.abs(localBall.x) > launchHoop.w * 0.5 + safeMargin;
    const clearedBelow = localBall.y > 62 + safeMargin;
    if (clearedAbove || clearedSide || clearedBelow) ball.launchHoopId = -1;
  }

  function showRetry() {
    if (state !== "playing" || ball.held) return;
    if (setGameState("retry")) markSaveDirty();
    drag = null;
    if (activePointer !== null && canvas.hasPointerCapture(activePointer)) {
      canvas.releasePointerCapture(activePointer);
    }
    activePointer = null;
    retryOverlay.classList.add("active");
    retryButton.focus();
  }

  function retryShot() {
    if (state !== "retry") return;
    const currentHoop = getHoopById(currentHoopId);
    if (!currentHoop) {
      resetGame(false);
      return;
    }
    swishStreak = 0;
    perfectChain = 0;
    ballHeat = 0;
    ballIgnitionFlash = 0;
    ballFlameWasActive = false;
    placeBallInHoop(currentHoop);
    setGameState("playing");
    retryOverlay.classList.remove("active");
    retryButton.blur();
  }

  function collideHoops(dt) {
    for (const hoop of hoops) {
      if (!canHoopAffectBall(hoop)) continue;
      if (hoop.id === ball.launchHoopId) {
        if (ball.launchInsideNet) containBallInLaunchNet(hoop, dt);
        continue;
      }
      const leftRim = hoopToWorld(hoop, -hoop.w * 0.5, 0);
      const rightRim = hoopToWorld(hoop, hoop.w * 0.5, 0);
      collideCircle(leftRim.x, leftRim.y, RIM_RADIUS, 0.74);
      collideCircle(rightRim.x, rightRim.y, RIM_RADIUS, 0.74);
      collideNet(hoop, dt);

      if (!hasBoard(hoop)) continue;
      const boardGeometry = getBoardLocalGeometry(hoop);
      const boardTop = hoopToWorld(hoop, boardGeometry.x, boardGeometry.top);
      const boardBottom = hoopToWorld(hoop, boardGeometry.x, boardGeometry.bottom);
      collideSegment(boardTop.x, boardTop.y, boardBottom.x, boardBottom.y, 0.64, dt, "wall");
    }
  }

  // The launch hoop has no rim collision so diagonal shots leave freely, but a ball
  // still under the rim line must not leave through the side of the net. Position
  // based (not swept), so a fast sideways shot cannot tunnel through. The walls stay
  // upright even on a tilted hoop, so the same shot angles leave every hoop alike.
  // Pure, so the aim preview can apply exactly the same rule.
  function getLaunchNetWallStep(hoop, body, dt) {
    const localX = body.x - hoop.x;
    const localY = body.y - hoop.y;
    if (localY < LAUNCH_NET_TOP_Y || localY > LAUNCH_NET_BOTTOM_Y) return { left: true };
    const depth = (localY - LAUNCH_NET_TOP_Y) / (LAUNCH_NET_BOTTOM_Y - LAUNCH_NET_TOP_Y);
    const wallX = hoop.w * 0.5 - 8 + (14 - (hoop.w * 0.5 - 8)) * depth;
    const limit = wallX - LAUNCH_NET_MARGIN;
    if (Math.abs(localX) <= limit) return { left: false, x: body.x, vx: body.vx, vy: body.vy, side: 0, outwardSpeed: 0 };

    const side = Math.sign(localX);
    const outwardSpeed = body.vx * side;
    if (outwardSpeed <= 0) return { left: false, x: hoop.x + side * limit, vx: body.vx, vy: body.vy, side, outwardSpeed: 0 };
    return {
      left: false,
      x: hoop.x + side * limit,
      vx: -side * outwardSpeed * LAUNCH_NET_BOUNCE,
      vy: body.vy * Math.pow(0.96, dt * 60),
      side,
      outwardSpeed
    };
  }

  function containBallInLaunchNet(hoop, dt) {
    const wall = getLaunchNetWallStep(hoop, ball, dt);
    if (wall.left) {
      ball.launchInsideNet = false;
      return;
    }
    ball.x = wall.x;
    ball.vx = wall.vx;
    ball.vy = wall.vy;
    if (wall.outwardSpeed <= 0) return;
    ball.touchedHoop = true;
    onBallImpact(-wall.side, 0, wall.outwardSpeed, "net");
  }

  function collideNet(hoop, dt) {
    if (ball.scoredHoopId === hoop.id) return;
    const leftTop = hoopToWorld(hoop, -hoop.w * 0.5 + 8, 7);
    const rightTop = hoopToWorld(hoop, hoop.w * 0.5 - 8, 7);
    const leftBottom = hoopToWorld(hoop, -14, 52);
    const rightBottom = hoopToWorld(hoop, 14, 52);
    const localBall = worldToHoop(hoop, ball.x, ball.y);
    const localPrevious = worldToHoop(hoop, ball.prevX, ball.prevY);
    const localVelocity = worldVectorToHoop(hoop, ball.vx, ball.vy);

    const enteredFromTop = localPrevious.y <= 22 && localVelocity.y > 0 && Math.abs(localBall.x) < hoop.w * 0.39;
    if (enteredFromTop) return;

    collideSegment(leftTop.x, leftTop.y, leftBottom.x, leftBottom.y, 0.54, dt);
    collideSegment(rightTop.x, rightTop.y, rightBottom.x, rightBottom.y, 0.54, dt);

    if (localVelocity.y < 0 && localBall.y - ball.r < 52 && localBall.y + ball.r > 36) {
      const lowerWidth = 34;
      if (Math.abs(localBall.x) < lowerWidth) {
        const correctedPosition = hoopToWorld(hoop, localBall.x, 52 + ball.r);
        const correctedVelocity = hoopVectorToWorld(
          hoop,
          localVelocity.x + (localBall.x < 0 ? -70 : 70),
          Math.abs(localVelocity.y) * 0.58
        );
        ball.x = correctedPosition.x;
        ball.y = correctedPosition.y;
        ball.vx = correctedVelocity.x;
        ball.vy = correctedVelocity.y;
        ball.touchedHoop = true;
        onBallImpact(-Math.sin(hoop.rotation), Math.cos(hoop.rotation), Math.abs(localVelocity.y), "rim");
      }
    }
  }

  function collideSegment(x1, y1, x2, y2, bounce, dt, contactType) {
    const vx = x2 - x1;
    const vy = y2 - y1;
    const lenSq = vx * vx + vy * vy || 1;
    const t = clamp(((ball.x - x1) * vx + (ball.y - y1) * vy) / lenSq, 0, 1);
    const px = x1 + vx * t;
    const py = y1 + vy * t;
    const dx = ball.x - px;
    const dy = ball.y - py;
    const minDist = ball.r + 2.5;
    const dist = Math.hypot(dx, dy) || 0.001;
    if (dist >= minDist) return;

    const nx = dx / dist;
    const ny = dy / dist;
    ball.x += nx * (minDist - dist);
    ball.y += ny * (minDist - dist);
    const dot = ball.vx * nx + ball.vy * ny;
    if (dot < 0) {
      ball.vx -= (1 + bounce) * dot * nx;
      ball.vy -= (1 + bounce) * dot * ny;
    }
    const damping = dot < -SEGMENT_IMPACT_SPEED ? 0.96 : Math.pow(0.96, dt * 60);
    ball.vx *= damping;
    ball.vy *= damping;
    if (dot < -SEGMENT_IMPACT_SPEED) onBallImpact(nx, ny, -dot, contactType === "wall" ? "board" : "net");
    if (contactType === "wall") {
      registerWallTouch(dot < 0);
    } else {
      ball.touchedHoop = true;
    }
  }

  function collideCircle(cx, cy, radius, bounce) {
    const dx = ball.x - cx;
    const dy = ball.y - cy;
    const minDist = ball.r + radius;
    const dist = Math.hypot(dx, dy) || 0.001;
    if (dist >= minDist) return;
    const nx = dx / dist;
    const ny = dy / dist;
    const overlap = minDist - dist;
    ball.x += nx * overlap;
    ball.y += ny * overlap;
    const dot = ball.vx * nx + ball.vy * ny;
    if (dot < 0) {
      ball.vx -= (1 + bounce) * dot * nx;
      ball.vy -= (1 + bounce) * dot * ny;
      ball.touchedHoop = true;
      onBallImpact(nx, ny, -dot, "rim");
    }
  }

  // One entry point for impact feel (sound, vibration, squash), fired from collisions.
  function onBallImpact(nx, ny, speed, kind) {
    if (!(speed >= IMPACT_FEEDBACK_MIN_SPEED)) return;
    const strength = clamp((speed - IMPACT_FEEDBACK_MIN_SPEED) / (IMPACT_FEEDBACK_FULL_SPEED - IMPACT_FEEDBACK_MIN_SPEED), 0, 1);
    kickBallSquash(Math.atan2(ny, nx), -(0.1 + strength * 0.26));
    // simulationTime restarts at 0 each run, so a negative gap means a new run, not a repeat.
    const sinceLast = simulationTime - lastImpactFeedbackAt[kind];
    if (sinceLast >= 0 && sinceLast < IMPACT_SOUND_COOLDOWN) return;
    lastImpactFeedbackAt[kind] = simulationTime;
    emitImpactBurst(ball.x - nx * ball.r, ball.y - ny * ball.r, nx, ny, strength, kind);
    playGameSound(kind, { strength });
    if (strength > 0.25) triggerHaptic(kind === "rim" ? 10 : 8);
  }

  function kickBallSquash(angle, amount) {
    if (Math.abs(amount) < Math.abs(ballSquash.value)) return;
    ballSquash.angle = angle;
    ballSquash.value = clamp(amount, -SQUASH_MAX, SQUASH_MAX);
    ballSquash.velocity = 0;
  }

  function updateBallSquash(dt) {
    let target = 0;
    if (drag && ball.held) {
      const pull = getPullVector();
      if (pull.len > 0) {
        ballSquash.angle = Math.atan2(pull.y, pull.x);
        target = -AIM_SQUASH * pull.ratio;
      }
    }
    for (let remaining = dt; remaining > 0; remaining -= 1 / 240) {
      const step = Math.min(remaining, 1 / 240);
      ballSquash.velocity += (-SQUASH_STIFFNESS * (ballSquash.value - target) - SQUASH_DAMPING * ballSquash.velocity) * step;
      ballSquash.value = clamp(ballSquash.value + ballSquash.velocity * step, -SQUASH_MAX, SQUASH_MAX);
    }
  }

  function applyBallSquash() {
    if (Math.abs(ballSquash.value) > 0.001) {
      const stretch = 1 + ballSquash.value;
      ctx.rotate(ballSquash.angle);
      ctx.scale(stretch, 1 / stretch);
      ctx.rotate(-ballSquash.angle);
    }
    if (state === "playing" && !ball.held && !ball.settle) {
      const speed = Math.hypot(ball.vx, ball.vy);
      const stretch = 1 + Math.min(FLIGHT_STRETCH_MAX, speed / FLIGHT_STRETCH_SPEED);
      const angle = Math.atan2(ball.vy, ball.vx);
      ctx.rotate(angle);
      ctx.scale(stretch, 1 / stretch);
      ctx.rotate(-angle);
    }
  }

  function bumpScoreHud(strong) {
    scoreValue.classList.remove("scoreBump", "scoreBumpStrong");
    void scoreValue.offsetWidth;
    scoreValue.classList.add(strong ? "scoreBumpStrong" : "scoreBump");
  }

  // Priority patterns (score, game over) bypass the rate limit so a rim tick can't swallow them.
  function triggerHaptic(pattern, priority) {
    if (!canVibrate || !hapticsEnabled || userPaused) return;
    const now = performance.now();
    if (!priority && now - lastHapticAt < 50) return;
    lastHapticAt = now;
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      // Some browsers block vibration outside a user gesture.
    }
  }

  function emitImpactBurst(x, y, nx, ny, strength, kind) {
    if (kind === "rim") {
      const colors = ["#fff4d6", "#ffc46b", "#ff8a2e"];
      const count = 3 + Math.round(strength * 5);
      for (let i = 0; i < count; i += 1) {
        const angle = Math.atan2(ny, nx) + random(-1.1, 1.1);
        const speed = random(120, 260) * (0.6 + strength);
        pushParticle({
          type: "spark",
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 620,
          shrinkRate: 0,
          life: random(0.18, 0.32),
          maxLife: 0.32,
          size: random(1.6, 2.6),
          color: colors[i % colors.length]
        });
      }
    } else if (kind === "wall" || kind === "board") {
      const count = 4 + Math.round(strength * 4);
      for (let i = 0; i < count; i += 1) {
        const angle = Math.atan2(ny, nx) + random(-1.3, 1.3);
        const speed = random(30, 90) * (0.6 + strength);
        pushParticle({
          type: "dust",
          x: x + random(-3, 3),
          y: y + random(-6, 6),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 12,
          gravity: -30,
          shrinkRate: 0,
          life: random(0.3, 0.45),
          maxLife: 0.45,
          size: random(3.5, 6.5) * (0.8 + strength * 0.5),
          color: "#c9b8a6"
        });
      }
    }
  }

  // Cel puffs that squeeze out of both sides of the net when the ball drops in; bigger on a fast drop.
  // They start just outside the net silhouette so the front net layer does not hide them.
  function emitLandingDust(hoop, speed) {
    const strength = clamp(speed / 900, 0.25, 1);
    const sideX = Math.cos(hoop.rotation);
    const sideY = Math.sin(hoop.rotation);
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i += 1) {
        // Net half-width at these heights is about 0.91, 0.8 and 0.63 of the rim's half-width.
        const origin = hoopToWorld(hoop, side * hoop.w * 0.5 * [0.98, 0.88, 0.72][i], 14 + i * 9);
        const push = random(60, 120) * strength;
        pushParticle({
          type: "dust",
          x: origin.x,
          y: origin.y,
          vx: side * sideX * push + random(-10, 10),
          vy: side * sideY * push - random(10, 35) * strength,
          gravity: -40,
          shrinkRate: 0,
          life: random(0.34, 0.52),
          maxLife: 0.52,
          size: random(3.2, 5.6) * (0.75 + strength * 0.5),
          color: "#c9b8a6"
        });
      }
    }
  }

  function getFlameThreshold() {
    return BALL_EFFECT_PRESETS[ballEffects.selectedPreset]?.comboThreshold ?? 2;
  }

  function getActiveFlamePreset() {
    const preset = BALL_EFFECT_PRESETS[ballEffects.selectedPreset];
    if (!preset || state !== "playing" || perfectChain < getFlameThreshold()) return null;
    return preset;
  }

  // HUD pips count perfects toward the flame; once lit it shows the streak in the skin's flame colours.
  function syncStreakHud() {
    if (!streakHud) return;
    const chain = state === "playing" ? perfectChain : 0;
    const threshold = getFlameThreshold();
    const previous = streakHudState.chain;
    const paletteChanged = streakHudState.preset !== ballEffects.selectedPreset || streakHudState.dark !== darkMode;
    if (chain === previous && !paletteChanged) return;
    if (paletteChanged) {
      const preset = BALL_EFFECT_PRESETS[ballEffects.selectedPreset] || BALL_EFFECT_PRESETS.classic;
      const colors = getFlameStyle(preset, darkMode).colors;
      streakHud.style.setProperty("--flame-core", colors[0]);
      streakHud.style.setProperty("--flame-mid", colors[1]);
      streakHud.style.setProperty("--flame-outer", colors[2]);
    }
    streakHudState.chain = chain;
    streakHudState.preset = ballEffects.selectedPreset;
    streakHudState.dark = darkMode;
    streakHud.hidden = chain <= 0;
    if (chain <= 0) {
      // A hidden element replays leftover animations when shown again.
      streakHud.classList.remove("onFire", "ignite", "bump");
      return;
    }
    const onFire = chain >= threshold;
    const pips = streakHud.querySelector(".streakPips");
    const count = streakHud.querySelector(".streakCount");
    if (!pips || !count) return;
    if (pips.childElementCount !== threshold) {
      pips.replaceChildren();
      for (let i = 0; i < threshold; i += 1) pips.appendChild(document.createElement("span"));
    }
    for (let i = 0; i < threshold; i += 1) {
      const pip = pips.children[i];
      pip.className = i < chain ? "filled" : "";
      if (i === chain - 1 && chain > previous && !onFire) restartHudAnimation(pip, "pop");
    }
    count.textContent = onFire ? "×" + chain : "";
    streakHud.classList.toggle("onFire", onFire);
    if (onFire && chain > previous) restartHudAnimation(streakHud, previous < threshold ? "ignite" : "bump");
  }

  function restartHudAnimation(element, className) {
    element.classList.remove("pop", "ignite", "bump");
    void element.offsetWidth;
    element.classList.add(className);
  }

  function isCanvasDarkBackground() {
    const background = parseHexColor(getCanvasTheme().backgroundTop);
    return background ? getLuminance(background) < 0.35 : darkMode;
  }

  function getFlameStyle(preset, darkBackgroundOverride) {
    const darkBackground = typeof darkBackgroundOverride === "boolean" ? darkBackgroundOverride : isCanvasDarkBackground();
    let presetKey = flameStyleKeys.get(preset);
    if (!presetKey) {
      presetKey = (preset.perfectFlameColors || preset.trailColors || []).join(",") + "|" + (preset.perfectFlameShape || "flame") + "|"
        + (preset.gravityModifier ?? "default") + "|" + (preset.perfectFlameIntensity || 1);
      flameStyleKeys.set(preset, presetKey);
    }
    const key = presetKey + "|" + darkBackground;
    if (flameStyles.has(key)) return flameStyles.get(key);
    let colors = preset.perfectFlameColors || preset.trailColors;
    const middle = parseHexColor(colors[1]);
    const darkPalette = middle ? getLuminance(middle) < 0.3 : false;
    // Dark smoke disappears on a dark background, so invert it to pale smoke there.
    if (darkPalette && darkBackground) colors = colors.map(invertHexColor);
    colors = ensureFlameBands(colors);
    const shape = preset.perfectFlameShape || "flame";
    const style = {
      colors,
      // Additive glow only reads on a dark background; on light themes it clamps to white.
      blend: darkBackground ? "lighter" : "source-over",
      gravity: preset.gravityModifier !== undefined ? preset.gravityModifier * 0.5 : -70,
      intensity: preset.perfectFlameIntensity || 1,
      embers: shape === "frost" || shape === "energy" ? 26 : shape === "spirit" ? 6 : 16
    };
    flameStyles.set(key, style);
    return style;
  }

  // Single-colour palettes would draw one flat shape; derive a light core and a deeper rim.
  function ensureFlameBands(colors) {
    const first = parseHexColor(colors[0]);
    const lastColor = parseHexColor(colors[2]);
    if (!first || !lastColor) return colors;
    const spread = Math.max(Math.abs(first.r - lastColor.r), Math.abs(first.g - lastColor.g), Math.abs(first.b - lastColor.b));
    if (spread >= 40) return colors;
    return [mixHexColor(colors[1], "#ffffff", 0.6), colors[1], mixHexColor(colors[1], "#000000", 0.3)];
  }

  function mixHexColor(color, target, amount) {
    const a = parseHexColor(color);
    const b = parseHexColor(target);
    if (!a || !b) return color;
    return "#" + ["r", "g", "b"].map((key) => Math.round(a[key] + (b[key] - a[key]) * amount).toString(16).padStart(2, "0")).join("");
  }

  function getLuminance(rgb) {
    return (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) / 255;
  }

  function invertHexColor(color) {
    const rgb = parseHexColor(color);
    if (!rgb) return color;
    return "#" + [255 - rgb.r, 255 - rgb.g, 255 - rgb.b].map((value) => value.toString(16).padStart(2, "0")).join("");
  }

  function parseHexColor(color) {
    const match = /^#([0-9a-f]{6})$/i.exec(color || "");
    if (!match) return null;
    const value = parseInt(match[1], 16);
    return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
  }

  // Soft radial glow per colour, rendered once and reused with drawImage.
  function getGlowSprite(color) {
    if (glowSprites.has(color)) return glowSprites.get(color);
    let sprite = null;
    const rgb = parseHexColor(color);
    if (rgb && typeof document.createElement === "function") {
      sprite = document.createElement("canvas");
      sprite.width = 64;
      sprite.height = 64;
      const spriteCtx = sprite.getContext("2d");
      const rgba = (alpha) => "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
      const gradient = spriteCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, rgba(1));
      gradient.addColorStop(0.35, rgba(0.6));
      gradient.addColorStop(1, rgba(0));
      spriteCtx.fillStyle = gradient;
      spriteCtx.fillRect(0, 0, 64, 64);
    }
    glowSprites.set(color, sprite);
    return sprite;
  }

  function drawGlow(targetCtx, color, x, y, radius, alpha) {
    if (alpha <= 0.01 || radius <= 0.2) return;
    targetCtx.globalAlpha = alpha;
    const sprite = getGlowSprite(color);
    if (sprite) {
      targetCtx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
    } else {
      targetCtx.fillStyle = color;
      targetCtx.beginPath();
      targetCtx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
      targetCtx.fill();
    }
  }

  function updateBallEffects(dt, airborne) {
    flameClock += dt;
    updateCelFlame(dt, airborne);
  }

  function isFlameParticle(p) {
    return p.type === "lick" || p.type === "cinder";
  }

  function countFlameParticles() {
    let count = 0;
    for (const p of particles) if (isFlameParticle(p)) count += 1;
    return count;
  }

  // Ribbon trail: recent drawn positions, newest first, expiring after FLAME_TRAIL_LIFE.
  function updateCelFlame(dt, airborne) {
    const preset = getActiveFlamePreset();
    if (!preset) {
      flameTrail.length = 0;
      return;
    }
    const style = getFlameStyle(preset);
    if (airborne) {
      const origin = getBallRenderPosition();
      const last = flameTrail[0];
      const gap = last ? Math.hypot(origin.x - last.x, origin.y - last.y) : Infinity;
      // A frame can move ~117 units at the 0.1 s clamp; anything larger is a teleport.
      if (!last || gap > 160) {
        flameTrail.length = 0;
        flameTrail.unshift({ x: origin.x, y: origin.y, t: flameClock });
      } else if (gap >= FLAME_TRAIL_SPACING) {
        const steps = Math.min(3, Math.floor(gap / FLAME_TRAIL_SPACING));
        for (let i = 1; i <= steps; i += 1) {
          const t = i / steps;
          flameTrail.unshift({ x: last.x + (origin.x - last.x) * t, y: last.y + (origin.y - last.y) * t, t: flameClock });
        }
      }
      const budget = MAX_FLAME_PARTICLES - countFlameParticles();
      flameLickTimer -= dt;
      if (flameLickTimer <= 0 && budget > 0 && flameTrail.length > 3) {
        flameLickTimer = 0.05 / style.intensity;
        const source = flameTrail[Math.floor(random(0.4, 0.9) * (flameTrail.length - 1))];
        emitFlameLick(style, source.x, source.y);
      }
      if (budget > 1 && Math.random() < dt * style.embers * style.intensity) emitFlameEmber(style, origin.x, origin.y);
    }
    while (flameTrail.length && flameClock - flameTrail[flameTrail.length - 1].t > FLAME_TRAIL_LIFE) flameTrail.pop();
    if (flameTrail.length > 48) flameTrail.length = 48;
  }

  function emitFlameLick(style, x, y) {
    const speed = Math.hypot(ball.vx, ball.vy) || 1;
    const drift = random(30, 70);
    const life = random(0.18, 0.28);
    pushParticle({
      type: "lick",
      x: x + random(-3, 3),
      y: y + random(-3, 3),
      vx: (-ball.vx / speed) * drift + random(-15, 15),
      vy: (-ball.vy / speed) * drift - random(50, 90),
      gravity: style.gravity,
      shrinkRate: 0,
      life,
      maxLife: life,
      size: random(0.45, 0.65) * ball.r,
      colors: style.colors
    });
  }

  function emitIgnitionBurst(style, x, y) {
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2 + random(-0.2, 0.2);
      const speed = random(150, 220);
      const life = random(0.28, 0.38);
      pushParticle({
        type: "lick",
        x: x + Math.cos(angle) * ball.r,
        y: y + Math.sin(angle) * ball.r,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        gravity: style.gravity,
        shrinkRate: 0,
        life,
        maxLife: life,
        size: random(0.55, 0.75) * ball.r,
        colors: style.colors
      });
    }
  }

  function emitFlameEmber(style, x, y) {
    const angle = random(0, Math.PI * 2);
    const speed = random(40, 120);
    const life = random(0.3, 0.55);
    pushParticle({
      type: "cinder",
      x: x + Math.cos(angle) * ball.r * 0.6,
      y: y + Math.sin(angle) * ball.r * 0.6,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 40,
      gravity: style.gravity * 0.6,
      shrinkRate: 0,
      life,
      maxLife: life,
      size: random(2.2, 3.4),
      colors: style.colors
    });
  }

  function drawFlameAura(x, y) {
    const preset = getActiveFlamePreset();
    if (!preset) return;
    const style = getFlameStyle(preset);
    drawCelFlame({ ctx, radius: ball.r, clock: flameClock, chain: perfectChain, held: ball.held }, x, y, style);
  }

  // Spine runs from the ball back along the trail; old points rise like real flame.
  function buildFlameSpine(target, x, y) {
    if (typeof target === "number") {
      y = x;
      x = target;
      target = { ctx, radius: ball.r, clock: flameClock, chain: perfectChain, held: ball.held };
    }
    const spine = [{ x, y }];
    if (!target.held) {
      let length = 0;
      let previous = spine[0];
      for (const point of flameTrail) {
        const age = target.clock - point.t;
        const next = { x: point.x, y: point.y - age * 90 };
        const segment = Math.hypot(next.x - previous.x, next.y - previous.y);
        if (segment < 0.5) continue;
        if (length + segment > FLAME_TRAIL_MAX_LENGTH) {
          const t = (FLAME_TRAIL_MAX_LENGTH - length) / segment;
          spine.push({ x: previous.x + (next.x - previous.x) * t, y: previous.y + (next.y - previous.y) * t });
          break;
        }
        length += segment;
        spine.push(next);
        previous = next;
      }
    }
    if (spine.length < 3) {
      // Held or just launched: the ball burns upward in place.
      spine.length = 1;
      for (let i = 1; i <= 6; i += 1) {
        spine.push({ x: x + Math.sin(target.clock * 7 + i * 0.9) * i * 0.9, y: y - i * target.radius * 0.42 });
      }
    }
    return spine;
  }

  function drawCelFlame(target, x, y, style) {
    const targetCtx = target.ctx;
    const spine = buildFlameSpine(target, x, y);
    const width = target.radius * 1.6 * Math.sqrt(style.intensity) * (1 + Math.min(target.chain, 10) * 0.025);
    targetCtx.save();
    if (style.blend === "lighter") {
      targetCtx.globalCompositeOperation = "lighter";
      drawGlow(targetCtx, style.colors[1], x, y, target.radius * 2.6, 0.3 * (target.alpha ?? 1));
      targetCtx.globalCompositeOperation = "source-over";
    }
    targetCtx.globalAlpha = target.alpha ?? 1;
    drawFlameRibbon(target, spine, width, 1, 0.7, style.colors[2], 0);
    drawFlameRibbon(target, spine, width, 0.74, 1, style.colors[1], 1.7);
    drawFlameRibbon(target, spine, width, 0.46, 1.5, style.colors[0], 3.1);
    targetCtx.restore();
  }

  // One filled ribbon: tapered body, flickering tongues toward the tail, round cap at the ball.
  function drawFlameRibbon(target, spine, width, scale, taper, color, phase) {
    const targetCtx = target.ctx;
    const last = spine.length - 1;
    const left = [];
    const right = [];
    let headAngle = 0;
    let headWidth = 0;
    for (let i = 0; i <= last; i += 1) {
      const a = spine[Math.max(0, i - 1)];
      const b = spine[Math.min(last, i + 1)];
      const length = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const tx = (a.x - b.x) / length;
      const ty = (a.y - b.y) / length;
      const u = i / last;
      const base = width * scale * Math.pow(1 - u, taper);
      const tongue = (offset) => 1 + (0.15 + u) * 1.1 * Math.pow(0.5 + 0.5 * Math.sin(u * 8 - target.clock * 15 + phase + offset), 3);
      const leftWidth = base * tongue(0);
      const rightWidth = base * tongue(2.1);
      left.push(spine[i].x - ty * leftWidth, spine[i].y + tx * leftWidth);
      right.push(spine[i].x + ty * rightWidth, spine[i].y - tx * rightWidth);
      if (i === 0) {
        headAngle = Math.atan2(ty, tx);
        headWidth = base;
      }
    }
    targetCtx.fillStyle = color;
    targetCtx.beginPath();
    targetCtx.moveTo(left[0], left[1]);
    traceSmooth(targetCtx, left);
    targetCtx.lineTo(spine[last].x, spine[last].y);
    const reversed = [];
    for (let i = right.length - 2; i >= 0; i -= 2) reversed.push(right[i], right[i + 1]);
    targetCtx.lineTo(reversed[0], reversed[1]);
    traceSmooth(targetCtx, reversed);
    targetCtx.arc(spine[0].x, spine[0].y, headWidth, headAngle - Math.PI * 0.5, headAngle + Math.PI * 0.5);
    targetCtx.closePath();
    targetCtx.fill();
  }

  function traceSmooth(targetCtx, points) {
    for (let i = 2; i < points.length - 2; i += 2) {
      targetCtx.quadraticCurveTo(points[i], points[i + 1], (points[i] + points[i + 2]) * 0.5, (points[i + 1] + points[i + 3]) * 0.5);
    }
    targetCtx.lineTo(points[points.length - 2], points[points.length - 1]);
  }

  function registerWallTouch(countBounce) {
    if (countBounce) ball.wallBounceCount = addSafeStat(ball.wallBounceCount, 1);
    ball.touchedWall = true;
  }

  function detectHoopState() {
    const targetHoop = getHoopById(targetHoopId);
    const currentHoop = getHoopById(currentHoopId);

    // Hoop state rule: only the target hoop can score; only the current
    // possession hoop can catch a failed shot. Inactive hoops are visual only.
    if (targetHoop && targetHoop.role === HOOP_ROLE.TARGET && didEnterHoopFromAbove(targetHoop)) {
      scoreTargetHoop(targetHoop);
      return;
    }

    if (currentHoop && currentHoop.role === HOOP_ROLE.CURRENT && didEnterHoopFromAbove(currentHoop)) {
      if (timedShotAwaitingShotResult) {
        beginGameOver();
        return;
      }
      swishStreak = 0;
      perfectChain = 0;
      ballFlameWasActive = false;
      placeBallInHoop(currentHoop);
    }
  }

  function didEnterHoopFromAbove(hoop) {
    const localBall = worldToHoop(hoop, ball.x, ball.y);
    const localPrevious = worldToHoop(hoop, ball.prevX, ball.prevY);
    const localVelocity = worldVectorToHoop(hoop, ball.vx, ball.vy);
    const mouth = 4;
    const catchDepth = 58;
    const insideLimit = hoop.w * 0.35;
    const sideGrace = hoop.w * 0.46;
    if (localVelocity.y <= 0) return false;
    if (localPrevious.y > catchDepth || localBall.y < mouth) return false;
    const crossedMouth = localPrevious.y <= mouth && localBall.y >= mouth;
    const crossedCatchBand = localPrevious.y <= catchDepth && localBall.y >= mouth;
    if (!crossedMouth && !crossedCatchBand) return false;
    const dy = localBall.y - localPrevious.y;
    const crossRatio = Math.abs(dy) < 0.001 ? 1 : clamp((mouth - localPrevious.y) / dy, 0, 1);
    const xAtMouth = localPrevious.x + (localBall.x - localPrevious.x) * crossRatio;
    const previousNearby = Math.abs(localPrevious.x) < sideGrace;
    const currentNearby = Math.abs(localBall.x) < sideGrace;
    return Math.abs(xAtMouth) < insideLimit && previousNearby && currentNearby && localBall.y < catchDepth + ball.r;
  }

  function scoreTargetHoop(hoop) {
    const wasLastSecondTimedShot = ball.lastSecondTimedShot;
    consumeTimedShotChallenge();
    ball.scoredHoopId = hoop.id;
    const wasPerfect = !ball.touchedHoop;
    const usedWall = ball.touchedWall;
    swishStreak = wasPerfect ? swishStreak + 1 : 0;
    perfectChain = swishStreak;
    const perfectGain = wasPerfect ? Math.min(swishStreak + 1, 10) : 1;
    const wallMultiplier = usedWall ? 2 : 1;
    lastScoreGain = perfectGain * wallMultiplier;
    lastWasPerfect = wasPerfect;
    lastWasBounce = usedWall;
    score += lastScoreGain;
    const ignited = wasPerfect && swishStreak === getFlameThreshold();
    recordBasketStats(wasPerfect, usedWall, lastScoreGain);
    const achievementUnlocked = recordAchievementBasket(wasPerfect, usedWall, wasLastSecondTimedShot, ignited);
    onTutorialBasket(wasPerfect, usedWall, ignited);
    recordMissionProgress({
      baskets: 1,
      perfects: wasPerfect ? 1 : 0,
      bankBaskets: usedWall ? 1 : 0,
      ignitions: ignited ? 1 : 0,
      runScore: score,
      perfectChain: swishStreak
    });
    if (achievementUnlocked) requestSave(true);
    else requestSave(false);
    if (
      highScoreCelebration.eligibleThisRun
      && !highScoreCelebration.hasCelebratedThisRun
      && score > runStartBestScore
    ) {
      triggerHighScoreCelebration();
    }
    if (score > best) {
      best = score;
      writeBestScore(best);
    }
    updateScore();
    bumpScoreHud(wasPerfect);
    const resultShake = wasPerfect
      ? SCORE_SHAKE.perfect + Math.min(swishStreak, 6) * SCORE_SHAKE.perStreak
      : SCORE_SHAKE.basket;
    shake = Math.min(SCORE_SHAKE.max, resultShake + (usedWall ? SCORE_SHAKE.wall : 0)) * (reduceMotion ? 0.35 : 1);
    if (wasPerfect) hitStopTimer = ignited ? HIT_STOP.ignite : HIT_STOP.perfect;
    comboText = usedWall || wasPerfect ? 1.1 : 0.85;
    comboAnchor.x = hoop.x;
    comboAnchor.y = hoop.y;
    scoreFeedbackText = buildScoreFeedback(wasPerfect, usedWall, lastScoreGain);
    playGameSound("score", { perfect: wasPerfect, wall: usedWall, streak: swishStreak });
    triggerHaptic(!wasPerfect ? 16 : swishStreak >= 3 ? [12, 30, 12, 30, 24] : [12, 40, 18], true);
    burst(hoop.x, hoop.y);
    triggerHoopScoreEffect(hoop, { swish: wasPerfect, wall: usedWall });
    hoop.moving = false;
    hoop.baseX = hoop.x;
    hoop.baseY = hoop.y;
    currentHoopId = hoop.id;
    if (hoop.id === 1) hasReachedSecondHoop = true;
    const coinIntervalReset = expireCoinForCompletedTarget(hoop.id);
    const nextTarget = nextHoop();
    targetHoopId = nextTarget.id;
    setHoopRoles(currentHoopId, targetHoopId);
    advanceCoinSchedule(hoop, nextTarget, coinIntervalReset);
    beginBallSettle(hoop);
  }

  function buildScoreFeedback(wasPerfect, usedWall, gained) {
    const parts = [];
    if (wasPerfect) parts.push(t("perfect"));
    if (usedWall) parts.push(t("bounce"));
    if (!wasPerfect && !usedWall) parts.push(t("nice"));
    parts.push("+" + gained);
    return parts.join(" · ");
  }

  function hoopToWorld(hoop, localX, localY) {
    const cos = Math.cos(hoop.rotation);
    const sin = Math.sin(hoop.rotation);
    return {
      x: hoop.x + localX * cos - localY * sin,
      y: hoop.y + localX * sin + localY * cos
    };
  }

  function worldToHoop(hoop, worldX, worldY) {
    const cos = Math.cos(hoop.rotation);
    const sin = Math.sin(hoop.rotation);
    const dx = worldX - hoop.x;
    const dy = worldY - hoop.y;
    return {
      x: dx * cos + dy * sin,
      y: -dx * sin + dy * cos
    };
  }

  function worldVectorToHoop(hoop, vx, vy) {
    const cos = Math.cos(hoop.rotation);
    const sin = Math.sin(hoop.rotation);
    return { x: vx * cos + vy * sin, y: -vx * sin + vy * cos };
  }

  function hoopVectorToWorld(hoop, vx, vy) {
    const cos = Math.cos(hoop.rotation);
    const sin = Math.sin(hoop.rotation);
    return { x: vx * cos - vy * sin, y: vx * sin + vy * cos };
  }

  function triggerHoopScoreEffect(hoop, result) {
    playNetAnimation(hoop);
    if (result.swish) {
      // The rim flashes on a swish: white normally, the flame's colour once the ball is burning.
      hoop.rimFlash = RIM_FLASH_DURATION;
      hoop.rimFlashColor = ballHeat > 0.05 && lastBallHeatColors ? lastBallHeatColors[1] : "#ffffff";
      triggerSwishEffect(hoop);
    }
  }

  function playNetAnimation(hoop) {
    hoop.netAnimation = NET_ANIMATION_DURATION;
  }

  function triggerSwishEffect(hoop) {
    const preset = BALL_EFFECT_PRESETS[ballEffects.selectedPreset] || BALL_EFFECT_PRESETS.classic;
    const colors = preset.trailColors || BALL_EFFECT_PRESETS.classic.trailColors;
    const style = preset.perfectStyle || "starBurst";
    if (style === "digitalRings") {
      emitPerfectRings(hoop, colors);
    } else if (style === "splash") {
      emitPerfectSplash(hoop, colors);
    } else if (style === "halo") {
      emitPerfectHalo(hoop, colors);
    } else {
      emitPerfectStars(hoop, colors);
    }
  }

  function emitPerfectStars(hoop, colors) {
    for (let i = 0; i < 9; i += 1) {
      const angle = -Math.PI * 0.5 + random(-1.25, 1.25);
      const speed = random(42, 118);
      pushParticle({
        type: i % 3 === 0 ? "star" : "spark",
        x: hoop.x + random(-18, 18),
        y: hoop.y + random(-4, 15),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        gravity: 180,
        life: random(0.36, 0.58),
        maxLife: 0.58,
        size: random(2.4, 5.2),
        shrinkRate: 7,
        color: colors[i % colors.length] || "#ffd27a"
      });
    }
    emitPerfectRings(hoop, ["rgba(255, 240, 170, 0.9)", "rgba(255, 255, 255, 0.9)"], 2);
  }

  function emitPerfectRings(hoop, colors, count) {
    const ringCount = count || 3;
    for (let i = 0; i < ringCount; i += 1) {
      pushParticle({
        type: "ring",
        x: hoop.x,
        y: hoop.y + 4,
        vx: 0,
        vy: -8 - i * 3,
        gravity: 0,
        life: 0.42 + i * 0.08,
        maxLife: 0.42 + i * 0.08,
        size: 13 + i * 5,
        growth: 24 + i * 7,
        lineWidth: Math.max(1.2, 2.8 - i * 0.45),
        color: colors[i % colors.length] || "#ffffff"
      });
    }
  }

  function emitPerfectSplash(hoop, colors) {
    for (let i = 0; i < 13; i += 1) {
      const angle = random(Math.PI * 1.02, Math.PI * 1.98);
      const speed = random(36, 128);
      pushParticle({
        type: "splash",
        x: hoop.x + random(-18, 18),
        y: hoop.y + 12,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 220,
        life: random(0.34, 0.62),
        maxLife: 0.62,
        size: random(2.2, 5.6),
        shrinkRate: 9,
        color: colors[i % colors.length] || "#7dfcff"
      });
    }
    emitPerfectRings(hoop, colors, 1);
  }

  function emitPerfectHalo(hoop, colors) {
    emitPerfectRings(hoop, colors, 3);
    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      pushParticle({
        type: "spark",
        x: hoop.x + Math.cos(angle) * 18,
        y: hoop.y + 5 + Math.sin(angle) * 7,
        vx: Math.cos(angle) * random(18, 42),
        vy: Math.sin(angle) * random(12, 36) - 24,
        gravity: 70,
        life: random(0.28, 0.44),
        maxLife: 0.44,
        size: random(1.8, 3.4),
        shrinkRate: 6,
        color: colors[i % colors.length] || "#ffffff"
      });
    }
  }

  function getHoopById(id) {
    return hoops.find((hoop) => hoop.id === id);
  }

  function setHoopRoles(currentId, targetId) {
    for (const hoop of hoops) {
      if (hoop.id === currentId) {
        hoop.role = HOOP_ROLE.CURRENT;
      } else if (hoop.id === targetId) {
        hoop.role = HOOP_ROLE.TARGET;
      } else {
        hoop.role = HOOP_ROLE.INACTIVE;
      }
    }
  }

  function canHoopAffectBall(hoop) {
    return hoop.role === HOOP_ROLE.CURRENT || hoop.role === HOOP_ROLE.TARGET;
  }

  function hasBoard(hoop) {
    return Boolean(hoop.board);
  }

  function getBoardLocalX(hoop) {
    if (Number.isFinite(hoop.sourceX) && Math.abs(hoop.sourceX - hoop.x) > 1) {
      return hoop.sourceX < hoop.x ? hoop.w * 0.5 + 18 : -hoop.w * 0.5 - 26;
    }
    const roomRight = WORLD_W - (hoop.x + hoop.w * 0.5);
    const roomLeft = hoop.x - hoop.w * 0.5;
    return roomRight >= roomLeft ? hoop.w * 0.5 + 18 : -hoop.w * 0.5 - 26;
  }

  function getBoardLocalGeometry(hoop) {
    const top = -62;
    const baseX = getBoardLocalX(hoop) + 4;
    const inwardOffset = 10;
    const bottomExtension = 20;
    return {
      x: baseX - Math.sign(baseX) * inwardOffset,
      top,
      bottom: top + hoop.boardH + bottomExtension
    };
  }

  function burst(x, y) {
    for (let i = 0; i < 18; i += 1) {
      const a = (Math.PI * 2 * i) / 18 + random(-0.2, 0.2);
      const s = random(70, 190);
      pushParticle({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 80,
        life: random(0.35, 0.7),
        size: random(2, 4),
        color: i % 2 ? "#f47b20" : "#ffffff"
      });
    }
  }

  function triggerHighScoreCelebration() {
    const colors = ["#ffcf33", "#ff7a33", "#30d9c4", "#5aa7ff", "#f36ac3", "#ffffff"];
    highScoreCelebration.hasCelebratedThisRun = true;
    highScoreCelebration.elapsed = 0;
    highScoreCelebration.active = true;
    highScoreCelebration.confetti = [];

    for (let i = 0; i < NEW_HIGH_SCORE_CONFETTI_COUNT; i += 1) {
      const angle = random(-Math.PI * 0.88, -Math.PI * 0.12);
      const speed = random(90, 190);
      const life = random(0.78, 1.18);
      highScoreCelebration.confetti.push({
        x: WORLD_W * 0.5 + random(-68, 68),
        y: 150 + random(-10, 12),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: random(180, 260),
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-8, 8),
        width: random(4, 7),
        height: random(7, 12),
        life,
        maxLife: life,
        color: colors[i % colors.length]
      });
    }
  }

  function updateHighScoreCelebration(dt) {
    if (!highScoreCelebration.active) return;
    highScoreCelebration.elapsed += dt;
    for (const piece of highScoreCelebration.confetti) {
      piece.life -= dt;
      piece.x += piece.vx * dt;
      piece.y += piece.vy * dt;
      piece.vy += piece.gravity * dt;
      piece.rotation += piece.rotationSpeed * dt;
    }
    highScoreCelebration.confetti = highScoreCelebration.confetti.filter((piece) => piece.life > 0);
    if (highScoreCelebration.elapsed >= NEW_HIGH_SCORE_DURATION && highScoreCelebration.confetti.length === 0) {
      highScoreCelebration.active = false;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, viewW, viewH);
    const sx = offsetX + (shake ? random(-shake, shake) : 0);
    const sy = offsetY + (shake ? random(-shake, shake) : 0);
    ctx.save();
    ctx.translate(sx, sy);
    ctx.scale(scale, scale);
    ctx.translate(0, -cameraY);

    if (ThemeArt) {
      drawThemeLayers(sx, sy);
    } else {
      drawAmbient();
      drawWalls();
    }
    for (const hoop of hoops) drawHoopMotionPath(hoop);
    for (const hoop of hoops) drawHoop(hoop);
    drawActiveCoin();
    drawShotRings();
    drawParticles();
    if (debugShots) drawDebugShots();
    if (drag && ball.held) drawTrajectory();
    drawBall();
    if (HoopArt) {
      for (const hoop of hoops) drawHoopFront(hoop);
    } else if (ball.held || ball.settle) {
      const currentHoop = getHoopById(currentHoopId);
      if (currentHoop) drawHoopFront(currentHoop);
    }
    if (tutorial.guide) drawTutorialGuide();
    if (state === "menu") drawHint();
    if (comboText > 0) drawCombo();
    drawCoinFeedback();

    ctx.restore();
    drawHighScoreCelebration();
  }

  function drawActiveCoin() {
    const coin = getActiveCoinWorldPosition();
    if (!coin) return;
    ctx.save();
    ctx.translate(coin.x, coin.y);
    ctx.fillStyle = "rgba(38, 34, 24, 0.18)";
    ctx.beginPath();
    ctx.ellipse(1.5, 3, coin.r + 2, coin.r * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f6bd2f";
    ctx.strokeStyle = "#7a4c0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, coin.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(139, 82, 8, 0.72)";
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    ctx.arc(0, 0, coin.r * 0.57, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
    ctx.beginPath();
    ctx.arc(-coin.r * 0.31, -coin.r * 0.34, coin.r * 0.17, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawCoinFeedback() {
    if (!coinFeedback) return;
    const remaining = clamp(coinFeedback.life / coinFeedback.maxLife, 0, 1);
    const progress = 1 - remaining;
    ctx.save();
    ctx.globalAlpha = Math.min(1, remaining * 2.4);
    ctx.translate(coinFeedback.x, coinFeedback.y - 14 - progress * 22);
    ctx.font = "700 18px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(88, 53, 8, 0.72)";
    ctx.strokeText("+1", 0, 0);
    ctx.fillStyle = "#ffe06a";
    ctx.fillText("+1", 0, 0);
    ctx.restore();
  }

  // The ambient layer is screen-fixed and only changes with theme, mode or canvas size
  // (plus the geometry motif's very slow drift), so it is rendered into a cached
  // canvas instead of re-running the gradient and blurred strokes every frame.
  const AMBIENT_DRIFT_REDRAW_INTERVAL = 0.25;
  // Accent circles reach past the world edge into the letterbox on wide screens.
  const AMBIENT_SIDE_MARGIN = 130;
  const ambientCache = { canvas: null, context: null, colors: null, width: 0, height: 0, drawnAt: 0 };

  function drawAmbient() {
    const colors = getCanvasTheme();
    const top = cameraY - 90;
    const height = WORLD_H + 180;
    const pixelScale = scale * dpr;
    const cacheWorldW = WORLD_W + AMBIENT_SIDE_MARGIN * 2;
    const width = Math.max(1, Math.ceil(cacheWorldW * pixelScale));
    const pixelHeight = Math.max(1, Math.ceil(height * pixelScale));
    if (!ambientCache.canvas) {
      ambientCache.canvas = document.createElement("canvas");
      ambientCache.context = ambientCache.canvas.getContext("2d");
    }
    const cache = ambientCache;
    if (!cache.context) {
      renderAmbient(ctx, colors, top, height);
      return;
    }
    const stale = cache.colors !== colors || cache.width !== width || cache.height !== pixelHeight
      || (colors.motif === "geometry" && Math.abs(simulationTime - cache.drawnAt) >= AMBIENT_DRIFT_REDRAW_INTERVAL);
    if (stale) {
      if (cache.canvas.width !== width || cache.canvas.height !== pixelHeight) {
        cache.canvas.width = width;
        cache.canvas.height = pixelHeight;
      }
      cache.context.setTransform(1, 0, 0, 1, 0, 0);
      cache.context.clearRect(0, 0, width, pixelHeight);
      cache.context.setTransform(width / cacheWorldW, 0, 0, pixelHeight / height, AMBIENT_SIDE_MARGIN * width / cacheWorldW, 0);
      renderAmbient(cache.context, colors, 0, height);
      cache.colors = colors;
      cache.width = width;
      cache.height = pixelHeight;
      cache.drawnAt = simulationTime;
    }
    ctx.drawImage(cache.canvas, -AMBIENT_SIDE_MARGIN, top, cacheWorldW, height);
  }

  function renderAmbient(target, colors, top, height) {
    const gradient = target.createLinearGradient(0, top, 0, top + height);
    gradient.addColorStop(0, colors.backgroundTop);
    gradient.addColorStop(1, colors.backgroundBottom);

    target.save();
    target.fillStyle = gradient;
    target.fillRect(0, top, WORLD_W, height);
    target.fillStyle = colors.backgroundAccent;
    target.beginPath();
    target.arc(WORLD_W * 0.82, top + height * 0.16, 118, 0, Math.PI * 2);
    target.fill();
    target.beginPath();
    target.arc(WORLD_W * 0.16, top + height * 0.76, 86, 0, Math.PI * 2);
    target.fill();
    if (colors.motif === "none") {
      target.restore();
      return;
    }
    target.strokeStyle = colors.geometryLine || (darkMode ? "rgba(255, 214, 255, 0.18)" : "rgba(255, 255, 255, 0.46)");
    target.lineWidth = 2.1;
    target.shadowColor = colors.geometryGlow || (darkMode ? "rgba(215, 120, 255, 0.18)" : "rgba(255, 255, 255, 0.46)");
    // shadowBlur ignores the transform; the cache is 1:1 with screen pixels, so the look is unchanged.
    target.shadowBlur = darkMode ? 6 : 9;
    if (colors.motif === "geometry") {
      drawAmbientRing(target, WORLD_W * 0.26, top + 118, 46, 0.58);
      drawAmbientRing(target, WORLD_W * 0.22, top + 478, 36, 0.42);
      drawAmbientTriangle(target, WORLD_W * 0.74, top + 214, 78, -0.22 + simulationTime * 0.012, 0.42);
      drawAmbientTriangle(target, WORLD_W * 0.68, top + 520, 84, 0.18 - simulationTime * 0.01, 0.34);
      drawAmbientTriangle(target, WORLD_W * 0.58, top + 654, 70, -0.4, 0.3);
    } else if (colors.motif === "sun") {
      drawAmbientSun(target, WORLD_W * 0.78, top + 172, 72, 0.28);
      drawAmbientRing(target, WORLD_W * 0.22, top + 506, 42, 0.22);
    } else if (colors.motif === "court") {
      drawAmbientCourtLines(target, top, height, 0.26);
    } else if (colors.motif === "vignette") {
      drawAmbientRing(target, WORLD_W * 0.5, top + height * 0.48, 118, 0.14);
    }
    target.shadowBlur = 0;
    target.restore();
  }

  // Theme backdrop from themeArt.js in three cached layers:
  // sky (screen-fixed), far (parallax tile) and the two walls (world-anchored tiles).
  // Caches are rebuilt only when the theme, mode or canvas size changes.
  const BACKDROP_MAX_DPR = 2;
  const BACKDROP_SIDE_LIMIT = 160;
  const BACKDROP_SHAKE_MARGIN = 10;
  const themeLayerCache = { key: "", bounds: null, sky: null, far: null, farHeight: 0, wallLeft: null, wallRight: null, parallax: 0.5 };

  function getVisibleWorldBounds() {
    const x0 = Math.max(-BACKDROP_SIDE_LIMIT, Math.floor(-offsetX / scale) - BACKDROP_SHAKE_MARGIN);
    const x1 = Math.min(WORLD_W + BACKDROP_SIDE_LIMIT, Math.ceil((viewW - offsetX) / scale) + BACKDROP_SHAKE_MARGIN);
    const top = Math.floor(-offsetY / scale) - BACKDROP_SHAKE_MARGIN;
    const height = Math.ceil(viewH / scale) + BACKDROP_SHAKE_MARGIN * 2;
    return { x0, x1, top, height };
  }

  function makeLayerCanvas(worldWidth, worldHeight, pixelScale, paint) {
    const layer = document.createElement("canvas");
    layer.width = Math.max(1, Math.round(worldWidth * pixelScale));
    layer.height = Math.max(1, Math.round(worldHeight * pixelScale));
    const layerCtx = layer.getContext("2d");
    if (!layerCtx) return null;
    layerCtx.setTransform(layer.width / worldWidth, 0, 0, layer.height / worldHeight, 0, 0);
    paint(layerCtx);
    return layer;
  }

  function getThemeArtId() {
    return THEMES[selectedThemeId] ? selectedThemeId : "gym";
  }

  function ensureThemeLayers() {
    const bounds = getVisibleWorldBounds();
    const themeId = getThemeArtId();
    const bgScale = scale * Math.min(dpr, BACKDROP_MAX_DPR);
    const wallScale = scale * dpr;
    const key = [themeId, darkMode, bgScale.toFixed(4), wallScale.toFixed(4), bounds.x0, bounds.x1, bounds.top, bounds.height].join("|");
    const cache = themeLayerCache;
    if (cache.key === key) return cache;
    const width = bounds.x1 - bounds.x0;
    const farTile = ThemeArt.FAR_TILE_H;
    const wallTile = ThemeArt.WALL_TILE_H;
    const wallX = ThemeArt.WALL_X;
    cache.sky = makeLayerCanvas(width, bounds.height, bgScale, (layerCtx) => {
      layerCtx.translate(-bounds.x0, 0);
      ThemeArt.paintSky(layerCtx, themeId, darkMode, bounds.x0, bounds.x1, bounds.height);
    });
    cache.far = makeLayerCanvas(width, farTile, bgScale, (layerCtx) => {
      layerCtx.translate(-bounds.x0, 0);
      ThemeArt.paintFar(layerCtx, themeId, darkMode, bounds.x0, bounds.x1, farTile);
    });
    cache.farHeight = farTile;
    const leftWidth = wallX + 2 - bounds.x0;
    cache.wallLeft = makeLayerCanvas(leftWidth, wallTile, wallScale, (layerCtx) => {
      layerCtx.translate(-bounds.x0, 0);
      ThemeArt.paintWall(layerCtx, themeId, darkMode, "left", bounds.x0, bounds.x1, wallTile);
    });
    const rightStart = WORLD_W - wallX - 2;
    cache.wallRight = makeLayerCanvas(bounds.x1 - rightStart, wallTile, wallScale, (layerCtx) => {
      layerCtx.translate(-rightStart, 0);
      ThemeArt.paintWall(layerCtx, themeId, darkMode, "right", bounds.x0, bounds.x1, wallTile);
    });
    cache.leftX = bounds.x0;
    cache.rightX = rightStart;
    cache.parallax = ThemeArt.getParallax(themeId);
    cache.bounds = bounds;
    cache.key = key;
    const palette = ThemeArt.getPalette(themeId, darkMode);
    const edgeColor = palette.sky[palette.sky.length - 1];
    if (gameShell && edgeColor) gameShell.style.backgroundColor = edgeColor;
    return cache;
  }

  // Wall tiles are opaque; each tile top is snapped to a device pixel and advances by the
  // tile's exact pixel height, so neighbouring tiles meet without a seam line.
  function drawWallTiles(image, x, screenTop, screenBottom, sx, sy) {
    if (!image) return;
    const deviceScale = scale * dpr;
    const advance = image.height / deviceScale;
    const toWorldY = (deviceY) => (deviceY / dpr - sy) / scale + cameraY;
    const toDeviceY = (worldY) => dpr * (sy + scale * (worldY - cameraY));
    const deviceX = Math.round(dpr * (sx + scale * x));
    const worldX = (deviceX / dpr - sx) / scale;
    const worldWidth = image.width / deviceScale;
    let tileTop = Math.floor(screenTop / advance) * advance;
    let deviceTop = Math.round(toDeviceY(tileTop));
    for (let guard = 0; guard < 12; guard += 1) {
      const worldTop = toWorldY(deviceTop);
      if (worldTop > screenBottom) break;
      ctx.drawImage(image, worldX, worldTop, worldWidth, advance);
      deviceTop += image.height;
    }
  }

  function drawThemeLayers(sx, sy) {
    const layers = ensureThemeLayers();
    const bounds = layers.bounds;
    const screenTop = cameraY + bounds.top;
    const screenBottom = screenTop + bounds.height;
    const width = bounds.x1 - bounds.x0;
    if (layers.sky) ctx.drawImage(layers.sky, bounds.x0, screenTop, width, bounds.height);
    if (layers.far) {
      const tile = layers.farHeight;
      const base = cameraY * (1 - layers.parallax);
      let y = base + Math.floor((screenTop - base) / tile) * tile;
      for (let guard = 0; guard < 6 && y < screenBottom; guard += 1, y += tile) {
        ctx.drawImage(layers.far, bounds.x0, y, width, tile);
      }
    }
    drawWallTiles(layers.wallLeft, layers.leftX, screenTop, screenBottom, sx, sy);
    drawWallTiles(layers.wallRight, layers.rightX, screenTop, screenBottom, sx, sy);
  }

  // Small static picture of a theme (sky, far layer, walls, one hoop and the player's ball)
  // for the theme shop, the menu tile and the purchase dialog.
  function drawThemePreviewCanvas(canvasElement, themeId) {
    if (!ThemeArt || !canvasElement) return;
    // Layout size, not getBoundingClientRect: dialogs open from a scaled-down transform.
    const cssWidth = canvasElement.offsetWidth > 0 ? canvasElement.offsetWidth : Number(canvasElement.dataset.width) || 160;
    const cssHeight = canvasElement.offsetHeight > 0 ? canvasElement.offsetHeight : Number(canvasElement.dataset.height) || 120;
    const previewDpr = Math.min(window.devicePixelRatio || 1, 3);
    canvasElement.width = Math.round(cssWidth * previewDpr);
    canvasElement.height = Math.round(cssHeight * previewDpr);
    const previewCtx = canvasElement.getContext("2d");
    if (!previewCtx) return;
    const theme = THEMES[themeId] || THEMES.gym;
    // Show the whole play column; tall previews zoom in a little so walls stay visible.
    const s = Math.max(cssWidth / WORLD_W, cssHeight / 520) * previewDpr;
    const worldWidth = canvasElement.width / s;
    const worldHeight = canvasElement.height / s;
    const x0 = (WORLD_W - worldWidth) * 0.5;
    const x1 = x0 + worldWidth;
    previewCtx.setTransform(s, 0, 0, s, -x0 * s, 0);
    ThemeArt.paintSky(previewCtx, theme.id, darkMode, x0, x1, worldHeight);
    previewCtx.save();
    previewCtx.translate(0, -120);
    ThemeArt.paintFar(previewCtx, theme.id, darkMode, x0, x1, ThemeArt.FAR_TILE_H);
    previewCtx.restore();
    ThemeArt.paintWall(previewCtx, theme.id, darkMode, "left", x0, x1, ThemeArt.WALL_TILE_H);
    ThemeArt.paintWall(previewCtx, theme.id, darkMode, "right", x0, x1, ThemeArt.WALL_TILE_H);
    if (HoopArt && BallArt) {
      const palette = (theme.hoopArt || THEMES.gym.hoopArt)[darkMode ? "dark" : "light"];
      const skin = getSelectedBallSkin();
      const preset = BALL_EFFECT_PRESETS[skin.effectPreset] || BALL_EFFECT_PRESETS.classic;
      const heatColors = getFlameStyle(preset, darkMode).colors;
      const hoopOptions = {
        halfWidth: HOOP_WIDTH * 0.5, swing: 0, stretch: 0, ripple: -1, rimScaleX: 1, rimScaleY: 1,
        flash: 0, flashColor: "#ffffff", heat: 0, heatColors, darkBackground: darkMode, board: null
      };
      const hoopX = WORLD_W * 0.5;
      const hoopY = worldHeight * 0.5 - 6;
      previewCtx.save();
      previewCtx.translate(hoopX, hoopY);
      HoopArt.drawHoopBack(previewCtx, palette, hoopOptions);
      previewCtx.save();
      previewCtx.translate(0, NET_REST_Y - 4);
      BallArt.drawBall(previewCtx, skin.art, {
        radius: BALL_RADIUS, rotation: -0.35, time: 0, heat: 0, heatColors, flash: 0, darkBackground: darkMode, look: { x: 0.4, y: -0.3 }
      });
      previewCtx.restore();
      HoopArt.drawHoopFront(previewCtx, palette, hoopOptions);
      previewCtx.restore();
    }
  }

  function drawAmbientRing(target, x, y, radius, alpha) {
    target.save();
    target.globalAlpha *= alpha;
    target.beginPath();
    target.arc(x, y, radius, 0, Math.PI * 2);
    target.stroke();
    target.restore();
  }

  function drawAmbientTriangle(target, x, y, size, rotation, alpha) {
    target.save();
    target.globalAlpha *= alpha;
    target.translate(x, y);
    target.rotate(rotation);
    target.beginPath();
    for (let i = 0; i < 3; i += 1) {
      const angle = -Math.PI * 0.5 + i * Math.PI * 2 / 3;
      const px = Math.cos(angle) * size;
      const py = Math.sin(angle) * size * 0.62;
      if (i === 0) target.moveTo(px, py);
      else target.lineTo(px, py);
    }
    target.closePath();
    target.stroke();
    target.translate(size * 0.18, size * 0.12);
    target.beginPath();
    for (let i = 0; i < 3; i += 1) {
      const angle = -Math.PI * 0.5 + i * Math.PI * 2 / 3;
      const px = Math.cos(angle) * size * 0.88;
      const py = Math.sin(angle) * size * 0.54;
      if (i === 0) target.moveTo(px, py);
      else target.lineTo(px, py);
    }
    target.closePath();
    target.stroke();
    target.restore();
  }

  function drawAmbientSun(target, x, y, radius, alpha) {
    target.save();
    target.globalAlpha *= alpha;
    target.beginPath();
    target.arc(x, y, radius, 0, Math.PI * 2);
    target.stroke();
    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      target.beginPath();
      target.moveTo(x + Math.cos(angle) * (radius + 10), y + Math.sin(angle) * (radius + 10));
      target.lineTo(x + Math.cos(angle) * (radius + 34), y + Math.sin(angle) * (radius + 34));
      target.stroke();
    }
    target.restore();
  }

  function drawAmbientCourtLines(target, top, height, alpha) {
    target.save();
    target.globalAlpha *= alpha;
    target.beginPath();
    target.moveTo(WORLD_W * 0.5, top + 60);
    target.lineTo(WORLD_W * 0.5, top + height - 60);
    target.moveTo(WORLD_W * 0.16, top + height * 0.28);
    target.lineTo(WORLD_W * 0.84, top + height * 0.28);
    target.moveTo(WORLD_W * 0.16, top + height * 0.72);
    target.lineTo(WORLD_W * 0.84, top + height * 0.72);
    target.stroke();
    target.beginPath();
    target.arc(WORLD_W * 0.5, top + height * 0.5, 58, 0, Math.PI * 2);
    target.stroke();
    target.restore();
  }

  function drawWalls() {
    const top = cameraY - 90;
    const height = WORLD_H + 180;
    const colors = getCanvasTheme();

    ctx.save();
    ctx.fillStyle = colors.wallFill;
    ctx.fillRect(0, top, WALL_INSET, height);
    ctx.fillRect(WORLD_W - WALL_INSET, top, WALL_INSET, height);

    ctx.strokeStyle = colors.wallEdge;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(WALL_INSET, top);
    ctx.lineTo(WALL_INSET, top + height);
    ctx.moveTo(WORLD_W - WALL_INSET, top);
    ctx.lineTo(WORLD_W - WALL_INSET, top + height);
    ctx.stroke();

    ctx.strokeStyle = colors.rimHighlight;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(WALL_INSET - 4, top);
    ctx.lineTo(WALL_INSET - 4, top + height);
    ctx.moveTo(WORLD_W - WALL_INSET + 4, top);
    ctx.lineTo(WORLD_W - WALL_INSET + 4, top + height);
    ctx.stroke();
    ctx.restore();
  }

  function drawShotRings() {
    const colors = getCanvasTheme();
    ctx.save();
    for (const ring of shotRings) {
      if (ring.delay > 0) continue;
      ctx.strokeStyle = ring.color || colors.shotRing;
      const progress = 1 - clamp(ring.life / ring.maxLife, 0, 1);
      ctx.globalAlpha = (1 - progress) * 0.72;
      ctx.lineWidth = ring.width ? ring.width * (1 - progress * 0.6) : Math.max(1.2, 3.2 - progress * 2);
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.startRadius + ring.growth * progress, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawHoopMotionPath(hoop) {
    if (!hoop.moving || hoop.role === HOOP_ROLE.INACTIVE) return;
    const colors = getCanvasTheme();
    const horizontal = hoop.movementType === "horizontal";
    const minX = WALL_INSET + HOOP_WALL_CLEARANCE;
    const maxX = WORLD_W - WALL_INSET - HOOP_WALL_CLEARANCE;
    const startX = horizontal ? clamp(hoop.baseX - hoop.moveAmplitude, minX, maxX) : hoop.baseX;
    const endX = horizontal ? clamp(hoop.baseX + hoop.moveAmplitude, minX, maxX) : hoop.baseX;
    const startY = horizontal ? hoop.baseY : hoop.baseY - hoop.moveAmplitude;
    const endY = horizontal ? hoop.baseY : hoop.baseY + hoop.moveAmplitude;

    ctx.save();
    ctx.fillStyle = colors.motionPath;
    for (let i = 0; i <= 6; i += 1) {
      const ratio = i / 6;
      const x = startX + (endX - startX) * ratio;
      const y = startY + (endY - startY) * ratio;
      ctx.globalAlpha = i === 0 || i === 6 ? 0.72 : 0.38;
      ctx.beginPath();
      ctx.arc(x, y, i === 0 || i === 6 ? 2.8 : 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function getHoopDeformation(hoop) {
    const scoreProgress = clamp(hoop.netAnimation / NET_ANIMATION_DURATION, 0, 1);
    const scorePhase = 1 - scoreProgress;
    const scoreSwing = Math.sin(scorePhase * Math.PI * 4) * scoreProgress * 3.6;
    const scoreStretch = Math.sin(scorePhase * Math.PI) * 2.8;

    const releaseProgress = clamp(hoop.releaseAnimation / HOOP_RELEASE_DURATION, 0, 1);
    const releasePhase = 1 - releaseProgress;
    const releaseKick = Math.sin(releasePhase * Math.PI * 1.5) * releaseProgress;
    const releaseAmount = releaseKick * hoop.releaseStrength;
    const releaseShiftX = -hoop.releaseDirectionX * 5 * releaseAmount;
    const releaseLift = -Math.abs(hoop.releaseDirectionY) * 3.5 * releaseAmount;
    const aim = getHoopAimDeformation(hoop);

    return {
      offsetX: aim.offsetX,
      offsetY: aim.offsetY,
      netSwing: scoreSwing + releaseShiftX + aim.netSwing,
      netStretch: scoreStretch + releaseLift + aim.netLift,
      visualTilt: -hoop.releaseDirectionX * 0.018 * releaseAmount + aim.visualTilt,
      launcherAngle: aim.launcherAngle,
      launcherIntensity: aim.launcherIntensity,
      rimScaleX: 1 + Math.abs(releaseAmount) * 0.012,
      rimScaleY: 1 - Math.abs(releaseAmount) * 0.025
    };
  }

  function getHoopAimDeformation(hoop) {
    const visual = getHoopPullVisualState(hoop);
    if (!visual.active) return visual;
    return {
      ...visual,
      offsetX: visual.directionX * HOOP_AIM_MAX_OFFSET * 0.22 * visual.ratio,
      offsetY: visual.directionY * HOOP_AIM_MAX_OFFSET * 0.16 * visual.ratio,
      netSwing: visual.directionX * 5.2 * visual.ratio,
      netLift: visual.directionY * 3.2 * visual.ratio,
      visualTilt: clamp(visual.directionX * 0.032 + Math.sin(visual.launcherAngle) * 0.018, -0.055, 0.055) * visual.ratio
    };
  }

  function getHoopPullVisualState(hoop) {
    const empty = {
      active: false,
      offsetX: 0,
      offsetY: 0,
      netSwing: 0,
      netLift: 0,
      visualTilt: 0,
      launcherAngle: 0,
      launcherIntensity: 0,
      directionX: 0,
      directionY: 0,
      ratio: 0
    };
    if (!drag || !ball.held || hoop.id !== currentHoopId) return empty;
    const pull = getPullVector();
    if (pull.len < 0.01) return empty;
    const length = Math.hypot(pull.x, pull.y) || 1;
    const directionX = pull.x / length;
    const directionY = pull.y / length;
    const ratio = clamp(pull.len / MAX_PULL, 0, 1);
    return {
      active: true,
      offsetX: 0,
      offsetY: 0,
      netSwing: 0,
      netLift: 0,
      visualTilt: 0,
      launcherAngle: getLauncherAngleFromPull(pull),
      launcherIntensity: ratio,
      directionX,
      directionY,
      ratio
    };
  }

  function getLauncherAngleFromPull(pull) {
    return Math.atan2(pull.y, pull.x);
  }

  function applyHoopSpawnTransform(hoop) {
    const progress = clamp(hoop.entranceTimer ?? hoop.spawnProgress ?? 1, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const pop = Math.sin(progress * Math.PI) * 0.075;
    const scale = 0.78 + eased * 0.22 + pop;
    ctx.globalAlpha *= 0.12 + eased * 0.88;
    ctx.translate(0, (1 - eased) * 13);
    ctx.scale(scale, scale);
  }

  function drawHoop(hoop) {
    const colors = getCanvasTheme();
    const rimY = 0;
    const left = -hoop.w * 0.5;
    const right = hoop.w * 0.5;
    const advanced = hasBoard(hoop);
    const boardGeometry = advanced ? getBoardLocalGeometry(hoop) : null;
    const deformation = getHoopDeformation(hoop);
    const netSwing = deformation.netSwing;
    const netStretch = deformation.netStretch;

    ctx.save();
    if (hoop.role === HOOP_ROLE.INACTIVE) ctx.globalAlpha = 0.42;
    ctx.translate(hoop.x + deformation.offsetX, hoop.y + deformation.offsetY);
    applyHoopSpawnTransform(hoop);
    ctx.rotate(hoop.rotation + deformation.visualTilt);

    if (HoopArt) {
      HoopArt.drawHoopBack(ctx, getHoopArtPalette(), getHoopArtOptions(hoop, deformation, boardGeometry));
      ctx.restore();
      return;
    }

    ctx.fillStyle = colors.hoopShadow;
    ctx.beginPath();
    ctx.ellipse(2, rimY + 48 + netStretch * 0.55, hoop.w * 0.27, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();

    if (advanced) {
      ctx.save();
      ctx.strokeStyle = colors.rim;
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(boardGeometry.x, boardGeometry.top);
      ctx.lineTo(boardGeometry.x, boardGeometry.bottom);
      ctx.stroke();
      ctx.restore();
    }

    // Thin premium net: short, bright, and airy like the soft arcade references.
    ctx.fillStyle = colors.netFill;
    ctx.strokeStyle = colors.netEdge;
    ctx.lineWidth = 1.55;
    ctx.beginPath();
    ctx.moveTo(left + 6, rimY + 4);
    ctx.bezierCurveTo(-29, 18, -22 + netSwing * 0.25, 41 + netStretch * 0.9, -10 + netSwing, 49 + netStretch);
    ctx.quadraticCurveTo(netSwing, 54 + netStretch, 10 + netSwing, 49 + netStretch);
    ctx.bezierCurveTo(22 + netSwing * 0.25, 41 + netStretch * 0.9, 29, 18, right - 6, rimY + 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // One combined mesh path gets a subtle glow and a crisp inner thread.
    ctx.beginPath();
    for (let i = 0; i < 4; i += 1) {
      const topX = -24 + i * 16;
      const leftBottomX = topX * 0.28 - 7 + netSwing;
      const rightBottomX = topX * 0.28 + 7 + netSwing;
      ctx.moveTo(topX, rimY + 6);
      ctx.bezierCurveTo(topX * 0.64 - 4, 20, leftBottomX - 2, 36 + netStretch * 0.55, leftBottomX, 49 + netStretch);
      ctx.moveTo(topX, rimY + 6);
      ctx.bezierCurveTo(topX * 0.64 + 4, 20, rightBottomX + 2, 36 + netStretch * 0.55, rightBottomX, 49 + netStretch);
    }
    drawNetCrossCurve(27, 17, 2.4, netSwing * 0.45, netStretch * 0.3);
    drawNetCrossCurve(21, 31, 3, netSwing * 0.72, netStretch * 0.58);
    drawNetCrossCurve(14, 44, 2.2, netSwing, netStretch);
    ctx.strokeStyle = colors.netOutline;
    ctx.lineWidth = 2.6;
    ctx.stroke();
    ctx.strokeStyle = colors.netLine;
    ctx.lineWidth = 1.35;
    ctx.stroke();

    // A thin, glossy rim: smaller silhouette, strong contrast, premium arcade feel.
    ctx.strokeStyle = colors.rim;
    ctx.lineWidth = 6.2;
    ctx.beginPath();
    ctx.ellipse(0, rimY, hoop.w * 0.5 * deformation.rimScaleX, 7.2 * deformation.rimScaleY, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = colors.rimShadow;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(0, rimY + 0.45, hoop.w * 0.47 * deformation.rimScaleX, 6 * deformation.rimScaleY, 0, Math.PI * 0.08, Math.PI * 0.92);
    ctx.stroke();

    ctx.strokeStyle = colors.rimHighlight;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, rimY - 0.85, hoop.w * 0.45 * deformation.rimScaleX, 5.8 * deformation.rimScaleY, 0, Math.PI * 1.08, Math.PI * 1.92);
    ctx.stroke();
    ctx.restore();
  }

  function drawNetCrossCurve(halfWidth, y, sag, offsetX, offsetY) {
    ctx.moveTo(-halfWidth + offsetX * 0.25, y + offsetY * 0.4);
    ctx.quadraticCurveTo(offsetX, y + sag + offsetY, halfWidth + offsetX * 0.25, y + offsetY * 0.4);
  }

  function getHoopArtPalette() {
    const theme = THEMES[selectedThemeId] || THEMES.gym;
    const palettes = theme.hoopArt || THEMES.gym.hoopArt;
    return darkMode ? palettes.dark : palettes.light;
  }

  function getHoopArtOptions(hoop, deformation, boardGeometry) {
    // The rim warms up while the burning ball rests in it.
    const holdsBall = hoop.id === currentHoopId && (ball.held || ball.settle);
    return {
      halfWidth: hoop.w * 0.5,
      swing: deformation.netSwing,
      stretch: deformation.netStretch,
      ripple: hoop.netAnimation > 0 ? 1 - hoop.netAnimation / NET_ANIMATION_DURATION : -1,
      rimScaleX: deformation.rimScaleX,
      rimScaleY: deformation.rimScaleY,
      flash: clamp((hoop.rimFlash || 0) / RIM_FLASH_DURATION, 0, 1),
      flashColor: hoop.rimFlashColor || "#ffffff",
      heat: holdsBall ? ballHeat : 0,
      heatColors: lastBallHeatColors,
      darkBackground: isCanvasDarkBackground(),
      board: boardGeometry
    };
  }

  function drawHoopFront(hoop) {
    const deformation = getHoopDeformation(hoop);

    if (HoopArt) {
      ctx.save();
      if (hoop.role === HOOP_ROLE.INACTIVE) ctx.globalAlpha = 0.42;
      ctx.translate(hoop.x + deformation.offsetX, hoop.y + deformation.offsetY);
      applyHoopSpawnTransform(hoop);
      ctx.rotate(hoop.rotation + deformation.visualTilt);
      HoopArt.drawHoopFront(ctx, getHoopArtPalette(), getHoopArtOptions(hoop, deformation, null));
      ctx.restore();
      return;
    }

    const colors = getCanvasTheme();
    const netSwing = deformation.netSwing;
    const netStretch = deformation.netStretch;

    ctx.save();
    ctx.translate(hoop.x + deformation.offsetX, hoop.y + deformation.offsetY);
    applyHoopSpawnTransform(hoop);
    ctx.rotate(hoop.rotation + deformation.visualTilt);
    ctx.beginPath();
    drawNetCrossCurve(21, 31, 3, netSwing * 0.7, netStretch * 0.55);
    drawNetCrossCurve(14, 44, 2.2, netSwing, netStretch);
    ctx.strokeStyle = colors.netOutline;
    ctx.lineWidth = 2.7;
    ctx.stroke();
    ctx.strokeStyle = colors.netFront;
    ctx.lineWidth = 1.45;
    ctx.stroke();
    ctx.restore();
  }

  function drawBall() {
    const skin = getSelectedBallSkin();
    const skinImage = getBallSkinImage(skin);
    const renderPosition = getBallRenderPosition();
    const rotation = previousBallRender.rotation + (currentBallRender.rotation - previousBallRender.rotation) * renderAlpha;
    drawFlameAura(renderPosition.x, renderPosition.y);
    ctx.save();
    ctx.translate(renderPosition.x, renderPosition.y);
    applyBallSquash();

    if (skinImage && skinImage.complete && skinImage.naturalWidth > 0) {
      ctx.rotate(rotation);
      const assetScale = ball.r / 27;
      const assetSize = 64 * assetScale;
      ctx.drawImage(skinImage, -assetSize * 0.5, -assetSize * 0.5, assetSize, assetSize);
      ctx.restore();
      return;
    }

    const speed = Math.hypot(ball.vx, ball.vy);
    const look = speed > 0.001 ? { x: ball.vx / speed, y: ball.vy / speed } : { x: 0, y: 0 };
    BallArt.drawBall(ctx, skin.art, {
      radius: ball.r,
      rotation,
      time: ballArtClock,
      heat: ballHeat,
      heatColors: lastBallHeatColors,
      flash: ballIgnitionFlash,
      darkBackground: isCanvasDarkBackground(),
      look
    });
    ctx.restore();
  }

  function getBallSkinImage(skin) {
    if (!skin.assetPath || typeof Image === "undefined") return null;
    if (!ballSkinImages[skin.id]) {
      const image = new Image();
      image.decoding = "async";
      image.src = skin.assetPath;
      ballSkinImages[skin.id] = image;
    }
    return ballSkinImages[skin.id];
  }

  // Mirror the launch-net walls so a sideways shot's dots bounce back like the ball will.
  function makeLaunchNetAfterStep() {
    const launchHoop = getHoopById(currentHoopId);
    let insideNet = Boolean(launchHoop);
    return launchHoop ? (body, dt) => {
      if (!insideNet) return body;
      const wall = getLaunchNetWallStep(launchHoop, body, dt);
      if (wall.left) {
        insideNet = false;
        return body;
      }
      return { ...body, x: wall.x, vx: wall.vx, vy: wall.vy };
    } : null;
  }

  function predictShot(pull, velocity = Physics.getLaunchVelocity(pull, FLIGHT_PARAMS)) {
    return Physics.predictTrajectory(ball, velocity, FLIGHT_PARAMS, {
      dotSteps: TRAJECTORY_DOT_STEPS,
      pointCount: Math.round(7 + pull.ratio * 6),
      maxPoints: 15,
      afterStep: makeLaunchNetAfterStep()
    });
  }

  function drawTrajectoryPoints(prediction, ratio, colors) {
    ctx.fillStyle = ratio > 0.72 ? colors.trajectoryHot : colors.trajectory;
    prediction.points.forEach((point, i) => {
      ctx.globalAlpha = 0.76 - i * (0.52 / point.pointCount);
      ctx.beginPath();
      ctx.arc(point.x, point.y, Math.max(2.1, 4.2 - i * 0.16), 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawDebugShots() {
    if (!debugShots.preview) return;
    const colors = getCanvasTheme();
    ctx.save();
    drawTrajectoryPoints(debugShots.preview, debugShots.ratio, colors);
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = colors.trajectoryHot;
    ctx.lineWidth = 1;
    for (const point of debugShots.actual) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawTrajectory() {
    const colors = getCanvasTheme();
    const pull = getPullVector();
    ctx.save();
    drawTrajectoryPoints(predictShot(pull), pull.ratio, colors);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.trajectoryHot;
    ctx.lineWidth = 4 + pull.ratio * 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(ball.x - pull.x * 0.55, ball.y - pull.y * 0.55);
    ctx.stroke();

    ctx.strokeStyle = "rgba(38, 48, 68, 0.16)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r + 11, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * pull.ratio);
    ctx.stroke();
    ctx.restore();
  }

  // ---------- Tutorial: ghost-hand aim guide and one-time tips ----------

  function readTutorialSeen() {
    try {
      const raw = localStorage.getItem(TUTORIAL_KEY);
      if (raw === null) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((id) => TUTORIAL_TIP_IDS.includes(id)) : [];
    } catch {
      return null;
    }
  }

  function writeTutorialSeen() {
    try {
      localStorage.setItem(TUTORIAL_KEY, JSON.stringify([...tutorial.seen]));
    } catch {
      // Private mode: the tutorial simply shows again next time.
    }
  }

  // Players who already have a score or stats skip the tutorial on their first boot of this version.
  function initTutorial() {
    const stored = readTutorialSeen();
    if (stored !== null) {
      tutorial.seen = new Set(stored);
      return;
    }
    const normalized = normalizeStats(stats);
    const veteran = best > 0 || normalized.lifetimeScore > 0 || normalized.perfectBaskets > 0;
    tutorial.seen = new Set(veteran ? TUTORIAL_TIP_IDS : []);
    writeTutorialSeen();
  }

  function replayTutorial() {
    if (!gameBooted) return;
    ensureAudio();
    playGameSound("button");
    tutorial.seen.clear();
    writeTutorialSeen();
    if (replayTutorialButton) replayTutorialButton.classList.add("done");
    syncControlLabels();
  }

  function hasSeenTip(id) {
    return tutorial.seen.has(id);
  }

  function markTipSeen(id) {
    if (tutorial.seen.has(id)) return;
    tutorial.seen.add(id);
    writeTutorialSeen();
  }

  function showTip(id, sticky) {
    if (hasSeenTip(id) || tutorial.tipId === id || tutorial.tipQueue.some((entry) => entry.id === id)) return;
    tutorial.tipQueue.push({ id, sticky: Boolean(sticky) });
    showNextTip();
  }

  function showNextTip() {
    if (!tipBanner || tutorial.tipId !== null || tutorial.tipQueue.length === 0) return;
    const entry = tutorial.tipQueue.shift();
    tutorial.tipId = entry.id;
    if (!entry.sticky) markTipSeen(entry.id);
    tipText.textContent = t("tip_" + entry.id);
    tipBanner.classList.remove("active");
    void tipBanner.offsetWidth;
    tipBanner.classList.add("active");
    if (!entry.sticky) tutorial.tipTimer = window.setTimeout(hideTip, TIP_DURATION * 1000);
  }

  function hideTip() {
    if (tutorial.tipTimer !== null) window.clearTimeout(tutorial.tipTimer);
    tutorial.tipTimer = null;
    tutorial.tipId = null;
    if (tipBanner) tipBanner.classList.remove("active");
    if (state === "playing") window.setTimeout(showNextTip, 260);
  }

  // A paused game freezes the tip on screen; it gets its full time again after resuming.
  function pauseTipTimer() {
    if (tutorial.tipTimer === null) return;
    window.clearTimeout(tutorial.tipTimer);
    tutorial.tipTimer = null;
  }

  function resumeTipTimer() {
    if (tutorial.tipId && tutorial.tipId !== "aim" && tutorial.tipTimer === null) {
      tutorial.tipTimer = window.setTimeout(hideTip, TIP_DURATION * 1000);
    }
  }

  function clearTips() {
    tutorial.tipQueue = [];
    if (tutorial.tipTimer !== null) window.clearTimeout(tutorial.tipTimer);
    tutorial.tipTimer = null;
    tutorial.tipId = null;
    if (tipBanner) tipBanner.classList.remove("active");
  }

  function syncTipText() {
    if (tutorial.tipId && tipText) tipText.textContent = t("tip_" + tutorial.tipId);
  }

  // Search a pull that drops the ball cleanly into the first target, so the ghost hand
  // demonstrates a shot that really works: same integrator as the real flight, and the path
  // must clear both rim points by a margin (a rim touch could bounce out).
  function findGhostPull(target) {
    let bestPull = null;
    let bestScore = Infinity;
    const towardX = Math.sign(target.x - ball.x) || 1;
    const rimPoints = [hoopToWorld(target, -target.w * 0.5, 0), hoopToWorld(target, target.w * 0.5, 0)];
    const clearance = BALL_RADIUS + RIM_RADIUS + 3;
    for (let ratio = 0.5; ratio <= 1.0001; ratio += 0.05) {
      for (let degrees = 40; degrees <= 88; degrees += 2) {
        const angle = degrees * Math.PI / 180;
        const len = MAX_PULL * ratio;
        const pull = { x: Math.cos(angle) * len * towardX, y: -Math.sin(angle) * len, len, ratio, power: 1 };
        const velocity = Physics.getLaunchVelocity(pull, FLIGHT_PARAMS);
        const flight = Physics.predictTrajectory(ball, velocity, FLIGHT_PARAMS, {
          dotSteps: 1, pointCount: 220, maxPoints: 220, afterStep: makeLaunchNetAfterStep()
        });
        const points = flight.points;
        let entryIndex = -1;
        let entryX = 0;
        let clear = true;
        for (let i = 1; i < points.length; i += 1) {
          const point = points[i];
          for (const rim of rimPoints) {
            if (Math.hypot(point.x - rim.x, point.y - rim.y) < clearance) clear = false;
          }
          if (!clear) break;
          const previous = points[i - 1];
          if (previous.y < target.y && point.y >= target.y) {
            const k = (target.y - previous.y) / (point.y - previous.y);
            entryX = previous.x + (point.x - previous.x) * k;
            entryIndex = i;
            break;
          }
          // Falling while still below the rim line: it never reached the target height.
          if (point.y > previous.y && point.y > target.y) break;
          // Rising under the target would hit its net from below.
          const local = worldToHoop(target, point.x, point.y);
          if (local.y > 0 && local.y < NET_REST_Y + 34 && Math.abs(local.x) < target.w * 0.5 + BALL_RADIUS + 2) {
            clear = false;
            break;
          }
        }
        if (!clear || entryIndex < 0) continue;
        const miss = Math.abs(entryX - target.x) + Math.abs(ratio - 0.78) * 12;
        if (miss < bestScore) {
          bestScore = miss;
          bestPull = { pull, points: points.filter((_, index) => index % 2 === 0 && index <= entryIndex + 8) };
        }
      }
    }
    return bestPull;
  }

  function beginAimGuide() {
    tutorial.basketsThisRun = 0;
    if (hasSeenTip("aim")) {
      tutorial.guide = null;
      return;
    }
    replayTutorialButton?.classList.remove("done");
    const target = getHoopById(targetHoopId);
    const ghost = target ? findGhostPull(target) : null;
    tutorial.guide = ghost ? { clock: 0, pull: ghost.pull, flight: ghost.points } : { clock: 0, pull: null, flight: [] };
    showTip("aim", true);
  }

  function completeAimGuide() {
    if (!tutorial.guide && hasSeenTip("aim")) return;
    tutorial.guide = null;
    markTipSeen("aim");
    if (tutorial.tipId === "aim") hideTip();
  }

  function onTutorialBasket(wasPerfect, usedWall, ignitedNow) {
    tutorial.basketsThisRun += 1;
    completeAimGuide();
    showTip("perfect");
    if (wasPerfect && (ignitedNow || tutorial.basketsThisRun >= 2)) showTip("flame");
    if (usedWall) markTipSeen("wall");
    else if (tutorial.basketsThisRun >= 4) showTip("wall");
  }

  function updateTutorial(dt) {
    if (tutorial.guide) tutorial.guide.clock = (tutorial.guide.clock + dt) % GHOST_CYCLE;
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) * 0.5;
  }

  function drawTutorialGuide() {
    const guide = tutorial.guide;
    if (!guide || state !== "playing" || !ball.held || drag || !guide.pull) return;
    const time = guide.clock;
    const colors = getCanvasTheme();
    const pull = guide.pull;
    const dragK = time < 0.35 ? 0 : time < 1.25 ? easeInOut((time - 0.35) / 0.9) : time < 1.75 ? 1 : 0;
    const handAlpha = time < 0.3 ? time / 0.3 : time < 1.75 ? 1 : time < 2.05 ? 1 - (time - 1.75) / 0.3 : 0;
    ctx.save();
    if (dragK > 0.05) {
      const partial = { x: pull.x * dragK, y: pull.y * dragK, len: pull.len * dragK, ratio: pull.ratio * dragK, power: 1 };
      ctx.globalAlpha = 0.8;
      drawTrajectoryPoints(predictShot(partial), partial.ratio, colors);
    }
    // After the release a ghost ball flies the real path.
    if (time >= 1.75 && guide.flight.length > 0) {
      const index = Math.floor((time - 1.75) / (2 * Physics.FIXED_DT));
      const point = guide.flight[Math.min(index, guide.flight.length - 1)];
      if (index < guide.flight.length) {
        ctx.globalAlpha = 0.42;
        ctx.fillStyle = colors.ink;
        ctx.beginPath();
        ctx.arc(point.x, point.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
    if (handAlpha > 0.01) {
      // The finger moves opposite to the pull, exactly like a real drag.
      const fingerX = ball.x - pull.x * dragK;
      const fingerY = ball.y - pull.y * dragK;
      drawGhostHand(fingerX, fingerY + 4, time > 0.2 && time < 1.75, handAlpha);
    }
  }

  function drawGhostHand(x, y, pressed, alpha) {
    const ink = "#22192b";
    ctx.save();
    ctx.globalAlpha = alpha;
    if (pressed) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.translate(x, y);
    ctx.rotate(-0.42);
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = ink;
    const shape = () => {
      ctx.beginPath();
      roundRectPath(ctx, -6, -2, 12, 34, 6);
      roundRectPath(ctx, -14, 20, 30, 30, 11);
      roundRectPath(ctx, -21, 24, 12, 20, 6);
    };
    shape();
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    shape();
    ctx.fill();
    ctx.fillStyle = "#e6dccd";
    ctx.beginPath();
    roundRectPath(ctx, 6, 26, 9, 22, 5);
    ctx.fill();
    ctx.restore();
  }

  function roundRectPath(target, x, y, w, h, r) {
    target.moveTo(x + r, y);
    target.arcTo(x + w, y, x + w, y + h, r);
    target.arcTo(x + w, y + h, x, y + h, r);
    target.arcTo(x, y + h, x, y, r);
    target.arcTo(x, y, x + w, y, r);
    target.closePath();
  }

  function drawParticles() {
    ctx.save();
    for (const p of particles) {
      const progress = 1 - clamp(p.life / (p.maxLife || 0.6), 0, 1);
      ctx.globalAlpha = clamp(p.life * 2, 0, 1);
      if (p.type === "ring") {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(0.8, (p.lineWidth || 2) * (1 - progress * 0.65));
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size + (p.growth || 18) * progress, (p.size * 0.34) + (p.growth || 18) * 0.22 * progress, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === "star") {
        ctx.fillStyle = p.color;
        drawParticleStar(p.x, p.y, Math.max(1, p.size), progress * Math.PI * 0.6);
        ctx.fill();
      } else if (p.type === "splash") {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, Math.max(1, p.size * 1.2), Math.max(1, p.size * 0.72), Math.atan2(p.vy, p.vx), 0, Math.PI * 2);
        ctx.fill();
      } else if (isFlameParticle(p)) {
        continue;
      } else if (p.type === "spark") {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 0.025, p.y - p.vy * 0.025);
        ctx.stroke();
      } else if (p.type === "dust") {
        ctx.globalAlpha = clamp(p.life / (p.maxLife || 0.45), 0, 1) * 0.55;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + progress * 0.8), 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    drawFlameParticles();
    ctx.restore();
  }

  // Detached flame tongue: teardrop pointing along its drift, outer and inner colour.
  function drawFlameLick(p, progress) {
    const size = p.size * (1 - progress * 0.7);
    if (size <= 0.5) return;
    ctx.save();
    ctx.globalAlpha = 1 - progress * 0.6;
    ctx.translate(p.x, p.y);
    ctx.rotate(Math.atan2(p.vy, p.vx));
    for (const [color, scale] of [[p.colors[1], 1], [p.colors[0], 0.5]]) {
      const length = size * 1.9 * scale;
      const half = size * 0.62 * scale;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(length, 0);
      ctx.bezierCurveTo(length * 0.3, -half, -half, -half, -half, 0);
      ctx.bezierCurveTo(-half, half, length * 0.3, half, length, 0);
      ctx.fill();
    }
    ctx.restore();
  }

  // Detached licks and diamond cinders, drawn after the regular particles.
  function drawFlameParticles() {
    for (const p of particles) {
      if (!isFlameParticle(p)) continue;
      const progress = 1 - clamp(p.life / (p.maxLife || 0.4), 0, 1);
      if (p.type === "lick") {
        drawFlameLick(p, progress);
        continue;
      }
      const size = p.size * (1 - progress * 0.6);
      ctx.globalAlpha = 1 - progress;
      ctx.fillStyle = p.colors[0];
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - size);
      ctx.lineTo(p.x + size * 0.6, p.y);
      ctx.lineTo(p.x, p.y + size);
      ctx.lineTo(p.x - size * 0.6, p.y);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawParticleStar(x, y, radius, rotation) {
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const pointRadius = i % 2 === 0 ? radius : radius * 0.45;
      const angle = rotation - Math.PI * 0.5 + i * Math.PI / 5;
      const px = x + Math.cos(angle) * pointRadius;
      const py = y + Math.sin(angle) * pointRadius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function drawHint() {
    const hoop = hoops[0];
    const target = hoops[1];
    const dragDirection = target && target.x < hoop.x ? 1 : -1;
    const hintX = hoop.x + dragDirection * 62;
    const colors = getCanvasTheme();
    ctx.save();
    ctx.strokeStyle = colors.hint;
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 8]);
    ctx.beginPath();
    ctx.moveTo(hoop.x, hoop.y - 18);
    ctx.lineTo(hintX, hoop.y + 54);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = colors.hintStrong;
    ctx.beginPath();
    ctx.moveTo(hintX, hoop.y + 54);
    ctx.lineTo(hintX - dragDirection * 18, hoop.y + 48);
    ctx.lineTo(hintX - dragDirection * 6, hoop.y + 36);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Screen-space line just under the HUD block, for the short "new best" banner.
  const COMBO_TEXT_Y = 214;
  const CANVAS_UI_FONT = '"Nunito", ui-rounded, "SF Pro Rounded", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

  // Canvas text in the UI's sticker style: ink outline under a flat fill, hard drop below.
  function drawStickerText(text, x, y, fill, outline = 7) {
    const drop = outline * 0.5;
    ctx.lineJoin = "round";
    ctx.lineWidth = outline;
    ctx.strokeStyle = "#22192b";
    ctx.fillStyle = "#22192b";
    ctx.fillText(text, x, y + drop);
    ctx.strokeText(text, x, y + drop);
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
  }

  // Small sticker text just above the hoop that was scored: the player's eye is already there,
  // and it stays well below the next target (at least ~150 units higher) so it never hides it.
  function drawCombo() {
    const duration = lastWasPerfect || lastWasBounce ? 1.1 : 0.85;
    const progress = 1 - clamp(comboText / duration, 0, 1);
    const pop = Math.sin(clamp(progress * 3, 0, 1) * Math.PI);
    const streakEmphasis = lastWasPerfect ? Math.min(swishStreak, 6) * 0.5 : 0;
    ctx.save();
    ctx.font = "900 " + (15 + streakEmphasis + pop * 3) + "px " + CANVAS_UI_FONT;
    ctx.textAlign = "center";
    const halfWidth = ctx.measureText(scoreFeedbackText).width * 0.5 + 6;
    const minX = WALL_INSET + halfWidth;
    const maxX = WORLD_W - WALL_INSET - halfWidth;
    const x = minX < maxX ? clamp(comboAnchor.x, minX, maxX) : WORLD_W * 0.5;
    ctx.globalAlpha = Math.min(1, comboText * 3);
    drawStickerText(scoreFeedbackText, x, comboAnchor.y - 24 - progress * 16, lastWasBounce ? "#ff8a1f" : lastWasPerfect ? "#ffc531" : "#ffffff", 5);
    ctx.restore();
  }

  function drawHighScoreCelebration() {
    if (!highScoreCelebration.active) return;
    const elapsed = highScoreCelebration.elapsed;
    const remaining = Math.max(0, NEW_HIGH_SCORE_DURATION - elapsed);
    const progress = 1 - clamp(remaining / NEW_HIGH_SCORE_DURATION, 0, 1);
    const pop = Math.sin(clamp(progress * 1.8, 0, 1) * Math.PI);
    const colors = getCanvasTheme();

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    for (const piece of highScoreCelebration.confetti) {
      const lifeAlpha = clamp(piece.life / Math.min(0.3, piece.maxLife), 0, 1);
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.globalAlpha = lifeAlpha;
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.width * 0.5, -piece.height * 0.5, piece.width, piece.height);
      ctx.restore();
    }

    if (elapsed < NEW_HIGH_SCORE_DURATION) {
      ctx.save();
      ctx.translate(WORLD_W * 0.5, COMBO_TEXT_Y);
      ctx.globalAlpha = Math.min(1, remaining * 1.4);
      ctx.font = "900 " + (19 + pop * 3) + "px " + CANVAS_UI_FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      drawStickerText(t("newHighScore"), 0, -remaining * 8, "#ffc531", 5);
      ctx.restore();
    }

    ctx.restore();
  }

  // Called many times per frame; theme data is static, so build each palette once.
  const canvasThemeCache = new Map();

  function getCanvasTheme() {
    const theme = THEMES[selectedThemeId] || THEMES.gym;
    const key = theme.id + (darkMode ? "|dark" : "|light");
    let colors = canvasThemeCache.get(key);
    if (!colors) {
      colors = {
        ...(darkMode ? theme.colors.dark : theme.colors.light),
        themeId: theme.id,
        bgStyle: theme.bgStyle,
        motif: theme.motif
      };
      canvasThemeCache.set(key, colors);
    }
    return colors;
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function ensureAudio() {
    if (muted || userPaused) return;
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
  }

  function getThemeSound() {
    return THEME_SOUNDS[selectedThemeId] || THEME_SOUNDS.gym;
  }

  function playGameSound(name, context) {
    if (muted || userPaused) return;
    const detail = context || {};
    const voice = getThemeSound();
    // UI sounds share the wall thump's character: a soft triangle body plus a filtered noise tap.
    if (name === "button") {
      playTone(300, 0.07, "triangle", 0.024, 0, 210);
      playNoise(0.035, 0.018, "lowpass", 1600, 600, 0.7);
    } else if (name === "start") {
      playTone(180, 0.1, "triangle", 0.032, 0, 110);
      playNoise(0.06, 0.03, "lowpass", 1000, 300, 0.7);
      playTone(523, 0.12, "sine", 0.018, 0.09, 528);
      playTone(784, 0.18, "sine", 0.017, 0.15, 790);
    } else if (name === "shot") {
      // Slingshot "thwop": a rising rubbery tone and a muffled body, no hiss.
      const power = clamp(Number(detail.power) || 0, 0, 1);
      playTone(170, 0.1, "triangle", 0.03 + power * 0.016, 0, 300 + power * 180);
      playNoise(0.05, 0.02 + power * 0.02, "lowpass", 500, 200, 0.7);
      playTone(660, 0.05, "sine", 0.01, 0.015, 440);
    } else if (name === "rim") {
      // Short, dull metal "tonk" in the wall thump's family; no long ring.
      const strength = clamp(Number(detail.strength) || 0, 0, 1);
      const base = voice.rim + Math.random() * 40;
      const level = 0.014 + strength * 0.034;
      playTone(base, 0.13, "triangle", level, 0, base * 0.96);
      playTone(base * 2.7, voice.rimRing, "sine", level * 0.28, 0, 0);
      playNoise(0.02, level * 0.6, "lowpass", 2200, 700, 0.7);
    } else if (name === "net") {
      const strength = clamp(Number(detail.strength) || 0, 0, 1);
      playNoise(0.08, 0.012 + strength * 0.025, "lowpass", 700, 300, 0.6);
      playTone(260, 0.05, "triangle", 0.008 + strength * 0.012, 0, 200);
      if (voice.chainNet) playChainJingle(0.006 + strength * 0.012, 0);
    } else if (name === "board" || name === "wall") {
      const strength = clamp(Number(detail.strength) || 0, 0, 1);
      const pitch = (name === "board" ? 150 : 120) * voice.thump;
      playTone(pitch, 0.09, "triangle", 0.018 + strength * 0.035, 0, pitch * 0.55);
      playNoise(0.06, 0.02 + strength * 0.04, "lowpass", 900, 300, 0.7);
    } else if (name === "score") {
      // One scoring cue: soft drop into the net, then rising marimba notes.
      // Normal: two notes. Perfect: three-note arpeggio, a semitone higher per streak step,
      // with a bright top note once the ball is on fire. Bank shots open with a wood knock.
      const streak = Math.min(Number(detail.streak) || 0, 8);
      const root = voice.root * Math.pow(2, (detail.perfect ? streak : 0) / 12);
      let start = 0;
      playTone(140, 0.08, "triangle", 0.03, 0, 90);
      playNoise(0.05, 0.022, "lowpass", 600, 200, 0.7);
      if (detail.wall) {
        playTone(196, 0.07, "triangle", 0.026, 0.02, 150);
        playNoise(0.03, 0.02, "lowpass", 1200, 400, 0.7, 0.02);
        start = 0.05;
      }
      if (voice.chainNet) playChainJingle(0.014, 0.01);
      const notes = detail.perfect ? [1, 1.26, 1.5] : [0.75, 1];
      if (detail.perfect && streak >= 3) notes.push(2);
      notes.forEach((ratio, i) => playMallet(root * ratio, start + 0.02 + i * 0.07, i === notes.length - 1 ? 0.034 : 0.026));
    } else if (name === "countdownTick") {
      const remainingSeconds = clamp(Math.floor(Number(detail.seconds) || 1), 1, 5);
      const tickPitch = 520 + (5 - remainingSeconds) * 55;
      playTone(tickPitch, 0.05, "triangle", 0.02, 0, tickPitch * 0.8);
      playNoise(0.025, 0.014, "bandpass", tickPitch * 3, 0, 2);
    } else if (name === "retry") {
      playTone(220, 0.08, "triangle", 0.026, 0, 150);
      playNoise(0.05, 0.024, "lowpass", 900, 300, 0.7);
      playTone(523, 0.1, "sine", 0.016, 0.06, 528);
      playTone(659, 0.13, "sine", 0.015, 0.11, 664);
    } else if (name === "purchase") {
      // Coin chime: a soft tap, then a quick rising marimba run.
      playTone(220, 0.06, "triangle", 0.02, 0, 160);
      [1, 1.26, 1.5, 2].forEach((ratio, i) => playMallet(784 * ratio, 0.02 + i * 0.055, i === 3 ? 0.032 : 0.024));
    } else if (name === "gameover") {
      playTone(165, 0.24, "triangle", 0.036, 0, 82);
      playNoise(0.16, 0.05, "lowpass", 700, 150, 0.7);
      playTone(392, 0.16, "sine", 0.017, 0.06, 388);
      playTone(311, 0.2, "sine", 0.016, 0.18, 306);
      playTone(262, 0.32, "sine", 0.016, 0.32, 252);
    }
  }

  function readBestScore() {
    try {
      const value = Number(localStorage.getItem(STORAGE_KEY) || 0);
      return Number.isSafeInteger(value) && value >= 0 ? value : 0;
    } catch (error) {
      return 0;
    }
  }

  function writeBestScore(value) {
    if (!Number.isSafeInteger(value) || value < 0) return;
    if (!persistenceReady) return;
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch (error) {
      // Storage can be unavailable in some embedded/browser privacy modes.
    }
    requestSave(false);
  }

  function readBooleanPreference(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value === "true";
    } catch (error) {
      return fallback;
    }
  }

  function readLanguagePreference() {
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
      return savedLanguage === "en" ? "en" : "tr";
    } catch (error) {
      return "tr";
    }
  }

  function normalizeBallSkinId(skinId) {
    return BALL_SKINS[skinId] ? skinId : "classic";
  }

  function readBallSkinPreference() {
    try {
      const savedSkin = localStorage.getItem(BALL_SKIN_KEY);
      return normalizeBallSkinId(savedSkin);
    } catch (error) {
      return "classic";
    }
  }

  function readThemePreference() {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      return THEMES[savedTheme] ? savedTheme : "gym";
    } catch (error) {
      return "gym";
    }
  }

  function t(key) {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.tr[key] || key;
  }

  function createDefaultStats() {
    return {
      activePlayTimeMs: 0,
      lifetimeScore: 0,
      perfectBaskets: 0,
      bounceBaskets: 0,
      worldCoinsCollected: 0
    };
  }

  function normalizeStatValue(value) {
    return Number.isSafeInteger(value) && value >= 0 ? value : 0;
  }

  function normalizeStats(value) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    return {
      activePlayTimeMs: normalizeStatValue(source.activePlayTimeMs),
      lifetimeScore: normalizeStatValue(source.lifetimeScore),
      perfectBaskets: normalizeStatValue(source.perfectBaskets),
      bounceBaskets: normalizeStatValue(source.bounceBaskets),
      worldCoinsCollected: normalizeStatValue(source.worldCoinsCollected)
    };
  }

  function hasCanonicalStats(value, normalized) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const keys = Object.keys(createDefaultStats());
    return Object.keys(value).length === keys.length
      && keys.every((key) => value[key] === normalized[key]);
  }

  function addSafeStat(current, increment) {
    const normalizedCurrent = normalizeStatValue(current);
    const normalizedIncrement = normalizeStatValue(increment);
    return Math.min(Number.MAX_SAFE_INTEGER, normalizedCurrent + normalizedIncrement);
  }

  function createDefaultAchievementState() {
    return {
      unlockedIds: [],
      claimedIds: [],
      perfectStreakBest: 0,
      runBounceBest: 0,
      lifetimeBounceBaskets: 0,
      dailyStreak: 0,
      lastLoginDay: "",
      runIgnitionsBest: 0,
      bankPerfectBaskets: 0,
      newBallIds: []
    };
  }

  function normalizeAchievementIds(value, allowedIds) {
    const requested = new Set(Array.isArray(value) ? value.filter((id) => typeof id === "string") : []);
    return ACHIEVEMENTS
      .map((achievement) => achievement.id)
      .filter((id) => requested.has(id) && (!allowedIds || allowedIds.has(id)));
  }

  // Challenge balls earned but not yet seen in the shop, in shop order.
  function normalizeNewBallIds(value) {
    const requested = new Set(Array.isArray(value) ? value.filter((id) => typeof id === "string") : []);
    return CHALLENGE_SKIN_ORDER.filter((id) => requested.has(id));
  }

  function normalizeLoginDay(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return "";
    return value;
  }

  function normalizeAchievementState(value) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const unlockedIds = normalizeAchievementIds(source.unlockedIds);
    const claimedIds = normalizeAchievementIds(source.claimedIds, new Set(unlockedIds));
    return {
      unlockedIds,
      claimedIds,
      perfectStreakBest: normalizeStatValue(source.perfectStreakBest),
      runBounceBest: normalizeStatValue(source.runBounceBest),
      lifetimeBounceBaskets: normalizeStatValue(source.lifetimeBounceBaskets),
      dailyStreak: normalizeStatValue(source.dailyStreak),
      lastLoginDay: normalizeLoginDay(source.lastLoginDay),
      runIgnitionsBest: normalizeStatValue(source.runIgnitionsBest),
      bankPerfectBaskets: normalizeStatValue(source.bankPerfectBaskets),
      newBallIds: normalizeNewBallIds(source.newBallIds)
    };
  }

  function hasCanonicalAchievementState(value, normalized) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const keys = Object.keys(createDefaultAchievementState());
    return Object.keys(value).length === keys.length
      && keys.every((key) => {
        if (Array.isArray(normalized[key])) {
          return Array.isArray(value[key])
            && value[key].length === normalized[key].length
            && value[key].every((entry, index) => entry === normalized[key][index]);
        }
        return value[key] === normalized[key];
      });
  }

  function getAchievementProgress(achievement) {
    if (achievement.metric === "perfectStreak") return achievementState.perfectStreakBest;
    if (achievement.metric === "highScore") return Math.max(best, score);
    if (achievement.metric === "runBounce") return achievementState.runBounceBest;
    if (achievement.metric === "lifetimeBounce") return achievementState.lifetimeBounceBaskets;
    if (achievement.metric === "dailyStreak") return achievementState.dailyStreak;
    if (achievement.metric === "ballCollection") return ownedBallSkins.size;
    // Challenge balls count toward 5/10 but not toward owning the whole shop.
    if (achievement.metric === "shopBallCollection") return BALL_SKIN_DISPLAY_ORDER.filter((id) => ownedBallSkins.has(id)).length;
    if (achievement.metric === "themeCollection") return ownedThemes.size;
    return achievementState.unlockedIds.includes(achievement.id) ? 1 : 0;
  }

  function unlockAchievement(achievementId, announce) {
    const achievement = ACHIEVEMENT_BY_ID[achievementId];
    if (!achievement || achievementState.unlockedIds.includes(achievementId)) return false;
    achievementState.unlockedIds = normalizeAchievementIds([...achievementState.unlockedIds, achievementId]);
    if (announce !== false) queueAchievementToast(achievement);
    return true;
  }

  function evaluateAchievements(options) {
    const config = options || {};
    const metrics = config.metrics ? new Set(config.metrics) : null;
    let changed = false;
    for (const achievement of ACHIEVEMENTS) {
      if (achievement.metric === "unlocked" || (metrics && !metrics.has(achievement.metric))) continue;
      if (getAchievementProgress(achievement) >= achievement.target) {
        changed = unlockAchievement(achievement.id, config.announce) || changed;
      }
    }
    if (changed) {
      syncAchievementUi();
      if (config.persist !== false) requestSave(true);
    }
    return changed;
  }

  function getLocalLoginDay(date) {
    const current = date instanceof Date ? date : new Date();
    const year = String(current.getFullYear()).padStart(4, "0");
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getLoginDayOrdinal(dayKey) {
    const normalized = normalizeLoginDay(dayKey);
    if (!normalized) return null;
    const [year, month, day] = normalized.split("-").map(Number);
    return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
  }

  function recordDailyLogin(date) {
    const today = getLocalLoginDay(date);
    if (achievementState.lastLoginDay === today) return false;
    const todayOrdinal = getLoginDayOrdinal(today);
    const previousOrdinal = getLoginDayOrdinal(achievementState.lastLoginDay);
    if (previousOrdinal !== null && todayOrdinal <= previousOrdinal) return false;
    achievementState.dailyStreak = previousOrdinal !== null && todayOrdinal === previousOrdinal + 1
      ? addSafeStat(achievementState.dailyStreak, 1)
      : 1;
    achievementState.lastLoginDay = today;
    evaluateAchievements({ metrics: ["dailyStreak"], persist: false });
    evaluateBallChallenges(true);
    syncAchievementUi();
    requestSave(true);
    return true;
  }

  function recordBasketStats(wasPerfect, usedWall, scoreGain) {
    stats.lifetimeScore = addSafeStat(stats.lifetimeScore, scoreGain);
    if (wasPerfect) stats.perfectBaskets = addSafeStat(stats.perfectBaskets, 1);
    if (usedWall) stats.bounceBaskets = addSafeStat(stats.bounceBaskets, 1);
  }

  function recordAchievementBasket(wasPerfect, usedWall, wasLastSecondTimedShot, ignited) {
    if (wasPerfect) {
      achievementState.perfectStreakBest = Math.max(achievementState.perfectStreakBest, swishStreak);
    }
    if (ignited) {
      runIgnitions = addSafeStat(runIgnitions, 1);
      achievementState.runIgnitionsBest = Math.max(achievementState.runIgnitionsBest, runIgnitions);
    }
    if (wasPerfect && usedWall) {
      achievementState.bankPerfectBaskets = addSafeStat(achievementState.bankPerfectBaskets, 1);
    }
    if (usedWall) {
      runBounceBaskets = addSafeStat(runBounceBaskets, 1);
      achievementState.runBounceBest = Math.max(achievementState.runBounceBest, runBounceBaskets);
      achievementState.lifetimeBounceBaskets = addSafeStat(achievementState.lifetimeBounceBaskets, 1);
    }
    let unlocked = evaluateAchievements({
      metrics: ["perfectStreak", "highScore", "runBounce", "lifetimeBounce"],
      persist: false
    });
    if (usedWall && ball.wallBounceCount >= 2) {
      unlocked = unlockAchievement("double_bounce_basket", true) || unlocked;
    }
    if (usedWall && runShotCount === 1) {
      unlocked = unlockAchievement("first_shot_bounce", true) || unlocked;
    }
    if (wasLastSecondTimedShot) {
      unlocked = unlockAchievement("last_second_timed_basket", true) || unlocked;
    }
    unlocked = evaluateBallChallenges(true) || unlocked;
    if (unlocked) syncAchievementUi();
    return unlocked;
  }

  // ---------- Daily missions ----------

  function createEmptyMissionState() {
    return { day: "", missions: [], bonusClaimed: false };
  }

  function hashString(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function makeSeededRandom(seed) {
    let value = seed || 1;
    return () => {
      value = (Math.imul(value ^ (value >>> 15), 2246822507) + 0x9e3779b9) >>> 0;
      value ^= value >>> 13;
      return (value >>> 0) / 4294967296;
    };
  }

  function roundToFive(value) {
    return Math.max(5, Math.round(value / 5) * 5);
  }

  // Score missions follow the player's own best so they stay reachable but not trivial.
  function getMissionTarget(type, tier) {
    if (type === "runScore") {
      const base = Math.max(best, 0);
      const scales = [0.35, 0.6, 0.85];
      const floors = [15, 25, 40];
      const caps = [150, 250, 400];
      return clamp(roundToFive(base * scales[tier]), floors[tier], caps[tier]);
    }
    return MISSION_TYPES[type].targets[tier];
  }

  function generateDailyMissions(dayKey) {
    const randomFor = makeSeededRandom(hashString("hoop-flick|" + dayKey));
    const pool = [...MISSION_TYPE_IDS];
    const missions = [];
    for (let tier = 0; tier < MISSIONS_PER_DAY && pool.length > 0; tier += 1) {
      const index = Math.floor(randomFor() * pool.length);
      const type = pool.splice(index, 1)[0];
      missions.push({ type, tier, target: getMissionTarget(type, tier), reward: MISSION_REWARDS[tier], progress: 0, claimed: false });
    }
    return { day: dayKey, missions, bonusClaimed: false };
  }

  function normalizeMissionState(value) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : null;
    const day = source ? normalizeLoginDay(source.day) : null;
    if (!source || !day || !Array.isArray(source.missions)) return createEmptyMissionState();
    const missions = [];
    for (const [tier, entry] of source.missions.slice(0, MISSIONS_PER_DAY).entries()) {
      if (!entry || typeof entry.type !== "string" || !Object.hasOwn(MISSION_TYPES, entry.type)) return createEmptyMissionState();
      const target = Number.isSafeInteger(entry.target) && entry.target > 0 ? entry.target : getMissionTarget(entry.type, tier);
      const progress = Number.isSafeInteger(entry.progress) && entry.progress >= 0 ? Math.min(entry.progress, target) : 0;
      missions.push({
        type: entry.type,
        tier,
        target,
        reward: MISSION_REWARDS[tier],
        progress,
        claimed: entry.claimed === true && progress >= target
      });
    }
    const allClaimed = missions.length === MISSIONS_PER_DAY && missions.every((mission) => mission.claimed);
    return { day, missions, bonusClaimed: source.bonusClaimed === true && allClaimed };
  }

  function serializeMissionState() {
    return {
      day: missionState.day,
      missions: missionState.missions.map((mission) => ({
        type: mission.type, target: mission.target, progress: mission.progress, claimed: mission.claimed
      })),
      bonusClaimed: missionState.bonusClaimed
    };
  }

  // Rolls the set over at local midnight; returns true when a new day's set was created.
  function ensureDailyMissions(date) {
    const today = getLocalLoginDay(date);
    if (missionState.day === today && missionState.missions.length === MISSIONS_PER_DAY) return false;
    // A clock set back must not hand out a fresh set: keep the newer day's missions.
    const savedOrdinal = getLoginDayOrdinal(missionState.day);
    if (savedOrdinal !== null && savedOrdinal > getLoginDayOrdinal(today) && missionState.missions.length === MISSIONS_PER_DAY) return false;
    missionState = generateDailyMissions(today);
    return true;
  }

  function isMissionComplete(mission) {
    return mission.progress >= mission.target;
  }

  function getClaimableMissionCount() {
    let count = missionState.missions.filter((mission) => isMissionComplete(mission) && !mission.claimed).length;
    if (canClaimMissionBonus()) count += 1;
    return count;
  }

  function canClaimMissionBonus() {
    return !missionState.bonusClaimed
      && missionState.missions.length === MISSIONS_PER_DAY
      && missionState.missions.every((mission) => mission.claimed);
  }

  // Feeds gameplay events into today's missions. Returns true when anything changed.
  function recordMissionProgress(values) {
    if (ensureDailyMissions()) syncMissionUi();
    let changed = false;
    for (const mission of missionState.missions) {
      if (!Object.hasOwn(values, mission.type) || isMissionComplete(mission)) continue;
      const value = values[mission.type];
      const next = MISSION_TYPES[mission.type].mode === "max"
        ? Math.max(mission.progress, value)
        : mission.progress + value;
      const clamped = Math.min(mission.target, Math.max(0, Math.floor(next)));
      if (clamped === mission.progress) continue;
      mission.progress = clamped;
      changed = true;
      if (isMissionComplete(mission)) queueMissionToast(mission);
    }
    if (changed) syncMissionUi();
    return changed;
  }

  function claimMission(index) {
    const mission = missionState.missions[index];
    if (!mission || mission.claimed || !isMissionComplete(mission)) return false;
    mission.claimed = true;
    coins = Math.min(Number.MAX_SAFE_INTEGER, normalizeCoins(coins) + mission.reward);
    ensureAudio();
    playGameSound("purchase");
    syncEconomyBalances();
    syncMissionUi();
    requestSave(true);
    return true;
  }

  function claimMissionBonus() {
    if (!canClaimMissionBonus()) return false;
    missionState.bonusClaimed = true;
    coins = Math.min(Number.MAX_SAFE_INTEGER, normalizeCoins(coins) + MISSION_BONUS_REWARD);
    ensureAudio();
    playGameSound("purchase");
    syncEconomyBalances();
    syncMissionUi();
    requestSave(true);
    return true;
  }

  function describeMission(mission) {
    return t("mission_" + mission.type).replace("{n}", String(mission.target));
  }

  function formatMissionReset(now) {
    const current = now instanceof Date ? now : new Date();
    const midnight = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
    const minutes = Math.max(1, Math.ceil((midnight - current) / 60000));
    const time = t("hoursMinutes").replace("{h}", String(Math.floor(minutes / 60))).replace("{m}", String(minutes % 60));
    return t("missionsReset").replace("{time}", time);
  }

  function createRewardChip(amount) {
    const reward = document.createElement("span");
    reward.className = "achievementRewardValue";
    const coinIcon = document.createElement("span");
    coinIcon.className = "coinIcon";
    coinIcon.setAttribute("aria-hidden", "true");
    reward.append(coinIcon, document.createTextNode("+" + amount));
    return reward;
  }

  function createMissionCard({ icon, tierClass, title, value, target, reward, claimed, onClaim }) {
    const complete = value >= target;
    const card = document.createElement("article");
    card.className = "missionCard " + tierClass + (complete ? " complete" : "") + (claimed ? " claimed" : "");
    card.setAttribute("role", "listitem");
    const badge = document.createElement("span");
    badge.className = "missionIcon";
    badge.setAttribute("aria-hidden", "true");
    badge.textContent = claimed ? "✓" : icon;
    const info = document.createElement("div");
    info.className = "missionInfo";
    const heading = document.createElement("h3");
    heading.textContent = title;
    info.append(heading, createChallengeProgress({ target }, value));
    const side = document.createElement("div");
    side.className = "missionReward";
    side.append(createRewardChip(reward));
    if (complete && !claimed) {
      const claim = document.createElement("button");
      claim.type = "button";
      claim.className = "achievementClaimButton";
      claim.textContent = t("achievementClaim");
      claim.addEventListener("click", onClaim);
      side.append(claim);
    } else {
      const status = document.createElement("span");
      status.className = "achievementClaimed";
      status.textContent = claimed ? t("achievementClaimed") : "";
      side.append(status);
    }
    card.append(badge, info, side);
    return card;
  }

  function renderMissions() {
    if (!missionList) return;
    if (ensureDailyMissions()) requestSave(false);
    if (missionsCoinBalanceValue) missionsCoinBalanceValue.textContent = String(normalizeCoins(coins));
    if (missionsResetText) missionsResetText.textContent = formatMissionReset();
    const tierClasses = ["tier-easy", "tier-medium", "tier-hard"];
    const cards = missionState.missions.map((mission, index) => createMissionCard({
      icon: MISSION_TYPES[mission.type].icon,
      tierClass: tierClasses[mission.tier] || "tier-easy",
      title: describeMission(mission),
      value: mission.progress,
      target: mission.target,
      reward: mission.reward,
      claimed: mission.claimed,
      onClaim: () => claimMission(index)
    }));
    const claimedCount = missionState.missions.filter((mission) => mission.claimed).length;
    cards.push(createMissionCard({
      icon: "★",
      tierClass: "tier-bonus",
      title: t("missionBonus"),
      value: claimedCount,
      target: MISSIONS_PER_DAY,
      reward: MISSION_BONUS_REWARD,
      claimed: missionState.bonusClaimed,
      onClaim: claimMissionBonus
    }));
    // Keep keyboard focus on the same card / ball across the rebuild.
    const focused = document.activeElement;
    const focusedCard = focused && missionList.contains(focused) ? [...missionList.children].indexOf(focused.closest(".missionCard")) : -1;
    const focusedSkin = focused && missionBallList && missionBallList.contains(focused) ? focused.dataset.skinId : null;
    missionList.replaceChildren(...cards);
    if (missionBallList) {
      missionBallList.replaceChildren(...CHALLENGE_SKIN_ORDER.filter((id) => BALL_SKINS[id]).map(createBallSkinOption));
    }
    if (focusedCard >= 0 && cards[focusedCard]) {
      const card = cards[focusedCard];
      card.tabIndex = -1;
      (card.querySelector("button") || card).focus({ preventScroll: true });
    } else if (focusedSkin) {
      missionBallList.querySelector(`[data-skin-id="${focusedSkin}"]`)?.focus({ preventScroll: true });
    }
    syncMissionTabs();
  }

  function syncMissionTabs() {
    const daily = missionsTab === "daily";
    missionsDailyTab?.setAttribute("aria-selected", String(daily));
    missionsBallsTab?.setAttribute("aria-selected", String(!daily));
    if (missionsDailyPanel) missionsDailyPanel.hidden = !daily;
    if (missionsBallsPanel) missionsBallsPanel.hidden = daily;
  }

  function selectMissionsTab(tab) {
    if (missionsTab === tab) return;
    ensureAudio();
    playGameSound("button");
    missionsTab = tab;
    syncMissionTabs();
  }

  function renderGameOverMissions() {
    if (!gameOverMissions) return;
    ensureDailyMissions();
    const missions = missionState.missions;
    gameOverMissions.hidden = missions.length === 0;
    if (missions.length === 0) return;
    const title = document.createElement("small");
    title.className = "gameOverMissionsTitle";
    title.textContent = t("dailyMissionsTitle");
    const rows = missions.map((mission) => {
      const row = document.createElement("div");
      row.className = "gameOverMissionRow" + (isMissionComplete(mission) ? " complete" : "");
      const label = document.createElement("span");
      label.className = "gameOverMissionLabel";
      label.textContent = (isMissionComplete(mission) ? "✓ " : "") + describeMission(mission);
      row.append(label, createChallengeProgress({ target: mission.target }, mission.progress));
      return row;
    });
    gameOverMissions.replaceChildren(title, ...rows);
  }

  function syncMissionBadges() {
    const claimable = getClaimableMissionCount();
    for (const button of [missionsButton, missionsDailyTab]) {
      if (!button) continue;
      button.dataset.achievementCount = String(claimable);
      button.classList.toggle("hasAchievementBadge", claimable > 0);
    }
    missionsButton?.setAttribute(
      "aria-label",
      claimable > 0 ? `${t("missionsTab")} · ${claimable} ${t("achievementRewardsReady")}` : t("missionsTab")
    );
  }

  function syncMissionUi() {
    syncMissionBadges();
    if (state === "missions") renderMissions();
    if (state === "gameover") renderGameOverMissions();
  }

  // Once a minute: refresh the countdown and roll missions over at local midnight.
  function tickMissionClock() {
    if (!gameBooted) return;
    if (ensureDailyMissions()) {
      syncMissionUi();
      requestSave(false);
    } else if (state === "missions" && missionsResetText) {
      missionsResetText.textContent = formatMissionReset();
    }
  }

  function getBallChallengeProgress(challenge) {
    if (challenge.metric === "perfectStreak") return achievementState.perfectStreakBest;
    if (challenge.metric === "runIgnitions") return achievementState.runIgnitionsBest;
    if (challenge.metric === "dailyStreak") return achievementState.dailyStreak;
    if (challenge.metric === "bankPerfects") return achievementState.bankPerfectBaskets;
    if (challenge.metric === "highScore") return Math.max(best, score);
    if (challenge.metric === "lifetimePerfects") return normalizeStatValue(stats.perfectBaskets);
    return 0;
  }

  // Grants every challenge ball whose target is met; the caller decides when to save.
  function evaluateBallChallenges(announce) {
    let changed = false;
    for (const skinId of CHALLENGE_SKIN_ORDER) {
      const challenge = BALL_CHALLENGES[skinId];
      if (ownedBallSkins.has(skinId) || getBallChallengeProgress(challenge) < challenge.target) continue;
      ownedBallSkins.add(skinId);
      achievementState.newBallIds = normalizeNewBallIds([...achievementState.newBallIds, skinId]);
      changed = true;
      if (announce !== false) queueBallUnlockToast(skinId);
    }
    if (!changed) return false;
    syncAchievementBadges();
    evaluateAchievements({ metrics: ["ballCollection", "shopBallCollection"], announce, persist: false });
    if (state === "customize") renderBallCustomizer();
    return true;
  }

  function normalizeCoins(value) {
    return Number.isSafeInteger(value) && value >= 0 ? value : 0;
  }

  function normalizeOwnedIds(value, catalog, defaultId) {
    const owned = new Set([defaultId]);
    if (!Array.isArray(value)) return owned;
    for (const id of value) {
      if (typeof id === "string" && catalog[id]) owned.add(id);
    }
    return owned;
  }

  function hasCanonicalOwnedIds(value, owned, catalog) {
    if (!Array.isArray(value)) return false;
    const canonical = Object.keys(catalog).filter((id) => owned.has(id));
    return value.length === canonical.length && value.every((id, index) => id === canonical[index]);
  }

  function migrateSaveData(save, allowSavedLanguage) {
    const source = save && typeof save === "object" && !Array.isArray(save) ? save : null;
    const version = source && Number.isSafeInteger(source.version) ? source.version : 0;
    const settings = source && source.settings && typeof source.settings === "object"
      ? source.settings
      : source || {};
    const savedScore = source ? Number(source.highScore) : 0;
    const highScore = Number.isSafeInteger(savedScore) && savedScore >= 0 ? savedScore : 0;
    const normalizedCoins = version >= ECONOMY_SAVE_VERSION ? normalizeCoins(source?.coins) : 0;
    const normalizedStats = version >= STATS_SAVE_VERSION
      ? normalizeStats(source?.stats)
      : createDefaultStats();
    const normalizedAchievements = version >= ACHIEVEMENT_SAVE_VERSION
      ? normalizeAchievementState(source?.achievements)
      : createDefaultAchievementState();
    let ballSkin = normalizeBallSkinId(settings.ballSkin);
    let theme = THEMES[settings.theme] ? settings.theme : "gym";
    const balls = version >= ECONOMY_SAVE_VERSION
      ? normalizeOwnedIds(source?.ownedBallSkins, BALL_SKINS, "classic")
      : new Set(["classic", ballSkin]);
    const themes = version >= ECONOMY_SAVE_VERSION
      ? normalizeOwnedIds(source?.ownedThemes, THEMES, "gym")
      : new Set(["gym", theme]);

    if (!balls.has(ballSkin)) ballSkin = "classic";
    if (!themes.has(theme)) theme = "gym";

    let migratedLanguage = language;
    if (allowSavedLanguage && (settings.language === "tr" || settings.language === "en")) {
      migratedLanguage = settings.language;
    }

    const needsMigration = Boolean(source) && (
      version !== SAVE_VERSION
      || highScore !== source.highScore
      || normalizedCoins !== source.coins
      || !hasCanonicalStats(source.stats, normalizedStats)
      || !hasCanonicalAchievementState(source.achievements, normalizedAchievements)
      || !hasCanonicalOwnedIds(source.ownedBallSkins, balls, BALL_SKINS)
      || !hasCanonicalOwnedIds(source.ownedThemes, themes, THEMES)
      || settings.ballSkin !== ballSkin
      || settings.theme !== theme
      || typeof settings.darkMode !== "boolean"
      || typeof settings.muted !== "boolean"
    );

    return {
      highScore,
      coins: normalizedCoins,
      stats: normalizedStats,
      achievements: normalizedAchievements,
      missions: normalizeMissionState(source?.missions),
      ownedBallSkins: balls,
      ownedThemes: themes,
      darkMode: typeof settings.darkMode === "boolean" ? settings.darkMode : false,
      muted: typeof settings.muted === "boolean" ? settings.muted : false,
      ballSkin,
      theme,
      language: migratedLanguage,
      needsMigration
    };
  }

  function applyMigratedSave(migrated) {
    best = migrated.highScore;
    coins = migrated.coins;
    stats = migrated.stats;
    achievementState = migrated.achievements;
    missionState = migrated.missions || createEmptyMissionState();
    ownedBallSkins = migrated.ownedBallSkins;
    ownedThemes = migrated.ownedThemes;
    darkMode = migrated.darkMode;
    muted = migrated.muted;
    selectedBallSkinId = migrated.ballSkin;
    selectedThemeId = migrated.theme;
    language = migrated.language;
    ballEffects.selectedPreset = BALL_SKINS[selectedBallSkinId].effectPreset;
  }

  function readLocalSaveRecord() {
    let rawData = null;
    let parsed = null;
    let invalidUnifiedSave = false;
    try {
      rawData = localStorage.getItem(LOCAL_SAVE_KEY);
      if (rawData && rawData.trim()) {
        const candidate = JSON.parse(rawData);
        if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) parsed = candidate;
        else invalidUnifiedSave = true;
      }
    } catch (error) {
      invalidUnifiedSave = Boolean(rawData);
    }
    if (parsed) return { save: parsed, shouldPersist: false };

    let hasLegacyData = false;
    try {
      hasLegacyData = [STORAGE_KEY, DARK_MODE_KEY, MUTED_KEY, LANGUAGE_KEY, BALL_SKIN_KEY, THEME_KEY]
        .some((key) => localStorage.getItem(key) !== null);
    } catch (error) {
      hasLegacyData = false;
    }
    if (!hasLegacyData) return { save: null, shouldPersist: invalidUnifiedSave };
    return {
      save: {
        version: 3,
        highScore: readBestScore(),
        settings: {
          language: readLanguagePreference(),
          darkMode: readBooleanPreference(DARK_MODE_KEY, false),
          muted: readBooleanPreference(MUTED_KEY, false),
          ballSkin: readBallSkinPreference(),
          theme: readThemePreference()
        }
      },
      shouldPersist: true
    };
  }

  function writeBooleanPreference(key, value, immediate) {
    if (!persistenceReady) return;
    try {
      localStorage.setItem(key, String(value));
    } catch (error) {
      // Preferences can be unavailable in embedded/browser privacy modes.
    }
    requestSave(Boolean(immediate));
  }

  function writeLanguagePreference(value, immediate) {
    if (!persistenceReady) return;
    try {
      localStorage.setItem(LANGUAGE_KEY, value);
    } catch (error) {
      // Language preferences can be unavailable in privacy modes.
    }
    requestSave(Boolean(immediate));
  }

  function writeBallSkinPreference(value, immediate) {
    if (!persistenceReady) return;
    try {
      localStorage.setItem(BALL_SKIN_KEY, value);
    } catch (error) {
      // Ball selection can be unavailable in privacy modes.
    }
    requestSave(Boolean(immediate));
  }

  function writeThemePreference(value, immediate) {
    if (!persistenceReady) return;
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch (error) {
      // Theme selection can be unavailable in privacy modes.
    }
    requestSave(Boolean(immediate));
  }

  function makeSaveObject() {
    commitActivePlaySegment({ keepRunning: canAccumulateActivePlayTime() });
    const settings = {
      darkMode: Boolean(darkMode),
      muted: Boolean(muted),
      ballSkin: ownedBallSkins.has(selectedBallSkinId) ? selectedBallSkinId : "classic",
      theme: ownedThemes.has(selectedThemeId) ? selectedThemeId : "gym",
      language
    };
    return {
      version: SAVE_VERSION,
      highScore: Number.isSafeInteger(best) && best >= 0 ? best : 0,
      coins: normalizeCoins(coins),
      stats: normalizeStats(stats),
      achievements: normalizeAchievementState(achievementState),
      missions: serializeMissionState(),
      ownedBallSkins: Object.keys(BALL_SKINS).filter((id) => ownedBallSkins.has(id)),
      ownedThemes: Object.keys(THEMES).filter((id) => ownedThemes.has(id)),
      settings
    };
  }

  function markSaveDirty() {
    if (!persistenceReady) return;
    saveRevision += 1;
    saveDirty = true;
  }

  function requestSave(immediate) {
    if (!persistenceReady) return;
    markSaveDirty();
    if (immediate) {
      if (saveTimer !== null) window.clearTimeout(saveTimer);
      saveTimer = null;
      void drainSaveQueue();
      return;
    }
    if (saveTimer !== null) window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      saveTimer = null;
      void drainSaveQueue();
    }, 350);
  }

  async function persistSaveData(data) {
    try {
      localStorage.setItem(LOCAL_SAVE_KEY, data);
      return true;
    } catch (error) {
      console.warn("[Hoop Flick] Local save failed; it will be retried later.", error);
      return false;
    }
  }

  async function drainSaveQueue() {
    if (!persistenceReady || !saveDirty) return true;
    if (saveInFlight) {
      saveDrainQueued = true;
      return false;
    }
    saveInFlight = true;
    let succeeded = true;
    try {
      do {
        saveDrainQueued = false;
        const revision = saveRevision;
        const data = JSON.stringify(makeSaveObject());
        const saved = await persistSaveData(data);
        if (!saved) {
          succeeded = false;
          break;
        }
        savedRevision = revision;
        if (saveRevision === revision) saveDirty = false;
      } while (saveDrainQueued || saveRevision > savedRevision);
    } catch (error) {
      succeeded = false;
      console.warn("[Hoop Flick] Save failed; it will be retried later.", error);
    } finally {
      saveInFlight = false;
    }
    return succeeded;
  }

  function flushSave() {
    if (!persistenceReady) return Promise.resolve(false);
    if (commitActivePlaySegment({ keepRunning: canAccumulateActivePlayTime() })) markSaveDirty();
    if (saveTimer !== null) {
      window.clearTimeout(saveTimer);
      saveTimer = null;
    }
    return drainSaveQueue();
  }

  function formatActivePlayTime(value) {
    const totalSeconds = Math.floor(normalizeStatValue(value) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
  }

  function getAchievementTierLabel(tier) {
    if (tier === "bronze") return t("achievementTierBronze");
    if (tier === "silver") return t("achievementTierSilver");
    if (tier === "gold") return t("achievementTierGold");
    if (tier === "flame") return t("achievementTierFlame");
    return t("achievementTierSpecial");
  }

  function getPendingAchievementIds() {
    const claimed = new Set(achievementState.claimedIds);
    return achievementState.unlockedIds.filter((id) => ACHIEVEMENT_BY_ID[id] && !claimed.has(id));
  }

  function getPendingAchievementReward() {
    return getPendingAchievementIds().reduce((total, id) => total + ACHIEVEMENT_BY_ID[id].reward, 0);
  }

  function getNewBallIds() {
    return achievementState.newBallIds.filter((id) => ownedBallSkins.has(id));
  }

  // Leaving the ball shop counts as having seen every new ball in it.
  function markNewBallsSeen() {
    if (achievementState.newBallIds.length === 0) return;
    achievementState.newBallIds = [];
    syncAchievementBadges();
    requestSave(false);
  }

  function syncAchievementBadges() {
    const newBallCount = getNewBallIds().length;
    if (customizeButton) {
      customizeButton.dataset.achievementCount = String(newBallCount);
      customizeButton.classList.toggle("hasAchievementBadge", newBallCount > 0);
      customizeButton.setAttribute(
        "aria-label",
        newBallCount > 0 ? `${t("customize")} · ${newBallCount} ${t("newBallsReady")}` : t("customize")
      );
    }
    const pendingCount = getPendingAchievementIds().length;
    for (const button of [profileButton, profileAchievementsButton]) {
      if (!button) continue;
      button.dataset.achievementCount = String(pendingCount);
      button.classList.toggle("hasAchievementBadge", pendingCount > 0);
    }
    profileButton.setAttribute(
      "aria-label",
      pendingCount > 0 ? `${t("profile")} · ${pendingCount} ${t("achievementRewardsReady")}` : t("profile")
    );
    profileAchievementsButton?.setAttribute(
      "aria-label",
      pendingCount > 0 ? `${t("achievements")} · ${pendingCount} ${t("achievementRewardsReady")}` : t("achievements")
    );
  }

  function createAchievementCard(achievement) {
    const unlocked = achievementState.unlockedIds.includes(achievement.id);
    const claimed = achievementState.claimedIds.includes(achievement.id);
    const progress = Math.min(getAchievementProgress(achievement), achievement.target);
    const card = document.createElement("article");
    card.className = `achievementCard ${achievement.tier} ${unlocked ? "unlocked" : "locked"}${claimed ? " claimed" : ""}`;
    card.setAttribute("role", "listitem");

    const medal = document.createElement("span");
    medal.className = "achievementMedal";
    medal.textContent = achievement.tier === "flame" ? "◆" : "★";
    medal.setAttribute("aria-label", getAchievementTierLabel(achievement.tier));

    const info = document.createElement("div");
    info.className = "achievementInfo";
    const title = document.createElement("h3");
    title.textContent = `${getAchievementTierLabel(achievement.tier)} · ${t(achievement.nameKey)}`;
    const description = document.createElement("p");
    description.textContent = t(achievement.descriptionKey);
    const progressRow = document.createElement("div");
    progressRow.className = "achievementProgressRow";
    const progressTrack = document.createElement("span");
    progressTrack.className = "achievementProgressTrack";
    progressTrack.setAttribute("aria-hidden", "true");
    const progressFill = document.createElement("span");
    progressFill.className = "achievementProgressFill";
    progressFill.style.width = `${achievement.target > 0 ? Math.round(progress / achievement.target * 100) : 0}%`;
    progressTrack.append(progressFill);
    const progressText = document.createElement("span");
    progressText.className = "achievementProgressText";
    progressText.textContent = `${progress} / ${achievement.target}`;
    progressRow.append(progressTrack, progressText);
    info.append(title, description, progressRow);

    const reward = document.createElement("div");
    reward.className = "achievementReward";
    const rewardValue = document.createElement("span");
    rewardValue.className = "achievementRewardValue";
    const coinIcon = document.createElement("span");
    coinIcon.className = "coinIcon";
    coinIcon.setAttribute("aria-hidden", "true");
    rewardValue.append(coinIcon, document.createTextNode(`+${achievement.reward}`));
    reward.append(rewardValue);
    if (unlocked && !claimed) {
      const claimButton = document.createElement("button");
      claimButton.className = "achievementClaimButton";
      claimButton.type = "button";
      claimButton.textContent = t("achievementClaim");
      claimButton.addEventListener("click", () => claimAchievementReward(achievement.id));
      reward.append(claimButton);
    } else {
      const status = document.createElement("span");
      status.className = "achievementClaimed";
      status.textContent = claimed ? `✓ ${t("achievementClaimed")}` : t("locked");
      reward.append(status);
    }

    card.append(medal, info, reward);
    return card;
  }

  function renderAchievements() {
    if (!achievementList) return;
    const fragment = document.createDocumentFragment();
    let currentGroup = null;
    let groupElement = null;
    for (const achievement of ACHIEVEMENTS) {
      if (achievement.groupKey !== currentGroup) {
        currentGroup = achievement.groupKey;
        groupElement = document.createElement("section");
        groupElement.className = "achievementGroup";
        const heading = document.createElement("h3");
        heading.className = "achievementGroupTitle";
        heading.textContent = t(currentGroup);
        groupElement.append(heading);
        fragment.append(groupElement);
      }
      groupElement.append(createAchievementCard(achievement));
    }
    achievementList.replaceChildren(fragment);
    const completed = achievementState.unlockedIds.length;
    achievementSummary.textContent = `${t("achievementCompleted")} ${completed} / ${ACHIEVEMENTS.length}`;
    achievementCoinBalanceValue.textContent = String(normalizeCoins(coins));
    const pendingReward = getPendingAchievementReward();
    achievementClaimAllButton.disabled = pendingReward <= 0;
    achievementClaimAllButton.textContent = pendingReward > 0
      ? `${t("claimAllAchievements")} · +${pendingReward}`
      : t("claimAllAchievements");
    syncAchievementBadges();
  }

  function syncAchievementUi() {
    syncAchievementBadges();
    if (state === "achievements" || achievementsOverlay?.classList.contains("active")) renderAchievements();
  }

  function claimAchievementReward(achievementId) {
    const achievement = ACHIEVEMENT_BY_ID[achievementId];
    if (
      !achievement
      || !gameBooted
      || !achievementState.unlockedIds.includes(achievementId)
      || achievementState.claimedIds.includes(achievementId)
    ) return false;
    achievementState.claimedIds = normalizeAchievementIds(
      [...achievementState.claimedIds, achievementId],
      new Set(achievementState.unlockedIds)
    );
    coins = Math.min(Number.MAX_SAFE_INTEGER, normalizeCoins(coins) + achievement.reward);
    syncEconomyBalances();
    renderAchievements();
    requestSave(true);
    ensureAudio();
    playGameSound("button");
    return true;
  }

  function claimAllAchievementRewards() {
    if (!gameBooted) return false;
    const pendingIds = getPendingAchievementIds();
    if (pendingIds.length === 0) return false;
    const reward = pendingIds.reduce((total, id) => total + ACHIEVEMENT_BY_ID[id].reward, 0);
    achievementState.claimedIds = normalizeAchievementIds(
      [...achievementState.claimedIds, ...pendingIds],
      new Set(achievementState.unlockedIds)
    );
    coins = Math.min(Number.MAX_SAFE_INTEGER, normalizeCoins(coins) + reward);
    syncEconomyBalances();
    renderAchievements();
    requestSave(true);
    ensureAudio();
    playGameSound("button");
    return true;
  }

  function getToastItem(entry) {
    if (entry.kind === "ball") return BALL_SKINS[entry.id];
    if (entry.kind === "mission") return entry.mission;
    return ACHIEVEMENT_BY_ID[entry.id];
  }

  function syncAchievementToastText() {
    const entry = achievementToastEntry;
    if (!entry) return;
    const item = getToastItem(entry);
    if (!item) return;
    const titleKey = entry.kind === "ball" ? "newBallUnlocked" : entry.kind === "mission" ? "missionComplete" : "achievementUnlocked";
    if (achievementToastTitle) achievementToastTitle.textContent = t(titleKey);
    achievementToastName.textContent = entry.kind === "mission" ? describeMission(item) : t(item.nameKey);
  }

  function queueMissionToast(mission) {
    achievementToastQueue.push({ kind: "mission", id: mission.type, mission });
    showNextAchievementToast();
  }

  function queueAchievementToast(achievement) {
    if (!achievement) return;
    achievementToastQueue.push({ kind: "achievement", id: achievement.id });
    showNextAchievementToast();
  }

  function queueBallUnlockToast(skinId) {
    if (!BALL_SKINS[skinId]) return;
    achievementToastQueue.push({ kind: "ball", id: skinId });
    showNextAchievementToast();
  }

  function showNextAchievementToast() {
    if (!gameBooted || achievementToastTimer !== null || achievementToastQueue.length === 0) return;
    const entry = achievementToastQueue.shift();
    const item = getToastItem(entry);
    if (!item) {
      showNextAchievementToast();
      return;
    }
    achievementToastEntry = entry;
    syncAchievementToastText();
    if (achievementToastMedal) {
      achievementToastMedal.classList.toggle("ballMedal", entry.kind === "ball");
      if (entry.kind === "ball") {
        const preview = createBallPreviewElement("toast", item);
        achievementToastMedal.replaceChildren(preview);
        drawBallPreviewCanvas(preview, item, { rotation: -0.35, time: 0, heat: 0, flash: 0 });
      } else {
        achievementToastMedal.textContent = entry.kind === "mission" ? "✓" : "★";
      }
      achievementToastMedal.classList.toggle("missionMedal", entry.kind === "mission");
    }
    // During play the toast sits under the HUD; over menus and dialogs it moves to the bottom.
    achievementToast.classList.toggle("atBottom", state !== "playing");
    achievementToast.classList.add("active");
    achievementToastTimer = window.setTimeout(() => {
      achievementToast.classList.remove("active");
      achievementToastTimer = window.setTimeout(() => {
        achievementToastTimer = null;
        showNextAchievementToast();
      }, 220);
    }, 2400);
  }

  function renderProfile() {
    if (!activePlayTimeValue) return;
    const normalized = normalizeStats(stats);
    activePlayTimeValue.textContent = formatActivePlayTime(normalized.activePlayTimeMs);
    perfectBasketsValue.textContent = String(normalized.perfectBaskets);
    bounceBasketsValue.textContent = String(normalized.bounceBaskets);
    lifetimeScoreValue.textContent = String(normalized.lifetimeScore);
    worldCoinsCollectedValue.textContent = String(normalized.worldCoinsCollected);
  }

  function applyDarkMode() {
    document.body.classList.toggle("dark-mode", darkMode);
    themeColor.setAttribute("content", darkMode ? "#101923" : "#f7f3e8");
    writeBooleanPreference(DARK_MODE_KEY, darkMode);
    if (userPaused) draw();
    renderThemeCustomizer();
    syncMenuHome();
    syncControlLabels();
  }

  function applyLanguage() {
    document.documentElement.lang = language;
    for (const element of document.querySelectorAll("[data-i18n]")) {
      element.textContent = t(element.dataset.i18n);
    }
    for (const element of document.querySelectorAll("[data-i18n-aria-label]")) {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    }
    writeLanguagePreference(language);
    if (state === "gameover") {
      renderGameOverSummary();
      renderGameOverMissions();
      renderGameOverChallenge();
    }
    clearEconomyStatus("ball");
    clearEconomyStatus("theme");
    syncAchievementToastText();
    syncTipText();
    syncMissionBadges();
    if (state === "missions") renderMissions();
    renderProfile();
    renderAchievements();
    syncEconomyBalances();
    renderBallCustomizer();
    renderThemeCustomizer();
    syncControlLabels();
    syncTimedShotHud(true);
  }

  function getSelectedBallSkin() {
    return BALL_SKINS[selectedBallSkinId] || BALL_SKINS.classic;
  }

  function getCosmeticStateLabel(isSelected, isOwned, price) {
    if (isSelected) return t("selectedSkin");
    if (isOwned) return t("owned");
    return t("locked") + " · " + price + " " + t("coins");
  }

  function syncEconomyBalances() {
    const value = String(normalizeCoins(coins));
    if (coinHudValue) coinHudValue.textContent = value;
    if (menuCoinValue) menuCoinValue.textContent = value;
    if (missionsCoinBalanceValue) missionsCoinBalanceValue.textContent = value;
    if (ballCoinBalanceValue) ballCoinBalanceValue.textContent = value;
    if (themeCoinBalanceValue) themeCoinBalanceValue.textContent = value;
    if (achievementCoinBalanceValue) achievementCoinBalanceValue.textContent = value;
    const label = t("coinBalance") + ": " + value;
    if (coinHud) coinHud.setAttribute("aria-label", label);
    if (ballCoinBalance) ballCoinBalance.setAttribute("aria-label", label);
    if (themeCoinBalance) themeCoinBalance.setAttribute("aria-label", label);
  }

  function clearEconomyStatus(kind) {
    const status = kind === "ball" ? ballEconomyStatus : themeEconomyStatus;
    if (economyStatusTimers[kind] !== null) {
      window.clearTimeout(economyStatusTimers[kind]);
      economyStatusTimers[kind] = null;
    }
    if (status) status.textContent = "";
  }

  function showEconomyStatus(kind, message) {
    const status = kind === "ball" ? ballEconomyStatus : themeEconomyStatus;
    clearEconomyStatus(kind);
    if (!status) return;
    status.textContent = message;
    economyStatusTimers[kind] = window.setTimeout(() => {
      economyStatusTimers[kind] = null;
      status.textContent = "";
    }, 2200);
  }

  function createBallPreviewElement(sizeClass, skin) {
    const previewSkin = skin || getSelectedBallSkin();
    if (previewSkin.assetPath) {
      const preview = document.createElement("span");
      preview.className = "ballPreviewGraphic hasAsset" + (sizeClass ? " " + sizeClass : "");
      preview.setAttribute("aria-hidden", "true");
      const image = document.createElement("img");
      image.className = "ballPreviewImage";
      image.src = previewSkin.assetPath;
      image.alt = "";
      preview.appendChild(image);
      return preview;
    }
    const preview = document.createElement("canvas");
    preview.className = "ballPreviewCanvas" + (sizeClass ? " " + sizeClass : "");
    preview.setAttribute("aria-hidden", "true");
    if (sizeClass === "large") {
      preview.addEventListener("pointerdown", () => {
        ballPreviewAnimation.startedAt = performance.now() - 1600;
        drawAnimatedBallPreview(performance.now());
      });
    } else {
      drawBallPreviewCanvas(preview, previewSkin, { rotation: -0.35, time: 0, heat: 0, flash: 0 });
    }
    return preview;
  }

  function sizeBallPreviewCanvas(canvasElement, large) {
    const rect = canvasElement.getBoundingClientRect();
    const fallback = canvasElement.classList.contains("tile") ? 60 : 48;
    const cssWidth = rect.width > 0 ? rect.width : (large ? 160 : fallback);
    const cssHeight = rect.height > 0 ? rect.height : (large ? 180 : fallback);
    const previewDpr = Math.min(window.devicePixelRatio || 1, 3);
    const pixelWidth = Math.round(cssWidth * previewDpr);
    const pixelHeight = Math.round(cssHeight * previewDpr);
    if (canvasElement.width !== pixelWidth) canvasElement.width = pixelWidth;
    if (canvasElement.height !== pixelHeight) canvasElement.height = pixelHeight;
    const previewCtx = canvasElement.getContext("2d");
    previewCtx.setTransform(previewDpr, 0, 0, previewDpr, 0, 0);
    return { ctx: previewCtx, width: cssWidth, height: cssHeight };
  }

  function drawBallPreviewCanvas(canvasElement, skin, options) {
    if (!canvasElement || !skin) return;
    const large = canvasElement.classList.contains("large");
    const surface = sizeBallPreviewCanvas(canvasElement, large);
    const previewCtx = surface.ctx;
    // The held flame reaches ~1.9 r below the centre and ~3 r above it; leave room for both.
    const radius = Math.min(surface.width, surface.height) * (large ? 0.17 : 0.42);
    const centerX = surface.width * 0.5;
    const centerY = large ? surface.height * 0.68 : surface.height * 0.5;
    previewCtx.clearRect(0, 0, surface.width, surface.height);

    if (large && options.heat > 0.01) {
      const preset = BALL_EFFECT_PRESETS[skin.effectPreset] || BALL_EFFECT_PRESETS.classic;
      const style = getFlameStyle(preset, darkMode);
      drawCelFlame({ ctx: previewCtx, radius, clock: options.time, chain: 3, held: true, alpha: options.heat }, centerX, centerY, style);
      if (options.ring > 0) {
        previewCtx.save();
        previewCtx.globalAlpha = (1 - options.ring) * 0.75;
        previewCtx.strokeStyle = style.colors[1];
        previewCtx.lineWidth = 3 - options.ring * 1.5;
        previewCtx.beginPath();
        previewCtx.arc(centerX, centerY, radius * (1.05 + options.ring * 0.8), 0, Math.PI * 2);
        previewCtx.stroke();
        previewCtx.restore();
      }
    }

    const preset = BALL_EFFECT_PRESETS[skin.effectPreset] || BALL_EFFECT_PRESETS.classic;
    const heatColors = getFlameStyle(preset, darkMode).colors;
    previewCtx.save();
    previewCtx.translate(centerX, centerY);
    BallArt.drawBall(previewCtx, skin.art, {
      radius,
      rotation: options.rotation,
      time: options.time,
      heat: options.heat,
      heatColors,
      flash: options.flash,
      darkBackground: darkMode,
      look: { x: 0.55, y: -0.2 }
    });
    previewCtx.restore();
  }

  function getBallPreviewFrame(now) {
    if (reduceMotion) return { rotation: -0.35, time: 2, heat: 1, flash: 0, ring: 0 };
    const elapsed = Math.max(0, (now - ballPreviewAnimation.startedAt) / 1000);
    const cycle = elapsed % 4;
    const ignitionAge = cycle - 1.6;
    return {
      rotation: -0.35 + elapsed * 0.8,
      time: elapsed,
      heat: ignitionAge <= 0 ? 0 : clamp(ignitionAge / 0.12, 0, 1),
      flash: ignitionAge > 0 && ignitionAge < 0.18 ? 1 - ignitionAge / 0.18 : 0,
      ring: ignitionAge > 0 && ignitionAge < 0.42 ? ignitionAge / 0.42 : 0
    };
  }

  // The customize preview and an open shop dialog's ball share one animation clock.
  function drawAnimatedBallPreview(now) {
    if (state !== "customize") return;
    const frame = getBallPreviewFrame(now);
    const canvasElement = customizeBallPreview?.querySelector("canvas.ballPreviewCanvas.large");
    if (canvasElement) drawBallPreviewCanvas(canvasElement, getSelectedBallSkin(), frame);
    if (shopDialog.ballSkin && shopDialog.canvas) drawBallPreviewCanvas(shopDialog.canvas, shopDialog.ballSkin, frame);
  }

  function stopBallPreviewAnimation() {
    if (ballPreviewAnimation.frameId !== null) window.cancelAnimationFrame(ballPreviewAnimation.frameId);
    ballPreviewAnimation.frameId = null;
  }

  function startBallPreviewAnimation() {
    stopBallPreviewAnimation();
    if (state !== "customize" || document.visibilityState === "hidden") return;
    ballPreviewAnimation.startedAt = performance.now();
    if (reduceMotion) {
      drawAnimatedBallPreview(ballPreviewAnimation.startedAt);
      return;
    }
    const frame = (now) => {
      if (state !== "customize" || document.visibilityState === "hidden") {
        stopBallPreviewAnimation();
        return;
      }
      drawAnimatedBallPreview(now);
      ballPreviewAnimation.frameId = window.requestAnimationFrame(frame);
    };
    ballPreviewAnimation.frameId = window.requestAnimationFrame(frame);
  }

  function renderBallCustomizer() {
    if (!customizeBallPreview || !customizeBallName || !ballSkinList) return;
    syncEconomyBalances();
    const selectedSkin = getSelectedBallSkin();
    customizeBallPreview.replaceChildren(createBallPreviewElement("large"));
    customizeBallName.textContent = t(selectedSkin.nameKey);
    ballSkinList.replaceChildren(
      createSkinSectionLabel(t("shopBalls")),
      ...BALL_SKIN_DISPLAY_ORDER.filter((id) => BALL_SKINS[id]).map(createBallSkinOption),
      createSkinSectionLabel(t("challengeBalls"), t("challengeBallsHint")),
      ...CHALLENGE_SKIN_ORDER.filter((id) => BALL_SKINS[id]).map(createBallSkinOption)
    );
    // The large canvas was just replaced; without a loop (reduced motion) nothing else draws it.
    if (state === "customize") drawAnimatedBallPreview(performance.now());
  }

  function createSkinSectionLabel(title, hint) {
    const label = document.createElement("div");
    label.className = "ballSkinSection";
    // Decorative inside the listbox; every option's own label already names its section's rule.
    label.setAttribute("aria-hidden", "true");
    const heading = document.createElement("strong");
    heading.textContent = title;
    label.appendChild(heading);
    if (hint) {
      const note = document.createElement("small");
      note.textContent = hint;
      label.appendChild(note);
    }
    return label;
  }

  function createChallengeProgress(challenge, customValue) {
    const raw = customValue === undefined ? getBallChallengeProgress(challenge) : customValue;
    const value = Math.min(raw, challenge.target);
    const progress = document.createElement("span");
    progress.className = "challengeProgress";
    progress.style.setProperty("--progress", String(value / challenge.target));
    const bar = document.createElement("span");
    bar.className = "challengeProgressBar";
    bar.setAttribute("aria-hidden", "true");
    const count = document.createElement("span");
    count.className = "challengeProgressCount";
    count.textContent = value + " / " + challenge.target;
    progress.append(bar, count);
    return progress;
  }

  function createBallSkinOption(skinId) {
    const skin = BALL_SKINS[skinId];
    const challenge = BALL_CHALLENGES[skinId];
    const option = document.createElement("button");
    const isSelected = skin.id === selectedBallSkinId;
    const isOwned = ownedBallSkins.has(skin.id);
    const lockedChallenge = Boolean(challenge) && !isOwned;
    let stateLabel = getCosmeticStateLabel(isSelected, isOwned, ECONOMY_PRICES.ball[skin.id] ?? 0);
    if (lockedChallenge) stateLabel = t(challenge.descriptionKey);
    option.type = "button";
    option.className = "ballSkinOption" + (isOwned ? "" : " locked") + (challenge ? " challenge" : " tileOption");
    option.dataset.skinId = skin.id;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(isSelected));
    const progressLabel = lockedChallenge
      ? ", " + t("challengeProgress") + " " + Math.min(getBallChallengeProgress(challenge), challenge.target) + " / " + challenge.target
      : "";
    option.setAttribute("aria-label", t(skin.nameKey) + ", " + stateLabel + progressLabel);
    option.appendChild(createBallPreviewElement(challenge ? "" : "tile", skin));

    const copy = document.createElement("span");
    copy.className = "optionCopy";
    const name = document.createElement("strong");
    const description = document.createElement("small");
    name.textContent = t(skin.nameKey);
    if (isOwned && achievementState.newBallIds.includes(skin.id)) {
      const badge = document.createElement("span");
      badge.className = "newBadge";
      badge.textContent = t("newBadge");
      name.appendChild(badge);
    }
    if (!isOwned && !challenge) {
      description.className = "priceTag";
      const coinIcon = document.createElement("span");
      coinIcon.className = "coinIcon";
      coinIcon.setAttribute("aria-hidden", "true");
      description.append(coinIcon, document.createTextNode(String(ECONOMY_PRICES.ball[skin.id] ?? 0)));
    } else {
      description.textContent = stateLabel;
    }
    copy.append(name, description);
    if (lockedChallenge) copy.appendChild(createChallengeProgress(challenge));
    option.appendChild(copy);

    const check = document.createElement("span");
    check.className = "ballSkinCheck" + (isOwned ? "" : " locked");
    check.setAttribute("aria-hidden", "true");
    check.textContent = isSelected ? "✓" : "";
    option.appendChild(check);
    option.addEventListener("click", () => selectBallSkin(skin.id));
    return option;
  }

  function createThemeSwatch(theme, extraClass) {
    const swatch = document.createElement("span");
    swatch.className = "themeSwatch" + (extraClass ? " " + extraClass : "");
    swatch.setAttribute("aria-hidden", "true");
    applyThemeSwatchColors(swatch, theme);
    if (ThemeArt) {
      swatch.classList.add("hasArt");
      const preview = document.createElement("canvas");
      preview.dataset.themePreview = theme.id;
      swatch.appendChild(preview);
    }
    return swatch;
  }

  // Theme previews need their laid-out size, so they are painted after insertion.
  function paintThemePreviews(root) {
    if (!ThemeArt || !root || typeof root.querySelectorAll !== "function") return;
    for (const preview of root.querySelectorAll("canvas[data-theme-preview]")) {
      drawThemePreviewCanvas(preview, preview.dataset.themePreview);
    }
  }

  function applyThemeSwatchColors(swatch, theme) {
    const colors = darkMode ? theme.colors.dark : theme.colors.light;
    swatch.style.setProperty("--theme-bg-top", colors.backgroundTop);
    swatch.style.setProperty("--theme-bg-bottom", colors.backgroundBottom);
    swatch.style.setProperty("--theme-rim", colors.rim);
    swatch.style.setProperty("--theme-wall", colors.wallEdge);
  }

  function renderThemeCustomizer() {
    if (!themeList) return;
    syncEconomyBalances();
    themeList.replaceChildren();

    for (const themeId of THEME_DISPLAY_ORDER) {
      const theme = THEMES[themeId];
      if (!theme) continue;
      const option = document.createElement("button");
      const isSelected = theme.id === selectedThemeId;
      const isOwned = ownedThemes.has(theme.id);
      const price = ECONOMY_PRICES.theme[theme.id] ?? 0;
      const stateLabel = isSelected ? t("selectedTheme") : getCosmeticStateLabel(false, isOwned, price);
      option.type = "button";
      option.className = "themeOption" + (isOwned ? "" : " locked");
      option.dataset.themeId = theme.id;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(isSelected));
      option.setAttribute("aria-label", t(theme.nameKey) + ", " + stateLabel);

      const copy = document.createElement("span");
      copy.className = "optionCopy";
      const name = document.createElement("strong");
      const description = document.createElement("small");
      name.textContent = t(theme.nameKey);
      if (!isOwned) {
        description.className = "priceTag";
        const coinIcon = document.createElement("span");
        coinIcon.className = "coinIcon";
        coinIcon.setAttribute("aria-hidden", "true");
        description.append(coinIcon, document.createTextNode(String(price)));
      } else {
        description.textContent = stateLabel;
      }
      copy.append(name, description);

      const check = document.createElement("span");
      check.className = "ballSkinCheck" + (isOwned ? "" : " locked");
      check.setAttribute("aria-hidden", "true");
      check.textContent = isSelected ? "✓" : "";
      option.append(createThemeSwatch(theme), copy, check);
      option.addEventListener("click", () => selectTheme(theme.id));
      themeList.appendChild(option);
    }
    paintThemePreviews(themeList);
  }

  // One modal for buying (ball or theme) and for reading a challenge ball's task.
  function openShopDialog(options) {
    if (!shopDialogOverlay) return;
    shopDialog.open = true;
    shopDialog.onConfirm = options.onConfirm || null;
    shopDialog.returnFocus = options.returnFocus || null;
    for (const overlay of [customizeOverlay, themeOverlay, missionsOverlay]) if (overlay) overlay.inert = true;
    shopDialog.ballSkin = options.ballSkin || null;
    shopDialog.canvas = null;
    if (options.ballSkin) {
      const canvasElement = document.createElement("canvas");
      canvasElement.className = "ballPreviewCanvas large shopDialogBall";
      canvasElement.setAttribute("aria-hidden", "true");
      shopDialog.canvas = canvasElement;
      shopDialogPreview.replaceChildren(canvasElement);
    } else {
      shopDialogPreview.replaceChildren(createThemeSwatch(options.theme, "large"));
      paintThemePreviews(shopDialogPreview);
    }
    shopDialogTitle.textContent = options.title;
    shopDialogText.textContent = options.text;
    shopDialogDetail.textContent = options.detail || "";
    shopDialogDetail.hidden = !options.detail;
    if (options.challenge) shopDialogProgress.replaceChildren(createChallengeProgress(options.challenge));
    else shopDialogProgress.replaceChildren();
    shopDialogProgress.hidden = !options.challenge;
    shopDialogCancelButton.hidden = !options.onConfirm;
    shopDialogConfirmButton.textContent = options.confirmLabel || t("ok");
    shopDialogOverlay.inert = false;
    shopDialogOverlay.setAttribute("aria-hidden", "false");
    shopDialogOverlay.classList.add("active");
    (options.onConfirm ? shopDialogCancelButton : shopDialogConfirmButton).focus({ preventScroll: true });
    if (shopDialog.ballSkin) drawAnimatedBallPreview(performance.now());
  }

  function closeShopDialog() {
    if (!shopDialog.open) return;
    shopDialog.open = false;
    shopDialog.onConfirm = null;
    shopDialog.ballSkin = null;
    shopDialog.canvas = null;
    for (const overlay of [customizeOverlay, themeOverlay, missionsOverlay]) if (overlay) overlay.inert = false;
    if (!shopDialogOverlay) return;
    shopDialogOverlay.classList.remove("active");
    shopDialogOverlay.setAttribute("aria-hidden", "true");
    shopDialogOverlay.inert = true;
  }

  // Lists are rebuilt after a purchase, so focus goes back to the row by id, not by element.
  // The same ball can be listed in the shop and in the missions tab; look in the open sheet.
  function getActiveSheet() {
    if (state === "missions") return missionsOverlay;
    if (state === "theme") return themeOverlay;
    if (state === "customize") return customizeOverlay;
    return document;
  }

  function restoreShopFocus(selector) {
    if (!selector) return;
    const target = (getActiveSheet() || document).querySelector(selector);
    if (target) target.focus({ preventScroll: true });
  }

  function confirmShopDialog() {
    const action = shopDialog.onConfirm;
    const returnFocus = shopDialog.returnFocus;
    closeShopDialog();
    ensureAudio();
    if (action) action();
    else playGameSound("button");
    restoreShopFocus(returnFocus);
  }

  function cancelShopDialog() {
    const returnFocus = shopDialog.returnFocus;
    closeShopDialog();
    ensureAudio();
    playGameSound("button");
    restoreShopFocus(returnFocus);
  }

  function formatPurchaseCopy(price) {
    return {
      text: t("confirmPurchase").replace("{price}", String(price)),
      detail: t("balanceAfterPurchase").replace("{coins}", String(normalizeCoins(coins) - price))
    };
  }

  function selectBallSkin(skinId) {
    const skin = BALL_SKINS[skinId];
    if (!skin) return;
    ensureAudio();
    playGameSound("button");
    if (ownedBallSkins.has(skinId)) {
      applyBallSkin(skinId, false);
      return;
    }
    const challenge = BALL_CHALLENGES[skinId];
    if (challenge) {
      openShopDialog({ ballSkin: skin, title: t(skin.nameKey), text: t(challenge.descriptionKey), challenge, returnFocus: `[data-skin-id="${skinId}"]` });
      return;
    }
    const price = ECONOMY_PRICES.ball[skinId] ?? 0;
    if (coins < price) {
      showEconomyStatus("ball", t("insufficientCoins") + " · " + price + " " + t("coins"));
      return;
    }
    openShopDialog({
      ballSkin: skin,
      title: t(skin.nameKey),
      ...formatPurchaseCopy(price),
      confirmLabel: t("buy"),
      onConfirm: () => buyBallSkin(skinId),
      returnFocus: `[data-skin-id="${skinId}"]`
    });
  }

  function buyBallSkin(skinId) {
    const price = ECONOMY_PRICES.ball[skinId];
    if (!BALL_SKINS[skinId] || BALL_CHALLENGES[skinId] || ownedBallSkins.has(skinId)) return false;
    if (!Number.isSafeInteger(price) || coins < price) return false;
    coins -= price;
    ownedBallSkins.add(skinId);
    evaluateAchievements({ metrics: ["ballCollection", "shopBallCollection"], persist: false });
    applyBallSkin(skinId, true);
    showEconomyStatus("ball", t("purchased") + ": " + t(BALL_SKINS[skinId].nameKey));
    playGameSound("purchase");
    return true;
  }

  function applyBallSkin(skinId, saveNow) {
    selectedBallSkinId = skinId;
    ballEffects.selectedPreset = BALL_SKINS[skinId].effectPreset;
    writeBallSkinPreference(skinId, saveNow);
    syncEconomyBalances();
    renderBallCustomizer();
    if (state === "missions") renderMissions();
    syncMenuHome();
  }

  function selectTheme(themeId) {
    const theme = THEMES[themeId];
    if (!theme) return;
    ensureAudio();
    playGameSound("button");
    if (ownedThemes.has(themeId)) {
      applyTheme(themeId, false);
      return;
    }
    const price = ECONOMY_PRICES.theme[themeId] ?? 0;
    if (coins < price) {
      showEconomyStatus("theme", t("insufficientCoins") + " · " + price + " " + t("coins"));
      return;
    }
    openShopDialog({
      theme,
      title: t(theme.nameKey),
      ...formatPurchaseCopy(price),
      confirmLabel: t("buy"),
      onConfirm: () => buyTheme(themeId),
      returnFocus: `[data-theme-id="${themeId}"]`
    });
  }

  function buyTheme(themeId) {
    const price = ECONOMY_PRICES.theme[themeId];
    if (!THEMES[themeId] || ownedThemes.has(themeId)) return false;
    if (!Number.isSafeInteger(price) || coins < price) return false;
    coins -= price;
    ownedThemes.add(themeId);
    evaluateAchievements({ metrics: ["themeCollection"], persist: false });
    applyTheme(themeId, true);
    showEconomyStatus("theme", t("purchased") + ": " + t(THEMES[themeId].nameKey));
    playGameSound("purchase");
    return true;
  }

  function applyTheme(themeId, saveNow) {
    selectedThemeId = themeId;
    writeThemePreference(themeId, saveNow);
    syncEconomyBalances();
    renderThemeCustomizer();
    syncMenuHome();
    draw();
  }

  function toggleLanguage() {
    if (!gameBooted) return;
    ensureAudio();
    language = language === "tr" ? "en" : "tr";
    applyLanguage();
    playGameSound("button");
  }

  function toggleDarkMode() {
    if (!gameBooted) return;
    ensureAudio();
    darkMode = !darkMode;
    applyDarkMode();
    playGameSound("button");
  }

  function toggleSound() {
    if (!gameBooted) return;
    muted = !muted;
    writeBooleanPreference(MUTED_KEY, muted);
    syncControlLabels();
    if (!muted) {
      ensureAudio();
      playGameSound("button");
    }
  }

  function toggleHaptics() {
    if (!gameBooted) return;
    hapticsEnabled = !hapticsEnabled;
    writeBooleanPreference(HAPTICS_KEY, hapticsEnabled);
    syncControlLabels();
    triggerHaptic(20);
    playGameSound("button");
  }

  function syncControlLabels() {
    const soundEnabled = !muted;
    const stateLabel = (enabled) => (enabled ? t("on") : t("off"));
    settingsSoundButton.setAttribute("aria-pressed", String(soundEnabled));
    settingsSoundButton.setAttribute("aria-label", t("sound") + ": " + stateLabel(soundEnabled));
    settingsHapticsButton.hidden = !canVibrate;
    settingsHapticsButton.setAttribute("aria-pressed", String(hapticsEnabled));
    settingsHapticsButton.setAttribute("aria-label", t("haptics") + ": " + stateLabel(hapticsEnabled));
    settingsDarkModeButton.setAttribute("aria-pressed", String(darkMode));
    settingsDarkModeButton.setAttribute("aria-label", t("darkMode") + ": " + stateLabel(darkMode));
    const languageName = language === "tr" ? t("turkish") : t("english");
    if (languageValue) languageValue.textContent = languageName;
    languageButton.setAttribute("aria-label", t("language") + ": " + languageName);
    menuButton.setAttribute("aria-label", t("menu"));
    if (replayTutorialButton) {
      const done = replayTutorialButton.classList.contains("done");
      const value = replayTutorialButton.querySelector(".settingValue");
      if (value) value.textContent = done ? "✓" : t("replay");
      replayTutorialButton.setAttribute("aria-label", t("tutorialReplay") + (done ? ": " + t("tutorialReady") : ""));
    }
  }

  // Main menu tiles show the player's own ball and theme.
  function syncMenuHome() {
    if (menuBallIcon) drawBallPreviewCanvas(menuBallIcon, getSelectedBallSkin(), { rotation: -0.35, time: 0, heat: 0, flash: 0 });
    if (menuThemeIcon) {
      menuThemeIcon.replaceChildren(createThemeSwatch(THEMES[selectedThemeId] || THEMES.gym, "tileSwatch"));
      paintThemePreviews(menuThemeIcon);
    }
  }

  function syncUiState() {
    const hideHud = state === "menu" || state === "profile" || state === "achievements" || state === "settings" || state === "customize" || state === "theme" || state === "missions" || state === "pause-settings";
    hud.classList.toggle("hidden", hideHud);
    hud.classList.toggle("pauseActive", state === "paused");
    syncControlLabels();
  }

  function openMenuPanel(panelName) {
    if (!gameBooted) return;
    ensureAudio();
    playGameSound("button");
    setGameState(panelName);
    settingsOrigin = "menu";
    if (panelName === "customize") {
      renderBallCustomizer();
    } else if (panelName === "theme") {
      renderThemeCustomizer();
    } else if (panelName === "profile") {
      renderProfile();
    } else if (panelName === "missions") {
      renderMissions();
    }
    mainMenuOverlay.classList.remove("active");
    profileOverlay.classList.toggle("active", panelName === "profile");
    achievementsOverlay?.classList.remove("active");
    settingsOverlay.classList.toggle("active", panelName === "settings");
    customizeOverlay.classList.toggle("active", panelName === "customize");
    themeOverlay?.classList.toggle("active", panelName === "theme");
    missionsOverlay?.classList.toggle("active", panelName === "missions");
    syncUiState();
    if (panelName === "customize") startBallPreviewAnimation();
  }

  function openAchievements() {
    if (!gameBooted || state !== "profile") return;
    ensureAudio();
    playGameSound("button");
    setGameState("achievements");
    profileOverlay.classList.remove("active");
    achievementsOverlay.classList.add("active");
    renderAchievements();
    syncUiState();
  }

  function closeAchievements() {
    if (!gameBooted || state !== "achievements") return;
    ensureAudio();
    playGameSound("button");
    setGameState("profile");
    achievementsOverlay.classList.remove("active");
    profileOverlay.classList.add("active");
    renderProfile();
    syncUiState();
  }

  function returnToMainMenu() {
    if (!gameBooted) return;
    ensureAudio();
    playGameSound("button");
    setGameState("menu");
    profileOverlay.classList.remove("active");
    achievementsOverlay?.classList.remove("active");
    settingsOverlay.classList.remove("active");
    customizeOverlay.classList.remove("active");
    themeOverlay?.classList.remove("active");
    missionsOverlay?.classList.remove("active");
    mainMenuOverlay.classList.add("active");
    syncMenuHome();
    syncUiState();
  }

  function pauseGameplay() {
    if (!gameBooted || userPaused || state !== "playing") return;
    ensureAudio();
    playGameSound("button");
    userPaused = true;
    settingsOrigin = "pause";
    const activeTimeChanged = setGameState("paused");
    drag = null;
    if (activePointer !== null && canvas.hasPointerCapture(activePointer)) {
      canvas.releasePointerCapture(activePointer);
    }
    activePointer = null;
    stopAnimationLoop();
    pauseTipTimer();
    if (audioContext && audioContext.state === "running") audioContext.suspend().catch(() => {});
    pauseOverlay.classList.add("active");
    settingsOverlay.classList.remove("active");
    syncUiState();
    if (activeTimeChanged) requestSave(false);
  }

  function resumePausedGame() {
    if (!gameBooted || !userPaused || state !== "paused") return;
    userPaused = false;
    setGameState("playing");
    pauseOverlay.classList.remove("active");
    syncUiState();
    resumeTipTimer();
    if (!muted && audioContext) audioContext.resume().catch(() => {});
    restartAnimationLoop();
  }

  function handlePauseOverlayClick(event) {
    if (event.target !== pauseOverlay) return;
    resumePausedGame();
  }

  function openPauseSettings() {
    if (!userPaused || state !== "paused") return;
    setGameState("pause-settings");
    settingsOrigin = "pause";
    pauseOverlay.classList.remove("active");
    settingsOverlay.classList.add("active");
    syncUiState();
  }

  function closeSettings() {
    if (!gameBooted) return;
    if (settingsOrigin === "pause" && userPaused) {
      setGameState("paused");
      settingsOverlay.classList.remove("active");
      pauseOverlay.classList.add("active");
      syncUiState();
      return;
    }
    returnToMainMenu();
  }

  function exitGameplayToMainMenu() {
    if (!gameBooted) return;
    ensureAudio();
    playGameSound("button");
    if (stopActivePlayClock()) markSaveDirty();
    userPaused = false;
    pauseOverlay.classList.remove("active");
    achievementsOverlay?.classList.remove("active");
    settingsOverlay.classList.remove("active");
    themeOverlay?.classList.remove("active");
    resetGame(true);
    void flushSave();
    restartAnimationLoop();
  }

  function canRunAnimationLoop() {
    return gameBooted && !userPaused;
  }

  function stopAnimationLoop() {
    animationLoopGeneration += 1;
    if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    lastTime = 0;
    resetPhysicsClock();
  }

  function restartAnimationLoop() {
    stopAnimationLoop();
    if (!canRunAnimationLoop()) return;

    const generation = animationLoopGeneration;
    animationFrameId = window.requestAnimationFrame((now) => {
      if (generation !== animationLoopGeneration) return;
      if (!canRunAnimationLoop()) {
        stopAnimationLoop();
        return;
      }

      // Align with the browser's current paint cadence before physics begins.
      lastTime = now;
      animationFrameId = window.requestAnimationFrame((nextNow) => loop(nextNow, generation, true));
    });
  }

  function playTone(freq, duration, type, gain, delay, endFreq) {
    if (muted || userPaused || !audioContext) return;
    const now = audioContext.currentTime + (delay || 0);
    const osc = audioContext.createOscillator();
    const amp = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), now + duration);
    amp.gain.setValueAtTime(0, now);
    amp.gain.linearRampToValueAtTime(gain, now + 0.01);
    amp.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(amp);
    amp.connect(getAudioOutput());
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  // Mallet in the current theme's voice; gym is the original marimba (sine body, 4th partial, click).
  function playMallet(freq, delay, gain) {
    const voice = getThemeSound();
    playTone(freq, voice.decay, voice.wave, gain * voice.waveGain, delay, voice.bend ? freq * voice.bend : 0);
    if (voice.partial) playTone(freq * voice.partial, 0.06, "sine", gain * 0.3, delay, 0);
    playNoise(0.015, gain * 0.5 * voice.click, "lowpass", 2500, 0, 0.7, delay);
  }

  // Street-court chain net: a few short bright metal ticks with a thin high noise rattle.
  function playChainJingle(gain, delay) {
    [2340, 3120, 2780].forEach((freq, i) => playTone(freq, 0.05, "sine", gain * (1 - i * 0.2), delay + i * 0.028, 0));
    playNoise(0.09, gain * 0.7, "highpass", 4200, 0, 0.7, delay);
  }

  function playNoise(duration, gain, filterType, freq, endFreq, q, delay) {
    if (muted || userPaused || !audioContext) return;
    if (!noiseBuffer) {
      noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
      const samples = noiseBuffer.getChannelData(0);
      for (let i = 0; i < samples.length; i += 1) samples[i] = Math.random() * 2 - 1;
    }
    const now = audioContext.currentTime + (delay || 0);
    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const amp = audioContext.createGain();
    source.buffer = noiseBuffer;
    filter.type = filterType;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(freq, now);
    if (endFreq) filter.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
    amp.gain.setValueAtTime(0, now);
    amp.gain.linearRampToValueAtTime(gain, now + 0.006);
    amp.gain.exponentialRampToValueAtTime(0.001, now + duration);
    source.connect(filter);
    filter.connect(amp);
    amp.connect(getAudioOutput());
    source.start(now, Math.random() * 0.6);
    source.stop(now + duration + 0.02);
  }

  // Shared output with a gentle compressor so stacked impact sounds don't clip.
  function getAudioOutput() {
    if (!audioOutput) {
      const compressor = audioContext.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.knee.value = 12;
      compressor.ratio.value = 4;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.12;
      compressor.connect(audioContext.destination);
      audioOutput = audioContext.createGain();
      audioOutput.connect(compressor);
    }
    return audioOutput;
  }

  function loop(now, generation, firstPhysicsFrame) {
    if (generation !== animationLoopGeneration) return;
    if (!canRunAnimationLoop()) {
      stopAnimationLoop();
      return;
    }
    const frameSeconds = (now - lastTime) / 1000 || 0;
    const dt = firstPhysicsFrame || frameSeconds > STALL_FRAME_DT ? 0 : Math.max(0, Math.min(MAX_FRAME_DT, frameSeconds));
    lastTime = now;
    const cpuStart = perfStats ? performance.now() : 0;
    // Hit-stop only delays fixed steps; the steps themselves are unchanged, so flight stays deterministic.
    const frozen = Math.min(hitStopTimer, dt);
    hitStopTimer -= frozen;
    const advanced = Physics.advanceFixedSteps(physicsAccumulator, dt - frozen, MAX_FRAME_DT, updateFixedStep);
    physicsAccumulator = advanced.accumulator;
    renderAlpha = advanced.alpha;
    updatePresentation(dt);
    draw();
    if (perfStats) recordPerfFrame(now, frameSeconds * 1000, performance.now() - cpuStart);
    if (generation !== animationLoopGeneration || !canRunAnimationLoop()) return;
    animationFrameId = window.requestAnimationFrame((nextNow) => loop(nextNow, generation, false));
  }

  function recordPerfFrame(now, frameMs, cpuMs) {
    const preset = BALL_EFFECT_PRESETS[ballEffects.selectedPreset];
    const flameOn = state === "playing" && !ball.held && !ball.settle && perfectChain >= (preset?.comboThreshold ?? 2);
    const bucket = flameOn ? perfStats.fire : perfStats.normal;
    if (frameMs > 0 && frameMs < STALL_FRAME_DT * 1000) {
      bucket.frames += 1;
      if (frameMs > 25) bucket.slow += 1;
      bucket.worstMs = Math.max(bucket.worstMs, frameMs);
      perfStats.worstMs = Math.max(perfStats.worstMs, frameMs);
    }
    perfStats.frames += 1;
    perfStats.cpuMs += cpuMs;
    perfStats.cpuMaxMs = Math.max(perfStats.cpuMaxMs, cpuMs);
    if (now - perfStats.windowStart >= 1000) {
      const seconds = (now - perfStats.windowStart) / 1000;
      perfStats.line = Math.round(perfStats.frames / seconds) + " fps  worst " + perfStats.worstMs.toFixed(0)
        + " ms  cpu " + (perfStats.cpuMs / perfStats.frames).toFixed(1) + "/" + perfStats.cpuMaxMs.toFixed(1) + " ms";
      perfStats.windowStart = now;
      perfStats.frames = 0;
      perfStats.worstMs = 0;
      perfStats.cpuMs = 0;
      perfStats.cpuMaxMs = 0;
    }
    const describe = (b) => b.frames + " kare, " + b.slow + " yavaş, en kötü " + b.worstMs.toFixed(0) + " ms";
    ctx.save();
    ctx.font = "600 11px ui-monospace, monospace";
    ctx.fillStyle = "rgba(0, 0, 0, 0.62)";
    ctx.fillRect(4, viewH - 58, 270, 54);
    ctx.fillStyle = "#fff";
    ctx.fillText(perfStats.line + "  p" + particles.length + "  dpr" + dpr, 10, viewH - 42);
    ctx.fillText("alev: " + describe(perfStats.fire), 10, viewH - 26);
    ctx.fillText("normal: " + describe(perfStats.normal), 10, viewH - 10);
    ctx.restore();
  }

  function bootGame() {
    resize();
    const localRecord = readLocalSaveRecord();
    const migrated = migrateSaveData(localRecord.save, true);
    applyMigratedSave(migrated);
    const shouldPersistMigratedSave = localRecord.shouldPersist || migrated.needsMigration;
    applyLanguage();
    applyDarkMode();
    resetGame(true);
    syncMenuHome();
    initTutorial();
    persistenceReady = true;
    gameBooted = true;
    const bootstrapChallengesChanged = evaluateBallChallenges(true);
    const bootstrapAchievementsChanged = evaluateAchievements({
      metrics: ["highScore", "ballCollection", "shopBallCollection", "themeCollection"],
      announce: false,
      persist: false
    }) || bootstrapChallengesChanged;
    // Playtest aid: ?devCoins=N tops up coins on a local dev server only; ignored on the live site.
    const devCoins = Number(new URLSearchParams(window.location.search).get("devCoins"));
    if (Number.isSafeInteger(devCoins) && devCoins > 0 && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) {
      coins = Math.max(normalizeCoins(coins), devCoins);
      syncEconomyBalances();
      requestSave(true);
    }
    const dailyLoginChanged = recordDailyLogin();
    const missionsRolled = ensureDailyMissions();
    syncMissionBadges();
    window.setInterval(tickMissionClock, 60000);
    if (missionsRolled && !dailyLoginChanged) requestSave(true);
    syncAchievementUi();
    if (shouldPersistMigratedSave || (bootstrapAchievementsChanged && !dailyLoginChanged)) requestSave(true);
    restartAnimationLoop();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("orientationchange", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") stopBallPreviewAnimation();
    else if (state === "customize") startBallPreviewAnimation();
  });
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);

  startButton.addEventListener("click", startGame);
  profileButton.addEventListener("click", () => openMenuPanel("profile"));
  customizeButton.addEventListener("click", () => openMenuPanel("customize"));
  if (customizeThemeButton) customizeThemeButton.addEventListener("click", () => openMenuPanel("theme"));
  settingsButton.addEventListener("click", () => openMenuPanel("settings"));
  settingsSoundButton.addEventListener("click", toggleSound);
  settingsHapticsButton.addEventListener("click", toggleHaptics);
  settingsDarkModeButton.addEventListener("click", toggleDarkMode);
  languageButton.addEventListener("click", toggleLanguage);
  if (replayTutorialButton) replayTutorialButton.addEventListener("click", replayTutorial);
  if (missionsButton) missionsButton.addEventListener("click", () => openMenuPanel("missions"));
  if (missionsBackButton) missionsBackButton.addEventListener("click", returnToMainMenu);
  if (missionsDailyTab) missionsDailyTab.addEventListener("click", () => selectMissionsTab("daily"));
  if (missionsBallsTab) missionsBallsTab.addEventListener("click", () => selectMissionsTab("balls"));
  settingsBackButton.addEventListener("click", closeSettings);
  profileBackButton.addEventListener("click", returnToMainMenu);
  profileAchievementsButton.addEventListener("click", openAchievements);
  achievementsBackButton.addEventListener("click", closeAchievements);
  achievementClaimAllButton.addEventListener("click", claimAllAchievementRewards);
  customizeBackButton.addEventListener("click", returnToMainMenu);
  if (shopDialogOverlay) {
    shopDialogConfirmButton.addEventListener("click", confirmShopDialog);
    shopDialogCancelButton.addEventListener("click", cancelShopDialog);
    shopDialogOverlay.addEventListener("click", (event) => {
      if (event.target === shopDialogOverlay) cancelShopDialog();
    });
  }
  if (themeBackButton) themeBackButton.addEventListener("click", returnToMainMenu);
  menuButton.addEventListener("click", pauseGameplay);
  pauseContinueButton.addEventListener("click", resumePausedGame);
  pauseOverlay.addEventListener("click", handlePauseOverlayClick);
  pauseMainMenuButton.addEventListener("click", exitGameplayToMainMenu);
  pauseSettingsButton.addEventListener("click", openPauseSettings);
  gameOverMenuButton.addEventListener("click", exitGameplayToMainMenu);
  retryMenuButton.addEventListener("click", exitGameplayToMainMenu);
  restartButton.addEventListener("click", () => {
    if (!gameBooted) return;
    ensureAudio();
    resetGame(false);
    playGameSound("start");
  });
  retryButton.addEventListener("click", () => {
    if (!gameBooted) return;
    ensureAudio();
    retryShot();
    playGameSound("retry");
  });
  window.addEventListener("keydown", (event) => {
    if (!gameBooted) return;
    if (event.key === "Escape") {
      if (event.repeat) return;
      if (shopDialog.open) {
        event.preventDefault();
        cancelShopDialog();
        return;
      }
      if (state === "playing") {
        event.preventDefault();
        pauseGameplay();
        return;
      }
      if (state === "paused") {
        event.preventDefault();
        resumePausedGame();
        return;
      }
      if (state === "pause-settings" || state === "settings") {
        event.preventDefault();
        closeSettings();
        return;
      }
      if (state === "achievements") {
        event.preventDefault();
        closeAchievements();
        return;
      }
      if (state === "profile" || state === "customize" || state === "theme" || state === "missions") {
        event.preventDefault();
        returnToMainMenu();
        return;
      }
    }
    if (event.key === " " && state === "menu") startGame();
    if ((event.key === "r" || event.key === "R") && state === "gameover") {
      resetGame(false);
      playGameSound("start");
    }
    if ((event.key === "r" || event.key === "R") && state === "retry") {
      retryShot();
      playGameSound("retry");
    }
  });

  bootGame();
})();
