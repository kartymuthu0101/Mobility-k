const express = require("express");
const userRouter = require("../modules/User/User.route.js");
const RoleRouter = require("../modules/Roles/Role.route.js");
const userV1Router = express.Router();

userV1Router.use("/user", userRouter)
userV1Router.use("/role", RoleRouter);
module.exports = userV1Router;