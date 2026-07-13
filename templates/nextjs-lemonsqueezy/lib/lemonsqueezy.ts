import crypto from "crypto";

const API_BASE = "https://api.lemonsqueezy.com/v1";

/** Lazily read the Lemon Squeezy API key from the environment. */
function apiKey(): string {
  const key = process.env.LEMONSQUEEZY_API_KEY;
  if (!key) throw new Error("LEMONSQUEEZY_API_KEY is not set");
  return key;
}

export interface CreateCheckoutOptions {
  storeId: string;
  variantId: string;
  successUrl?: string;
  customerEmail?: string;
}

/**
 * Create a Lemon Squeezy hosted checkout and return its URL.
 * Docs: https://docs.lemonsqueezy.com/api/checkouts
 */
export async function createCheckoutUrl(opts: CreateCheckoutOptions): Promise<string> {
  const res = await fetch(`${API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          product_options: opts.successUrl
            ? { redirect_url: opts.successUrl }
            : {},
          checkout_data: opts.customerEmail
            ? { email: opts.customerEmail }
            : {},
        },
        relationships: {
          store: { data: { type: "stores", id: opts.storeId } },
          variant: { data: { type: "variants", id: opts.variantId } },
        },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Lemon Squeezy checkout failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as {
    data?: { attributes?: { url?: string } };
  };
  const url = json.data?.attributes?.url;
  if (!url) throw new Error("Lemon Squeezy did not return a checkout URL");
  return url;
}

/**
 * Verify a Lemon Squeezy webhook signature.
 * LS signs the raw body with HMAC-SHA256 using the webhook secret.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(digest);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
