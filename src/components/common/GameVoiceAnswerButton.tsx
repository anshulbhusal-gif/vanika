import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Language } from '../../types';
import { speechEngine } from '../../utils/speech';
import { soundSynth } from '../../utils/audioSynth';
import { findBestMatchingOptionWithDetails, VoiceMatchDetails } from '../../utils/voiceMatcher';

interface GameVoiceAnswerButtonProps {
  options: string[];
  onOptionMatched: (option: string, transcript: string) => void;
  currentLanguage: Language;
  voiceGuideEnabled?: boolean;
  promptMessage?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export const GameVoiceAnswerButton: React.FC<GameVoiceAnswerButtonProps> = ({
  options,
  onOptionMatched,
  currentLanguage,
  voiceGuideEnabled = true,
  promptMessage = 'Speak your answer clearly',
  disabled = false,
  className = '',
  label = 'Voice Answer',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'warning' | 'error' | 'info' | null>(null);

  const isSupported = speechEngine.isSpeechRecognitionAvailable();
  const timeoutTimerRef = useRef<any>(null);

  // Clear timeout timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
      }
      speechEngine.stopListening();
    };
  }, []);

  const clearFeedbackAfterDelay = (ms = 4000) => {
    setTimeout(() => {
      setFeedbackMessage(null);
      setFeedbackType(null);
    }, ms);
  };

  const handleStartListening = () => {
    if (disabled) return;

    if (!isSupported) {
      setFeedbackMessage('Voice input is not supported in this browser. Please tap an answer.');
      setFeedbackType('error');
      clearFeedbackAfterDelay(5000);
      return;
    }

    if (isListening) {
      // Toggle off cleanly
      stopListeningCleanly();
      return;
    }

    soundSynth.playSoftClick();
    setIsListening(true);
    setIsProcessing(false);
    setFeedbackMessage('Listening... Speak your answer now.');
    setFeedbackType('info');

    // Optional audio prompt if voiceGuideEnabled is true
    if (voiceGuideEnabled) {
      speechEngine.speak(promptMessage, {
        language: currentLanguage,
        rate: 0.85,
      });
    }

    // Target 10-second timeout for game answer speech recognition
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
    }
    timeoutTimerRef.current = setTimeout(() => {
      console.log('[GameVoiceAnswer] 10s target timeout reached.');
      stopListeningCleanly();
      setFeedbackMessage('Listening timed out. Please try again or tap an answer.');
      setFeedbackType('warning');
      if (voiceGuideEnabled) {
        speechEngine.speak("I didn't hear anything. Please try again or tap an answer.", {
          language: currentLanguage,
        });
      }
      clearFeedbackAfterDelay(4000);
    }, 10000);

    speechEngine.startListening(
      (transcript: string) => {
        if (timeoutTimerRef.current) {
          clearTimeout(timeoutTimerRef.current);
          timeoutTimerRef.current = null;
        }
        setIsListening(false);
        setIsProcessing(true);

        // Process transcript using fuzzy matcher algorithm
        const matchResult: VoiceMatchDetails = findBestMatchingOptionWithDetails(
          transcript,
          options,
          0.6 // Confidence threshold 60%
        );

        if (matchResult.bestMatch) {
          soundSynth.playCelebration();
          setFeedbackMessage(`Recognized: "${matchResult.bestMatch}"`);
          setFeedbackType('success');
          setIsProcessing(false);

          if (voiceGuideEnabled) {
            speechEngine.speak(`You said ${matchResult.bestMatch}.`, {
              language: currentLanguage,
            });
          }

          // Trigger existing game answer selection path
          onOptionMatched(matchResult.bestMatch, transcript);
          clearFeedbackAfterDelay(3000);
        } else {
          soundSynth.playGentleChime();
          const retryText = `I didn't quite catch "${transcript}". Please try again or tap an answer.`;
          setFeedbackMessage(retryText);
          setFeedbackType('warning');
          setIsProcessing(false);

          if (voiceGuideEnabled) {
            speechEngine.speak("I didn't quite catch that. Please try again or tap an answer.", {
              language: currentLanguage,
            });
          }
          clearFeedbackAfterDelay(5000);
        }
      },
      (err: any) => {
        if (timeoutTimerRef.current) {
          clearTimeout(timeoutTimerRef.current);
          timeoutTimerRef.current = null;
        }
        setIsListening(false);
        setIsProcessing(false);

        const errType = typeof err === 'string' ? err : err?.error || 'recognition_failed';
        if (errType === 'not-allowed' || errType === 'permission-denied') {
          setFeedbackMessage('Microphone permission denied. Please allow microphone access or tap an answer.');
          setFeedbackType('error');
        } else if (errType !== 'aborted') {
          setFeedbackMessage('Speech recognition error. Please try again or tap an answer.');
          setFeedbackType('warning');
        }
        clearFeedbackAfterDelay(4000);
      },
      () => {
        if (timeoutTimerRef.current) {
          clearTimeout(timeoutTimerRef.current);
          timeoutTimerRef.current = null;
        }
        setIsListening(false);
        setIsProcessing(false);
      },
      currentLanguage
    );
  };

  const stopListeningCleanly = () => {
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }
    speechEngine.stopListening();
    setIsListening(false);
    setIsProcessing(false);
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        type="button"
        id="btn-game-voice-answer"
        onClick={handleStartListening}
        disabled={disabled || !isSupported}
        aria-label={isListening ? 'Stop listening for voice answer' : 'Answer using voice microphone'}
        title={
          !isSupported
            ? 'Voice input not supported in this browser'
            : isListening
            ? 'Click to stop listening'
            : 'Click to speak your answer'
        }
        className={`relative px-4 py-3 sm:px-5 sm:py-3 font-bold text-sm sm:text-base rounded-2xl border-2 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2.5 focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/30 ${
          isListening
            ? 'bg-rose-600 border-rose-500 text-white animate-pulse ring-4 ring-rose-300 dark:ring-rose-900'
            : isProcessing
            ? 'bg-amber-500 border-amber-400 text-white'
            : !isSupported || disabled
            ? 'bg-gray-200 border-gray-300 text-gray-400 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-600 cursor-not-allowed opacity-60'
            : 'bg-gradient-to-r from-[#1E3A2F] to-[#2D4739] hover:from-[#2D4739] hover:to-[#3A5A48] border-[#D4AF37]/40 text-[#FDFBF7] hover:border-[#D4AF37] shadow-lg hover:shadow-xl'
        }`}
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isListening ? (
          <Mic className="w-5 h-5 text-white animate-bounce" />
        ) : !isSupported ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5 text-[#D4AF37]" />
        )}
        <span>
          {isListening
            ? 'Listening... (Speak Now)'
            : isProcessing
            ? 'Matching Answer...'
            : label}
        </span>
        {!isListening && !isProcessing && isSupported && (
          <Sparkles className="w-4 h-4 text-[#D4AF37] opacity-80" />
        )}
      </button>

      {/* Spoken Feedback Toast / Status Indicator */}
      {feedbackMessage && (
        <div
          className={`text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all max-w-md text-center ${
            feedbackType === 'success'
              ? 'bg-emerald-100 border border-emerald-300 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-700 dark:text-emerald-200'
              : feedbackType === 'warning'
              ? 'bg-amber-100 border border-amber-300 text-amber-900 dark:bg-amber-950/80 dark:border-amber-700 dark:text-amber-200'
              : feedbackType === 'error'
              ? 'bg-rose-100 border border-rose-300 text-rose-800 dark:bg-rose-950/80 dark:border-rose-700 dark:text-rose-200'
              : 'bg-[#EDE5D2] border border-[#315C4C]/20 text-[#1E3A2F] dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200'
          }`}
          role="status"
          aria-live="polite"
        >
          {feedbackType === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />}
          {feedbackType === 'warning' && <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />}
          {feedbackType === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />}
          <span>{feedbackMessage}</span>
        </div>
      )}
    </div>
  );
};
