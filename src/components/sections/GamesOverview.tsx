import React from 'react';
import { ArrowRight, Sparkles, Brain, Compass, Image, Award, Play } from 'lucide-react';
import { ActiveView } from '../../types';
import { soundSynth } from '../../utils/audioSynth';

interface GamesOverviewProps {
  onNavigate: (view: ActiveView) => void;
}

export const GamesOverview: React.FC<GamesOverviewProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 bg-[#09120C] text-[#FDFBF7] relative overflow-hidden" id="section-games">
      {/* Glow Backdrops */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#10B981]/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4AF37]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="section-max relative z-10">
        
        {/* Section Header with Eyebrow Pill */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/08 border border-white/15 text-[#10B981] text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            ADAPTIVE COGNITIVE PLAYGROUND
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Cognitive Activities Designed <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#10B981] to-[#FBBF24] bg-clip-text text-transparent">
              Like Enjoyable Heritage Rituals.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#94A3B8] leading-relaxed">
            Non-clinical memory stimulation voiced in native regional dialects. Enjoyable pastimes rather than stressful tests.
          </p>
        </div>

        {/* ── ASYMMETRIC BENTO GRID SHOWCASE (3D Perspective UXBoost Outcrowd Style) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1000">
          
          {/* Bento Tile 1 (Large Feature Card): Memory Recall */}
          <div className="md:col-span-2 rounded-3xl bg-[#0F1E17] border border-white/15 p-8 flex flex-col justify-between group hover:border-[#10B981]/50 transition-all relative overflow-hidden shadow-2xl preserve-3d card-3d-tilt">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#10B981]/20 to-transparent blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#059669] to-[#10B981] text-white flex items-center justify-center text-3xl shadow-lg">
                    🖼️
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] text-xs font-bold uppercase tracking-wider border border-[#10B981]/30">
                      Episodic Memory
                    </span>
                    <h3 className="font-display text-3xl font-extrabold text-white mt-1 group-hover:text-[#34D399] transition-colors">
                      Personal Memory Recall
                    </h3>
                  </div>
                </div>
                <span className="text-xs text-[#FBBF24] font-semibold bg-[#FBBF24]/10 border border-[#FBBF24]/20 px-3 py-1.5 rounded-full">
                  Adaptive AI Difficulty
                </span>
              </div>

              <p className="text-sm text-[#CBD5E1] max-w-xl leading-relaxed">
                Recognize family members, Bihu gatherings, and personal photo albums with voice assistance in Assamese, Bodo, Khasi, Manipuri, and English.
              </p>

              {/* Interactive Mockup Graphic inside Bento Card */}
              <div className="mt-8 p-5 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/05 p-3 border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#10B981]/20 text-[#10B981] flex items-center justify-center font-bold">1</div>
                  <div>
                    <span className="text-xs text-white font-bold block">Assamese Bihu Celebration</span>
                    <span className="text-[10px] text-[#94A3B8]">Matched 0.4s • Voice Verified</span>
                  </div>
                </div>
                <div className="rounded-xl bg-white/05 p-3 border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FBBF24]/20 text-[#FBBF24] flex items-center justify-center font-bold">2</div>
                  <div>
                    <span className="text-xs text-white font-bold block">Grandchild's Birthday</span>
                    <span className="text-[10px] text-[#94A3B8]">Matched 0.6s • Audio Prompt</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
              <span className="text-xs text-[#94A3B8]">Estimated duration: 5-8 mins</span>
              <button
                id="btn-play-game-memory"
                onClick={() => {
                  soundSynth.playSoftClick();
                  onNavigate('game-memory');
                }}
                className="px-6 py-3 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#10B981]/20"
              >
                <span>Launch Memory Activity</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bento Tile 2: Sequence Recall */}
          <div className="rounded-3xl bg-[#0F1E17] border border-white/15 p-8 flex flex-col justify-between group hover:border-[#FBBF24]/50 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FBBF24] flex items-center justify-center text-3xl shadow-sm">
                  🪘
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FBBF24]/15 text-[#FBBF24] text-xs font-bold uppercase tracking-wider">
                  Procedural Logic
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-white group-hover:text-[#FBBF24] transition-colors">
                Sequence Recall
              </h3>
              <p className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider mt-1">
                Tea Plucking & Harvest Rituals
              </p>

              <p className="text-xs text-[#94A3B8] mt-4 leading-relaxed">
                Arrange familiar tea garden harvesting and traditional kitchen rituals in logical sequence with folk rhythms.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                id="btn-play-game-sequence"
                onClick={() => {
                  soundSynth.playSoftClick();
                  onNavigate('game-sequence');
                }}
                className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/15"
              >
                <span>Play Activity</span>
                <ArrowRight className="w-4 h-4 text-[#FBBF24]" />
              </button>
            </div>
          </div>

          {/* Bento Tile 3: Visual Attention */}
          <div className="rounded-3xl bg-[#0F1E17] border border-white/15 p-8 flex flex-col justify-between group hover:border-[#10B981]/50 transition-all shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] flex items-center justify-center text-3xl shadow-sm">
                  👀
                </div>
                <span className="px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] text-xs font-bold uppercase tracking-wider">
                  Visual Focus
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-white group-hover:text-[#34D399] transition-colors">
                Visual Attention
              </h3>
              <p className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider mt-1">
                Spot the Difference in Majuli
              </p>

              <p className="text-xs text-[#94A3B8] mt-4 leading-relaxed">
                Observe peaceful North Eastern landscape scenes and gently discover subtle changes with friendly audio hints.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                id="btn-play-game-attention"
                onClick={() => {
                  soundSynth.playSoftClick();
                  onNavigate('game-attention');
                }}
                className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/15"
              >
                <span>Play Activity</span>
                <ArrowRight className="w-4 h-4 text-[#10B981]" />
              </button>
            </div>
          </div>

          {/* Bento Tile 4 (Wide Tile): Cultural Wisdom */}
          <div className="md:col-span-2 rounded-3xl bg-[#0F1E17] border border-white/15 p-8 flex flex-col justify-between group hover:border-[#FBBF24]/50 transition-all shadow-2xl relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FBBF24] flex items-center justify-center text-3xl shadow-sm">
                    🎋
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full bg-[#FBBF24]/15 text-[#FBBF24] text-xs font-bold uppercase tracking-wider border border-[#FBBF24]/30">
                      Semantic Heritage
                    </span>
                    <h3 className="font-display text-3xl font-extrabold text-white mt-1 group-hover:text-[#FBBF24] transition-colors">
                      Cultural Folklore & Music Match
                    </h3>
                  </div>
                </div>
                <span className="text-xs text-[#10B981] font-semibold bg-[#10B981]/10 border border-[#10B981]/20 px-3 py-1.5 rounded-full">
                  8 NER States Covered
                </span>
              </div>

              <p className="text-sm text-[#CBD5E1] max-w-xl leading-relaxed">
                Rediscover traditional musical instruments (Dhol, Pepa, Gogona), harvest customs, and indigenous stories told across Assam, Manipur, Meghalaya, Mizoram, Nagaland, Arunachal, Tripura, and Sikkim.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
              <span className="text-xs text-[#94A3B8]">Includes native audio recordings</span>
              <button
                id="btn-play-game-cultural"
                onClick={() => {
                  soundSynth.playSoftClick();
                  onNavigate('game-cultural');
                }}
                className="px-6 py-3 rounded-full bg-[#FBBF24] hover:bg-[#D4AF37] text-[#09120C] font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#FBBF24]/20"
              >
                <span>Play Cultural Activity</span>
                <ArrowRight className="w-4 h-4 text-[#09120C]" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

