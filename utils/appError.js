class appError extends Error {
  constructor() {
    super();
  }
  create(codeStatus, errorStatus, message) {
    this.codeStatus = codeStatus;
    this.errorStatus = errorStatus;
    this.message = message;
    return this;
  }
}

module.exports = new appError();
