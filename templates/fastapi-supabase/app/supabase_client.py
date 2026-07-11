"""Lazily-initialised Supabase client (avoids import cost at startup)."""
_client = None


def get_client():
    global _client
    if _client is None:
        from supabase import create_client
        import os
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get(
            "SUPABASE_ANON_KEY"
        )
        if not url or not key:
            raise RuntimeError(
                "SUPABASE_URL and a Supabase key must be set in the environment"
            )
        _client = create_client(url, key)
    return _client
