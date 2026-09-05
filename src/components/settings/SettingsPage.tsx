import React, { useState } from 'react';
import { User, Globe, Type, Eye, Volume2, Bell, Shield, Users, Save, CheckCircle2, ChevronRight } from 'lucide-react';
import { AccessibilitySettings, Language } from '../../types';
import { NER_LANGUAGES } from '../../data/mockData';
import { apiClient } from '../../services/api/apiClient';

interface SettingsPageProps {
  accessibilitySettings: AccessibilitySettings;
  onUpdateSettings: (settings: Partial<AccessibilitySettings>) => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  accessibilitySettings,
  onUpdateSettings,
  currentLanguage,
  onSelectLanguage,
}) => {
  const [saved, setSaved] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    try {
      await apiClient.patch('/accessibility', {
        fontSize: accessibilitySettings.fontSize,
        highContrast: accessibilitySettings.highContrast,
        voiceReadout: accessibilitySettings.voiceReadout,
        screenReaderOptimized: accessibilitySettings.screenReaderOptimized,
        simplifiedNavigation: accessibilitySettings.simplifiedNavigation,
        reducedMotion: accessibilitySettings.reducedMotion,
        audioCues: accessibilitySettings.audioCues,
      });
    } catch (err) {
      // Retained locally
    }
    setTimeout(() => setSaved(false), 2000);
  };

  const fontSizes: { id: 'normal' | 'large' | 'extra-large'; label: string; desc: string }[] = [
    { id: 'normal', label: 'Normal', desc: 'Standard text size' },
    { id: 'large', label: 'Large', desc: 'Bigger text for comfort' },
    { id: 'extra-large', label: 'Extra Large', desc: 'Maximum readability' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0C1A11] py-8 sm:py-12" id="view-settings">
      <div className="section-max max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center text-xl">
            ⚙️
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] tracking-tight">
              Profile & Accessibility
            </h1>
            <p className="text-sm text-[#5A7265] dark:text-[#9DBFB0] mt-0.5">
              Tailor display size, languages, voice guidance, and privacy controls
            </p>
          </div>
        </div>

        {/* Personal Profile */}
        <div className="card-story bg-white dark:bg-[#162A1F] p-8 border border-[#2D4739]/15 dark:border-[#D4AF37]/20 space-y-6">
          <h2 className="font-display text-xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] flex items-center gap-2">
            <User className="w-5 h-5 text-[#D4AF37]" />
            Personal Account Information
          </h2>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-4xl shrink-0">
              👴🏽
            </div>
            <div>
              <p className="font-display text-xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">Bhaben Hazarika</p>
              <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0] mt-0.5">72 years • Guwahati, Assam</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A2F24] dark:text-[#F2EDE3] mb-1.5 uppercase tracking-wider">Name</label>
              <input
                type="text"
                defaultValue="Bhaben Hazarika"
                className="w-full py-3 px-4 rounded-xl bg-[#FDFBF7] dark:bg-[#0F2219] border border-[#2D4739]/15 text-[#1A2F24] dark:text-[#F2EDE3] font-semibold focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A2F24] dark:text-[#F2EDE3] mb-1.5 uppercase tracking-wider">Phone</label>
              <input
                type="tel"
                defaultValue="+91 98765 43210"
                className="w-full py-3 px-4 rounded-xl bg-[#FDFBF7] dark:bg-[#0F2219] border border-[#2D4739]/15 text-[#1A2F24] dark:text-[#F2EDE3] font-semibold focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Regional Language Selection */}
        <div className="card-story bg-white dark:bg-[#162A1F] p-8 border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
          <h2 className="font-display text-xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#C06A44]" />
            Mother Tongue & Regional Language
          </h2>

          <button
            onClick={() => setShowLanguageModal(true)}
            className="card-story w-full flex items-center justify-between p-5 bg-[#FDFBF7] dark:bg-[#0F2219] border border-[#2D4739]/15 dark:border-[#D4AF37]/20 cursor-pointer hover:border-[#D4AF37]"
          >
            <div>
              <span className="font-display text-lg font-bold text-[#1A2F24] dark:text-[#F2EDE3] block">
                {NER_LANGUAGES.find(l => l.id === currentLanguage)?.nativeScript || currentLanguage}
              </span>
              <span className="text-xs text-[#5A7265] dark:text-[#9DBFB0]">
                {NER_LANGUAGES.find(l => l.id === currentLanguage)?.region || ''}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#7B9E87]" />
          </button>
        </div>

        {/* Font Size Scaling */}
        <div className="card-story bg-white dark:bg-[#162A1F] p-8 border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
          <h2 className="font-display text-xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] mb-1 flex items-center gap-2">
            <Type className="w-5 h-5 text-[#D4AF37]" />
            Text Display Size
          </h2>
          <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0] mb-6">Select a text scale for comfortable reading.</p>
          
          <div className="space-y-3">
            {fontSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => onUpdateSettings({ fontSize: size.id })}
                className={`card-story w-full p-4 flex items-center justify-between cursor-pointer border transition-all ${
                  accessibilitySettings.fontSize === size.id
                    ? 'bg-[#1E3A2F] text-[#FDFBF7] border-[#D4AF37] shadow-md'
                    : 'bg-[#FDFBF7] dark:bg-[#0F2219] text-[#1A2F24] dark:text-[#F2EDE3] border-[#2D4739]/15 dark:border-[#D4AF37]/20 hover:border-[#D4AF37]'
                }`}
              >
                <div>
                  <span className="font-display text-base font-bold block">{size.label}</span>
                  <span className="text-xs opacity-80">{size.desc}</span>
                </div>
                {accessibilitySettings.fontSize === size.id && (
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Accessibility Toggles */}
        <div className="card-story bg-white dark:bg-[#162A1F] p-8 border border-[#2D4739]/15 dark:border-[#D4AF37]/20 space-y-6">
          <h2 className="font-display text-xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#7B9E87]" />
            Visual Accessibility
          </h2>

          <div className="space-y-5">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-display text-base font-bold text-[#1A2F24] dark:text-[#F2EDE3] block">High Contrast Mode</span>
                <span className="text-xs text-[#5A7265] dark:text-[#9DBFB0]">Enhanced contrast for visual clarity</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ highContrast: !accessibilitySettings.highContrast })}
                className={`w-14 h-8 rounded-full transition-all cursor-pointer relative ${
                  accessibilitySettings.highContrast ? 'bg-[#1E3A2F]' : 'bg-[#F5EEE2] dark:bg-[#1A3328]'
                }`}
                role="switch"
                aria-checked={accessibilitySettings.highContrast}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
                  accessibilitySettings.highContrast ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-display text-base font-bold text-[#1A2F24] dark:text-[#F2EDE3] block">Night Mode Theme</span>
                <span className="text-xs text-[#5A7265] dark:text-[#9DBFB0]">Deep forest theme for evening comfort</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ darkMode: !accessibilitySettings.darkMode })}
                className={`w-14 h-8 rounded-full transition-all cursor-pointer relative ${
                  accessibilitySettings.darkMode ? 'bg-[#1E3A2F]' : 'bg-[#F5EEE2] dark:bg-[#1A3328]'
                }`}
                role="switch"
                aria-checked={accessibilitySettings.darkMode}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
                  accessibilitySettings.darkMode ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-display text-base font-bold text-[#1A2F24] dark:text-[#F2EDE3] block">Reduced Motion</span>
                <span className="text-xs text-[#5A7265] dark:text-[#9DBFB0]">Minimize ambient UI animations</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ reducedMotion: !accessibilitySettings.reducedMotion })}
                className={`w-14 h-8 rounded-full transition-all cursor-pointer relative ${
                  accessibilitySettings.reducedMotion ? 'bg-[#1E3A2F]' : 'bg-[#F5EEE2] dark:bg-[#1A3328]'
                }`}
                role="switch"
                aria-checked={accessibilitySettings.reducedMotion}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
                  accessibilitySettings.reducedMotion ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Voice Assistance */}
        <div className="card-story bg-white dark:bg-[#162A1F] p-8 border border-[#2D4739]/15 dark:border-[#D4AF37]/20 space-y-6">
          <h2 className="font-display text-xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#D4AF37]" />
            Voice Assistance & Speech
          </h2>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-display text-base font-bold text-[#1A2F24] dark:text-[#F2EDE3] block">Spoken Voice Prompts</span>
                <span className="text-xs text-[#5A7265] dark:text-[#9DBFB0]">Automatically read activity prompts aloud</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ voiceGuideEnabled: !accessibilitySettings.voiceGuideEnabled })}
                className={`w-14 h-8 rounded-full transition-all cursor-pointer relative ${
                  accessibilitySettings.voiceGuideEnabled ? 'bg-[#1E3A2F]' : 'bg-[#F5EEE2] dark:bg-[#1A3328]'
                }`}
                role="switch"
                aria-checked={accessibilitySettings.voiceGuideEnabled}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
                  accessibilitySettings.voiceGuideEnabled ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-display text-base font-bold text-[#1A2F24] dark:text-[#F2EDE3] block">Speech Cadence</span>
                <span className="text-xs text-[#5A7265] dark:text-[#9DBFB0]">
                  Currently: {accessibilitySettings.voiceSpeed === 'slow' ? 'Gentle & Slow' : 'Normal'}
                </span>
              </div>
              <button
                onClick={() => onUpdateSettings({ voiceSpeed: accessibilitySettings.voiceSpeed === 'slow' ? 'normal' : 'slow' })}
                className="btn-ghost py-2 px-4 text-xs font-semibold"
              >
                {accessibilitySettings.voiceSpeed === 'slow' ? 'Set to Normal' : 'Set to Slow'}
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Banner */}
        <div className="card-story bg-[#1E3A2F] text-[#FDFBF7] p-8 border border-[#D4AF37]/30 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-display text-lg font-bold">Encrypted Local Data Privacy</h2>
          </div>
          <p className="text-xs text-[#C8D8CF] leading-relaxed">
            All personal photographs, speech transcripts, and daily scores are encrypted locally on device. DPDP Act 2023 Compliant.
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="btn-primary w-full py-4 text-base"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5 text-[#D4AF37]" />
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-slide-up">
          <div className="card-story w-full max-w-md bg-white dark:bg-[#162A1F] p-8 border border-[#D4AF37]/30 shadow-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#C06A44]" />
              Choose Language
            </h3>

            <div className="space-y-3">
              {NER_LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    onSelectLanguage(lang.id as Language);
                    setShowLanguageModal(false);
                  }}
                  className={`card-story w-full p-4 flex items-center justify-between cursor-pointer border transition-all text-left ${
                    currentLanguage === lang.id
                      ? 'bg-[#1E3A2F] text-[#FDFBF7] border-[#D4AF37] shadow-md'
                      : 'bg-[#FDFBF7] dark:bg-[#0F2219] text-[#1A2F24] dark:text-[#F2EDE3] border-[#2D4739]/15 dark:border-[#D4AF37]/20 hover:border-[#D4AF37]'
                  }`}
                >
                  <div>
                    <span className="font-display text-lg font-bold block">{lang.nativeScript}</span>
                    <span className="text-xs opacity-80">{lang.name} • {lang.region}</span>
                  </div>
                  {currentLanguage === lang.id && (
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowLanguageModal(false)}
              className="btn-ghost w-full mt-6 py-3 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
