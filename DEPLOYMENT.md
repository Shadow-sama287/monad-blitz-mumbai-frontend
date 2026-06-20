# 🚀 Deployment Guide — Agent Court

Fast, practical deployment instructions for production.

---

## ⚡ 5-Minute Local Development

```bash
# 1. Clone and setup
cd monad-blits-mumbai-frontend
npm install && cd backend && npm install && cd ..

# 2. Configure
cp .env.example .env.local
cp backend/.env.example backend/.env

# 3. Edit environment files
nano .env.local           # Set VITE_BACKEND_URL=http://localhost:4000
nano backend/.env         # Set MONAD_RPC_URL and wallet keys

# 4. Run (in two terminals)
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
npm run dev

# 5. Open browser
# http://localhost:5173
```

---

## 🌐 Production Deployment Options

### Option A: Vercel (Frontend) + Railway (Backend)

**Fastest path: ~10 minutes**

#### Step 1: Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# From project root
vercel --prod

# Configure:
# - Build: npm run build
# - Output: dist
# - Install: npm install
```

Or use GitHub integration:

1. Push to GitHub
2. Connect repo to Vercel
3. Auto-deploys on push

#### Step 2: Deploy Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
cd backend
railway init

# Configure environment
railway variables set MONAD_RPC_URL=https://testnet-rpc.monadx.io
railway variables set PORT=4000
railway variables set JUDGE_PRIVATE_KEY=your_key
railway variables set SERVICE_PRIVATE_KEY=your_key
railway variables set CLIENT_PRIVATE_KEY=your_key

# Deploy
railway up

# Get URL
railway open  # Copy deployment URL
```

#### Step 3: Connect Frontend to Backend

Update frontend environment at Vercel:

```
VITE_BACKEND_URL=https://your-railway-backend.up.railway.app
VITE_USE_MOCKS=false
```

---

### Option B: Docker + Cloud Run / Heroku

#### Step 1: Create Docker Setup

**Dockerfile (root):**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install frontend & backend deps
COPY package*.json ./
RUN npm install

COPY backend/package*.json ./backend/
RUN cd backend && npm install && cd ..

# Build frontend
COPY . .
RUN npm run build

EXPOSE 4000 5173

CMD ["node", "backend/server.js"]
```

**docker-compose.yml:**

```yaml
version: "3"
services:
  app:
    build: .
    ports:
      - "4000:4000"
      - "5173:5173"
    environment:
      - MONAD_RPC_URL=${MONAD_RPC_URL}
      - JUDGE_PRIVATE_KEY=${JUDGE_PRIVATE_KEY}
      - SERVICE_PRIVATE_KEY=${SERVICE_PRIVATE_KEY}
      - CLIENT_PRIVATE_KEY=${CLIENT_PRIVATE_KEY}
      - PORT=4000
```

#### Step 2: Deploy to Cloud Run (Google Cloud)

```bash
# Build image
docker build -t agent-court:latest .

# Tag for Google Cloud
docker tag agent-court:latest gcr.io/your-project-id/agent-court:latest

# Push to registry
docker push gcr.io/your-project-id/agent-court:latest

# Deploy
gcloud run deploy agent-court \
  --image gcr.io/your-project-id/agent-court:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONAD_RPC_URL=https://testnet-rpc.monadx.io,JUDGE_PRIVATE_KEY=xxx
```

#### Step 2 Alternative: Deploy to Heroku

```bash
# Login
heroku login

# Create app
heroku create agent-court-app

# Set environment variables
heroku config:set MONAD_RPC_URL=https://testnet-rpc.monadx.io
heroku config:set JUDGE_PRIVATE_KEY=your_key
heroku config:set SERVICE_PRIVATE_KEY=your_key
heroku config:set CLIENT_PRIVATE_KEY=your_key

# Deploy
git push heroku main

# Monitor logs
heroku logs --tail
```

---

### Option C: Render (All-in-One Simplest)

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Connect to Render

1. Visit https://render.com
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub repo
5. Configure:
   - **Build Command:** `npm install && cd backend && npm install && cd ..`
   - **Start Command:** `cd backend && npm run start`
   - **Environment Variables:**
     - `MONAD_RPC_URL=https://testnet-rpc.monadx.io`
     - `PORT=4000`
     - `JUDGE_PRIVATE_KEY=xxx`
     - etc.

Deploy! 🎉

---

## 🔒 Environment Variables Checklist

**Required for production:**

```env
# Backend (.env in backend/)
PORT=4000
NODE_ENV=production
MONAD_RPC_URL=https://testnet-rpc.monadx.io
MONAD_CHAIN_ID=10143
IDENTITY_REGISTRY=0x8004A169FB4a3325136EB29fA0ceB6D2e539a432
REPUTATION_REGISTRY=0x8004BAa17C55a88189AE136b182e5fdA19dE9b63
JUDGE_PRIVATE_KEY=your_judge_wallet_private_key
SERVICE_PRIVATE_KEY=your_service_wallet_private_key
CLIENT_PRIVATE_KEY=your_client_wallet_private_key

# Frontend (.env.local in root)
VITE_BACKEND_URL=https://your-backend-domain.com
VITE_USE_MOCKS=false
```

**⚠️ NEVER commit private keys!** Use:

- Vercel Secrets
- Railway Variables
- Render Environment Variables
- Cloud secrets manager

---

## 📊 Production Checklist

- [ ] Backend environment variables set (no hardcoded keys)
- [ ] Frontend pointing to production backend URL
- [ ] Wallet addresses pre-funded on Monad testnet
- [ ] CORS configured for production domain
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Rate limiting enabled on API
- [ ] Database backups configured (if using DB)
- [ ] Monitoring alerts set up
- [ ] HTTPS enabled (automatic on most platforms)
- [ ] Domain DNS configured

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install && cd backend && npm install && cd ..

      - name: Build frontend
        run: npm run build

      - name: Lint
        run: npm run lint

      - name: Deploy to Vercel
        uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Deploy backend to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 📈 Monitoring & Logging

### Sentry (Error Tracking)

```bash
npm install @sentry/react @sentry/node
```

**Frontend (src/main.jsx):**

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

**Backend (backend/server.js):**

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.requestHandler());
```

### Uptime Monitoring

Use https://uptime.com or https://healthchecks.io:

```bash
# Add health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});
```

Monitor: `https://your-domain.com/health`

---

## 🚨 Quick Rollback

If something breaks:

```bash
# Vercel
vercel rollback

# Railway
railway down
# Then redeploy previous version

# Heroku
heroku releases:rollback

# Render
# Use the "Manual Deploy" dropdown to select previous version
```

---

## 💰 Cost Estimates (Per Month)

| Option        | Frontend   | Backend  | Total      |
| ------------- | ---------- | -------- | ---------- |
| **Vercel**    | Free - $20 | N/A      | Free - $20 |
| **Railway**   | N/A        | $5 - $25 | $5 - $25   |
| **Render**    | Free - $7  | $7 - $50 | $7 - $57   |
| **Cloud Run** | N/A        | $0 - $20 | $0 - $20   |
| **Heroku**    | N/A        | $50+     | $50+       |

**Recommended:** Vercel (Frontend) + Railway (Backend) = ~$5-25/month

---

## 🔐 Security Checklist

- [ ] Private keys in environment variables only
- [ ] HTTPS enabled
- [ ] CORS configured for specific origins
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (if using DB)
- [ ] Regular dependency updates
- [ ] Security headers configured
- [ ] API authentication (if needed)
- [ ] Monitoring for suspicious activity

---

## 📞 Troubleshooting

### Backend returns 500 error

```bash
# Check logs
railway logs  # or your platform's log viewer

# Verify environment variables
railway variables

# Restart
railway up
```

### Frontend can't reach backend

```bash
# Check VITE_BACKEND_URL
# Must match deployed backend domain exactly

# Verify CORS enabled in backend/server.js
app.use(cors());  // Should be at top
```

### Rate limiting issues

Add to `backend/server.js`:

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
});

app.use(limiter);
```

---

## 🎯 Recommended Path (Fastest)

1. **Frontend:** Vercel (connect GitHub → auto-deploy)
2. **Backend:** Railway (connect GitHub → auto-deploy)
3. **Time:** ~15 minutes total
4. **Cost:** ~$5-25/month
5. **Maintenance:** Minimal (auto-scaling, monitoring included)

```bash
# All you need:
git push  # Everything auto-deploys!
```

---

## 🎉 You're Live!

Once deployed:

- Frontend: `https://your-vercel-url.vercel.app`
- Backend: `https://your-railway-url.up.railway.app`
- Update frontend env to point to backend
- Test: Click buttons, verify logs, check explorer links

**Done! Your Agent Court is live on Monad testnet!** 🚀
