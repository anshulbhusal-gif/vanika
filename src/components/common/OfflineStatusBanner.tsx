import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOfflineStatus } from '../../services/offline/useOfflineStatus';

export const OfflineStatusBanner: React.FC = () => {
  const { networkState, pendingCount, triggerSync } = useOfflineStatus();

  if (networkState === 'ONLINE' && pendingCount === 0) {
    return null; // Subtle & non-intrusive: hidden when fully online with zero pending sessions
  }

  return (
    <div className="bg-[#2D4739] text-[#FDFBF7] text-xs font-semibold py-1.5 px-4 flex items-center justify-between shadow-inner animate-fadeIn">
      <div className="flex items-center gap-2">
        {networkState === 'OFFLINE' ? (
          <>
            <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
            <span>Offline Mode Active. Cognitive games available from cache.</span>
          </>
        ) : networkState === 'SYNCING' ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin shrink-0" />
            <span>Syncing pending offline sessions...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Connected ({pendingCount} pending session{pendingCount > 1 ? 's' : ''} to sync).</span>
          </>
        )}
      </div>

      {pendingCount > 0 && networkState !== 'SYNCING' && (
        <button
          onClick={() => triggerSync()}
          className="ml-3 px-2 py-0.5 rounded bg-[#D4AF37] hover:bg-[#C66B44] text-[#1E3A2F] hover:text-white text-[11px] font-extrabold transition-colors cursor-pointer"
        >
          Sync Now ({pendingCount})
        </button>
      )}
    </div>
  );
};
