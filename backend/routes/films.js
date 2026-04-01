const express = require('express');
const router = express.Router();
const Film = require('../models/Film');
const authMiddleware = require('../middleware/auth');
const { convertSubmissionLinks } = require('../utils/gdrive');

function requireAdmin(req, res, next) {
  const configuredToken = process.env.ADMIN_TOKEN;

  // Development fallback: if no token is configured, allow moderation routes.
  if (!configuredToken) {
    return next();
  }

  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const adminToken = req.headers['x-admin-token'] || bearerToken;

  if (adminToken !== configuredToken) {
    return res.status(401).json({ error: 'Unauthorized admin action' });
  }

  return next();
}

// GET /films - Returns all films (public)
// Returns only approved films
// Sorted by createdAt descending (newest first)
router.get('/', async (req, res) => {
  try {
    const films = await Film.find({ moderationStatus: 'approved' }).sort({ createdAt: -1 });
    res.json(films);
  } catch (error) {
    console.error('Error fetching films:', error);
    res.status(500).json({ error: 'Failed to retrieve films' });
  }
});

// GET /films/pending - Returns all unapproved films for moderation (admin)
router.get('/pending', requireAdmin, async (req, res) => {
  try {
    const films = await Film.find({ moderationStatus: 'pending' }).sort({ createdAt: 1 });
    res.json(films);
  } catch (error) {
    console.error('Error fetching pending films:', error);
    res.status(500).json({ error: 'Failed to retrieve pending films' });
  }
});

// POST /submit - Submit a film (JWT required, director-only flow)
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

// PATCH /films/:id/approve - Approve a pending film (admin)
router.patch('/:id/approve', requireAdmin, async (req, res) => {
  try {
    const film = await Film.findByIdAndUpdate(
      req.params.id,
      { moderationStatus: 'approved', moderatedAt: new Date() },
      { new: true }
    );

    if (!film) {
      return res.status(404).json({ error: 'Film not found' });
    }

    return res.json(film);
  } catch (error) {
    console.error('Error approving film:', error);
    return res.status(500).json({ error: 'Failed to approve film' });
  }
});

// PATCH /films/:id/reject - Reject a pending film (admin)
router.patch('/:id/reject', requireAdmin, async (req, res) => {
  try {
    const film = await Film.findByIdAndUpdate(
      req.params.id,
      { moderationStatus: 'rejected', moderatedAt: new Date() },
      { new: true }
    );

    if (!film) {
      return res.status(404).json({ error: 'Film not found' });
    }

    return res.json(film);
  } catch (error) {
    console.error('Error rejecting film:', error);
    return res.status(500).json({ error: 'Failed to reject film' });
  }
});

module.exports = router;
