from sqlalchemy import Column, String, Integer, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    plan = Column(String, default="free")
    stripe_customer_id = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    is_active = Column(Boolean, default=True)
