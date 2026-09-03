import React from 'react';
import { Home, Gamepad2, CalendarCheck, BarChart3, User } from 'lucide-react';
import { ActiveView } from '../../types';

interface BottomNavProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

const BOTTOM_ITEMS: { id: ActiveView; label: string; icon: React.ElementType }[] = [
  { id: 'patient-app', label: 'Home', icon: Home },
  { id: 'games-hub', label: 'Activities', icon: Gamepad2 },
  { id: 'daily-routine', label: 'Routine', icon: CalendarCheck },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'settings', label: 'Profile', icon: User },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate }) => {
  const isActive = (id: ActiveView) => {
    if (id === 'patient-app') {
      return activeView === 'patient-app' || activeView === 'memory-house' || activeView === 'memory-garden';
    }
    if (id === 'games-hub') {
      return activeView === 'games-hub' || activeView.startsWith('game-');
    }
    return activeView === id;
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-[#2D4739]/10 safe-pb"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-around px-1 py-1">
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[60px] rounded-xl transition-all cursor-pointer relative ${
                active
                  ? 'text-[#1E3A2F]'
                  : 'text-[#52635D]/70'
              }`}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
            >
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-[#D4AF37]" />
              )}
              <div className={`p-1.5 rounded-xl transition-all ${
                active ? 'bg-[#D4AF37]/15' : ''
              }`}>
                <Icon className={`w-5 h-5 ${active ? 'text-[#1E3A2F]' : ''}`} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-bold ${active ? 'text-[#1E3A2F]' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
