from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException

SECRET_KEY="change-me-in-production..."
ALGORITHM = "HS256"
EXPIRE_DAYS = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(pw): return pwd_context.hash(pw)
def verify_password(plain, hashed): return pwd_context.verify(plain, hashed)
def create_token(data):
    to_encode = {**data, "exp": datetime.utcnow() + timedelta(days=EXPIRE_DAYS)}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
