import React from 'react';
import { Sun, Cloud, Moon } from 'lucide-react';

interface ElderGreetingProps {
  name: string;
  className?: string;
}

export const ElderGreeting: React.FC<ElderGreetingProps> = ({ name, className = '' }) => {
  const hour = new Date().getHours();
  let timeStr = 'Good Morning';
  let icon = <Sun className="w-4 h-4 text-[#D4AF37]" />;
  let emoji = '☀️';

  if (hour >= 12 && hour < 17) {
    timeStr = 'Good Afternoon';
    icon = <Cloud className="w-4 h-4 text-[#7B9E87]" />;
    emoji = '🌤️';
  } else if (hour >= 17) {
    timeStr = 'Good Evening';
    icon = <Moon className="w-4 h-4 text-[#D4AF37]" />;
    emoji = '🌙';
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="inline-flex items-center gap-1.5 font-mono-label text-[10px] text-[#D4AF37] tracking-widest uppercase">
        {icon}
        <span>{emoji} {timeStr}</span>
      </div>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
        Namaskar, {name}!
      </h2>
    </div>
  );
};
