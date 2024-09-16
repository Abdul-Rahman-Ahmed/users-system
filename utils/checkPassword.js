const validator = require("validator");
const requestStatus = require("./requestStatus");
const appError = require("./appError");
const bcrypt = require("bcryptjs");

class checkPassword {
  constructor() {}
  isWeakPassword(password) {
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return true;
    } else {
      return false;
    }
  }

  async hash(password) {
    // hash password
    const hashPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUND) || 10
    );
    return hashPassword;
  }

  async compare(password, hashPassword) {
    const checkPassword = await bcrypt.compare(password, hashPassword);
    return checkPassword;
  }
}

module.exports = new checkPassword();
