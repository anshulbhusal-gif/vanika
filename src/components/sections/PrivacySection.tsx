import React from 'react';
import { ShieldCheck, HardDrive, Lock, UserCheck, Sparkles, CheckCircle } from 'lucide-react';

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
    <section className="py-12 sm:py-16 bg-[#FDFBF7]" id="section-privacy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D4739]/10 text-[#1E3A2F] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D4739]" />
            Privacy & Trust
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#1E3A2F] tracking-tight">
            Your memories stay yours.
          </h2>
          <p className="mt-3 text-lg sm:text-xl text-[#52635D] leading-relaxed">
            We treat personal family photographs and voice stories with ancestral reverence. Built to comply with India’s DPDP Act 2023.
          </p>
        </div>

        {/* Visual Privacy Flow Architecture */}
        <div className="bg-[#FFFFFF] border border-[#2D4739]/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C66B44] block mb-4">
            Visual Security Pathway
          </span>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm font-bold text-[#1E3A2F]">
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#2D4739]/20 shadow-2xs w-full sm:w-auto">
              <span className="text-2xl block mb-1">🖼️</span>
              <span>Family Photograph</span>
            </div>

            <span className="text-xl text-[#2D4739] rotate-90 sm:rotate-0 font-bold">→</span>

            <div className="p-4 rounded-2xl bg-[#F5EFE6] border border-[#2D4739]/30 shadow-2xs w-full sm:w-auto">
              <span className="text-2xl block mb-1">📱</span>
              <span>Your Safe Device</span>
            </div>

            <span className="text-xl text-[#2D4739] rotate-90 sm:rotate-0 font-bold">→</span>

            <div className="p-4 rounded-2xl bg-[#2D4739] text-[#FDFBF7] shadow-sm w-full sm:w-auto">
              <span className="text-2xl block mb-1">🔒</span>
              <span>AES-256 Local Encryption</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {privacyPillars.map((p) => {
            return (
              <div
                key={p.title}
                className="bg-white border border-[#2D4739]/15 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F5EFE6] border border-[#2D4739]/15 flex items-center justify-center text-2xl mb-4 shadow-2xs">
                    {p.symbol}
                  </div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-[#1E3A2F]">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52635D] mt-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2D4739]/10 flex items-center gap-1.5 text-xs text-[#2D4739] font-semibold">
                  <CheckCircle className="w-4 h-4 text-[#2D4739]" />
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
