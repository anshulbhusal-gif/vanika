import React, { useState, useEffect } from 'react';
import { Menu, X, Volume2, LogIn, User, Globe, ChevronDown, Leaf } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
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

const NAV_LINKS = [
  { label: 'How It Works', view: 'how-it-works' as ActiveView },
  { label: 'Features', view: 'features' as ActiveView },
  { label: 'NE Roots', view: 'culture' as ActiveView },
];

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
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on view change
  useEffect(() => { setIsMobileMenuOpen(false); }, [activeView]);

  const handleNav = (view: ActiveView) => {
    soundSynth.playSoftClick();
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  const isElderMode = activeView === 'patient-app' || activeView.startsWith('game-') || activeView === 'memory-house' || activeView === 'memory-garden' || activeView === 'games-hub';
  const isCaregiverMode = activeView === 'caregiver' || activeView === 'caregiver-portal';
  const isHome = activeView === 'home';

  return (
    <header
      id="main-app-header"
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'navbar-frosted shadow-sm py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

        {/* ── Brand Wordmark ── */}
        <button
          id="btn-nav-logo"
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 group shrink-0 cursor-pointer focus-accessible rounded-lg"
          aria-label="Vanika — go to home"
        >
          {/* Leaf mark */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E3A2F] to-[#3D5A4E] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Leaf className="w-4.5 h-4.5 text-[#D4AF37]" strokeWidth={2} />
          </div>
          {/* Wordmark */}
          <div className="flex flex-col leading-none">
            <span
              className="font-display text-xl font-bold text-[#1E3A2F] dark:text-[#F2EDE3] tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
            >
              Vanika
            </span>
            <span className="text-eyebrow text-[0.58rem] text-[#7B9E87]">Cognitive Care</span>
          </div>
        </button>

        {/* ── Desktop Navigation ── */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
          {NAV_LINKS.map(link => (
            <button
              key={link.view}
              id={`btn-nav-${link.view}`}
              onClick={() => handleNav(link.view)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer focus-accessible ${
                activeView === link.view
                  ? 'bg-[#1E3A2F]/10 text-[#1E3A2F] dark:bg-[#F2EDE3]/10 dark:text-[#F2EDE3]'
                  : 'text-[#5A7265] hover:text-[#1E3A2F] dark:text-[#9DBFB0] dark:hover:text-[#F2EDE3] hover:bg-[#1E3A2F]/06'
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* Separator */}
          <span className="w-px h-5 bg-[#2D4739]/15 mx-1" />

          {/* Role mode buttons */}
          <button
            id="btn-nav-elder"
            onClick={() => handleNav('patient-app')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer focus-accessible ${
              isElderMode
                ? 'bg-[#1E3A2F] text-[#FDFBF7] shadow-sm'
                : 'text-[#5A7265] hover:text-[#1E3A2F] hover:bg-[#1E3A2F]/08 dark:text-[#9DBFB0]'
            }`}
          >
            <span className="text-base leading-none">🌿</span>
            <span>Elder</span>
          </button>

          <button
            id="btn-nav-caregiver"
            onClick={() => handleNav('caregiver-portal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer focus-accessible ${
              isCaregiverMode
                ? 'bg-[#C06A44] text-white shadow-sm'
                : 'text-[#5A7265] hover:text-[#C06A44] hover:bg-[#C06A44]/08 dark:text-[#9DBFB0]'
            }`}
          >
            <span className="text-base leading-none">🫂</span>
            <span>Caregiver</span>
          </button>
        </nav>

        {/* ── Right Actions ── */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {/* Language */}
          <LanguageSelector className="mr-1" />

          {/* Oja Companion */}
          <button
            id="btn-nav-ai-companion"
            onClick={() => { soundSynth.playGentleChime(); onOpenCompanion(); }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1E3A2F] hover:bg-[#2D4739] text-[#F2EDE3] text-sm font-bold border border-[#D4AF37]/40 transition-all hover:shadow-md cursor-pointer"
            title="Talk to Oja AI Companion"
          >
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-status-pulse shrink-0" />
            <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="whitespace-nowrap">Talk to Oja</span>
          </button>

          {/* Sign In */}
          {!isAuthenticated && (
            <button
              id="btn-nav-sign-in"
              onClick={() => { soundSynth.playSoftClick(); onNavigate('login'); }}
              className="btn-ghost text-sm py-2 px-4"
              aria-label="Sign in to Vanika"
            >
              <LogIn className="w-3.5 h-3.5 text-[#C06A44]" />
              Sign In
            </button>
          )}

          {/* Profile */}
          <button
            id="btn-nav-account-profile"
            onClick={() => { soundSynth.playSoftClick(); onOpenProfile(); }}
            className="w-9 h-9 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 border border-[#D4AF37]/30 flex items-center justify-center transition-all cursor-pointer"
            title="Profile"
            aria-label="Open user profile"
          >
            <User className="w-4 h-4 text-[#1E3A2F] dark:text-[#D4AF37]" />
          </button>
        </div>

        {/* ── Mobile Controls ── */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => { soundSynth.playGentleChime(); onOpenCompanion(); }}
            className="w-10 h-10 rounded-xl bg-[#1E3A2F] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center"
            aria-label="Open Oja AI Companion"
          >
            <Volume2 className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={() => { soundSynth.playSoftClick(); setIsMobileMenuOpen(!isMobileMenuOpen); }}
            className="w-10 h-10 rounded-xl bg-[#2D4739]/12 dark:bg-[#F2EDE3]/08 text-[#1E3A2F] dark:text-[#F2EDE3] flex items-center justify-center focus-accessible"
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Drawer ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FDFBF7] dark:bg-[#0F2219] border-t border-[#2D4739]/10 dark:border-[#D4AF37]/15 px-4 py-5 space-y-3 animate-fade-in shadow-lg">

          {/* Role mode pills */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNav('patient-app')}
              className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                isElderMode
                  ? 'bg-[#1E3A2F] text-[#FDFBF7]'
                  : 'bg-[#1E3A2F]/08 text-[#1E3A2F] dark:text-[#F2EDE3] dark:bg-[#F2EDE3]/06'
              }`}
            >
              <span className="text-2xl">🌿</span>
              <span>Elder Courtyard</span>
            </button>
            <button
              onClick={() => handleNav('caregiver-portal')}
              className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                isCaregiverMode
                  ? 'bg-[#C06A44] text-white'
                  : 'bg-[#C06A44]/08 text-[#C06A44] dark:bg-[#C06A44]/15'
              }`}
            >
              <span className="text-2xl">🫂</span>
              <span>Caregiver Vault</span>
            </button>
          </div>

          {/* Nav links */}
          <div className="space-y-1 pt-1 border-t border-[#2D4739]/08 dark:border-[#D4AF37]/10">
            {NAV_LINKS.map(link => (
              <button
                key={link.view}
                onClick={() => handleNav(link.view)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-[#5A7265] dark:text-[#9DBFB0] hover:bg-[#1E3A2F]/06 hover:text-[#1E3A2F] transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Sign In (mobile) */}
          {!isAuthenticated && (
            <button
              id="btn-nav-mobile-sign-in"
              onClick={() => handleNav('login')}
              className="w-full btn-primary btn-elder mt-2"
              aria-label="Sign in to Vanika"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Vanika
            </button>
          )}
        </div>
      )}
    </header>
  );
};
