export type Language = 'English' | 'Assamese' | 'Bodo' | 'Khasi' | 'Mizo' | 'Nagamese';

export type EmotionState = 'calm' | 'joy' | 'confused' | 'frustrated' | 'thoughtful';

export type ActiveView = 
  | 'home' 
  | 'how-it-works' 
  | 'features' 
  | 'culture' 
  | 'caregiver' 
  | 'privacy' 
  | 'patient-app'
  | 'game-memory'
  | 'game-sequence'
  | 'game-attention'
  | 'game-cultural'
  | 'memory-house'
  | 'memory-garden'
  | 'companion'
  | 'reminders'
  | 'caregiver-portal'
  | 'login'
  | 'signup'
  | 'onboarding'
  | 'games-hub'
  | 'game-result'
  | 'progress'
  | 'daily-routine'
  | 'settings'
  | 'notifications';

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  darkMode: boolean;
  reducedMotion: boolean;
  voiceSpeed: 'slow' | 'normal';
  voiceGuideEnabled: boolean;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  primaryLanguage: Language;
  memoryScore: number;
  attentionScore: number;
  moodStatus: 'Calm' | 'Happy' | 'Tired' | 'Restless';
  streakDays: number;
  adherenceRate: number;
  lastSynced: string;
  weeklySessions: number;
}

export interface MemoryPhotoItem {
  id: string;
  title: string;
  personName: string;
  relationship: string;
  year: string;
  location: string;
  imageUrl: string;
  audioPrompt: string;
  options: string[];
  correctAnswer: string;
  storyNote: string;
}

export interface SequenceStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  iconName: string;
  culturalNote: string;
}

export interface GardenElement {
  id: string;
  type: 'tree' | 'fern' | 'flower' | 'sunflower' | 'butterfly';
  title: string;
  associatedActivity: string;
  growthStage: number; // 1 to 4
  maxStage: number;
  lastWatered: string;
  color: string;
}

export interface ReminderItem {
  id: string;
  time: string;
  title: string;
  culturalWrapper: string;
  type: 'medication' | 'hydration' | 'activity' | 'memory' | 'rest';
  completed: boolean;
  audioPrompt: string;
}

export interface CognitiveDataPoint {
  date: string;
  dayName: string;
  memoryScore: number;
  attentionScore: number;
  moodIndex: number; // 1 to 10
  minutesActive: number;
}

export interface AlertNotification {
  id: string;
  severity: 'gentle-alert' | 'advisory' | 'positive';
  title: string;
  metricChange: string;
  timeframe: string;
  suggestedAction: string;
  timestamp: string;
  read: boolean;
}

export interface IndigenousCareArticle {
  id: string;
  title: string;
  region: string;
  category: 'diet' | 'routine' | 'storytelling' | 'community';
  summary: string;
  details: string;
  recommendedActivity: string;
}

// ─── New Types for Full Frontend ───

export interface OnboardingData {
  name: string;
  ageGroup: string;
  language: Language;
  dailyGoal: number;
  practiceAreas: string[];
  caregiverPhone: string;
}

export interface GameResult {
  gameId: string;
  gameName: string;
  gameIcon: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpent: number; // seconds
  difficulty: 'Easy' | 'Medium' | 'Hard';
  improvements: string[];
  strengths: string[];
  nextRecommendation: {
    name: string;
    category: string;
    icon: string;
    view: ActiveView;
  };
}

export interface RoutineTask {
  id: string;
  time: string;
  title: string;
  icon: string;
  period: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
}

export interface AppNotification {
  id: string;
  type: 'activity' | 'routine' | 'achievement' | 'reminder' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: string;
  actionView?: ActiveView;
}

export interface GameCardData {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'memory' | 'attention' | 'pattern' | 'daily-recall';
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  view: ActiveView;
  color: string;
}

export interface WeeklyProgress {
  day: string;
  activitiesCompleted: number;
  minutesActive: number;
  memoryScore: number;
  attentionScore: number;
  patternScore: number;
}
