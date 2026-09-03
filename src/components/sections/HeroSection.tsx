import React, { useState } from 'react';
import { Volume2, Sparkles, ShieldCheck, ArrowRight, Play, Stethoscope, Cpu, Globe2 } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { VoiceAssistant } from '../../utils/speech';
import { getTranslation } from '../../utils/translations';
import { CulturalPatternBorder } from '../common/CulturalPatternBorder';

interface HeroSectionProps {
  onNavigate: (view: ActiveView) => void;
  onOpenCompanion: () => void;
  onOpenDemoStory?: () => void;
  currentLanguage?: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenCompanion,
  onOpenDemoStory,
  currentLanguage = 'English'
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const t = getTranslation(currentLanguage as Language);

  const handleHearWelcome = async () => {
    soundSynth.playGentleChime();
    setIsPlayingAudio(true);
    await VoiceAssistant.speak(
      "Namaskar and warm welcome to Vanika. Here in our digital community courtyard, you can remember cherished moments, play gentle games, and talk with a wise elder companion.",
      currentLanguage as Language,
      'slow'
    );
    setIsPlayingAudio(false);
  };

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FFFFFF] to-[#FDFBF7] dark:from-[#0F1E17] dark:via-[#182E23] dark:to-[#0F1E17] pt-10 pb-16 sm:pb-24"
      id="section-hero"
    >
      {/* Ambient orbs */}
      <div className="hero-orb-gold -top-20 -left-20" />
      <div className="hero-orb-emerald top-10 right-0" />

      {/* Subtle weave texture */}
      <div className="absolute inset-0 bg-ner-weave opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── TOP EYEBROW ── */}
        <div className="flex flex-col items-center text-center mb-10 animate-slide-in-up">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1E3A2F]/10 border border-[#1E3A2F]/20 text-[#1E3A2F] text-xs font-black uppercase tracking-wider shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#C66B44] animate-status-pulse" />
            <span>AI Cognitive Care • North-East India • SIH 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold font-heading text-[#1E3A2F] tracking-tight leading-[1.07] max-w-4xl">
            Cognitive Care{' '}
            <span className="text-[#C66B44]">Rooted in Culture,</span>
            <br />
            Powered by AI.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-[#52635D] max-w-2xl leading-relaxed">
            Non-stigmatizing daily memory stimulation for elderly dementia patients in NER —
            voiced in their own language, grounded in their own heritage.
          </p>

          {/* Hear welcome button */}
          <button
            id="btn-hero-hear-welcome"
            onClick={handleHearWelcome}
            className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-[#1E3A2F]/20 text-[#1E3A2F] text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer hover:border-[#D4AF37]"
          >
            <Volume2 className={`w-4 h-4 text-[#D4AF37] ${isPlayingAudio ? 'animate-pulse' : ''}`} />
            <span>{isPlayingAudio ? 'Speaking...' : '🔊 Hear Welcome in Your Language'}</span>
          </button>
        </div>

        {/* ── TWO MASSIVE CTA CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto animate-slide-in-up-delay-1">

          {/* CARD A — Elder Courtyard (Gold) */}
          <button
            id="btn-hero-elder-courtyard"
            onClick={() => {
              soundSynth.playSoftClick();
              onNavigate('patient-app');
            }}
            className="card-lift group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E3A2F] to-[#2D4739] border-2 border-[#D4AF37]/40 p-8 text-left shadow-xl cursor-pointer focus-accessible"
          >
            {/* Shimmer overlay on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shimmer-bg pointer-events-none" />

            {/* Gold glow orb */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-2xl group-hover:bg-[#D4AF37]/35 transition-all duration-500" />

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-[#D4AF37] flex items-center justify-center text-5xl shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300">
                👴🏽
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-black uppercase tracking-wide mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-status-pulse" />
                For Elderly Patients
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#FDFBF7] leading-tight mb-2">
                Enter Elder<br />Memory Courtyard
              </h2>
              <p className="text-sm sm:text-base text-[#EAE2D2]/80 leading-relaxed mb-6">
                Voice-first games, family photo recall & cultural heritage activities — all in your own language.
              </p>
              <div className="flex items-center gap-2 text-[#D4AF37] font-black text-sm">
                <span>Begin your session</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </button>

          {/* CARD B — Caregiver Vault (Terracotta/Emerald) */}
          <button
            id="btn-hero-caregiver-vault"
            onClick={() => {
              soundSynth.playSoftClick();
              onNavigate('caregiver-portal');
            }}
            className="card-lift group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FDFBF7] to-[#F5EFE6] border-2 border-[#C66B44]/30 p-8 text-left shadow-xl cursor-pointer focus-accessible"
          >
            {/* Terracotta glow orb */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#C66B44]/15 rounded-full blur-2xl group-hover:bg-[#C66B44]/30 transition-all duration-500" />

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-[#1E3A2F] flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="w-10 h-10 text-[#D4AF37]" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C66B44]/15 border border-[#C66B44]/30 text-[#C66B44] text-xs font-black uppercase tracking-wide mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                AES-256 Encrypted
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1E3A2F] leading-tight mb-2">
                Open Caregiver<br />Health Vault
              </h2>
              <p className="text-sm sm:text-base text-[#52635D] leading-relaxed mb-6">
                Monitor 7-day cognitive trends, manage reminders, receive early decline alerts & upload family photos.
              </p>
              <div className="flex items-center gap-2 text-[#C66B44] font-black text-sm">
                <span>View health dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </button>
        </div>

        {/* ── TRUST SIGNALS ROW ── */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm font-bold text-[#52635D] animate-slide-in-up-delay-2">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C66B44]" />
            AES-256 & DPDP Act 2023 Compliant
          </span>
          <span className="w-1 h-1 rounded-full bg-[#2D4739]/30 hidden sm:block" />
          <span className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[#6A9B96]" />
            6 North-East Regional Dialects
          </span>
          <span className="w-1 h-1 rounded-full bg-[#2D4739]/30 hidden sm:block" />
          <span className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#D4AF37]" />
            100% Offline Capable
          </span>
        </div>

        {/* Optional Demo Story CTA */}
        {onOpenDemoStory && (
          <div className="mt-8 flex justify-center animate-slide-in-up-delay-3">
            <button
              id="btn-hero-demo-story"
              onClick={() => {
                soundSynth.playGentleChime();
                onOpenDemoStory();
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-[#1E3A2F]/20 text-[#1E3A2F] font-bold text-sm hover:border-[#D4AF37] hover:shadow-md transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-[#C66B44]" />
              <span>Try Uncle Dipankar's Demo Story</span>
            </button>
          </div>
        )}
      </div>

      <CulturalPatternBorder variant="gamusa" className="mt-14" />
    </section>
  );
};
