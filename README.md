# Web3 Signer & Verifier

A minimal, headless-friendly DApp that:
- Lets a user log in by email (OTP) via Dynamic.
- Signs arbitrary messages with their wallet.
- Verifies signatures server‑side (Node/Express + ethers).
- Shows a per‑user local signing history in a clean Material UI.

> Frontend: Vite + React + TypeScript + Material UI  
> Backend: Node + Express + TypeScript + ethers + zod

---

## Repository layout

```
web3-signer/
├─ frontend/          # Vite + React + TS app (Material UI theme)
└─ backend/           # Express + TS API (signature verification)
```

---

## Prerequisites

- Node.js **18+** (recommended LTS)
- npm **9+**
- A **Dynamic** sandbox environment (ENV_ID + API Key) if you plan to use server-side MFA verification later.
- A modern browser (Chrome/Edge/Firefox/Safari)

---

## Quick start

### 1) Clone the repo

```bash
git clone https://github.com/rushi189/web3-signer.git
cd web3-signer
```

### 2) Install dependencies

```bash
# frontend
cd frontend
npm install

# backend
cd ../backend
npm install
```

### 3) Configure environment

> We keep real `.env` files (not just `.env.example`). Open and edit both files as needed.

#### `frontend/.env`

```
VITE_DYNAMIC_ENV_ID=<your_dynamic_env_id>
VITE_BACKEND_URL=http://localhost:8080
```

- `VITE_DYNAMIC_ENV_ID` – Dynamic environment ID (Sandbox)
- `VITE_BACKEND_URL` – URL of the backend API

#### `backend/.env`

```
PORT=8080
CORS_ORIGIN=http://localhost:5173
DYNAMIC_ENV_ID=<your_dynamic_env_id>
```

- `PORT` – backend port
- `CORS_ORIGIN` – comma‑separated list of allowed web origins (add your dev URLS)
- `DYNAMIC_ENV_ID` – used if you later enable server‑side MFA verification (optional in this version)

> **Note:** We intentionally keep `.env` files (not just examples). Do **not** commit secrets if your repo is public.

### 4) Run the apps

**Frontend (dev server):**

```bash
cd frontend
npm run dev
# Vite will print http://localhost:5173
```

**Backend (build + start):**

```bash
cd backend
npm run build
npm run start
# API on http://localhost:8080
```

Open the frontend in your browser, sign in with your email (OTP), then sign & verify messages.

---

## Scripts reference

### Frontend

- `npm run dev` – Start Vite dev server
- `npm run build` – Production build
- `npm run preview` – Preview the production build locally
- `npm run lint` (if present) – Lint code

### Backend

- `npm run build` – Compile TypeScript to `dist/`
- `npm run start` – Run compiled server (`node dist/server.js`)
- `npm run test` (if present) – Run unit tests

---

## API (backend)

- `POST /verify-signature`  
  Body:
  ```json
  { "message": "hello web3", "signature": "0x..." }
  ```
  Response:
  ```json
  { "isValid": true, "signer": "0xabc...", "originalMessage": "hello web3" }
  ```

Validation is handled by `zod` and signer recovery by `ethers`.

---

## Troubleshooting

- **CORS errors**: Make sure `CORS_ORIGIN` in `backend/.env` includes your frontend origin (`http://localhost:5173` by default).
- **Dynamic login issues**: Confirm `VITE_DYNAMIC_ENV_ID` matches the Sandbox environment in the Dynamic dashboard.
- **Port conflicts**: Change `PORT` or `VITE_BACKEND_URL` accordingly.

---

## Notes

- Local signing history is stored per user (scoped to their email) in the browser.
- MFA enrollment is optionally shown first if no authenticator is present (you can toggle this behaviour in the dashboard page).

