import React, { useState, useEffect } from 'react';
import { WifiOff, Download, CheckCircle, X, ShieldCheck, AppWindow, ArrowRight } from 'lucide-react';

interface PwaOfflineBarProps {
  isOnline: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  onInstall: () => Promise<boolean>;
}

export const PwaOfflineBar: React.FC<PwaOfflineBarProps> = ({
  isOnline,
  isInstallable,
  isInstalled,
  onInstall
}) => {
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);

  useEffect(() => {
    const dismissedSession = sessionStorage.getItem('lms_pwa_dismissed');
    if (!isInstalled && !dismissedSession) {
      const timer = setTimeout(() => {
        setShowInstallPopup(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await onInstall();
      if (installed) {
        setInstallSuccess(true);
        setShowInstallPopup(false);
        setTimeout(() => setInstallSuccess(false), 4000);
      } else {
        setShowManualGuide(true);
      }
    } else {
      setShowManualGuide(true);
    }
  };

  const handleDismissPopup = () => {
    setShowInstallPopup(false);
    sessionStorage.setItem('lms_pwa_dismissed', 'true');
  };

  return (
    <>
      {/* 1. OFFLINE NETWORK STATUS BANNER */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs py-2 px-4 flex items-center justify-between shadow-md z-50 sticky top-0 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2 font-medium max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-amber-700/80 rounded-md">
                <WifiOff className="w-4 h-4 text-white animate-pulse" />
              </span>
              <div>
                <span className="font-bold uppercase tracking-wider text-[11px] bg-amber-800/80 px-1.5 py-0.5 rounded mr-1.5 border border-amber-500/50">
                  Offline Mode
                </span>
                <span className="hidden md:inline">
                  Disconnected from network. Saved local data remains accessible.
                </span>
                <span className="md:hidden">
                  Working offline.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] bg-amber-900/60 text-amber-100 px-2 py-0.5 rounded font-mono hidden sm:inline-flex items-center gap-1 border border-amber-500/30">
                <ShieldCheck className="w-3 h-3 text-amber-300" />
                Local Cache Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. MINIMAL CONCISE PWA DOWNLOAD POPUP */}
      {showInstallPopup && !isInstalled && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 max-w-sm w-full rounded-2xl p-5 shadow-2xl space-y-4 relative">
            
            <button
              onClick={handleDismissPopup}
              className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pr-6">
              <div className="p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-400 shrink-0">
                <AppWindow className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-bold text-sm text-white">Install LMS</h3>
                <p className="text-xs text-slate-400">Install app for offline access.</p>
              </div>
            </div>

            {/* Manual Guide Fallback if direct browser prompt unavailable */}
            {showManualGuide && (
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                Use browser menu (<strong className="text-white">⋮</strong> or <strong className="text-white">Share</strong>) &rarr; <strong className="text-emerald-400">"Add to Home Screen / Install LMS"</strong>.
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleInstallClick}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 text-xs cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-80" />
              </button>

              <button
                onClick={handleDismissPopup}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition text-xs cursor-pointer"
              >
                Not Now
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SUCCESS CONFIRMATION TOAST */}
      {installSuccess && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white text-xs px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200 border border-emerald-400">
          <CheckCircle className="w-4 h-4 text-white" />
          <div>
            <p className="font-bold">LMS Installed Successfully!</p>
          </div>
        </div>
      )}
    </>
  );
};
