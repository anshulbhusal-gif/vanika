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
  if (hour < 12) return { text: 'Good Morning', icon: <Sun className="w-4 h-4 text-[#D4AF37]" />, emoji: '☀️' };
  if (hour < 17) return { text: 'Good Afternoon', icon: <Cloud className="w-4 h-4 text-[#7B9E87]" />, emoji: '🌤️' };
  return { text: 'Good Evening', icon: <Moon className="w-4 h-4 text-[#D4AF37]" />, emoji: '🌙' };
};

const DEFAULT_ACTIVITIES = [
  { id: 'rec-1', name: 'Memory Recall', icon: '🃏', time: '5 min', difficulty: 'Easy', view: 'game-memory' as ActiveView, color: '#C06A44' },
  { id: 'rec-2', name: 'Visual Attention', icon: '🔍', time: '5 min', difficulty: 'Easy', view: 'game-attention' as ActiveView, color: '#7B9E87' },
  { id: 'rec-3', name: 'Cultural Wisdom', icon: '🪡', time: '5 min', difficulty: 'Medium', view: 'game-cultural' as ActiveView, color: '#D4AF37' },
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
            name: rec.title || rec.game?.title || rec.name || 'Memory Recall',
            icon: rec.icon || (idx === 0 ? '🃏' : idx === 1 ? '🔍' : '🪡'),
            time: rec.estimatedMinutes ? `${rec.estimatedMinutes} min` : '5 min',
            difficulty: rec.difficultyLevel || rec.difficulty || 'Easy',
            view: (rec.gameId === 'game-attention' || rec.gameId === 'game-cultural') ? rec.gameId as ActiveView : 'game-memory' as ActiveView,
            color: idx === 0 ? '#C06A44' : idx === 1 ? '#7B9E87' : '#D4AF37',
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
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0C1A11] py-8 sm:py-12" id="view-patient-dashboard">
      <div className="section-max space-y-10">

        {/* ── COURTYARD WELCOME HERO ── */}
        <div className="card-story bg-gradient-to-br from-[#1E3A2F] via-[#2D4739] to-[#1E3A2F] text-[#FDFBF7] p-8 sm:p-12 border border-[#D4AF37]/35 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-5xl shadow-md animate-companion-breathe shrink-0">
                👴🏽
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono-label text-[11px] uppercase tracking-widest mb-2">
                  {greeting.icon}
                  <span>{greeting.emoji} {greeting.text}</span>
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#FDFBF7]">
                  Namaskar, {userName}!
                </h1>
                <p className="text-sm text-[#C8D8CF] mt-2">
                  Welcome to your personal courtyard. Ready for today's gentle activities?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => { soundSynth.playGentleChime(); onOpenCompanion(); }}
                className="btn-gold flex-1 md:flex-initial py-3.5 px-6"
              >
                <Mic className="w-5 h-5" />
                <span>{t.talkToOja}</span>
              </button>

              <button
                onClick={handleSpeakGreeting}
                className="btn-ghost text-white border-white/30 hover:bg-white/15 py-3.5 px-4"
                aria-label="Hear greeting spoken aloud"
              >
                <Volume2 className="w-5 h-5 text-[#D4AF37]" />
              </button>
            </div>
          </div>
        </div>

        {/* ── FEATURED TODAY'S COGNITIVE SESSION ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
              Today's Memory Activity
            </h2>
          </div>

          <button
            onClick={() => { soundSynth.playSoftClick(); onNavigate('game-memory'); }}
            className="card-story w-full bg-white dark:bg-[#162A1F] p-8 border border-[#D4AF37]/40 text-left shadow-lg cursor-pointer group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-[#C06A44] text-white flex items-center justify-center text-4xl shadow-md group-hover:scale-105 transition-transform shrink-0">
                  🃏
                </div>
                <div>
                  <span className="font-mono-label text-[10px] text-[#C06A44] uppercase tracking-widest block mb-1">
                    RECOMMENDED SESSION
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
                    Memory Recall — Life Story Album
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-semibold text-[#5A7265] dark:text-[#9DBFB0] mt-2">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#D4AF37]" /> 5 minutes</span>
                    <span>•</span>
                    <span className="text-[#7B9E87]">Gentle & Familiar</span>
                  </div>
                </div>
              </div>

              <div className="btn-primary py-3.5 px-6 self-start sm:self-center shrink-0">
                <Play className="w-4 h-4 text-[#D4AF37]" />
                <span>Begin Activity</span>
              </div>
            </div>
          </button>
        </div>

        {/* ── PERSONAL RHYTHM & STATS ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#7B9E87]" />
            <h2 className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
              Your Memory Rhythm
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="card-story bg-white dark:bg-[#162A1F] p-5 text-center border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
              <span className="font-display text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">23</span>
              <span className="font-mono-label text-[10px] text-[#5A7265] dark:text-[#9DBFB0] block mt-1">ACTIVITIES DONE</span>
            </div>

            <div className="card-story bg-white dark:bg-[#162A1F] p-5 text-center border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-[#C06A44]" />
                <span className="font-display text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">7</span>
              </div>
              <span className="font-mono-label text-[10px] text-[#5A7265] dark:text-[#9DBFB0] block mt-1">DAY STREAK</span>
            </div>

            <div className="card-story bg-white dark:bg-[#162A1F] p-5 text-center border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
              <span className="font-display text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">78%</span>
              <span className="font-mono-label text-[10px] text-[#5A7265] dark:text-[#9DBFB0] block mt-1">MEMORY RECALL</span>
            </div>

            <div className="card-story bg-white dark:bg-[#162A1F] p-5 text-center border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
              <span className="font-display text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">82%</span>
              <span className="font-mono-label text-[10px] text-[#5A7265] dark:text-[#9DBFB0] block mt-1">VISUAL FOCUS</span>
            </div>

            <div className="card-story bg-white dark:bg-[#162A1F] p-5 text-center border border-[#2D4739]/15 dark:border-[#D4AF37]/20 col-span-2 sm:col-span-1">
              <span className="font-display text-3xl font-bold text-[#7B9E87]">+12%</span>
              <span className="font-mono-label text-[10px] text-[#5A7265] dark:text-[#9DBFB0] block mt-1">WEEKLY TREND</span>
            </div>
          </div>
        </div>

        {/* ── RECOMMENDED ACTIVITIES ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#D4AF37]" />
              Recommended Activities
            </h2>
            <button
              onClick={() => onNavigate('games-hub')}
              className="text-xs font-bold text-[#C06A44] dark:text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Explore All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recommendations.map((activity) => (
              <button
                key={activity.id}
                onClick={() => { soundSynth.playSoftClick(); onNavigate(activity.view); }}
                className="card-story group bg-white dark:bg-[#162A1F] p-6 text-left border border-[#2D4739]/15 dark:border-[#D4AF37]/20 hover:border-[#D4AF37] cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: `${activity.color}20` }}
                >
                  {activity.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] mb-1">
                  {activity.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#5A7265] dark:text-[#9DBFB0] mt-2">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {activity.time}</span>
                  <span>•</span>
                  <span className="font-semibold text-[#7B9E87]">{activity.difficulty}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── ROUTINE & QUICK ACTIONS SPLIT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Routine Preview */}
          <div className="card-story bg-white dark:bg-[#162A1F] p-8 border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#7B9E87]" />
                Today's Routine
              </h3>
              <button
                onClick={() => onNavigate('daily-routine')}
                className="text-xs font-bold text-[#C06A44] dark:text-[#D4AF37] cursor-pointer"
              >
                Full Routine →
              </button>
            </div>

            <div className="space-y-4">
              {[
                { time: '7:00 AM', task: 'Morning medication', icon: '💊', done: true },
                { time: '7:30 AM', task: 'Morning Red Tea (Lal Saah)', icon: '🍵', done: true },
                { time: '9:00 AM', task: 'Memory Activity in Courtyard', icon: '🧩', done: false },
                { time: '12:30 PM', task: 'Afternoon Lunch', icon: '🍛', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-[#FDFBF7] dark:bg-[#0F2219] border border-[#2D4739]/10 dark:border-[#D4AF37]/15">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                    item.done ? 'bg-[#7B9E87]/20 text-[#7B9E87]' : 'bg-[#F5EEE2] dark:bg-[#1A3328] text-[#1A2F24] dark:text-[#F2EDE3]'
                  }`}>
                    {item.done ? '✓' : item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`block text-sm font-semibold ${item.done ? 'text-[#5A7265] dark:text-[#9DBFB0] line-through' : 'text-[#1A2F24] dark:text-[#F2EDE3]'}`}>
                      {item.task}
                    </span>
                  </div>
                  <span className="font-mono-label text-[10px] text-[#7B9E87] shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-story bg-white dark:bg-[#162A1F] p-8 border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <h3 className="font-display text-xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] mb-6">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Start Activity', icon: <Play className="w-5 h-5 text-[#D4AF37]" />, view: 'games-hub' as ActiveView, bg: 'bg-[#1E3A2F]', text: 'text-white' },
                { label: 'View Progress', icon: <BarChart3 className="w-5 h-5 text-[#7B9E87]" />, view: 'progress' as ActiveView, bg: 'bg-[#F5EEE2] dark:bg-[#1A3328]', text: 'text-[#1A2F24] dark:text-[#F2EDE3]' },
                { label: 'Daily Routine', icon: <CalendarCheck className="w-5 h-5 text-[#D4AF37]" />, view: 'daily-routine' as ActiveView, bg: 'bg-[#F5EEE2] dark:bg-[#1A3328]', text: 'text-[#1A2F24] dark:text-[#F2EDE3]' },
                { label: 'Talk to Companion', icon: <HelpCircle className="w-5 h-5 text-[#C06A44]" />, view: 'settings' as ActiveView, bg: 'bg-[#F5EEE2] dark:bg-[#1A3328]', text: 'text-[#1A2F24] dark:text-[#F2EDE3]' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    soundSynth.playSoftClick();
                    if (action.label === 'Talk to Companion') {
                      onOpenCompanion();
                    } else {
                      onNavigate(action.view);
                    }
                  }}
                  className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl ${action.bg} ${action.text} font-bold text-xs cursor-pointer hover:scale-[1.02] transition-transform`}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
