require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL || null;

module.exports = {
  port: parseInt(process.env.PORT || "8080", 10),
  appUrl: process.env.APP_URL || "http://localhost:8080",
  jwtSecret: process.env.SECRET_KEY || "change-me-in-production-use-a-long-random-string",
  jwtExpiresIn: "30d",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  databaseUrl,
  // No DATABASE_URL => in-memory store (great for local dev & tests).
  // Set DATABASE_URL => Postgres-backed store (production).
  storeType: databaseUrl ? "pg" : "memory",
};
