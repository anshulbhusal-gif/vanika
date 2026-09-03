# Vanika Cognitive Care — Caregiver Relationship & Authorized Monitoring System

## 1. Overview & Business Model

The Caregiver Relationship module provides a secure, privacy-preserving, and non-stigmatizing delegation model between **CAREGIVERS** (family members, guardians, or ASHA health workers) and **ELDERLY** users.

- **Non-Diagnostic Monitoring**: Caregivers receive descriptive activity and progress metrics (e.g. activities completed, domain trends, streak days) to support remote wellness oversight without exposing clinical diagnoses or risk labels.
- **Strict User Authorization & IDOR Protection**: Caregiver access to elderly data is granted **ONLY** when an explicit, mutual `ACTIVE` relationship exists. Tampering with user IDs in URL paths or request bodies is strictly blocked with `403 Forbidden`.

---

## 2. Relationship Lifecycle & Allowed States

Relationships are modeled by the `CaregiverRelationship` entity with the `RelationshipStatus` enum:

```
                  ┌─────────┐
                  │ PENDING │
                  └────┬────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
  Target Elder Accept         Target Elder Reject
         │                           │
         ▼                           ▼
    ┌──────────┐               ┌──────────┐
    │  ACTIVE  │               │ DECLINED │
    └────┬─────┘               └──────────┘
         │
 Participant Remove
         │
         ▼
    ┌──────────┐
    │ REVOKED  │
    └──────────┘
```

1. **`PENDING`**: Initial state when a caregiver sends a connection request to an elderly user by email, phone, or UUID.
2. **`ACTIVE`**: Granted when the target elderly user accepts the pending connection request. **Only this state grants data monitoring permissions.**
3. **`DECLINED`**: Set when the target elderly user rejects a connection request. Grants zero data access.
4. **`REVOKED`**: Set when either participant (caregiver or elderly user) removes an existing connection. Immediately revokes data access while preserving historical audit records.

---

## 3. Allowed State Transitions

| Initial State | Triggering Endpoint | Performed By | Resulting State | Access Granted? |
| :--- | :--- | :--- | :--- | :--- |
| *None* | `POST /api/caregiver/connections` | `CAREGIVER` | `PENDING` | No |
| `PENDING` | `PATCH /api/caregiver/connections/:id/accept` | `ELDER` (Target) | `ACTIVE` | **YES** |
| `PENDING` | `PATCH /api/caregiver/connections/:id/reject` | `ELDER` (Target) | `DECLINED` | No |
| `ACTIVE` | `DELETE /api/caregiver/connections/:id` | Either Participant | `REVOKED` | **NO (Revoked)** |
| `DECLINED` / `REVOKED` | `POST /api/caregiver/connections` | `CAREGIVER` | `PENDING` | No |

---

## 4. Caregiver Permissions & Boundaries

### Permitted Caregiver Actions (Read-Only Monitoring)
- Send a connection request to an elderly user.
- View list of caregiver connections and relationship statuses.
- Remove/revoke a relationship.
- View read-only profile summary of an **ACTIVE** connected elderly user.
- View progress aggregates and domain performance of an **ACTIVE** connected elderly user.
- View activity history logs of an **ACTIVE** connected elderly user.

### Prohibited Caregiver Actions (Strictly Blocked)
- Cannot accept connection requests on behalf of elderly users.
- Cannot access data of unconnected, pending, declined, or revoked elderly users.
- Cannot modify elderly user credentials, passwords, email, or security fields.
- Cannot alter user roles or account status.
- Cannot modify game session scores, answer correctness, or server-side progress history.
- Cannot alter adaptive recommendation results.

---

## 5. Elderly User Permissions
- Accept pending caregiver connection requests directed to their account.
- Reject pending caregiver connection requests directed to their account.
- Remove/revoke active caregiver connections at any time.
- View list of authorized caregivers monitoring their activity.

---

## 6. Authorization Flow & IDOR Protection

```
Client Request ---> [authMiddleware (Validates JWT)]
                        │
                        ▼
                [CaregiverController]
                        │
                        ▼
            [CaregiverService.verifyActiveRelationship]
                        │
       ┌────────────────┴────────────────┐
       │ Is caregiverUserId + elderUserId │
       │ status === 'ACTIVE'?            │
       └────────────────┬────────────────┘
                        │
         ┌──────────────┴──────────────┐
         │                             │
        YES                           NO
         │                             │
         ▼                             ▼
  Return Permitted             Throw AppError(403)
  Monitoring DTO              "Forbidden: Access Denied"
```

1. **Authentication**: Requester token is decoded via `authMiddleware` (`req.user.id`).
2. **Role Verification**: `req.user.role` must be `CAREGIVER` or `ADMIN`.
3. **Relationship Authorization**: `CaregiverService.verifyActiveRelationship(req.user.id, targetElderUserId)` queries database for `status === 'ACTIVE'`.
4. **IDOR Block**: If no active relationship matches `(caregiverUserId, targetElderUserId)`, request fails immediately with `403 Forbidden`. Tampering with `:userId` in URL paths is impossible.

---

## 7. Endpoint List

| Method | Endpoint Path | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/caregiver/connections` | `CAREGIVER` | Send connection request to an elderly user. |
| `GET` | `/api/caregiver/connections` | Any | List connections for authenticated user. |
| `PATCH` | `/api/caregiver/connections/:id/accept` | `ELDER` | Accept pending connection request. |
| `PATCH` | `/api/caregiver/connections/:id/reject` | `ELDER` | Reject pending connection request. |
| `DELETE` | `/api/caregiver/connections/:id` | Either | Remove/revoke connection request. |
| `GET` | `/api/caregiver/users/:userId/summary` | `CAREGIVER` | Read-only profile & monitoring summary. |
| `GET` | `/api/caregiver/users/:userId/progress` | `CAREGIVER` | Read-only progress & domain performance. |
| `GET` | `/api/caregiver/users/:userId/activity` | `CAREGIVER` | Read-only paginated activity history. |

---

## 8. Privacy Boundaries & Non-Diagnostic Language

The caregiver system strictly avoids clinical, diagnostic, or disease-progression labels.

### Approved Descriptive Messages
- *"Completed 4 activities this week."*
- *"Attention & Focus activities were practiced twice."*
- *"Recent accuracy: 78%."*
- *"Current streak: 3 active days."*

### Prohibited Diagnostic Terms
- No mention of "dementia", "cognitive impairment", "decline", "deterioration", or "risk factors".
- No clinical scoring scale or diagnostic predictions.

---

## 9. Failure Behavior & Safety Guarantees

- **Unauthenticated Requests**: Returns `401 Unauthorized`.
- **Unauthorized / IDOR Access**: Returns `403 Forbidden`.
- **Non-Existent Target User**: Returns `404 Not Found`.
- **Duplicate Connection Request**: Returns `409 Conflict`.
- **Invalid State Transition**: Returns `400 Bad Request`.
- **Data Minimization**: Password hashes, JWT tokens, and private security metadata are completely omitted from response DTOs.
