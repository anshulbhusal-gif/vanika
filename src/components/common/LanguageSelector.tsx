import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'pills';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'dropdown', className = '' }) => {
  const { currentLanguageCode, changeLanguage, supportedLanguages } = useTranslation();

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {supportedLanguages.map((lang) => {
          const isActive = currentLanguageCode === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
              }`}
            >
              <span>{lang.flagEmoji}</span>
              <span>{lang.nativeName}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <Globe className="w-4 h-4 text-emerald-700 dark:text-emerald-400 absolute left-2.5 pointer-events-none" />
      <select
        value={currentLanguageCode}
        onChange={(e) => changeLanguage(e.target.value)}
        className="pl-8 pr-4 py-1.5 bg-emerald-50/80 dark:bg-stone-800 border border-emerald-200 dark:border-stone-700 text-emerald-900 dark:text-emerald-100 text-xs font-semibold rounded-lg hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none"
        aria-label="Select Language"
      >
        {supportedLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flagEmoji} {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
};
