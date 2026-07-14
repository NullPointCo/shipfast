import type { APIContext } from "astro";
import { getStripe } from "../../lib/stripe";

export const prerender = false;

/**
 * POST /api/checkout
 * Body: { priceId?: string, successUrl?: string, cancelUrl?: string }
 * Returns: { url } — a Stripe Checkout session URL to redirect the user to.
 */
export async function POST({ request }: APIContext) {
  let stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const body = await request.json().catch(() => ({}));
  const priceId: string | undefined = body.priceId;
  const base = process.env.PUBLIC_BASE_URL ?? "http://localhost:3000";

  if (!priceId) {
    return new Response(JSON.stringify({ error: "priceId is required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: body.successUrl ?? `${base}/?success=1`,
      cancel_url: body.cancelUrl ?? `${base}/?canceled=1`,
      allow_promotion_codes: true,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
