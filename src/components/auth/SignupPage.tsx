import React, { useState } from 'react';
import { Eye, EyeOff, Phone, Lock, User, ArrowRight, ArrowLeft, Users, Stethoscope, Leaf } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ActiveView, Language } from '../../types';

interface SignupPageProps {
  onNavigate: (view: ActiveView) => void;
  currentLanguage: Language;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const auth = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'elder' | 'caregiver'>('elder');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      await auth.register({
        fullName: name.trim(),
        phone: phone.trim(),
        password,
        role: role === 'caregiver' ? 'CAREGIVER' : 'ELDER',
      });
      onNavigate('onboarding');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-6 py-10 bg-[#FDFBF7] dark:bg-[#0C1A11]" id="view-signup">
      <div className="max-w-xl mx-auto w-full my-auto">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('login')}
          className="flex items-center gap-2 text-xs font-semibold text-[#5A7265] hover:text-[#1A2F24] dark:text-[#9DBFB0] dark:hover:text-[#F2EDE3] mb-8 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1E3A2F] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center text-2xl shadow-md mb-4">
            🌿
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A2F24] dark:text-[#F2EDE3] tracking-tight">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-[#5A7265] dark:text-[#9DBFB0]">
            Join our cognitive wellness community in North Eastern India
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setRole('elder')}
            className={`card-story p-5 text-left cursor-pointer transition-all ${
              role === 'elder'
                ? 'bg-[#1E3A2F] text-[#FDFBF7] border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                : 'bg-white dark:bg-[#162A1F] text-[#1A2F24] dark:text-[#F2EDE3] border-[#2D4739]/15 dark:border-[#D4AF37]/20 hover:border-[#D4AF37]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-xl mb-3">
              👴🏽
            </div>
            <h3 className="font-display text-lg font-bold">Elder Account</h3>
            <p className="text-[11px] opacity-80 mt-1">For patients seeking memory activities & AI companionship</p>
          </button>

          <button
            type="button"
            onClick={() => setRole('caregiver')}
            className={`card-story p-5 text-left cursor-pointer transition-all ${
              role === 'caregiver'
                ? 'bg-[#1E3A2F] text-[#FDFBF7] border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                : 'bg-white dark:bg-[#162A1F] text-[#1A2F24] dark:text-[#F2EDE3] border-[#2D4739]/15 dark:border-[#D4AF37]/20 hover:border-[#D4AF37]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#C06A44]/20 text-[#C06A44] flex items-center justify-center text-xl mb-3">
              🛡️
            </div>
            <h3 className="font-display text-lg font-bold">Caregiver Vault</h3>
            <p className="text-[11px] opacity-80 mt-1">For family & health workers monitoring trends & photos</p>
          </button>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="signup-name" className="block text-xs font-semibold text-[#1A2F24] dark:text-[#F2EDE3] mb-2 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B9E87]" />
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-11 pr-4 py-3.5 text-sm font-semibold rounded-2xl bg-white dark:bg-[#162A1F] border border-[#2D4739]/20 dark:border-[#D4AF37]/30 text-[#1A2F24] dark:text-[#F2EDE3] focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="signup-phone" className="block text-xs font-semibold text-[#1A2F24] dark:text-[#F2EDE3] mb-2 uppercase tracking-wider">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B9E87]" />
              <input
                id="signup-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-11 pr-4 py-3.5 text-sm font-semibold rounded-2xl bg-white dark:bg-[#162A1F] border border-[#2D4739]/20 dark:border-[#D4AF37]/30 text-[#1A2F24] dark:text-[#F2EDE3] focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-xs font-semibold text-[#1A2F24] dark:text-[#F2EDE3] mb-2 uppercase tracking-wider">
              Create Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B9E87]" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full pl-11 pr-11 py-3.5 text-sm font-semibold rounded-2xl bg-white dark:bg-[#162A1F] border border-[#2D4739]/20 dark:border-[#D4AF37]/30 text-[#1A2F24] dark:text-[#F2EDE3] focus:outline-none focus:border-[#D4AF37] transition-all"
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

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 text-base mt-6"
            id="btn-signup-submit"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-[#5A7265] dark:text-[#9DBFB0]">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="font-bold text-[#C06A44] dark:text-[#D4AF37] hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
