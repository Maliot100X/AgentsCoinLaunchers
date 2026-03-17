# WINDOWS - Quick Test Instructions

## 🪟 How to Run Tests (3 Easy Ways)

### **Method 1: Double-Click (EASIEST)**
1. Open File Explorer
2. Navigate to: `agentscoinlaunchers` folder
3. **Double-click** `QUICKTEST_ALL.bat`
4. A terminal window opens and runs all tests
5. Press any key when done

---

### **Method 2: Command Prompt**
1. **Press:** `Win + R`
2. **Type:** `cmd`
3. **Press:** `Enter`
4. **Type:**
```cmd
cd Desktop\fulltires\agentscoinlaunchers
QUICKTEST_ALL.bat
```
5. **Press:** `Enter`

---

### **Method 3: Windows Terminal / PowerShell**
1. **Press:** `Win + X` then `T` (for Terminal) or `I` (for PowerShell)
2. **Type:**
```cmd
cd Desktop\fulltires\agentscoinlaunchers
.\QUICKTEST_ALL.bat
```
3. **Press:** `Enter`

---

## ⚠️ IMPORTANT: Start Dev Server FIRST!

Before running the test, you MUST start the development server:

### **Option A: Using Terminal**
```cmd
cd Desktop\fulltires\agentscoinlaunchers\packages\web
npm run dev
```

### **Option B: Using VS Code**
1. Open folder: `agentscoinlaunchers`
2. Open terminal: `Ctrl + ` (backtick)
3. Run: `npm run dev` (from packages/web directory)

---

## What Happens When You Run QUICKTEST_ALL.bat

```
╔════════════════════════════════════════════════════════════════════╗
║        AgentsCoinLaunchers - Windows Quick Test                   ║
╚════════════════════════════════════════════════════════════════════╝

Searching for dev server on ports 3000-3010...

FOUND DEV SERVER ON PORT: 3002
URL: http://localhost:3002

========================================================================
Testing API Endpoints
========================================================================

[TEST 1] Stats API
URL: http://localhost:3002/api/stats
{"tokens":3,"totalVolume":950000000000,"users":3,"status":"demo"}

[TEST 2] Leaderboard API
URL: http://localhost:3002/api/leaderboard
[Shows agent data...]

[TEST 3] Bags Launch Feed API
URL: http://localhost:3002/api/bags/launch-feed
[Shows token launch data...]

[TEST 4] Health Check
URL: http://localhost:3002/api/health
{"status":"ok"}

[TEST 5] Homepage
URL: http://localhost:3002/
Status: 200

╔════════════════════════════════════════════════════════════════════╗
║                    TESTS COMPLETE                                  ║
║                                                                    ║
║  Open http://localhost:3002 in your browser                       ║
╚════════════════════════════════════════════════════════════════════╝
```

---

## What Gets Tested

| # | Test | URL | Purpose |
|---|------|-----|---------|
| 1 | **Stats API** | `/api/stats` | Token count, volume, user count |
| 2 | **Leaderboard** | `/api/leaderboard` | Top agents and their tokens |
| 3 | **Bags Feed** | `/api/bags/launch-feed` | Real token launches |
| 4 | **Health** | `/api/health` | System status check |
| 5 | **Homepage** | `/` | Page loads correctly |

---

## ✅ If All Tests Pass

The output will show the JSON responses from each API. Open your browser:

```
http://localhost:3002
```

(Replace `3002` with whatever port shows in the test output)

---

## ❌ If Tests FAIL

### **"Dev server not found on ports 3000-3010"**
- Dev server is NOT running
- **Fix:** Start it first (see "Start Dev Server FIRST!" section above)

### **"Connection refused"**
- Dev server crashed
- **Fix:** 
  1. Stop the dev server (Ctrl+C in its terminal)
  2. Restart: `npm run dev` in `packages\web` folder

### **"curl is not recognized"**
- Windows doesn't have curl installed (rare)
- **Fix:** Install Node.js from nodejs.org (includes curl)

### **Port already in use**
- Another app is using port 3000
- **Fix:** Dev server will auto-try 3001, 3002, etc. Script will find it!

---

## 🔄 Quick Restart Sequence

If something breaks:

```cmd
REM In the terminal where npm run dev is running:
Ctrl + C

REM Wait 2 seconds, then:
npm run dev

REM In another terminal:
cd Desktop\fulltires\agentscoinlaunchers
QUICKTEST_ALL.bat
```

---

## 📝 File Locations

```
Desktop/
└── fulltires/
    └── agentscoinlaunchers/
        ├── QUICKTEST_ALL.bat          ← RUN THIS FILE
        ├── packages/
        │   └── web/
        │       ├── package.json
        │       └── (npm run dev here)
        └── ...
```

---

## 💡 Tips

- **Test Anytime:** Run the test script whenever you want to verify everything works
- **Multiple Terminals:** Keep dev server in one terminal, run tests in another
- **Visual Check:** Open http://localhost:3002 in browser after tests pass
- **No Browser?** Test output shows all API responses in terminal

---

## Still Having Issues?

Check if `curl` is working:
```cmd
curl --version
```

If it says "command not found", reinstall Node.js from https://nodejs.org/

