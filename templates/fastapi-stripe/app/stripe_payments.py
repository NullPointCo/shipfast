import os, stripe
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")
PLANS = {"pro": {"price_id": "price_XXXX"}, "enterprise": {"price_id": "price_YYYY"}}

def checkout(email, plan):
    return stripe.checkout.Session.create(
        customer_email=email,
        payment_method_types=["card"],
        line_items=[{"price": PLANS[plan]["price_id"], "quantity": 1}],
        mode="subscription",
        success_url="https://yoursite.com/success",
        cancel_url="https://yoursite.com/pricing",
    )
