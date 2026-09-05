import React, { useState } from 'react';
import { Volume2, Sparkles, Sun, Heart, Music, Coffee, Moon } from 'lucide-react';
import { soundSynth } from '../../utils/audioSynth';
import { VoiceAssistant } from '../../utils/speech';
import { Language } from '../../types';

interface DayTimelineProps {
  currentLanguage: Language;
}

export const DayTimeline: React.FC<DayTimelineProps> = ({ currentLanguage }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const timelineSteps = [
    {
      time: '7:30 AM',
      title: 'Morning Greeting',
      tagline: 'A warm greeting and gentle morning routine prompt',
      symbol: '🌅',
      icon: Sun,
      color: 'bg-[#D4AF37]',
      audioText: 'Good morning! The sun is rising over the tea hills. Have a warm cup of red tea and take your green tablet.',
      description: 'The AI companion offers an affectionate morning greeting in your mother tongue, softly suggesting morning tea and medication.'
    },
    {
      time: '10:00 AM',
      title: 'Courtyard Memory',
      tagline: "Let's recall precious moments together",
      symbol: '🖼️',
      icon: Heart,
      color: 'bg-[#C06A44]',
      audioText: 'Let us open our family photo album and remember our loved ones at the Bihu gathering.',
      description: 'A 5-minute photo recall activity keeping episodic memory pathways active without creating cognitive fatigue.'
    },
    {
      time: '2:00 PM',
      title: 'Folklore & Sequence',
      tagline: 'Familiar stories, music, and harvest rhythms',
      symbol: '🪘',
      icon: Music,
      color: 'bg-[#7B9E87]',
      audioText: 'Time to arrange the Bihu morning harvest steps and hear the cheerful Pepa rhythm.',
      description: 'Procedural sequencing puzzles structured around traditional harvest rituals, tea plucking, and handicrafts.'
    },
    {
      time: '5:00 PM',
      title: 'Evening Rest & Garden',
      tagline: 'A calm break with soothing garden growth',
      symbol: '🌿',
      icon: Coffee,
      color: 'bg-[#3D5A4E]',
      audioText: 'The evening lamps are lit. Let us take 3 deep gentle breaths and tend the jasmine in our Memory Garden.',
      description: 'Gentle diaphragmatic breathing paired with peaceful bamboo water droplets and garden visualizers.'
    },
    {
      time: '8:00 PM',
      title: 'Night Reflection',
      tagline: 'You did wonderfully today. Rest peacefully.',
      symbol: '🌙',
      icon: Moon,
      color: 'bg-[#1E3A2F]',
      audioText: 'You did so wonderfully today. May your sleep be sound and peaceful under the quiet hills.',
      description: 'A quiet affirmation and peaceful evening audio tone to prevent sundowning anxiety and promote rest.'
    }
  ];

  const handleStepClick = (index: number) => {
    soundSynth.playSoftClick();
    setActiveStepIndex(index);
  };

  const handleHearStep = (text: string) => {
    soundSynth.playGentleChime();
    VoiceAssistant.speak(text, currentLanguage, 'slow');
  };

  const activeStep = timelineSteps[activeStepIndex];

  return (
    <section className="section-breathing bg-[#FDFBF7] dark:bg-[#0C1A11]" id="section-timeline">
      <div className="section-max">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A2F]/10 dark:bg-[#D4AF37]/15 text-[#1E3A2F] dark:text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            DAILY RHYTHM & STRUCTURE
          </div>
          <h2 className="font-display text-display-lg text-[#1A2F24] dark:text-[#F2EDE3]">
            A day with Vanika.
          </h2>
          <p className="mt-4 prose-elder text-[#5A7265] dark:text-[#9DBFB0] leading-relaxed">
            Gentle routines woven throughout the day, providing comforting structure, emotional calm, and joyful moments of memory.
          </p>
        </div>

        {/* Timeline Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {timelineSteps.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={step.time}
                onClick={() => handleStepClick(idx)}
                className={`card-story p-5 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#1E3A2F] text-[#FDFBF7] border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/30'
                    : 'bg-white dark:bg-[#162A1F] text-[#1A2F24] dark:text-[#F2EDE3] border-[#2D4739]/15 dark:border-[#D4AF37]/20 hover:border-[#D4AF37]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-mono-label text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#D4AF37] text-[#1E3A2F] font-bold' : 'bg-[#F5EEE2] dark:bg-[#1A3328] text-[#5A7265] dark:text-[#9DBFB0]'
                  }`}>
                    {step.time}
                  </span>
                  <span className="text-xl">{step.symbol}</span>
                </div>
                <h4 className="font-display text-lg font-bold leading-tight mt-1">
                  {step.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase */}
        <div className="card-story bg-white dark:bg-[#162A1F] p-8 sm:p-12 border border-[#2D4739]/15 dark:border-[#D4AF37]/25 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-4 text-center md:text-left flex flex-col items-center md:items-start">
              <div className={`w-20 h-20 rounded-3xl ${activeStep.color} text-white flex items-center justify-center text-4xl shadow-md mb-4`}>
                {activeStep.symbol}
              </div>
              <span className="font-mono-label text-xs text-[#C06A44] tracking-widest uppercase">
                {activeStep.time} MOMENT
              </span>
              <h3 className="font-display text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] mt-1">
                {activeStep.title}
              </h3>
              <p className="text-sm text-[#5A7265] dark:text-[#9DBFB0] mt-2 leading-relaxed">
                {activeStep.tagline}
              </p>
            </div>

            <div className="md:col-span-8 bg-[#FDFBF7] dark:bg-[#0F2219] p-7 rounded-3xl border border-[#2D4739]/10 dark:border-[#D4AF37]/20 space-y-5">
              <span className="font-mono-label text-[11px] text-[#7B9E87] tracking-widest uppercase block">
                SPOKEN VOICE CUE FOR ELDER:
              </span>
              
              <blockquote className="text-base sm:text-lg text-[#1A2F24] dark:text-[#F2EDE3] font-medium leading-relaxed italic bg-[#F5EEE2] dark:bg-[#1A3328] p-5 rounded-2xl border-l-4 border-[#D4AF37]">
                "{activeStep.audioText}"
              </blockquote>

              <p className="text-xs sm:text-sm text-[#5A7265] dark:text-[#9DBFB0] leading-relaxed">
                {activeStep.description}
              </p>

              <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
                <button
                  onClick={() => handleHearStep(activeStep.audioText)}
                  className="btn-primary"
                >
                  <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Hear Daily Routine Cue</span>
                </button>

                <div className="font-mono-label text-xs text-[#5A7265] dark:text-[#9DBFB0]">
                  STEP {activeStepIndex + 1} OF 5
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
