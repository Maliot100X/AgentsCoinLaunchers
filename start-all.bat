@echo off
REM Kill any existing node processes on ports 3000, 3001, 3002
echo Cleaning up ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do taskkill /PID %%a /F 2>nul

echo.
echo ==========================================
echo   AgentsCoinLaunchers - Full Stack Start
echo ==========================================
echo.

echo Starting API on port 3001...
cd packages\api
start npm start
timeout /t 3

echo.
echo Starting Website on port 3000...
cd ..\web
start npm run dev
timeout /t 3

echo.
echo Starting Telegram Bot...
cd ..\bot
npm start

echo.
echo All services are running!
echo.
echo Access:
echo   - Website: http://localhost:3000
echo   - API: http://localhost:3001/health
echo   - Bot: Check this terminal
echo.
