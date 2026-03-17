@echo off
setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║            AgentsCoinLaunchers - Quick Test All Systems           ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.

REM Check if dev server is running
set "PORT="
for /L %%P in (3000,1,3010) do (
    powershell -Command "try { $test = Invoke-WebRequest -Uri 'http://localhost:%%P' -TimeoutSec 1 -ErrorAction Stop; exit 0 } catch { exit 1 }" >nul 2>&1
    if !errorlevel! equ 0 (
        set "PORT=%%P"
        goto found_port
    )
)

:not_found
echo.
echo ❌ Dev server not running on ports 3000-3010!
echo.
echo To start the dev server:
echo   cd packages\web
echo   npm run dev
echo.
echo Then run this script again.
echo.
pause
exit /b 1

:found_port
echo ✓ Found dev server on port !PORT!
echo.
echo Testing API Endpoints...
echo.

REM Test 1: Stats API
echo 1. Testing Stats API (http://localhost:!PORT!/api/stats):
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:!PORT!/api/stats' -TimeoutSec 5 -ErrorAction Stop; Write-Host '   Response: '$response.Content.Substring(0,[System.Math]::Min(200,$response.Content.Length)); Write-Host '   Status: ✓ OK' -ForegroundColor Green } catch { Write-Host '   Status: ✗ FAILED' -ForegroundColor Red; Write-Host '   Error: '$_.Exception.Message }"
echo.

REM Test 2: Leaderboard API
echo 2. Testing Leaderboard API (http://localhost:!PORT!/api/leaderboard):
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:!PORT!/api/leaderboard' -TimeoutSec 5 -ErrorAction Stop; Write-Host '   Response: '$response.Content.Substring(0,[System.Math]::Min(200,$response.Content.Length)); Write-Host '   Status: ✓ OK' -ForegroundColor Green } catch { Write-Host '   Status: ✗ FAILED' -ForegroundColor Red; Write-Host '   Error: '$_.Exception.Message }"
echo.

REM Test 3: Bags Launch Feed API
echo 3. Testing Bags Launch Feed (http://localhost:!PORT!/api/bags/launch-feed):
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:!PORT!/api/bags/launch-feed' -TimeoutSec 5 -ErrorAction Stop; Write-Host '   Response: '$response.Content.Substring(0,[System.Math]::Min(200,$response.Content.Length)); Write-Host '   Status: ✓ OK' -ForegroundColor Green } catch { Write-Host '   Status: ✗ FAILED' -ForegroundColor Red; Write-Host '   Error: '$_.Exception.Message }"
echo.

REM Test 4: Homepage
echo 4. Testing Homepage (http://localhost:!PORT!/):
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:!PORT!/' -TimeoutSec 5 -ErrorAction Stop; if ($response.StatusCode -eq 200) { Write-Host '   Status: ✓ OK (200)' -ForegroundColor Green } else { Write-Host '   Status: ⚠ Warning (' $response.StatusCode ')' -ForegroundColor Yellow } } catch { Write-Host '   Status: ✗ FAILED' -ForegroundColor Red; Write-Host '   Error: '$_.Exception.Message }"
echo.

REM Test 5: Health Check
echo 5. Testing Health Check (http://localhost:!PORT!/api/health):
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:!PORT!/api/health' -TimeoutSec 5 -ErrorAction Stop; Write-Host '   Response: '$response.Content; Write-Host '   Status: ✓ OK' -ForegroundColor Green } catch { Write-Host '   Status: ✗ FAILED' -ForegroundColor Red; Write-Host '   Error: '$_.Exception.Message }"
echo.

echo ╔════════════════════════════════════════════════════════════════════╗
echo ║                    Test Summary Complete ✓                        ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.
echo Open in browser: http://localhost:!PORT!
echo.
pause
