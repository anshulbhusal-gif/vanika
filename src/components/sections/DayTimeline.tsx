import React, { useState } from 'react';
import { Sun, Heart, Volume2, Music, Moon, Coffee, Sparkles, Smile } from 'lucide-react';
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
      title: 'Good Morning Greeting',
      tagline: 'Your day begins with a warm greeting and gentle reminder',
      symbol: '🌅',
      icon: Sun,
      color: 'bg-[#D9A441]',
      audioText: 'Good morning Raj! The sun is rising over the tea hills. Have a warm cup of red tea and take your green medicine tablet.',
      description: 'The AI companion offers an affectionate greeting in Assamese or English, reminding the elder of morning tea and medications.'
    },
    {
      time: '10:00 AM',
      title: 'Memory Game in Courtyard',
      tagline: "Let's recall some precious memories together",
      symbol: '🖼️',
      icon: Heart,
      color: 'bg-[#C87552]',
      audioText: 'Let us open our family photo album and remember our loved ones at the Bihu gathering.',
      description: 'A 5-minute photo recall session ("Who is this?") keeping episodic memory pathways active without creating fatigue.'
    },
    {
      time: '2:00 PM',
      title: 'Cultural Folklore & Sequence',
      tagline: 'Enjoy familiar stories, music, and traditions',
      symbol: '🪘',
      icon: Music,
      color: 'bg-[#7EA9A5]',
      audioText: 'Time to arrange the Bihu morning harvest steps and hear the cheerful Pepa rhythm.',
      description: 'Procedural sequencing puzzles around harvest rituals, tea plucking, and traditional handicrafts.'
    },
    {
      time: '5:00 PM',
      title: 'Relax, Breathe & Tend Garden',
      tagline: 'Take a calm break with soothing botanical growth',
      symbol: '🌿',
      icon: Coffee,
      color: 'bg-[#315C4C]',
      audioText: 'The evening lamps are ready. Let us take 3 deep gentle breaths and water the jasmine bush in our Memory Garden.',
      description: 'Diaphragmatic breathing accompanied by bamboo water droplets and garden flower bloom visualizers.'
    },
    {
      time: '8:00 PM',
      title: 'Daily Reflection & Rest',
      tagline: 'You did so well today. Rest peacefully.',
      symbol: '🌙',
      icon: Moon,
      color: 'bg-[#24483C]',
      audioText: 'You did so wonderfully today. May your sleep be sound and peaceful under the quiet hills.',
      description: 'A quiet affirmation and gentle evening lullaby tone to prevent sundowning anxiety and promote deep rest.'
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
    <section className="py-12 sm:py-16 bg-[#FDFBF7]" id="section-timeline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D4739]/10 text-[#1E3A2F] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Daily Rhythm
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#1E3A2F] tracking-tight">
            A day with Vanika
          </h2>
          <p className="mt-3 text-lg sm:text-xl text-[#52635D] leading-relaxed">
            Gentle routines woven throughout the day, providing structure, emotional calm, and joyful moments of memory.
          </p>
        </div>

        {/* Interactive Timeline Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {timelineSteps.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={step.time}
                onClick={() => handleStepClick(idx)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between shadow-2xs ${
                  isActive
                    ? 'bg-[#2D4739] text-[#FDFBF7] border-[#2D4739] shadow-sm scale-102 font-medium'
                    : 'bg-white border-[#2D4739]/15 hover:border-[#2D4739]/40 text-[#2D4739]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#D4AF37] text-[#1E3A2F]' : 'bg-[#F5EFE6] text-[#52635D]'
                  }`}>
                    {step.time}
                  </span>
                  <span className="text-xl">{step.symbol}</span>
                </div>
                <h4 className="font-heading font-bold text-sm sm:text-base leading-tight mt-1">
                  {step.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Selected Milestone Active Spotlight Card */}
        <div className="bg-[#FFFFFF] border border-[#2D4739]/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-4 text-center md:text-left flex flex-col items-center md:items-start">
              <div className={`w-20 h-20 rounded-2xl ${activeStep.color} text-white flex items-center justify-center text-4xl shadow-sm mb-4`}>
                {activeStep.symbol}
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C66B44]">
                {activeStep.time} Daily Routine
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1E3A2F] mt-1">
                {activeStep.title}
              </h3>
              <p className="text-base text-[#52635D] mt-2 leading-relaxed">
                {activeStep.tagline}
              </p>
            </div>

            <div className="md:col-span-8 bg-[#FDFBF7] p-6 rounded-2xl border border-[#2D4739]/15 space-y-4 shadow-2xs">
              <span className="text-xs font-bold text-[#2D4739] uppercase tracking-wide block">
                Spoken Voice Cue for Elder:
              </span>
              
              <blockquote className="text-base sm:text-lg text-[#2D4739] font-medium leading-relaxed italic bg-[#F5EFE6] p-4 rounded-xl border-l-4 border-[#2D4739]">
                "{activeStep.audioText}"
              </blockquote>

              <p className="text-xs sm:text-sm text-[#52635D] leading-relaxed">
                {activeStep.description}
              </p>

              <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                <button
                  onClick={() => handleHearStep(activeStep.audioText)}
                  className="py-3 px-5 rounded-xl bg-[#2D4739] hover:bg-[#1E3A2F] text-[#FDFBF7] font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>🔊 Hear This Daily Routine Cue</span>
                </button>

                <div className="text-xs font-bold text-[#52635D]">
                  Step {activeStepIndex + 1} of 5
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
