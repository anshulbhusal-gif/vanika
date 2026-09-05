import React from 'react';
import { Home, Gamepad2, CalendarCheck, BarChart3, Users, Settings, Mic } from 'lucide-react';
import { ActiveView } from '../../types';

interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenCompanion: () => void;
  userName?: string;
}

const NAV_ITEMS: { id: ActiveView; label: string; icon: React.ElementType }[] = [
  { id: 'patient-app', label: 'Courtyard', icon: Home },
  { id: 'games-hub', label: 'Activities', icon: Gamepad2 },
  { id: 'daily-routine', label: 'Routine', icon: CalendarCheck },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'caregiver-portal', label: 'Caregiver', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  onOpenCompanion,
  userName = 'Bhaben Kaka',
}) => {
  const isActive = (id: ActiveView) => {
    if (id === 'patient-app') {
      return activeView === 'patient-app' || activeView === 'memory-house' || activeView === 'memory-garden';
    }
    if (id === 'games-hub') {
      return activeView === 'games-hub' || activeView.startsWith('game-');
    }
    if (id === 'caregiver-portal') {
      return activeView === 'caregiver-portal' || activeView === 'caregiver';
    }
    return activeView === id;
  };

  return (
    <aside
      className="hidden lg:flex flex-col w-[250px] min-h-screen bg-[#1E3A2F] text-[#FDFBF7] border-r border-[#D4AF37]/15 py-6 px-4 shrink-0 sticky top-0 h-screen justify-between z-30 select-none"
      role="navigation"
      aria-label="Main navigation"
    >
      <div>
        {/* Brand Header */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 px-3 mb-8 cursor-pointer group text-left w-full"
          aria-label="Go to home page"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
            🌿
          </div>
          <div>
            <span className="block font-display text-xl font-bold text-[#FDFBF7] tracking-tight leading-none">
              Vanika
            </span>
            <span className="block font-mono-label text-[10px] text-[#A8C4B2] mt-1 tracking-widest">
              COGNITIVE CARE
            </span>
          </div>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1.5" aria-label="Sidebar navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#2D4739] text-[#FDFBF7] shadow-md border border-[#D4AF37]/30 font-bold'
                    : 'text-[#C8D8CF] hover:bg-[#2D4739]/50 hover:text-[#FDFBF7]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-[#D4AF37]' : 'text-[#A8C4B2]'}`} />
                <span>{item.label}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: Companion & Profile */}
      <div className="space-y-3 pt-4 border-t border-[#2D4739]">
        {/* Companion Trigger */}
        <button
          onClick={onOpenCompanion}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#C8A94A] text-[#1E3A2F] font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
          aria-label="Talk to voice assistant Oja"
        >
          <div className="w-7 h-7 rounded-lg bg-[#1E3A2F]/15 flex items-center justify-center">
            <Mic className="w-4 h-4 text-[#1E3A2F]" />
          </div>
          <span>Talk to Oja</span>
          <div className="ml-auto w-2 h-2 rounded-full bg-[#1E3A2F] animate-status-pulse" />
        </button>

        {/* User Card */}
        <button
          onClick={() => onNavigate('settings')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-[#2D4739]/60 transition-colors cursor-pointer text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-lg shrink-0">
            👴🏽
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-bold text-[#FDFBF7] truncate">{userName}</span>
            <span className="block text-[11px] text-[#A8C4B2]">Personal Account</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
