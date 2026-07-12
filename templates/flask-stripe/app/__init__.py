"""{{PROJECT_NAME}} - Flask 3 + PostgreSQL + Stripe SaaS boilerplate."""
import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL", "sqlite:///app.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "dev-secret-change-me")

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    from app import routes  # noqa: F401

    app.register_blueprint(routes.bp)

    with app.app_context():
        db.create_all()

    return app
