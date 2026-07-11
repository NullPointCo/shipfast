from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user with Stripe / subscription fields."""

    is_pro = models.BooleanField(default=False)
    plan = models.CharField(max_length=32, blank=True, default="")
    stripe_customer_id = models.CharField(max_length=255, blank=True, default="")

    def __str__(self):
        return self.email or self.username
