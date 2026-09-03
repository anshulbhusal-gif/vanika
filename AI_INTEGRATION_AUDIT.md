# Vanika Cognitive Care — Gemini AI Integration Audit & Architectural Plan

## 1. Executive Summary

This audit assesses the current state of Google Gemini AI integration within the codebase prior to implementing modular AI recommendation and personalization services.

---

## 2. Audit Findings (Questions A–J)

| Query | Finding | Details |
| :--- | :--- | :--- |
| **A. Is a Gemini SDK installed?** | **YES** | `@google/genai` version `^2.4.0` is installed in `package.json`. |
| **B. Is Gemini API key configured?** | **YES** | `process.env.GEMINI_API_KEY` is configured and verified active via `GET /api/health` (`geminiConfigured: true`). |
| **C. Is Gemini called anywhere?** | **YES** | Embedded endpoint `POST /api/companion/chat` in `server.ts` invokes Gemini for regional AI companion chat. |
| **D. Is there an AI service?** | **PARTIAL** | Lazy client initialization `getAIClient()` exists in `server.ts`. No modular service file in `server/src/services/` yet. |
| **E. Is there an AI route/controller?** | **PARTIAL** | `POST /api/companion/chat` is defined directly in root `server.ts`. |
| **F. Is existing code production-safe?** | **PARTIALLY** | Contains resilient local fallbacks, but lacks JWT authentication middleware and modular separation. |
| **G. Is the API key server-side?** | **YES** | Key is accessed strictly via Node.js `process.env.GEMINI_API_KEY` on the backend server. |
| **H. Is key exposed to frontend?** | **NO** | No `VITE_` prefixed Gemini environment variables exist. Keys remain strictly server-side. |
| **I. Configured Gemini model** | `gemini-2.5-flash` | Used in content generation calls in `server.ts`. |
| **J. Suitable for AI engine?** | **YES** | Installed SDK and strategy pattern (`RecommendationEngine`) provide an ideal foundation for `AIRecommendationEngine`. |

---

## 3. Existing Code Locations

- **SDK Dependency**: [`package.json`](file:///c:/Users/DELL/Downloads/sih26-main%20%281%29/package.json#L20) (`@google/genai: ^2.4.0`)
- **Environment Template**: [`.env.example`](file:///c:/Users/DELL/Downloads/sih26-main%20%281%29/.env.example#L18) (`GEMINI_API_KEY`)
- **Server Endpoint & Client Init**: [`server.ts`](file:///c:/Users/DELL/Downloads/sih26-main%20%281%29/server.ts#L22-L134) (`getAIClient()`, `/api/companion/chat`, `/api/health`)
- **Recommendation Strategy Interface**: [`RecommendationEngine.ts`](file:///c:/Users/DELL/Downloads/sih26-main%20%281%29/server/src/services/recommendation/RecommendationEngine.ts) (`abstract class RecommendationEngine`)
- **Recommendation Facade**: [`recommendationService.ts`](file:///c:/Users/DELL/Downloads/sih26-main%20%281%29/server/src/services/recommendationService.ts) (`RecommendationService.setEngine()`)

---

## 4. Security Findings & Frontend Exposure Assessment

- **Server-Side Key Isolation**: `GEMINI_API_KEY` is loaded strictly on the Node.js server. The key is never passed into React client bundles or Vite client environment variables.
- **Exposure Risk**: **LOW**. The frontend calls backend REST endpoints (`/api/*`) without direct access to API credentials.
- **Security Improvement Needed**: The existing companion endpoint (`POST /api/companion/chat`) currently lacks `authMiddleware` JWT verification. Future AI endpoints must enforce JWT authentication and rate limiting.

---

## 5. Recommended Architecture for Gemini AI Services

```
Client Requests
      │
      ▼
[authMiddleware (JWT Validation)]
      │
      ▼
[AI Controller / Route]
      │
      ▼
[AIService / AIRecommendationEngine]
      │
      ├───────────────────────────────┐
      ▼                               ▼
[Gemini API (@google/genai)]   [Resilient Rule-Based Fallback]
(gemini-2.5-flash)            (RuleBasedRecommendationEngine)
```

1. **Modular `geminiClient.ts`**: Extract singleton client initialization into `server/src/config/geminiClient.ts`.
2. **Modular `AIService` / `AIRecommendationEngine`**: Create `AIRecommendationEngine` extending `RecommendationEngine` to generate personalized recommendations with fallback to `RuleBasedRecommendationEngine`.
3. **Structured JSON Output**: Use system instructions and JSON response constraints for structured, deterministic AI responses.
4. **Fallback Safety**: If Gemini API call fails, times out, or `GEMINI_API_KEY` is unconfigured, seamlessly fallback to deterministic rule-based output without throwing errors to the user.

---

## 6. What Should NOT Be Changed

- **Existing Stable Modules**: PostgreSQL + Prisma, Auth + JWT, RBAC, User Profile, Preferences, Accessibility Settings, Game Catalog, Game Sessions, Server-side Scoring, Progress & Analytics, Caregiver, Daily Routines, Notifications.
- **RuleBasedRecommendationEngine**: Must remain active and preserved as the primary fallback engine.
- **Database Schema**: No schema changes required for basic AI personalization auditing.
- **Frontend Code**: Do not modify any frontend React components or UI layouts.
