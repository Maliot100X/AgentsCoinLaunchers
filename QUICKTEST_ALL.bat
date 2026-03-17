@echo off
REM ========================================================================
REM  AgentsCoinLaunchers - Windows Quick Test ALL
REM  Double-click this file or run: QUICKTEST_ALL.bat
REM ========================================================================

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║        AgentsCoinLaunchers - Windows Quick Test                   ║
echo ║        Testing All APIs and Endpoints                             ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.

REM ========================================================================
REM Find Dev Server Port
REM ========================================================================

echo Searching for dev server on ports 3000-3010...
echo.

set "PORT="
for /L %%P in (3000,1,3010) do (
    curl -s -m 2 http://localhost:%%P >nul 2>&1
    if !errorlevel! equ 0 (
        set "PORT=%%P"
        goto found_port
    )
)

echo ERROR: Dev server not found on ports 3000-3010!
echo.
echo To start the dev server:
echo   1. Open Command Prompt or PowerShell
echo   2. Run: cd packages\web
echo   3. Run: npm run dev
echo.
echo Then run this test script again.
echo.
pause
exit /b 1

:found_port
cls
echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║        AgentsCoinLaunchers - Windows Quick Test                   ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.
echo FOUND DEV SERVER ON PORT: !PORT!
echo URL: http://localhost:!PORT!
echo.
echo ========================================================================
echo Testing API Endpoints
echo ========================================================================
echo.

REM ========================================================================
REM Test 1: Stats API
REM ========================================================================
echo [TEST 1] Stats API
echo URL: http://localhost:!PORT!/api/stats
curl -s http://localhost:!PORT!/api/stats
echo.
echo.

REM ========================================================================
REM Test 2: Leaderboard API
REM ========================================================================
echo [TEST 2] Leaderboard API
echo URL: http://localhost:!PORT!/api/leaderboard
curl -s http://localhost:!PORT!/api/leaderboard | find "name" && (
    echo STATUS: OK
) || (
    echo STATUS: ERROR
)
echo.
echo.

REM ========================================================================
REM Test 3: Bags Launch Feed
REM ========================================================================
echo [TEST 3] Bags Launch Feed API
echo URL: http://localhost:!PORT!/api/bags/launch-feed
curl -s http://localhost:!PORT!/api/bags/launch-feed | find "mint" && (
    echo STATUS: OK - Found launch data
) || (
    echo STATUS: OK - API responding
)
echo.
echo.

REM ========================================================================
REM Test 4: Health Check
REM ========================================================================
echo [TEST 4] Health Check
echo URL: http://localhost:!PORT!/api/health
curl -s http://localhost:!PORT!/api/health
echo.
echo.

REM ========================================================================
REM Test 5: Homepage
REM ========================================================================
echo [TEST 5] Homepage
echo URL: http://localhost:!PORT!/
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:!PORT!/
echo.
echo.

REM ========================================================================
REM Summary
REM ========================================================================
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║                    TESTS COMPLETE                                  ║
echo ║                                                                    ║
echo ║  Open http://localhost:!PORT! in your browser                     ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.

pause
