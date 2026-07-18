"""JWT auth helpers for {{PROJECT_NAME}}"""
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = "change-me-in-production-generate-a-random-64-char-string"
ALGORITHM = "HS256"
EXPIRE_DAYS = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(pw: str) -> str:
    return pwd_context.hash(pw)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_token(data: dict) -> str:
    to_encode = {**data, "exp": datetime.utcnow() + timedelta(days=EXPIRE_DAYS)}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
