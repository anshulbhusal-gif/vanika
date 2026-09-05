import React from 'react';
import { Leaf } from 'lucide-react';

interface VanikaWordmarkProps {
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VanikaWordmark: React.FC<VanikaWordmarkProps> = ({
  onClick,
  className = '',
  size = 'md'
}) => {
  const iconSizes = { sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-10 h-10' };
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 text-left cursor-pointer group select-none ${className}`}
      aria-label="Vanika Home"
    >
      <div className={`${iconSizes[size]} rounded-xl bg-[#1E3A2F] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs`}>
        <Leaf className="w-4 h-4 fill-current opacity-80" />
      </div>
      <div>
        <span className={`font-display font-bold tracking-tight text-[#1A2F24] dark:text-[#F2EDE3] ${textSizes[size]} leading-none block`}>
          Vanika
        </span>
        <span className="font-mono-label text-[9px] text-[#7B9E87] tracking-widest block mt-0.5">
          COGNITIVE CARE
        </span>
      </div>
    </button>
  );
};
