# Vanika — Docker Containerization Guide

This guide details how to build, run, and orchestrate **Vanika Cognitive Care** using Docker and Docker Compose.

---

## 1. Prerequisites

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine (v24.0+)
* [Docker Compose](https://docs.docker.com/compose/) (v2.20+)

---

## 2. Docker Architecture

Vanika uses a **multi-stage Docker build** (`Node 20 Alpine`) to minimize production image size and maximize container security.

```
┌────────────────────────────────────────────────────────┐
│ STAGE 1: Builder (Node 20 Alpine)                       │
│ - Copies package manifests & installs devDependencies  │
│ - Generates Prisma Client                             │
│ - Builds Vite SPA frontend & esbuild server.cjs bundle │
└───────────────────────────┬────────────────────────────┘
                            │ (Copies dist/, prisma/, node_modules)
┌───────────────────────────▼────────────────────────────┐
│ STAGE 2: Runner (Node 20 Alpine - Production)          │
│ - Installs production dependencies & Prisma CLI        │
│ - Copies compiled dist/ output & Prisma schemas       │
│ - Non-root node user execution (Security Hardened)     │
│ - Built-in HEALTHCHECK (/api/health endpoint)          │
└────────────────────────────────────────────────────────┘
```

---

## 3. Quick Start with Docker Compose

To launch the full stack (Vanika application + local PostgreSQL 16 database):

```bash
# Clone repository and navigate to root directory
cd sih26-main

# Build and start containers in background
docker compose up --build -d

# View real-time application logs
docker compose logs -f app
```

Access the application at:
* **Frontend & Backend API:** `http://localhost:5000`
* **Healthcheck Endpoint:** `http://localhost:5000/api/health`

To stop and remove containers & networks:
```bash
docker compose down
```

---

## 4. Manual Docker Build & Run

### Build Image
```bash
docker build -t vanika-app .
```

### Run Container (Using External Database e.g., Supabase)
```bash
docker run -d \
  --name vanika-container \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/vanika?schema=public" \
  -e JWT_SECRET="your_production_jwt_secret" \
  -e GEMINI_API_KEY="your_gemini_api_key" \
  -v vanika_uploads:/app/uploads \
  vanika-app
```

---

## 5. Environment Variables Reference

| Variable | Default (Compose) | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for Express server to listen inside container |
| `NODE_ENV` | `production` | Node environment state |
| `DATABASE_URL` | `postgresql://vanika:vanika@db:5432/vanika` | Primary PostgreSQL database connection string |
| `DIRECT_URL` | `postgresql://vanika:vanika@db:5432/vanika` | Direct PostgreSQL connection string for Prisma |
| `JWT_SECRET` | `dev_jwt_secret_vanika...` | Secret key for signing authentication JWT tokens |
| `GEMINI_API_KEY` | Server-side env | API key for Gemini 2.5 Flash cognitive AI recommendation & chat |
| `RUN_MIGRATIONS` | `true` | When `true`, container startup automatically runs `npx prisma migrate deploy` |
| `CLIENT_URL` | `http://localhost:5000` | Allowed origin header for backend CORS policy |

---

## 6. Upload Persistence & Storage

Family photo uploads (Task 2) are stored locally in the container's `/app/uploads` directory.

In `docker-compose.yml`, a named volume `vanika_uploads` is mounted to `/app/uploads`:
```yaml
volumes:
  - vanika_uploads:/app/uploads
```
This guarantees photo uploads persist safely across container restarts, rebuilds, and updates.

---

## 7. Database Migrations

Production container startup uses non-destructive deployment migrations via `docker-entrypoint.sh`:
```bash
npx prisma migrate deploy
```
To run database status checks inside the container:
```bash
docker compose exec app npx prisma migrate status
```

---

## 8. Troubleshooting

### Port Already in Use (EADDRINUSE: 5000)
If port 5000 is occupied on your host machine:
* Modify the host port mapping in `docker-compose.yml`:
  ```yaml
  ports:
    - "5001:5000"
  ```

### Database Connection Retries
The `app` container waits for the `db` container's `pg_isready` healthcheck before initializing Prisma. If connection drops, check database logs:
```bash
docker compose logs db
```

### Stale Images / Rebuild
If code changes are not reflected:
```bash
docker compose down --volumes --remove-orphans
docker compose up --build
```
