import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { VoiceService } from '../../services/voice/VoiceService';
import { VoiceState, VoiceActionResult } from '../../services/voice/voiceTypes';

interface VoiceControlWidgetProps {
  currentLanguage: Language;
  onNavigate: (view: ActiveView) => void;
  voiceSpeed?: 'slow' | 'normal';
  voiceGuideEnabled?: boolean;
  className?: string;
}

export const VoiceControlWidget: React.FC<VoiceControlWidgetProps> = ({
  currentLanguage,
  onNavigate,
  voiceSpeed = 'slow',
  voiceGuideEnabled = true,
  className = '',
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  useEffect(() => {
    const unsubscribe = VoiceService.subscribeState((state) => {
      setVoiceState(state);
    });
    return unsubscribe;
  }, []);

  const handleToggleListening = () => {
    if (voiceState === 'LISTENING') {
      VoiceService.stopListening();
    } else {
      setFeedbackMessage('');
      const safeSpeed: 'slow' | 'normal' = voiceSpeed === 'normal' ? 'normal' : 'slow';
      VoiceService.startListening({
        language: currentLanguage,
        voiceSpeed: safeSpeed,
        voiceGuideEnabled,
        onResult: (result: VoiceActionResult) => {
          setFeedbackMessage(result.message);
          if (result.targetView) {
            onNavigate(result.targetView as ActiveView);
          }
          if (voiceGuideEnabled) {
            VoiceService.speak(result.message, { language: currentLanguage, voiceSpeed: safeSpeed, voiceGuideEnabled });
          }
        },
        onError: (errMessage: string) => {
          setFeedbackMessage(errMessage);
          if (voiceGuideEnabled) {
            VoiceService.speak(errMessage, { language: currentLanguage, voiceSpeed: safeSpeed, voiceGuideEnabled });
          }
        },
      });
    }
  };

  const isSupported = VoiceService.isSpeechRecognitionSupported();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        id="btn-voice-control-mic"
        onClick={handleToggleListening}
        disabled={!isSupported}
        className={`relative p-2.5 rounded-full font-bold text-xs transition-all shadow-sm cursor-pointer flex items-center justify-center ${
          voiceState === 'LISTENING'
            ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-300'
            : voiceState === 'PROCESSING'
            ? 'bg-amber-500 text-white'
            : voiceState === 'SUCCESS'
            ? 'bg-emerald-600 text-white'
            : voiceState === 'PERMISSION_DENIED' || voiceState === 'ERROR'
            ? 'bg-stone-700 text-white'
            : 'bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700'
        } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={voiceState === 'LISTENING' ? 'Stop listening' : 'Start voice commands'}
        title={isSupported ? 'Click to speak voice commands' : 'Voice commands not supported in this browser'}
      >
        {voiceState === 'PROCESSING' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : voiceState === 'SUCCESS' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
        ) : voiceState === 'LISTENING' ? (
          <Mic className="w-4 h-4 animate-bounce" />
        ) : !isSupported ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {/* Voice Status Badge & Feedback */}
      {voiceState !== 'IDLE' && (
        <div className="text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 animate-fadeIn flex items-center gap-1.5 max-w-xs truncate">
          {voiceState === 'LISTENING' && <span className="text-rose-600 font-semibold">Listening...</span>}
          {voiceState === 'PROCESSING' && <span className="text-amber-600 font-semibold">Processing...</span>}
          {voiceState === 'PERMISSION_DENIED' && <span className="text-stone-500">Mic Permission Denied</span>}
          {voiceState === 'UNSUPPORTED' && <span className="text-stone-500">Voice Unsupported</span>}
          {feedbackMessage && <span className="truncate">{feedbackMessage}</span>}
        </div>
      )}
    </div>
  );
};
