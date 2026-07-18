from fastapi.testclient import TestClient
from app.main import app
from app.ls_payments import verify_signature
import hmac, hashlib

client = TestClient(app)


def test_home():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["service"]


def test_health():
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


def test_register_and_login():
    email = "test@example.com"
    r = client.post("/api/v1/register", json={"email": email, "password": "secret123"})
    assert r.status_code in (200, 409)  # 409 if already registered
    r = client.post("/api/v1/login", json={"email": email, "password": "secret123"})
    assert r.status_code == 200
    assert r.json()["token_type"] == "bearer"


def test_signature_verification():
    secret = b"whsec_test"
    body = b'{"meta":{"event_name":"subscription_created"}}'
    sig = hmac.new(secret, body, hashlib.sha256).hexdigest()
    # Patch the module secret for the test
    import app.ls_payments as ls
    ls.WEBHOOK_SECRET = "whsec_test"
    assert ls.verify_signature(body, sig) is True
    assert ls.verify_signature(body, "bad") is False
