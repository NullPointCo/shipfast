import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStripe } from '$lib/stripe';
import { env } from '$env/dynamic/private';

/**
 * POST /api/checkout
 * Body: { priceId?: string, successUrl?: string, cancelUrl?: string }
 * Returns: { url } — a Stripe Checkout session URL to redirect the user to.
 */
export const POST: RequestHandler = async ({ request }) => {
  const stripe = getStripe();

  const body = await request.json().catch(() => ({}));
  const priceId: string | undefined = body.priceId;
  const base = env.PUBLIC_BASE_URL ?? 'http://localhost:3000';

  if (!priceId) {
    throw error(400, 'priceId is required');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: body.successUrl ?? `${base}/?success=1`,
      cancel_url: body.cancelUrl ?? `${base}/?canceled=1`,
      allow_promotion_codes: true
    });

    return json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    throw error(500, message);
  }
};
