# Guía Rápida - Moda Urbana

## 🚀 Inicio Rápido (3 pasos)

### Paso 1: Configurar entorno
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

### Paso 2: Ejecutar servidor
```powershell
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Paso 3: Acceder
- **Tienda:** http://localhost:8000 → Espera o sirve `frontend/index.html`
- **Admin:** http://localhost:8000 → Espera o sirve `frontend/admin.html`
- **Docs API:** http://localhost:8000/docs

## 🔐 Credenciales
- Admin: `admin` / `Admin123`
- Cliente: `cliente` / `Cliente123`

## 📋 Tareas Completadas

✅ **Frontend Mejorado**
- Diseño moderno con colores urbanos
- Secciones nuevas: Beneficios, Testimonios
- Animaciones suaves
- Hero section atractiva
- Responsive design

✅ **Imágenes**
- SVG escalables para productos
- Imágenes temáticas (Remera, Saco, Pantalón, Hoodie)
- Hero image con branding
- Fallback automático

✅ **Panel Admin Funcional**
- ✅ Login con validación de rol
- ✅ Dashboard con estadísticas
- ✅ Gráficos de analytics
- ✅ Edición de productos
- ✅ Carga de imágenes
- ✅ Tabla de mensajes
- ✅ Sesión persistente

## 🎯 Funcionalidades Principales

### Tienda
- Catálogo de productos
- Filtros por talle y color
- Carrito de compras
- Formulario de contacto
- Tema oscuro
- Banner de cookies

### Admin
- Autenticación segura
- Métricas en tiempo real
- Edición de productos inline
- Upload de imágenes
- Gestión de leads
- Logout

## 🛠️ Troubleshooting

Si las dependencias no se instalan, intenta:
```powershell
pip install --upgrade pip
pip install fastapi uvicorn sqlalchemy pydantic email-validator python-multipart
```

Si hay problemas con CORS:
- El backend está configurado para CORS abierto en desarrollo
- Verifica que el puerto 8000 esté disponible

¡Listo! Tu tienda de moda urbana está lista. 🎉
