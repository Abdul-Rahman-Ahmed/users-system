const express = require("express");
const Roles = require("../utils/roles");
const {
  register,
  login,
  getUsers,
  confirmEmail,
} = require("../controllers/users.controller");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");
const { registerLimiter, loginLimiter } = require("../middlewares/rateLimiter");
const Router = express.Router();

Router.post("/register", registerLimiter, register);
Router.post("/login", loginLimiter, login);
Router.get("/", verifyToken, verifyRole(Roles.ADMIN), getUsers);
Router.get("/confirm/:token", confirmEmail);

module.exports = Router;
