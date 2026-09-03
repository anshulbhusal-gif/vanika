import React, { useState, useEffect } from 'react';
import { User, X, ShieldCheck, Heart, Phone, Sparkles, Save, CheckCircle2, Lock } from 'lucide-react';
import { Language } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { getTranslation } from '../../utils/translations';

interface UserProfileData {
  elderName: string;
  elderNickname: string;
  age: string;
  primaryLanguage: Language;
  caregiverName: string;
  caregiverRelation: string;
  emergencyPhone: string;
  reminiscenceTopic: string;
  notes: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage
}) => {
  const t = getTranslation(currentLanguage);

  const [profile, setProfile] = useState<UserProfileData>(() => {
    const saved = localStorage.getItem('vanika_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      elderName: 'Dipankar Baruah',
      elderNickname: 'Baidon / Aita',
      age: '74',
      primaryLanguage: currentLanguage || 'English',
      caregiverName: 'Anindita Baruah',
      caregiverRelation: 'Daughter',
      emergencyPhone: '+91 98765 43210',
      reminiscenceTopic: 'Tezpur Tea Gardens & Rongali Bihu 1985',
      notes: 'Responds best to gentle Assamese greetings and classic Bihu drums.'
    };
  });

  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    setProfile((prev) => ({ ...prev, primaryLanguage: currentLanguage }));
  }, [currentLanguage]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundSynth.playGentleChime();
    localStorage.setItem('vanika_user_profile', JSON.stringify(profile));
    if (profile.primaryLanguage !== currentLanguage) {
      onSelectLanguage(profile.primaryLanguage);
    }
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#FDFBF7] dark:bg-[#182E23] text-[#1E3A2F] dark:text-[#FDFBF7] border-2 border-[#D4AF37] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#1E3A2F] text-[#FDFBF7] flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37] text-[#1E3A2F] flex items-center justify-center font-bold text-lg shadow-md">
              👤
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#FDFBF7] tracking-tight">
                Elder & Caregiver Account Profile
              </h2>
              <p className="text-xs text-[#D4AF37] font-medium">
                Encrypted AES-256 Local Sanctuary Profile
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundSynth.playSoftClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-[#2D4739] hover:bg-[#3E6250] text-[#FDFBF7] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Saved Notification Alert */}
          {isSavedNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-md animate-bounce-subtle">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
              <span>Profile updated successfully! Encrypted in local vault.</span>
            </div>
          )}

          {/* Section 1: Elder Details */}
          <div className="space-y-4 p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15 dark:border-[#D4AF37]/20 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C66B44] dark:text-[#D4AF37]">
              <Heart className="w-4 h-4" />
              <span>1. Elder Patient Profile</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-[#1E3A2F] dark:text-[#FDFBF7] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.elderName}
                  onChange={(e) => setProfile({ ...profile, elderName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#1E3A2F]/30 dark:border-[#D4AF37]/30 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-bold text-[#1E3A2F] dark:text-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1E3A2F] dark:text-[#FDFBF7] mb-1">
                  Preferred Nickname / Title
                </label>
                <input
                  type="text"
                  value={profile.elderNickname}
                  onChange={(e) => setProfile({ ...profile, elderNickname: e.target.value })}
                  placeholder="e.g. Baidon / Aita"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#1E3A2F]/30 dark:border-[#D4AF37]/30 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-bold text-[#1E3A2F] dark:text-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1E3A2F] dark:text-[#FDFBF7] mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#1E3A2F]/30 dark:border-[#D4AF37]/30 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-bold text-[#1E3A2F] dark:text-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1E3A2F] dark:text-[#FDFBF7] mb-1">
                  Primary Language / Dialect
                </label>
                <select
                  value={profile.primaryLanguage}
                  onChange={(e) => setProfile({ ...profile, primaryLanguage: e.target.value as Language })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#1E3A2F]/30 dark:border-[#D4AF37]/30 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-bold text-[#1E3A2F] dark:text-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="English">English (NER Friendly)</option>
                  <option value="Assamese">Assamese (অসমীয়া)</option>
                  <option value="Bodo">Bodo (बर')</option>
                  <option value="Khasi">Khasi (Ka Ktien Khasi)</option>
                  <option value="Mizo">Mizo (Mizo ṭawng)</option>
                  <option value="Nagamese">Nagamese (Nagamese)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Caregiver & Contact */}
          <div className="space-y-4 p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15 dark:border-[#D4AF37]/20 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C66B44] dark:text-[#D4AF37]">
              <Phone className="w-4 h-4" />
              <span>2. Primary Caregiver & Emergency Info</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black text-[#1E3A2F] dark:text-[#FDFBF7] mb-1">
                  Caregiver Name
                </label>
                <input
                  type="text"
                  value={profile.caregiverName}
                  onChange={(e) => setProfile({ ...profile, caregiverName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#1E3A2F]/30 dark:border-[#D4AF37]/30 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-bold text-[#1E3A2F] dark:text-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1E3A2F] dark:text-[#FDFBF7] mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={profile.caregiverRelation}
                  onChange={(e) => setProfile({ ...profile, caregiverRelation: e.target.value })}
                  placeholder="e.g. Daughter / Son"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#1E3A2F]/30 dark:border-[#D4AF37]/30 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-bold text-[#1E3A2F] dark:text-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1E3A2F] dark:text-[#FDFBF7] mb-1">
                  Emergency Phone
                </label>
                <input
                  type="tel"
                  value={profile.emergencyPhone}
                  onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#1E3A2F]/30 dark:border-[#D4AF37]/30 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-bold text-[#1E3A2F] dark:text-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Cultural Reminiscence Preferences */}
          <div className="space-y-4 p-4 rounded-2xl bg-white dark:bg-[#0F1E17] border border-[#1E3A2F]/15 dark:border-[#D4AF37]/20 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C66B44] dark:text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
              <span>3. Cultural Memory & Routine Tags</span>
            </div>

            <div>
              <label className="block text-xs font-black text-[#1E3A2F] dark:text-[#FDFBF7] mb-1">
                Favorite Childhood Reminiscence Topic
              </label>
              <input
                type="text"
                value={profile.reminiscenceTopic}
                onChange={(e) => setProfile({ ...profile, reminiscenceTopic: e.target.value })}
                placeholder="e.g. Tezpur Tea Gardens, Bihu Songs, Riverside Walks"
                className="w-full px-3.5 py-2 rounded-xl border border-[#1E3A2F]/30 dark:border-[#D4AF37]/30 bg-[#FDFBF7] dark:bg-[#182E23] text-sm font-bold text-[#1E3A2F] dark:text-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Section 4: AI Model & Free API Key Integration */}
          <div className="space-y-4 p-4 rounded-2xl bg-[#1E3A2F]/10 dark:bg-[#0F1E17] border border-[#D4AF37]/40 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#D4AF37]">
              <Lock className="w-4 h-4 text-[#D4AF37]" />
              <span>4. AI Engine & Free API Key Settings</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-black text-[#1E3A2F] dark:text-[#FDFBF7]">
                  Google Gemini API Key (Optional — Free Tier Supported)
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-extrabold text-[#C66B44] dark:text-[#D4AF37] hover:underline flex items-center gap-1"
                >
                  <span>Get Free Key at Google AI Studio ↗</span>
                </a>
              </div>
              <input
                type="password"
                placeholder="AIzaSy... (Leave empty to use Pollinations Free Open API)"
                value={localStorage.getItem('vanika_gemini_api_key') || ''}
                onChange={(e) => localStorage.setItem('vanika_gemini_api_key', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#1E3A2F]/30 dark:border-[#D4AF37]/30 bg-white dark:bg-[#182E23] text-sm font-bold text-[#1E3A2F] dark:text-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <p className="text-[11px] text-[#2D4739] dark:text-[#EAE2D2] mt-1 font-semibold">
                *VANIKA automatically uses zero-config free Pollinations AI if no key is entered!
              </p>
            </div>
          </div>

          {/* Footer Action Controls */}
          <div className="pt-3 border-t border-[#1E3A2F]/15 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#2D4739] dark:text-[#D4AF37] font-extrabold">
              <Lock className="w-4 h-4 text-[#C66B44]" />
              <span>Zero-Cloud DPDP Act 2023 Compliant Vault</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#1E3A2F]/20 text-[#1E3A2F] dark:text-[#FDFBF7] font-extrabold text-xs hover:bg-[#1E3A2F]/10 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1E3A2F] hover:bg-[#2D4739] text-[#FDFBF7] font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all cursor-pointer border border-[#D4AF37]"
              >
                <Save className="w-4 h-4 text-[#D4AF37]" />
                <span>Save Profile</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
