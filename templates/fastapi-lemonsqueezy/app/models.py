"""SQLAlchemy models for {{PROJECT_NAME}}"""
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    name = Column(String, default="")
    hashed_password = Column(String)
    plan = Column(String, default="free")  # free | pro
    lemonsqueezy_customer_id = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    is_active = Column(Boolean, default=True)
