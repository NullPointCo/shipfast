// In-memory user store. Default for local dev and tests.
// Swap to src/store.pg.js by setting DATABASE_URL in the environment.

const users = new Map();
let nextId = 1;

async function createUser({ email, passwordHash }) {
  const id = nextId++;
  const user = { id, email, passwordHash, createdAt: new Date().toISOString() };
  users.set(id, user);
  return user;
}

async function findUserByEmail(email) {
  for (const u of users.values()) {
    if (u.email === email) return u;
  }
  return null;
}

async function findUserById(id) {
  return users.get(id) || null;
}

module.exports = { createUser, findUserByEmail, findUserById };
