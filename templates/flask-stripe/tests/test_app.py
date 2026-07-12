"""Smoke tests for the {{PROJECT_NAME}} Flask boilerplate."""
import os
import tempfile

_db_file = os.path.join(tempfile.gettempdir(), "shipfast_flask_test.db")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret")
os.environ.setdefault("DATABASE_URL", f"sqlite:///{_db_file}")
os.environ.setdefault("STRIPE_SECRET_KEY", "sk_test_xxx")
os.environ.setdefault("STRIPE_WEBHOOK_SECRET", "whsec_test")

from app import create_app  # noqa: E402


def _client():
    return create_app().test_client()


def test_home():
    r = _client().get("/")
    assert r.status_code == 200
    assert r.get_json()["status"] == "ok"


def test_health():
    assert _client().get("/api/health").status_code == 200


def test_register_login_profile():
    c = _client()
    r = c.post("/api/register", json={"email": "a@b.com", "password": "pw12345"})
    assert r.status_code == 201
    token = r.get_json()["access_token"]

    dup = c.post("/api/register", json={"email": "a@b.com", "password": "pw12345"})
    assert dup.status_code == 409

    login = c.post("/api/login", json={"email": "a@b.com", "password": "pw12345"})
    assert login.status_code == 200
    token = login.get_json()["access_token"]

    prof = c.get("/api/profile", headers={"Authorization": f"Bearer {token}"})
    assert prof.status_code == 200
    assert prof.get_json()["email"] == "a@b.com"


def test_profile_requires_auth():
    assert _client().get("/api/profile").status_code == 401


def test_checkout_requires_auth():
    assert _client().post("/api/checkout", json={"price_id": "price_x"}).status_code == 401
