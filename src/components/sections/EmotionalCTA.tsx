import React from 'react';
import { Heart, ArrowRight, Volume2 } from 'lucide-react';
import { ActiveView } from '../../types';
import { soundSynth } from '../../utils/audioSynth';

interface EmotionalCTAProps {
  onNavigate: (view: ActiveView) => void;
  onOpenCompanion: () => void;
}

export const EmotionalCTA: React.FC<EmotionalCTAProps> = ({
  onNavigate,
  onOpenCompanion
}) => {
  return (
    <section className="section-breathing bg-[#1E3A2F] text-[#FDFBF7] relative overflow-hidden border-t border-[#D4AF37]/30" id="section-emotional-cta">
      {/* Background Soft Hill & Sunset Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0C1A11] via-[#1E3A2F] to-[#2D4739] opacity-95" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Gentle Firefly Sparkles */}
      <div className="absolute top-12 left-10 text-xl animate-gentle-float opacity-60">✨</div>
      <div className="absolute bottom-16 right-16 text-2xl animate-gentle-float-delayed opacity-50">✨</div>
      <div className="absolute top-24 right-1/4 text-lg animate-gentle-float opacity-40">✨</div>

      <div className="section-max text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest">
          <Heart className="w-4 h-4 fill-current" />
          A DIGITAL COURTYARD FOR OUR ELDERS
        </div>

        <h2 className="font-display text-display-lg text-[#FDFBF7] tracking-tight">
          Every memory matters.
        </h2>

        <div className="text-xl sm:text-2xl text-[#C8D8CF] font-light space-y-1">
          <p>A little play.</p>
          <p>A familiar voice.</p>
          <p className="text-[#D4AF37] font-bold italic">A moment of connection.</p>
        </div>

        <p className="prose-elder text-[#C8D8CF] max-w-xl mx-auto leading-relaxed pt-2">
          Join elders, caregivers, and health workers across North Eastern India celebrating living memories every single day.
        </p>

        {/* Action Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="btn-cta-begin-journey"
            onClick={() => {
              soundSynth.playGentleChime();
              onNavigate('patient-app');
            }}
            className="btn-gold text-base py-4 px-8"
          >
            <span>Begin the Journey</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            id="btn-cta-speak-companion"
            onClick={() => {
              soundSynth.playGentleChime();
              onOpenCompanion();
            }}
            className="btn-ghost text-white border-white/30 hover:bg-white/10 text-base py-4 px-6"
          >
            <Volume2 className="w-5 h-5 text-[#D4AF37]" />
            <span>Speak with AI Companion</span>
          </button>
        </div>
      </div>
    </section>
  );
};
