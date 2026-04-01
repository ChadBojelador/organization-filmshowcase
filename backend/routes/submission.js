const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/submit', authMiddleware, (req, res) => {
  return res.status(200).json({
    message: 'JWT verified. Submission access granted.',
    user: req.user
  });
});

module.exports = router;
