import pytest
from django.urls import reverse


def test_home_anonymous(client):
    resp = client.get("/")
    assert resp.status_code == 200


@pytest.mark.django_db
def test_pricing_requires_login(client):
    resp = client.get("/payments/pricing/")
    assert resp.status_code == 302


@pytest.mark.django_db
def test_signup_creates_user(client, django_user_model):
    resp = client.post(
        "/signup/",
        {
            "username": "alice",
            "email": "alice@example.com",
            "password1": "Str0ng!Passw0rd",
            "password2": "Str0ng!Passw0rd",
        },
    )
    assert resp.status_code == 302
    assert django_user_model.objects.filter(username="alice").exists()
