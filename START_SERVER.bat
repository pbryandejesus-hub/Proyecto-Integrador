@echo off
REM Script para ejecutar el servidor FastAPI continuamente
REM Si el servidor se detiene, se reinicia automáticamente

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo SERVIDOR MODA URBANA - Keep-Alive
echo ============================================================
echo.
echo Este script mantiene el servidor ejecutandose
echo Presione Ctrl+C para detener
echo.
echo ============================================================
echo.

set RESTART_COUNT=0

:LOOP
set /a RESTART_COUNT+=1

if %RESTART_COUNT% GTR 1 (
    echo.
    echo [%date% %time%] Reiniciando servidor (intento %RESTART_COUNT%)...
    timeout /t 3 /nobreak
    echo.
)

echo [%date% %time%] Iniciando servidor FastAPI...
echo Puerto: 8000
echo URL: http://localhost:8000
echo.

.venv\Scripts\python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000

echo.
echo [%date% %time%] Servidor se detuvo
echo.

if %RESTART_COUNT% LSS 100 (
    goto LOOP
) else (
    echo Maximo de reintentos alcanzado
)

pause
