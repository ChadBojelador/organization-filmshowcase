const express = require("express");
const { addFilm, getFilms, deleteFilm, updateFilm, recordView } = require("../controllers/filmController");
const { validateRequest } = require("../middlewares/validateRequest");
const { requireAuth } = require("../middlewares/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const { addFilmSchema, updateFilmSchema } = require("../validators/filmValidators");

const filmRouter = express.Router();

// Public — anyone can browse films
filmRouter.get("/films", asyncHandler(getFilms));

// Public — view count ping (no token needed, called when a film is opened)
filmRouter.patch("/films/:id/view", asyncHandler(recordView));

// Protected — only authenticated admins can write film data
filmRouter.post("/addFilm", requireAuth, validateRequest(addFilmSchema), asyncHandler(addFilm));
filmRouter.put("/films/:id", requireAuth, validateRequest(updateFilmSchema), asyncHandler(updateFilm));
filmRouter.delete("/films/:id", requireAuth, asyncHandler(deleteFilm));

module.exports = filmRouter;
