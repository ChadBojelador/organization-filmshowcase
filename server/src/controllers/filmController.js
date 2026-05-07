const { createFilm, listFilms, removeFilm, editFilm, incrementViews } = require("../services/filmService");

async function getFilms(req, res) {
  const films = await listFilms();

  return res.status(200).json({
    films,
  });
}

async function addFilm(req, res) {
  const film = await createFilm(req.validatedBody);

  return res.status(201).json({
    success: true,
    film,
  });
}

async function deleteFilm(req, res) {
  await removeFilm(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Film deleted successfully.",
  });
}

async function updateFilm(req, res) {
  const film = await editFilm(req.params.id, req.validatedBody);

  return res.status(200).json({
    success: true,
    film,
  });
}

async function recordView(req, res) {
  await incrementViews(req.params.id);
  return res.status(200).json({ success: true });
}

module.exports = {
  getFilms,
  addFilm,
  deleteFilm,
  updateFilm,
  recordView,
};
