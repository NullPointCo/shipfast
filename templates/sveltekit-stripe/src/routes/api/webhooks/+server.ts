import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/stripe';

// Stripe requires the RAW body to verify the signature, so we read text().
export const POST: RequestHandler = async ({ request }) => {
  const sig = request.headers.get('stripe-signature');
  const rawBody = await request.text();

  if (!sig) {
    return json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, import.meta.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      // event.data.object is the Checkout Session.
      // Provision access for event.data.object.customer / .subscription here.
      break;
    case 'customer.subscription.deleted':
      // Revoke access for the cancelled subscription here.
      break;
    default:
      // Unhandled event type.
      break;
  }

  return json({ received: true });
};
