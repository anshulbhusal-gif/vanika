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
      className="lg:hidden fixed bottom-4 left-4 right-4 z-50 safe-pb"
      role="navigation"
      aria-label="Mobile bottom navigation"
    >
      <div className="bottom-nav-pill px-2 py-2 flex items-center justify-around">
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] rounded-xl transition-all cursor-pointer relative ${
                active
                  ? 'text-[#D4AF37]'
                  : 'text-[#C8D8CF]/75 hover:text-[#FDFBF7]'
              }`}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
            >
              {active && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
              )}
              <div className={`p-1.5 rounded-xl transition-all ${
                active ? 'bg-[#D4AF37]/15' : ''
              }`}>
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-semibold mt-0.5 tracking-tight ${active ? 'font-bold text-[#FDFBF7]' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
