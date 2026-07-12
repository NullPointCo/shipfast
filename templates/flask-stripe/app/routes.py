"""API blueprint for {{PROJECT_NAME}}."""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from app import db
from app.models import User
from app.auth import register_user, authenticate
from app.stripe_payments import create_checkout_session, handle_webhook

bp = Blueprint("api", __name__)


@bp.get("/")
def home():
    return jsonify(status="ok", version="1.0.0", service="{{PROJECT_NAME}}")


@bp.get("/api/health")
def health():
    return jsonify(status="healthy")


@bp.post("/api/register")
def register():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify(error="email and password required"), 400
    user, err = register_user(email, password)
    if err:
        return jsonify(error=err), 409
    token = create_access_token(identity=str(user.id))
    return jsonify(access_token=token, user=user.to_dict()), 201


@bp.post("/api/login")
def login():
    data = request.get_json(silent=True) or {}
    user = authenticate(data.get("email"), data.get("password"))
    if not user:
        return jsonify(error="invalid credentials"), 401
    token = create_access_token(identity=str(user.id))
    return jsonify(access_token=token, user=user.to_dict()), 200


@bp.post("/api/checkout")
@jwt_required()
def checkout():
    data = request.get_json(silent=True) or {}
    user_id = get_jwt_identity()
    url = create_checkout_session(
        data.get("price_id"),
        data.get("success_url"),
        data.get("cancel_url"),
        user_id,
    )
    return jsonify(url=url), 200


@bp.post("/api/webhook")
def webhook():
    payload = request.get_data()
    sig = request.headers.get("stripe-signature", "")
    return handle_webhook(payload, sig)


@bp.get("/api/profile")
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        return jsonify(error="not found"), 404
    return jsonify(user.to_dict()), 200
