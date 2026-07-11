"""Stripe Checkout + webhook handling."""
import os
import stripe

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")


def create_checkout_session(price_id: str, success_url: str, cancel_url: str,
                            user_id: str | None = None) -> str:
    session = stripe.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
        client_reference_id=user_id or "",
    )
    return session.url


def handle_webhook(payload: bytes, sig_header: str):
    secret = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, secret)
    except Exception as exc:  # noqa: BLE001
        return {"error": str(exc)}, 400

    if event["type"] == "checkout.session.completed":
        # Provision access for event["data"]["object"]["client_reference_id"]
        pass
    return {"received": True}
