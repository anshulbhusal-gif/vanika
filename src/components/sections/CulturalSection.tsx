import React, { useState } from 'react';
import { Volume2, Sparkles, MapPin, Globe, BookOpen, Music, Check } from 'lucide-react';
import { REGIONAL_LANGUAGES } from '../../data/culturalContent';
import { Language } from '../../types';
import { VoiceAssistant } from '../../utils/speech';
import { soundSynth } from '../../utils/audioSynth';

interface CulturalSectionProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const CulturalSection: React.FC<CulturalSectionProps> = ({
  currentLanguage,
  onSelectLanguage
}) => {
  const [playingId, setPlayingId] = useState<Language | null>(null);

  const handlePlayAudio = async (langId: Language, sampleText: string) => {
    soundSynth.playSoftClick();
    setPlayingId(langId);
    await VoiceAssistant.speak(sampleText, langId, 'slow');
    setPlayingId(null);
  };

  const selectedLang = REGIONAL_LANGUAGES.find(l => l.id === currentLanguage) || REGIONAL_LANGUAGES[0];

  return (
    <section className="py-12 sm:py-16 bg-[#FDFBF7]" id="section-culture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C66B44]/15 text-[#C66B44] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Made for the Northeast
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#1E3A2F] tracking-tight">
            Built around familiar memories.
          </h2>
          <p className="mt-3 text-lg sm:text-xl text-[#52635D] leading-relaxed">
            Language, culture and everyday experiences can make cognitive activities feel more familiar, comforting, and deeply meaningful.
          </p>
        </div>

        {/* 6 Regional Language Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {REGIONAL_LANGUAGES.map((lang) => {
            const isCurrent = currentLanguage === lang.id;
            const isPlaying = playingId === lang.id;

            return (
              <div
                key={lang.id}
                className={`bg-[#FFFFFF] border rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group ${
                  isCurrent ? 'border-[#2D4739] ring-2 ring-[#2D4739]/20' : 'border-[#2D4739]/15 hover:border-[#C66B44]'
                }`}
              >
                {/* Background Cultural Emblem Watermark */}
                <div className="absolute top-3 right-3 text-2xl opacity-80">
                  {lang.culturalEmblem.split(' ')[0]}
                </div>

                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C66B44]">
                      {lang.region}
                    </span>
                    {isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#2D4739] text-[#FDFBF7] text-[10px] font-bold">
                        Active Dialect
                      </span>
                    )}
                  </div>

                  {/* Native Script & Name */}
                  <div className="space-y-1">
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1E3A2F]">
                      {lang.nativeScript}
                    </h3>
                    <p className="text-sm font-bold text-[#52635D]">
                      {lang.name}
                    </p>
                  </div>

                  {/* Greeting Quote */}
                  <blockquote className="my-4 p-3 rounded-xl bg-[#F5EFE6] border-l-4 border-[#D4AF37] text-xs sm:text-sm text-[#2D4739] italic">
                    "{lang.greeting}"
                  </blockquote>

                  <p className="text-xs text-[#52635D] leading-relaxed mb-6">
                    {lang.description}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#2D4739]/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handlePlayAudio(lang.id, lang.audioSampleText)}
                    className="py-2.5 px-3.5 rounded-xl bg-[#2D4739] hover:bg-[#1E3A2F] text-[#FDFBF7] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title={`Listen to spoken ${lang.name} greeting`}
                  >
                    <Volume2 className={`w-3.5 h-3.5 text-[#D4AF37] ${isPlaying ? 'animate-bounce' : ''}`} />
                    <span>{isPlaying ? 'Playing...' : '🔊 Listen'}</span>
                  </button>

                  <button
                    onClick={() => {
                      soundSynth.playSoftClick();
                      onSelectLanguage(lang.id);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-[#D4AF37] text-[#1E3A2F] border-[#D4AF37] shadow-xs'
                        : 'bg-white text-[#2D4739] border-[#2D4739]/20 hover:bg-[#F5EFE6]'
                    }`}
                  >
                    {isCurrent ? 'Selected' : 'Use Language'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Regional Heritage Showcase Card */}
        <div className="bg-[#1E3A2F] text-[#FDFBF7] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                Active Focus: {selectedLang.region}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#FDFBF7]">
                Every dialect carries a feeling of home.
              </h3>

              <p className="text-sm sm:text-base text-[#EAE2D2] leading-relaxed">
                Whether recalling the morning aroma of steaming Lal Saah, tracing living root bridges in Meghalaya, or listening to the rhythmic beats of Rongali Bihu and Wangala harvests — Vanika wraps memory stimulation in deep cultural respect.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#2D4739] border border-[#D4AF37]/20 text-xs">
                  <span className="font-bold text-[#D4AF37] block">🌸 Traditional Weaves</span>
                  <span className="text-[#EAE2D2] text-[11px]">Muga silk, Puan, Aronai</span>
                </div>
                <div className="p-3 rounded-xl bg-[#2D4739] border border-[#D4AF37]/20 text-xs">
                  <span className="font-bold text-[#D4AF37] block">🪘 Folk Instruments</span>
                  <span className="text-[#EAE2D2] text-[11px]">Dhol, Pepa, Gogona, Flute</span>
                </div>
                <div className="p-3 rounded-xl bg-[#2D4739] border border-[#D4AF37]/20 text-xs">
                  <span className="font-bold text-[#D4AF37] block">🍵 Courtyard Flavors</span>
                  <span className="text-[#EAE2D2] text-[11px]">Manimuni, Til Pitha, Gur</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#2D4739] border border-[#D4AF37]/35 rounded-2xl p-6 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#D4AF37] text-[#1E3A2F] flex items-center justify-center text-3xl shadow-sm">
                🪶
              </div>
              <div>
                <h4 className="text-lg font-bold font-heading text-[#FDFBF7]">
                  Voice-First Non-Literate Care
                </h4>
                <p className="text-xs text-[#EAE2D2] mt-1 leading-relaxed">
                  For elders who do not read or write English, all prompts, instructions, and reminders are spoken clearly in their native regional mother tongue.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
