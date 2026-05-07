// server/src/utils/jwt.js
const crypto = require("crypto");
const env = require("../config/env");
const { createHttpError } = require("./httpError");

function encodeBase64Url(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function createJwtToken(payload) {
  if (!env.jwtSecret) {
    throw createHttpError(
      500,
      "JWT is not configured. Set JWT_SECRET in server/.env."
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + env.jwtExpiresInSeconds,
  };

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const unsignedToken = `${encodeBase64Url(header)}.${encodeBase64Url(tokenPayload)}`;
  const signature = crypto
    .createHmac("sha256", env.jwtSecret)
    .update(unsignedToken)
    .digest("base64url");

  return `${unsignedToken}.${signature}`;
}

function decodeBase64Url(value) {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  } catch (error) {
    throw createHttpError(401, "Invalid token.");
  }
}

function verifyJwtToken(token) {
  if (!env.jwtSecret) {
    throw createHttpError(
      500,
      "JWT is not configured. Set JWT_SECRET in server/.env."
    );
  }

  if (!token || typeof token !== "string") {
    throw createHttpError(401, "Invalid token.");
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    throw createHttpError(401, "Invalid token.");
  }

  const [encodedHeader, encodedPayload, tokenSignature] = parts;
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const header = decodeBase64Url(encodedHeader);
  if (header?.alg !== "HS256" || header?.typ !== "JWT") {
    throw createHttpError(401, "Invalid token.");
  }

  const expectedSignature = crypto
    .createHmac("sha256", env.jwtSecret)
    .update(unsignedToken)
    .digest("base64url");

  const tokenSignatureBuffer = Buffer.from(tokenSignature, "base64url");
  const expectedSignatureBuffer = Buffer.from(expectedSignature, "base64url");

  if (
    tokenSignatureBuffer.length !== expectedSignatureBuffer.length ||
    !crypto.timingSafeEqual(tokenSignatureBuffer, expectedSignatureBuffer)
  ) {
    throw createHttpError(401, "Invalid token.");
  }

  const payload = decodeBase64Url(encodedPayload);
  const now = Math.floor(Date.now() / 1000);

  if (typeof payload?.exp !== "number" || payload.exp <= now) {
    throw createHttpError(401, "Token has expired.");
  }

  return payload;
}

module.exports = {
  createJwtToken,
  verifyJwtToken,
};
