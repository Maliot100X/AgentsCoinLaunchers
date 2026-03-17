# Quick Test Scripts - Usage Guide

This directory contains three test scripts to verify your AgentsCoinLaunchers instance is running correctly.

## Quick Overview

| Script | Platform | How to Run | Best For |
|--------|----------|-----------|----------|
| `QUICKTEST_ALL.bat` | **Windows Command Prompt** | Double-click or `QUICKTEST_ALL.bat` | Windows users, easiest |
| `QUICKTEST_ADVANCED.sh` | **bash/WSL/Git Bash** | `bash QUICKTEST_ADVANCED.sh` or `./QUICKTEST_ADVANCED.sh` | Advanced users, detailed output |
| `QUICK_TEST.sh` | **bash** | `bash QUICK_TEST.sh` | Lightweight, simple test |

---

## Windows Users (Recommended)

### Option 1: Double-Click (Easiest)
```
1. Right-click QUICKTEST_ALL.bat
2. Click "Open"
3. A terminal window opens and runs all tests
4. Press any key when done
```

### Option 2: Command Prompt
```cmd
cd agentscoinlaunchers
QUICKTEST_ALL.bat
```

### Option 3: PowerShell
```powershell
cd agentscoinlaunchers
.\QUICKTEST_ALL.bat
```

---

## macOS/Linux Users

### Quick Test (Minimal)
```bash
cd agentscoinlaunchers
bash QUICK_TEST.sh
```

### Advanced Test (Recommended)
```bash
cd agentscoinlaunchers
bash QUICKTEST_ADVANCED.sh
# or if executable:
./QUICKTEST_ADVANCED.sh
```

### Make script executable once:
```bash
chmod +x QUICKTEST_ADVANCED.sh QUICK_TEST.sh
# Then you can run:
./QUICKTEST_ADVANCED.sh
```

---

## Windows Subsystem for Linux (WSL)

```bash
cd agentscoinlaunchers
bash QUICKTEST_ADVANCED.sh
```

---

## What These Scripts Test

All scripts test these endpoints:

1. **Stats API** (`/api/stats`)
   - Returns token count, volume, user count, status
   - Expected: JSON response with demo data if MongoDB unavailable

2. **Leaderboard API** (`/api/leaderboard`)
   - Returns top agents and their tokens
   - Expected: JSON array with agent data

3. **Bags Launch Feed** (`/api/bags/launch-feed`)
   - Real token launches from Bags.fm
   - Expected: JSON array with token launch data

4. **Health Check** (`/api/health`)
   - System status
   - Expected: JSON with status "ok" or "demo"

5. **Homepage** (`/`)
   - Homepage HTML
   - Expected: HTTP 200 with page title

---

## Before Running Tests

**Make sure dev server is running:**

```bash
cd packages/web
npm run dev
```

The server will start on port 3000-3010 (whichever is available).

---

## Understanding the Output

### ✓ (Green Check)
API endpoint is working and responding correctly.

### ⚠ (Yellow Warning)
API endpoint responded but with unexpected status code (still functional).

### ❌ (Red X)
API endpoint failed - check if dev server is running.

---

## Troubleshooting

### "Dev server not running!"
```bash
# Start it:
cd packages/web
npm run dev

# Then re-run the test script
```

### "Connection refused"
- Dev server crashed
- Restart: `cd packages/web && npm run dev`
- Port is blocked by another app
- Try killing previous Node processes:
  - **Windows:** `taskkill /im node.exe /f`
  - **macOS/Linux:** `killall node`

### "Port already in use"
- Another app is using port 3000
- Dev server will automatically try 3001, 3002, etc.
- The test scripts will automatically find the correct port

### MongoDB connection errors (expected in demo mode)
- This is normal! Demo mode provides fallback data
- You'll see `"status": "demo"` in stats API response
- To use real MongoDB, ensure `MONGODB_URI` is set in `.env.local`

---

## Example Output

### Windows (QUICKTEST_ALL.bat)
```
╔════════════════════════════════════════════════════════════════════╗
║            AgentsCoinLaunchers - Quick Test All Systems           ║
╚════════════════════════════════════════════════════════════════════╝

✓ Found dev server on port 3002

Testing API Endpoints...

1. Testing Stats API (http://localhost:3002/api/stats):
   Response: {"tokens":3,"totalVolume":950000000000,"users":3,"status":"demo"}
   Status: ✓ OK
```

### macOS/Linux (QUICKTEST_ADVANCED.sh)
```
✓ Found dev server on port 3002

Testing API Endpoints:

  Test 1: Stats API ... ✓
    └─ Response (first 150 chars):
       {"tokens":3,"totalVolume":950000000000,"users":3,"status":"demo"}
```

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| `.bat` file won't open | Use Command Prompt: `QUICKTEST_ALL.bat` |
| `.sh` file won't run | Use `bash QUICKTEST_ADVANCED.sh` |
| "Permission denied" (bash) | Run `chmod +x QUICKTEST_ADVANCED.sh` first |
| Can't find curl | Install curl: `apt-get install curl` (Linux) |
| Dev server not found | Make sure you ran `npm run dev` in packages/web |

---

## Next Steps After Successful Tests

✅ All tests passing?

1. **View the app:** Open http://localhost:3002 (or your port) in browser
2. **Check tabs:** Navigate through all tabs (Dashboard, Leaderboard, Launched)
3. **Deploy:** Push changes and Vercel auto-deploys to production

---

## Support

- **GitHub:** https://github.com/Maliot100X/AgentsCoinLaunchers
- **Production:** https://agentscoinlaunchers.vercel.app
- **Issues:** Report on GitHub Issues tab

