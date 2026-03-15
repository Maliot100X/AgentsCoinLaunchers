@echo off
REM Start only the Website on port 3000

echo Cleaning up port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F 2>nul

echo.
echo Starting Website on port 3000...
echo.

cd packages\web
npm run dev
