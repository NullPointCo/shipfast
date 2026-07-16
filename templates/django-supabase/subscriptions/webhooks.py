from django.contrib.auth import get_user_model
from .models import Subscription


def handle(event):
    """Apply Stripe webhook events to local state."""
    if event["type"] == "checkout.session.completed":
        obj = event["data"]["object"]
        user_id = obj.get("metadata", {}).get("user_id")
        plan = obj.get("metadata", {}).get("plan")
        User = get_user_model()
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return
        user.is_pro = True
        user.plan = plan or ""
        user.save()
        Subscription.objects.update_or_create(
            user=user,
            defaults={"plan": plan or "", "active": True},
        )
