# Vanika Cognitive Care — AI Security Audit & Compliance Report

## 1. Environment & Credentials Isolation
- **Server-Only Credentials**: `GEMINI_API_KEY` is accessed strictly via Node.js `process.env.GEMINI_API_KEY` on the backend server.
- **No Frontend Exposure**: Zero `VITE_` or client-side environment variables expose the API key. Client bundles remain 100% credential-free.
- **Sanitized Operational Logging**: Logging statements record only operational metadata (e.g. `[GeminiService] AI recommendation request timed out`). Secrets (`GEMINI_API_KEY`, `JWT_SECRET`, `DATABASE_URL`) and PII are never printed or logged.

---

## 2. Server-Controlled Model & Provider Limits
- **Hardcoded Model Selection**: Model choice is strictly hardcoded server-side to `"gemini-2.5-flash"`.
- **No Arbitrary Client Selection**: The client cannot request arbitrary models, providers, system prompts, or generation hyper-parameters.

---

## 3. Context Isolation & Data Minimization
- **Strict User Context**: User identity is derived exclusively from `req.user.id` authenticated via Bearer JWT.
- **Minimization Policy**: Prompts sent to Gemini include only anonymized performance aggregates (`recentAccuracy`, `recentDifficulty`, `recentConsecutiveStrong`, `categorySignals`). Passwords, hashes, tokens, emails, phone numbers, and profile notes are strictly excluded.

---

## 4. AI Authority & Database Boundaries
- **Zero Database Write Authority**: Gemini has NO direct write access to the database or Prisma ORM.
- **Recommendation Only**: Gemini cannot score games, alter user accuracy metrics, verify answers, or perform security checks.
- **Independent Validation**: AI outputs are parsed and validated by `AIResponseParser` and checked against eligible active games before returning to callers.

---

## 5. Endpoints Security & Rate Limiting
- **Companion Chat Protection**: `POST /api/companion/chat` is protected by `authMiddleware` (requires valid Bearer JWT) and `aiRateLimiter` (sliding window limit of 30 requests per 15 minutes per user/IP).
- **Prompt Sanitization**: User prompt messages are sanitized and truncated (max 500 characters) to prevent prompt injection and quota abuse.

---

## 6. Resilience & Graceful Fallback
- **Bounded Timeout**: Bounded 5000ms (5s) timeout prevents hanging requests.
- **Automatic Fallback**: If Gemini fails, times out, returns malformed JSON, or if `GEMINI_API_KEY` is missing, `AIRecommendationEngine` automatically falls back to `RuleBasedRecommendationEngine`.
