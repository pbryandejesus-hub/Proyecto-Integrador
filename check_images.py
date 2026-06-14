import sqlite3
from pathlib import Path

print("\n🔍 Verificando productos en BD...\n")

db = sqlite3.connect("store.db")
cursor = db.cursor()
cursor.execute("SELECT id, name, image_path FROM products")
productos = cursor.fetchall()

for id, name, image_path in productos:
    print(f"ID: {id} | Nombre: {name}")
    print(f"Imagen: {image_path}")
    if image_path and Path(image_path).exists():
        print(f"✅ Archivo existe\n")
    else:
        print(f"⚠️  Archivo NO encontrado\n")

db.close()
print("✅ Verificación completada")
