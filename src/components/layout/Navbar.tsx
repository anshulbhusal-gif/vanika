import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, Heart, Shield, Users, Compass, BookOpen, Volume2, Home, Activity, User, Stethoscope, LogIn } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { VanikaLogo } from '../common/VanikaLogo';
import { LanguageSelector } from '../common/LanguageSelector';
import { getTranslation } from '../../utils/translations';

interface NavbarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  currentLanguage?: Language;
  onSelectLanguage?: (lang: Language) => void;
  onOpenCompanion: () => void;
  onOpenProfile: () => void;
  isAuthenticated?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  currentLanguage = 'English',
  onSelectLanguage,
  onOpenCompanion,
  onOpenProfile,
  isAuthenticated = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = getTranslation(currentLanguage as Language);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: ActiveView) => {
    soundSynth.playSoftClick();
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  // Determine which top-level mode is active
  const isElderMode = activeView === 'patient-app' || activeView.startsWith('game-') || activeView === 'memory-house' || activeView === 'memory-garden';
  const isCaregiverMode = activeView === 'caregiver' || activeView === 'caregiver-portal';
  const isExplorMode = !isElderMode && !isCaregiverMode;

  return (
    <header
      id="main-app-header"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FDFBF7]/95 backdrop-blur-xl shadow-md border-b border-[#2D4739]/10 py-2'
          : 'bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#2D4739]/08 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3">

        {/* Brand Logo */}
        <VanikaLogo onClick={() => handleNavClick('home')} size="sm" />

        {/* ===== CENTER: 3-Tab Mode Switcher Pill ===== */}
        <div className="hidden md:flex items-center bg-[#F0EAD8] rounded-2xl p-1 gap-0.5 shadow-inner border border-[#2D4739]/12">

          {/* Tab 1: Explore Vanika */}
          <button
            id="btn-nav-mode-explore"
            onClick={() => handleNavClick('home')}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              isExplorMode
                ? 'bg-[#1E3A2F] text-[#FDFBF7] shadow-md'
                : 'text-[#2D4739] hover:bg-white/60'
            }`}
          >
            <Home className={`w-4 h-4 shrink-0 ${isExplorMode ? 'text-[#D4AF37]' : 'text-[#6A9B96]'}`} />
            <span>Explore Vanika</span>
            {isExplorMode && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-[#D4AF37]" />
            )}
          </button>

          {/* Tab 2: Elder Courtyard */}
          <button
            id="btn-nav-mode-elder"
            onClick={() => handleNavClick('patient-app')}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              isElderMode
                ? 'bg-[#D4AF37] text-[#1E3A2F] shadow-md'
                : 'text-[#2D4739] hover:bg-white/60'
            }`}
          >
            <span className="text-base leading-none">👴🏽</span>
            <span>Elder Courtyard</span>
            {isElderMode && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-[#1E3A2F]" />
            )}
          </button>

          {/* Tab 3: Caregiver Vault */}
          <button
            id="btn-nav-mode-caregiver"
            onClick={() => handleNavClick('caregiver-portal')}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              isCaregiverMode
                ? 'bg-[#C66B44] text-white shadow-md'
                : 'text-[#2D4739] hover:bg-white/60'
            }`}
          >
            <Stethoscope className={`w-4 h-4 shrink-0 ${isCaregiverMode ? 'text-white' : 'text-[#C66B44]'}`} />
            <span>Caregiver Vault</span>
            {isCaregiverMode && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-[#D4AF37]" />
            )}
          </button>
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {/* Language Selector */}
          <LanguageSelector className="mr-1" />

          {/* Talk to Oja */}
          <button
            id="btn-nav-ai-companion"
            onClick={() => {
              soundSynth.playGentleChime();
              onOpenCompanion();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1E3A2F] hover:bg-[#2D4739] text-[#FDFBF7] font-extrabold text-xs border border-[#D4AF37]/60 transition-all hover:scale-105 shadow-sm cursor-pointer"
            title="Open AI Elder Companion"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-status-pulse shrink-0" />
            <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="whitespace-nowrap">Talk to Oja</span>
          </button>

          {/* Sign In — shown when NOT authenticated */}
          {!isAuthenticated && (
            <button
              id="btn-nav-sign-in"
              onClick={() => {
                soundSynth.playSoftClick();
                onNavigate('login');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border-2 border-[#2D4739]/20 hover:border-[#D4AF37] text-[#1E3A2F] font-extrabold text-xs transition-all hover:shadow-md cursor-pointer"
              aria-label="Sign in to Vanika"
            >
              <LogIn className="w-3.5 h-3.5 text-[#C66B44]" />
              <span className="whitespace-nowrap">Sign In</span>
            </button>
          )}

          {/* Account */}
          <button
            id="btn-nav-account-profile"
            onClick={() => {
              soundSynth.playSoftClick();
              onOpenProfile();
            }}
            className="p-2 rounded-xl bg-[#D4AF37] hover:bg-[#C66B44] text-[#1E3A2F] hover:text-white font-extrabold text-xs shadow-sm border border-[#1E3A2F]/20 transition-all hover:scale-105 cursor-pointer flex items-center gap-1"
            title="Open Elder & Caregiver Profile"
          >
            <User className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => {
              soundSynth.playGentleChime();
              onOpenCompanion();
            }}
            className="p-2.5 rounded-xl bg-[#1E3A2F] text-[#D4AF37] border border-[#D4AF37]/40"
            aria-label="Open AI Companion Voice"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              soundSynth.playSoftClick();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="p-2.5 rounded-xl bg-[#2D4739] text-[#FDFBF7] focus-accessible"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FDFBF7] border-b border-[#2D4739]/15 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fadeIn">

          {/* Mobile Mode Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-[#F0EAD8] rounded-2xl p-1.5">
            <button
              onClick={() => handleNavClick('home')}
              className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isExplorMode ? 'bg-[#1E3A2F] text-[#FDFBF7]' : 'text-[#2D4739]'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Explore</span>
            </button>
            <button
              onClick={() => handleNavClick('patient-app')}
              className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isElderMode ? 'bg-[#D4AF37] text-[#1E3A2F]' : 'text-[#2D4739]'
              }`}
            >
              <span className="text-xl">👴🏽</span>
              <span>Elder</span>
            </button>
            <button
              onClick={() => handleNavClick('caregiver-portal')}
              className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isCaregiverMode ? 'bg-[#C66B44] text-white' : 'text-[#2D4739]'
              }`}
            >
              <Stethoscope className="w-5 h-5" />
              <span>Caregiver</span>
            </button>
          </div>

          {/* Extra Links */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2D4739]/10">
            {[
              { label: 'How It Works', view: 'how-it-works' as ActiveView, icon: Compass },
              { label: 'Features', view: 'features' as ActiveView, icon: Sparkles },
              { label: 'NE Roots', view: 'culture' as ActiveView, icon: BookOpen },
              { label: 'Privacy', view: 'privacy' as ActiveView, icon: Shield },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-[#2D4739] hover:bg-[#F5EFE6] transition-colors cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-[#6A9B96]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Sign In / Sign Up */}
          {!isAuthenticated && (
            <div className="pt-2 border-t border-[#2D4739]/10">
              <button
                id="btn-nav-mobile-sign-in"
                onClick={() => handleNavClick('login')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1E3A2F] text-[#FDFBF7] font-extrabold text-sm cursor-pointer hover:bg-[#2D4739] transition-colors"
                aria-label="Sign in to Vanika"
              >
                <LogIn className="w-4 h-4 text-[#D4AF37]" />
                Sign In
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
