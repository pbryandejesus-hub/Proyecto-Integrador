from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    role = Column(String(20), nullable=False, default="Cliente")
    created_at = Column(DateTime, server_default=func.now())


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    category = Column(String(80), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(String(24), nullable=False)
    image_path = Column(String(200), nullable=False)
    sizes = Column(String(80), nullable=False)
    colors = Column(String(120), nullable=False)
    stock = Column(Integer, default=10)


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(120), nullable=False)
    message = Column(Text, nullable=False)
    source = Column(String(80), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
