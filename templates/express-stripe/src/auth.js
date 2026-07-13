const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cfg = require("./config");

function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

function signToken(payload) {
  return jwt.sign(payload, cfg.jwtSecret, { expiresIn: cfg.jwtExpiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, cfg.jwtSecret);
}

// Express middleware: rejects requests without a valid Bearer token.
function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { hashPassword, verifyPassword, signToken, verifyToken, authenticate };
