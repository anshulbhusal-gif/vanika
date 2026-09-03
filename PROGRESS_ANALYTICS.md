# Progress, Performance & Analytics System Documentation

The **Progress, Performance & Analytics** API module provides cognitive metrics, daily gameplay trends, streak tracking, activity history, and category breakdowns for the **Vanika** cognitive care platform.

---

## 🌐 Available Endpoints

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `GET` | `/api/progress/summary` | `authMiddleware` | Returns aggregate metrics (total games/sessions, average score/accuracy, current & longest streak, recent activity, latest completed session). |
| `GET` | `/api/progress/history` | `authMiddleware` + `validatePaginationQuery` | Returns paginated completed activity history ordered by `createdAt DESC`. |
| `GET` | `/api/progress/categories` | `authMiddleware` | Returns cognitive performance breakdown across all 5 categories (`MEMORY`, `ATTENTION`, `PATTERN`, `RECALL`, `OBJECT_RECOGNITION`). |
| `GET` | `/api/progress/trends` | `authMiddleware` + `validateTrendQuery` | Returns daily performance trend data points for chart rendering. Supports `?period=7d`, `30d`, `90d`. |

---

## 📈 Aggregation Logic & Formulas

- **Average Score**: $\text{Average Score} = \text{Round}\left(\frac{\sum \text{scoreObtained}}{\text{Total Completed Sessions}}\right)$
- **Average Accuracy**: $\text{Average Accuracy} = \text{Round}\left(\frac{\sum \text{accuracyPercentage}}{\text{Total Completed Sessions}}\right)$
- **Category Performance**: Evaluates completed sessions filtered by `game.categoryId`. Insufficient data returns `gamesCompleted: 0`, `averageAccuracy: 0`, `averageScore: 0`, `latestPlayedAt: null`.

---

## 🔥 Streak Rules & Calculation

1. **Date Normalization**: Timestamps are converted to `YYYY-MM-DD` calendar date strings in UTC ISO format.
2. **Same-Day Deduplication**: Multiple games completed on the exact same date count as **1 active day** for streak calculations.
3. **Current Streak**: Number of consecutive calendar days with at least 1 completed session ending **today** or **yesterday**. If no activity today or yesterday, `currentStreak = 0`.
4. **Longest Streak**: The maximum consecutive active calendar days sequence achieved historically across the user's entire account lifecycle.

---

## 📊 Trend Periods

Supported query parameters for `GET /api/progress/trends?period=...`:
- `7d` (Default): Last 7 calendar days.
- `30d`: Last 30 calendar days.
- `90d`: Last 90 calendar days.

Response structure:
```json
{
  "success": true,
  "data": {
    "period": "7d",
    "startDate": "2026-08-28",
    "endDate": "2026-09-03",
    "dataPoints": [
      {
        "date": "2026-09-03",
        "sessionsCompleted": 2,
        "averageScore": 120,
        "averageAccuracy": 100.00
      }
    ]
  }
}
```

---

## ⚡ Empty State Handling

For brand-new users with zero completed sessions:
- `totalCompletedGames`: `0`
- `totalCompletedSessions`: `0`
- `averageScore`: `0`
- `averageAccuracy`: `0`
- `currentStreak`: `0`
- `longestStreak`: `0`
- `recentActivity`: `[]`
- `latestCompletedSession`: `null`
- No fake or generated data is returned.

---

## 🗄️ Database Indexing Strategy

Queries utilize compound indexes already present in `prisma/schema.prisma`:
- `GameSession`: `@@index([userId])`, `@@index([userId, startedAt(sort: Desc)])`
- `GameResult`: `@@index([userId])`, `@@index([userId, createdAt(sort: Desc)])`
