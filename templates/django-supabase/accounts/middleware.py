"""Supabase Auth middleware. NullPointerCo (MIT)."""
import jwt
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.utils.functional import SimpleLazyObject

from accounts.models import Profile


def _get_user(request):
    """Resolve a Django user from the Supabase-issued JWT in the Authorization header."""
    auth = request.META.get("HTTP_AUTHORIZATION", "")
    if not auth.startswith("Bearer "):
        return AnonymousUser()
    token = auth.split(" ", 1)[1]
    try:
        # Verify the Supabase access token with the project JWT secret.
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
    except (jwt.PyJWTError, ValueError):
        return AnonymousUser()

    supabase_uid = payload.get("sub")
    email = payload.get("email", "")
    if not supabase_uid:
        return AnonymousUser()

    profile, _ = Profile.objects.get_or_create(
        supabase_uid=supabase_uid,
        defaults={"email": email},
    )
    return profile.user


class SupabaseAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not hasattr(request, "user"):
            request.user = SimpleLazyObject(lambda: _get_user(request))
        return self.get_response(request)
