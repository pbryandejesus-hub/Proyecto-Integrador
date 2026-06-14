# Proyecto Integrador — Moda Urbana

Tienda de ropa online con frontend moderno, backend en FastAPI y panel administrativo completo.

## ✨ Mejoras Implementadas

### Frontend UI/UX
- ✅ Diseño moderno y atractivo con paleta de colores urbana
- ✅ Secciones mejoradas: Hero, Colección, Beneficios, Testimonios
- ✅ Animaciones y transiciones suaves
- ✅ Responsividad mejorada para móviles y tablets
- ✅ Modo oscuro funcional con localStorage
- ✅ Carrito de compras persistente con sessionStorage

### Imágenes
- ✅ Imágenes SVG de alta calidad para productos
- ✅ Hero section atractiva con branding
- ✅ Imágenes temáticas: Remera, Saco, Pantalón, Hoodie
- ✅ Fallback automático para imágenes no disponibles

### Panel Administrativo
- ✅ Login seguro con rol de administrador
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gráficos de analytics con Chart.js
- ✅ Edición de productos en vivo
- ✅ Carga de imágenes para productos
- ✅ Tabla de mensajes/leads
- ✅ Sesión persistente en navegador

## 📁 Estructura

```
.
├── frontend/
│   ├── index.html           # Página principal
│   ├── admin.html           # Panel administrativo
│   ├── checkout.html        # Página de pago
│   ├── terms.html           # Términos y condiciones
│   ├── app.js               # Lógica principal tienda
│   ├── admin.js             # Lógica panel admin
│   ├── styles.css           # Estilos mejorados
│   └── assets/
│       └── images/
│           ├── hero.svg
│           └── productos/
│               ├── remera_01.svg
│               ├── saco_01.svg
│               ├── pantalon_01.svg
│               └── hoodie_01.svg
├── backend/
│   ├── main.py              # Endpoints FastAPI
│   ├── models.py            # Modelos SQLAlchemy
│   ├── schemas.py           # Esquemas Pydantic
│   ├── database.py          # Configuración DB
│   └── requirements.txt
├── store.db                 # Base de datos SQLite
├── README.md
└── RUN.ps1                  # Script de ejecución

```

## 🚀 Instalación y Ejecución

### ⚠️ IMPORTANTE: El servidor debe estar ejecutándose

El proyecto requiere que el servidor FastAPI esté corriendo en puerto 8000. 

**Para mantener el servidor ejecutándose:**

#### Opción 1: Batch Script (Recomendado) ⭐
```bash
START_SERVER.bat
```
Este script reinicia automáticamente el servidor si se detiene.

#### Opción 2: PowerShell Manual
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

#### Opción 3: Python Keep-Alive
```powershell
.venv\Scripts\python.exe server_keepalive.py
```

**Mantén esta ventana abierta** mientras uses la tienda. El servidor debe estar ejecutándose para que el admin panel funcione.

### Ver documentación completa en `SERVIDOR.md`

## 🔐 Credenciales de Prueba

### Administrador
- **Usuario:** admin
- **Contraseña:** Admin123

### Cliente
- **Usuario:** cliente
- **Contraseña:** Cliente123

## 📡 Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listado de productos |
| POST | `/api/contact` | Crear consulta/lead |
| POST | `/api/auth/login` | Autenticación |
| GET | `/api/admin/stats` | Estadísticas (admin) |
| GET | `/api/admin/leads` | Últimos mensajes (admin) |
| GET | `/api/admin/products` | Productos para editar (admin) |
| PUT | `/api/admin/products/{id}` | Actualizar producto (admin) |
| POST | `/api/admin/products/{id}/image` | Subir imagen (admin) |
| POST | `/api/analytics` | Registrar eventos |

## 🎨 Características UI/UX

### Tienda Principal
- Hero section con imagen de impacto
- Catálogo de productos con filtros por talle y color
- Carrito de compras con interfaz intuitiva
- Formulario de contacto con validaciones
- Banner de cookies
- Footer con enlaces legales
- Tema oscuro toggle

### Panel Administrativo
- Autenticación con validación de rol
- Dashboard con métricas
- Gráfico de mensajes recibidos
- Editor de productos inline
- Carga de imágenes
- Tabla de leads
- Logout seguro

## 🛠️ Tecnologías Utilizadas

**Frontend:**
- HTML5 semántico
- CSS3 (Grid, Flexbox, Animaciones)
- JavaScript vanilla (sin frameworks)
- Chart.js para gráficos

**Backend:**
- FastAPI
- SQLAlchemy ORM
- SQLite
- Pydantic

## 📋 Requisitos

- Python 3.10+
- Node.js no requerido (frontend estático)

## 🔧 Configuración CORS

El backend permite CORS desde cualquier origen para facilitar el desarrollo local.

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📝 Notas Técnicas

- ✅ **BEM CSS:** Metodología aplicada en estilos
- ✅ **Validaciones:** Frontend y backend
- ✅ **Seguridad:** Hashing de contraseñas SHA256
- ✅ **Persistencia:** localStorage para tema, sessionStorage para carrito
- ✅ **Accesibilidad:** Atributos ARIA, etiquetas semánticas
- ✅ **Responsividad:** Mobile-first, breakpoints en 768px
- ✅ **SVG Images:** Formato escalable para productos

## 🚨 Troubleshooting

**Error: "No se puede conectar a la API"**
- Asegurar que el servidor esté ejecutándose en puerto 8000
- Verificar CORS en backend

**Error: "Imagen no disponible"**
- Las imágenes SVG tienen fallback automático
- Verificar ruta en `frontend/assets/images/`

**Base de datos vacía**
- El backend crea automáticamente tablas y datos de prueba al iniciar
- Si no aparecen, eliminar `store.db` y reiniciar

## 📄 Licencia

Proyecto educativo - Programación III - Universidad del Norte

