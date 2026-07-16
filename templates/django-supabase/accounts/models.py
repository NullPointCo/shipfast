from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Custom user with subscription fields (auth handled by Supabase)."""

    is_pro = models.BooleanField(default=False)
    plan = models.CharField(max_length=32, blank=True, default="")
    stripe_customer_id = models.CharField(max_length=255, blank=True, default="")

    def __str__(self):
        return self.email or self.username


class Profile(models.Model):
    """Links a Supabase auth user (sub) to a local Django user."""

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="profile"
    )
    supabase_uid = models.CharField(max_length=255, unique=True)
    email = models.EmailField(blank=True, default="")

    def __str__(self):
        return f"{self.supabase_uid} -> {self.user}"
