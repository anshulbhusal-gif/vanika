# VANIKA COGNITIVE CARE — PRODUCTION DEPLOYMENT GUIDE

**Version:** 1.0.0-production  
**Target Architecture:** Vercel (Frontend SPA) + Render / Railway (Node.js Backend) + Supabase (PostgreSQL DB) + Gemini 2.5 Flash (AI Engine)

---

## 1. Architecture Overview

```
 [ Vercel Frontend ] ────── REST API (HTTPS) ──────> [ Render / Railway Backend ]
  - React 19 + Vite                                    - Node.js / Express
  - PWA Service Worker                                 - Server-Side Gemini Client
  - Client-side i18n/Voice                             - Auth / RBAC / Scoring Authority
                                                               │
                                                       Prisma ORM (TLS)
                                                               │
                                                               ▼
                                                    [ Supabase PostgreSQL DB ]
```

---

## 2. Environment Variables Specification

### A. Backend Production Environment (Render / Railway)
Set these in your host dashboard under Environment Variables:

| Variable | Description | Example / Format |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Listening HTTP port | `5000` (or host-assigned `$PORT`) |
| `CLIENT_URL` | Allowed frontend origin for CORS | `https://vanika-app.vercel.app` |
| `DATABASE_URL` | Supabase Connection Pooler URL (Transaction Mode) | `postgresql://postgres:[PASS]@[HOST]:6543/postgres?pgbouncer=true&schema=public` |
| `DIRECT_URL` | Supabase Direct Connection URL (Session Mode for Migrations) | `postgresql://postgres:[PASS]@[HOST]:5432/postgres?schema=public` |
| `JWT_SECRET` | Long random cryptographic key for JWT signing | `c9f8a3d... (Minimum 64 characters)` |
| `GEMINI_API_KEY` | Server-side Google Gemini API Key | `AIzaSy...` |

> ⚠️ **CRITICAL:** `GEMINI_API_KEY`, `JWT_SECRET`, and `DATABASE_URL` must **NEVER** be prefixed with `VITE_` or exposed to the frontend repository.

### B. Frontend Production Environment (Vercel)
Set these in your Vercel Project Settings:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Public production backend API URL | `https://vanika-backend.onrender.com/api` |

---

## 3. Database Migration Strategy (Supabase PostgreSQL)

1. **Deploying Schema Changes:**
   Execute migrations strictly using `prisma migrate deploy` (uses `DIRECT_URL` connection):
   ```bash
   npx prisma migrate deploy
   ```
2. **Migration Rules:**
   - 🚫 **NEVER** run `prisma migrate reset` in production environments.
   - 🚫 **NEVER** run `prisma db push` in production.
   - 🚫 **NEVER** delete files from `prisma/migrations`.
3. **Backup & Safety:**
   - Supabase automatically creates daily point-in-time backups.
   - Run a manual snapshot in the Supabase Dashboard prior to deploying any migration.

---

## 4. Backend Deployment (Render / Railway)

1. Connect Git repository.
2. Configure build & start settings:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start` (Executes `node dist/server.cjs`)
3. Set environment variables listed in Section 2A.
4. Verify deployment health check at `GET https://your-backend.onrender.com/api/health`.

---

## 5. Frontend Deployment (Vercel)

1. Import Git repository into Vercel.
2. Select Framework Preset: **Vite**.
3. Configure build & output settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Set `VITE_API_BASE_URL` in Vercel environment settings.
5. Deploy. Verify SPA routing rules (`vercel.json` rewrite to `/index.html`).

---

## 6. PWA & Caching Production Configuration

- **Scope & Service Worker:** SW registered at `/sw.js`. Assets cached with cache-first strategy.
- **Dynamic API Exclusions:** API routes (`/api/*`) are strictly excluded from static app-shell caching.
- **IndexedDB Isolation:** Sensitive data (passwords, JWTs, caregiver private notes) are omitted from client-side storage.

---

## 7. Rollback & Emergency Plan

- **Backend Rollback:** In Render/Railway, redeploy the previous successful commit build.
- **Frontend Rollback:** In Vercel, promote the previous instant deployment alias to Production.
- **Database Rollback:** If a migration fails, apply a compensating migration script via `npx prisma migrate resolve`.
