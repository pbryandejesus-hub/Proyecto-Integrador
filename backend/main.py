from datetime import datetime
from pathlib import Path
from typing import Dict, List
import hashlib
import shutil

from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, SessionLocal, engine
from .models import Lead, Product, User
from .schemas import (
    AdminStats,
    AnalyticsPayload,
    AuthRequest,
    AuthResponse,
    LeadCreate,
    LeadOut,
    ProductOut,
    ProductUpdate,
)

app = FastAPI(
    title="API Tienda de Ropa",
    description="Backend de tienda de ropa con catálogo, leads, roles y estadísticas.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


IMAGES_DIR = Path(__file__).resolve().parent.parent / "frontend" / "assets" / "images" / "productos"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)


def seed_users(db: Session) -> None:
    existing_usernames = {user.username for user in db.query(User).all()}

    users = [
        {
            "username": "admin",
            "password_hash": hash_password("Admin123"),
            "role": "Administrador",
        },
        {
            "username": "cliente",
            "password_hash": hash_password("Cliente123"),
            "role": "Cliente",
        },
        {
            "username": "prueba",
            "password_hash": hash_password("prueba"),
            "role": "Administrador",
        },
    ]

    for user_data in users:
        if user_data["username"] not in existing_usernames:
            user = User(**user_data)
            db.add(user)

    if not db.new:
        return

    db.commit()


def seed_products(db: Session) -> None:
    if db.query(Product).first():
        return

    sample_products = [
        {
            "name": "Remera Terracota",
            "category": "Camiseta",
            "description": "Remera suave con corte moderno y estampado minimalista.",
            "price": "$45.990",
            "image_path": "assets/images/productos/remera_01.webp",
            "sizes": "S,M,L",
            "colors": "Terracota,Negro,Beige",
            "stock": 18,
        },
        {
            "name": "Saco Ejecutivo",
            "category": "Saco",
            "description": "Saco semi-formal con forro cómodo y acabado premium.",
            "price": "$89.990",
            "image_path": "assets/images/productos/saco_01.webp",
            "sizes": "S,M,L",
            "colors": "Azul Marino,Gris,Negro",
            "stock": 12,
        },
        {
            "name": "Pantalón Chino",
            "category": "Pantalón",
            "description": "Pantalón chino de corte ajustado, ideal para looks casuales o formales.",
            "price": "$59.990",
            "image_path": "assets/images/productos/pantalon_01.webp",
            "sizes": "S,M,L",
            "colors": "Verde Oliva,Beige,Negro",
            "stock": 20,
        },
    ]
    for product_data in sample_products:
        product = Product(**product_data)
        db.add(product)
    db.commit()


@app.on_event("startup")
def startup_event() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_users(db)
    seed_products(db)
    db.close()


@app.get("/api/products", response_model=List[ProductOut])
def get_products(db: Session = Depends(get_db)) -> List[ProductOut]:
    products = db.query(Product).all()
    return [
        ProductOut(
            id=item.id,
            name=item.name,
            category=item.category,
            description=item.description,
            price=item.price,
            image_path=item.image_path,
            sizes=item.sizes.split(","),
            colors=item.colors.split(","),
            stock=item.stock,
        )
        for item in products
    ]


@app.post("/api/contact", response_model=LeadOut)
def create_lead(data: LeadCreate, db: Session = Depends(get_db)) -> LeadOut:
    lead = Lead(name=data.name, email=data.email, message=data.message)
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


@app.post("/api/auth/login", response_model=AuthResponse)
def login(data: AuthRequest, db: Session = Depends(get_db)) -> AuthResponse:
    user = db.query(User).filter(User.username == data.username).first()
    if not user or user.password_hash != hash_password(data.password):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    return AuthResponse(username=user.username, role=user.role, message="Acceso validado")


@app.get("/api/admin/stats", response_model=Dict[str, int])
def admin_stats(db: Session = Depends(get_db)) -> Dict[str, int]:
    leads_count = db.query(Lead).count()
    products_count = db.query(Product).count()
    return {
        "leads_count": leads_count,
        "products_count": products_count,
    }


@app.get("/api/admin/leads", response_model=List[LeadOut])
def admin_leads(db: Session = Depends(get_db)) -> List[LeadOut]:
    leads = db.query(Lead).order_by(Lead.created_at.desc()).limit(10).all()
    return leads


@app.get("/api/admin/products", response_model=List[ProductOut])
def admin_products(db: Session = Depends(get_db)) -> List[ProductOut]:
    products = db.query(Product).all()
    return [
        ProductOut(
            id=item.id,
            name=item.name,
            category=item.category,
            description=item.description,
            price=item.price,
            image_path=item.image_path,
            sizes=item.sizes.split(","),
            colors=item.colors.split(","),
            stock=item.stock,
        )
        for item in products
    ]


@app.put("/api/admin/products/{product_id}", response_model=ProductOut)
def update_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db)) -> ProductOut:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    if data.name is not None:
        product.name = data.name
    if data.category is not None:
        product.category = data.category
    if data.description is not None:
        product.description = data.description
    if data.price is not None:
        product.price = data.price
    if data.sizes is not None:
        product.sizes = ",".join(data.sizes)
    if data.colors is not None:
        product.colors = ",".join(data.colors)
    if data.stock is not None:
        product.stock = data.stock

    db.commit()
    db.refresh(product)
    return ProductOut(
        id=product.id,
        name=product.name,
        category=product.category,
        description=product.description,
        price=product.price,
        image_path=product.image_path,
        sizes=product.sizes.split(","),
        colors=product.colors.split(","),
        stock=product.stock,
    )


@app.post("/api/admin/products/{product_id}/image")
def upload_product_image(
    product_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> Dict[str, str]:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    extension = Path(image.filename).suffix.lower()
    if extension not in {".png", ".jpg", ".jpeg", ".webp", ".gif"}:
        raise HTTPException(status_code=400, detail="Formato de imagen no válido")

    filename = f"producto_{product_id}{extension}"
    save_path = IMAGES_DIR / filename
    with save_path.open("wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    product.image_path = f"assets/images/productos/{filename}"
    db.commit()
    db.refresh(product)
    return {
        "status": "ok",
        "image_path": product.image_path,
    }


@app.post("/api/analytics")
def analytics(payload: AnalyticsPayload) -> Dict[str, str]:
    return {"status": "ok", "event": payload.event}
