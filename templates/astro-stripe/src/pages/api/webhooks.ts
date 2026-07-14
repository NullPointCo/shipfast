import type { APIContext } from "astro";
import type Stripe from "stripe";
import { getStripe } from "../../lib/stripe";

export const prerender = false;

/**
 * POST /api/webhooks
 * Stripe webhook endpoint. Verify the signature, then react to events.
 * Locally: `stripe listen --forward-to localhost:3000/api/webhooks`
 */
export async function POST({ request }: APIContext) {
  const stripe = getStripe();
  const sig = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return new Response(`Webhook error: ${message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // TODO: provision access / mark the customer as paid using
      // session.customer / session.metadata.
      console.log("Checkout completed:", session.id);
      break;
    }
    case "invoice.payment_failed": {
      // TODO: downgrade / notify the customer.
      break;
    }
    default:
      // Unhandled event type.
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
