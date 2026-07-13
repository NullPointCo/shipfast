const express = require("express");
const stripe = require("stripe")(require("../config").stripeSecretKey);
const cfg = require("../config");
const { authenticate } = require("../auth");

const router = express.Router();

const PLANS = {
  pro: "price_XXXX",
  enterprise: "price_YYYY",
};

// Create a Stripe Checkout session for a subscription plan.
router.post("/checkout", authenticate, async (req, res) => {
  if (!cfg.stripeSecretKey) {
    return res.status(503).json({ error: "Stripe is not configured" });
  }
  const { plan } = req.body || {};
  const priceId = PLANS[plan];
  if (!priceId) {
    return res.status(400).json({ error: `Unknown plan. Choose one of: ${Object.keys(PLANS).join(", ")}` });
  }
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: req.user.email,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${cfg.appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cfg.appUrl}/pricing`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Webhook handler — mounted with raw body parsing in src/index.js.
function handleWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, cfg.stripeWebhookSecret);
  } catch (e) {
    return res.status(400).send(`Webhook error: ${e.message}`);
  }
  // TODO: react to events, e.g. mark the user active on checkout.session.completed.
  if (event.type === "checkout.session.completed") {
    console.log("Checkout completed:", event.data.object.id);
  }
  res.json({ received: true });
}

module.exports = { router, handleWebhook };
