from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_home():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["service"] == "{{PROJECT_NAME}}"


def test_health():
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


def test_profile_requires_auth():
    # HTTPBearer should reject missing credentials with 403
    r = client.get("/api/v1/profile")
    assert r.status_code in (401, 403)
