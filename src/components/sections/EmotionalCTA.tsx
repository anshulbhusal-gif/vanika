import React from 'react';
import { Heart, Sparkles, ArrowRight, Volume2 } from 'lucide-react';
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
    <section className="py-16 sm:py-24 bg-[#1E3A2F] text-[#FDFBF7] relative overflow-hidden" id="section-emotional-cta">
      {/* Background Soft Hill & Sunset Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#152921] via-[#1E3A2F] to-[#2D4739] opacity-95" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Gentle Firefly Sparkles */}
      <div className="absolute top-12 left-10 text-xl animate-gentle-float opacity-60">✨</div>
      <div className="absolute bottom-16 right-16 text-2xl animate-gentle-float-delayed opacity-50">✨</div>
      <div className="absolute top-24 right-1/4 text-lg animate-gentle-float opacity-40">✨</div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Heart className="w-4 h-4 fill-current" />
          A Digital Courtyard for our Elders
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading text-[#FDFBF7] tracking-tight leading-tight">
          Every memory matters.
        </h2>

        <div className="text-xl sm:text-2xl text-[#EAE2D2] font-medium space-y-1">
          <p>A little play.</p>
          <p>A familiar voice.</p>
          <p className="text-[#D4AF37] font-bold">A moment of connection.</p>
        </div>

        <p className="text-sm sm:text-base text-[#EAE2D2]/80 max-w-xl mx-auto leading-relaxed pt-2">
          Join thousands of elders, caregivers, and community health workers across the North East celebrating living memories every single day.
        </p>

        {/* Action Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="btn-cta-begin-journey"
            onClick={() => {
              soundSynth.playGentleChime();
              onNavigate('patient-app');
            }}
            className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-[#D4AF37] hover:bg-[#DFC25D] text-[#1E3A2F] font-extrabold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer focus-accessible"
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
            className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-[#FDFBF7] border border-[#FDFBF7]/25 font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Volume2 className="w-5 h-5 text-[#D4AF37]" />
            <span>Speak with AI Companion</span>
          </button>
        </div>
      </div>
    </section>
  );
};
