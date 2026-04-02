const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function buildTokenPayload(user) {
  return {
    userId: user._id,
    teamName: user.teamName,
    email: user.email,
    members: user.members,
    role: 'director'
  };
}

function signAuthToken(user) {
  return jwt.sign(buildTokenPayload(user), JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const { teamName, email, password, members } = req.body;

    if (!teamName || !email || !password || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        error: 'teamName, email, password, and members are required'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      teamName,
      email: email.toLowerCase(),
      password: hashedPassword,
      members
    });

    const token = signAuthToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        teamName: user.teamName,
        email: user.email,
        members: user.members,
        role: 'director'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signAuthToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        teamName: user.teamName,
        email: user.email,
        members: user.members,
        role: 'director'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to login user' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user.userId,
      teamName: req.user.teamName,
      email: req.user.email,
      members: req.user.members,
      role: 'director'
    }
  });
});

module.exports = router;
