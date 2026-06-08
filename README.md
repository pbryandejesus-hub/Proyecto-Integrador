# Proyecto Integrador — Moda Urbana

Este repositorio contiene un frontend estático y un backend MVP en FastAPI para una tienda de ropa.

## Estructura

- `frontend/` — HTML, CSS y JS (UI, validaciones, carrito, panel admin con Chart.js).
- `backend/` — FastAPI, SQLAlchemy y SQLite (usuarios, leads, productos).

## Requisitos

- Python 3.10+
- Node no es necesario (frontend estático).

## Instalación y ejecución (local)

1. Crear y activar un entorno virtual:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Instalar dependencias:

```powershell
pip install -r backend/requirements.txt
```

3. Ejecutar la API (desde la raíz del proyecto):

```powershell
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

4. Abrir el frontend en el navegador (archivo estático):

- Abrir `frontend/index.html` directamente (por ejemplo arrastrando el archivo al navegador) o
- Servir la carpeta `frontend` con un servidor estático (p. ej. `npx serve frontend` o `python -m http.server` desde la carpeta `frontend`).

5. Panel administrativo:

- Abrir `frontend/admin.html` y acceder con las credenciales de semilla:
  - admin / Admin123 (rol: Administrador)
  - cliente / Cliente123 (rol: Cliente)

## Endpoints principales

- `GET /api/products` — Listado de productos
- `POST /api/contact` — Crear lead
- `POST /api/auth/login` — Autenticación simple
- `GET /api/admin/stats` — Estadísticas (leads, productos)
- `GET /api/admin/leads` — Últimos leads
- `GET /api/admin/products` — Productos (para edición)
- `PUT /api/admin/products/{id}` — Actualizar producto
- `POST /api/admin/products/{id}/image` — Subir imagen del producto
- `POST /api/analytics` — Recibir eventos (analítica)

La documentación interactiva de la API está disponible en `/docs` cuando el servidor FastAPI está en ejecución.

## Notas técnicas y cumplimiento de requisitos

- UX: Validaciones en cliente, selectores cerrados (talles/colores), mensajes claros.
- UI: Metodología BEM y variables `:root` en `frontend/styles.css`.
- Interactividad: `EventListener` y manipulación con `classList`.
- Persistencia: `localStorage` para theme y `sessionStorage` para carrito/usuario admin.
- Backend: FastAPI + SQLite; tablas `users`, `products`, `leads` definidas en `backend/models.py`.
- CORS: Configurado para permitir el desarrollo local.
- Admin: Panel con Chart.js consumiendo datos del backend.
- Legal: Banner de cookies y enlace a `terms.html` incluido.
- 
