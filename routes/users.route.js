const express = require("express");
const Roles = require("../utils/roles");
const {
  register,
  login,
  getUsers,
} = require("../controllers/users.controller");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");
const Router = express.Router();

Router.post("/register", register);
Router.post("/login", login);
Router.get("/", verifyToken, verifyRole(Roles.ADMIN), getUsers);

module.exports = Router;
