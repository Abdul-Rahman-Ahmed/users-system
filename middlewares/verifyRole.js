const appError = require("../utils/appError");
const requestStatus = require("../utils/requestStatus");

const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!req.currentUser) {
      return next(
        appError.create(401, requestStatus.ERROR, "Authentication required")
      );
    }

    if (!roles.includes(req.currentUser.role)) {
      return next(
        appError.create(
          403,
          requestStatus.ERROR,
          `The User: '${req.currentUser.email}' is not allowed to perform this action`
        )
      );
    }

    next();
  };
};

module.exports = verifyRole;
