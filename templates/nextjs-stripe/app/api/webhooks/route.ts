import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * POST /api/webhooks
 * Stripe webhook endpoint. Verify the signature, then react to events.
 * Locally: `stripe listen --forward-to localhost:3000/api/webhooks`
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  if (!sig) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
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
    return new NextResponse(`Webhook error: ${message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // TODO: provision access / mark user as paid using session.customer / metadata
      console.log("Checkout completed:", session.id);
      break;
    }
    case "invoice.payment_failed": {
      // TODO: downgrade / notify the customer
      break;
    }
    default:
      // Unhandled event type
      break;
  }

  return NextResponse.json({ received: true });
}
