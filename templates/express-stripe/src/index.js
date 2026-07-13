const express = require("express");
const cors = require("cors");
const cfg = require("./config");
const store = require("./store");
const authRoutes = require("./routes/auth");
const { handleWebhook } = require("./routes/stripe");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "{{PROJECT_NAME}}", version: "1.0.0" });
});
app.get("/api/v1/health", (req, res) => res.json({ status: "healthy" }));

app.use("/api/auth", authRoutes);

// Stripe webhook must receive the RAW body for signature verification.
app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => handleWebhook(req, res)
);
app.use("/api/stripe", require("./routes/stripe").router);

// Create Postgres tables on boot when using the pg store.
if (cfg.storeType === "pg") {
  require("./store.pg").init().catch((e) => {
    console.error("Failed to init database:", e.message);
    process.exit(1);
  });
}

if (require.main === module) {
  app.listen(cfg.port, () => {
    console.log(`{{PROJECT_NAME}} listening on http://localhost:${cfg.port} (store: ${cfg.storeType})`);
  });
}

module.exports = app;
