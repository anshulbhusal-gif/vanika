import React, { useState, useEffect } from 'react';
import { Heart, Activity, Brain, Clock, ShieldCheck, UserCheck, Calendar, RefreshCw, Sparkles, AlertCircle, ArrowLeft, Download, Plus, Image as ImageIcon, Trash2, Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import { AlertCard } from './AlertCard';
import { CognitiveTrendCharts } from './CognitiveTrendCharts';
import { RemindersManager } from './RemindersManager';
import { CulturalCareGuide } from './CulturalCareGuide';
import { PatientProfile, Language, ActiveView, MemoryPhotoItem } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { vanikaStorage } from '../../utils/storage';
import { SafeImage } from '../common/SafeImage';
import { apiClient } from '../../services/api/apiClient';

interface CaregiverDashboardProps {
  currentLanguage: Language;
  onNavigate: (view: ActiveView) => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  currentLanguage,
  onNavigate
}) => {
  const [patient, setPatient] = useState<PatientProfile>(() => {
    try {
      return vanikaStorage.getProfile();
    } catch (e) {
      return {
        id: 'patient-001',
        name: 'Bhaben Hazarika',
        age: 72,
        location: 'Guwahati, Assam',
        primaryLanguage: 'Assamese',
        memoryScore: 78,
        attentionScore: 82,
        moodStatus: 'Calm',
        streakDays: 6,
        adherenceRate: 92,
        lastSynced: 'Just now',
        weeklySessions: 14
      };
    }
  });

  const safePatient = patient || {
    id: 'patient-001',
    name: 'Bhaben Hazarika',
    age: 72,
    location: 'Guwahati, Assam',
    primaryLanguage: 'Assamese',
    memoryScore: 78,
    attentionScore: 82,
    moodStatus: 'Calm',
    streakDays: 6,
    adherenceRate: 92,
    lastSynced: 'Just now',
    weeklySessions: 14
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Photo form fields
  const [photoSourceTab, setPhotoSourceTab] = useState<'upload' | 'url'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [photoTitle, setPhotoTitle] = useState('');
  const [photoPerson, setPhotoPerson] = useState('');
  const [photoRel, setPhotoRel] = useState('Son');
  const [photoYear, setPhotoYear] = useState('2024');
  const [photoLocation, setPhotoLocation] = useState('Guwahati, Assam');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPrompt, setPhotoPrompt] = useState('');
  const [photoOptions, setPhotoOptions] = useState('Your Son, Uncle Mohan, Dr. Sharma, Neighbour Barua');

  useEffect(() => {
    try {
      setPatient(vanikaStorage.getProfile());
    } catch (e) {
      console.warn('Notice reading profile in dashboard:', e);
    }
  }, []);

  const handleRefresh = () => {
    soundSynth.playWaterDrop();
    setIsRefreshing(true);
    setTimeout(() => {
      const refreshed = vanikaStorage.getProfile();
      setPatient({
        ...refreshed,
        lastSynced: 'Just now'
      });
      setIsRefreshing(false);
    }, 800);
  };

  const handleExportVault = () => {
    soundSynth.playCelebration();
    const vaultJson = vanikaStorage.exportFullVault();
    const blob = new Blob([vaultJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vanika-patient-vault-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice('AES-256 Encrypted Vault downloaded successfully!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Step 8: Client-side validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setFileError('Please select a valid image file in JPEG, PNG, or WebP format.');
      e.target.value = '';
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError('Please select a photo file under 5 MB in size.');
      e.target.value = '';
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);

    // Step 9: Immediate Preview using FileReader
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setPreviewUrl(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim() || !photoPerson.trim()) return;

    if (photoSourceTab === 'upload' && !selectedFile) {
      setFileError('Please select a photo file to upload.');
      return;
    }

    if (photoSourceTab === 'url' && !photoUrl.trim()) {
      setFileError('Please enter a valid image web URL.');
      return;
    }

    setIsUploading(true);
    setFileError(null);
    soundSynth.playGentleChime();

    const optsArray = photoOptions.split(',').map(s => s.trim()).filter(Boolean);
    let finalImageUrl = photoUrl.trim() || previewUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80';

    if (photoSourceTab === 'upload' && selectedFile) {
      try {
        const formData = new FormData();
        formData.append('photo', selectedFile);
        formData.append('promptText', photoPrompt || `Can you recall who is in this memory photo taken in ${photoYear}?`);
        formData.append('hint', photoPrompt);
        formData.append('title', photoTitle);
        formData.append('options', photoOptions);
        formData.append('correctAnswer', photoPerson);

        const uploadedItem = await apiClient.uploadFormData('/games/content/upload-photo', formData);
        if (uploadedItem && uploadedItem.mediaUrl) {
          finalImageUrl = uploadedItem.mediaUrl;
        }
      } catch (err: any) {
        console.warn('Backend photo upload notice (using fallback local vault mode):', err?.message || err);
        // Fall back to data URL preview for local vault mode if server is offline
        if (previewUrl) {
          finalImageUrl = previewUrl;
        }
      }
    }

    const newPhoto: MemoryPhotoItem = {
      id: `custom-photo-${Date.now()}`,
      title: photoTitle,
      personName: photoPerson,
      relationship: photoRel,
      year: photoYear,
      location: photoLocation,
      imageUrl: finalImageUrl,
      audioPrompt: photoPrompt || `Can you recall who is in this memory photo taken in ${photoYear}?`,
      options: optsArray.length >= 2 ? optsArray : [photoPerson, 'Uncle Mohan', 'Dr. Sharma', 'Family Friend'],
      correctAnswer: photoPerson,
      storyNote: `Uploaded by family caregiver. ${photoPerson} (${photoRel}) in ${photoLocation}.`
    };

    vanikaStorage.addMemoryPhoto(newPhoto);
    setIsUploading(false);
    setShowPhotoModal(false);

    // Reset state
    setPhotoTitle('');
    setPhotoPerson('');
    setPhotoUrl('');
    setPhotoPrompt('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileError(null);
    setExportNotice('New Family Memory Photo saved to encrypted patient vault!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-8" id="view-caregiver-portal">

      {/* ── PREMIUM HEADER VAULT CARD ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1E17] via-[#1E3A2F] to-[#2D4739] text-[#FDFBF7] p-7 sm:p-10 shadow-2xl animate-slide-in-up">
        {/* Ambient glow orbs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#C66B44]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Status Badges */}
        <div className="relative z-10 flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-black">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-status-pulse" />
            🔒 AES-256 Encrypted
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-xs font-black">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-status-pulse" />
            ✅ DPDP 2023 Compliant
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-400/15 border border-blue-400/25 text-blue-300 text-xs font-black">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-status-pulse" />
            ⚡ Live Sync Active
          </span>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37] text-[#1E3A2F] flex items-center justify-center font-heading font-extrabold text-3xl shadow-lg animate-companion-breathe shrink-0">
              👴🏽
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#FDFBF7]">
                  Good morning, Anita
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37]">
                  Primary Caregiver
                </span>
              </div>
              <p className="text-sm text-[#EAE2D2] mt-0.5">
                Monitoring <strong>{safePatient.name}</strong> — Age {safePatient.age}, {safePatient.location}
              </p>
              <div className="flex items-center gap-3 text-xs text-[#EAE2D2]/70 mt-2 flex-wrap">
                <span>📍 {safePatient.primaryLanguage}</span>
                <span>•</span>
                <span>🔥 {safePatient.streakDays}-Day Streak</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#D4AF37]">
                  <Clock className="w-3.5 h-3.5" /> {safePatient.lastSynced}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-stretch md:self-auto justify-end flex-wrap">
            <button
              onClick={() => { soundSynth.playSoftClick(); setShowPhotoModal(true); }}
              className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C45B] text-[#1E3A2F] text-xs font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer shadow-md"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>+ Add Family Photo</span>
            </button>
            <button
              onClick={handleExportVault}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FDFBF7] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
            >
              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Export Vault</span>
            </button>
            <button
              onClick={handleRefresh}
              className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FDFBF7] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
            <button
              onClick={() => { soundSynth.playSoftClick(); onNavigate('patient-app'); }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FDFBF7] text-xs font-extrabold hover:text-[#D4AF37] transition-colors cursor-pointer border border-white/15"
            >
              Patient View →
            </button>
          </div>
        </div>
      </div>

      {exportNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 font-semibold text-sm animate-fadeIn">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Add Memory Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FDFBF7] border border-[#2D4739]/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-[#1E3A2F] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2D4739]/15 pb-3">
              <h3 className="font-heading font-extrabold text-xl text-[#1E3A2F] flex items-center gap-2">
                <span>📸</span> Add Family Memory Photo
              </h3>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="w-8 h-8 rounded-full bg-[#EDE5D2] text-[#1E3A2F] hover:bg-[#C66B44] hover:text-white flex items-center justify-center transition-colors"
                disabled={isUploading}
              >
                ✕
              </button>
            </div>

            {/* Photo Source Choice Tabs (Step 7) */}
            <div className="flex rounded-2xl bg-[#EDE5D2]/60 p-1 border border-[#2D4739]/15">
              <button
                type="button"
                onClick={() => { setPhotoSourceTab('upload'); setFileError(null); }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  photoSourceTab === 'upload'
                    ? 'bg-[#2D4739] text-[#FDFBF7] shadow-md'
                    : 'text-[#1E3A2F] hover:bg-white/50'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Option A: Upload Photo</span>
              </button>
              <button
                type="button"
                onClick={() => { setPhotoSourceTab('url'); setFileError(null); }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  photoSourceTab === 'url'
                    ? 'bg-[#2D4739] text-[#FDFBF7] shadow-md'
                    : 'text-[#1E3A2F] hover:bg-white/50'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Option B: Paste Image URL</span>
              </button>
            </div>

            {fileError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            <form onSubmit={handleAddPhoto} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold mb-1">Memory Photo Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Rongali Bihu Family Gathering 1998"
                  value={photoTitle}
                  onChange={e => setPhotoTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#2D4739]/20"
                  required
                  disabled={isUploading}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Person Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Son Ravi"
                    value={photoPerson}
                    onChange={e => setPhotoPerson(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#2D4739]/20"
                    required
                    disabled={isUploading}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Relationship</label>
                  <input
                    type="text"
                    placeholder="e.g. Son / Granddaughter"
                    value={photoRel}
                    onChange={e => setPhotoRel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#2D4739]/20"
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Year / Event</label>
                  <input
                    type="text"
                    placeholder="e.g. 1998 — Bihu"
                    value={photoYear}
                    onChange={e => setPhotoYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#2D4739]/20"
                    disabled={isUploading}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Guwahati, Assam"
                    value={photoLocation}
                    onChange={e => setPhotoLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#2D4739]/20"
                    disabled={isUploading}
                  />
                </div>
              </div>

              {/* Photo Input section based on tab choice */}
              <div>
                {photoSourceTab === 'upload' ? (
                  <div>
                    <label className="block font-bold mb-1">Select Image File (JPEG, PNG, WebP up to 5 MB) *</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileSelect}
                      className="w-full text-xs text-[#1E3A2F] file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#2D4739] file:text-[#FDFBF7] hover:file:bg-[#1E3A2F] cursor-pointer border border-[#2D4739]/20 rounded-xl p-1 bg-white"
                      disabled={isUploading}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold mb-1">Image Web URL *</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={photoUrl}
                      onChange={e => setPhotoUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#2D4739]/20"
                      disabled={isUploading}
                    />
                  </div>
                )}

                {/* Step 9: Image Preview using SafeImage */}
                {(previewUrl || photoUrl) && (
                  <div className="mt-2.5 p-2 bg-[#EDE5D2]/50 border border-[#2D4739]/15 rounded-xl flex items-center gap-3 animate-fadeIn">
                    <SafeImage
                      src={previewUrl || photoUrl}
                      alt="Memory preview"
                      className="w-14 h-14 rounded-lg object-cover border border-white shadow-xs shrink-0"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#1E3A2F] block">Photo Preview Ready</span>
                      <span className="text-[11px] text-[#52635D]">
                        {selectedFile ? `${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)` : 'Web image URL loaded'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1">Spoken Audio Hint / Question</label>
                <input
                  type="text"
                  placeholder="e.g. Can you remember who brought the golden Muga silk shawl?"
                  value={photoPrompt}
                  onChange={e => setPhotoPrompt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#2D4739]/20"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Multiple Choice Options (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Son Ravi, Uncle Mohan, Dr. Sharma, Neighbour Barua"
                  value={photoOptions}
                  onChange={e => setPhotoOptions(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#2D4739]/20"
                  disabled={isUploading}
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#EDE5D2] text-[#1E3A2F] font-bold hover:bg-[#E2D8C3]"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-[#2D4739] text-[#FDFBF7] font-bold hover:bg-[#1E3A2F] flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      <span>Saving Photo...</span>
                    </>
                  ) : (
                    <span>Save to Encrypted Vault</span>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      )}



      {/* ── 4 PREMIUM METRIC CARDS WITH PROGRESS BARS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-slide-in-up-delay-1">

        {/* Memory Score */}
        <div className="relative overflow-hidden bg-white border border-[#2D4739]/12 rounded-3xl p-5 shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#C66B44]/08 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-[#52635D] uppercase tracking-wider">Memory</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C66B44] to-[#D9835E] flex items-center justify-center text-lg shadow-sm">
              🖼️
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-4xl font-extrabold font-heading text-[#1E3A2F]">{safePatient.memoryScore}</span>
            <span className="text-sm font-bold text-[#52635D]">/100</span>
          </div>
          <div className="w-full h-2 bg-[#F5EFE6] rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-[#C66B44] to-[#D9835E] rounded-full transition-all duration-1000"
              style={{ width: `${safePatient.memoryScore}%` }}
            />
          </div>
          <p className="text-[11px] text-[#52635D] mt-1.5">↑ 2 pts from weekly baseline</p>
        </div>

        {/* Attention Score */}
        <div className="relative overflow-hidden bg-white border border-[#2D4739]/12 rounded-3xl p-5 shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#6A9B96]/08 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-[#52635D] uppercase tracking-wider">Attention</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D4739] to-[#3E6250] flex items-center justify-center text-lg shadow-sm">
              👀
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-4xl font-extrabold font-heading text-[#1E3A2F]">{safePatient.attentionScore}</span>
            <span className="text-sm font-bold text-[#52635D]">/100</span>
          </div>
          <div className="w-full h-2 bg-[#F5EFE6] rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-[#2D4739] to-[#6A9B96] rounded-full transition-all duration-1000"
              style={{ width: `${safePatient.attentionScore}%` }}
            />
          </div>
          <p className="text-[11px] text-[#52635D] mt-1.5">Steady visual scan speed</p>
        </div>

        {/* Mood */}
        <div className="relative overflow-hidden bg-white border border-[#2D4739]/12 rounded-3xl p-5 shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/08 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-[#52635D] uppercase tracking-wider">Mood</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#E5C45B] flex items-center justify-center text-lg shadow-sm">
              😊
            </div>
          </div>
          <div className="text-3xl font-extrabold font-heading text-[#1E3A2F] mb-1">{safePatient.moodStatus}</div>
          <div className="w-full h-2 bg-[#F5EFE6] rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E5C45B] rounded-full" style={{ width: '85%' }} />
          </div>
          <p className="text-[11px] text-[#52635D] mt-1.5">0 agitation logs today</p>
        </div>

        {/* Adherence */}
        <div className="relative overflow-hidden bg-white border border-[#2D4739]/12 rounded-3xl p-5 shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#1E3A2F]/06 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-[#52635D] uppercase tracking-wider">Adherence</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A2F] to-[#2D4739] flex items-center justify-center text-lg shadow-sm">
              ✅
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-4xl font-extrabold font-heading text-[#1E3A2F]">{safePatient.adherenceRate}</span>
            <span className="text-sm font-bold text-[#52635D]">%</span>
          </div>
          <div className="w-full h-2 bg-[#F5EFE6] rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-[#1E3A2F] to-[#3E6250] rounded-full transition-all duration-1000"
              style={{ width: `${safePatient.adherenceRate}%` }}
            />
          </div>
          <p className="text-[11px] text-[#52635D] mt-1.5">6 of 7 daily routines met</p>
        </div>
      </div>

      {/* Non-Alarming Early Decline Alert Card */}
      <AlertCard patientName={safePatient.name} />


      {/* Cognitive Trends Analytics */}
      <CognitiveTrendCharts />

      {/* Reminders & Routine Manager */}
      <RemindersManager currentLanguage={currentLanguage} />

      {/* Indigenous Cultural Knowledge Base */}
      <CulturalCareGuide />

    </div>
  );
};
