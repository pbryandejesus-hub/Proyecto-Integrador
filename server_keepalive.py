#!/usr/bin/env python
"""
Server Keep-Alive Script
Mantiene el servidor FastAPI ejecutándose y lo reinicia si se cae
"""
import subprocess
import time
import sys
from pathlib import Path

def start_server():
    """Inicia el servidor FastAPI"""
    print("=" * 60)
    print("🚀 INICIANDO SERVIDOR MODA URBANA")
    print("=" * 60)
    print(f"Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Puerto: 8000")
    print(f"URL: http://localhost:8000")
    print("=" * 60)
    print()
    
    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "backend.main:app",
        "--host", "0.0.0.0",
        "--port", "8000"
    ]
    
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
    
    # Mostrar output del servidor
    try:
        for line in process.stdout:
            print(line.rstrip())
    except KeyboardInterrupt:
        print("\n\n" + "=" * 60)
        print("⛔ SERVIDOR DETENIDO POR USUARIO")
        print("=" * 60)
        process.terminate()
        sys.exit(0)
    
    return process.returncode

def keep_alive():
    """Loop que mantiene el servidor ejecutándose"""
    restart_count = 0
    
    while True:
        try:
            returncode = start_server()
            restart_count += 1
            
            print("\n" + "=" * 60)
            print(f"⚠️  SERVIDOR TERMINÓ (código: {returncode})")
            print(f"Reintentos: {restart_count}")
            print("Reiniciando en 3 segundos...")
            print("=" * 60)
            time.sleep(3)
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
            print("Reintentando en 5 segundos...")
            time.sleep(5)

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("GESTOR DE SERVIDOR - MODA URBANA")
    print("Este script mantiene el servidor ejecutándose")
    print("Presiona Ctrl+C para detener")
    print("=" * 60 + "\n")
    
    keep_alive()
