@echo off
REM Kill any existing node processes on port 3001
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F

echo.
echo Starting API on port 3001...
echo.

cd packages\api
npm start
