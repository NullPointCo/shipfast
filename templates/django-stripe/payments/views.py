import stripe
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt

from . import webhooks

stripe.api_key = settings.STRIPE_SECRET_KEY

PLANS = {
    "pro": {"name": "Pro", "price": "$19/mo", "price_id": "price_XXXX"},
    "enterprise": {"name": "Enterprise", "price": "$99/mo", "price_id": "price_YYYY"},
}


@login_required
def pricing(request):
    return render(request, "payments/pricing.html", {"plans": PLANS})


@login_required
def checkout(request, plan):
    if plan not in PLANS:
        return redirect("pricing")
    session = stripe.checkout.Session.create(
        customer_email=request.user.email,
        payment_method_types=["card"],
        line_items=[{"price": PLANS[plan]["price_id"], "quantity": 1}],
        mode="subscription",
        success_url=request.build_absolute_uri("/payments/success/"),
        cancel_url=request.build_absolute_uri("/pricing/"),
        metadata={"user_id": str(request.user.id), "plan": plan},
    )
    return redirect(session.url, status=303)


@login_required
def success(request):
    return render(request, "payments/success.html")


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)
    webhooks.handle(event)
    return HttpResponse(status=200)
