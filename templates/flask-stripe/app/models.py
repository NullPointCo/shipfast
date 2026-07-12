"""SQLAlchemy models for {{PROJECT_NAME}}."""
from app import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    stripe_customer_id = db.Column(db.String(255), nullable=True)
    subscription_status = db.Column(db.String(50), default="free", nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "subscription_status": self.subscription_status,
        }
