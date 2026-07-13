import Stripe from 'stripe';

const secretKey = import.meta.env.STRIPE_SECRET_KEY as string;

// Lazily instantiated so the app still boots in dev without a key set.
export const stripe = new Stripe(secretKey, {
  apiVersion: '2024-06-20'
});
