import React, { useEffect, useState } from 'react';
import { Trophy, Target, Clock, TrendingUp, ArrowRight, Home, Star, Sparkles, Heart } from 'lucide-react';
import { ActiveView, GameResult } from '../../types';
import { DEFAULT_GAME_RESULT } from '../../data/mockData';

interface GameResultScreenProps {
  result?: GameResult;
  onNavigate: (view: ActiveView) => void;
}

export const GameResultScreen: React.FC<GameResultScreenProps> = ({
  result = DEFAULT_GAME_RESULT,
  onNavigate,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);

    const target = result.accuracy;
    const duration = 1200;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(target * eased));
      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [result.accuracy]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0C1A11] py-10 sm:py-16" id="view-game-result">
      <div className="section-max max-w-2xl mx-auto space-y-8">

        {/* Celebration Header */}
        <div className={`text-center space-y-4 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="w-24 h-24 mx-auto rounded-3xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-6xl shadow-md animate-companion-breathe">
            🎉
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] tracking-tight">
            Well Done!
          </h1>
          <p className="prose-elder text-[#5A7265] dark:text-[#9DBFB0]">
            You completed <strong className="text-[#1A2F24] dark:text-[#F2EDE3]">{result.gameName}</strong> beautifully.
          </p>
        </div>

        {/* Accuracy Ring */}
        <div className={`flex justify-center transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative w-44 h-44">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" className="text-[#2D4739]/10 dark:text-[#D4AF37]/15" strokeWidth="12" />
              <circle
                cx="80" cy="80" r="70" fill="none"
                stroke={animatedScore >= 80 ? '#1E3A2F' : animatedScore >= 60 ? '#D4AF37' : '#C06A44'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - animatedScore / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{animatedScore}%</span>
              <span className="font-mono-label text-[10px] text-[#7B9E87]">ACCURACY</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="card-story bg-white dark:bg-[#162A1F] p-4 text-center border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <Trophy className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
            <span className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{result.score}/{result.totalQuestions}</span>
            <span className="font-mono-label text-[10px] text-[#7B9E87] block">SCORE</span>
          </div>

          <div className="card-story bg-white dark:bg-[#162A1F] p-4 text-center border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <Target className="w-5 h-5 text-[#C06A44] mx-auto mb-1" />
            <span className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{result.accuracy}%</span>
            <span className="font-mono-label text-[10px] text-[#7B9E87] block">ACCURACY</span>
          </div>

          <div className="card-story bg-white dark:bg-[#162A1F] p-4 text-center border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <Clock className="w-5 h-5 text-[#7B9E87] mx-auto mb-1" />
            <span className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{formatTime(result.timeSpent)}</span>
            <span className="font-mono-label text-[10px] text-[#7B9E87] block">TIME</span>
          </div>

          <div className="card-story bg-white dark:bg-[#162A1F] p-4 text-center border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <Star className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
            <span className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{result.difficulty}</span>
            <span className="font-mono-label text-[10px] text-[#7B9E87] block">DIFFICULTY</span>
          </div>
        </div>

        {/* Strengths */}
        <div className={`card-story bg-[#7B9E87]/15 p-6 border border-[#7B9E87] transition-all duration-700 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-[#7B9E87]" />
            <h3 className="font-display text-lg font-bold text-[#1A2F24] dark:text-[#F2EDE3]">What You Did Well</h3>
          </div>
          <ul className="space-y-1.5">
            {result.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-xs font-semibold text-[#5A7265] dark:text-[#9DBFB0]">
                <span className="text-[#7B9E87] font-bold">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next Recommendation */}
        <div className={`transition-all duration-700 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="font-display text-lg font-bold text-[#1A2F24] dark:text-[#F2EDE3] mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            Next Recommended Activity
          </h3>
          <button
            onClick={() => onNavigate(result.nextRecommendation.view)}
            className="card-story w-full p-5 bg-white dark:bg-[#162A1F] border border-[#2D4739]/15 dark:border-[#D4AF37]/20 flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                {result.nextRecommendation.icon}
              </div>
              <div className="text-left">
                <span className="font-display text-base font-bold text-[#1A2F24] dark:text-[#F2EDE3] block">{result.nextRecommendation.name}</span>
                <span className="font-mono-label text-[10px] text-[#7B9E87]">{result.nextRecommendation.category}</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 pt-4 transition-all duration-700 delay-600 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={() => onNavigate(result.nextRecommendation.view)}
            className="btn-primary flex-1 py-4 text-base"
          >
            <span>Continue Journey</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
          <button
            onClick={() => onNavigate('patient-app')}
            className="btn-ghost flex-1 py-4 text-base"
          >
            <Home className="w-4 h-4" />
            <span>Return to Courtyard</span>
          </button>
        </div>

      </div>
    </div>
  );
};
