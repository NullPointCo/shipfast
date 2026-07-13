import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/stripe';

export const POST: RequestHandler = async ({ request }) => {
  let priceId: string | undefined;
  try {
    const body = await request.json();
    priceId = body.priceId;
  } catch {
    // ignore malformed body
  }

  if (!priceId) {
    return json({ error: 'Missing priceId' }, { status: 400 });
  }

  const origin = request.headers.get('origin') ?? import.meta.env.ORIGIN ?? 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`
    });
    return json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error', err);
    return json({ error: 'Could not create checkout session' }, { status: 500 });
  }
};
