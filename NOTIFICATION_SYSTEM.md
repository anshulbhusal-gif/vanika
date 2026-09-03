# Vanika Cognitive Care — Internal Notification System

## 1. Notification Model

The Internal Notification System is built on the existing Prisma schema entities without requiring database migrations:

### `Notification`
- `id`: UUID (Primary Key `@id @default(uuid()) @db.Uuid`)
- `userId`: UUID (Foreign Key referencing `User.id`)
- `type`: `NotificationType` enum (`ACTIVITY_REMINDER`, `MEDICATION_REMINDER`, `ACHIEVEMENT`, `CAREGIVER_ALERT`, `SYSTEM`)
- `severity`: `NotificationSeverity` enum (`INFO`, `ADVISORY`, `URGENT`) — Default `INFO`
- `title`: VarChar(128) — Notification title
- `message`: Text — Descriptive message payload
- `icon`: VarChar(32) — Display emoji icon (default `"🔔"`)
- `actionUrl`: VarChar(255)? — Optional relative link or route
- `isRead`: Boolean — Read status (default `false`)
- `readAt`: Timestamptz? — Timestamp when marked read
- `createdAt`: Timestamptz — Timestamp created (default `now()`)
- **Database Composite Index**: `@@index([userId, isRead, createdAt(sort: Desc)])`

---

## 2. Notification Types & Severity Levels

### Controlled Enum Types (`NotificationType`)
- **`ACTIVITY_REMINDER`**: Prompt for daily cognitive activity sessions.
- **`MEDICATION_REMINDER`**: Routine activity / medication task reminder.
- **`ACHIEVEMENT`**: Milestone rewards (e.g. 3-day active streak, high score achieved).
- **`CAREGIVER_ALERT`**: Relationship request or account alert.
- **`SYSTEM`**: Platform updates or admin system announcements.

### Controlled Severity Levels (`NotificationSeverity`)
- **`INFO`**: Standard informative update.
- **`ADVISORY`**: Important recommendation or streak alert.
- **`URGENT`**: Actionable request (e.g., pending connection approval).

---

## 3. Notification Creation Rules & Security

- **No Arbitrary Public Endpoint**: Standard users cannot create arbitrary notifications or choose target `userId`s via public APIs (`POST /api/notifications` is omitted for normal users).
- **Internal Service Method**: `NotificationService.createNotification(input)` is invoked by backend services for deliberate events (streak milestones, system alerts).
- **Admin Direct Creation**: `POST /api/notifications/admin` is strictly protected by `req.user.role === 'ADMIN'`. Non-admin attempts return `403 Forbidden`.

---

## 4. API Endpoint Reference

| Method | Endpoint Path | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Authenticated User | Retrieves paginated notifications for current user (newest first). |
| `GET` | `/api/notifications/unread-count` | Authenticated User | Retrieves simple unread notification count. |
| `PATCH` | `/api/notifications/:id/read` | Authenticated User | Marks single notification read (owner only). |
| `PATCH` | `/api/notifications/read-all` | Authenticated User | Marks all notifications for current user as read. |
| `POST` | `/api/notifications/admin` | ADMIN Role Only | Creates a notification for a target user (Admin authorization enforced). |

---

## 5. Unread Behavior, Pagination, and Read Operations

### Pagination
- Supported parameters: `page` (default 1), `limit` (default 20, max 100).
- Supports `unreadOnly=true` filter.
- Returns total notification count, unread count, total pages, and structured DTO array.

### Idempotent Read Operations
- `PATCH /api/notifications/:id/read`: Setting `isRead: true` on an already-read notification returns the existing record without error or state corruption.
- `PATCH /api/notifications/read-all`: Updates all unread notifications belonging to `req.user.id` in a single transaction.

---

## 6. Duplicate & Idempotency Controls

- Retries or repeated read calls do not pollute database state.
- Notifications are generated only on deliberate backend triggers (not on routine read/get queries).

---

## 7. Security, Ownership, and Caregiver Boundaries

- **IDOR Protection**: User identity is derived strictly from `req.user.id`. Changing a notification ID in the URL to read or modify another user's notification returns `403 Forbidden`.
- **Caregiver Boundary**: Caregiver access to an elderly user's private notification inbox is strictly **prohibited**. Notification history is private to the user.

---

## 8. Future External Delivery Integration Point

The `NotificationService` provides a centralized integration hook for future push notification delivery (WebPush, Firebase, FCM), email gateways, or SMS delivery without modifying core route controllers or application business logic.
