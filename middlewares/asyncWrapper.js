const appError = require("../utils/appError");
const requestStatus = require("../utils/requestStatus");

module.exports = asyncWrapper = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) =>
      appError.create(500, requestStatus.ERROR, err)
    );
  };
};
