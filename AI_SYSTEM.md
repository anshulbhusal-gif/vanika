# Vanika Cognitive Care — AI System Architecture Documentation

## 1. Architecture Overview

```
Recommendation Request (GET /api/recommendations/next)
                        │
                        ▼
            RecommendationService
                        │
                        ▼
             AIRecommendationEngine (Extends RecommendationEngine)
                        │
       ┌────────────────┴────────────────┐
       ▼                                 ▼
 GeminiService                 RuleBasedRecommendationEngine
(gemini-2.5-flash)                  (Primary Fallback)
       │                                 ▲
       ▼                                 │
AIResponseParser ──── Invalid / Error ────┘
       │
       ▼ (Valid DTO)
Return AI Recommendation
```

---

## 2. Gemini Service (`server/src/services/ai/geminiService.ts`)
- **SDK**: `@google/genai` (v2.4.0)
- **Model**: `gemini-2.5-flash`
- **Lazy Client**: Initialized on first request using `process.env.GEMINI_API_KEY`.
- **Mock Support**: Supports runtime mock injection (`setMockClient`) for fast, quota-safe unit/integration testing.

---

## 3. Data Minimization & Privacy Protection
- **Included Features**:
  - Anonymized session performance (`totalCompletedSessions`, `recentAccuracy`, `recentDifficulty`, `recentConsecutiveStrong`, `categorySignals`).
  - Active eligible games list (`id`, `title`, `categorySlug`, `baseDifficulty`).
- **Excluded Data**:
  - Passwords, password hashes, JWT tokens.
  - Emails, phone numbers, emergency contacts.
  - Raw session records and database internal metadata.

---

## 4. Prompt Engineering & Structured Output
- **`AIPromptBuilder`**: Constructs prompt instructions requiring Gemini to act as a personalization assistant for North East India elder wellness.
- **Constraints**:
  - Select strictly one `gameId` from the eligible list.
  - `recommendedDifficulty` MUST be `EASY`, `MEDIUM`, or `HARD`.
  - Non-diagnostic, gentle single-sentence explanation.
  - Output format must strictly be valid JSON without prose wrappers.

---

## 5. Server-Side Validation & Parsing (`AIResponseParser`)
- **Schema Validation**: Parses JSON and validates field types (`recommendedGameId`, `recommendedCategory`, `recommendedDifficulty`, `reason`, `confidence`).
- **Eligibility Check**: Confirms `recommendedGameId` exists in the backend eligible active games list.
- **Confidence Bounding**: Bounds confidence values between `0.0` and `1.0`.

---

## 6. Resilience, Bounded Timeout, & Fallback
- **Bounded Timeout**: 5000ms (5s) timeout prevents hanging AI calls.
- **Automatic Fallback**: If Gemini fails, times out, returns malformed output, or if `GEMINI_API_KEY` is missing, `AIRecommendationEngine` seamlessly delegates to `RuleBasedRecommendationEngine`.

---

## 7. Companion Chat Architecture (`POST /api/companion/chat`)
- **Controller**: `CompanionController.chat`
- **Security**: Protected by `authMiddleware` and `aiRateLimiter` (30 requests / 15 mins).
- **Sanitization**: Input messages are trimmed and capped at 500 characters.
- **Regional Prompts**: Supports Assamese, Bodo, Khasi, Mizo, Nagamese, and English elder companion personas with high-quality local fallback responses.

---

## 8. Testing Strategy & Model Replacement Strategy
- **Mocked Testing**: Automated tests in `server/src/tests/ai.test.ts` use mocked Gemini clients to execute 25 comprehensive test scenarios without consuming live API quota.
- **Model Swap**: Future model updates (e.g. `gemini-3-flash`) can be configured cleanly by updating `DEFAULT_MODEL` in `geminiService.ts`.
