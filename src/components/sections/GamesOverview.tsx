import React from 'react';
import { ArrowRight, Sparkles, Image, Eye, BookOpen, Music, Heart } from 'lucide-react';
import { ActiveView } from '../../types';
import { soundSynth } from '../../utils/audioSynth';

interface GamesOverviewProps {
  onNavigate: (view: ActiveView) => void;
}

export const GamesOverview: React.FC<GamesOverviewProps> = ({ onNavigate }) => {
  const games = [
    {
      id: 'game-memory',
      title: 'Memory Recall',
      subtitle: 'Who is this?',
      description: 'Recall family members, Bihu gatherings, and cherished photographs from your private life album.',
      view: 'game-memory' as ActiveView,
      symbol: '🖼️',
      color: 'bg-[#C87552]',
      tag: 'Episodic Memory',
      visualHint: 'Family Photographs & Courtyard Moments'
    },
    {
      id: 'game-sequence',
      title: 'Sequence Recall',
      subtitle: 'A Bihu Morning & Tea Plucking',
      description: 'Arrange familiar daily and harvest rituals in logical order, accompanied by gentle folk drum rhythms.',
      view: 'game-sequence' as ActiveView,
      symbol: '🪘',
      color: 'bg-[#D9A441]',
      tag: 'Procedural Logic',
      visualHint: 'Ceremonial Harvest Steps'
    },
    {
      id: 'game-attention',
      title: 'Visual Attention',
      subtitle: 'Spot the Difference in Majuli',
      description: 'Observe two peaceful North Eastern landscape scenes and gently discover subtle changes with friendly hints.',
      view: 'game-attention' as ActiveView,
      symbol: '👀',
      color: 'bg-[#7EA9A5]',
      tag: 'Visual Scan & Focus',
      visualHint: 'Majuli Island & Tea Gardens'
    },
    {
      id: 'game-cultural',
      title: 'Cultural Wisdom',
      subtitle: 'Folk Lore & Music Match',
      description: 'Rediscover traditional musical instruments, harvest customs, and indigenous heritage across 8 NER states.',
      view: 'game-cultural' as ActiveView,
      symbol: '🎋',
      color: 'bg-[#315C4C]',
      tag: 'Semantic & Heritage',
      visualHint: 'Pepa, Jappi & Folk Traditions'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#FDFBF7]" id="section-games">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C66B44]/15 text-[#C66B44] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Adaptive Play
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#1E3A2F] tracking-tight">
            Engaging Cognitive Games
          </h2>
          <p className="mt-3 text-lg sm:text-xl text-[#52635D] leading-relaxed">
            Activities designed to feel like enjoyable, familiar pastimes rather than sterile medical examinations.
          </p>
        </div>

        {/* 4 Major Game Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-[#FFFFFF] border border-[#2D4739]/15 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:border-[#2D4739]"
            >
              <div>
                {/* Symbol & Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${game.color} text-white flex items-center justify-center text-3xl shadow-xs group-hover:scale-105 transition-transform`}>
                    {game.symbol}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#F5EFE6] text-[#1E3A2F]">
                    {game.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-bold font-heading text-[#1E3A2F] group-hover:text-[#C66B44] transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs font-bold text-[#6A9B96] uppercase tracking-wide mt-0.5">
                  {game.subtitle}
                </p>

                <p className="text-sm text-[#52635D] mt-3.5 leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Play Button Trigger */}
              <div className="pt-6 mt-4 border-t border-[#2D4739]/10">
                <button
                  id={`btn-play-${game.id}`}
                  onClick={() => {
                    soundSynth.playSoftClick();
                    onNavigate(game.view);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#2D4739] group-hover:bg-[#1E3A2F] text-[#FDFBF7] font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer focus-accessible"
                >
                  <span>Play Activity</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
