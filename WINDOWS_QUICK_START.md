# AgentsCoinLaunchers - Windows Quick Start Guide

## 🚀 Easy 3-Step Startup

### Step 1: Open Command Prompt
Press `Win + R`, type `cmd`, press Enter

### Step 2: Navigate to project
```cmd
cd C:\Users\PC\Desktop\fulltires\agentscoinlaunchers
```

### Step 3: Choose your option

---

## ⚡ Quick Start Options

### **Option A: Run Everything (Recommended)**
```cmd
start-all.bat
```
This will:
- Kill any processes using ports 3000, 3001, 3002
- Start API (port 3001)
- Start Website (port 3000 or 3002)
- Start Bot (terminal)

Access:
- Website: http://localhost:3000
- API: http://localhost:3001/health
- Bot: Check the last terminal window

---

### **Option B: Run Services Separately**

**Terminal 1 - Start API:**
```cmd
start-api.bat
```
✓ Runs on http://localhost:3001

**Terminal 2 - Start Website:**
```cmd
start-web.bat
```
✓ Runs on http://localhost:3000 (or 3002)

**Terminal 3 - Start Bot:**
```cmd
start-bot.bat
```
✓ Connects to Telegram API

---

### **Option C: Run Tests First**
```cmd
test-all.bat
```
This will verify:
- Environment files exist ✓
- Website builds successfully ✓
- Bot syntax is valid ✓
- API files are correct ✓

---

## 📋 Available Commands

```cmd
test-all.bat       → Run tests to verify everything
start-all.bat      → Start all 3 services
start-api.bat      → Start API only
start-web.bat      → Start Website only
start-bot.bat      → Start Bot only
```

---

## 🧪 What Gets Tested

Run `test-all.bat` to verify:

✓ Environment files (.env.local) exist
✓ Website builds without errors
✓ Bot code has valid syntax
✓ API file exists and is valid

---

## 🤖 Telegram Bot Commands

Once bot is running, send these on Telegram:

```
/start      → Welcome & menu
/help       → Help & commands
/launch     → Launch token
/swap       → Swap tokens
/wallet     → Check balance
/skills     → Browse skills
/claim      → Claim fees
/settings   → User settings
/history    → Transaction history
```

---

## 🔍 Troubleshooting

### Port Already in Use
The batch files automatically kill processes on ports 3000, 3001, 3002 before starting.

### Website Won't Start
1. Close any browser tabs on port 3000
2. Try: `start-web.bat`
3. If it says port in use, try 3002 (automatically tried)

### Bot Won't Connect
1. Check internet connection
2. Verify `.env.local` has real bot token
3. Bot token: `packages/bot/.env.local`

### API Won't Start
1. Check if port 3001 is in use
2. Run `start-api.bat` - it kills the port first

---

## 📁 Project Structure

```
C:\Users\PC\Desktop\fulltires\agentscoinlaunchers\
├── .env.local                    ✓ Root config
├── packages\api\.env.local       ✓ API config
├── packages\bot\.env.local       ✓ Bot token
├── packages\web\.env.local       ✓ Web config
├── test-all.bat                  ✓ Run tests
├── start-all.bat                 ✓ Start all
├── start-api.bat                 ✓ API only
├── start-web.bat                 ✓ Website only
└── start-bot.bat                 ✓ Bot only
```

---

## ✅ Quick Verification

1. **Test everything works:**
   ```cmd
   test-all.bat
   ```

2. **Start all services:**
   ```cmd
   start-all.bat
   ```

3. **Open website:**
   ```
   http://localhost:3000
   ```

4. **Check API:**
   ```
   http://localhost:3001/health
   ```

---

## 💡 Tips

- Keep each service in its own Command Prompt window
- API and Website run in background, Bot runs in foreground
- To stop a service: Close its Command Prompt window
- To stop all: Close all Command Prompt windows

---

## 📊 Expected Output

### test-all.bat
```
✓ Root .env.local exists
✓ API .env.local exists
✓ Bot .env.local exists
✓ Web .env.local exists
✓ Website builds successfully
✓ Bot syntax is valid
✓ API file exists
✓ API syntax is valid
```

### start-all.bat
```
Cleaning up ports...
Starting API on port 3001...
Starting Website on port 3000...
Starting Telegram Bot...
All services are running!

Access:
  - Website: http://localhost:3000
  - API: http://localhost:3001/health
  - Bot: Check this terminal
```

---

## 🚀 You're Ready!

Everything is set up and ready to go. Just run:

```cmd
start-all.bat
```

Enjoy! 🎉
