import React, { useState, useEffect } from 'react';
import { 
  Download, X, Smartphone, Sparkles, Check, 
  Share2, PlusSquare, MoreVertical, Laptop, ExternalLink, ArrowRight 
} from 'lucide-react';

export default function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('android'); // 'android' | 'ios' | 'desktop'

  useEffect(() => {
    // Detect device type to set default guide tab
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) {
      setActiveTab('ios');
    } else if (/Android/i.test(ua)) {
      setActiveTab('android');
    } else {
      setActiveTab('desktop');
    }

    // Clean up any legacy permanent block from localStorage
    localStorage.removeItem('medclinic_install_dismissed');

    // Check if dismissed in this current session
    const sessionDismissed = sessionStorage.getItem('medclinic_install_dismissed');

    // Detect if already running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!sessionDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // On mobile or tablet devices, show banner after a short delay if not dismissed this session
    const timer = setTimeout(() => {
      const isMobileDevice = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobileDevice && !sessionDismissed && !isInstalled) {
        setIsVisible(true);
      }
    }, 2000);

    // Listen to custom event to open install modal from anywhere (e.g. sidebar or footer)
    const handleOpenModal = () => {
      setShowModal(true);
    };
    window.addEventListener('open-install-modal', handleOpenModal);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('open-install-modal', handleOpenModal);
      clearTimeout(timer);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setIsVisible(false);
        }
        setDeferredPrompt(null);
        return;
      } catch (err) {
        console.warn('Direct install prompt error:', err);
      }
    }
    // If native prompt unavailable (iOS Safari, desktop, or uncertified LAN IP), show guided walkthrough
    setShowModal(true);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('medclinic_install_dismissed', 'true');
  };

  return (
    <>
      {/* Floating Top Install Banner */}
      {isVisible && !isInstalled && (
        <div className="fixed top-2 left-2 right-2 sm:left-auto sm:right-6 sm:w-96 z-40 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-emerald-500/40 flex items-center justify-between gap-3 text-xs">
            
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                <Smartphone size={18} />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-slate-900 dark:text-white truncate flex items-center gap-1">
                  <span>Install MedClinic App</span>
                  <Sparkles size={11} className="text-amber-500 shrink-0" />
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Fast 1-tap booking & Onitsha pharmacy orders
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-[11px] shadow-sm flex items-center gap-1 cursor-pointer transition-all"
              >
                <Download size={13} />
                <span>Install</span>
              </button>

              <button
                onClick={handleDismiss}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Dismiss banner"
              >
                <X size={15} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Guided Walkthrough Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-linear-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Smartphone size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">Install MedClinic</h3>
                  <p className="text-emerald-100 text-[11px]">Instant Home Screen Access & Push Notifications</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 p-2 gap-1 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Smartphone size={14} />
                <span>Android (Chrome)</span>
              </button>

              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Sparkles size={14} />
                <span>iPhone / iPad (Safari)</span>
              </button>

              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'desktop'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Laptop size={14} />
                <span>PC / Laptop</span>
              </button>
            </div>

            {/* Modal Body: Steps per platform */}
            <div className="p-6 space-y-4 text-xs">
              {activeTab === 'android' && (
                <div className="space-y-3">
                  <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                    How to install on Android (Google Chrome):
                  </p>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">1</div>
                      <p className="text-slate-700 dark:text-slate-300">
                        Tap the <strong>three dots menu icon (⋮)</strong> at the top-right corner of Google Chrome.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">2</div>
                      <p className="text-slate-700 dark:text-slate-300">
                        Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong> from the menu options.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">3</div>
                      <p className="text-slate-700 dark:text-slate-300">
                        Tap <strong>Install</strong> when prompted. The MedClinic icon will now sit on your home screen like any Play Store app!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ios' && (
                <div className="space-y-3">
                  <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                    How to install on iPhone & iPad (Safari):
                  </p>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">1</div>
                      <p className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 flex-wrap">
                        Tap the <strong>Share button</strong>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px]">
                          <Share2 size={11} className="mr-1" /> [↑]
                        </span>
                        at the bottom bar of Safari.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">2</div>
                      <p className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 flex-wrap">
                        Scroll down the share sheet and tap <strong>"Add to Home Screen"</strong>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px]">
                          <PlusSquare size={11} className="mr-1" /> ⊞
                        </span>.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">3</div>
                      <p className="text-slate-700 dark:text-slate-300">
                        Tap <strong>Add</strong> at the top right corner. MedClinic will open full-screen with zero browser address bars!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'desktop' && (
                <div className="space-y-3">
                  <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                    How to install on PC / Mac (Chrome, Edge, Brave):
                  </p>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">1</div>
                      <p className="text-slate-700 dark:text-slate-300">
                        Look at the right side of your address bar for the <strong>Install MedClinic (⬇ or ⊕)</strong> icon.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">2</div>
                      <p className="text-slate-700 dark:text-slate-300">
                        Alternatively, click the browser menu <strong>(⋮)</strong> &gt; <strong>Save and Share</strong> &gt; <strong>Install MedClinic as App</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Works 100% offline & fast launch
              </span>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs cursor-pointer shadow-md shadow-emerald-600/20 transition-all"
              >
                I Understand, Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

