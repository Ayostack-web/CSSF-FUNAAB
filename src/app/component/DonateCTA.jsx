"use client";

import { useState } from "react";

export default function DonateCTA({ onClose }) {
  const [copied, setCopied] = useState(false);
  const accountNumber = "8105225778";
  const bankName = "OPAY";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("copy failed", e);
    }
  };

  return (
    <section
      id="give"
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
    >
      <div className="bg-gray-100 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-gray-700 mb-6">PARTNERSHIP</h2>
        <p className="text-lg text-blue-950 mb-8">
          Give, and it shall be given unto you; good measure, pressed down, and
          shaken together, and running over, shall men give into your bosom.
          (Luke 6:38)
        </p>

        {/* Account Info */}
        <div className="mb-6 flex justify-center items-center space-x-4">
          <span className="text-lg font-semibold text-blue-950">
            Account: <span className="font-bold">{accountNumber}</span> —{" "}
            {bankName}
          </span>
          <button
            onClick={copyToClipboard}
           className="inline-block px-8 py-3 mt-3 text-lg font-semibold text-black bg-gradient-to-tr from-blue-300 to-teal-50 rounded-full shadow-lg hover:from-blue-900 hover:to-white hover:-translate-y-1 transition"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Pledge Button */}
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 mt-3 text-lg font-semibold text-black bg-gradient-to-tr from-blue-300 to-teal-50 rounded-full shadow-lg hover:from-blue-900 hover:to-white hover:-translate-y-1 transition"
        >
          Pledge 👆
        </a>
      </div>
    </section>
  );
}
