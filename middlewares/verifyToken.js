const appError = require("../utils/appError");
const requestStatus = require("../utils/requestStatus");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(appError.create(401, requestStatus.ERROR, "Token is required"));
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = decodedToken;
    next();
  } catch (err) {
    return next(appError.create(401, requestStatus.FAIL, "Invalid token"));
  }
};

module.exports = verifyToken;