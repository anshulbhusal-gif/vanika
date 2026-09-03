import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Globe, Target, Brain, Users, Clock } from 'lucide-react';
import { ActiveView, Language, OnboardingData } from '../../types';
import { NER_LANGUAGES } from '../../data/mockData';

interface OnboardingFlowProps {
  onNavigate: (view: ActiveView) => void;
  onSelectLanguage: (lang: Language) => void;
}

const TOTAL_STEPS = 6;

const AGE_GROUPS = [
  { id: '55-60', label: '55–60 years' },
  { id: '60-65', label: '60–65 years' },
  { id: '65-70', label: '65–70 years' },
  { id: '70-75', label: '70–75 years' },
  { id: '75-80', label: '75–80 years' },
  { id: '80+', label: '80+ years' },
];

const PRACTICE_AREAS = [
  { id: 'memory', label: 'Memory', icon: '🧠', desc: 'Remember names, faces, and daily tasks' },
  { id: 'attention', label: 'Attention', icon: '👁️', desc: 'Stay focused on tasks and activities' },
  { id: 'pattern', label: 'Pattern Recognition', icon: '🔷', desc: 'Recognize patterns and sequences' },
  { id: 'daily', label: 'Daily Recall', icon: '📋', desc: 'Remember your daily routine' },
  { id: 'cultural', label: 'Cultural Activities', icon: '🏛️', desc: 'Heritage-based exercises' },
];

const DAILY_GOALS = [
  { id: 1, label: '1 activity', time: '~5 minutes', desc: 'Quick and easy' },
  { id: 2, label: '2 activities', time: '~10 minutes', desc: 'A nice daily habit' },
  { id: 3, label: '3 activities', time: '~15 minutes', desc: 'A thorough session' },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onNavigate,
  onSelectLanguage,
}) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    ageGroup: '',
    language: 'English',
    dailyGoal: 2,
    practiceAreas: [],
    caregiverPhone: '',
  });

  const canProceed = () => {
    switch (step) {
      case 1: return data.name.trim().length > 0;
      case 2: return data.ageGroup !== '';
      case 3: return true; // language always has a default
      case 4: return true;
      case 5: return data.practiceAreas.length > 0;
      case 6: return true; // caregiver is optional
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      onNavigate('patient-app');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const togglePracticeArea = (id: string) => {
    setData(prev => ({
      ...prev,
      practiceAreas: prev.practiceAreas.includes(id)
        ? prev.practiceAreas.filter(a => a !== id)
        : [...prev.practiceAreas, id],
    }));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col" id="view-onboarding">
      {/* Progress Bar */}
      <div className="w-full bg-[#F5EFE6] h-2">
        <div
          className="h-full bg-gradient-to-r from-[#2D4739] to-[#D4AF37] rounded-r-full transition-all duration-500 ease-out"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 py-6 px-4">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold transition-all duration-300 ${
                i + 1 < step
                  ? 'bg-[#2D4739] text-[#FDFBF7]'
                  : i + 1 === step
                  ? 'bg-[#D4AF37] text-[#1E3A2F] shadow-lg scale-110'
                  : 'bg-[#F5EFE6] text-[#52635D]'
              }`}
            >
              {i + 1 < step ? <Check className="w-5 h-5" /> : i + 1}
            </div>
            {i < TOTAL_STEPS - 1 && (
              <div className={`w-8 h-0.5 rounded-full hidden sm:block ${
                i + 1 < step ? 'bg-[#2D4739]' : 'bg-[#EAE2D2]'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-xl">
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="text-center animate-slide-in-up">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#D4AF37]/15 flex items-center justify-center mb-6">
                <span className="text-5xl">👋</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1E3A2F] mb-3">
                What is your name?
              </h2>
              <p className="text-base text-[#52635D] mb-8">
                We would love to greet you by name every day.
              </p>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full max-w-md mx-auto block py-5 px-6 text-xl font-bold text-center rounded-2xl bg-white border-2 border-[#2D4739]/15 text-[#1E3A2F] placeholder-[#52635D]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15 transition-all"
                autoFocus
                id="input-onboard-name"
              />
            </div>
          )}

          {/* Step 2: Age Group */}
          {step === 2 && (
            <div className="text-center animate-slide-in-up">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#6A9B96]/15 flex items-center justify-center mb-6">
                <Clock className="w-10 h-10 text-[#6A9B96]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1E3A2F] mb-3">
                What is your age group?
              </h2>
              <p className="text-base text-[#52635D] mb-8">
                This helps us choose the right difficulty level for you.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                {AGE_GROUPS.map((age) => (
                  <button
                    key={age.id}
                    onClick={() => setData({ ...data, ageGroup: age.id })}
                    className={`py-4 px-3 rounded-2xl font-bold text-base transition-all cursor-pointer border-2 ${
                      data.ageGroup === age.id
                        ? 'bg-[#2D4739] text-[#FDFBF7] border-[#2D4739] shadow-lg'
                        : 'bg-white text-[#1E3A2F] border-[#2D4739]/15 hover:border-[#D4AF37]'
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Language */}
          {step === 3 && (
            <div className="text-center animate-slide-in-up">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#C66B44]/15 flex items-center justify-center mb-6">
                <Globe className="w-10 h-10 text-[#C66B44]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1E3A2F] mb-3">
                Choose your language
              </h2>
              <p className="text-base text-[#52635D] mb-8">
                Activities and voice will be in this language.
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                {NER_LANGUAGES.slice(0, 6).map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setData({ ...data, language: lang.id as Language });
                      onSelectLanguage(lang.id as Language);
                    }}
                    className={`py-4 px-4 rounded-2xl text-left transition-all cursor-pointer border-2 ${
                      data.language === lang.id
                        ? 'bg-[#2D4739] text-[#FDFBF7] border-[#2D4739] shadow-lg'
                        : 'bg-white text-[#1E3A2F] border-[#2D4739]/15 hover:border-[#D4AF37]'
                    }`}
                  >
                    <span className="block text-lg font-extrabold">{lang.nativeScript}</span>
                    <span className={`block text-xs mt-0.5 ${
                      data.language === lang.id ? 'text-[#D4AF37]' : 'text-[#52635D]'
                    }`}>
                      {lang.name} · {lang.region}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Daily Goal */}
          {step === 4 && (
            <div className="text-center animate-slide-in-up">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#D4AF37]/15 flex items-center justify-center mb-6">
                <Target className="w-10 h-10 text-[#D4AF37]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1E3A2F] mb-3">
                Your daily goal
              </h2>
              <p className="text-base text-[#52635D] mb-8">
                How many activities would you like to do each day?
              </p>
              <div className="space-y-3 max-w-md mx-auto">
                {DAILY_GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setData({ ...data, dailyGoal: goal.id })}
                    className={`w-full flex items-center justify-between py-5 px-6 rounded-2xl transition-all cursor-pointer border-2 ${
                      data.dailyGoal === goal.id
                        ? 'bg-[#2D4739] text-[#FDFBF7] border-[#2D4739] shadow-lg'
                        : 'bg-white text-[#1E3A2F] border-[#2D4739]/15 hover:border-[#D4AF37]'
                    }`}
                  >
                    <div className="text-left">
                      <span className="block text-lg font-extrabold">{goal.label}</span>
                      <span className={`block text-sm ${
                        data.dailyGoal === goal.id ? 'text-[#D4AF37]' : 'text-[#52635D]'
                      }`}>
                        {goal.desc}
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${
                      data.dailyGoal === goal.id ? 'text-[#D4AF37]' : 'text-[#6A9B96]'
                    }`}>
                      {goal.time}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Practice Areas */}
          {step === 5 && (
            <div className="text-center animate-slide-in-up">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#6A9B96]/15 flex items-center justify-center mb-6">
                <Brain className="w-10 h-10 text-[#6A9B96]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1E3A2F] mb-3">
                What would you like to practice?
              </h2>
              <p className="text-base text-[#52635D] mb-8">
                Choose one or more areas. You can change this later.
              </p>
              <div className="space-y-3 max-w-md mx-auto">
                {PRACTICE_AREAS.map((area) => {
                  const isSelected = data.practiceAreas.includes(area.id);
                  return (
                    <button
                      key={area.id}
                      onClick={() => togglePracticeArea(area.id)}
                      className={`w-full flex items-center gap-4 py-4 px-5 rounded-2xl transition-all cursor-pointer border-2 text-left ${
                        isSelected
                          ? 'bg-[#2D4739] text-[#FDFBF7] border-[#2D4739] shadow-lg'
                          : 'bg-white text-[#1E3A2F] border-[#2D4739]/15 hover:border-[#D4AF37]'
                      }`}
                    >
                      <span className="text-3xl">{area.icon}</span>
                      <div className="flex-1">
                        <span className="block text-base font-extrabold">{area.label}</span>
                        <span className={`block text-sm ${
                          isSelected ? 'text-[#EAE2D2]' : 'text-[#52635D]'
                        }`}>
                          {area.desc}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 text-[#1E3A2F]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 6: Caregiver Connection */}
          {step === 6 && (
            <div className="text-center animate-slide-in-up">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#C66B44]/15 flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-[#C66B44]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#1E3A2F] mb-3">
                Connect a caregiver
              </h2>
              <p className="text-base text-[#52635D] mb-2">
                A family member or caregiver can monitor your progress.
              </p>
              <p className="text-sm text-[#6A9B96] font-semibold mb-8">
                This is optional — you can do this later.
              </p>
              <input
                type="tel"
                value={data.caregiverPhone}
                onChange={(e) => setData({ ...data, caregiverPhone: e.target.value })}
                placeholder="Caregiver's phone number (optional)"
                className="w-full max-w-md mx-auto block py-5 px-6 text-lg font-bold text-center rounded-2xl bg-white border-2 border-[#2D4739]/15 text-[#1E3A2F] placeholder-[#52635D]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/15 transition-all"
                id="input-onboard-caregiver"
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-[#FDFBF7] border-t border-[#2D4739]/10 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-2 py-3 px-5 rounded-2xl text-sm font-bold text-[#52635D] hover:text-[#1E3A2F] hover:bg-[#F5EFE6] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <span className="text-sm font-bold text-[#52635D]">
            {step} of {TOTAL_STEPS}
          </span>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 py-3 px-7 rounded-2xl bg-[#1E3A2F] hover:bg-[#2D4739] text-[#FDFBF7] font-extrabold text-base shadow-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-accessible"
            id="btn-onboard-next"
          >
            <span>{step === TOTAL_STEPS ? 'Get Started' : 'Continue'}</span>
            {step === TOTAL_STEPS ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
