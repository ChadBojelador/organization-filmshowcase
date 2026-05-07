const express = require("express");
const { signIn, signUp } = require("../controllers/authController");
const { validateRequest } = require("../middlewares/validateRequest");
const { signInSchema, signUpSchema } = require("../validators/authValidators");
const { asyncHandler } = require("../utils/asyncHandler");

const authRouter = express.Router();

authRouter.post("/sign-in", validateRequest(signInSchema), asyncHandler(signIn));
authRouter.post("/sign-up", validateRequest(signUpSchema), asyncHandler(signUp));

module.exports = authRouter;
