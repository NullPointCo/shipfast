import pytest
from django.urls import reverse


def test_home_anonymous(client):
    resp = client.get("/")
    assert resp.status_code == 200


@pytest.mark.django_db
def test_pricing_requires_login(client):
    resp = client.get("/subscriptions/pricing/")
    assert resp.status_code == 302


@pytest.mark.django_db
def test_profile_requires_login(client):
    resp = client.get("/profile/")
    assert resp.status_code == 302
