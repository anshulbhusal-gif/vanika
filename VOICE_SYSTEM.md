# Vanika Cognitive Care — Voice Interaction System Architecture

## 1. Architecture Overview

```
User Speech Input / Microphone Toggle
                  │
                  ▼
         VoiceControlWidget (<VoiceControlWidget />)
                  │
                  ▼
            VoiceService (`src/services/voice/VoiceService.ts`)
                  │
                  ├───────────────────────────────┐
                  ▼                               ▼
       Browser Web Speech API            SpeechSynthesis (TTS)
   (SpeechRecognition / webkit)           (Voice Pacing & Rate)
                  │
                  ▼
          VoiceIntentService (`src/services/voice/VoiceIntentService.ts`)
                  │
                  ├── Safe Controlled Intent Mapping
                  └── Security Gatekeeper (Rejects Privileged Ops)
                  │
                  ▼
         Safe Application Action Execution (e.g. Navigation)
```

---

## 2. Browser Capabilities & Web Speech API Usage
- **Speech Recognition**: Uses browser-native `window.SpeechRecognition` or `window.webkitSpeechRecognition`. Zero paid external API keys required.
- **Speech Synthesis (TTS)**: Uses `window.speechSynthesis` and `SpeechSynthesisUtterance`.
- **Browser Limitations**: SpeechRecognition is natively supported in Chrome, Edge, Safari, and modern Android browsers. Firefox users receive a graceful `UNSUPPORTED` state without UI breakage.

---

## 3. VoiceService Abstraction (`src/services/voice/VoiceService.ts`)
- **Clean Interface**: Hides vendor-specific browser implementations.
- **State Machine**: Emits reactive updates across 7 UI states:
  - `IDLE`
  - `LISTENING`
  - `PROCESSING`
  - `SUCCESS`
  - `ERROR`
  - `PERMISSION_DENIED`
  - `UNSUPPORTED`
- **15-Second Bounded Timeout**: Automatically stops hanging microphone listeners on mobile devices.

---

## 4. Controlled Command & Intent System (`VoiceIntentService.ts`)

| Intent | Sample Transcripts | Action Executed |
| :--- | :--- | :--- |
| `START_TODAYS_ACTIVITY` | "start activity", "play game", "today's game", "शुरू करें", "খেলক" | Navigates to Patient Courtyard (`patient-app`). |
| `OPEN_PROGRESS` | "view progress", "analytics score", "प्रगति", "অগ্রগতি" | Navigates to Progress & Analytics (`progress`). |
| `OPEN_ROUTINE` | "daily routine tasks", "reminders", "दिनचर्या" | Navigates to Daily Routine (`daily-routine`). |
| `OPEN_GAMES` | "all games", "games hub", "activities", "गतिविधि" | Navigates to Games Hub (`games-hub`). |
| `OPEN_PROFILE` | "profile", "account", "settings", "प्रोफ़ाइल" | Navigates to Settings (`settings`). |
| `CHANGE_LANGUAGE` | "change language", "bhasha", "भाषा", "ভাষা" | Navigates to Settings / Language Selector. |
| `HELP` | "help me", "what can I say", "madad", "সাহায্য" | Returns list of supported voice commands. |
| `UNKNOWN` | Unrecognized speech transcript | Returns friendly guidance message. |

---

## 5. Security & Privacy Controls
- **Security Gatekeeper**: Speech transcripts containing privileged keywords (`password`, `admin`, `role`, `delete account`, `change score`) are strictly rejected.
- **No Continuous Recording**: Microphone is activated strictly on explicit user touch/click.
- **Zero API Credentials**: All voice processing is handled locally/client-side. Zero API keys exposed.

---

## 6. Language & Accessibility Integration
- **BCP-47 Language Tags**:
  - English: `en-IN`
  - Hindi: `hi-IN`
  - Assamese: `as-IN`
  - Bengali: `bn-IN`
  - Nepali: `ne-NP`
  - Manipuri: `mni-IN`
- **Accessibility Integration**:
  - Speech pacing rate is driven by accessibility `voiceSpeed` setting (`slow` = 0.85 rate for elder pacing, `normal` = 1.0).
  - Setting `voiceGuideEnabled = false` skips audio playback.
  - Reduced-motion settings disable pulsing microphone animations.

---

## 7. Future External Provider Integration Point
`VoiceService` acts as a facade layer. Future cloud STT/TTS engines (e.g. Google Cloud Speech-to-Text) can be plugged inside `VoiceService` without modifying UI widgets or application routes.
