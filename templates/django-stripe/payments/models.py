from django.conf import settings
from django.db import models


class Subscription(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subscription",
    )
    plan = models.CharField(max_length=32, blank=True, default="")
    stripe_customer_id = models.CharField(max_length=255, blank=True, default="")
    active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} -> {self.plan or 'free'}"
