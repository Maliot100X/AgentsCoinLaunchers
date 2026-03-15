@echo off
REM Comprehensive test suite for AgentsCoinLaunchers

echo.
echo ==========================================
echo   AgentsCoinLaunchers Test Suite
echo ==========================================
echo.

echo Test 1: Checking environment files...
if exist ".env.local" (
    echo   ✓ Root .env.local exists
) else (
    echo   ✗ Root .env.local missing
)

if exist "packages\api\.env.local" (
    echo   ✓ API .env.local exists
) else (
    echo   ✗ API .env.local missing
)

if exist "packages\bot\.env.local" (
    echo   ✓ Bot .env.local exists
) else (
    echo   ✗ Bot .env.local missing
)

if exist "packages\web\.env.local" (
    echo   ✓ Web .env.local exists
) else (
    echo   ✗ Web .env.local missing
)

echo.
echo Test 2: Website build check...
cd packages\web
call npm run build >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ Website builds successfully
) else (
    echo   ✗ Website build failed
)
cd ..\..

echo.
echo Test 3: Bot syntax check...
cd packages\bot
node -c index.js >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ Bot syntax is valid
) else (
    echo   ✗ Bot syntax error
)
cd ..\..

echo.
echo Test 4: API file check...
cd packages\api
if exist "index.js" (
    echo   ✓ API file exists
    node -c index.js >nul 2>&1
    if %errorlevel% equ 0 (
        echo   ✓ API syntax is valid
    ) else (
        echo   ✗ API syntax error
    )
) else (
    echo   ✗ API file missing
)
cd ..\..

echo.
echo ==========================================
echo   Test Summary
echo ==========================================
echo.
echo All tests completed!
echo.
echo Next steps:
echo   1. Run: start-all.bat (start all services)
echo   2. Or run individual services:
echo      - start-api.bat
echo      - start-web.bat
echo      - start-bot.bat
echo.
pause
