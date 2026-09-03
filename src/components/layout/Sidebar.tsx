import React from 'react';
import { Home, Gamepad2, CalendarCheck, BarChart3, Users, Settings, Mic, LogOut } from 'lucide-react';
import { ActiveView } from '../../types';

interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenCompanion: () => void;
  userName?: string;
}

const NAV_ITEMS: { id: ActiveView; label: string; icon: React.ElementType; }[] = [
  { id: 'patient-app', label: 'Home', icon: Home },
  { id: 'games-hub', label: 'Activities', icon: Gamepad2 },
  { id: 'daily-routine', label: 'Daily Routine', icon: CalendarCheck },
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
      className="hidden lg:flex flex-col w-[260px] min-h-screen bg-white border-r border-[#2D4739]/10 py-6 px-4 shrink-0 sticky top-0 h-screen"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-3 px-3 mb-8 cursor-pointer group"
        aria-label="Go to home page"
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1E3A2F] to-[#2D4739] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
          <span className="text-2xl">🌿</span>
        </div>
        <div>
          <span className="block text-lg font-extrabold font-heading text-[#1E3A2F] leading-tight">Vanika</span>
          <span className="block text-[10px] font-bold text-[#6A9B96] uppercase tracking-wider">Cognitive Care</span>
        </div>
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer focus-accessible ${
                active
                  ? 'bg-[#1E3A2F] text-[#FDFBF7] shadow-md'
                  : 'text-[#52635D] hover:bg-[#F5EFE6] hover:text-[#1E3A2F]'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-[#D4AF37]' : ''}`} />
              <span>{item.label}</span>
              {active && (
                <div className="ml-auto w-2 h-2 rounded-full bg-[#D4AF37]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Voice Assistant Button */}
      <button
        onClick={onOpenCompanion}
        className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#E5C45B] text-[#1E3A2F] font-extrabold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer mb-4"
        aria-label="Talk to voice assistant"
      >
        <div className="w-8 h-8 rounded-xl bg-[#1E3A2F]/15 flex items-center justify-center">
          <Mic className="w-4 h-4" />
        </div>
        <span>Talk to Oja</span>
        <div className="ml-auto w-2 h-2 rounded-full bg-[#1E3A2F] animate-status-pulse" />
      </button>

      {/* User Profile */}
      <div className="border-t border-[#2D4739]/10 pt-4">
        <button
          onClick={() => onNavigate('settings')}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-[#F5EFE6] transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-xl">
            👴🏽
          </div>
          <div className="text-left flex-1 min-w-0">
            <span className="block text-sm font-bold text-[#1E3A2F] truncate">{userName}</span>
            <span className="block text-xs text-[#6A9B96]">Elder Profile</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
