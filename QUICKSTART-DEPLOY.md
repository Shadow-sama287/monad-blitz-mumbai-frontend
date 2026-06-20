# ⚡ 15-Minute Deployment Cheat Sheet

## Fastest Path: Vercel + Railway

### 1️⃣ Prepare (2 minutes)

```bash
# Ensure code is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2️⃣ Deploy Frontend to Vercel (5 minutes)

**Option A: Via CLI**

```bash
npm install -g vercel
vercel --prod
# Follow prompts → automatically deployed!
```

**Option B: Via GitHub** (easiest)

1. Go to https://vercel.com
2. Click "Import Project"
3. Connect GitHub repo
4. Click "Deploy"
5. Done! ✅

### 3️⃣ Deploy Backend to Railway (5 minutes)

```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway variables set PORT=4000
railway variables set NODE_ENV=production
railway variables set MONAD_RPC_URL=https://testnet-rpc.monadx.io
railway variables set JUDGE_PRIVATE_KEY=your_key_here
railway variables set SERVICE_PRIVATE_KEY=your_key_here
railway variables set CLIENT_PRIVATE_KEY=your_key_here
railway up
```

Railway gives you a URL like: `https://xxx-production.up.railway.app`

### 4️⃣ Connect Frontend to Backend (1 minute)

**In Vercel Dashboard:**

1. Go to Project Settings → Environment Variables
2. Add:
   ```
   VITE_BACKEND_URL=https://xxx-production.up.railway.app
   VITE_USE_MOCKS=false
   ```
3. Redeploy: Click "Deployments" → "Redeploy"

### 5️⃣ Test (1 minute)

1. Open your Vercel frontend URL
2. Should see 3 agent cards
3. Click "Happy Path" → should work!
4. Check console for "Loaded agent registry"

**Done! 🎉**

---

## 🔑 All Required Private Keys

Get these from your Monad testnet wallets:

```env
# Generate wallets on monadx.io or use existing ones
JUDGE_PRIVATE_KEY=0x...        (64 hex chars after 0x)
SERVICE_PRIVATE_KEY=0x...
CLIENT_PRIVATE_KEY=0x...
```

⚠️ **NEVER commit keys to git!** Use platform secrets only.

---

## 📊 Verify Deployment

### Frontend checks:

- [ ] Vercel URL loads without errors
- [ ] Console shows "Loaded agent registry"
- [ ] Agent cards visible
- [ ] Buttons clickable

### Backend checks:

- [ ] `https://your-railway-url/` returns JSON
- [ ] `/agents` endpoint returns agent list
- [ ] Logs appear in Railway dashboard

### Integration checks:

- [ ] Click "Happy Path" → logs appear
- [ ] Click "Dispute Path" → judge responds
- [ ] Click "Trigger Mitosis" → B1 appears

---

## 🚨 Instant Troubleshooting

| Issue                    | Fix                                                                |
| ------------------------ | ------------------------------------------------------------------ |
| Frontend blank page      | Check env vars in Vercel settings                                  |
| "Failed to fetch agents" | Update `VITE_BACKEND_URL` in Vercel to correct Railway URL         |
| Backend 500 error        | Check Railway logs for missing env vars                            |
| CORS error               | Ensure `app.use(cors())` in backend/server.js (it's already there) |

---

## 💰 Cost

- **Vercel:** Free tier included
- **Railway:** ~$5-25/month (first $5 free)
- **Total:** ~$5/month

---

## 📚 Full Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) — Complete deployment guide
- [README.md](./README.md) — Project overview
- [AGENTS.md](./AGENTS.md) — System architecture

---

## 🎯 Commands Summary

```bash
# Local dev
cd backend && npm run dev &  # Terminal 1
npm run dev                   # Terminal 2

# Production build
npm run build

# Deploy frontend
vercel --prod

# Deploy backend
cd backend && railway up

# Check railway logs
railway logs --tail
```

**That's it! You're live on Monad testnet!** 🚀
