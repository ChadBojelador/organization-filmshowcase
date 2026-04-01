const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  const jwtSecret = process.env.JWT_SECRET || 'dev_secret_change_me';

  try {
    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findById(decoded.userId).select('_id teamName email members');
    if (!user) {
      return res.status(403).json({ error: 'User is not registered or no longer exists' });
    }

    req.user = {
      userId: user._id,
      teamName: user.teamName,
      email: user.email,
      members: user.members
    };

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
