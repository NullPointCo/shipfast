import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

let cached: Stripe | null = null;

/** Lazily create a singleton Stripe client. */
export function getStripe(): Stripe {
  if (!cached) {
    const key = env.PRIVATE_STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('PRIVATE_STRIPE_SECRET_KEY is not set');
    }
    cached = new Stripe(key, {
      apiVersion: '2024-06-20',
      typescript: true
    });
  }
  return cached;
}
