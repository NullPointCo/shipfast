"""Auth helpers: registration and login using bcrypt + JWT."""
from app import db, bcrypt
from app.models import User


def register_user(email, password):
    """Create a user. Returns (user, error). error is None on success."""
    if User.query.filter_by(email=email).first():
        return None, "Email already registered"
    user = User(
        email=email,
        password_hash=bcrypt.generate_password_hash(password).decode("utf-8"),
    )
    db.session.add(user)
    db.session.commit()
    return user, None


def authenticate(email, password):
    """Return the User on valid credentials, else None."""
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
        return user
    return None
