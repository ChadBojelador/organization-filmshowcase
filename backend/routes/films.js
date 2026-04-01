const express = require('express');
const router = express.Router();
const Film = require('../models/Film');

function requireAdmin(req, res, next) {
  const configuredToken = process.env.ADMIN_TOKEN;

  // Fail closed: moderation must not be open when admin token is missing.
  if (!configuredToken) {
    return res.status(503).json({ error: 'Admin moderation is not configured' });
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
