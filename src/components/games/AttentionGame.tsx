import React, { useState } from 'react';
import { ArrowLeft, Eye, Sparkles, CheckCircle2, Lightbulb } from 'lucide-react';
import { soundSynth } from '../../utils/audioSynth';
import { speechEngine } from '../../utils/speech';
import { vanikaStorage } from '../../utils/storage';
import confetti from 'canvas-confetti';
import { Language } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { GameVoiceAnswerButton } from '../common/GameVoiceAnswerButton';

interface AttentionGameProps {
  currentLanguage: Language;
  onBackToApp?: () => void;
}

interface DifferenceItem {
  id: string;
  name: string;
  hint: string;
  xPercent: number;
  yPercent: number;
  found: boolean;
}

export const AttentionGame: React.FC<AttentionGameProps> = ({ currentLanguage, onBackToApp }) => {
  const [differences, setDifferences] = useState<DifferenceItem[]>([
    {
      id: 'd-1',
      name: 'Floating Riverboat on the Brahmaputra',
      hint: 'Look near the tranquil blue river curve on the right bank.',
      xPercent: 78,
      yPercent: 35,
      found: false
    },
    {
      id: 'd-2',
      name: 'Blooming Kopou Orchid in Tree Branch',
      hint: 'Look up in the lush green shade canopy above the tea rows.',
      xPercent: 30,
      yPercent: 18,
      found: false
    },
    {
      id: 'd-3',
      name: 'Brass Kettle on the Courtyard Table',
      hint: 'Look down near the steaming morning Lal Saah table.',
      xPercent: 48,
      yPercent: 80,
      found: false
    },
    {
      id: 'd-4',
      name: 'Red Silk Scarf on the Woven Basket',
      hint: 'Look closely at the tea basket resting by the hill steps.',
      xPercent: 20,
      yPercent: 65,
      found: false
    }
  ]);

  const [activeHint, setActiveHint] = useState<string | null>(null);

  const foundCount = differences.filter(d => d.found).length;
  const isAllFound = foundCount === differences.length;

  const handleSpotDifference = (id: string) => {
    const target = differences.find(d => d.id === id);
    if (!target || target.found) return;

    soundSynth.playWaterDrop();
    const updated = differences.map(d => (d.id === id ? { ...d, found: true } : d));
    setDifferences(updated);

    const newFoundCount = updated.filter(d => d.found).length;
    vanikaStorage.recordGameSession('attention', 75 + newFoundCount * 6, 3);

    if (newFoundCount === differences.length) {
      soundSynth.playCelebration();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1E3A2F', '#D4AF37', '#7B9E87']
      });
      speechEngine.speak('Splendid observation! Your eyes are as sharp as clear river water.', { language: currentLanguage });
    } else {
      speechEngine.speak(`Well spotted! You found the ${target.name}.`, { language: currentLanguage });
    }
  };

  const handleShowHint = () => {
    const unFound = differences.find(d => !d.found);
    if (unFound) {
      soundSynth.playSoftClick();
      setActiveHint(unFound.hint);
      speechEngine.speak(unFound.hint, {
        language: currentLanguage,
        rate: 0.85,
        onEnd: () => setActiveHint(null)
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0C1A11] py-8 sm:py-12" id="view-game-attention">
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
                <span className="text-2xl">👀</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
                  Tea Garden Visual Scan
                </h2>
              </div>
              <p className="font-mono-label text-xs text-[#7B9E87] mt-0.5">
                SPOT SUBTLE LANDSCAPE DIFFERENCES IN MAJULI & TEA HILLS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <GameVoiceAnswerButton
              options={differences.map((d) => d.name)}
              onOptionMatched={(matchedOption) => {
                const matched = differences.find((d) => d.name.toLowerCase() === matchedOption.toLowerCase());
                if (matched) {
                  handleSpotDifference(matched.id);
                }
              }}
              currentLanguage={currentLanguage}
              promptMessage="Speak the item name you see in the photo"
              disabled={isAllFound}
              label="Speak Item"
            />

            <div className="bg-[#1E3A2F] text-[#D4AF37] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Found: {foundCount} of {differences.length}</span>
            </div>
          </div>
        </div>

        {/* Main Board */}
        <div className="card-story bg-white dark:bg-[#162A1F] p-8 sm:p-10 border border-[#2D4739]/15 dark:border-[#D4AF37]/25 shadow-xl">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-[#2D4739]/15 dark:border-[#D4AF37]/20 bg-[#F5EEE2] dark:bg-[#1A3328]">
            <SafeImage
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
              alt="Tranquil North Eastern Tea Garden Scene"
              className="w-full h-72 sm:h-96 opacity-90"
            />

            {/* Hotspots */}
            {differences.map((diff) => (
              <button
                key={diff.id}
                onClick={() => handleSpotDifference(diff.id)}
                style={{ top: `${diff.yPercent}%`, left: `${diff.xPercent}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  diff.found
                    ? 'bg-[#1E3A2F] text-[#D4AF37] border-2 border-[#D4AF37] shadow-lg scale-110'
                    : 'bg-[#D4AF37] text-[#1E3A2F] hover:scale-125 animate-pulse shadow-md font-bold'
                }`}
                title={diff.found ? diff.name : 'Click to inspect'}
              >
                {diff.found ? <CheckCircle2 className="w-5 h-5" /> : <span>🔍</span>}
              </button>
            ))}

            {/* Hint Banner */}
            {activeHint && (
              <div className="absolute bottom-4 left-4 right-4 bg-[#1E3A2F]/95 text-[#FDFBF7] p-4 rounded-2xl text-center text-xs font-semibold shadow-xl border border-[#D4AF37]/30 flex items-center justify-center gap-2 animate-slide-up">
                <Lightbulb className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{activeHint}</span>
              </div>
            )}
          </div>

          {/* Checklist */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
                Items to Discover in the Landscape:
              </h3>
              <button
                onClick={handleShowHint}
                disabled={isAllFound}
                className="btn-ghost py-2 px-4 text-xs font-semibold"
              >
                <Lightbulb className="w-4 h-4 text-[#D4AF37]" />
                <span>Need a hint?</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {differences.map((diff) => (
                <div
                  key={diff.id}
                  onClick={() => handleSpotDifference(diff.id)}
                  className={`card-story p-4 flex items-center justify-between cursor-pointer border transition-all ${
                    diff.found
                      ? 'bg-[#7B9E87]/15 border-[#7B9E87] text-[#1A2F24] dark:text-[#F2EDE3]'
                      : 'bg-[#FDFBF7] dark:bg-[#0F2219] border-[#2D4739]/15 dark:border-[#D4AF37]/20 hover:border-[#D4AF37]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      diff.found ? 'bg-[#1E3A2F] text-[#D4AF37]' : 'bg-[#F5EEE2] dark:bg-[#1A3328] text-[#5A7265]'
                    }`}>
                      {diff.found ? '✓' : '•'}
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
                        {diff.name}
                      </h4>
                      <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0] mt-0.5">{diff.hint}</p>
                    </div>
                  </div>

                  {diff.found && (
                    <span className="font-mono-label text-[10px] text-[#7B9E87] font-bold uppercase">
                      Found
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Completion Banner */}
          {isAllFound && (
            <div className="mt-8 p-6 rounded-2xl bg-[#7B9E87]/15 border border-[#7B9E87] text-[#1A2F24] dark:text-[#F2EDE3] flex items-center gap-4 animate-slide-up">
              <CheckCircle2 className="w-8 h-8 text-[#7B9E87] shrink-0" />
              <div>
                <h4 className="font-display text-xl font-bold">Peaceful Clarity!</h4>
                <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0] mt-1">
                  You have spotted all 4 elements in the tea landscape with calm focus.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
