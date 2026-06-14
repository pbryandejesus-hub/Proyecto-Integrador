#!/bin/bash
# Script para ejecutar el proyecto Moda Urbana

echo "=== Moda Urbana - Setup Script ==="
echo ""

# Crear entorno virtual
echo "1. Creando entorno virtual..."
python -m venv .venv

# Activar entorno virtual
echo "2. Activando entorno virtual..."
.\.venv\Scripts\Activate.ps1

# Instalar dependencias
echo "3. Instalando dependencias..."
pip install --upgrade pip
pip install -r backend/requirements.txt

# Crear base de datos
echo "4. Inicializando base de datos..."
python -c "from backend.database import Base, engine; Base.metadata.create_all(bind=engine)"

# Iniciar servidor
echo "5. Iniciando servidor FastAPI..."
echo "El servidor estará disponible en http://localhost:8000"
echo "Panel administrativo: http://localhost:8000/admin.html"
echo ""
echo "Credenciales de prueba:"
echo "- Usuario: admin"
echo "- Contraseña: Admin123"
echo ""

uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
