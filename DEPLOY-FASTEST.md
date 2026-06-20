# 🚀 Copy-Paste Deployment Guide

**Just copy and paste these commands. It works!**

---

## Step 1: Prepare Code (Linux/Mac)

```bash
cd monad-blits-mumbai-frontend
git add .
git commit -m "Ready for deployment"
git push origin main
```

Or if using GitHub Desktop: Just click "Push" ✅

---

## Step 2: Deploy Frontend (Choose One)

### A) Vercel CLI (Fastest)

```bash
npm install -g vercel
vercel --prod
```

**Output:** `https://agent-court-xxx.vercel.app/` ← Copy this URL!

### B) Vercel GitHub Integration (Easiest)

1. Go to https://vercel.com/new
2. Click "Import GitHub Project"
3. Select your repo
4. Click "Deploy"
5. Done! ✅

---

## Step 3: Deploy Backend (Railway)

```bash
npm install -g @railway/cli
railway login
cd backend
railway init
```

**Now set environment variables:**

```bash
railway variables set PORT=4000
railway variables set NODE_ENV=production
railway variables set MONAD_RPC_URL=https://testnet-rpc.monadx.io
railway variables set MONAD_CHAIN_ID=10143
railway variables set IDENTITY_REGISTRY=0x8004A169FB4a3325136EB29fA0ceB6D2e539a432
railway variables set REPUTATION_REGISTRY=0x8004BAa17C55a88189AE136b182e5fdA19dE9b63
```

**Now add your wallet private keys (KEEP SECURE!):**

```bash
railway variables set JUDGE_PRIVATE_KEY=0xyour_judge_key_here
railway variables set SERVICE_PRIVATE_KEY=0xyour_service_key_here
railway variables set CLIENT_PRIVATE_KEY=0xyour_client_key_here
```

**Deploy:**

```bash
railway up
```

**Output:** `https://agent-court-xxx.up.railway.app/` ← Copy this URL!

---

## Step 4: Connect Frontend to Backend

### Via Vercel Dashboard

1. Go to https://vercel.com → Your Project → Settings → Environment Variables
2. Click "Add New"
3. Name: `VITE_BACKEND_URL`
4. Value: `https://agent-court-xxx.up.railway.app` (paste your Railway URL)
5. Click "Save"
6. Go to "Deployments" → Right-click latest deploy → "Redeploy"

---

## Step 5: Test Everything

```bash
# Frontend works?
curl https://your-vercel-url/

# Backend works?
curl https://your-railway-url/agents

# Both connected?
# Open frontend in browser
# Should load with 3 agent cards
# Click "Happy Path" → should work!
```

---

## ✅ You're Done!

- **Frontend:** https://your-vercel-url (live now!)
- **Backend:** https://your-railway-url (live now!)
- **Project:** Live on Monad testnet! 🎉

---

## 🐛 Troubleshooting (Copy-Paste Fixes)

### Frontend shows blank page

```bash
# Check env vars
# Go to Vercel Project → Settings → Environment Variables
# Verify VITE_BACKEND_URL is set correctly
# Redeploy: Deployments → right-click → Redeploy
```

### "Failed to fetch agents" error

```bash
# Problem: Frontend doesn't know backend URL
# Solution: Add to Vercel env vars:
# VITE_BACKEND_URL=https://your-railway-url.up.railway.app
# Then redeploy
```

### Backend returns 500 error

```bash
# Check what went wrong
railway logs --tail

# Missing env var? Add it:
railway variables set MISSING_VAR=value

# Redeploy:
railway up
```

### Port error / Already running

**Linux/Mac:**

```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or port 5173
lsof -ti:5173 | xargs kill -9
```

**Windows:**

```bash
netstat -ano | findstr :4000
taskkill /PID 12345 /F
```

---

## 📋 Checklist

- [ ] Code pushed to GitHub
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] `VITE_BACKEND_URL` set in Vercel
- [ ] Private keys added to Railway
- [ ] Frontend can load
- [ ] Agent cards visible
- [ ] "Happy Path" button works

---

## 🎯 TL;DR - The Absolute Fastest

```bash
# Everything in one go (if you have CLI tools installed):

# Deploy frontend
vercel --prod

# Deploy backend
cd backend && railway up

# That's it! ✨
```

---

## 💬 Still Stuck?

1. Check [QUICKSTART-DEPLOY.md](./QUICKSTART-DEPLOY.md) for more details
2. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for all options
3. See [README.md#Troubleshooting](./README.md#troubleshooting) for common issues

**You've got this! 🚀**
