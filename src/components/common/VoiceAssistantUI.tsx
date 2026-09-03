import React, { useState } from 'react';
import { Mic, MicOff, X, Volume2, ArrowRight } from 'lucide-react';
import { ActiveView } from '../../types';

interface VoiceAssistantUIProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ActiveView) => void;
}

const MOCK_COMMANDS = [
  { text: "Start today's activity", view: 'games-hub' as ActiveView },
  { text: 'Show my progress', view: 'progress' as ActiveView },
  { text: 'Open daily routine', view: 'daily-routine' as ActiveView },
  { text: 'Change language', view: 'settings' as ActiveView },
];

export const VoiceAssistantUI: React.FC<VoiceAssistantUIProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  if (!isOpen) return null;

  const handleStartListening = () => {
    setIsListening(true);
    setTranscript('');
    setResponse('');

    // Mock listening — simulate after 3 seconds
    setTimeout(() => {
      setIsListening(false);
      setTranscript("Show my progress");
      setResponse("Opening your progress page...");

      setTimeout(() => {
        onNavigate('progress');
        onClose();
      }, 1500);
    }, 3000);
  };

  const handleStopListening = () => {
    setIsListening(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E3A2F]/95 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-md px-6 text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#FDFBF7] cursor-pointer transition-colors"
          aria-label="Close voice assistant"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Microphone area */}
        <div className="relative mb-8">
          {/* Ripple rings */}
          {isListening && (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full bg-[#D4AF37]/20 animate-voice-ripple" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-[#D4AF37]/30 animate-voice-ripple" style={{ animationDelay: '0.5s' }} />
              </div>
            </>
          )}

          <button
            onClick={isListening ? handleStopListening : handleStartListening}
            className={`relative z-10 w-28 h-28 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-all shadow-2xl ${
              isListening
                ? 'bg-[#C66B44] hover:bg-[#D9835E] scale-110'
                : 'bg-[#D4AF37] hover:bg-[#E5C45B]'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-[#1E3A2F]" />
            )}
          </button>
        </div>

        {/* Status text */}
        <div className="mb-8">
          {isListening ? (
            <div>
              <h2 className="text-2xl font-extrabold text-[#FDFBF7] mb-2">Listening...</h2>
              <p className="text-base text-[#EAE2D2]/70">Speak now — I am here to help.</p>
            </div>
          ) : transcript ? (
            <div>
              <p className="text-sm text-[#D4AF37] font-bold mb-1">You said:</p>
              <h2 className="text-xl font-extrabold text-[#FDFBF7] mb-3">"{transcript}"</h2>
              {response && (
                <p className="text-base text-[#EAE2D2]/80 font-semibold">{response}</p>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-extrabold text-[#FDFBF7] mb-2">How can I help you?</h2>
              <p className="text-base text-[#EAE2D2]/70">Tap the microphone and speak a command.</p>
            </div>
          )}
        </div>

        {/* Quick command suggestions */}
        {!isListening && !transcript && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-3">
              Try saying:
            </p>
            {MOCK_COMMANDS.map((cmd) => (
              <button
                key={cmd.text}
                onClick={() => {
                  onNavigate(cmd.view);
                  onClose();
                }}
                className="w-full flex items-center justify-between py-3 px-5 rounded-2xl bg-white/08 border border-white/15 text-[#FDFBF7] font-semibold text-sm hover:bg-white/15 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>"{cmd.text}"</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#EAE2D2]/50" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
