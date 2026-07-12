import Stripe from "stripe";

let cached: Stripe | null = null;

/** Lazily create a singleton Stripe client. */
export function getStripe(): Stripe {
  if (!cached) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    cached = new Stripe(key, {
      apiVersion: "2024-06-20",
      typescript: true,
    });
  }
  return cached;
}
