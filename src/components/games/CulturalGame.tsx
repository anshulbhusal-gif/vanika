import React, { useState } from 'react';
import { ArrowLeft, Volume2, Sparkles, CheckCircle2, Heart, Award } from 'lucide-react';
import { soundSynth } from '../../utils/audioSynth';
import { VoiceAssistant, speechEngine } from '../../utils/speech';
import { vanikaStorage } from '../../utils/storage';
import confetti from 'canvas-confetti';
import { Language } from '../../types';
import { GameVoiceAnswerButton } from '../common/GameVoiceAnswerButton';

interface CulturalGameProps {
  currentLanguage: Language;
  onBackToApp?: () => void;
}

interface HeritageItem {
  id: string;
  name: string;
  region: string;
  symbol: string;
  category: 'Instrument' | 'Festival' | 'Craft';
  question: string;
  options: string[];
  correctAnswer: string;
  lore: string;
}

const HERITAGE_ITEMS: HeritageItem[] = [
  {
    id: 'h-1',
    name: 'Pepa (Buffalo Horn Hornpipe)',
    region: 'Assam',
    symbol: '🎺',
    category: 'Instrument',
    question: 'Which instrument is crafted from buffalo horn and played during Rongali Bihu?',
    options: ['Pepa', 'Violin', 'Guitar', 'Harmonium'],
    correctAnswer: 'Pepa',
    lore: 'The Pepa produces a sharp, melodic tone that signals spring courtship and the awakening of nature in Assam.'
  },
  {
    id: 'h-2',
    name: 'Jappi (Traditional Sun Hat)',
    region: 'Brahmaputra Valley',
    symbol: '👒',
    category: 'Craft',
    question: 'What is the conical woven bamboo hat decorated with red wool used for respect and shade?',
    options: ['Jappi', 'Turbin', 'Cap', 'Beret'],
    correctAnswer: 'Jappi',
    lore: 'Used historically by farmers in open fields, the decorated Jappi is presented to honored guests as a mark of highest reverence.'
  },
  {
    id: 'h-3',
    name: 'Cheraw (Bamboo Dance)',
    region: 'Mizoram',
    symbol: '🎋',
    category: 'Festival',
    question: 'In which famous Mizo dance do performers step rhythmically between moving bamboo poles?',
    options: ['Cheraw', 'Kathak', 'Salsa', 'Bhangra'],
    correctAnswer: 'Cheraw',
    lore: 'Cheraw is celebrated during Chapchar Kut. The rhythmic clapping of bamboo poles requires community synchronization.'
  },
  {
    id: 'h-4',
    name: 'Brass Xorai (Offering Tray)',
    region: 'Assam',
    symbol: '🏆',
    category: 'Craft',
    question: 'Which bell-metal tray with a tripod stem is used to present Tamul-Paan and offer reverence?',
    options: ['Xorai', 'Plate', 'Cup', 'Tray'],
    correctAnswer: 'Xorai',
    lore: 'The Xorai is crafted by traditional artisans in Sarthebari and represents hospitality, blessings, and ancestral honor.'
  },
  {
    id: 'h-5',
    name: 'Living Root Bridge (Jingkieng Jri)',
    region: 'Meghalaya',
    symbol: '🌉',
    category: 'Craft',
    question: 'What bio-engineered bridges are shaped by guiding tree roots across mountain streams?',
    options: ['Living Root Bridge', 'Steel Bridge', 'Wooden Plank', 'Cable Stayed'],
    correctAnswer: 'Living Root Bridge',
    lore: 'Nurtured over decades by indigenous Khasi and Jaintia elders, living root bridges become stronger with age.'
  }
];

export const CulturalGame: React.FC<CulturalGameProps> = ({ currentLanguage, onBackToApp }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<boolean | null>(null);
  const [completedCount, setCompletedCount] = useState(0);

  const current = HERITAGE_ITEMS[index];

  const handleSelect = (opt: string) => {
    soundSynth.playSoftClick();
    setSelected(opt);

    if (opt === current.correctAnswer) {
      setStatus(true);

      const newCount = completedCount + 1;
      setCompletedCount(newCount);
      soundSynth.playCelebration();

      vanikaStorage.recordGameSession('cultural', 88 + newCount * 4, 4);

      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#C06A44', '#1E3A2F']
      });
      speechEngine.speak(`Wonderfully answered! ${current.name} is a treasure of ${current.region}.`, { language: currentLanguage });
    } else {
      setStatus(false);
      soundSynth.playGentleChime();
      speechEngine.speak(`Let us explore this folklore once more.`, { language: currentLanguage });
    }
  };

  const handleNext = () => {
    soundSynth.playSoftClick();
    setSelected(null);
    setStatus(null);
    setIndex((prev) => (prev + 1) % HERITAGE_ITEMS.length);
  };

  const handlePlayAudio = () => {
    soundSynth.playTraditionalDrum();
    VoiceAssistant.speak(`${current.question} The clue relates to ${current.region}.`, currentLanguage, 'slow');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0C1A11] py-8 sm:py-12" id="view-game-cultural">
      <div className="section-max max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#2D4739]/15 dark:border-[#D4AF37]/20">
          <div className="flex items-center gap-4">
            {onBackToApp && (
              <button
                onClick={() => {
                  soundSynth.playSoftClick();
                  onBackToApp();
                }}
                className="w-10 h-10 rounded-xl bg-white dark:bg-[#162A1F] border border-[#2D4739]/15 dark:border-[#D4AF37]/25 text-[#1A2F24] dark:text-[#F2EDE3] flex items-center justify-center cursor-pointer hover:border-[#D4AF37]"
                title="Return to Courtyard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎋</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
                  Cultural Wisdom & Folklore
                </h2>
              </div>
              <p className="font-mono-label text-xs text-[#7B9E87] mt-0.5">
                REDISCOVER TRADITIONAL CRAFTS, INSTRUMENTS & HARVEST STORIES
              </p>
            </div>
          </div>

          <div className="bg-[#1E3A2F] text-[#D4AF37] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Wisdom Found: {completedCount}</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="card-story bg-white dark:bg-[#162A1F] p-8 sm:p-10 border border-[#2D4739]/15 dark:border-[#D4AF37]/25 shadow-xl">
          <div className="card-story bg-[#FDFBF7] dark:bg-[#0F2219] p-6 sm:p-8 border border-[#2D4739]/10 dark:border-[#D4AF37]/20 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono-label text-xs text-[#C06A44] uppercase tracking-widest">
                {current.category} • {current.region}
              </span>
              <span className="text-4xl">{current.symbol}</span>
            </div>

            <h3 className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] mb-5 leading-snug">
              {current.question}
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePlayAudio}
                className="btn-primary py-3 px-5 text-xs"
              >
                <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Hear Clue Spoken</span>
              </button>

              <GameVoiceAnswerButton
                options={current.options}
                onOptionMatched={(matchedOption) => handleSelect(matchedOption)}
                currentLanguage={currentLanguage}
                promptMessage={`Which item is the answer? ${current.options.join(', ')}`}
                disabled={selected !== null && status === true}
                label="Speak Answer"
              />
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {current.options.map((opt) => {
              const isSel = selected === opt;
              const isRight = opt === current.correctAnswer;

              let btnStyle = 'bg-[#FDFBF7] dark:bg-[#0F2219] text-[#1A2F24] dark:text-[#F2EDE3] border-[#2D4739]/15 dark:border-[#D4AF37]/20 hover:border-[#D4AF37]';
              if (isSel) {
                if (isRight) {
                  btnStyle = 'bg-[#1E3A2F] text-white border-[#D4AF37] font-bold shadow-md';
                } else {
                  btnStyle = 'bg-[#C06A44]/15 text-[#C06A44] border-[#C06A44] font-bold';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`btn-elder py-4 px-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-left ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isSel && isRight && <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />}
                </button>
              );
            })}
          </div>

          {/* Folklore Story Card */}
          {status === true && (
            <div className="p-6 rounded-2xl bg-[#7B9E87]/15 border border-[#7B9E87] text-[#1A2F24] dark:text-[#F2EDE3] animate-slide-up space-y-2 mb-8">
              <h4 className="font-display text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#7B9E87]" />
                <span>Folk Heritage: {current.name}</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#5A7265] dark:text-[#9DBFB0] leading-relaxed">
                {current.lore}
              </p>
            </div>
          )}

          {/* Footer Action */}
          <div className="flex justify-end pt-6 border-t border-[#2D4739]/10 dark:border-[#D4AF37]/15">
            <button
              onClick={handleNext}
              className="btn-primary py-3.5 px-6"
            >
              <span>Next Folklore</span>
              <span>→</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
