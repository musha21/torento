import React, { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

const DISMISS_KEY = 'torento-pwa-install-dismissed-until';
const DISMISS_DAYS = 14;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return true;
  const mq = window.matchMedia('(display-mode: standalone)').matches;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return mq || iosStandalone;
}

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const webkit = /WebKit/.test(ua);
  const chromeLike = /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  return iOS && webkit && !chromeLike;
}

function isDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    return Date.now() < Number(raw);
  } catch {
    return false;
  }
}

function dismissForDays() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000));
  } catch {
    /* ignore */
  }
}

export const PwaInstallBanner: React.FC = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosTip, setIosTip] = useState(false);

  useEffect(() => {
    if (isStandalone() || isDismissed()) return;

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
      setIosTip(false);
    };

    window.addEventListener('beforeinstallprompt', onBip);

    // iOS has no beforeinstallprompt — show Add to Home Screen tip after a short delay
    let iosTimer: number | undefined;
    if (isIosSafari()) {
      iosTimer = window.setTimeout(() => {
        if (!isDismissed() && !isStandalone()) {
          setIosTip(true);
          setVisible(true);
        }
      }, 2500);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBip);
      if (iosTimer) window.clearTimeout(iosTimer);
    };
  }, []);

  if (!visible) return null;

  const hide = () => {
    dismissForDays();
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Install TORENTO app"
      className="lg:hidden fixed inset-x-0 z-[45] px-3"
      style={{
        bottom: 'calc(3.5rem + env(safe-area-inset-bottom, 0px) + 0.5rem)',
      }}
    >
      <div className="mx-auto max-w-lg rounded-xl border border-[#D8C9AD]/50 bg-[#242320] text-[#ECE3D1] shadow-2xl p-3.5 flex gap-3 items-start">
        <div className="mt-0.5 w-9 h-9 rounded-lg bg-[#A86438]/25 flex items-center justify-center shrink-0">
          {iosTip ? <Share className="w-4 h-4 text-[#A86438]" /> : <Download className="w-4 h-4 text-[#A86438]" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold tracking-wide">Install TORENTO app</p>
          {iosTip ? (
            <p className="mt-1 text-[11px] text-[#ECE3D1]/75 leading-relaxed">
              Tap Share, then <span className="text-white font-medium">Add to Home Screen</span> for a full-screen app
              experience.
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-[#ECE3D1]/75 leading-relaxed">
              Add TORENTO to your home screen for faster booking and offline access.
            </p>
          )}
          <div className="mt-2.5 flex flex-wrap gap-2">
            {!iosTip && deferred && (
              <button
                type="button"
                onClick={install}
                className="rounded-full bg-[#A86438] px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-semibold text-white"
              >
                Install
              </button>
            )}
            <button
              type="button"
              onClick={hide}
              className="rounded-full border border-white/25 px-3.5 py-1.5 text-[11px] uppercase tracking-wider text-[#ECE3D1]/85 hover:bg-white/10"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={hide}
          className="shrink-0 p-1 text-[#ECE3D1]/50 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
