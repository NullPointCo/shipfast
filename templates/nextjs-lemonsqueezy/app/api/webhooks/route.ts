import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/lemonsqueezy";

export const runtime = "nodejs";

/**
 * POST /api/webhooks
 * Lemon Squeezy webhook endpoint. Verifies the X-Signature header, then
 * reacts to subscription / order events.
 * Locally: `npx lemon-squeezy-webhooks listen --forward-to localhost:3000/api/webhooks`
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = req.headers.get("x-signature");

  if (!verifyWebhookSignature(rawBody, sig)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let event: { meta?: { event_name?: string }; data?: unknown };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const name = event.meta?.event_name;
  switch (name) {
    case "subscription_created":
    case "subscription_updated": {
      // TODO: provision access / mark user as paid based on event.data
      console.log(`[lemonsqueezy] ${name}`);
      break;
    }
    case "subscription_cancelled": {
      // TODO: downgrade / revoke access
      console.log("[lemonsqueezy] subscription cancelled");
      break;
    }
    case "order_created": {
      // One-time purchase completed
      console.log("[lemonsqueezy] order created");
      break;
    }
    default:
      // Unhandled event type
      break;
  }

  return NextResponse.json({ received: true });
}
