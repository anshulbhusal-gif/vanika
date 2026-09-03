# Vanika Cognitive Care — Adaptive Difficulty & Personalized Recommendation Engine

## 1. Recommendation Architecture

The recommendation module follows a decoupled Strategy Pattern abstraction to ensure isolated, testable, and extensible recommendation logic without hardcoding rules inside controllers or database handlers.

```
┌──────────────────────────────────────────────┐
│          RecommendationController            │
│       GET /api/recommendations/next          │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│             RecommendationService            │
└──────────────────────┬───────────────────────┘
                       │ (Depends on Abstraction)
                       ▼
┌──────────────────────────────────────────────┐
│            RecommendationEngine              │  <--- Abstract Strategy
└──────────────────────┬───────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
┌─────────────────────────┐  ┌─────────────────────────────┐
│  RuleBased              │  │  AIRecommendationEngine     │
│  RecommendationEngine   │  │  (Future Plug-and-Play)     │
│  (Active Engine)        │  │                             │
└─────────────────────────┘  └─────────────────────────────┘
```

- **`RecommendationEngine`**: Abstract base class defining the contract `getNextRecommendation(userId: string): Promise<RecommendationResultDto | null>`.
- **`RuleBasedRecommendationEngine`**: Concrete implementation executing bounded signal extraction, hysteresis difficulty transitions, category balancing, and game selection.
- **`RecommendationService`**: Facade permitting runtime dependency injection (`RecommendationService.setEngine(...)`).

---

## 2. Performance Signals Used

All signals are computed strictly from real data stored in PostgreSQL (`GameResult`, `GameSession`, `GameCategory`, `GameContentItem`). No fabricated metrics are generated.

1. **`totalCompletedSessions`**: Total count of completed sessions by the user.
2. **`recentAccuracy`**: Floating point average accuracy percentage ($0 - 100$) over the bounded recent window (up to 5 most recent sessions).
3. **`recentScore`**: Average score obtained over the bounded recent window.
4. **`overallAverageAccuracy`**: Overall average accuracy percentage over the max bounded history window (up to 10 sessions).
5. **`recentDifficulty`**: Difficulty level (`EASY`, `MEDIUM`, `HARD`) used in the user's most recent session. Defaults to `EASY`.
6. **`recentConsecutiveStrong`**: Count of consecutive recent sessions with accuracy $\ge 80\%$.
7. **`recentConsecutiveWeak`**: Count of consecutive recent sessions with accuracy $< 50\%$.
8. **`lastPlayedCategoryId`**: Category ID of the immediate preceding completed game session.
9. **`lastPlayedGameId`**: Game ID of the immediate preceding completed game session.
10. **`categorySignals`**: Per-category metrics including `gamesCompleted`, `averageAccuracy`, and `latestPlayedAt`.

---

## 3. Recent-History Window

- **Max History Window**: Bounded to the $10$ most recent `GameResult` records (`take: 10`, `orderBy: { createdAt: 'desc' }`).
- **Recent Window**: Bounded to the $5$ most recent `GameResult` records for immediate trend calculation.
- **Rationale**: Bounded window queries eliminate N+1 performance bottlenecks, prevent unbounded database scans, and prioritize recent performance over legacy performance.

---

## 4. Difficulty Thresholds

Only the 3 existing database enum difficulty levels are used: `EASY`, `MEDIUM`, `HARD`.

| Current Difficulty | Sustained Performance Condition | Next Recommended Difficulty | Trigger Reason |
| :--- | :--- | :--- | :--- |
| `EASY` | `recentAccuracy >= 80%` AND `recentConsecutiveStrong >= 2` | `MEDIUM` | Sustained strong performance! Advancing to Medium difficulty. |
| `MEDIUM` | `recentAccuracy >= 85%` AND `recentConsecutiveStrong >= 3` | `HARD` | Sustained high accuracy across recent sessions! Advancing to Hard challenge. |
| `MEDIUM` | `recentAccuracy < 50%` AND `recentConsecutiveWeak >= 2` | `EASY` | Recent performance is below your average. Adjusting to Easy difficulty for steady practice. |
| `HARD` | `recentAccuracy < 50%` AND `recentConsecutiveWeak >= 2` | `MEDIUM` | Recent performance is below your average. Adjusting to Medium difficulty to reinforce core concepts. |
| *Any* | $50\% \le \text{recentAccuracy} < 80\%$ or mixed trend | *Maintain Current* | Maintaining current difficulty for consistent cognitive practice. |

---

## 5. Hysteresis & Stability Rules

To prevent difficulty oscillation after a single unusually good or bad session:
- **No Single-Session Jumps**: Advancing from `EASY` to `MEDIUM` requires at least **2 consecutive strong sessions** ($\ge 80\%$).
- **Higher Threshold for Hard**: Advancing from `MEDIUM` to `HARD` requires at least **3 consecutive strong sessions** ($\ge 85\%$).
- **Sustained Drop Evidence**: Dropping difficulty requires at least **2 consecutive weak sessions** ($< 50\%$).
- **Isolated Outliers**: A single isolated high or low accuracy session preserves current difficulty.

---

## 6. Category Selection Logic

Categories correspond to active `GameCategory` records (`MEMORY`, `ATTENTION`, `PATTERN`, `RECALL`, `OBJECT_RECOGNITION`).

1. **Unpracticed Priority**: Select active category that has 0 completed sessions (`gamesCompleted === 0`).
2. **Repetition Avoidance**: Exclude `lastPlayedCategoryId` if other active categories exist.
3. **Targeted Practice**: Select category whose average accuracy is below user's overall average.
4. **Recency Fallback**: Select category least recently played (`latestPlayedAt` ascending).

### Neutral & Non-Diagnostic Language
The system strictly uses positive, non-stigmatizing wellness terminology:
- `"Less recently practiced activity in Attention & Focus."`
- `"Recent performance in Memory & Reminiscence is below your recent average. A different activity may be useful next."`
- `"A different activity in Pattern Recognition may be useful next to maintain balanced practice."`

---

## 7. Game Selection Logic

- **Active Only**: Select games with `isActive: true`.
- **Playable Content Guarantee**: Select games with at least 1 playable `GameContentItem` (`contentItems: { some: {} }`).
- **Repetition Reduction**: Exclude `lastPlayedGameId` if alternative active playable games exist in the category.
- **Category Fallback**: If no playable game exists in the selected category, fallback to any active game with content across all categories.

---

## 8. New-User Behavior ($\le 1$ Session)

- **Total Sessions = 0**:
  - Recommends starter game (e.g. `memory-match-assam` or first active game with content).
  - Recommended Difficulty: `EASY` (or game base difficulty).
  - `limitedHistory`: `true`.
  - Confidence Score: `0.60`.
  - Reason: `"Starter activity in Memory & Reminiscence. Starter activity recommended based on your initial baseline."`
- **Total Sessions = 1**:
  - Conservative evaluation. Maintains base difficulty unless clear evidence exists.
  - `limitedHistory`: `true`.

---

## 9. Limited-History Behavior

When a user has $\le 1$ completed session:
- The engine operates in conservative mode.
- Avoids aggressive difficulty advances.
- Flags `limitedHistory: true` in the API response contract for frontend messaging.

---

## 10. Fallback Behavior

- **No Playable Games**: If no active games or games without content items exist in DB, returns `200 OK` with `data: null` and message `"No active playable recommendations available at this time"`.
- **Category Drain**: If a selected category has no playable games, seamlessly falls back to another active category with playable content.
- **No History**: Operates safely without error throwing zeroed metrics.

---

## 11. API Response Contract

### Request
```http
GET /api/recommendations/next
Authorization: Bearer <valid_jwt_token>
```

### Success Response (`200 OK`)
```json
{
  "status": "success",
  "message": "Next personalized activity recommendation retrieved successfully",
  "data": {
    "gameId": "b1a2c3d4-5678-90ab-cdef-1234567890ab",
    "gameSlug": "memory-match-assam",
    "gameTitle": "Assam Cultural Memory Match",
    "categorySlug": "memory",
    "categoryName": "Memory & Reminiscence",
    "recommendedDifficulty": "EASY",
    "recommendationReason": "Starter activity in Memory & Reminiscence. Starter activity recommended based on your initial baseline.",
    "limitedHistory": true,
    "confidenceScore": 0.6
  }
}
```

### Empty/Fallback Response (`200 OK`)
```json
{
  "status": "success",
  "message": "No active playable recommendations available at this time",
  "data": null
}
```

---

## 12. Known Limitations

- **Stateless Recommendations**: Recommendations are computed dynamically per request rather than persisted in `activity_recommendations` table, keeping the DB stateless and fast.
- **Rule-Based Thresholds**: Rule-based thresholds are fixed constants ($80\%, 85\%, 50\%$).
- **Bounded Window**: History is bounded to the 10 most recent results to maintain fast query execution times.

---

## 13. Future AI Integration Point

To replace or augment the rule-based engine with an LLM or ML model in the future:
1. Create `AIRecommendationEngine extends RecommendationEngine` in `server/src/services/recommendation/AIRecommendationEngine.ts`.
2. Implement `getNextRecommendation(userId: string): Promise<RecommendationResultDto | null>`.
3. Inject the engine via `RecommendationService.setEngine(new AIRecommendationEngine())`.
4. No changes are required in `RecommendationController`, `recommendationRoutes`, or public API contracts.
