const { verifyJwtToken } = require("../utils/jwt");

function requireAuth(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      message: "Authorization token is required.",
    });
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization header format.",
    });
  }

  try {
    const payload = verifyJwtToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    if (error.statusCode && error.statusCode !== 401) {
      return next(error);
    }

    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
}

module.exports = {
  requireAuth,
};
