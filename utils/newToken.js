const jwt = require("jsonwebtoken");

const newToken = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = newToken;
