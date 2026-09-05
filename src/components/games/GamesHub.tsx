import React, { useState } from 'react';
import { Search, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { GAME_CARDS, GAME_CATEGORIES } from '../../data/mockData';

interface GamesHubProps {
  currentLanguage: Language;
  onNavigate: (view: ActiveView) => void;
}

export const GamesHub: React.FC<GamesHubProps> = ({ currentLanguage, onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = GAME_CARDS.filter((game) => {
    const matchesCategory = activeCategory === 'all' || game.category === activeCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0C1A11] py-8 sm:py-12" id="view-games-hub">
      <div className="section-max">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-xl text-[#D4AF37]">
              ✨
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] tracking-tight">
                Your Mind's Playground
              </h1>
              <p className="text-sm text-[#5A7265] dark:text-[#9DBFB0] mt-1">
                Choose a gentle activity — no strict timers or score pressure.
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7B9E87]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities by name or memory type..."
            className="w-full pl-14 pr-5 py-4 text-sm font-semibold rounded-2xl bg-white dark:bg-[#162A1F] border border-[#2D4739]/15 dark:border-[#D4AF37]/25 text-[#1A2F24] dark:text-[#F2EDE3] placeholder-[#5A7265]/50 focus:outline-none focus:border-[#D4AF37] transition-all shadow-sm"
            id="input-games-search"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {GAME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-[#1E3A2F] text-[#FDFBF7] border-[#D4AF37] shadow-md font-bold'
                  : 'bg-white dark:bg-[#162A1F] text-[#5A7265] dark:text-[#9DBFB0] border-[#2D4739]/15 dark:border-[#D4AF37]/20 hover:border-[#D4AF37]'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGames.map((game, i) => (
            <button
              key={game.id}
              onClick={() => onNavigate(game.view)}
              className="card-story group bg-white dark:bg-[#162A1F] p-7 text-left border border-[#2D4739]/15 dark:border-[#D4AF37]/20 hover:border-[#D4AF37] cursor-pointer flex flex-col justify-between"
              id={`game-card-${game.id}`}
            >
              <div>
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-sm mb-5 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: `${game.color}18` }}
                >
                  {game.icon}
                </div>

                {/* Category tag */}
                <span className="font-mono-label text-[10px] uppercase tracking-widest text-[#C06A44] block mb-2">
                  {game.category === 'daily-recall' ? 'Daily Recall' : game.category}
                </span>

                {/* Title */}
                <h3 className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] group-hover:text-[#C06A44] transition-colors mb-2">
                  {game.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0] leading-relaxed mb-6">
                  {game.description}
                </p>
              </div>

              {/* Footer Meta */}
              <div>
                <div className="flex items-center gap-3 text-xs text-[#7B9E87] mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {game.estimatedTime}</span>
                  <span>•</span>
                  <span className="font-semibold text-[#1A2F24] dark:text-[#F2EDE3]">{game.difficulty}</span>
                </div>

                <div className="pt-4 border-t border-[#2D4739]/10 dark:border-[#D4AF37]/15 flex items-center justify-between text-xs font-bold text-[#1E3A2F] dark:text-[#D4AF37]">
                  <span>Begin Activity</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredGames.length === 0 && (
          <div className="card-story bg-white dark:bg-[#162A1F] p-12 text-center border border-[#2D4739]/15">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] mb-2">No activities found</h3>
            <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0]">
              Try searching for a different term or select another category above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
