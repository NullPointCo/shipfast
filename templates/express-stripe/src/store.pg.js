// Postgres-backed user store. Activated automatically when DATABASE_URL is set.
const { Pool } = require("pg");
const cfg = require("./config");

const pool = new Pool({ connectionString: cfg.databaseUrl });

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

async function createUser({ email, passwordHash }) {
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at AS "createdAt"`,
    [email, passwordHash]
  );
  return rows[0];
}

async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, email, password_hash AS "passwordHash", created_at AS "createdAt" FROM users WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

async function findUserById(id) {
  const { rows } = await pool.query(
    `SELECT id, email, password_hash AS "passwordHash", created_at AS "createdAt" FROM users WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { init, createUser, findUserByEmail, findUserById };
