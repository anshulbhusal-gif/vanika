import React, { useState, useEffect } from 'react';
import { Brain, Eye, Zap, Flame, Calendar, TrendingUp, Clock, Award } from 'lucide-react';
import { Language, WeeklyProgress } from '../../types';
import { MOCK_WEEKLY_PROGRESS } from '../../data/mockData';
import { apiClient } from '../../services/api/apiClient';

interface ProgressPageProps {
  currentLanguage: Language;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ currentLanguage }) => {
  const [weekData, setWeekData] = useState<WeeklyProgress[]>(MOCK_WEEKLY_PROGRESS);
  const [streak, setStreak] = useState(7);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const summary = await apiClient.get<any>('/progress/summary');
        if (summary) {
          if (summary.currentStreak !== undefined) {
            setStreak(summary.currentStreak);
          }
        }

        const trends = await apiClient.get<any>('/progress/trends?range=7d');
        if (trends && Array.isArray(trends.dataPoints) && trends.dataPoints.length > 0) {
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const mapped: WeeklyProgress[] = trends.dataPoints.map((pt: any) => {
            const d = new Date(pt.date || pt.day);
            return {
              day: dayNames[d.getDay()] || pt.dayLabel || 'Day',
              activitiesCompleted: pt.sessionsCompleted || pt.activitiesCompleted || 0,
              minutesActive: pt.totalMinutes || pt.minutesActive || 0,
              memoryScore: pt.avgAccuracy || pt.memoryScore || 0,
              attentionScore: pt.attentionScore || Math.round((pt.avgAccuracy || 0) * 0.95),
              patternScore: pt.patternScore || Math.round((pt.avgAccuracy || 0) * 0.9),
            };
          });
          setWeekData(mapped);
        }
      } catch {
        // Offline or API error — keep mock data
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const totalActivities = weekData.reduce((sum, d) => sum + d.activitiesCompleted, 0);
  const totalMinutes = weekData.reduce((sum, d) => sum + d.minutesActive, 0);
  const avgMemory = Math.round(weekData.reduce((sum, d) => sum + d.memoryScore, 0) / weekData.length);
  const avgAttention = Math.round(weekData.reduce((sum, d) => sum + d.attentionScore, 0) / weekData.length);
  const avgPattern = Math.round(weekData.reduce((sum, d) => sum + d.patternScore, 0) / weekData.length);
  const maxActivities = Math.max(...weekData.map(d => d.activitiesCompleted));

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0C1A11] py-8 sm:py-12" id="view-progress">
      <div className="section-max max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-[#7B9E87]/20 text-[#7B9E87] border border-[#7B9E87]/30 flex items-center justify-center text-xl">
            📈
          </div>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] tracking-tight">
              Wellness Rhythm & Progress
            </h1>
            <p className="text-sm text-[#5A7265] dark:text-[#9DBFB0] mt-1">
              Gentle weekly insights — you are doing wonderfully!
            </p>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card-story bg-white dark:bg-[#162A1F] p-5 text-center border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <Calendar className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
            <span className="font-display text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{totalActivities}</span>
            <span className="font-mono-label text-[10px] text-[#7B9E87] block mt-1">ACTIVITIES THIS WEEK</span>
          </div>

          <div className="card-story bg-white dark:bg-[#162A1F] p-5 text-center border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <Clock className="w-5 h-5 text-[#7B9E87] mx-auto mb-2" />
            <span className="font-display text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{totalMinutes}m</span>
            <span className="font-mono-label text-[10px] text-[#7B9E87] block mt-1">MINUTES ACTIVE</span>
          </div>

          <div className="card-story bg-white dark:bg-[#162A1F] p-5 text-center border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <Flame className="w-5 h-5 text-[#C06A44] mx-auto mb-2" />
            <span className="font-display text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{streak}</span>
            <span className="font-mono-label text-[10px] text-[#7B9E87] block mt-1">DAY STREAK 🔥</span>
          </div>

          <div className="card-story bg-white dark:bg-[#162A1F] p-5 text-center border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <Award className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
            <span className="font-display text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{avgMemory}%</span>
            <span className="font-mono-label text-[10px] text-[#7B9E87] block mt-1">AVG PERFORMANCE</span>
          </div>
        </div>

        {/* Weekly Activity Bar Chart */}
        <div className="card-story bg-white dark:bg-[#162A1F] p-8 border border-[#2D4739]/15 dark:border-[#D4AF37]/25 shadow-md">
          <h2 className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] mb-1">
            Weekly Activity Frequency
          </h2>
          <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0] mb-8">
            Number of cognitive sessions completed each day
          </p>

          <div className="flex items-end justify-between gap-3 h-52">
            {weekData.map((day, i) => {
              const height = maxActivities > 0 ? (day.activitiesCompleted / maxActivities) * 100 : 0;
              const isToday = i === weekData.length - 1;
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="font-display text-xs font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{day.activitiesCompleted}</span>
                  <div className="w-full max-w-[44px] relative" style={{ height: '170px' }}>
                    <div
                      className={`absolute bottom-0 w-full rounded-2xl transition-all duration-700 ${
                        isToday
                          ? 'bg-[#D4AF37]'
                          : 'bg-[#1E3A2F]'
                      }`}
                      style={{ height: `${Math.max(height, 10)}%` }}
                    />
                  </div>
                  <span className={`font-mono-label text-[11px] ${isToday ? 'text-[#D4AF37] font-bold' : 'text-[#7B9E87]'}`}>
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs font-semibold text-[#7B9E87] mt-6 text-center">
            ✨ Your activity consistency is steady and peaceful this week — wonderful job!
          </p>
        </div>

        {/* Performance Domains */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Memory */}
          <div className="card-story bg-white dark:bg-[#162A1F] p-6 border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#C06A44]/20 text-[#C06A44] flex items-center justify-center text-xl">
                🧠
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#1A2F24] dark:text-[#F2EDE3]">Memory</h3>
                <span className="font-mono-label text-[10px] text-[#7B9E87]">RECALL & RECOGNITION</span>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-end justify-between mb-2">
                <span className="font-display text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{avgMemory}%</span>
                <span className="text-xs font-bold text-[#7B9E87] flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +6%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#F5EEE2] dark:bg-[#1A3328] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#C06A44] progress-animated"
                  style={{ '--progress-target': `${avgMemory}%` } as React.CSSProperties}
                />
              </div>
            </div>
            <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0]">
              Episodic recall pathways remain active.
            </p>
          </div>

          {/* Attention */}
          <div className="card-story bg-white dark:bg-[#162A1F] p-6 border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#7B9E87]/20 text-[#7B9E87] flex items-center justify-center text-xl">
                👀
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#1A2F24] dark:text-[#F2EDE3]">Attention</h3>
                <span className="font-mono-label text-[10px] text-[#7B9E87]">VISUAL SCAN & FOCUS</span>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-end justify-between mb-2">
                <span className="font-display text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{avgAttention}%</span>
                <span className="text-xs font-bold text-[#7B9E87] flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +4%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#F5EEE2] dark:bg-[#1A3328] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#7B9E87] progress-animated"
                  style={{ '--progress-target': `${avgAttention}%` } as React.CSSProperties}
                />
              </div>
            </div>
            <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0]">
              Visual scan speed is steady and calm.
            </p>
          </div>

          {/* Pattern */}
          <div className="card-story bg-white dark:bg-[#162A1F] p-6 border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-xl">
                ⚡
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#1A2F24] dark:text-[#F2EDE3]">Pattern</h3>
                <span className="font-mono-label text-[10px] text-[#7B9E87]">PROCEDURAL LOGIC</span>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-end justify-between mb-2">
                <span className="font-display text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{avgPattern}%</span>
                <span className="text-xs font-bold text-[#7B9E87] flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +8%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#F5EEE2] dark:bg-[#1A3328] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#D4AF37] progress-animated"
                  style={{ '--progress-target': `${avgPattern}%` } as React.CSSProperties}
                />
              </div>
            </div>
            <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0]">
              Pattern recognition is your fastest-growing area!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
