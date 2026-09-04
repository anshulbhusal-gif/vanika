import React, { useState, useEffect } from 'react';
import { ActiveView, AccessibilitySettings, Language } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AccessibilityBar } from './components/common/AccessibilityBar';
import { OfflineBadge } from './components/common/OfflineBadge';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { AIElderCompanionModal } from './components/companion/AIElderCompanionModal';
import { FloatingCompanionDock } from './components/common/FloatingCompanionDock';

import { UserProfileModal } from './components/common/UserProfileModal';
import { ElderStoryDemoModal } from './components/demo/ElderStoryDemoModal';
import { OjaAgenticWorkflowModal } from './components/companion/OjaAgenticWorkflowModal';
import { BanyanFeatureTree } from './components/common/BanyanFeatureTree';

// Landing Page Sections
import { HeroSection } from './components/sections/HeroSection';
import { CulturalSection } from './components/sections/CulturalSection';
import { DayTimeline } from './components/sections/DayTimeline';
import { GamesOverview } from './components/sections/GamesOverview';
import { PrivacySection } from './components/sections/PrivacySection';
import { EmotionalCTA } from './components/sections/EmotionalCTA';

// Interactive Core Modules
import { MemoryHouse } from './components/memory/MemoryHouse';
import { MemoryGarden } from './components/memory/MemoryGarden';
import { MemoryGame } from './components/games/MemoryGame';
import { SequenceGame } from './components/games/SequenceGame';
import { AttentionGame } from './components/games/AttentionGame';
import { CulturalGame } from './components/games/CulturalGame';

// Portals & Views
import { PatientAppView } from './components/patient/PatientAppView';
import { CaregiverDashboard } from './components/caregiver/CaregiverDashboard';
import { HowItWorksView } from './components/views/HowItWorksView';
import { FeaturesView } from './components/views/FeaturesView';
import { CultureDeepDiveView } from './components/views/CultureDeepDiveView';
import { PrivacyPolicyView } from './components/views/PrivacyPolicyView';

// New Screens
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { GamesHub } from './components/games/GamesHub';
import { GameResultScreen } from './components/games/GameResultScreen';
import { ProgressPage } from './components/progress/ProgressPage';
import { DailyRoutinePage } from './components/routine/DailyRoutinePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { NotificationCenter } from './components/notifications/NotificationCenter';

// Views that use the authenticated layout (sidebar + bottom nav)
const AUTHENTICATED_VIEWS: ActiveView[] = [
  'patient-app', 'games-hub', 'game-memory', 'game-sequence', 'game-attention',
  'game-cultural', 'game-result', 'memory-house', 'memory-garden', 'progress',
  'daily-routine', 'caregiver', 'caregiver-portal', 'settings', 'notifications',
  'reminders', 'companion',
];

// Views that are fullscreen (no sidebar/navbar)
const FULLSCREEN_VIEWS: ActiveView[] = ['login', 'signup', 'onboarding'];

function AppContent() {
  const auth = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isAgenticOpen, setIsAgenticOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('English');

  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    highContrast: false,
    darkMode: false,
    reducedMotion: false,
    voiceSpeed: 'slow',
    voiceGuideEnabled: true
  });

  // Apply font size, dark mode, and high contrast classes to the document body
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-normal', 'font-large', 'font-xlarge', 'high-contrast', 'dark-theme', 'dark');

    if (accessibilitySettings.fontSize === 'large') {
      root.classList.add('font-large');
    } else if (accessibilitySettings.fontSize === 'extra-large') {
      root.classList.add('font-xlarge');
    } else {
      root.classList.add('font-normal');
    }

    if (accessibilitySettings.highContrast) {
      root.classList.add('high-contrast');
    }

    if (accessibilitySettings.darkMode) {
      root.classList.add('dark-theme', 'dark');
    }

    // Reduced motion
    if (accessibilitySettings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [accessibilitySettings]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  const isAuthenticated = AUTHENTICATED_VIEWS.includes(activeView);
  const isFullscreen = FULLSCREEN_VIEWS.includes(activeView);
  const isLanding = activeView === 'home' || activeView === 'how-it-works' || activeView === 'features' || activeView === 'culture' || activeView === 'privacy';

  const updateSettings = (newSetts: Partial<AccessibilitySettings>) => {
    setAccessibilitySettings(prev => ({ ...prev, ...newSetts }));
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-body transition-colors duration-200 ${
        accessibilitySettings.highContrast
          ? 'bg-black text-amber-300'
          : accessibilitySettings.darkMode
          ? 'bg-[#0F1E17] text-[#FDFBF7]'
          : 'bg-[#FDFBF7] text-[#2D4739]'
      }`}
    >
      {/* ── FULLSCREEN VIEWS (Login, Signup, Onboarding) ── */}
      {isFullscreen && (
        <>
          {activeView === 'login' && (
            <LoginPage
              onNavigate={setActiveView}
              currentLanguage={currentLanguage}
              onSelectLanguage={setCurrentLanguage}
            />
          )}
          {activeView === 'signup' && (
            <SignupPage
              onNavigate={setActiveView}
              currentLanguage={currentLanguage}
            />
          )}
          {activeView === 'onboarding' && (
            <OnboardingFlow
              onNavigate={setActiveView}
              onSelectLanguage={setCurrentLanguage}
            />
          )}
        </>
      )}

      {/* ── LANDING PAGE LAYOUT (Home + info pages) ── */}
      {isLanding && (
        <>
          <AccessibilityBar
            settings={accessibilitySettings}
            onUpdateSettings={updateSettings}
            currentLanguage={currentLanguage}
            onSelectLanguage={setCurrentLanguage}
          />
          <Navbar
            activeView={activeView}
            onNavigate={setActiveView}
            currentLanguage={currentLanguage}
            onSelectLanguage={setCurrentLanguage}
            onOpenCompanion={() => setIsCompanionOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
          <main className="flex-1">
            {activeView === 'home' && (
              <div>
                <HeroSection
                  onNavigate={setActiveView}
                  onOpenCompanion={() => setIsCompanionOpen(true)}
                  onOpenDemoStory={() => setIsDemoOpen(true)}
                  currentLanguage={currentLanguage}
                />
                <CulturalSection
                  currentLanguage={currentLanguage}
                  onSelectLanguage={setCurrentLanguage}
                />
                <DayTimeline currentLanguage={currentLanguage} />
                <GamesOverview onNavigate={setActiveView} />
                <BanyanFeatureTree
                  onNavigate={setActiveView}
                  onOpenCompanion={() => setIsCompanionOpen(true)}
                  currentLanguage={currentLanguage}
                />
                <div className="py-16 bg-[#FFFFFF] border-y border-[#2D4739]/10">
                  <MemoryHouse
                    currentLanguage={currentLanguage}
                    onSelectActivity={(room) => {
                      if (room.id === 'room-photos') setActiveView('game-memory');
                      else if (room.id === 'room-puzzles') setActiveView('game-sequence');
                      else if (room.id === 'room-stories') setActiveView('game-cultural');
                      else if (room.id === 'room-companion') setIsCompanionOpen(true);
                    }}
                  />
                </div>
                <div className="py-16 bg-[#FDFBF7]">
                  <MemoryGarden currentLanguage={currentLanguage} />
                </div>
                <PrivacySection />
                <EmotionalCTA
                  onNavigate={setActiveView}
                  onOpenCompanion={() => setIsCompanionOpen(true)}
                />
              </div>
            )}
            {activeView === 'how-it-works' && (
              <HowItWorksView
                onNavigate={setActiveView}
                onOpenCompanion={() => setIsCompanionOpen(true)}
              />
            )}
            {activeView === 'features' && (
              <FeaturesView
                onNavigate={setActiveView}
                onOpenCompanion={() => setIsCompanionOpen(true)}
              />
            )}
            {activeView === 'culture' && (
              <CultureDeepDiveView
                currentLanguage={currentLanguage}
                onSelectLanguage={setCurrentLanguage}
                onNavigate={setActiveView}
              />
            )}
            {activeView === 'privacy' && (
              <PrivacyPolicyView onNavigate={setActiveView} />
            )}
          </main>
          <Footer
            onNavigate={setActiveView}
            currentLanguage={currentLanguage}
            onSelectLanguage={setCurrentLanguage}
          />
        </>
      )}

      {/* ── AUTHENTICATED LAYOUT (Sidebar + BottomNav) ── */}
      {isAuthenticated && (
        <>
          {/* Top accessibility bar for authenticated views */}
          <AccessibilityBar
            settings={accessibilitySettings}
            onUpdateSettings={updateSettings}
            currentLanguage={currentLanguage}
            onSelectLanguage={setCurrentLanguage}
          />

          <div className="flex flex-1">
            {/* Desktop Sidebar */}
            <Sidebar
              activeView={activeView}
              onNavigate={setActiveView}
              onOpenCompanion={() => setIsCompanionOpen(true)}
            />

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen pb-20 lg:pb-0">
              {activeView === 'patient-app' && (
                <PatientAppView
                  currentLanguage={currentLanguage}
                  onNavigate={setActiveView}
                  onOpenCompanion={() => setIsCompanionOpen(true)}
                />
              )}

              {activeView === 'games-hub' && (
                <GamesHub
                  currentLanguage={currentLanguage}
                  onNavigate={setActiveView}
                />
              )}

              {activeView === 'memory-house' && (
                <MemoryHouse
                  currentLanguage={currentLanguage}
                  onBackToCourtyard={() => setActiveView('patient-app')}
                  onSelectActivity={(room) => {
                    if (room.id === 'room-photos') setActiveView('game-memory');
                    else if (room.id === 'room-puzzles') setActiveView('game-sequence');
                    else if (room.id === 'room-stories') setActiveView('game-cultural');
                    else if (room.id === 'room-companion') setIsCompanionOpen(true);
                  }}
                />
              )}

              {activeView === 'memory-garden' && (
                <MemoryGarden
                  currentLanguage={currentLanguage}
                  onBackToCourtyard={() => setActiveView('patient-app')}
                />
              )}

              {activeView === 'game-memory' && (
                <MemoryGame
                  currentLanguage={currentLanguage}
                  onBackToApp={() => setActiveView('game-result')}
                />
              )}

              {activeView === 'game-sequence' && (
                <SequenceGame
                  currentLanguage={currentLanguage}
                  onBackToApp={() => setActiveView('game-result')}
                />
              )}

              {activeView === 'game-attention' && (
                <AttentionGame
                  currentLanguage={currentLanguage}
                  onBackToApp={() => setActiveView('game-result')}
                />
              )}

              {activeView === 'game-cultural' && (
                <CulturalGame
                  currentLanguage={currentLanguage}
                  onBackToApp={() => setActiveView('game-result')}
                />
              )}

              {activeView === 'game-result' && (
                <GameResultScreen onNavigate={setActiveView} />
              )}

              {activeView === 'progress' && (
                <ProgressPage currentLanguage={currentLanguage} />
              )}

              {activeView === 'daily-routine' && (
                <DailyRoutinePage />
              )}

              {(activeView === 'caregiver' || activeView === 'caregiver-portal') && (
                <CaregiverDashboard
                  currentLanguage={currentLanguage}
                  onNavigate={setActiveView}
                />
              )}

              {activeView === 'settings' && (
                <SettingsPage
                  accessibilitySettings={accessibilitySettings}
                  onUpdateSettings={updateSettings}
                  currentLanguage={currentLanguage}
                  onSelectLanguage={setCurrentLanguage}
                />
              )}

              {activeView === 'notifications' && (
                <NotificationCenter onNavigate={setActiveView} />
              )}
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          <BottomNav
            activeView={activeView}
            onNavigate={setActiveView}
          />
        </>
      )}

      {/* ── GLOBAL OVERLAYS (available in all layouts) ── */}

      {/* AI Elder Companion Modal */}
      <AIElderCompanionModal
        isOpen={isCompanionOpen}
        onClose={() => setIsCompanionOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onOpenAgenticWorkflow={() => setIsAgenticOpen(true)}
      />

      {/* Oja Agentic Workflow */}
      <OjaAgenticWorkflowModal
        isOpen={isAgenticOpen}
        onClose={() => setIsAgenticOpen(false)}
        currentLanguage={currentLanguage}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
      />

      {/* Elder Story Demo */}
      <ElderStoryDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onNavigate={setActiveView}
        currentLanguage={currentLanguage}
      />

      {/* Notification Modal */}
      {isNotificationsOpen && (
        <NotificationCenter
          isModal
          onNavigate={(view) => {
            setIsNotificationsOpen(false);
            setActiveView(view);
          }}
          onClose={() => setIsNotificationsOpen(false)}
        />
      )}

      {/* Floating Companion (only on non-fullscreen views) */}
      {!isFullscreen && (
        <FloatingCompanionDock
          activeView={activeView}
          onNavigate={setActiveView}
          onOpenCompanion={() => setIsCompanionOpen(true)}
        />
      )}

      {/* Offline Badge */}
      <OfflineBadge />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider onLogout={() => { /* handled internally */ }}>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
