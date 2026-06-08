from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, EmailStr


class ProductOut(BaseModel):
    id: int
    name: str
    category: str
    description: str
    price: str
    image_path: str
    sizes: List[str]
    colors: List[str]
    stock: int

    class Config:
        orm_mode = True


class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    message: str


class LeadOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    message: str
    created_at: datetime

    class Config:
        orm_mode = True


class AuthRequest(BaseModel):
    username: str
    password: str


class AuthResponse(BaseModel):
    username: str
    role: str
    message: str


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    stock: Optional[int] = None


class AdminStats(BaseModel):
    leads_count: int
    products_count: int
    daily_leads: Dict[str, int]


class AnalyticsPayload(BaseModel):
    event: str
    details: Optional[str] = None
    value: Optional[int] = None
