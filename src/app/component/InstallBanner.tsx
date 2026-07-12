"use client";

import { useEffect, useState, type FC } from "react";

const InstallBanner: FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-xl bg-blue-50 px-5 py-3 text-gray-600 shadow-lg">
      <span className="text-sm font-medium">
        Install CSSF FUNAAB for a better experience
      </span>
      <button
        onClick={installApp}
        className="rounded-lg bg-blue-200 px-4 py-2 text-sm font-semibold text-black hover:bg-blue-300 transition"
      >
        Install
      </button>
    </div>
  );
};

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default InstallBanner;
