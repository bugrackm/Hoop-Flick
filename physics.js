(function () {
  "use strict";

  const FIXED_DT = 1 / 120;

  // pull is the clamped, curved vector returned by the game's getPullVector.
  function getLaunchVelocity(pull, params) {
    const boost = 1 + (params.maxPowerBoost - 1) * Math.pow(pull.ratio, 4);
    const impulse = params.launchPowerScale * boost;
    return {
      vx: pull.x * pull.power * impulse,
      vy: pull.y * pull.power * impulse
    };
  }

  // Pure: return a new flight state; never change body or params.
  function stepBallFlight(body, params, dt) {
    const drag = Math.pow(params.airDrag, dt * 60);
    let vx = body.vx * drag;
    const vy = (body.vy + params.gravity * dt) * drag;
    let x = body.x + vx * dt;
    const y = body.y + vy * dt;
    // Preserve the game's swept coin check before wall clamping.
    const preWallX = x;
    let wallHit = false;
    if (params.walls !== false) {
      if (x - params.ballRadius < params.wallInset) {
        x = params.wallInset + params.ballRadius;
        vx = Math.abs(vx) * params.wallRestitution;
        wallHit = true;
      } else if (x + params.ballRadius > params.worldWidth - params.wallInset) {
        x = params.worldWidth - params.wallInset - params.ballRadius;
        vx = -Math.abs(vx) * params.wallRestitution;
        wallHit = true;
      }
    }
    return { x, y, vx, vy, wallHit, preWallX };
  }

  // The callback owns simulation effects; this helper owns no clock/state.
  function advanceFixedSteps(accumulator, frameDt, maxFrameDt, stepFn) {
    const elapsed = Math.max(0, Math.min(maxFrameDt, frameDt));
    const total = accumulator + elapsed;
    // Tolerate rounding at exact step boundaries (e.g. 144 render frames).
    const steps = Math.floor((total + FIXED_DT * 1e-9) / FIXED_DT);
    for (let i = 0; i < steps; i += 1) stepFn(FIXED_DT);
    const remainder = Math.max(0, total - steps * FIXED_DT);
    return { accumulator: remainder, alpha: remainder / FIXED_DT, steps };
  }

  function predictTrajectory(start, velocity, params, options) {
    // afterStep lets the game mirror its own post-step constraints (it returns a body, never mutates).
    const { dotSteps, maxPoints = 15, afterStep = null } = options;
    let pointCount = options.pointCount;
    let body = { x: start.x, y: start.y, vx: velocity.vx, vy: velocity.vy };
    let bounceExtended = false;
    const points = [];
    const wallBounces = [];
    for (let i = 0; i < pointCount; i += 1) {
      let wallHit = false;
      for (let j = 1; j <= dotSteps; j += 1) {
        body = stepBallFlight(body, params, FIXED_DT);
        if (afterStep) body = afterStep(body, FIXED_DT);
        if (body.wallHit) {
          wallHit = true;
          wallBounces.push({ x: body.x, y: body.y, step: i * dotSteps + j });
        }
      }
      if (wallHit && !bounceExtended) {
        pointCount = Math.min(maxPoints, Math.max(pointCount, i + 4));
        bounceExtended = true;
      }
      points.push({ x: body.x, y: body.y, step: (i + 1) * dotSteps, wallHit, pointCount });
    }
    return { points, wallBounces };
  }

  globalThis.HoopFlickPhysics = Object.freeze({
    FIXED_DT,
    getLaunchVelocity,
    stepBallFlight,
    advanceFixedSteps,
    predictTrajectory
  });
})();
