const express = require("express");
const store = require("../store");
const { hashPassword, verifyPassword, signToken, authenticate } = require("../auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  if (await store.findUserByEmail(email)) {
    return res.status(409).json({ error: "Email already registered" });
  }
  const passwordHash = await hashPassword(password);
  const user = await store.createUser({ email, passwordHash });
  const token = signToken({ sub: user.id, email: user.email });
  res.json({ token, user: { id: user.id, email: user.email } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  const user = await store.findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = signToken({ sub: user.id, email: user.email });
  res.json({ token, user: { id: user.id, email: user.email } });
});

router.get("/me", authenticate, async (req, res) => {
  const user = await store.findUserById(req.user.sub);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ id: user.id, email: user.email });
});

module.exports = router;
