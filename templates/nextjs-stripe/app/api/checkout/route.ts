import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * POST /api/checkout
 * Body: { priceId?: string, successUrl?: string, cancelUrl?: string }
 * Returns: { url } — a Stripe Checkout session URL to redirect the user to.
 */
export async function POST(req: Request) {
  const stripe = getStripe();

  const body = await req.json().catch(() => ({}));
  const priceId: string | undefined = body.priceId;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  if (!priceId) {
    return NextResponse.json(
      { error: "priceId is required" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: body.successUrl ?? `${base}/?success=1`,
      cancel_url: body.cancelUrl ?? `${base}/?canceled=1`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
