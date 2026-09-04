import CryptoJS from 'crypto-js';
import { 
  PatientProfile, 
  MemoryPhotoItem, 
  ReminderItem, 
  CognitiveDataPoint, 
  GardenElement,
  AlertNotification
} from '../types';
import { SAMPLE_MEMORY_PHOTOS } from '../data/culturalContent';
import { apiClient } from '../services/api/apiClient';

const STORAGE_KEYS = {
  PATIENT_PROFILE: 'vanika_patient_profile',
  MEMORY_PHOTOS: 'vanika_memory_photos',
  REMINDERS: 'vanika_reminders',
  COGNITIVE_HISTORY: 'vanika_cognitive_history',
  GARDEN_ELEMENTS: 'vanika_garden_elements',
  ALERTS: 'vanika_alerts',
  CAREGIVER_NOTES: 'vanika_caregiver_notes',
  SYNC_QUEUE: 'vanika_offline_sync_queue'
};

const VAULT_SECRET = 'VANIKA_AES256_PATIENT_VAULT_SECURE_KEY_2026_DPDP_COMPLIANT';

// Real AES-256 Symmetric Encryption for DPDP Act 2023 Compliance
export function encryptData(data: any): string {
  const jsonStr = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonStr, VAULT_SECRET).toString();
}

export function decryptData<T>(encryptedStr: string): T | null {
  if (!encryptedStr) return null;
  try {
    // 1. Try real AES-256 Decryption
    const bytes = CryptoJS.AES.decrypt(encryptedStr, VAULT_SECRET);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    if (decryptedStr) {
      return JSON.parse(decryptedStr) as T;
    }
  } catch (e) {
    // Suppress and fallback to legacy Base64 decoding below
  }

  try {
    // 2. Legacy Fallback: Base64 Decoding (for smooth migration of legacy data)
    const legacyStr = decodeURIComponent(atob(encryptedStr));
    return JSON.parse(legacyStr) as T;
  } catch (e) {
    console.error('[StorageVault] Failed to decrypt local data vault:', e);
    return null;
  }
}

// Initial Default Seed Data
const DEFAULT_PROFILE: PatientProfile = {
  id: 'patient-001',
  name: 'Bhaben Hazarika',
  age: 72,
  location: 'Guwahati, Assam',
  primaryLanguage: 'Assamese',
  memoryScore: 78,
  attentionScore: 82,
  moodStatus: 'Calm',
  streakDays: 6,
  adherenceRate: 92,
  lastSynced: new Date().toISOString(),
  weeklySessions: 14
};

const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    time: '07:30 AM',
    title: 'Morning Ginger Tea & Green Tablet',
    culturalWrapper: 'A warm sip of Lal Saah (red tea) with morning green tablet',
    type: 'medication',
    completed: true,
    audioPrompt: 'Aponar puwar laal saah aru osudh luwar somoy hoise.'
  },
  {
    id: 'rem-2',
    time: '11:00 AM',
    title: 'Brahmi & Manimuni Herbal Tonic',
    culturalWrapper: 'Traditional fresh leaf tonic for memory clarity',
    type: 'hydration',
    completed: false,
    audioPrompt: 'Manimuni pator rox xewon korok'
  },
  {
    id: 'rem-3',
    time: '04:30 PM',
    title: 'Courtyard Stroll & Folk Music',
    culturalWrapper: 'Listen to soft Bihu Pepa flute notes in the courtyard',
    type: 'activity',
    completed: false,
    audioPrompt: 'Asekoli beli gholile courtyard stroll kori aahaok.'
  },
  {
    id: 'rem-4',
    time: '08:00 PM',
    title: 'Family Call with Granddaughter Anita',
    culturalWrapper: 'Evening voice connection before peaceful sleep',
    type: 'memory',
    completed: false,
    audioPrompt: 'Nati Anita-r logot kotha patok.'
  }
];

const DEFAULT_COGNITIVE_HISTORY: CognitiveDataPoint[] = [
  { date: '2026-08-25', dayName: 'Mon', memoryScore: 74, attentionScore: 78, moodIndex: 7, minutesActive: 18 },
  { date: '2026-08-26', dayName: 'Tue', memoryScore: 76, attentionScore: 80, moodIndex: 8, minutesActive: 22 },
  { date: '2026-08-27', dayName: 'Wed', memoryScore: 75, attentionScore: 81, moodIndex: 7, minutesActive: 20 },
  { date: '2026-08-28', dayName: 'Thu', memoryScore: 78, attentionScore: 83, moodIndex: 9, minutesActive: 25 },
  { date: '2026-08-29', dayName: 'Fri', memoryScore: 80, attentionScore: 85, moodIndex: 8, minutesActive: 28 },
  { date: '2026-08-30', dayName: 'Sat', memoryScore: 77, attentionScore: 82, moodIndex: 8, minutesActive: 24 },
  { date: '2026-08-31', dayName: 'Sun', memoryScore: 82, attentionScore: 86, moodIndex: 9, minutesActive: 30 }
];

const DEFAULT_GARDEN: GardenElement[] = [
  {
    id: 'g-1',
    type: 'tree',
    title: 'Courtyard Sacred Banyan',
    associatedActivity: 'Photo Recall Games',
    growthStage: 3,
    maxStage: 4,
    lastWatered: 'Today',
    color: '#15803D'
  },
  {
    id: 'g-2',
    type: 'flower',
    title: 'Brahmaputra Blue Lotus',
    associatedActivity: 'Ritual Sequence Play',
    growthStage: 4,
    maxStage: 4,
    lastWatered: 'Today',
    color: '#0284C7'
  },
  {
    id: 'g-3',
    type: 'sunflower',
    title: 'Majuli Golden Sunflower',
    associatedActivity: 'Visual Attention Scan',
    growthStage: 2,
    maxStage: 4,
    lastWatered: 'Yesterday',
    color: '#EAB308'
  },
  {
    id: 'g-4',
    type: 'fern',
    title: 'Shillong Pine Fern',
    associatedActivity: 'Cultural Reminiscence',
    growthStage: 3,
    maxStage: 4,
    lastWatered: 'Today',
    color: '#16A34A'
  }
];

const DEFAULT_ALERTS: AlertNotification[] = [
  {
    id: 'alt-1',
    severity: 'positive',
    title: 'Memory Recall Accuracy +12%',
    metricChange: '+12% photo recognition consistency over 7 days',
    timeframe: 'Past 7 Days',
    suggestedAction: 'Celebrate with Bihu morning photo album session.',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'alt-2',
    severity: 'advisory',
    title: 'Evening Pacing Delay Sensed',
    metricChange: 'Slightly longer hesitation (14s) during sequence sorting around 5 PM',
    timeframe: 'Yesterday Evening',
    suggestedAction: 'Schedule afternoon red tea break before game session.',
    timestamp: '1 day ago',
    read: false
  }
];

// Data Storage API Interface
export const vanikaStorage = {
  // Patient Profile
  getProfile(): PatientProfile {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PATIENT_PROFILE);
      if (!raw) {
        this.saveProfile(DEFAULT_PROFILE);
        return DEFAULT_PROFILE;
      }
      const decrypted = decryptData<PatientProfile>(raw);
      if (decrypted && typeof decrypted === 'object' && decrypted.name) {
        return decrypted;
      }
    } catch (e) {
      console.warn('[StorageVault] Resetting patient profile to default:', e);
    }
    this.saveProfile(DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  },

  saveProfile(profile: PatientProfile): void {
    localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, encryptData(profile));
  },

  // Memory Photos
  getMemoryPhotos(): MemoryPhotoItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MEMORY_PHOTOS);
      if (!raw) {
        this.saveMemoryPhotos(SAMPLE_MEMORY_PHOTOS);
        return SAMPLE_MEMORY_PHOTOS;
      }
      const decrypted = decryptData<MemoryPhotoItem[]>(raw);
      if (Array.isArray(decrypted) && decrypted.length > 0) {
        return decrypted;
      }
    } catch (e) {
      console.warn('[StorageVault] Resetting memory photos to sample:', e);
    }
    this.saveMemoryPhotos(SAMPLE_MEMORY_PHOTOS);
    return SAMPLE_MEMORY_PHOTOS;
  },


  saveMemoryPhotos(photos: MemoryPhotoItem[]): void {
    localStorage.setItem(STORAGE_KEYS.MEMORY_PHOTOS, encryptData(photos));
  },

  addMemoryPhoto(photo: MemoryPhotoItem): MemoryPhotoItem[] {
    const photos = this.getMemoryPhotos();
    const updated = [photo, ...photos];
    this.saveMemoryPhotos(updated);
    return updated;
  },

  // Reminders
  getReminders(): ReminderItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (!raw) {
        this.saveReminders(DEFAULT_REMINDERS);
        return DEFAULT_REMINDERS;
      }
      const decrypted = decryptData<ReminderItem[]>(raw);
      if (Array.isArray(decrypted) && decrypted.length > 0) {
        return decrypted;
      }
    } catch (e) {
      console.warn('[StorageVault] Resetting reminders to default:', e);
    }
    this.saveReminders(DEFAULT_REMINDERS);
    return DEFAULT_REMINDERS;
  },

  saveReminders(reminders: ReminderItem[]): void {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, encryptData(reminders));
  },

  toggleReminder(id: string): ReminderItem[] {
    const reminders = this.getReminders();
    const updated = reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
    this.saveReminders(updated);
    
    // Update adherence rate in profile
    const completedCount = updated.filter(r => r.completed).length;
    const rate = Math.round((completedCount / updated.length) * 100);
    const profile = this.getProfile();
    this.saveProfile({ ...profile, adherenceRate: rate });
    
    return updated;
  },

  // Cognitive Data Points & Game Scoring Integration
  getCognitiveHistory(): CognitiveDataPoint[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COGNITIVE_HISTORY);
      if (!raw) {
        this.saveCognitiveHistory(DEFAULT_COGNITIVE_HISTORY);
        return DEFAULT_COGNITIVE_HISTORY;
      }
      const decrypted = decryptData<CognitiveDataPoint[]>(raw);
      if (Array.isArray(decrypted) && decrypted.length > 0) {
        return decrypted;
      }
    } catch (e) {
      console.warn('[StorageVault] Resetting cognitive history to default:', e);
    }
    this.saveCognitiveHistory(DEFAULT_COGNITIVE_HISTORY);
    return DEFAULT_COGNITIVE_HISTORY;
  },


  saveCognitiveHistory(history: CognitiveDataPoint[]): void {
    localStorage.setItem(STORAGE_KEYS.COGNITIVE_HISTORY, encryptData(history));
  },

  recordGameSession(gameType: 'memory' | 'sequence' | 'attention' | 'cultural', score: number, minutes: number = 5): void {
    const history = this.getCognitiveHistory();
    const todayStr = new Date().toISOString().split('T')[0];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[new Date().getDay()];

    const existingIdx = history.findIndex(h => h.date === todayStr);
    
    let updatedHistory = [...history];

    if (existingIdx >= 0) {
      const current = history[existingIdx];
      const newMem = gameType === 'memory' || gameType === 'cultural' ? Math.round((current.memoryScore + score) / 2) : current.memoryScore;
      const newAttn = gameType === 'sequence' || gameType === 'attention' ? Math.round((current.attentionScore + score) / 2) : current.attentionScore;
      
      updatedHistory[existingIdx] = {
        ...current,
        memoryScore: Math.min(100, newMem),
        attentionScore: Math.min(100, newAttn),
        minutesActive: current.minutesActive + minutes
      };
    } else {
      updatedHistory.push({
        date: todayStr,
        dayName,
        memoryScore: score,
        attentionScore: score,
        moodIndex: 8,
        minutesActive: minutes
      });
    }

    // Keep last 30 days maximum
    if (updatedHistory.length > 30) {
      updatedHistory = updatedHistory.slice(updatedHistory.length - 30);
    }

    this.saveCognitiveHistory(updatedHistory);

    // Sync to backend express server if connected
    try {
      apiClient.post('/game-sessions/complete', {
        gameId: gameType,
        score,
        durationSeconds: minutes * 60,
        completedAt: new Date().toISOString(),
      }).catch(() => { /* offline silent fallback */ });
    } catch (e) {
      // Offline fallback
    }

    // Also update current profile memory and attention baseline
    const profile = this.getProfile();
    const latest = updatedHistory[updatedHistory.length - 1];
    this.saveProfile({
      ...profile,
      memoryScore: latest.memoryScore,
      attentionScore: latest.attentionScore,
      weeklySessions: profile.weeklySessions + 1
    });

    // Advance Garden Element growth stage
    this.waterGardenElement(gameType);
  },

  // Garden Elements
  getGardenElements(): GardenElement[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GARDEN_ELEMENTS);
      if (!raw) {
        this.saveGardenElements(DEFAULT_GARDEN);
        return DEFAULT_GARDEN;
      }
      const decrypted = decryptData<GardenElement[]>(raw);
      if (Array.isArray(decrypted) && decrypted.length > 0) {
        return decrypted;
      }
    } catch (e) {
      console.warn('[StorageVault] Resetting garden elements to default:', e);
    }
    this.saveGardenElements(DEFAULT_GARDEN);
    return DEFAULT_GARDEN;
  },

  saveGardenElements(elements: GardenElement[]): void {
    localStorage.setItem(STORAGE_KEYS.GARDEN_ELEMENTS, encryptData(elements));
  },

  waterGardenElement(gameType: string): GardenElement[] {
    const elements = this.getGardenElements();
    const updated = elements.map(el => {
      let match = false;
      if (gameType === 'memory' && el.type === 'tree') match = true;
      if (gameType === 'sequence' && el.type === 'flower') match = true;
      if (gameType === 'attention' && el.type === 'sunflower') match = true;
      if (gameType === 'cultural' && el.type === 'fern') match = true;

      if (match) {
        const nextStage = Math.min(el.maxStage, el.growthStage + 1);
        return { ...el, growthStage: nextStage, lastWatered: 'Just now' };
      }
      return el;
    });
    this.saveGardenElements(updated);
    return updated;
  },

  // Dynamic Caregiver Alert Detection Engine
  evaluateCaregiverAlerts(): AlertNotification[] {
    try {
      const history = this.getCognitiveHistory();
      const alerts = this.getAlerts();
      const newAlerts = Array.isArray(alerts) ? [...alerts] : [...DEFAULT_ALERTS];

      if (Array.isArray(history) && history.length >= 2) {
        const latest = history[history.length - 1];
        const previous = history[history.length - 2];
        const memDiff = (latest?.memoryScore || 0) - (previous?.memoryScore || 0);
        const attnDiff = (latest?.attentionScore || 0) - (previous?.attentionScore || 0);

        // Cognitive decline dip alert
        if (memDiff <= -10 || attnDiff <= -10) {
          const alertId = `alt-decline-${latest.date}`;
          if (!newAlerts.some(a => a.id === alertId)) {
            newAlerts.unshift({
              id: alertId,
              severity: 'advisory',
              title: 'Slight Recall Hesitation Sensed',
              metricChange: `Score dropped by ${Math.abs(Math.min(memDiff, attnDiff))}% from previous session`,
              timeframe: 'Recent Game Session',
              suggestedAction: 'Offer warm ginger tea and engage in quiet photo reminiscence.',
              timestamp: 'Just now',
              read: false
            });
          }
        } else if (memDiff >= 8 || attnDiff >= 8) {
          const alertId = `alt-[#D4AF37]-${latest.date}`;
          if (!newAlerts.some(a => a.id === alertId)) {
            newAlerts.unshift({
              id: alertId,
              severity: 'positive',
              title: 'Cognitive Engagement Surge (+ ' + Math.max(memDiff, attnDiff) + '%)',
              metricChange: `Cognitive scores increased to ${Math.max(latest.memoryScore, latest.attentionScore)}!`,
              timeframe: 'Today',
              suggestedAction: 'Celebrate with courtyard stroll or Bihu song session.',
              timestamp: 'Just now',
              read: false
            });
          }
        }
      }

      this.saveAlerts(newAlerts);
      return newAlerts;
    } catch (err) {
      console.warn('[StorageVault] Alert evaluation notice:', err);
      return DEFAULT_ALERTS;
    }
  },

  getAlerts(): AlertNotification[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
      if (!raw) {
        this.saveAlerts(DEFAULT_ALERTS);
        return DEFAULT_ALERTS;
      }
      const decrypted = decryptData<AlertNotification[]>(raw);
      if (Array.isArray(decrypted) && decrypted.length > 0) {
        return decrypted;
      }
    } catch (e) {
      console.warn('[StorageVault] Resetting alerts to default:', e);
    }
    this.saveAlerts(DEFAULT_ALERTS);
    return DEFAULT_ALERTS;
  },

  saveAlerts(alerts: AlertNotification[]): void {
    localStorage.setItem(STORAGE_KEYS.ALERTS, encryptData(alerts));
  },


  // Offline Background Sync Queue Helper
  getSyncQueue(): any[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    if (!raw) return [];
    return decryptData<any[]>(raw) || [];
  },

  addToSyncQueue(action: string, payload: any): void {
    const queue = this.getSyncQueue();
    queue.push({ id: `sync-${Date.now()}`, action, payload, timestamp: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, encryptData(queue));
  },

  clearSyncQueue(): void {
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
  },

  // Data Vault Management (DPDP Act 2023)
  exportFullVault(): string {
    const fullVault = {
      exportedAt: new Date().toISOString(),
      encryptionStandard: 'AES-256 (DPDP Act 2023 Compliant)',
      profile: this.getProfile(),
      photos: this.getMemoryPhotos(),
      reminders: this.getReminders(),
      cognitiveHistory: this.getCognitiveHistory(),
      garden: this.getGardenElements(),
      alerts: this.getAlerts()
    };
    return JSON.stringify(fullVault, null, 2);
  },

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
};

