"use client";

import { useEffect, useState } from "react";

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // stop default browser prompt
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
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
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400 transition"
      >
        Install
      </button>
    </div>
  );
}
