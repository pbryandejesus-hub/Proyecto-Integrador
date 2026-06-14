# 🔧 MANTENER SERVIDOR EJECUTÁNDOSE

El servidor FastAPI debe estar corriendo para que el admin panel funcione.

## Problema: "Failed to fetch"
Esto significa que el servidor FastAPI en puerto 8000 no está ejecutándose.

---

## ✅ Soluciones

### OPCIÓN 1: Script Batch (Recomendado para Windows)
Es la opción más sencilla. El servidor se reinicia automáticamente si se detiene.

**Pasos:**
1. Haz doble clic en: `START_SERVER.bat`
2. Se abrirá una ventana de comando
3. Verás: "Iniciando servidor FastAPI..."
4. El servidor estará listo cuando veas: "Application startup complete"

**Mientras esté abierta esta ventana, el servidor estará funcionando.**

---

### OPCIÓN 2: PowerShell (Manual)

```powershell
.venv\Scripts\python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

Mantén esta ventana abierta mientras uses la tienda.

---

### OPCIÓN 3: Python Keep-Alive (Auto-reinicia si falla)

```powershell
.venv\Scripts\python.exe server_keepalive.py
```

Este script reinicia automáticamente el servidor si se detiene.

---

## 🚀 Cómo Usar la Tienda

1. **Abre una terminal** y ejecuta uno de los scripts arriba (recomendado: START_SERVER.bat)
2. **Espera** hasta ver "Application startup complete"
3. **Accede en el navegador:**
   - Tienda: http://localhost:8000/frontend/index.html
   - Admin: http://localhost:8000/frontend/admin.html

---

## 🔑 Credenciales Admin

- **Usuario:** admin
- **Contraseña:** Admin123

---

## ⛔ Para Detener el Servidor

**En la ventana del servidor:**
1. Presiona `Ctrl + C`
2. La ventana se cerrará

**El servidor se detendrá inmediatamente.**

---

## 🔍 Verificar que el Servidor está Funcionando

En PowerShell:
```powershell
$status = curl.exe -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/products
if ($status -eq "200") { Write-Host "✅ Servidor OK" } else { Write-Host "❌ Servidor DOWN" }
```

---

## 📋 Checklist

- [ ] Terminal/CMD abierto con el servidor ejecutándose
- [ ] Vemos "Application startup complete"
- [ ] Visitamos http://localhost:8000/frontend/admin.html
- [ ] Login funciona (admin/Admin123)
- [ ] Dashboard carga con gráficos
- [ ] Productos cargan correctamente
- [ ] Imágenes se ven

---

## ❓ Troubleshooting

### "Puerto 8000 ya está en uso"
El servidor ya está corriendo en otra ventana o proceso.

Solución:
```powershell
netstat -ano | Select-String ":8000"
```

Busca el PID (último número) y ciérralo:
```powershell
Stop-Process -Id <PID>
```

### "ModuleNotFoundError: No module named 'fastapi'"
Las dependencias no están instaladas.

Solución:
```powershell
pip install -r backend/requirements.txt
```

### "Conexión rechazada"
El servidor no está ejecutándose. Abre una terminal y ejecuta START_SERVER.bat

---

**💡 Recomendación:** Usa `START_SERVER.bat` es lo más sencillo y confiable.
