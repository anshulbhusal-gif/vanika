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
        console.warn('Backend photo upload notice:', err?.message || err);
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
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0C1A11] py-8 sm:py-12" id="view-caregiver-portal">
      <div className="section-max space-y-10">

        {/* ── HEADER VAULT HERO ── */}
        <div className="card-story bg-gradient-to-br from-[#1E3A2F] via-[#2D4739] to-[#1E3A2F] text-[#FDFBF7] p-8 sm:p-12 border border-[#D4AF37]/35 shadow-xl">
          <div className="relative z-10 flex flex-wrap gap-2 mb-6">
            <span className="font-mono-label text-[10px] px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] tracking-widest">
              🔒 AES-256 ENCRYPTED
            </span>
            <span className="font-mono-label text-[10px] px-3 py-1 rounded-full bg-[#7B9E87]/20 border border-[#7B9E87]/40 text-[#7B9E87] tracking-widest">
              ✅ DPDP ACT 2023 COMPLIANT
            </span>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-4xl shadow-md shrink-0">
                👴🏽
              </div>
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
                  Caregiver Vault & Health Hub
                </h2>
                <p className="text-sm text-[#C8D8CF] mt-1">
                  Monitoring <strong>{safePatient.name}</strong> — Age {safePatient.age}, {safePatient.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => { soundSynth.playSoftClick(); setShowPhotoModal(true); }}
                className="btn-gold py-3 px-5 text-xs"
              >
                <ImageIcon className="w-4 h-4" />
                <span>+ Add Family Photo</span>
              </button>
              <button
                onClick={handleExportVault}
                className="btn-ghost text-white border-white/30 hover:bg-white/15 py-3 px-4 text-xs"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Export Vault</span>
              </button>
              <button
                onClick={handleRefresh}
                className="btn-ghost text-white border-white/30 hover:bg-white/15 py-3 px-4 text-xs"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            </div>
          </div>
        </div>

        {exportNotice && (
          <div className="p-4 rounded-2xl bg-[#7B9E87]/15 border border-[#7B9E87] text-[#1A2F24] dark:text-[#F2EDE3] flex items-center gap-3 font-semibold text-xs animate-slide-up">
            <ShieldCheck className="w-4 h-4 text-[#7B9E87] shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* Modal for photo upload */}
        {showPhotoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-slide-up">
            <div className="card-story w-full max-w-lg bg-white dark:bg-[#162A1F] p-8 border border-[#D4AF37]/30 shadow-2xl space-y-5 text-[#1A2F24] dark:text-[#F2EDE3] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#2D4739]/15 dark:border-[#D4AF37]/20 pb-4">
                <h3 className="font-display text-2xl font-bold flex items-center gap-2">
                  <span>📸</span> Add Family Photo
                </h3>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="w-8 h-8 rounded-full bg-[#F5EEE2] dark:bg-[#1A3328] flex items-center justify-center"
                  disabled={isUploading}
                >
                  ✕
                </button>
              </div>

              <div className="flex rounded-2xl bg-[#FDFBF7] dark:bg-[#0F2219] p-1 border border-[#2D4739]/15">
                <button
                  type="button"
                  onClick={() => { setPhotoSourceTab('upload'); setFileError(null); }}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-mono-label text-[10px] uppercase flex items-center justify-center gap-2 transition-all ${
                    photoSourceTab === 'upload'
                      ? 'bg-[#1E3A2F] text-[#D4AF37] font-bold shadow-xs'
                      : 'text-[#5A7265] dark:text-[#9DBFB0]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setPhotoSourceTab('url'); setFileError(null); }}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-mono-label text-[10px] uppercase flex items-center justify-center gap-2 transition-all ${
                    photoSourceTab === 'url'
                      ? 'bg-[#1E3A2F] text-[#D4AF37] font-bold shadow-xs'
                      : 'text-[#5A7265] dark:text-[#9DBFB0]'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Paste URL</span>
                </button>
              </div>

              {fileError && (
                <div className="p-3 rounded-xl bg-[#C06A44]/15 border border-[#C06A44] text-[#C06A44] text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}

              <form onSubmit={handleAddPhoto} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 uppercase tracking-wider">Memory Photo Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Bihu Family Gathering 1998"
                    value={photoTitle}
                    onChange={e => setPhotoTitle(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#FDFBF7] dark:bg-[#0F2219] border border-[#2D4739]/20 text-[#1A2F24] dark:text-[#F2EDE3]"
                    required
                    disabled={isUploading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 uppercase tracking-wider">Person Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Son Ravi"
                      value={photoPerson}
                      onChange={e => setPhotoPerson(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#FDFBF7] dark:bg-[#0F2219] border border-[#2D4739]/20 text-[#1A2F24] dark:text-[#F2EDE3]"
                      required
                      disabled={isUploading}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 uppercase tracking-wider">Relationship</label>
                    <input
                      type="text"
                      placeholder="e.g. Son"
                      value={photoRel}
                      onChange={e => setPhotoRel(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#FDFBF7] dark:bg-[#0F2219] border border-[#2D4739]/20 text-[#1A2F24] dark:text-[#F2EDE3]"
                      disabled={isUploading}
                    />
                  </div>
                </div>

                <div>
                  {photoSourceTab === 'upload' ? (
                    <div>
                      <label className="block font-semibold mb-1 uppercase tracking-wider">Select Image File (JPEG/PNG/WebP &lt; 5MB) *</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileSelect}
                        className="w-full text-xs text-[#1A2F24] dark:text-[#F2EDE3] file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1E3A2F] file:text-[#D4AF37] cursor-pointer border border-[#2D4739]/20 rounded-xl p-1 bg-[#FDFBF7] dark:bg-[#0F2219]"
                        disabled={isUploading}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block font-semibold mb-1 uppercase tracking-wider">Image Web URL *</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={photoUrl}
                        onChange={e => setPhotoUrl(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl bg-[#FDFBF7] dark:bg-[#0F2219] border border-[#2D4739]/20 text-[#1A2F24] dark:text-[#F2EDE3]"
                        disabled={isUploading}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-1 uppercase tracking-wider">Multiple Choice Options (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Son Ravi, Uncle Mohan, Dr. Sharma, Neighbour Barua"
                    value={photoOptions}
                    onChange={e => setPhotoOptions(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#FDFBF7] dark:bg-[#0F2219] border border-[#2D4739]/20 text-[#1A2F24] dark:text-[#F2EDE3]"
                    disabled={isUploading}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPhotoModal(false)}
                    className="btn-ghost py-3 px-5 text-xs"
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="btn-primary py-3 px-5 text-xs"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save to Vault</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-story bg-white dark:bg-[#162A1F] p-6 border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono-label text-[10px] text-[#7B9E87]">MEMORY RECALL</span>
              <span className="text-2xl">🖼️</span>
            </div>
            <div className="font-display text-4xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{safePatient.memoryScore}/100</div>
            <p className="text-xs text-[#7B9E87] mt-2">↑ 2 pts from weekly baseline</p>
          </div>

          <div className="card-story bg-white dark:bg-[#162A1F] p-6 border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono-label text-[10px] text-[#7B9E87]">VISUAL ATTENTION</span>
              <span className="text-2xl">👀</span>
            </div>
            <div className="font-display text-4xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{safePatient.attentionScore}/100</div>
            <p className="text-xs text-[#7B9E87] mt-2">Steady visual scan speed</p>
          </div>

          <div className="card-story bg-white dark:bg-[#162A1F] p-6 border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono-label text-[10px] text-[#7B9E87]">MOOD STATUS</span>
              <span className="text-2xl">😊</span>
            </div>
            <div className="font-display text-3xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{safePatient.moodStatus}</div>
            <p className="text-xs text-[#7B9E87] mt-2">0 agitation logs today</p>
          </div>

          <div className="card-story bg-white dark:bg-[#162A1F] p-6 border border-[#2D4739]/15 dark:border-[#D4AF37]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono-label text-[10px] text-[#7B9E87]">ROUTINE ADHERENCE</span>
              <span className="text-2xl">✅</span>
            </div>
            <div className="font-display text-4xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">{safePatient.adherenceRate}%</div>
            <p className="text-xs text-[#7B9E87] mt-2">6 of 7 daily routines met</p>
          </div>
        </div>

        {/* Existing child modules preserved */}
        <AlertCard patientName={safePatient.name} />
        <CognitiveTrendCharts />
        <RemindersManager currentLanguage={currentLanguage} />
        <CulturalCareGuide />

      </div>
    </div>
  );
};
