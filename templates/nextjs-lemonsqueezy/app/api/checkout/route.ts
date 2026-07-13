import { NextResponse } from "next/server";
import { createCheckoutUrl } from "@/lib/lemonsqueezy";

export const runtime = "nodejs";

/**
 * POST /api/checkout
 * Body: { variantId?: string, successUrl?: string, email?: string }
 * Returns: { url } — a Lemon Squeezy hosted checkout URL to redirect to.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const variantId: string | undefined = body.variantId;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  if (!storeId) {
    return NextResponse.json(
      { error: "LEMONSQUEEZY_STORE_ID is not set" },
      { status: 500 }
    );
  }
  if (!variantId) {
    return NextResponse.json({ error: "variantId is required" }, { status: 400 });
  }

  try {
    const url = await createCheckoutUrl({
      storeId,
      variantId,
      successUrl: body.successUrl ?? `${base}/?success=1`,
      customerEmail: body.email,
    });
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
