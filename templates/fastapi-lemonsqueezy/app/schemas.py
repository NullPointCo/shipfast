"""Pydantic schemas for {{PROJECT_NAME}}"""
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    plan: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CheckoutRequest(BaseModel):
    variant_id: int
    email: EmailStr
    redirect_url: str | None = None
