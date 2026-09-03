# Vanika Cognitive Care — Offline / PWA System Architecture

## 1. PWA & Service Worker Foundation
- **Web App Manifest**: `public/manifest.json` configured with standalone display mode, theme colors (`#2D4739`), and brand icons. Linked in `index.html`.
- **Service Worker (`public/sw.js`)**: Provides Cache-First static asset caching (`index.html`, bundles, CSS) for reliable offline app-shell booting.
- **Offline Detection & Reactive Hook**: `OfflineSyncService` (`src/services/offline/OfflineSyncService.ts`) paired with React hook `useOfflineStatus` (`src/services/offline/useOfflineStatus.ts`).

---

## 2. Caching Strategy Matrix

| Cache Category | Strategy | Assets Included | Security & Exclusions |
| :--- | :--- | :--- | :--- |
| **App Shell** | Cache-First | `index.html`, JavaScript, CSS, Fonts | Zero secrets cached. |
| **Static Images** | Cache-First | `/hero-tea-garden.jpg`, UI icons | Public visual assets only. |
| **Playable Content** | Cache-First / IndexedDB | Game metadata, questions, options | Answer validation metadata stored locally for offline play. |
| **Sensitive APIs** | Network-Only | `/api/auth/*`, `/api/caregiver/*`, `/api/companion/*` | Strictly excluded from service worker cache. |

---

## 3. IndexedDB Architecture (`VanikaOfflineDB`)

```
VanikaOfflineDB (v1)
 ├── cached_games (Store)
 │    Key: `id` (Game UUID)
 │    Fields: { id, slug, title, categorySlug, baseDifficulty, contentItems, cachedAt }
 │
 └── pending_sessions (Store)
      Key: `localSessionId` (Client UUID / Token)
      Fields: { localSessionId, userId, gameId, gameSlug, scoreObtained, totalPossibleScore, accuracyPercentage, answers, completedAt, status: 'PENDING_SYNC' | 'SYNCED' | 'FAILED_RETRYABLE' }
```

---

## 4. Offline Gameplay & Synchronization Flow

```
Online Device
  │ (User plays or views games)
  ▼
Cache Playable Questions → Store in IndexedDB (`cached_games`)
  │
  ▼ Device goes OFFLINE
Start Offline Session → Play Questions → Evaluate Local Score State
  │
  ▼
Store Pending Session in IndexedDB (`status: PENDING_SYNC`)
  │
  ▼ Device RECONNECTS (Connectivity returns)
OfflineSyncService → Detects Reconnection → POST /api/sync
  │ (Sends pending sessions with localSessionId idempotency key)
  ▼
Server Validates Session & Calculates Authoritative Score
  │
  ▼ Server Responds HTTP 200 OK
Mark Local Session `SYNCED` → Clean Up Storage
```

---

## 5. Idempotency & Conflict Resolution
- **Idempotency**: Every offline session generates a unique `localSessionId`. When sent to the backend `/api/sync` endpoint, the server uses this token to guarantee duplicate retry calls do not create duplicate server-side `GameResult` records.
- **Server Authority**: The backend server validates game ownership, player ID, and question accuracy server-side upon synchronization. Server results remain authoritative.
- **Failed Sync Resilience**: If connectivity drops mid-sync or authentication expires, pending records remain safely stored in IndexedDB with status `FAILED_RETRYABLE` for automatic retry on the next re-authentication.

---

## 6. Security & Privacy Controls
- **Zero Credential Caching**: Passwords, passwordHashes, JWT tokens, and private caregiver access records are 100% excluded from IndexedDB and service worker caches.
- **No Unrestricted Offline Access**: Read-only offline gameplay is limited strictly to pre-cached public cognitive games. Sensitive profile edits or role changes require fresh online authentication.
