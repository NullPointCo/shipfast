"""Stripe Checkout + webhook handling for {{PROJECT_NAME}}."""
import os

import stripe
from flask import jsonify

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")


def create_checkout_session(price_id, success_url=None, cancel_url=None, user_id=None):
    """Create a Stripe subscription Checkout session and return its URL."""
    if not price_id:
        raise ValueError("price_id is required")
    session = stripe.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url or "https://example.com/success",
        cancel_url=cancel_url or "https://example.com/cancel",
        client_reference_id=str(user_id) if user_id else None,
        metadata={"user_id": str(user_id)} if user_id else {},
    )
    return session.url


def handle_webhook(payload, sig_header):
    """Verify and process a Stripe webhook; returns a Flask response tuple."""
    secret = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, secret)
    except ValueError:
        return jsonify(error="invalid payload"), 400
    except stripe.error.SignatureVerificationError:
        return jsonify(error="invalid signature"), 400

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = (session.get("metadata") or {}).get("user_id")
        if user_id:
            from app import db
            from app.models import User

            user = db.session.get(User, int(user_id))
            if user:
                user.subscription_status = "active"
                db.session.commit()

    return jsonify(received=True), 200
