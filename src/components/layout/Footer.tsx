import React from 'react';
import { Heart, Globe, Shield, Phone, Sparkles, Leaf } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { REGIONAL_LANGUAGES } from '../../data/culturalContent';
import { soundSynth } from '../../utils/audioSynth';

interface FooterProps {
  onNavigate: (view: ActiveView) => void;
  onSelectLanguage: (lang: Language) => void;
  currentLanguage: Language;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectLanguage,
  currentLanguage
}) => {
  const handleNav = (view: ActiveView) => {
    soundSynth.playSoftClick();
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#1E3A2F] text-[#FDFBF7] relative pt-16 pb-12 overflow-hidden border-t border-[#D4AF37]/20">
      {/* Decorative Gamusa / NE India border line */}
      <div className="absolute top-0 left-0 right-0 divider-gamusa" />

      <div className="section-max">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-[#FDFBF7]/10">
          {/* Col 1 & 2: Brand Story */}
          <div className="lg:col-span-2 space-y-5">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 fill-[#D4AF37]/30" />
              </div>
              <div>
                <span className="font-display text-2xl font-bold tracking-tight text-[#FDFBF7]">
                  Vanika
                </span>
                <span className="block font-mono-label text-[10px] text-[#A8C4B2] tracking-widest">
                  NORTH EAST INDIA COGNITIVE CARE
                </span>
              </div>
            </button>

            <p className="text-sm text-[#C8D8CF] leading-relaxed max-w-md">
              A peaceful digital courtyard providing voice-first, culturally rooted memory support and daily wellness for elders and caregivers across North Eastern India.
            </p>

            <div className="p-4 rounded-2xl bg-[#2D4739]/60 border border-[#D4AF37]/25 max-w-md flex items-start gap-3.5">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="text-xs text-[#C8D8CF] leading-relaxed">
                <strong className="text-[#D4AF37] block mb-0.5 font-semibold">ASHA & Family Centered</strong>
                Crafted in harmony with community health workers, local dialects, and family elders.
              </div>
            </div>
          </div>

          {/* Col 3: Core Experience */}
          <div>
            <h4 className="font-mono-label text-xs text-[#D4AF37] tracking-widest uppercase mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Core Experience
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('companion')}
                  className="text-[#C8D8CF] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  AI Companion (Oja)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('patient-app')}
                  className="text-[#C8D8CF] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Personal Courtyard
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('games-hub')}
                  className="text-[#C8D8CF] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Cognitive Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('daily-routine')}
                  className="text-[#C8D8CF] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Daily Routine
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('progress')}
                  className="text-[#C8D8CF] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Wellness Rhythm
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Caregivers & Trust */}
          <div>
            <h4 className="font-mono-label text-xs text-[#D4AF37] tracking-widest uppercase mb-4 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> Caregivers & Trust
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('caregiver-portal')}
                  className="text-[#C8D8CF] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Caregiver Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('privacy')}
                  className="text-[#C8D8CF] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Privacy & Encryption (DPDP)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('how-it-works')}
                  className="text-[#C8D8CF] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  How Vanika Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('settings')}
                  className="text-[#C8D8CF] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Accessibility Controls
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: NER Languages */}
          <div>
            <h4 className="font-mono-label text-xs text-[#D4AF37] tracking-widest uppercase mb-4 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" /> NER Languages
            </h4>
            <div className="flex flex-col gap-1.5">
              {REGIONAL_LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    soundSynth.playSoftClick();
                    onSelectLanguage(lang.id);
                  }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    currentLanguage === lang.id
                      ? 'bg-[#D4AF37] text-[#1E3A2F] shadow-xs'
                      : 'text-[#C8D8CF] hover:bg-[#2D4739]'
                  }`}
                >
                  <span>{lang.nativeScript}</span>
                  <span className="opacity-75 text-[11px] font-normal">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A8C4B2] gap-4 text-center sm:text-left">
          <p>© 2026 Vanika. Built with respect and care for North East India's elders and families.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#D4AF37] font-semibold">
              <Heart className="w-3.5 h-3.5 fill-current" /> Non-Clinical Metaphors
            </span>
            <span>•</span>
            <span>Zero Diagnostic Jargon</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
