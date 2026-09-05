import React, { useState } from 'react';
import { ArrowLeft, ArrowUp, ArrowDown, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { BIHU_SEQUENCE_STEPS, TEA_PLUCKING_SEQUENCE_STEPS } from '../../data/culturalContent';
import { SequenceStep, Language } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { VoiceAssistant, speechEngine } from '../../utils/speech';
import { vanikaStorage } from '../../utils/storage';
import confetti from 'canvas-confetti';
import { GameVoiceAnswerButton } from '../common/GameVoiceAnswerButton';

interface SequenceGameProps {
  currentLanguage: Language;
  onBackToApp?: () => void;
}

function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const SequenceGame: React.FC<SequenceGameProps> = ({ currentLanguage, onBackToApp }) => {
  const [selectedTheme, setSelectedTheme] = useState<'bihu' | 'tea'>('bihu');

  const initialSteps = selectedTheme === 'bihu' ? BIHU_SEQUENCE_STEPS : TEA_PLUCKING_SEQUENCE_STEPS;
  const [steps, setSteps] = useState<SequenceStep[]>(() => {
    return fisherYatesShuffle(initialSteps);
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [checkedStatus, setCheckedStatus] = useState<boolean | null>(null);

  const handleSwitchTheme = (theme: 'bihu' | 'tea') => {
    soundSynth.playSoftClick();
    setSelectedTheme(theme);
    const newInitial = theme === 'bihu' ? BIHU_SEQUENCE_STEPS : TEA_PLUCKING_SEQUENCE_STEPS;
    setSteps(fisherYatesShuffle(newInitial));
    setIsCompleted(false);
    setCheckedStatus(null);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    soundSynth.playTraditionalDrum();
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;

    const updated = [...steps];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setSteps(updated);
    setCheckedStatus(null);
  };

  const handleVerify = () => {
    const isCorrect = steps.every((s, i) => s.stepNumber === i + 1);

    if (isCorrect) {
      soundSynth.playCelebration();
      setIsCompleted(true);
      setCheckedStatus(true);
      vanikaStorage.recordGameSession('sequence', 92, 5);

      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#1E3A2F', '#C06A44']
      });
      speechEngine.speak('Auspicious harmony! You have arranged the festival ritual in perfect order.', { language: currentLanguage });
    } else {
      soundSynth.playGentleChime();
      setCheckedStatus(false);
      speechEngine.speak('Let us reflect on the morning order once more. The dawn starts before the feast.', { language: currentLanguage });
    }
  };

  const handleReset = () => {
    soundSynth.playSoftClick();
    const curInitial = selectedTheme === 'bihu' ? BIHU_SEQUENCE_STEPS : TEA_PLUCKING_SEQUENCE_STEPS;
    setSteps(fisherYatesShuffle(curInitial));
    setIsCompleted(false);
    setCheckedStatus(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0C1A11] py-8 sm:py-12" id="view-game-sequence">
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
                <span className="text-2xl">🪘</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
                  Folk Ritual Sequencing
                </h2>
              </div>
              <p className="font-mono-label text-xs text-[#7B9E87] mt-0.5">
                ARRANGE RITUAL STEPS FROM DAWN TO EVENING CELEBRATION
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#F5EEE2] dark:bg-[#1A3328] p-1.5 rounded-full border border-[#2D4739]/15">
            <button
              onClick={() => handleSwitchTheme('bihu')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                selectedTheme === 'bihu'
                  ? 'bg-[#1E3A2F] text-[#D4AF37] font-bold shadow-xs'
                  : 'text-[#5A7265] dark:text-[#9DBFB0]'
              }`}
            >
              🌸 Bihu Morning
            </button>
            <button
              onClick={() => handleSwitchTheme('tea')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                selectedTheme === 'tea'
                  ? 'bg-[#1E3A2F] text-[#D4AF37] font-bold shadow-xs'
                  : 'text-[#5A7265] dark:text-[#9DBFB0]'
              }`}
            >
              🍃 Tea Harvest
            </button>
          </div>
        </div>

        {/* Workspace Card */}
        <div className="card-story bg-white dark:bg-[#162A1F] p-8 sm:p-10 border border-[#2D4739]/15 dark:border-[#D4AF37]/25 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono-label text-xs text-[#C06A44] uppercase tracking-widest">
              {selectedTheme === 'bihu' ? 'BIHU FESTIVAL SEQUENCE' : 'TEA PLUCKING CYCLE'}
            </span>
            <span className="text-xs text-[#5A7265] dark:text-[#9DBFB0]">
              Use arrows to arrange in order
            </span>
          </div>

          {/* Steps List */}
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={`card-story p-5 border transition-all flex items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-[#7B9E87]/15 border-[#7B9E87]'
                    : 'bg-[#FDFBF7] dark:bg-[#0F2219] border-[#2D4739]/15 dark:border-[#D4AF37]/20 hover:border-[#D4AF37]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1E3A2F] text-[#D4AF37] font-display font-bold flex items-center justify-center text-lg shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
                      {step.title}
                    </h4>
                    <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0] mt-0.5">
                      {step.description}
                    </p>
                    <span className="font-mono-label text-[10px] text-[#C06A44] mt-1 block">
                      🌿 {step.culturalNote}
                    </span>
                  </div>
                </div>

                {!isCompleted && (
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => moveStep(idx, 'up')}
                      disabled={idx === 0}
                      className="p-2 rounded-lg bg-white dark:bg-[#162A1F] border border-[#2D4739]/15 text-[#1A2F24] dark:text-[#F2EDE3] hover:border-[#D4AF37] disabled:opacity-25 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveStep(idx, 'down')}
                      disabled={idx === steps.length - 1}
                      className="p-2 rounded-lg bg-white dark:bg-[#162A1F] border border-[#2D4739]/15 text-[#1A2F24] dark:text-[#F2EDE3] hover:border-[#D4AF37] disabled:opacity-25 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Outcome Banners */}
          {checkedStatus === true && (
            <div className="mt-8 p-6 rounded-2xl bg-[#7B9E87]/15 border border-[#7B9E87] text-[#1A2F24] dark:text-[#F2EDE3] flex items-center gap-4 animate-slide-up">
              <CheckCircle2 className="w-8 h-8 text-[#7B9E87] shrink-0" />
              <div>
                <h4 className="font-display text-xl font-bold">Well Sequenced!</h4>
                <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0] mt-1">
                  You have woven the ritual together with clear procedural recall and harmony.
                </p>
              </div>
            </div>
          )}

          {checkedStatus === false && (
            <div className="mt-8 p-6 rounded-2xl bg-[#C06A44]/15 border border-[#C06A44] text-[#1A2F24] dark:text-[#F2EDE3] flex items-center gap-4 animate-slide-up">
              <Sparkles className="w-6 h-6 text-[#C06A44] shrink-0" />
              <div>
                <h4 className="font-display text-lg font-bold">Almost there!</h4>
                <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0] mt-1">
                  Think about what happens at first sunrise before the afternoon community feast.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-10 pt-6 border-t border-[#2D4739]/10 dark:border-[#D4AF37]/15 flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={handleReset}
              className="btn-ghost py-3 px-5 text-xs font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Shuffle Again</span>
            </button>

            <button
              onClick={handleVerify}
              className="btn-primary py-3.5 px-6"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Verify Sequence Harmony</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
