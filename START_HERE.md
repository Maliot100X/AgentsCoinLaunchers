# 🚀 START HERE - Windows Users

## 3 Simple Steps to Run Everything

### Step 1: Open Command Prompt
1. Press `Win + R`
2. Type: `cmd`
3. Press Enter

### Step 2: Go to Project Folder
```cmd
cd C:\Users\PC\Desktop\fulltires\agentscoinlaunchers
```

### Step 3: Choose One Command

---

## ⚡ EASIEST: Run Everything

```cmd
start-all.bat
```

**That's it!** This will:
- Start the API (port 3001)
- Start the Website (port 3000)
- Start the Bot (Telegram)

Then access:
- **Website:** http://localhost:3000
- **API Health:** http://localhost:3001/health

---

## 🧪 OR: Test First

```cmd
test-all.bat
```

This checks:
- ✓ All files exist
- ✓ Website builds OK
- ✓ Bot code is valid
- ✓ API is ready

---

## 📋 Other Commands

```cmd
start-api.bat      # Start API only
start-web.bat      # Start Website only  
start-bot.bat      # Start Bot only
```

Open separate Command Prompt windows for each.

---

## ❌ If Port Already in Use

The batch files automatically clean up ports for you. But if you get an error:

```cmd
netstat -ano | findstr :3001
```

Find the PID and close that application.

---

## 🎯 That's All!

Really, just run:
```cmd
start-all.bat
```

Everything is already configured. Enjoy! 🎉

For more details, see: `WINDOWS_QUICK_START.md`
