import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, ArrowRight, Mic, Sun, Moon, Cloud, Play, BarChart3, CalendarCheck, HelpCircle, Clock, Flame, Brain, Eye, Zap } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { VoiceAssistant } from '../../utils/speech';
import { getTranslation } from '../../utils/translations';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api/apiClient';

interface PatientAppViewProps {
  currentLanguage: Language;
  onNavigate: (view: ActiveView) => void;
  onOpenCompanion: () => void;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', icon: <Sun className="w-5 h-5 text-amber-500" />, emoji: '☀️' };
  if (hour < 17) return { text: 'Good Afternoon', icon: <Cloud className="w-5 h-5 text-[#6A9B96]" />, emoji: '🌤️' };
  return { text: 'Good Evening', icon: <Moon className="w-5 h-5 text-indigo-400" />, emoji: '🌙' };
};

const DEFAULT_ACTIVITIES = [
  { id: 'rec-1', name: 'Memory Match', icon: '🃏', time: '5 min', difficulty: 'Easy', view: 'game-memory' as ActiveView, color: '#C66B44' },
  { id: 'rec-2', name: 'Find the Difference', icon: '🔍', time: '5 min', difficulty: 'Easy', view: 'game-attention' as ActiveView, color: '#6A9B96' },
  { id: 'rec-3', name: 'Cultural Patterns', icon: '🪡', time: '5 min', difficulty: 'Medium', view: 'game-cultural' as ActiveView, color: '#D4AF37' },
];

export const PatientAppView: React.FC<PatientAppViewProps> = ({
  currentLanguage,
  onNavigate,
  onOpenCompanion
}) => {
  const { user } = useAuth();
  const userName = user?.profile?.fullName || (user as any)?.fullName || 'Uncle Dipankar';
  const t = getTranslation(currentLanguage);
  const greeting = getGreeting();
  const [recommendations, setRecommendations] = useState(DEFAULT_ACTIVITIES);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const data = await apiClient.get<any[]>('/recommendations');
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((rec: any, idx: number) => ({
            id: rec.id || `rec-${idx}`,
            name: rec.title || rec.game?.title || rec.name || 'Memory Match',
            icon: rec.icon || (idx === 0 ? '🃏' : idx === 1 ? '🔍' : '🪡'),
            time: rec.estimatedMinutes ? `${rec.estimatedMinutes} min` : '5 min',
            difficulty: rec.difficultyLevel || rec.difficulty || 'Easy',
            view: (rec.gameId === 'game-attention' || rec.gameId === 'game-cultural') ? rec.gameId as ActiveView : 'game-memory' as ActiveView,
            color: idx === 0 ? '#C66B44' : idx === 1 ? '#6A9B96' : '#D4AF37',
          }));
          setRecommendations(mapped);
        }
      } catch (err) {
        // Fall back to default
      }
    };
    fetchRecs();
  }, []);

  const handleSpeakGreeting = () => {
    soundSynth.playGentleChime();
    VoiceAssistant.speak(
      "Good morning! Welcome to your peaceful courtyard. Which activity would you like to enjoy together today?",
      currentLanguage,
      'slow'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] to-[#F5EFE6]" id="view-patient-dashboard">
      <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-6 sm:space-y-8">

        {/* ── WELCOME BANNER ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E3A2F] via-[#2D4739] to-[#1E3A2F] p-6 sm:p-8 shadow-2xl animate-slide-in-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C66B44]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#D4AF37] flex items-center justify-center text-4xl sm:text-5xl shadow-lg animate-companion-breathe shrink-0">
                  👴🏽
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-black uppercase tracking-wide mb-1">
                    {greeting.icon}
                    <span>{greeting.emoji} {greeting.text}</span>
                  </div>
                  <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#FDFBF7] leading-tight">
                    Namaskar, {userName}!
                  </h1>
                  <p className="text-sm text-[#EAE2D2]/70 mt-1">
                    Ready for today's activities?
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => { soundSynth.playGentleChime(); onOpenCompanion(); }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#D4AF37] hover:bg-[#E5C45B] text-[#1E3A2F] font-extrabold text-sm shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <Mic className="w-5 h-5" />
                  {t.talkToOja}
                </button>
                <button
                  onClick={handleSpeakGreeting}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-[#FDFBF7] font-bold text-sm border border-white/20 transition-all cursor-pointer"
                  aria-label="Hear greeting spoken aloud"
                >
                  <Volume2 className="w-5 h-5 text-[#D4AF37]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── TODAY'S COGNITIVE SESSION ── */}
        <div className="animate-slide-in-up-delay-1">
          <h2 className="text-lg font-extrabold text-[#1E3A2F] mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            Today's Cognitive Session
          </h2>
          <button
            onClick={() => { soundSynth.playSoftClick(); onNavigate('game-memory'); }}
            className="card-lift group w-full relative overflow-hidden rounded-3xl bg-white border-2 border-[#D4AF37]/30 p-6 sm:p-8 text-left shadow-md cursor-pointer focus-accessible"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shimmer-bg pointer-events-none" />
            <div className="relative z-10 flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C66B44] to-[#D9835E] flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                🃏
              </div>
              <div className="flex-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#C66B44]/15 text-[#C66B44] text-[10px] font-black uppercase tracking-wide mb-2">
                  Recommended for you
                </span>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1E3A2F] mb-1">
                  Memory Match
                </h3>
                <div className="flex items-center gap-4 text-sm text-[#52635D] font-semibold">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 5 minutes</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">Easy</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-[#1E3A2F] text-[#FDFBF7] py-3 px-6 rounded-2xl font-extrabold text-sm shadow-md group-hover:bg-[#D4AF37] group-hover:text-[#1E3A2F] transition-all">
                <Play className="w-5 h-5" />
                Start
              </div>
            </div>
          </button>
        </div>

        {/* ── YOUR PROGRESS ── */}
        <div className="animate-slide-in-up-delay-2">
          <h2 className="text-lg font-extrabold text-[#1E3A2F] mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#6A9B96]" />
            Your Progress
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-[#2D4739]/10 shadow-sm text-center">
              <span className="block text-2xl font-extrabold text-[#1E3A2F]">23</span>
              <span className="block text-xs font-bold text-[#52635D] mt-1">Activities Done</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#2D4739]/10 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-[#C66B44]" />
                <span className="text-2xl font-extrabold text-[#1E3A2F]">7</span>
              </div>
              <span className="block text-xs font-bold text-[#52635D] mt-1">Day Streak</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#2D4739]/10 shadow-sm text-center">
              <span className="block text-2xl font-extrabold text-[#1E3A2F]">78%</span>
              <span className="flex items-center justify-center gap-1 text-xs font-bold text-[#52635D] mt-1">
                <Brain className="w-3 h-3" /> Memory
              </span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#2D4739]/10 shadow-sm text-center">
              <span className="block text-2xl font-extrabold text-[#1E3A2F]">82%</span>
              <span className="flex items-center justify-center gap-1 text-xs font-bold text-[#52635D] mt-1">
                <Eye className="w-3 h-3" /> Attention
              </span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#2D4739]/10 shadow-sm text-center col-span-2 sm:col-span-1">
              <span className="block text-2xl font-extrabold text-emerald-600">+12%</span>
              <span className="block text-xs font-bold text-[#52635D] mt-1">Weekly Improvement</span>
            </div>
          </div>
        </div>

        {/* ── RECOMMENDED FOR YOU ── */}
        <div className="animate-slide-in-up-delay-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[#1E3A2F] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#D4AF37]" />
              Recommended For You
            </h2>
            <button
              onClick={() => onNavigate('games-hub')}
              className="text-sm font-bold text-[#C66B44] hover:text-[#D4AF37] cursor-pointer transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendations.map((activity) => (
              <button
                key={activity.id}
                onClick={() => { soundSynth.playSoftClick(); onNavigate(activity.view); }}
                className="card-lift group bg-white rounded-2xl p-5 border border-[#2D4739]/10 text-left shadow-sm cursor-pointer focus-accessible"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${activity.color}15` }}
                >
                  {activity.icon}
                </div>
                <h3 className="font-bold text-base text-[#1E3A2F] mb-1">{activity.name}</h3>
                <div className="flex items-center gap-2 text-xs text-[#52635D] font-semibold">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {activity.time}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {activity.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── DAILY ROUTINE PREVIEW + QUICK ACTIONS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Daily Routine Preview */}
          <div className="bg-white rounded-3xl p-6 border border-[#2D4739]/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-[#1E3A2F] flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#6A9B96]" />
                Today's Routine
              </h3>
              <button
                onClick={() => onNavigate('daily-routine')}
                className="text-xs font-bold text-[#C66B44] cursor-pointer"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {[
                { time: '7:00 AM', task: 'Morning medicine', icon: '💊', done: true },
                { time: '7:30 AM', task: 'Breakfast', icon: '🍵', done: true },
                { time: '9:00 AM', task: 'Cognitive session', icon: '🧩', done: false },
                { time: '12:30 PM', task: 'Lunch', icon: '🍛', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                    item.done ? 'bg-emerald-100' : 'bg-[#F5EFE6]'
                  }`}>
                    {item.done ? '✓' : item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`block text-sm font-bold ${item.done ? 'text-[#52635D] line-through' : 'text-[#1E3A2F]'}`}>
                      {item.task}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#6A9B96] shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 border border-[#2D4739]/10 shadow-sm">
            <h3 className="text-base font-extrabold text-[#1E3A2F] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Start Activity', icon: <Play className="w-6 h-6" />, view: 'games-hub' as ActiveView, bg: 'bg-[#1E3A2F]', text: 'text-[#FDFBF7]', iconColor: 'text-[#D4AF37]' },
                { label: 'View Progress', icon: <BarChart3 className="w-6 h-6" />, view: 'progress' as ActiveView, bg: 'bg-[#6A9B96]/15', text: 'text-[#1E3A2F]', iconColor: 'text-[#6A9B96]' },
                { label: 'Daily Recall', icon: <CalendarCheck className="w-6 h-6" />, view: 'daily-routine' as ActiveView, bg: 'bg-[#D4AF37]/15', text: 'text-[#1E3A2F]', iconColor: 'text-[#D4AF37]' },
                { label: 'Ask for Help', icon: <HelpCircle className="w-6 h-6" />, view: 'settings' as ActiveView, bg: 'bg-[#C66B44]/15', text: 'text-[#1E3A2F]', iconColor: 'text-[#C66B44]' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    soundSynth.playSoftClick();
                    if (action.label === 'Ask for Help') {
                      onOpenCompanion();
                    } else {
                      onNavigate(action.view);
                    }
                  }}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl ${action.bg} ${action.text} font-bold text-sm cursor-pointer hover:scale-105 transition-all focus-accessible`}
                >
                  <span className={action.iconColor}>{action.icon}</span>
                  <span className="text-xs">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
