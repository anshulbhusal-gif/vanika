import React, { useState } from 'react';
import { Volume2, ShieldCheck, ArrowRight, Play, Cpu, Globe2, Sparkles, Activity, Heart, Brain, ChevronRight, Mic, CheckCircle2 } from 'lucide-react';
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
  const [activeDialectPreview, setActiveDialectPreview] = useState<'Assamese' | 'Manipuri' | 'Khasi' | 'English'>('Assamese');
  const t = getTranslation(currentLanguage as Language);

  const handleHearWelcome = async () => {
    soundSynth.playGentleChime();
    setIsPlayingAudio(true);
    await VoiceAssistant.speak(
      "Namaskar and warm welcome to Vanika. Experience AI-powered cognitive care and peaceful memory stimulation in your own language.",
      currentLanguage as Language,
      'slow'
    );
    setIsPlayingAudio(false);
  };

  return (
    <section
      className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#09120C] dark:bg-[#070E09] text-[#FDFBF7] pt-12 pb-20"
      id="section-hero"
    >
      {/* Ambient Radial Mesh Background (Outcrowd Style) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#10B981]/15 via-[#059669]/08 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-32 right-10 w-96 h-96 bg-[#D4AF37]/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#047857]/15 blur-3xl pointer-events-none rounded-full" />

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="section-max relative z-10 my-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Eyebrow Capsule Badge */}
        <div className="flex flex-col items-center text-center animate-slide-up">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/08 backdrop-blur-md border border-white/15 text-[#E2E8F0] text-xs font-semibold uppercase tracking-widest mb-6 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span className="text-[#10B981] font-bold">VANIKA AI PLATFORM</span>
            <span className="opacity-40">•</span>
            <span>COGNITIVE WELLNESS FOR NORTH EAST INDIA</span>
          </div>

          {/* Main Headline — Outcrowd UXBoost Style */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl text-white font-extrabold tracking-tight leading-[1.08] max-w-5xl">
            AI-Powered Cognitive Care <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#FBBF24] bg-clip-text text-transparent">
              Rooted in Culture & Memory.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-[#94A3B8] max-w-2xl text-center leading-relaxed">
            A calm, non-clinical digital courtyard for elders and caregivers across North Eastern India.
            Multi-dialect voice games, personal photo memories, and AI companion <span className="text-[#FBBF24] font-semibold">Oja</span>.
          </p>

          {/* Dual Action CTA Buttons (UXBoost Style) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {/* Primary Action Button */}
            <button
              id="btn-hero-elder-courtyard"
              onClick={() => {
                soundSynth.playSoftClick();
                onNavigate('patient-app');
              }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#059669] via-[#10B981] to-[#047857] hover:from-[#047857] hover:to-[#059669] text-white font-bold text-base shadow-lg shadow-[#10B981]/25 hover:shadow-xl hover:shadow-[#10B981]/40 hover:-translate-y-0.5 transition-all cursor-pointer border border-white/20"
            >
              <span>Enter Elder Courtyard</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Secondary Action Button */}
            <button
              id="btn-hero-caregiver-vault"
              onClick={() => {
                soundSynth.playSoftClick();
                onNavigate('caregiver-portal');
              }}
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-white/08 hover:bg-white/15 backdrop-blur-md text-white font-bold text-base border border-white/15 hover:border-white/30 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 text-[#FBBF24]" />
              <span>Caregiver Vault</span>
            </button>

            {/* Voice Audio Welcome Button */}
            <button
              id="btn-hero-hear-welcome"
              onClick={handleHearWelcome}
              className="inline-flex items-center gap-2 px-5 py-4 rounded-full bg-white/05 hover:bg-white/10 backdrop-blur-md text-[#E2E8F0] text-sm font-semibold border border-white/10 hover:border-[#10B981]/40 transition-all cursor-pointer"
            >
              <Volume2 className={`w-4 h-4 text-[#10B981] ${isPlayingAudio ? 'animate-pulse' : ''}`} />
              <span>{isPlayingAudio ? 'Speaking...' : 'Listen in Dialect'}</span>
            </button>
          </div>
        </div>

        {/* ── FLOATING UI DASHBOARD PREVIEW CARD (3D Perspective UXBoost Hero Mockup) ── */}
        <div className="mt-14 max-w-5xl mx-auto relative perspective-1200 animate-slide-up-d2">
          {/* Glowing Backlighting for Floating Card */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#10B981]/30 via-[#FBBF24]/20 to-[#047857]/30 blur-xl opacity-70" />

          {/* Main Floating 3D Glass Container */}
          <div className="relative rounded-3xl bg-[#0F1E17]/90 backdrop-blur-xl border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden preserve-3d card-3d-tilt floating-3d-element">
            
            {/* Top Mockup Header Bar */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10 depth-layer-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                </div>
                <span className="text-xs font-mono text-[#94A3B8] ml-2 hidden sm:inline">vanika.app / live-courtyard-v2</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  Live Sync
                </span>
                <span className="px-3 py-1 rounded-full bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30 text-xs font-semibold">
                  DPDP Act 2023 Compliant
                </span>
              </div>
            </div>

            {/* Grid Preview Tiles Inside 3D Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 preserve-3d">
              
              {/* Tile 1: Cognitive Index Ring Widget */}
              <div className="rounded-2xl bg-white/05 border border-white/10 p-5 flex flex-col justify-between hover:border-[#10B981]/40 transition-all preserve-3d depth-layer-2 hover:translate-z-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#10B981]/20 text-[#10B981]">
                      <Brain className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-white">Cognitive Index</span>
                  </div>
                  <span className="text-xs text-[#10B981] font-bold">+12% this week</span>
                </div>
                <div className="my-6 flex items-center justify-center relative depth-layer-3">
                  <div className="w-24 h-24 rounded-full border-8 border-white/10 border-t-[#10B981] border-r-[#10B981] flex items-center justify-center rotate-45 shadow-lg shadow-[#10B981]/20">
                    <div className="-rotate-45 text-center">
                      <span className="text-2xl font-extrabold text-white">92</span>
                      <span className="text-[10px] block text-[#94A3B8]">Optimum</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#94A3B8] text-center">Gentle daily recall & pattern stimulation active</p>
              </div>

              {/* Tile 2: Oja AI Companion Voice Wave */}
              <div className="rounded-2xl bg-gradient-to-br from-[#064E3B]/40 to-[#022C22]/60 border border-[#10B981]/30 p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FBBF24] animate-ping" />
                    <span className="text-sm font-bold text-white">Oja Voice AI</span>
                  </div>
                  <span className="text-xs text-[#FBBF24] font-semibold">Assamese / Bodo</span>
                </div>

                {/* Simulated Audio Waveform */}
                <div className="my-4 p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-6 bg-[#10B981] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-10 bg-[#34D399] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-12 bg-[#FBBF24] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <div className="w-1.5 h-8 bg-[#34D399] rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                  <div className="w-1.5 h-5 bg-[#10B981] rounded-full animate-bounce" style={{ animationDelay: '600ms' }} />
                </div>
                <p className="text-xs text-[#D1D5DB] italic">"Apunar puwar chah khuwa hol ne, Kaka?"</p>
              </div>

              {/* Tile 3: Today's Routine Rhythms */}
              <div className="rounded-2xl bg-white/05 border border-white/10 p-5 flex flex-col justify-between hover:border-[#FBBF24]/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#FBBF24]/20 text-[#FBBF24]">
                      <Activity className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-white">Daily Routine</span>
                  </div>
                  <span className="text-xs text-[#FBBF24] font-bold">3 of 4 Done</span>
                </div>
                
                <div className="my-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/05">
                    <span className="flex items-center gap-2 text-white"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Morning Tea & News</span>
                    <span className="text-[#94A3B8]">08:30 AM</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/05">
                    <span className="flex items-center gap-2 text-white"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Memory Match Game</span>
                    <span className="text-[#94A3B8]">11:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30">
                    <span className="flex items-center gap-2 text-[#10B981] font-bold"><Sparkles className="w-4 h-4" /> Evening Story Hour</span>
                    <span className="text-[#10B981] font-bold">05:00 PM</span>
                  </div>
                </div>

                <div className="text-xs text-[#94A3B8] flex items-center justify-between">
                  <span>Caregiver Notified</span>
                  <span className="text-[#10B981] font-semibold">Active</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Horizontal Social Proof & Trust Strip (Outcrowd Ticker) */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-6 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>DPDP Act 2023 Private Vault Protection</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <Globe2 className="w-4 h-4 text-[#FBBF24]" />
            <span>6 North-East Regional Dialects</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <Cpu className="w-4 h-4 text-[#10B981]" />
            <span>Offline Local-First PWA Mode</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <Heart className="w-4 h-4 text-[#EF4444]" />
            <span>Trusted by 10,000+ Families across Assam, Manipur & NE India</span>
          </div>
        </div>

        {/* Demo Interactive Story Quick-Launcher */}
        {onOpenDemoStory && (
          <div className="mt-8 flex justify-center animate-slide-up-d4">
            <button
              id="btn-hero-demo-story"
              onClick={() => {
                soundSynth.playGentleChime();
                onOpenDemoStory();
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all cursor-pointer hover:border-[#10B981]"
            >
              <Play className="w-4 h-4 text-[#10B981] fill-current" />
              <span>Launch Interactive Demo: Uncle Dipankar's Memory Story</span>
            </button>
          </div>
        )}

      </div>

      {/* Cultural Motif Accent Border */}
      <CulturalPatternBorder variant="gamusa" className="mt-auto opacity-60" />
    </section>
  );
};

