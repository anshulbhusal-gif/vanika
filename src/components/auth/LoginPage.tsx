import React, { useState } from 'react';
import { Eye, EyeOff, Phone, Lock, ArrowRight, Globe, Heart, Leaf } from 'lucide-react';
import { ActiveView, Language } from '../../types';
import { NER_LANGUAGES } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
  onNavigate: (view: ActiveView) => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate,
  currentLanguage,
  onSelectLanguage,
}) => {
  const auth = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const identifier = phone.trim();
    if (!identifier) {
      setErrorMessage('Please enter your phone number or email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);
    try {
      const loggedInUser = await auth.login(identifier, password);
      const role = loggedInUser?.role ?? 'ELDER';
      if (role === 'CAREGIVER' || role === 'ADMIN') {
        onNavigate('caregiver-portal');
      } else {
        onNavigate('patient-app');
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('credentials') || msg.toLowerCase().includes('password') || msg.toLowerCase().includes('not found')) {
        setErrorMessage('The phone number, email or password you entered is incorrect. Please try again.');
      } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('failed to fetch')) {
        setErrorMessage('Unable to connect. Please check your internet connection and try again.');
      } else if (msg) {
        setErrorMessage(msg);
      } else {
        setErrorMessage('Sign in failed. Please check your details and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FDFBF7] dark:bg-[#0C1A11]" id="view-login">
      {/* Left: Editorial Landscape Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1E3A2F] text-[#FDFBF7] items-center justify-center overflow-hidden p-16">
        <div className="hero-orb-gold -top-20 -left-20" />
        <div className="hero-orb-emerald bottom-10 right-0" />
        <div className="absolute inset-0 bg-ner-weave-dark opacity-35 pointer-events-none" />

        <div className="relative z-10 text-center max-w-lg space-y-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-4xl shadow-md animate-companion-breathe">
            🌿
          </div>
          
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#FDFBF7] leading-tight">
            A gentle space <br />for your memories.
          </h2>

          <p className="prose-elder text-[#C8D8CF] text-base leading-relaxed">
            Voice-guided cognitive activities rooted in the heritage, songs, and languages of North Eastern India.
          </p>

          <div className="pt-6 flex items-center justify-center gap-6 font-mono-label text-xs text-[#D4AF37]">
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
              VOICE-FIRST
            </span>
            <span>•</span>
            <span>6 NER LANGUAGES</span>
            <span>•</span>
            <span>100% OFFLINE</span>
          </div>
        </div>
      </div>

      {/* Right: Sign-In Form */}
      <div className="flex-1 flex flex-col justify-between px-6 sm:px-12 lg:px-16 py-10 max-w-2xl mx-auto w-full">
        {/* Top Navbar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1E3A2F] text-[#D4AF37] flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="font-display text-lg font-bold text-[#1A2F24] dark:text-[#F2EDE3]">Vanika</span>
          </button>

          {/* Language dropdown */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#162A1F] border border-[#2D4739]/15 dark:border-[#D4AF37]/25 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-[#7B9E87]" />
            <select
              value={currentLanguage}
              onChange={(e) => onSelectLanguage(e.target.value as Language)}
              className="bg-transparent text-[#1A2F24] dark:text-[#F2EDE3] font-bold focus:outline-none cursor-pointer"
              aria-label="Select language"
            >
              {NER_LANGUAGES.slice(0, 6).map((lang) => (
                <option key={lang.id} value={lang.id} className="dark:bg-[#162A1F]">
                  {lang.nativeScript} ({lang.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center Content */}
        <div className="my-auto py-8">
          <div className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-[#5A7265] dark:text-[#9DBFB0]">
              Sign in to return to your personal courtyard or caregiver dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Identifier */}
            <div>
              <label htmlFor="login-phone" className="block text-xs font-semibold text-[#1A2F24] dark:text-[#F2EDE3] mb-2 uppercase tracking-wider">
                Phone Number or Email
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B9E87]" />
                <input
                  id="login-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-11 pr-4 py-3.5 text-sm font-semibold rounded-2xl bg-white dark:bg-[#162A1F] border border-[#2D4739]/20 dark:border-[#D4AF37]/30 text-[#1A2F24] dark:text-[#F2EDE3] placeholder-[#5A7265]/50 focus:outline-none focus:border-[#D4AF37] transition-all"
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-[#1A2F24] dark:text-[#F2EDE3] mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B9E87]" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-3.5 text-sm font-semibold rounded-2xl bg-white dark:bg-[#162A1F] border border-[#2D4739]/20 dark:border-[#D4AF37]/30 text-[#1A2F24] dark:text-[#F2EDE3] placeholder-[#5A7265]/50 focus:outline-none focus:border-[#D4AF37] transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#5A7265] hover:text-[#1A2F24] dark:hover:text-[#F2EDE3]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-[#C06A44]/10 border border-[#C06A44]/30 text-[#C06A44] text-xs font-semibold text-center">
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 text-base"
              id="btn-login-submit"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Create Account Link */}
          <div className="mt-8 pt-6 border-t border-[#2D4739]/10 dark:border-[#D4AF37]/15 text-center space-y-4">
            <button
              onClick={() => onNavigate('signup')}
              className="btn-ghost w-full py-3.5 text-sm font-semibold"
              id="btn-login-create-account"
            >
              Create New Account
            </button>

            <div>
              <button
                onClick={() => onNavigate('home')}
                className="text-xs font-semibold text-[#5A7265] dark:text-[#9DBFB0] hover:text-[#C06A44] cursor-pointer"
              >
                Explore Vanika Demo →
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-[#5A7265] dark:text-[#9DBFB0] text-center">
          Encrypted with local-first AES-256 security • DPDP Act 2023 Compliant
        </p>
      </div>
    </div>
  );
};
