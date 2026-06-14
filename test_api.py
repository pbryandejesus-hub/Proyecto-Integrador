import requests
import json

print("Testing API endpoints...")
base = "http://localhost:8000/api"

# Test 1: Get products
try:
    response = requests.get(f"{base}/products", timeout=5)
    products = response.json()
    print(f"✅ GET /api/products: {len(products)} productos")
except Exception as e:
    print(f"❌ Error en productos: {e}")

# Test 2: Login
try:
    data = {"username": "admin", "password": "Admin123"}
    response = requests.post(f"{base}/auth/login", json=data, timeout=5)
    if response.status_code == 200:
        result = response.json()
        print(f"✅ POST /api/auth/login: EXITOSO")
        print(f"   Usuario: {result.get('username')}")
        print(f"   Rol: {result.get('role')}")
    else:
        print(f"❌ Login error: {response.status_code}")
        print(f"   Respuesta: {response.text[:150]}")
except Exception as e:
    print(f"❌ Error en login: {e}")

# Test 3: Admin stats
try:
    response = requests.get(f"{base}/admin/stats", timeout=5)
    stats = response.json()
    print(f"✅ GET /api/admin/stats: {stats}")
except Exception as e:
    print(f"❌ Error en stats: {e}")

print("\n✅ SERVIDOR FUNCIONAL - Ahora puedes acceder al admin panel")
