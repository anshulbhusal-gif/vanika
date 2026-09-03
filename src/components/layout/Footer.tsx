import React from 'react';
import { Heart, Globe, Shield, Phone, Sparkles } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { REGIONAL_LANGUAGES } from '../../data/culturalContent';
import { CulturalPatternBorder } from '../common/CulturalPatternBorder';
import { soundSynth } from '../../utils/audioSynth';
import { VanikaLogo } from '../common/VanikaLogo';

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
    <footer id="main-footer" className="bg-[#1E3A2F] text-[#FDFBF7] relative pt-12 pb-8 overflow-hidden">
      {/* Subtle cultural motif line */}
      <CulturalPatternBorder variant="gamusa" inverted className="mb-8" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-[#FDFBF7]/15">
          {/* Col 1: Brand & Cultural Vision */}
          <div className="lg:col-span-2 space-y-4">
            <VanikaLogo onClick={() => handleNav('home')} />

            <p className="text-sm text-[#EAE2D2] leading-relaxed max-w-md">
              A peaceful digital community courtyard providing culturally rooted, voice-first cognitive care and memory assistance for elderly individuals and caregivers across the North Eastern Region of India.
            </p>

            <div className="p-3.5 rounded-xl bg-[#2D4739]/80 border border-[#D4AF37]/30 max-w-md flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="text-xs text-[#FDFBF7]">
                <strong className="text-[#D4AF37] block mb-0.5">Community & ASHA Support</strong>
                Designed in harmony with community health workers, local dialects, and family elders.
              </div>
            </div>
          </div>

          {/* Col 2: Signature Product Modules */}
          <div>
            <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Core Experience
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('companion')}
                  className="text-[#EAE2D2] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  AI Elder Companion
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('memory-house')}
                  className="text-[#EAE2D2] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Memory House (Courtyard)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('memory-garden')}
                  className="text-[#EAE2D2] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Memory Garden
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('game-memory')}
                  className="text-[#EAE2D2] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Life-Story Recall ("Who is this?")
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('game-sequence')}
                  className="text-[#EAE2D2] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Bihu & Routine Sequencing
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Caregivers & Resources */}
          <div>
            <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Caregivers & Trust
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('caregiver-portal')}
                  className="text-[#EAE2D2] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Wellness Trends & Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('caregiver')}
                  className="text-[#EAE2D2] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Indigenous Care Knowledge
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('privacy')}
                  className="text-[#EAE2D2] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Local-First Encryption (DPDP)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('how-it-works')}
                  className="text-[#EAE2D2] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  How Vanika Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('reminders')}
                  className="text-[#EAE2D2] hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  Enculturated Reminders
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Regional Languages */}
          <div>
            <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
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
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    currentLanguage === lang.id
                      ? 'bg-[#D4AF37] text-[#1E3A2F] font-bold shadow-xs'
                      : 'text-[#EAE2D2] hover:bg-[#2D4739]'
                  }`}
                >
                  <span>{lang.nativeScript}</span>
                  <span className="opacity-80 text-[11px]">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#EAE2D2]/80 gap-3 text-center sm:text-left">
          <p>
            © 2026 Vanika. Handcrafted with reverence for the elders and families of North Eastern India.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-[#D4AF37]">
              <Heart className="w-3.5 h-3.5 fill-current" /> Safe & Non-Clinical Metaphors
            </span>
            <span>•</span>
            <span className="text-[#EAE2D2]/70">Zero Diagnostic Jargon</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
