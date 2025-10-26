@echo off
echo.
echo ========================================
echo    DIAGNOSTICO COMPLETO - ALY GESTION
echo ========================================
echo.

REM Verificar Backend
echo [1/5] Verificando Backend...
echo.
curl -s http://localhost:3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend esta corriendo en puerto 3001
) else (
    echo [ERROR] Backend NO esta corriendo
    echo         Ejecuta: cd backend ^&^& npm run dev
)
echo.

REM Verificar endpoint de clientes
echo [2/5] Verificando endpoint /api/clientes...
curl -s http://localhost:3001/api/clientes >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Endpoint de clientes responde
) else (
    echo [ERROR] Endpoint NO responde
)
echo.

REM Verificar Frontend
echo [3/5] Verificando Frontend...
curl -s http://localhost:9002 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend esta corriendo en puerto 9002
) else (
    echo [ERROR] Frontend NO esta corriendo
    echo         Ejecuta: npm run dev
)
echo.

REM Verificar archivos
echo [4/5] Verificando archivos criticos...
if exist "src\app\clients\page.tsx" (
    echo [OK] src\app\clients\page.tsx existe
) else (
    echo [ERROR] src\app\clients\page.tsx NO existe
)

if exist "src\components\clients\client-table.tsx" (
    echo [OK] src\components\clients\client-table.tsx existe
) else (
    echo [ERROR] src\components\clients\client-table.tsx NO existe
)

if exist "src\lib\api.ts" (
    echo [OK] src\lib\api.ts existe
) else (
    echo [ERROR] src\lib\api.ts NO existe
)

if exist "backend\src\index.ts" (
    echo [OK] backend\src\index.ts existe
) else (
    echo [ERROR] backend\src\index.ts NO existe
)
echo.

REM Verificar base de datos
echo [5/5] Verificando base de datos...
if exist "backend\dev.db" (
    echo [OK] Base de datos existe
) else (
    echo [ERROR] Base de datos NO existe
    echo         Ejecuta: cd backend ^&^& npx prisma migrate dev
)
echo.

echo ========================================
echo    DIAGNOSTICO COMPLETADO
echo ========================================
echo.
echo SIGUIENTES PASOS:
echo.
echo 1. Si hay errores arriba, sigue las instrucciones
echo 2. Abre http://localhost:9002 en tu navegador
echo 3. Presiona F12 para abrir DevTools
echo 4. Ve a la pestana Console
echo 5. Comparte cualquier error en ROJO que veas ahi
echo.
pause
