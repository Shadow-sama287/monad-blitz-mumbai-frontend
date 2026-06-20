# 🤖 Agent Court: On-Chain AI Agent Dispute Resolution

> Two AI agents transact on Monad using real ERC-8004 identities and reputation. A client agent hires a service agent to audit a smart contract; if the work is bad, the dispute goes to an on-chain Judge whose verdict is written permanently to the Monad Reputation Registry — and if the service agent performs well enough, it reproduces, spawning a new independent on-chain agent live in front of the judges.

## 📚 Project Overview

**Agent Court** is a live demonstration of autonomous AI agents with on-chain reputation and identity on the Monad blockchain. It showcases:

- ✅ AI agent identities registered on ERC-8004 Identity Registry
- ✅ Real-time reputation feedback written to the Reputation Registry
- ✅ Automated dispute resolution through an LLM Judge Oracle
- ✅ Mitosis: agent reproduction triggered by performance thresholds
- ✅ Interactive canvas UI with pan/zoom, real-time logs, and state inspection

### The Three Core Agents

| Agent                     | Role                             | Type         | Status                          |
| ------------------------- | -------------------------------- | ------------ | ------------------------------- |
| **Protocol Deployer (A)** | Client requesting audit          | Stable       | Real wallet + on-chain identity |
| **AuditBot-v1 (B)**       | Service provider executing audit | Performant   | Real wallet + on-chain identity |
| **Judge_LLM_Oracle**      | Arbitrator resolving disputes    | Trusted      | Real wallet + on-chain identity |
| **AuditBot-v2 (B1)**      | Child agent spawned via mitosis  | Post-mitosis | Created during demo             |

---

## 🚀 Quick Start (Everything in One Folder!)

### Prerequisites

- **Node.js** 16+ (check with `node --version`)
- **npm** 8+ (check with `npm --version`)

### Step 1: Install All Dependencies

```bash
# Navigate to the project root
cd monad-blits-mumbai-frontend

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Create environment files
cp .env.example .env.local
cp backend/.env.example backend/.env
```

### Step 2: Configure Environment Variables

```bash
# Frontend .env.local (optional - defaults already set)
nano .env.local

# Backend .env (configure Monad RPC and wallet keys)
nano backend/.env
```

### Step 3: Start Both Services

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
# Backend runs on http://localhost:4000
```

**Terminal 2 - Frontend:**

```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 4: Open Your Browser

Navigate to **http://localhost:5173** and enjoy! 🎉

---

## 📁 Project Structure

```
monad-blits-mumbai-frontend/                    ← ALL IN ONE FOLDER NOW!
├── src/
│   ├── components/
│   │   ├── AgentNode.jsx          # Individual agent card component
│   │   ├── ConnectionLines.jsx    # SVG lines connecting agents
│   │   ├── ControlBar.jsx         # Demo flow buttons
│   │   ├── InspectorDrawer.jsx    # Side panel with agent details
│   │   └── LogPanel.jsx           # Real-time event log
│   ├── hooks/
│   │   └── useAgentEconomy.js     # Core state management & API
│   ├── App.jsx                    # Main canvas & orchestration
│   ├── App.css                    # Canvas & agent styling
│   ├── index.css                  # Global styles
│   ├── main.jsx                   # React entry point
│   └── assets/                    # Images, icons, fonts
│
├── backend/                       ← BACKEND INCLUDED!
│   ├── server.js                  # Express.js main server
│   ├── package.json               # Backend dependencies
│   ├── .env.example               # Backend env template
│   └── src/
│       ├── routes/
│       │   ├── agents.js          # GET /agents
│       │   ├── job.js             # POST /job
│       │   ├── feedback.js        # POST /feedback
│       │   ├── dispute.js         # POST /dispute
│       │   └── mitosis.js         # POST /mitosis
│       └── data/
│           └── agents.js          # Agent registry
│
├── public/                        # Static assets
├── screenshots/                   # Demo screenshots
├── AGENTS.md                      # System specification
├── SKILL.md                       # Customization notes
├── vite.config.js                 # Vite build config
├── package.json                   # Frontend dependencies
├── index.html                     # HTML entry point
├── .env.example                   # Frontend env template
├── README.md                      # THIS FILE
└── eslint.config.js               # Linting rules
```

---

## 🎮 Features & Demo Flows

### 1. **Happy Path** (Success Scenario)

Click "Happy Path" to:

1. Agent A submits a job to Agent B
2. Agent B executes the audit and returns clean output
3. Agent A provides positive feedback
4. Reputation increases for Agent B
5. Transaction recorded on Monad testnet

```
Agent A → [Job] → Agent B → [Clean Output] → Agent A → [Positive Feedback] ✅
```

### 2. **Dispute Path** (Conflict Scenario)

Click "Dispute Path" to:

1. Agent A submits a job to Agent B
2. Agent B returns flawed output (marked with `CRITICAL_ERROR`)
3. Agent A disputes the work
4. Judge analyzes the dispute
5. Judge verdict written to Reputation Registry
6. Agent B reputation decreases

```
Agent A → [Job] → Agent B → [Flawed Output] → Agent A → [Dispute] → Judge → [Verdict] ❌
```

### 3. **Mitosis** (Agent Reproduction)

Click "Trigger Mitosis" to:

1. Agent B spawns a new child agent (Agent B1)
2. Child agent gets independent wallet
3. Child agent registered on Identity Registry
4. B1 appears on canvas with parent connection
5. Both B and B1 can now execute jobs independently

```
Agent B (High Rep) → [Mitosis Trigger] → Agent B1 (Spawn) 🧬
```

### 4. **Real-Time Logs**

All events are captured in the Log Panel:

- ✅ Success transactions
- ⚠️ Warnings and status updates
- ❌ Errors with transaction hashes
- 🔗 Direct links to Monad testnet explorer

---

## ⚙️ API Integration

The frontend communicates with the backend via five main endpoints:

### GET `/agents`

Returns all registered agents.

**Response:**

```json
{
  "agents": [
    {
      "id": "agent-a",
      "type": "client",
      "name": "Protocol Deployer",
      "reputation": 100,
      "wallet": "0x1A2b3C4d5E6f7890aBcDeF1234567890AbCdEf12",
      "children": []
    },
    ...
  ]
}
```

### POST `/job`

Submit a job from Agent A to Agent B.

**Request:**

```json
{
  "clientId": "agent-a",
  "serviceId": "agent-b",
  "jobType": "audit",
  "flawed": false
}
```

**Response:**

```json
{
  "jobId": "job-12345",
  "output": "Gas savings: 42%",
  "txHash": "0x..."
}
```

### POST `/feedback`

Submit feedback after successful job completion.

**Request:**

```json
{
  "jobId": "job-12345",
  "rating": 5,
  "comment": "Excellent work"
}
```

### POST `/dispute`

Dispute a completed job.

**Request:**

```json
{
  "jobId": "job-12345",
  "reason": "Output contains critical errors"
}
```

### POST `/mitosis`

Trigger agent reproduction.

**Request:**

```json
{
  "parentId": "agent-b"
}
```

**Response:**

```json
{
  "childId": "agent-b1",
  "wallet": "0x...",
  "txHash": "0x..."
}
```

---

## 🎨 UI Components

### Canvas + Pan/Zoom

- **Pan:** Click and drag the canvas background
- **Zoom:** Use mouse wheel or trackpad pinch
- Fixed node positions for agents A, B, Judge, B1
- Real-time connection lines showing relationships

### Agent Node Card

- **Avatar Icon:** Agent type emoji (🅰 client, 🅱 service, ⚖️ judge, 🧬 child)
- **Name & Role:** Agent identifier and type
- **Reputation Score:** Current on-chain reputation
- **State Badge:** Idle, Processing, In Court, Success, Mitosis
- **Click to Inspect:** Opens side drawer with full details

### Inspector Drawer (Side Panel)

- Agent full details
- Wallet address (copyable)
- Transaction history
- Reputation breakdown
- Child agents (if any)
- Close button with slide-out animation

### Log Panel

- Chronological event log (newest first)
- Color-coded: info (blue), success (green), error (red), warning (yellow)
- Direct links to Monad testnet explorer
- One-click transaction lookup

### Control Bar

- **Happy Path Button:** Demo successful audit flow
- **Dispute Path Button:** Demo disputed audit with court resolution
- **Trigger Mitosis Button:** Spawn Agent B1 from Agent B
- **Loading Indicator:** Shows when backend is processing
- **Status Display:** Current active flow and error messages

---

## 🔧 Configuration

### Frontend `.env.local`

Located in the root directory:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_USE_MOCKS=false
VITE_MONAD_RPC_URL=https://testnet-rpc.monadx.io
VITE_MONAD_CHAIN_ID=10143
VITE_IDENTITY_REGISTRY=0x8004A169FB4a3325136EB29fA0ceB6D2e539a432
VITE_REPUTATION_REGISTRY=0x8004BAa17C55a88189AE136b182e5fdA19dE9b63
```

### Backend `backend/.env`

Located in the `backend/` directory:

```env
PORT=4000
NODE_ENV=development
MONAD_RPC_URL=https://testnet-rpc.monadx.io
MONAD_CHAIN_ID=10143
IDENTITY_REGISTRY=0x8004A169FB4a3325136EB29fA0ceB6D2e539a432
REPUTATION_REGISTRY=0x8004BAa17C55a88189AE136b182e5fdA19dE9b63

# Agent wallet keys (KEEP SECURE!)
JUDGE_PRIVATE_KEY=your_judge_key
SERVICE_PRIVATE_KEY=your_service_key
CLIENT_PRIVATE_KEY=your_client_key
```

---

## 📊 Contract Addresses (Monad Testnet)

| Contract            | Address                                      |
| ------------------- | -------------------------------------------- |
| Identity Registry   | `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` |
| Reputation Registry | `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63` |

Check out [Monad Testnet Explorer](https://testnet.monadexplorer.com) for transaction details.

---

## 🏗️ Architecture

### Full-Stack in One Folder

```
monad-blits-mumbai-frontend/
├── Frontend (React + Vite)
│   └── src/App.jsx (Main orchestration)
│       ├── useAgentEconomy Hook (State management)
│       ├── Components (UI rendering)
│       └── API calls to http://localhost:4000
│
└── Backend (Express.js)
    └── backend/server.js
        ├── /agents endpoint
        ├── /job endpoint
        ├── /feedback endpoint
        ├── /dispute endpoint
        └── /mitosis endpoint
```

### Data Flow

```
User Action (Click Button)
    ↓
React Component
    ↓
useAgentEconomy Hook
    ↓
API Call to backend/server.js
    ↓
Backend Route Handler
    ↓
State Update (agents.js)
    ↓
Response to Frontend
    ↓
UI Re-render
```

### State Management

All state flows through the **useAgentEconomy** hook which connects to:

- Agent registry (`backend/src/data/agents.js`)
- API endpoints in `backend/src/routes/*`
- Monad testnet (for real transactions)
- Real-time logging system

---

## 🛠️ Development

### Build for Production

```bash
npm run build
```

This generates optimized static files in `dist/`.

### Linting

```bash
npm run lint
```

Checks code for style issues (ESLint).

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally.

---

## 📝 Scripts

### Frontend (Root Directory)

| Script            | Purpose                                 |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Start dev server with hot reload (5173) |
| `npm run build`   | Build for production                    |
| `npm run preview` | Preview production build                |
| `npm run lint`    | Run ESLint                              |

### Backend (backend/ Directory)

| Script        | Purpose                                  |
| ------------- | ---------------------------------------- |
| `npm run dev` | Start with nodemon (auto-reload on 4000) |
| `npm start`   | Start production server                  |

---

## 🧪 Testing the System

### Setup Checklist

**Terminal 1 - Start Backend:**

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your config
npm run dev
```

**Terminal 2 - Start Frontend:**

```bash
npm install  # From root if not done
npm run dev
```

### Verification Checklist

- [ ] Backend running on port 4000 (`http://localhost:4000`)
- [ ] Frontend running on port 5173 (`http://localhost:5173`)
- [ ] Console shows "Loaded agent registry"
- [ ] Three agent cards visible on canvas (A, B, Judge)
- [ ] Click "Happy Path" — logs appear, cards glow
- [ ] Click agent card — inspector drawer opens
- [ ] Click "Dispute Path" — judge card activates
- [ ] Click "Trigger Mitosis" — B1 card appears
- [ ] Pan and zoom work on canvas
- [ ] All log links point to valid Monad testnet explorer URLs

---

## 🤝 Contributing

1. **Read AGENTS.md** — It's the source of truth for all design decisions
2. **Feature branches:** Create a branch for each feature
3. **Commit messages:** Be descriptive (`feat: add X`, `fix: resolve Y`)
4. **Code style:** Run `npm run lint` before committing
5. **Pull requests:** Link to related issues and explain changes

---

## 📚 Documentation

- **[AGENTS.md](./AGENTS.md)** — Complete project specification
- **[SKILL.md](./SKILL.md)** — Agent customization guide
- **[backend/](./backend/)** — Backend directory with all API logic

---

## 🎯 What's Real vs Simulated

| Component           | Status    | Notes                                |
| ------------------- | --------- | ------------------------------------ |
| Agent identities    | ✅ Real   | Minted on Identity Registry          |
| Reputation feedback | ✅ Real   | Written to Reputation Registry       |
| Job execution       | ⚠️ Mock   | Two hardcoded outputs                |
| Court verdict       | ⚠️ Mock   | Deterministic rule on CRITICAL_ERROR |
| Mitosis trigger     | ⚠️ Manual | Not auto-threshold triggered         |
| B1 registration     | ✅ Real   | Real Identity Registry tx            |
| Payment             | ⚠️ Mock   | Cosmetic MON transfer                |

---

## 🐛 Troubleshooting

### Backend won't start

**Error:** `Error: EADDRINUSE: address already in use :::4000`

**Solution:**

```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID_NUMBER> /F

# macOS/Linux
lsof -ti:4000 | xargs kill -9
```

### Backend not connecting

**Error:** "Failed to fetch agents"

**Solution:**

1. Verify backend is running: `cd backend && npm run dev`
2. Check `VITE_BACKEND_URL=http://localhost:4000` in `.env.local`
3. Check browser Network tab for failed requests
4. Ensure backend `app.use(cors())` is enabled

### Environment variables not loading

**Error:** `TypeError: Cannot read property 'slice' of undefined`

**Solution:**

1. Verify `.env` and `.env.local` files exist
2. Restart the server (Ctrl+C, then re-run `npm run dev`)
3. Check all required variables are set

### Agent cards not appearing

**Error:** Canvas loads but no cards visible

**Solution:**

1. Check browser Console for JavaScript errors
2. Check Network tab — API requests complete?
3. Verify backend `/agents` endpoint returns data
4. Try refreshing the page (Ctrl+Shift+R)

### Port already in use (Frontend)

**Error:** `EADDRINUSE: address already in use :::5173`

**Solution:**

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9
```

---

## � Deployment

### Quick Deployment Scripts

```bash
# macOS/Linux
chmod +x deploy.sh
./deploy.sh

# Windows
deploy.bat
```

Or see **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete production guide including:

- ✅ Vercel + Railway (recommended, ~15 minutes)
- ✅ Docker + Cloud Run
- ✅ Render (all-in-one)
- ✅ Heroku
- ✅ CI/CD pipelines
- ✅ Monitoring & error tracking

---

## �📞 Support

For questions or issues:

1. Check [AGENTS.md](./AGENTS.md) for project context
2. Review the API Integration section (above) for endpoint details
3. Check browser Console (F12) and Network tab for errors
4. Check backend server logs in terminal
5. Verify environment variables are set correctly

---

## 📄 License

This project is part of the Monad Blitz Mumbai hackathon submission.

---

**Built with ❤️ for the Monad ecosystem**
