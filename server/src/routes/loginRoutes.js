// server/src/routes/loginRoutes.js
const express = require("express");
const { login } = require("../controllers/loginController");
const { validateRequest } = require("../middlewares/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const { loginSchema } = require("../validators/loginValidators");

const loginRouter = express.Router();

loginRouter.post("/login", validateRequest(loginSchema), asyncHandler(login));

module.exports = loginRouter;
