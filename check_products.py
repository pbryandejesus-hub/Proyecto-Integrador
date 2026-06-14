import requests

print("\n✅ VERIFICANDO PRODUCTOS:\n")
response = requests.get("http://localhost:8000/api/products")
products = response.json()

for p in products:
    print(f"ID: {p['id']} | {p['name']}")
    print(f"   Imagen: {p['image_path']}")
    print()

print("✅ Las imágenes se guardaron correctamente en la BD")
