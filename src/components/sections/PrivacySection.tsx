import React from 'react';
import { ShieldCheck, HardDrive, Lock, UserCheck, CheckCircle } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  const privacyPillars = [
    {
      title: 'Local-First Architecture',
      description: 'Your memories, photographs, and daily game scores stay directly on your device. No constant internet required.',
      icon: HardDrive,
      symbol: '🏠'
    },
    {
      title: 'Private On-Device AI',
      description: 'Facial emotion detection and voice speech models run locally. Camera frames are never sent to external servers.',
      icon: ShieldCheck,
      symbol: '👁️'
    },
    {
      title: 'Encrypted Safe Vault',
      description: 'Private family trees, voice notes, and health logs are encrypted using AES-256 cryptographic standards.',
      icon: Lock,
      symbol: '🔒'
    },
    {
      title: 'You Always Choose',
      description: 'Cloud backup or sharing progress with ASHA community nurses requires explicit, revocable family consent.',
      icon: UserCheck,
      symbol: '🤝'
    }
  ];

  return (
    <section className="section-breathing bg-[#FDFBF7] dark:bg-[#0C1A11]" id="section-privacy">
      <div className="section-max">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E3A2F]/10 dark:bg-[#D4AF37]/15 text-[#1E3A2F] dark:text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            PRIVACY & ETHICAL TRUST
          </div>
          <h2 className="font-display text-display-lg text-[#1A2F24] dark:text-[#F2EDE3]">
            Your memories stay yours.
          </h2>
          <p className="mt-4 prose-elder text-[#5A7265] dark:text-[#9DBFB0] leading-relaxed">
            We treat personal family photographs and voice stories with ancestral reverence. Built to comply strictly with India’s DPDP Act 2023.
          </p>
        </div>

        {/* Visual Security Pathway Card */}
        <div className="card-story bg-white dark:bg-[#162A1F] p-8 sm:p-10 border border-[#2D4739]/15 dark:border-[#D4AF37]/20 shadow-md mb-12 text-center">
          <span className="font-mono-label text-[10px] text-[#C06A44] uppercase tracking-widest block mb-6">
            VISUAL DATA PRIVACY FLOW
          </span>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-sm font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
            <div className="p-5 rounded-2xl bg-[#FDFBF7] dark:bg-[#0F2219] border border-[#2D4739]/15 dark:border-[#D4AF37]/20 w-full sm:w-auto">
              <span className="text-3xl block mb-2">🖼️</span>
              <span>Family Photograph</span>
            </div>

            <span className="text-xl text-[#D4AF37] rotate-90 sm:rotate-0 font-bold">→</span>

            <div className="p-5 rounded-2xl bg-[#F5EEE2] dark:bg-[#1A3328] border border-[#2D4739]/20 dark:border-[#D4AF37]/30 w-full sm:w-auto">
              <span className="text-3xl block mb-2">📱</span>
              <span>Your Personal Device</span>
            </div>

            <span className="text-xl text-[#D4AF37] rotate-90 sm:rotate-0 font-bold">→</span>

            <div className="p-5 rounded-2xl bg-[#1E3A2F] text-[#FDFBF7] border border-[#D4AF37]/40 w-full sm:w-auto">
              <span className="text-3xl block mb-2">🔒</span>
              <span>AES-256 Local Encryption</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {privacyPillars.map((p) => {
            return (
              <div
                key={p.title}
                className="card-story bg-white dark:bg-[#162A1F] p-7 flex flex-col justify-between border border-[#2D4739]/15 dark:border-[#D4AF37]/20"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F5EEE2] dark:bg-[#1A3328] border border-[#2D4739]/15 dark:border-[#D4AF37]/20 flex items-center justify-center text-2xl mb-4">
                    {p.symbol}
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0] mt-3 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2D4739]/10 dark:border-[#D4AF37]/15 flex items-center gap-1.5 text-xs text-[#1E3A2F] dark:text-[#D4AF37] font-semibold">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Protected by Design</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
