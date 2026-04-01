const express = require('express');
const router = express.Router();
const Film = require('../models/Film');

// GET /films - Returns all films (public)
// Sorted by createdAt descending (newest first)
router.get('/', async (req, res) => {
  try {
    const films = await Film.find().sort({ createdAt: -1 });
    res.json(films);
  } catch (error) {
    console.error('Error fetching films:', error);
    res.status(500).json({ error: 'Failed to retrieve films' });
  }
});

module.exports = router;
