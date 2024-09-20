const rateLimit = require("express-rate-limit");
const requestStatus = require("../utils/requestStatus");

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    const retryAfterSeconds = Math.ceil(
      (req.rateLimit.resetTime - Date.now()) / 1000
    );
    return res.status(429).json({
      status: requestStatus.FAIL,
      code: 429,
      message: `Too many registration attempts. Please try again after ${retryAfterSeconds} seconds (${Math.ceil(
        retryAfterSeconds / 60
      )} minutes).`,
    });
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    const retryAfterSeconds = Math.ceil(
      (req.rateLimit.resetTime - Date.now()) / 1000
    );
    return res.status(429).json({
      status: requestStatus.FAIL,
      code: 429,
      message: `Too many login attempts. Please try again after ${retryAfterSeconds} seconds (${Math.ceil(
        retryAfterSeconds / 60
      )} minutes).`,
    });
  },
});

module.exports = {
  registerLimiter,
  loginLimiter,
};
