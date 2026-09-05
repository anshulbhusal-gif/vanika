import React, { useState } from 'react';
import { Volume2, Sparkles, MapPin } from 'lucide-react';
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
    <section className="section-breathing bg-[#FDFBF7] dark:bg-[#0C1A11]" id="section-culture">
      <div className="section-max">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C06A44]/12 text-[#C06A44] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            NORTHEAST REGIONAL HERITAGE
          </div>
          <h2 className="font-display text-display-lg text-[#1A2F24] dark:text-[#F2EDE3]">
            Built around familiar, comforting memories.
          </h2>
          <p className="mt-4 prose-elder text-[#5A7265] dark:text-[#9DBFB0] leading-relaxed">
            Language, local traditions, and everyday courtyard moments make cognitive activities feel familiar, deeply meaningful, and non-stigmatizing.
          </p>
        </div>

        {/* 6 Regional Languages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {REGIONAL_LANGUAGES.map((lang) => {
            const isCurrent = currentLanguage === lang.id;
            const isPlaying = playingId === lang.id;

            return (
              <div
                key={lang.id}
                className={`card-story p-7 flex flex-col justify-between transition-all group ${
                  isCurrent
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 bg-white dark:bg-[#162A1F]'
                    : 'bg-white dark:bg-[#162A1F] hover:border-[#D4AF37]/60'
                }`}
              >
                {/* Background Cultural Emblem Watermark */}
                <div className="absolute top-4 right-4 text-3xl opacity-60">
                  {lang.culturalEmblem.split(' ')[0]}
                </div>

                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono-label text-[10px] text-[#C06A44] tracking-widest uppercase">
                      {lang.region}
                    </span>
                    {isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1E3A2F] text-[#D4AF37] text-[10px] font-bold">
                        Active Dialect
                      </span>
                    )}
                  </div>

                  {/* Native Script & Name */}
                  <div className="space-y-1">
                    <h3 className="font-display text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
                      {lang.nativeScript}
                    </h3>
                    <p className="text-sm font-semibold text-[#5A7265] dark:text-[#9DBFB0]">
                      {lang.name}
                    </p>
                  </div>

                  {/* Greeting Quote */}
                  <blockquote className="my-5 p-3.5 rounded-2xl bg-[#F5EEE2] dark:bg-[#1A3328] border-l-4 border-[#D4AF37] text-xs text-[#1A2F24] dark:text-[#F2EDE3] italic">
                    "{lang.greeting}"
                  </blockquote>

                  <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0] leading-relaxed mb-6">
                    {lang.description}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-[#2D4739]/10 dark:border-[#D4AF37]/15 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handlePlayAudio(lang.id, lang.audioSampleText)}
                    className="py-2 px-3.5 rounded-full bg-[#1E3A2F] hover:bg-[#2D4739] text-[#FDFBF7] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title={`Listen to spoken ${lang.name} greeting`}
                  >
                    <Volume2 className={`w-3.5 h-3.5 text-[#D4AF37] ${isPlaying ? 'animate-bounce' : ''}`} />
                    <span>{isPlaying ? 'Speaking...' : 'Listen'}</span>
                  </button>

                  <button
                    onClick={() => {
                      soundSynth.playSoftClick();
                      onSelectLanguage(lang.id);
                    }}
                    className={`py-2 px-3.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#D4AF37] text-[#1E3A2F] border-[#D4AF37] font-bold'
                        : 'bg-transparent text-[#1A2F24] dark:text-[#F2EDE3] border-[#2D4739]/20 dark:border-[#D4AF37]/30 hover:border-[#D4AF37]'
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
        <div className="card-story bg-[#1E3A2F] text-[#FDFBF7] p-8 sm:p-12 border border-[#D4AF37]/35 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest">
                <MapPin className="w-3.5 h-3.5" />
                Active Focus: {selectedLang.region}
              </div>

              <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#FDFBF7] leading-snug">
                Every dialect carries a feeling of home.
              </h3>

              <p className="text-sm sm:text-base text-[#C8D8CF] leading-relaxed">
                Whether recalling the morning aroma of steaming Lal Saah, tracing living root bridges in Meghalaya, or listening to the rhythmic beats of Rongali Bihu — Vanika wraps memory stimulation in deep cultural respect.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                <div className="p-4 rounded-2xl bg-[#2D4739] border border-[#D4AF37]/20 text-xs">
                  <span className="font-bold text-[#D4AF37] block mb-1">🌸 Traditional Weaves</span>
                  <span className="text-[#C8D8CF] text-[11px]">Muga silk, Puan, Aronai</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#2D4739] border border-[#D4AF37]/20 text-xs">
                  <span className="font-bold text-[#D4AF37] block mb-1">🪘 Folk Rhythms</span>
                  <span className="text-[#C8D8CF] text-[11px]">Dhol, Pepa, Gogona, Flute</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#2D4739] border border-[#D4AF37]/20 text-xs">
                  <span className="font-bold text-[#D4AF37] block mb-1">🍵 Courtyard Flavors</span>
                  <span className="text-[#C8D8CF] text-[11px]">Manimuni, Til Pitha, Gur</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#2D4739] border border-[#D4AF37]/30 rounded-3xl p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center text-3xl">
                🪶
              </div>
              <div>
                <h4 className="font-display text-xl font-bold text-[#FDFBF7]">
                  Voice-First Non-Literate Care
                </h4>
                <p className="text-xs text-[#C8D8CF] mt-2 leading-relaxed">
                  For elders who do not read or write English, all prompts, instructions, and reminders are spoken clearly in their native mother tongue.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
