import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type Stripe from 'stripe';
import { getStripe } from '$lib/stripe';
import { env } from '$env/dynamic/private';

/**
 * POST /api/webhooks
 * Stripe webhook endpoint. Verify the signature, then react to events.
 * Locally: `stripe listen --forward-to localhost:5173/api/webhooks`
 */
export const POST: RequestHandler = async ({ request }) => {
  const stripe = getStripe();
  const sig = request.headers.get('stripe-signature');
  const rawBody = await request.text();

  if (!sig) {
    return json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, env.PRIVATE_STRIPE_WEBHOOK_SECRET ?? '');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    return json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      // TODO: provision access / mark the customer as paid using session metadata
      console.log('Checkout completed:', session.id);
      break;
    }
    case 'invoice.payment_failed': {
      // TODO: downgrade / notify the customer
      break;
    }
    default:
      // Unhandled event type
      break;
  }

  return json({ received: true });
};
