"""{{PROJECT_NAME}} - Main application (FastAPI + Supabase + Stripe)"""
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

app = FastAPI(title="{{PROJECT_NAME}}", version="1.0.0")

security = HTTPBearer()


class HealthResponse(BaseModel):
    status: str
    version: str
    service: str


class CheckoutRequest(BaseModel):
    price_id: str
    success_url: str = "https://example.com/success"
    cancel_url: str = "https://example.com/cancel"


@app.get("/", response_model=HealthResponse)
def home():
    return HealthResponse(status="ok", version="1.0.0", service="{{PROJECT_NAME}}")


@app.get("/api/v1/health")
def health():
    return {"status": "healthy"}


def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    """Validate the Supabase JWT and return its claims."""
    from app.auth import verify_token
    return verify_token(creds.credentials)


@app.post("/api/v1/checkout")
def create_checkout(payload: CheckoutRequest, user=Depends(get_current_user)):
    from app.stripe_payments import create_checkout_session
    url = create_checkout_session(
        payload.price_id, payload.success_url, payload.cancel_url, user.get("sub")
    )
    return {"url": url}


@app.post("/api/v1/webhook")
async def stripe_webhook(request: Request):
    from app.stripe_payments import handle_webhook
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    return handle_webhook(payload, sig)


@app.get("/api/v1/profile")
def profile(user=Depends(get_current_user)):
    return {"user_id": user.get("sub"), "email": user.get("email")}
