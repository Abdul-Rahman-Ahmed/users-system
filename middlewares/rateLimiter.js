const rateLimit = require("express-rate-limit");
const requestStatus = require("../utils/requestStatus");

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  handler: (req, res, next, options) => {
    const retryAfterSeconds = Math.ceil(options.windowMs / 1000);
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
  handler: (req, res, next, options) => {
    console.log(req.headers["retry-after"]);
    const retryAfterSeconds = Math.ceil(options.windowMs / 1000);
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
