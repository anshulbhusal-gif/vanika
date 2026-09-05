import React, { useState, useEffect } from 'react';
import { Volume2, Heart, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { VoiceAssistant } from '../../utils/speech';
import { speechEngine } from '../../utils/speech';
import { soundSynth } from '../../utils/audioSynth';
import { vanikaStorage } from '../../utils/storage';
import confetti from 'canvas-confetti';
import { Language, MemoryPhotoItem } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { GameVoiceAnswerButton } from '../common/GameVoiceAnswerButton';

interface MemoryGameProps {
  currentLanguage: Language;
  onBackToApp?: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ currentLanguage, onBackToApp }) => {
  const [photos, setPhotos] = useState<MemoryPhotoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showStory, setShowStory] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const loaded = vanikaStorage.getMemoryPhotos();
    setPhotos(loaded);
  }, []);

  const currentItem = photos[currentIndex] || photos[0];

  const handleSelectOption = (option: string) => {
    soundSynth.playSoftClick();
    setSelectedAnswer(option);

    if (option === currentItem.correctAnswer) {
      setIsCorrect(true);
      setShowStory(true);
      const newScore = score + 1;
      setScore(newScore);
      soundSynth.playCelebration();

      vanikaStorage.recordGameSession('memory', Math.min(100, 75 + newScore * 10), 4);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1E3A2F', '#D4AF37', '#C06A44']
      });

      speechEngine.speak(`Well remembered! That is ${currentItem.correctAnswer}.`, {
        language: currentLanguage
      });
    } else {
      setIsCorrect(false);
      soundSynth.playGentleChime();
      speechEngine.speak(`Let us look once more with a peaceful heart.`, {
        language: currentLanguage
      });
    }
  };

  const handleNextPhoto = () => {
    soundSynth.playSoftClick();
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowStory(false);
    setImgLoaded(false);
    setImgError(false);
    if (photos.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const handlePlayVoicePrompt = () => {
    soundSynth.playSoftClick();
    speechEngine.speak(currentItem?.audioPrompt || 'Who is in this photo?', {
      language: currentLanguage
    });
  };

  const handleVoiceAnswer = () => {
    if (isListening) {
      speechEngine.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    soundSynth.playSoftClick();
    speechEngine.speak('Speak the name of the person in the photo', { language: currentLanguage });

    speechEngine.startListening(
      (transcript) => {
        setIsListening(false);
        const lower = transcript.toLowerCase();
        if (currentItem?.options) {
          const match = currentItem.options.find(opt => {
            const parts = opt.toLowerCase().split(' ');
            return parts.some(p => p.length > 2 && lower.includes(p));
          });
          if (match) {
            handleSelectOption(match);
          }
        }
      },
      (err) => {
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      },
      currentLanguage
    );
  };

  if (!currentItem) {
    return (
      <div className="section-max py-20 text-center text-[#1A2F24] dark:text-[#F2EDE3]">
        <p className="font-display text-2xl font-bold">Loading family memory photos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0C1A11] py-8 sm:py-12" id="view-game-memory">
      <div className="section-max max-w-4xl mx-auto space-y-8">
        
        {/* Header Bar */}
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
                <span className="text-2xl">🖼️</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
                  Who is in this memory?
                </h2>
              </div>
              <p className="font-mono-label text-xs text-[#7B9E87] mt-0.5">
                LIFE-STORY RECALL • PHOTO {currentIndex + 1} OF {photos.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleVoiceAnswer}
              className={`py-2 px-4 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                isListening
                  ? 'bg-[#C06A44] text-white border-[#C06A44] animate-pulse'
                  : 'bg-white dark:bg-[#162A1F] text-[#1A2F24] dark:text-[#F2EDE3] border-[#2D4739]/15 dark:border-[#D4AF37]/25 hover:border-[#D4AF37]'
              }`}
            >
              <span>🎙️</span>
              <span>{isListening ? 'Listening...' : 'Voice Answer'}</span>
            </button>

            <div className="bg-[#1E3A2F] text-[#D4AF37] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
              <Heart className="w-4 h-4 fill-current" />
              <span>Score: {score}</span>
            </div>
          </div>
        </div>

        {/* Main Memory Album Frame */}
        <div className="card-story bg-white dark:bg-[#162A1F] p-8 sm:p-10 border border-[#2D4739]/15 dark:border-[#D4AF37]/25 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Photograph Container */}
            <div className="md:col-span-6">
              <div className="p-3 rounded-2xl bg-[#F5EEE2] dark:bg-[#1A3328] border border-[#2D4739]/15 dark:border-[#D4AF37]/20 shadow-md">
                <SafeImage
                  src={currentItem.imageUrl}
                  alt={currentItem.title}
                  className="w-full h-64 sm:h-80 rounded-xl"
                />

                <div className="mt-3 flex items-center justify-between font-mono-label text-[10px] text-[#5A7265] dark:text-[#9DBFB0] px-1">
                  <span>📍 {currentItem.location}</span>
                  <span>🗓️ {currentItem.year}</span>
                </div>
              </div>
            </div>

            {/* Prompt & Voice Audio */}
            <div className="md:col-span-6 space-y-5">
              <div className="card-story bg-[#FDFBF7] dark:bg-[#0F2219] p-6 border border-[#2D4739]/10 dark:border-[#D4AF37]/20 space-y-3">
                <span className="font-mono-label text-[10px] text-[#C06A44] uppercase tracking-widest block">
                  FAMILY ALBUM MEMORY
                </span>
                <h3 className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
                  {currentItem.title}
                </h3>
                <p className="prose-elder text-[#5A7265] dark:text-[#9DBFB0] text-sm leading-relaxed italic">
                  "{currentItem.audioPrompt}"
                </p>

                <button
                  onClick={handlePlayVoicePrompt}
                  className="btn-primary w-full py-3 text-xs"
                >
                  <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Hear Question Spoken</span>
                </button>
              </div>

              {/* Feedback Banners */}
              {isCorrect === true && (
                <div className="p-5 rounded-2xl bg-[#7B9E87]/15 border border-[#7B9E87] text-[#1A2F24] dark:text-[#F2EDE3] animate-slide-up space-y-1">
                  <div className="flex items-center gap-2 font-display text-lg font-bold">
                    <CheckCircle2 className="w-5 h-5 text-[#7B9E87]" />
                    <span>Well remembered!</span>
                  </div>
                  <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0] leading-relaxed">
                    {currentItem.storyNote}
                  </p>
                </div>
              )}

              {isCorrect === false && (
                <div className="p-5 rounded-2xl bg-[#C06A44]/15 border border-[#C06A44] text-[#1A2F24] dark:text-[#F2EDE3] animate-slide-up space-y-1">
                  <div className="flex items-center gap-2 font-display text-lg font-bold">
                    <Heart className="w-5 h-5 text-[#C06A44]" />
                    <span>Let's look once more.</span>
                  </div>
                  <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0]">
                    Take a calm breath. Look at the smile and the backdrop.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 4 Touch Target Options */}
          <div className="mt-10 pt-8 border-t border-[#2D4739]/10 dark:border-[#D4AF37]/15">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <label className="font-display text-lg font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
                Select the person in this memory:
              </label>
              <GameVoiceAnswerButton
                options={currentItem.options}
                onOptionMatched={(matchedOption) => handleSelectOption(matchedOption)}
                currentLanguage={currentLanguage}
                promptMessage="Speak the name of the person in the photo"
                disabled={selectedAnswer !== null && isCorrect === true}
                label="Speak Answer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentItem.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isRightAnswer = option === currentItem.correctAnswer;
                
                let btnStyle = 'bg-[#FDFBF7] dark:bg-[#0F2219] text-[#1A2F24] dark:text-[#F2EDE3] border-[#2D4739]/15 dark:border-[#D4AF37]/20 hover:border-[#D4AF37]';
                if (isSelected) {
                  if (isRightAnswer) {
                    btnStyle = 'bg-[#1E3A2F] text-white border-[#D4AF37] font-bold shadow-md';
                  } else {
                    btnStyle = 'bg-[#C06A44]/15 text-[#C06A44] border-[#C06A44] font-bold';
                  }
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleSelectOption(option)}
                    className={`btn-elder py-4 px-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-left ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isSelected && isRightAnswer && <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-10 pt-6 border-t border-[#2D4739]/10 dark:border-[#D4AF37]/15 flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={() => {
                soundSynth.playSoftClick();
                setSelectedAnswer(null);
                setIsCorrect(null);
              }}
              className="btn-ghost py-3 px-5 text-xs font-semibold"
            >
              Try Again
            </button>

            <button
              onClick={handleNextPhoto}
              className="btn-primary py-3.5 px-6"
            >
              <span>Next Memory</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
