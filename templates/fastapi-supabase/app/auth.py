"""Supabase JWT verification (HS256, audience 'authenticated')."""
import os
import jwt
from fastapi import HTTPException


def verify_token(token: str):
    secret = os.environ.get("SUPABASE_JWT_SECRET")
    if not secret:
        raise HTTPException(
            status_code=500, detail="SUPABASE_JWT_SECRET is not configured"
        )
    try:
        return jwt.decode(
            token, secret, algorithms=["HS256"], audience="authenticated"
        )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=401, detail=f"Invalid token: {exc}")
