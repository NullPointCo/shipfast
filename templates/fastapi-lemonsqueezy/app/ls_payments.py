"""LemonSqueezy integration for {{PROJECT_NAME}}.

LemonSqueezy is a merchant of record — it handles VAT/taxes globally so you
don't need a Stripe account or a registered business to start selling SaaS
subscriptions. This module wraps the v1 API for checkout creation and
verifies webhook signatures.
"""
import os
import hmac
import hashlib
import httpx

API_BASE = "https://api.lemonsqueezy.com/v1"
API_KEY = os.environ.get("LEMONSQUEEZY_API_KEY", "")
WEBHOOK_SECRET = os.environ.get("LEMONSQUEEZY_WEBHOOK_SECRET", "")

# Map your plan names to LemonSqueezy variant IDs (set in the dashboard).
VARIANTS = {
    "pro": int(os.environ.get("LS_VARIANT_PRO", "0")),
    "enterprise": int(os.environ.get("LS_VARIANT_ENTERPRISE", "0")),
}


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
    }


def create_checkout(variant_id: int, email: str, redirect_url: str | None = None,
                    store_id: int | None = None, custom_data: dict | None = None) -> str:
    """Create a checkout and return the hosted checkout URL."""
    if not API_KEY:
        raise RuntimeError("LEMONSQUEEZY_API_KEY is not set")
    if not store_id:
        store_id = int(os.environ.get("LEMONSQUEEZY_STORE_ID", "0"))
    if not store_id:
        raise RuntimeError("LEMONSQUEEZY_STORE_ID is not set")

    payload = {
        "data": {
            "type": "checkouts",
            "attributes": {
                "product_options": {"redirect_url": redirect_url} if redirect_url else {},
                "checkout_data": {"email": email, "custom": custom_data or {}},
            },
            "relationships": {
                "store": {"data": {"type": "stores", "id": str(store_id)}},
                "variant": {"data": {"type": "variants", "id": str(variant_id)}},
            },
        }
    }
    with httpx.Client(timeout=30) as client:
        r = client.post(f"{API_BASE}/checkouts", headers=_headers(), json=payload)
        r.raise_for_status()
        return r.json()["data"]["attributes"]["url"]


def verify_signature(raw_body: bytes, signature: str) -> bool:
    """Validate the X-Signature HMAC-SHA256 header from LemonSqueezy."""
    if not WEBHOOK_SECRET:
        # No secret configured: refuse to trust unverified webhooks.
        return False
    digest = hmac.new(
        WEBHOOK_SECRET.encode(), raw_body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(digest, signature)
