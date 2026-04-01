const express = require('express');
const authMiddleware = require('../middleware/auth');
const Film = require('../models/Film');
const { convertSubmissionLinks } = require('../utils/gdrive');

const router = express.Router();

router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { filmTitle, videoLink, posterLink } = req.body;

    if (!filmTitle || !videoLink || !posterLink) {
      return res.status(400).json({ error: 'filmTitle, videoLink, and posterLink are required' });
    }

    const teamName = req.user.teamName;
    const members = req.user.members;

    if (!teamName || !Array.isArray(members) || members.length === 0) {
      return res.status(403).json({ error: 'Only registered directors can submit films' });
    }

    const convertedLinks = convertSubmissionLinks(videoLink, posterLink);

    const film = new Film({
      teamName,
      members,
      filmTitle,
      videoLink: convertedLinks.videoLink,
      posterLink: convertedLinks.posterLink
    });

    const savedFilm = await film.save();
    return res.status(201).json(savedFilm);
  } catch (error) {
    console.error('Error submitting film:', error);
    return res.status(500).json({ error: 'Failed to submit film' });
  }
});

module.exports = router;
