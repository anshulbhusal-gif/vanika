import React from 'react';

interface PageHeroProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
  action?: React.ReactNode;
  className?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  eyebrow,
  action,
  className = ''
}) => {
  return (
    <div className={`card-story bg-gradient-to-br from-[#1E3A2F] via-[#2D4739] to-[#1E3A2F] text-[#FDFBF7] p-8 sm:p-12 border border-[#D4AF37]/35 shadow-xl ${className}`}>
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          {eyebrow && (
            <span className="font-mono-label text-[10px] text-[#D4AF37] uppercase tracking-widest block mb-2">
              {eyebrow}
            </span>
          )}
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#FDFBF7]">
            {title}
          </h1>
          <p className="text-sm text-[#C8D8CF] mt-2 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
};
