"""{{PROJECT_NAME}} - Main application (FastAPI + LemonSqueezy)"""
from fastapi import FastAPI, Depends, HTTPException, Request, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db, Base, engine
from app import models
from app.auth import hash_password, verify_password, create_token, SECRET_KEY, ALGORITHM
from app import ls_payments
from app.schemas import TokenResponse, UserCreate, UserOut, CheckoutRequest

Base.metadata.create_all(bind=engine)

app = FastAPI(title="{{PROJECT_NAME}}", version="1.0.0")


class HealthResponse(BaseModel):
    status: str
    version: str
    service: str


@app.get("/", response_model=HealthResponse)
def home():
    return HealthResponse(status="ok", version="1.0.0", service="{{PROJECT_NAME}}")


@app.get("/api/v1/health")
def health():
    return {"status": "healthy"}


@app.post("/api/v1/register", response_model=UserOut)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    import uuid
    user = models.User(
        id=str(uuid.uuid4()),
        email=payload.email,
        name=payload.name or "",
        hashed_password=hash_password(payload.password),
        plan="free",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/api/v1/login", response_model=TokenResponse)
def login(payload: UserCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": user.id, "email": user.email})
    return TokenResponse(access_token=token, token_type="bearer")


@app.post("/api/v1/checkout")
def create_checkout(payload: CheckoutRequest, db: Session = Depends(get_db)):
    """Create a LemonSqueezy checkout session for a plan/variant."""
    try:
        url = ls_payments.create_checkout(
            variant_id=payload.variant_id,
            email=payload.email,
            redirect_url=payload.redirect_url,
        )
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Checkout creation failed: {e}")
    return {"checkout_url": url}


@app.post("/api/v1/webhooks/lemonsqueezy")
async def lemonsqueezy_webhook(
    request: Request,
    x_signature: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    """Verify and process LemonSqueezy webhook events."""
    body = await request.body()
    if not ls_payments.verify_signature(body, x_signature or ""):
        raise HTTPException(status_code=400, detail="Invalid signature")
    event = await request.json()
    meta = event.get("meta", {})
    event_name = meta.get("event_name")
    data = event.get("data", {})
    attrs = data.get("attributes", {})

    if event_name == "subscription_created" or event_name == "subscription_updated":
        custom = attrs.get("custom_data") or {}
        user_id = custom.get("user_id")
        status = attrs.get("status")
        if user_id:
            user = db.query(models.User).filter(models.User.id == user_id).first()
            if user:
                user.plan = "pro" if status == "active" else "free"
                db.commit()
    return JSONResponse({"received": True})
