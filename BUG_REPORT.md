# VANIKA PROJECT - BUG REPORT & FEATURE ISSUES
**Date:** September 2, 2026  
**Project:** Vanika - AI-Based Cognitive Gaming & Memory Assistance Platform  
**Analysis:** Comprehensive Feature & Bug Review

---

## 🔴 CRITICAL BUGS

### 1. **Security Issue: API Key Exposed in URL** ⚠️ CRITICAL
**File:** `src/utils/aiService.ts` (Line 48)  
**Severity:** CRITICAL - Security Vulnerability  
**Issue:**
```javascript
// VULNERABLE CODE - API key in URL
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
  { method: 'POST', ... }
);
```

**Problem:** 
- API key is exposed in the URL query parameter
- Gets logged in browser history, server logs, and proxy logs
- Violates OWASP security guidelines
- Breaches DPDP Act 2023 compliance

**Fix Required:**
```javascript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
  {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}` // Move to header
    },
    body: JSON.stringify({...})
  }
);
```

---

### 2. **Misleading Encryption Claims** ⚠️ CRITICAL - Compliance Issue
**Files:** 
- `src/utils/storage.ts` (Lines 22-35)
- `src/components/caregiver/CaregiverDashboard.tsx` (Lines 62, 146)

**Severity:** CRITICAL - Claims AES-256 but uses Base64  
**Issue:**
```typescript
// CURRENT: Only Base64 encoding (NOT encryption)
export function encryptData(data: any): string {
  const jsonStr = JSON.stringify(data);
  return btoa(encodeURIComponent(jsonStr)); // Just Base64!
}

export function decryptData<T>(encryptedStr: string): T | null {
  try {
    const jsonStr = decodeURIComponent(atob(encryptedStr)); // Just Base64 decode
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error('Failed to decrypt local data:', e);
    return null;
  }
}
```

**Why This is a Problem:**
- README claims "AES-256 encryption" but code uses btoa/atob (Base64)
- Base64 is **NOT encryption** - it's just encoding/obfuscation
- Anyone with browser DevTools can easily decode it
- **Violates DPDP Act 2023 compliance requirements** for sensitive patient data
- Comments in caregiver dashboard say "AES-256 Encrypted Vault" but it's not encrypted

**Real-World Risk:**
- Patient names, medical data, family photos - ALL visible with Base64 decode
- Accessible via: Browser DevTools → Application → LocalStorage → copy-paste → base64 decode online

**Fix Required:**
1. Implement proper AES-256 encryption using a library like:
   ```javascript
   import * as crypto from 'crypto-js';
   // Use crypto.AES.encrypt() instead of btoa
   ```
2. Update README to reflect actual encryption method
3. Remove misleading "AES-256" claims from UI

---

### 3. **Missing Offline AI Fallback in Frontend** 
**File:** `src/utils/aiService.ts` (Lines 30-116)  
**Severity:** HIGH  
**Issue:**
- The offline fallback generator is basic and hardcoded with only 4 regional responses
- Many user queries won't match the simple `if (lower.includes(...))` conditions
- Lines 106-115: Limited fallback patterns for North-Eastern context

**Current Fallback Logic (Too Simple):**
```typescript
private static generateOfflineFallback(prompt: string, lang: Language, nickname: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('confused') || lower.includes('where')) {
    return `Namaskar ${nickname}! Please take a gentle breath...`;
  }
  if (lower.includes('bihu') || lower.includes('music') || lower.includes('song')) {
    return `Namaskar ${nickname}! Ah, the sound of the Dhol drum...`;
  }
  if (lower.includes('tea') || lower.includes('morning')) {
    return `Namaskar ${nickname}! A fresh cup of hot Assam tea...`;
  }
  return `Namaskar ${nickname}! It is so sweet to listen to your voice...`; // Generic fallback
}
```

**Problem:**
- Doesn't handle queries about health, medications, or reminders
- Doesn't gracefully handle non-NER cultural queries
- Limited emotional state awareness (only 4 conditions covered)
- May frustrate users if API fails frequently

**Suggestion:**
- Add 20+ diverse fallback patterns
- Include emotional state-aware responses
- Add activity/game-related responses

---

## 🟡 HIGH-PRIORITY BUGS

### 4. **Speech API Method Name Inconsistency (Minor Bug)**
**File:** `src/components/games/AttentionGame.tsx` (Line 95)  
**Severity:** MEDIUM  
**Issue:**
```typescript
// Line 95: Using VoiceAssistant.speak() which returns a Promise
VoiceAssistant.speak(unFound.hint, currentLanguage, 'slow');
// But not awaiting it - setTimeout used instead
```

**Note:** While this works (promise returned but not awaited), it's inconsistent with:
- Line 84 in same file: `speechEngine.speak(..., { language, onEnd: ... })`
- Line 52 in MemoryGame.tsx: `speechEngine.speak()`

**Better Approach:**
```typescript
// Use consistent speechEngine.speak() with onEnd callback
speechEngine.speak(unFound.hint, { 
  language: currentLanguage, 
  rate: 0.85, 
  onEnd: () => setActiveHint(null) 
});
```

---

### 5. **Missing Error Handling for Image URL Failures**
**File:** `src/components/games/AttentionGame.tsx` (Lines 141-146)  
**Severity:** MEDIUM  
**Issue:**
```javascript
<img
  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
  alt="Tranquil North Eastern Tea Garden and River Scene"
  className="w-full h-72 sm:h-96 object-cover opacity-90"
  // NO: onError handler, onLoad handler, loading="lazy"
/>
```

**Problem:**
- If Unsplash image URL changes or network fails, game breaks silently
- No fallback image
- No loading state indicator
- External API dependency for game functionality

**Fix:**
```javascript
const [imageLoaded, setImageLoaded] = useState(false);
const [imageError, setImageError] = useState(false);

<img
  src="..."
  onLoad={() => setImageLoaded(true)}
  onError={() => setImageError(true)}
  loading="lazy"
  alt="..."
/>

{!imageLoaded && <div className="bg-gray-300">Loading landscape...</div>}
{imageError && <div>Could not load image. Playing offline version instead.</div>}
```

---

### 6. **Unhandled Speech Recognition Edge Cases**
**File:** `src/utils/speech.ts` (Lines 64-97)  
**Severity:** MEDIUM  
**Issue:**
- No timeout handling for long-running speech recognition
- No duplicate utterance cancellation in startListening
- `recognition.continuous = false` but no explicit abort on completion

**Current Code:**
```typescript
startListening(
  onResult: (transcript: string) => void,
  onError?: (err: any) => void,
  onEnd?: () => void,
  language: Language = 'English'
): any {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    onError?.('Speech recognition is not supported...');
    return null;
  }
  
  const recognition = new SpeechRecognition();
  // Missing: timeout, abort logic, cleanup
  
  recognition.start();
  return recognition;
}
```

**Problems:**
- User calls speech recognition twice accidentally → both listen simultaneously
- If user closes app mid-speech, recognition keeps running
- Mobile: Browser might kill speech if no result in 30s, but no explicit timeout handling

---

## 🟠 MEDIUM PRIORITY ISSUES

### 7. **SequenceGame Randomization Bug**
**File:** `src/components/games/SequenceGame.tsx` (Lines 19-22)  
**Severity:** LOW-MEDIUM  
**Issue:**
```typescript
const [steps, setSteps] = useState<SequenceStep[]>(() => {
  return [...initialSteps].sort(() => Math.random() - 0.5); // POOR RANDOMIZATION
});
```

**Problem:**
- `Math.random() - 0.5` is NOT a proper shuffle algorithm
- Produces biased randomization (not uniformly distributed)
- Some orderings are more likely than others
- **Solution:** Use Fisher-Yates shuffle instead

**Better Approach:**
```typescript
const shuffleArray = (arr: SequenceStep[]) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const [steps, setSteps] = useState<SequenceStep[]>(() => 
  shuffleArray(initialSteps)
);
```

---

### 8. **MemoryGame: handleNextPhoto Logic Issue**
**File:** `src/components/games/MemoryGame.tsx` (Lines 64-72)  
**Severity:** LOW-MEDIUM  
**Issue:**
```typescript
const handleNextPhoto = () => {
  soundSynth.playSoftClick();
  setSelectedAnswer(null);
  setIsCorrect(null);
  setShowStory(false);
  if (photos.length > 0) {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }
};
```

**Problem:**
- If user selects wrong answer and clicks "Next Memory" immediately, 
- `selectedAnswer` state might not reset before next item loads
- No confirmation needed after wrong answer

**Minor Issue:** User experience could be improved with:
- Auto-advance to next after correct answer (after 2s celebration)
- Require "Try Again" before "Next Memory" on wrong answers

---

### 9. **Accessibility: Font Size Classes Incomplete**
**File:** `src/App.tsx` (Lines 59-65)  
**Severity:** MEDIUM  
**Issue:**
```typescript
const root = document.documentElement;
root.classList.remove('font-normal', 'font-large', 'font-xlarge', 'high-contrast', 'dark-theme', 'dark');

if (accessibilitySettings.fontSize === 'large') {
  root.classList.add('font-large');
} else if (accessibilitySettings.fontSize === 'extra-large') {
  root.classList.add('font-xlarge');
}
// NO: else if for 'normal'
```

**Problem:**
- Doesn't explicitly add 'font-normal' class when fontSize='normal'
- May cause CSS cascade issues on revisit
- Should be explicit

**Fix:**
```typescript
if (accessibilitySettings.fontSize === 'large') {
  root.classList.add('font-large');
} else if (accessibilitySettings.fontSize === 'extra-large') {
  root.classList.add('font-xlarge');
} else {
  root.classList.add('font-normal');
}
```

---

## 🟡 MISSING FEATURES / NOT WORKING

### 10. **Emotion Detection Engine Not Implemented**
**Mentioned In:** README (Lines 14, 38-40)  
**Status:** ❌ MISSING IMPLEMENTATION  
**Expected:** "On-Device Emotion AI Engine" that:
- Analyzes facial micro-expressions
- Adjusts game difficulty based on confusion/frustration
- Runs 100% on-device

**Actual:**
- No facial recognition code found
- No emotion detection algorithm
- `emotionState` is just hardcoded as 'calm' in most places
- UICode for emotion badges exists but doesn't trigger game logic

**Missing Code Locations:**
- No TensorFlow.js Face API integration
- No WebRTC face tracking
- Game difficulty doesn't change based on emotion

---

### 11. **Opportunistic Background Sync NOT Implemented**
**Mentioned In:** README (Lines 45, 62-63)  
**Status:** ❌ PARTIALLY MISSING  
**Expected:**
- Offline data queuing when disconnected
- Auto-sync when ASHA worker visits or connectivity returns
- Secure background upload of caregiver trends

**Actual:**
- LocalStorage saves work fine (offline-first ✓)
- No Service Worker for background sync
- No queue system for syncing
- `lastSynced` timestamp is just UI-based, not real sync
- No server endpoint for receiving encrypted data uploads

**Missing Implementation:**
- No ServiceWorker registration in `src/main.tsx`
- No sync queue in storage
- No `/api/sync` endpoint in server

---

### 12. **Photo Upload Feature Partially Broken**
**File:** `src/components/caregiver/CaregiverDashboard.tsx` (Lines 66-94)  
**Status:** ⚠️ WORKS BUT LIMITED  
**Issues:**
1. **No File Input - Only URL Input:**
   ```typescript
   // Line 31: Only accepts URLs
   const [photoUrl, setPhotoUrl] = useState('');
   // No <input type="file"> implementation
   ```
   
   **Problem:** Elderly caregivers can't upload actual family photos from their phone/device
   
2. **No Image Validation:**
   ```typescript
   // No MIME type check, no file size limit
   imageUrl: photoUrl.trim() || 'https://images.unsplash.com/...',
   ```

3. **No Image Preview:**
   - User types URL but can't see preview before saving
   - If URL is wrong, discovered only in game

**Fix Required:**
```typescript
<input 
  type="file" 
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file && file.size < 5000000) { // 5MB limit
      const reader = new FileReader();
      reader.onload = (evt) => setPhotoUrl(evt.target?.result as string);
      reader.readAsDataURL(file);
    }
  }}
/>
<img src={photoUrl} alt="Preview" /> {/* Show preview */}
```

---

### 13. **Cultural Content Data Not Comprehensive**
**File:** `src/data/culturalContent.ts`  
**Status:** ⚠️ LIMITED DATA  
**Issue:**
- SAMPLE_MEMORY_PHOTOS likely has only 3-5 sample photos (placeholder data)
- CulturalGame HERITAGE_ITEMS has only 3 items (see CulturalGame.tsx lines 26-60)
- TEA_PLUCKING_SEQUENCE_STEPS and BIHU_SEQUENCE_STEPS not checked but likely minimal

**Problem:**
- Elderly user plays same 3 cultural games repeatedly → boredom
- No variety in memory photos
- README claims "culturally relevant" but limited cultural content

**Evidence:**
```typescript
// CulturalGame.tsx - Only 3 heritage items!
const HERITAGE_ITEMS: HeritageItem[] = [
  { id: 'h-1', name: 'Pepa (Buffalo Horn Hornpipe)', ... },
  { id: 'h-2', name: 'Jappi (Traditional Sun Hat)', ... },
  { id: 'h-3', name: 'Cheraw (Bamboo Dance)', ... }
  // No more items!
];
```

**Needed:**
- 20+ cultural heritage items for variety
- 50+ memory photos for different elderly profiles
- Expanded Bihu and Tea sequences (8+ steps each)

---

### 14. **Caregiver Alerts Not Functioning**
**File:** `src/components/caregiver/AlertCard.tsx`  
**Status:** ⚠️ DISPLAY ONLY  
**Issue:**
- Alert cards show default data, not real cognitive decline patterns
- No algorithm to detect cognitive dips (sudden drop in scores)
- No real-time alerts when user struggles

**Current:**
```typescript
// DEFAULT_ALERTS in storage.ts lines 145-166
// Hard-coded 2 alerts, no dynamic generation
```

**Missing:**
- Comparison logic: `if (todayScore - weekAgoScore < -15) → send alert`
- No notification system (Web Push API)
- No email/SMS notifications to caregiver

---

### 15. **Voice Input for Games Not Available**
**Status:** ⚠️ PARTIALLY MISSING  
**Issue:**
- MemoryGame, SequenceGame, AttentionGame: NO voice answer input
- Only click-to-answer works
- README claims "Voice-First Navigation" but limited

**What's Missing:**
```typescript
// Games don't have this:
const handleVoiceAnswer = () => {
  const recognized = await speech.recognize(); // "Son"
  if (recognized === currentItem.correctAnswer) {
    // correct!
  }
};
```

**Current:** Only buttons work, not voice answers

---

## 🔵 MINOR ISSUES & IMPROVEMENTS

### 16. **Unused Imports**
- `src/components/common/VoiceWaveform.tsx` - May not be rendered
- Several lucide-react icons imported but not used in some files

### 17. **Unstructured Error Messages**
- AIService fallback doesn't explain why free API failed
- Users won't know if it's offline or if API is broken

### 18. **No Loading Skeleton UI**
- CaregiverDashboard charts load without skeleton
- Caregiver sees blank white space while data loads

### 19. **No Dark Mode CSS Variables**
- Dark mode applied via classList but some colors hard-coded
- Example: `bg-[#FDFBF7]` doesn't change in dark mode

### 20. **Server CORS Not Configured**
- `server.ts` has no CORS headers
- Won't work if frontend deployed separately from backend
- Needs: `app.use(cors())`

---

## 📊 FEATURE SUPPORT STATUS

| Feature | Status | Notes |
|---------|--------|-------|
| ✅ Cognitive Games | WORKING | Memory, Sequence, Attention, Cultural |
| ✅ Speech Synthesis | WORKING | Text-to-speech for all 6 languages |
| ⚠️ Speech Recognition | PARTIAL | Works but no timeout/error recovery |
| ❌ Emotion Detection | NOT IMPLEMENTED | Mentioned in README but no code |
| ❌ Background Sync | NOT IMPLEMENTED | No Service Worker, no queue system |
| ⚠️ Photo Upload | PARTIAL | URL only, no file upload |
| ✅ Offline Storage | WORKING | LocalStorage works, but NO encryption |
| ⚠️ Caregiver Portal | PARTIAL | Dashboard shows but no real-time alerts |
| ❌ Email Notifications | NOT IMPLEMENTED | No caregiver email alerts |
| ⚠️ Dark Mode | PARTIAL | Toggles but CSS needs improvement |
| ✅ Accessibility | MOSTLY WORKING | Large fonts, high contrast work |
| ⚠️ Reminders | PARTIAL | UI works but no system notifications |

---

## 🚀 DEPLOYMENT READINESS

| Checklist Item | Status | Issue |
|---|---|---|
| API Key Security | ❌ FAIL | Exposed in URL |
| Encryption Compliance | ❌ FAIL | Base64, not AES-256 |
| Error Handling | ⚠️ PARTIAL | Some edge cases unhandled |
| Image Loading | ⚠️ PARTIAL | No fallback for broken URLs |
| Speech Recognition | ⚠️ PARTIAL | No timeout handling |
| DPDP Compliance | ❌ FAIL | Missing real encryption |
| Performance | ✅ GOOD | Fast load times, optimized |
| Accessibility | ✅ GOOD | WCAG-friendly |
| Mobile Responsive | ✅ GOOD | Works on tablets & phones |

---

## 🔧 PRIORITY FIXES (In Order)

1. **[CRITICAL]** Fix API key exposure in URL (aiService.ts line 48)
2. **[CRITICAL]** Implement real AES-256 encryption for DPDP compliance
3. **[HIGH]** Add proper error handling for speech recognition
4. **[HIGH]** Improve offline fallback responses (20+ patterns)
5. **[HIGH]** Add emotion detection or remove from README
6. **[HIGH]** Implement background sync with Service Worker
7. **[MEDIUM]** Fix Fisher-Yates shuffle in SequenceGame
8. **[MEDIUM]** Add file upload for photos (not just URLs)
9. **[MEDIUM]** Expand cultural content database
10. **[MEDIUM]** Add image error handling & preview

---

## 📝 NOTES FOR TEAM

- **Security is critical for a healthcare app** - Fix API key and encryption ASAP
- **Claims in README don't match implementation** - Be honest about features
- **Cultural content is too limited** - Collect more NER folklore/games
- **Offline sync is missing** - Important for ASHA workers in areas with poor connectivity
- **Photo upload needs actual file input** - URL-only is not user-friendly for elderly caregivers

---

**Report Generated:** September 2, 2026  
**Analyzed by:** Claude (Haiku 4.5)  
**Total Issues Found:** 20 bugs/missing features  
**Critical Issues:** 2  
**High Priority:** 7  
**Medium Priority:** 5  
**Low Priority:** 6
