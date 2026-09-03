# Vanika Cognitive Care — Daily Routine & Completion System

## 1. Data Model

The Routine System is built on the existing Prisma schema entities without requiring database migrations:

### `RoutineTask`
- `id`: UUID (Primary key)
- `userId`: UUID (Foreign key referencing `User.id`)
- `title`: VarChar(128) — Task title (e.g. "Morning Lal Saah & Medication")
- `icon`: VarChar(32) — Display icon emoji (default `"📋"`)
- `scheduledTime`: Time — Daily scheduled execution time (stored as `@db.Time`)
- `period`: `RoutinePeriod` enum (`MORNING`, `AFTERNOON`, `EVENING`)
- `category`: `RoutineCategory` enum (`MEDICATION`, `HYDRATION`, `COGNITIVE_ACTIVITY`, `MEAL`, `WALK`, `REST`, `OTHER`)
- `isActive`: Boolean — Active state toggle (default `true`)
- `createdAt` / `updatedAt`: Timestamptz audit fields

### `RoutineTaskLog`
- `id`: UUID (Primary key)
- `routineTaskId`: UUID (Foreign key referencing `RoutineTask.id`)
- `userId`: UUID (Foreign key referencing `User.id`)
- `scheduledDate`: Date — Occurrence date (stored as `@db.Date`)
- `completedAt`: Timestamptz — Accurate completion timestamp
- `isCompleted`: Boolean — Completion status flag
- `completedByUserId`: UUID — User ID who completed the task
- **Database Composite Constraint**: `@@unique([routineTaskId, scheduledDate], name: "uq_routine_task_date")`

---

## 2. Recurrence Rules

Daily routine activities represent daily recurring occurrences:
- Each active `RoutineTask` (`isActive: true`) recurs daily.
- Occurrence completion is tracked per date (`YYYY-MM-DD`) in `RoutineTaskLog`.
- Period categorization is automatically derived or explicitly assigned:
  - **`MORNING`**: 05:00 - 11:59
  - **`AFTERNOON`**: 12:00 - 16:59
  - **`EVENING`**: 17:00 - 22:59

---

## 3. Today's Routine Logic (`GET /api/routines/today`)

- Queries all active routine tasks belonging to `req.user.id`.
- Fetches `RoutineTaskLog` records for the target date (`YYYY-MM-DD`, defaulting to server ISO date).
- Merges daily task status with completion logs (`isCompletedToday`, `completedAtToday`).
- Groups tasks into logical presentation periods (`MORNING`, `AFTERNOON`, `EVENING`).
- Calculates completion metrics:
  - `totalTasks`: Total active tasks
  - `completedCount`: Completed task count for today
  - `completionPercentage`: `(completedCount / totalTasks) * 100`

---

## 4. Completion & Idempotency Strategy (`POST /api/routines/:id/complete`)

- **Ownership Check**: Verifies `routineTask.userId === req.user.id`.
- **Active Task Gate**: Inactive tasks (`isActive: false`) cannot be completed.
- **Idempotency Guarantee**: Uses database upsert on `uq_routine_task_date` (`[routineTaskId, scheduledDate]`).
- **Duplicate Prevention**: Repeated calls to complete the same routine on the same date update the existing completion log idempotently rather than creating duplicate historical records.

---

## 5. Timezone Strategy

- Scheduled times are stored in `@db.Time` format (`HH:mm`).
- Target dates for completions are parsed in ISO date format (`YYYY-MM-DD`).
- All completion timestamps (`completedAt`) are recorded as UTC timestamptz (`@db.Timestamptz`).
- Server ISO/UTC date serves as the authoritative source of truth.

---

## 6. Routine History (`GET /api/routines/history`)

- Provides paginated access (`page`, `limit`) to historical completion logs.
- Joins task metadata (`title`, `icon`, `period`, `category`).
- Returns completion status, target date, and completion timestamp.

---

## 7. Security & Ownership Controls

- **IDOR Protection**: Authenticated `req.user.id` is strictly enforced. Changing a routine ID in the URL to access or modify another user's task returns `403 Forbidden` or `404 Not Found`.
- **No Client User Spoofing**: Client-supplied `userId` parameters in body or query are strictly ignored in favor of `req.user.id`.

---

## 8. Caregiver Read-Only Access (`GET /api/caregiver/users/:userId/routines`)

- Caregivers with an **`ACTIVE`** caregiver relationship can view an elderly user's routines in read-only mode.
- Accessing routines of unconnected or pending users returns `403 Forbidden`.
- Caregivers **CANNOT** create, edit, delete, or mark completion on elderly routines.

---

## 9. Endpoint List

| Method | Endpoint Path | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/routines` | Authenticated User | Get all routine tasks owned by user. |
| `POST` | `/api/routines` | Authenticated User | Create a new daily routine task. |
| `GET` | `/api/routines/today` | Authenticated User | Get today's routines grouped by period. |
| `GET` | `/api/routines/history` | Authenticated User | Get paginated routine completion logs. |
| `PATCH` | `/api/routines/:id` | Authenticated User | Update routine task properties (owner only). |
| `DELETE` | `/api/routines/:id` | Authenticated User | Delete routine task (owner only). |
| `POST` | `/api/routines/:id/complete` | Authenticated User | Mark routine completed for target date (Idempotent). |
| `GET` | `/api/caregiver/users/:userId/routines` | Authenticated Caregiver | Read-only view of connected elderly user routines. |

---

## 10. Known Limitations

- External notifications, push messaging, SMS, email alerts, and voice prompts are intentionally excluded in this backend foundation step.
