# Vanika CI/CD Pipeline Documentation

This document describes the Continuous Integration (CI) and Continuous Deployment (CD) architecture for the **Vanika** Cognitive Care platform.

---

## 🚀 Overview

The Vanika project uses **GitHub Actions** for automated quality enforcement and continuous deployment to **Render**.

```text
                                  +-----------------------+
                                  |   Push to main / PR   |
                                  +-----------------------+
                                              |
                                              v
                                  +-----------------------+
                                  |      ci.yml (CI)      |
                                  |  - Checkout & Node 20 |
                                  |  - Postgres Service   |
                                  |  - npm ci             |
                                  |  - Prisma Generate/   |
                                  |    Migrate            |
                                  |  - tsc --noEmit       |
                                  |  - npm test           |
                                  |  - npm run build      |
                                  +-----------------------+
                                              |
                                   (Passes on 'main' only)
                                              |
                                              v
                                  +-----------------------+
                                  |   deploy.yml (CD)     |
                                  |  - Verify CI Success  |
                                  |  - Trigger Render     |
                                  |    Deploy Hook        |
                                  +-----------------------+
```

---

## 🛠️ CI Workflow (`.github/workflows/ci.yml`)

### Triggers
- **Pushes** to the `main` branch.
- **Pull Requests** targeting the `main` branch.

### Environment & Runner
- **OS**: `ubuntu-latest`
- **Node.js**: `20.x` (with `npm` dependency caching enabled)

### Database Service Container
- **Image**: `postgres:16`
- **Port**: `5432:5432`
- **Environment**:
  - `POSTGRES_USER`: `vanika`
  - `POSTGRES_PASSWORD`: `vanika`
  - `POSTGRES_DB`: `vanika_test`
- **Health Check**: `pg_isready -U vanika -d vanika_test`

### Pipeline Steps
1. **Checkout**: Checks out source code (`actions/checkout@v4`).
2. **Setup Node**: Installs Node 20 and restores npm cache (`actions/setup-node@v4`).
3. **Install Dependencies**: Runs `npm ci` for clean, lockfile-reproducible installation.
4. **Prisma Client Generation**: Runs `npx prisma generate`.
5. **Prisma Database Migration**: Runs `npx prisma migrate deploy` against the CI Postgres service container.
6. **TypeScript Validation**: Executes `npm run lint` (`tsc --noEmit`) to enforce zero type errors.
7. **Automated Test Suite**: Executes `npm test` (`tsx server/src/tests/runAllTests.ts`) to ensure 100% of all 282 backend, security, voice, offline, and AI test cases pass.
8. **Production Build**: Executes `npm run build` (Vite frontend build + esbuild CJS server bundle build to `dist/server.cjs`).

---

## 🚢 CD Workflow (`.github/workflows/deploy.yml`)

### Triggers
- **`workflow_run`**: Automatically triggers when the **CI** workflow finishes execution on the `main` branch.

### Execution Guards & Safety
- **CI Dependency**: Only executes if `github.event.workflow_run.conclusion == 'success'`.
- **Branch Restriction**: Only executes for commits on `main` (`github.event.workflow_run.head_branch == 'main'`).
- **PR Protection**: Pull Requests NEVER trigger production deployment.
- **Secret Requirement**: Requires `RENDER_DEPLOY_HOOK_URL` in GitHub Repository Secrets. If missing, the step logs an explicit error and exits without crashing.

### Deployment Mechanism
Sends an HTTP `POST` request to the Render Deploy Hook URL using `curl -X POST -f -s -o /dev/null`.

---

## 🔑 Environment Variables & GitHub Secrets

### Required GitHub Repository Secrets
| Secret Name | Description | Required For |
|:---|:---|:---|
| `RENDER_DEPLOY_HOOK_URL` | Render Web Service Deploy Hook URL | CD (`deploy.yml`) |

### Safe CI Environment Variables (No Production Secrets Embedded)
```env
NODE_ENV=test
DATABASE_URL=postgresql://vanika:vanika@localhost:5432/vanika_test
JWT_SECRET=ci-test-secret-only-for-validation
GEMINI_API_KEY=ci-placeholder-key-for-testing
PORT=5000
```

> **Security Note:** Real production secrets (e.g. Supabase DB URL, production Gemini API key, real JWT secret) must NEVER be committed to repository source code or workflow files.

---

## 💻 Local Developer Verification

Before pushing code to GitHub, developers should run the exact validation sequence executed by CI:

```bash
# 1. Clean dependency check
npm ci

# 2. Generate Prisma client
npx prisma generate

# 3. TypeScript validation (zero errors required)
npm run lint

# 4. Run 100% of test suite (282 tests)
npm test

# 5. Build production bundle
npm run build
```

---

## 🛡️ Security & Quality Guarantees

- **No Secrets in Repo**: All secrets are handled via GitHub Repository Secrets or runtime environment variables.
- **Least-Privilege Actions**: Workflow permissions are restricted to `contents: read`.
- **Zero-Bypass Quality Gate**: Production deployments are strictly blocked if TypeScript checks or any unit test fails.
