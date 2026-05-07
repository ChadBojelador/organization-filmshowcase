const express = require("express");
const { addFilm, getFilms, deleteFilm, updateFilm, recordView } = require("../controllers/filmController");
const { validateRequest } = require("../middlewares/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const { addFilmSchema, updateFilmSchema } = require("../validators/filmValidators");

const filmRouter = express.Router();

filmRouter.get("/films", asyncHandler(getFilms));

filmRouter.post("/addFilm", validateRequest(addFilmSchema), asyncHandler(addFilm));

filmRouter.put("/films/:id", validateRequest(updateFilmSchema), asyncHandler(updateFilm));

filmRouter.delete("/films/:id", asyncHandler(deleteFilm));

// Increment view count — no auth required, called when a film is opened
filmRouter.patch("/films/:id/view", asyncHandler(recordView));

module.exports = filmRouter;
