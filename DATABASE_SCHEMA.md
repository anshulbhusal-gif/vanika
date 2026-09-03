# Vanika Cognitive Care Platform — Relational Database Architecture (PostgreSQL)

## 📋 Architectural Overview & Design Philosophy

This document defines the authoritative, production-grade PostgreSQL relational database model for **Vanika** — an AI-powered cognitive care and memory assistance platform engineered for elderly users in North Eastern Region (NER) India and their caregivers.

### Core Principles Applied
1. **UUID v4 Primary Keys**: Universal identification across distributed environments, client-side offline sync generation, and zero sequence predictability.
2. **Third Normal Form (3NF) Compliance**: Zero redundant storage of derived analytics or game scores. Analytics and progress aggregates are computed asynchronously into rollups (`daily_progress_summaries`) rather than mutating state tables.
3. **Robust Ownership & Access Security**: Strict Foreign Key rules (`ON DELETE CASCADE` for user-owned telemetry, `ON DELETE RESTRICT` for system catalog tables).
4. **Flexible Content Architecture**: Game questions and options use an extensible polymorphic metadata pattern (`JSONB`) to support diverse cognitive exercises (Photo Recall, Sequence Ordering, Visual Scan, Heritage Quizzes) without schema migrations for new game types.
5. **Non-Editable Field Protections**: Critical analytical, scoring, and authorization fields are designated read-only for normal users and updateable only via system/service triggers.

---

## 🗂️ Data Domain Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. IDENTITY & AUTHORIZATION                                                │
│    ├── users                                                                │
│    ├── profiles                                                             │
│    ├── accessibility_settings                                               │
│    └── user_preferences                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. CAREGIVER & DELEGATION                                                  │
│    └── caregiver_relationships                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. COGNITIVE ENGINE & CONTENT CATALOG                                      │
│    ├── game_categories                                                      │
│    ├── games                                                                │
│    ├── game_content_items                                                   │
│    └── game_options                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. TELEMETRY, SESSIONS & RESULTS                                           │
│    ├── game_sessions                                                        │
│    ├── submitted_answers                                                    │
│    └── game_results                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. ANALYTICS, ADAPTATION & RECOMMENDATIONS                                 │
│    ├── daily_progress_summaries                                             │
│    ├── difficulty_history                                                   │
│    └── activity_recommendations                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 6. DAILY WELLNESS ROUTINES & NOTIFICATIONS                                 │
│    ├── routine_tasks                                                        │
│    ├── routine_task_logs                                                    │
│    └── notifications                                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔤 Enumerated Types (Enums)

```sql
-- Role Hierarchy
CREATE TYPE user_role AS ENUM (
  'ELDER',
  'CAREGIVER',
  'ADMIN'
);

-- Supported Languages
CREATE TYPE app_language AS ENUM (
  'ENGLISH',
  'ASSAMESE',
  'BODO',
  'KHASI',
  'MIZO',
  'NAGAMESE',
  'HINDI',
  'BENGALI',
  'NEPALI',
  'MANIPURI'
);

-- Accessibility Font Scale
CREATE TYPE font_scale AS ENUM (
  'NORMAL',
  'LARGE',
  'EXTRA_LARGE'
);

-- Speech Speed
CREATE TYPE voice_pace AS ENUM (
  'SLOW',
  'NORMAL'
);

-- Caregiver Relationship Status
CREATE TYPE relationship_status AS ENUM (
  'PENDING',
  'ACTIVE',
  'REVOKED',
  'DECLINED'
);

-- Cognitive Game Domain / Type
CREATE TYPE game_type AS ENUM (
  'PHOTO_RECALL',
  'CARD_MATCH',
  'SEQUENCE_ORDER',
  'SPOT_DIFFERENCE',
  'HERITAGE_QUIZ',
  'PATTERN_COMPLETE'
);

-- Game Difficulty Levels
CREATE TYPE difficulty_level AS ENUM (
  'EASY',
  'MEDIUM',
  'HARD'
);

-- Game Session Lifecycle State
CREATE TYPE session_status AS ENUM (
  'IN_PROGRESS',
  'COMPLETED',
  'ABANDONED',
  'PAUSED'
);

-- Routine Period
CREATE TYPE routine_period AS ENUM (
  'MORNING',
  'AFTERNOON',
  'EVENING'
);

-- Routine Task Category
CREATE TYPE routine_category AS ENUM (
  'MEDICATION',
  'HYDRATION',
  'COGNITIVE_ACTIVITY',
  'MEAL',
  'WALK',
  'REST',
  'OTHER'
);

-- Notification Category & Severity
CREATE TYPE notification_type AS ENUM (
  'ACTIVITY_REMINDER',
  'MEDICATION_REMINDER',
  'ACHIEVEMENT',
  'CAREGIVER_ALERT',
  'SYSTEM'
);

CREATE TYPE notification_severity AS ENUM (
  'INFO',
  'ADVISORY',
  'URGENT'
);
```

---

## 🏛️ Comprehensive Table Definitions

### 1. IDENTITY & AUTHORIZATION

#### `users`
Central authentication table for all system actors.

```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE,
  phone           VARCHAR(32) UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            user_role NOT NULL DEFAULT 'ELDER',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT chk_user_contact CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_users_role ON users(role);
```

#### `profiles`
Detailed demographic, cultural, and personal memory background for users.

```sql
CREATE TABLE profiles (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name             VARCHAR(128) NOT NULL,
  nickname              VARCHAR(64),
  date_of_birth         DATE,
  gender                VARCHAR(32),
  primary_language      app_language NOT NULL DEFAULT 'ENGLISH',
  location              VARCHAR(128) NOT NULL DEFAULT 'Guwahati, Assam',
  emergency_phone       VARCHAR(32),
  reminiscence_topic    TEXT,
  notes                 TEXT,
  avatar_url            VARCHAR(512),
  onboarding_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_language ON profiles(primary_language);
```

#### `accessibility_settings`
User-specific UI adjustments designed for elderly cognitive & sensory accessibility.

```sql
CREATE TABLE accessibility_settings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  font_size             font_scale NOT NULL DEFAULT 'NORMAL',
  high_contrast         BOOLEAN NOT NULL DEFAULT FALSE,
  dark_mode             BOOLEAN NOT NULL DEFAULT FALSE,
  reduced_motion        BOOLEAN NOT NULL DEFAULT FALSE,
  voice_speed           voice_pace NOT NULL DEFAULT 'SLOW',
  voice_guide_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_accessibility_user_id ON accessibility_settings(user_id);
```

#### `user_preferences`
Personalized gaming goals, practice areas, and feature flags.

```sql
CREATE TABLE user_preferences (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  daily_activity_goal       INT NOT NULL DEFAULT 2 CHECK (daily_activity_goal BETWEEN 1 AND 10),
  preferred_practice_areas  VARCHAR(64)[] NOT NULL DEFAULT ARRAY['memory', 'attention'],
  audio_feedback_enabled    BOOLEAN NOT NULL DEFAULT TRUE,
  offline_sync_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
```

---

### 2. CAREGIVER & DELEGATION

#### `caregiver_relationships`
Maps elderly patients to authorized family caregivers with granular permissions.

```sql
CREATE TABLE caregiver_relationships (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  elder_user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caregiver_user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  relationship_type     VARCHAR(64) NOT NULL, -- e.g., 'Daughter', 'Son', 'Spouse', 'Nurse'
  status                relationship_status NOT NULL DEFAULT 'PENDING',
  can_view_analytics    BOOLEAN NOT NULL DEFAULT TRUE,
  can_manage_routines   BOOLEAN NOT NULL DEFAULT TRUE,
  can_upload_memories   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_caregiver_pair UNIQUE (elder_user_id, caregiver_user_id),
  CONSTRAINT chk_different_users CHECK (elder_user_id <> caregiver_user_id)
);

CREATE INDEX idx_caregiver_elder ON caregiver_relationships(elder_user_id);
CREATE INDEX idx_caregiver_user ON caregiver_relationships(caregiver_user_id);
CREATE INDEX idx_caregiver_status ON caregiver_relationships(status);
```

---

### 3. COGNITIVE ENGINE & CONTENT CATALOG

#### `game_categories`
Broad cognitive domains (Memory, Attention, Pattern Recognition, Daily Recall).

```sql
CREATE TABLE game_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(64) UNIQUE NOT NULL,
  name            VARCHAR(128) NOT NULL,
  description     TEXT NOT NULL,
  icon            VARCHAR(64) NOT NULL,
  display_order   INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_game_categories_slug ON game_categories(slug);
```

#### `games`
Core cognitive exercises registry.

```sql
CREATE TABLE games (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id                 UUID NOT NULL REFERENCES game_categories(id) ON DELETE RESTRICT,
  slug                        VARCHAR(64) UNIQUE NOT NULL,
  title                       VARCHAR(128) NOT NULL,
  description                 TEXT NOT NULL,
  icon                        VARCHAR(64) NOT NULL,
  game_type                   game_type NOT NULL,
  base_difficulty             difficulty_level NOT NULL DEFAULT 'EASY',
  estimated_duration_seconds  INT NOT NULL DEFAULT 300,
  config_schema               JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active                   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_games_category ON games(category_id);
CREATE INDEX idx_games_slug ON games(slug);
CREATE INDEX idx_games_type ON games(game_type);
```

#### `game_content_items`
Question and exercise repository. Supports both global system questions and private family reminiscence content uploaded by caregivers.

```sql
CREATE TABLE game_content_items (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id               UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  owner_user_id         UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL = System Global; non-null = Personal Family Photo
  title                 VARCHAR(255) NOT NULL,
  prompt_text           TEXT NOT NULL,
  audio_prompt_url      VARCHAR(512),
  media_url             VARCHAR(512),
  secondary_media_url   VARCHAR(512),
  difficulty_level      difficulty_level NOT NULL DEFAULT 'EASY',
  cultural_region       VARCHAR(64) DEFAULT 'Universal',
  metadata              JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g., { personName, year, location, relationship, storyNote }
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_content_items_game ON game_content_items(game_id);
CREATE INDEX idx_content_items_owner ON game_content_items(owner_user_id) WHERE owner_user_id IS NOT NULL;
CREATE INDEX idx_content_items_difficulty ON game_content_items(difficulty_level);
```

#### `game_options`
Selectable choices or target steps associated with content items.

```sql
CREATE TABLE game_options (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id   UUID NOT NULL REFERENCES game_content_items(id) ON DELETE CASCADE,
  option_text       TEXT NOT NULL,
  option_media_url  VARCHAR(512),
  is_correct        BOOLEAN NOT NULL DEFAULT FALSE,
  display_order     INT NOT NULL DEFAULT 0,
  explanation       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_options_content_item ON game_options(content_item_id);
```

---

### 4. TELEMETRY, SESSIONS & RESULTS

#### `game_sessions`
Tracks every gameplay attempt initiated by an elder.

```sql
CREATE TABLE game_sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id           UUID NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
  session_status    session_status NOT NULL DEFAULT 'IN_PROGRESS',
  difficulty_used   difficulty_level NOT NULL DEFAULT 'EASY',
  started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at      TIMESTAMPTZ,
  duration_seconds  INT,
  offline_synced    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON game_sessions(user_id);
CREATE INDEX idx_sessions_game ON game_sessions(game_id);
CREATE INDEX idx_sessions_user_date ON game_sessions(user_id, started_at DESC);
```

#### `submitted_answers`
Granular item-by-item response log for cognitive error pattern analysis.

```sql
CREATE TABLE submitted_answers (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id              UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  content_item_id         UUID NOT NULL REFERENCES game_content_items(id) ON DELETE RESTRICT,
  selected_option_id      UUID REFERENCES game_options(id) ON DELETE SET NULL,
  voice_input_transcript  TEXT,
  is_correct              BOOLEAN NOT NULL,
  response_time_ms        INT NOT NULL CHECK (response_time_ms >= 0),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_answers_session ON submitted_answers(session_id);
CREATE INDEX idx_answers_content ON submitted_answers(content_item_id);
```

#### `game_results`
Summarized scoring outcome calculated at session completion.

```sql
CREATE TABLE game_results (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id              UUID UNIQUE NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id                 UUID NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
  score_obtained          INT NOT NULL CHECK (score_obtained >= 0),
  total_possible_score    INT NOT NULL CHECK (total_possible_score > 0),
  accuracy_percentage     NUMERIC(5,2) NOT NULL CHECK (accuracy_percentage BETWEEN 0 AND 100),
  memory_domain_score     INT NOT NULL DEFAULT 0,
  attention_domain_score  INT NOT NULL DEFAULT 0,
  pattern_domain_score    INT NOT NULL DEFAULT 0,
  strengths_summary       TEXT[] NOT NULL DEFAULT '{}',
  improvements_summary    TEXT[] NOT NULL DEFAULT '{}',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_results_user ON game_results(user_id);
CREATE INDEX idx_results_game ON game_results(game_id);
CREATE INDEX idx_results_user_date ON game_results(user_id, created_at DESC);
```

---

### 5. ANALYTICS, ADAPTATION & RECOMMENDATIONS

#### `daily_progress_summaries`
Asynchronously aggregated daily rollups for fast dashboard loading without computing heavy joins across session histories.

```sql
CREATE TABLE daily_progress_summaries (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  summary_date                DATE NOT NULL,
  total_activities_completed  INT NOT NULL DEFAULT 0,
  total_active_seconds        INT NOT NULL DEFAULT 0,
  avg_memory_score            NUMERIC(5,2) NOT NULL DEFAULT 0,
  avg_attention_score         NUMERIC(5,2) NOT NULL DEFAULT 0,
  avg_pattern_score           NUMERIC(5,2) NOT NULL DEFAULT 0,
  streak_count                INT NOT NULL DEFAULT 0,
  adherence_percentage        NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_user_daily_summary UNIQUE (user_id, summary_date)
);

CREATE INDEX idx_daily_summaries_user_date ON daily_progress_summaries(user_id, summary_date DESC);
```

#### `difficulty_history`
Tracks automated difficulty scaling events driven by cognitive performance algorithms.

```sql
CREATE TABLE difficulty_history (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id             UUID NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
  previous_difficulty difficulty_level NOT NULL,
  new_difficulty      difficulty_level NOT NULL,
  trigger_reason      VARCHAR(255) NOT NULL,
  adjusted_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_difficulty_history_user ON difficulty_history(user_id, game_id);
```

#### `activity_recommendations`
Personalized game suggestions generated by the cognitive engine.

```sql
CREATE TABLE activity_recommendations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recommended_game_id   UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  reason_code           VARCHAR(64) NOT NULL, -- e.g., 'LOW_ATTENTION_SCORE', 'DAILY_GOAL'
  recommendation_text   TEXT NOT NULL,
  priority_score        NUMERIC(3,2) NOT NULL DEFAULT 1.0,
  is_dismissed          BOOLEAN NOT NULL DEFAULT FALSE,
  generated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at            TIMESTAMPTZ
);

CREATE INDEX idx_recommendations_user ON activity_recommendations(user_id, is_dismissed, priority_score DESC);
```

---

### 6. DAILY WELLNESS ROUTINES & NOTIFICATIONS

#### `routine_tasks`
Scheduled daily wellness tasks configured by the elder or caregiver.

```sql
CREATE TABLE routine_tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(128) NOT NULL,
  icon            VARCHAR(32) NOT NULL DEFAULT '📋',
  scheduled_time  TIME NOT NULL,
  period          routine_period NOT NULL,
  category        routine_category NOT NULL DEFAULT 'OTHER',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_routine_tasks_user ON routine_tasks(user_id, period);
```

#### `routine_task_logs`
Daily execution log for routine compliance.

```sql
CREATE TABLE routine_task_logs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_task_id       UUID NOT NULL REFERENCES routine_tasks(id) ON DELETE CASCADE,
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheduled_date        DATE NOT NULL,
  completed_at          TIMESTAMPTZ,
  is_completed          BOOLEAN NOT NULL DEFAULT FALSE,
  completed_by_user_id  UUID REFERENCES users(id) ON DELETE SET NULL, -- Can be Elder or Caregiver
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_routine_task_date UNIQUE (routine_task_id, scheduled_date)
);

CREATE INDEX idx_routine_logs_user_date ON routine_task_logs(user_id, scheduled_date);
```

#### `notifications`
Notification drawer items and alerts.

```sql
CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          notification_type NOT NULL,
  severity      notification_severity NOT NULL DEFAULT 'INFO',
  title         VARCHAR(128) NOT NULL,
  message       TEXT NOT NULL,
  icon          VARCHAR(32) NOT NULL DEFAULT '🔔',
  action_url    VARCHAR(255),
  is_read       BOOLEAN NOT NULL DEFAULT FALSE,
  read_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
```

---

## 🔒 Security & Field Editability Audit

### Read-Only / System-Controlled Fields (Cannot be directly mutated by standard user APIs)
- `users.role`: Settable only by admins or during verified signup.
- `game_results.*`: Generated exclusively by backend transaction logic upon session completion.
- `daily_progress_summaries.*`: Generated exclusively by automated cron rollups or background queue workers.
- `difficulty_history.*`: Written exclusively by cognitive engine scaling triggers.
- `submitted_answers.is_correct`: Calculated by backend verification against `game_options.is_correct`.

### User-Editable Fields (Via Authorized REST / GraphQL Endpoints)
- **Elder User**:
  - `profiles.nickname`, `profiles.reminiscence_topic`, `profiles.primary_language`
  - `accessibility_settings.*` (Font size, contrast, night mode, voice speed)
  - `routine_task_logs.is_completed` (Mark task as completed)
  - `notifications.is_read`
- **Authorized Caregiver**:
  - `profiles.*` (For linked elder)
  - `game_content_items.*` (Personal memory photos uploaded for linked elder)
  - `routine_tasks.*` (Manage daily medication/walk reminders)
  - `caregiver_relationships.status` (Accept/revoke delegation)

---

## 🛡️ PostgreSQL Row-Level Security (RLS) Blueprint

```sql
-- Enable RLS on core telemetry and profile tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessibility_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_progress_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Elders read and edit their own profiles
CREATE POLICY elder_profile_self ON profiles
  FOR ALL
  USING (user_id = auth.uid());

-- Policy: Caregivers read profiles of linked active elders
CREATE POLICY caregiver_profile_read ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM caregiver_relationships cr
      WHERE cr.elder_user_id = profiles.user_id
        AND cr.caregiver_user_id = auth.uid()
        AND cr.status = 'ACTIVE'
        AND cr.can_view_analytics = TRUE
    )
  );
```
