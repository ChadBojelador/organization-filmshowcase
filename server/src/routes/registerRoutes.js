// server/src/routes/registerRoutes.js
const express = require("express");
const { registerDirector } = require("../controllers/registerController");
const { validateRequest } = require("../middlewares/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const { registerDirectorSchema } = require("../validators/registerValidators");

const registerRouter = express.Router();

registerRouter.post(
  "/register",
  validateRequest(registerDirectorSchema),
  asyncHandler(registerDirector)
);

module.exports = registerRouter;
