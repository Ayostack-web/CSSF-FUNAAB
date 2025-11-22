"use client";

import { useState } from "react";

export default function DonateCTA({ onClose }) {
  const [copiedAccount, setCopiedAccount] = useState(null); // State to track which account was copied
  const accountname = "Boluwatife Afusat Sanni";
  const accountNumber = "8105225778";
  const bankName = "OPAY";

  const accountname1 = "VANT(CSSF FUNAAB)";
  const accountNumber1 = "9643608280";
  const bankName1 = "Providus Bank Plc";

  const copyToClipboard = async (accountNum) => {
    try {
      await navigator.clipboard.writeText(accountNum);
      setCopiedAccount(accountNum); // Set the state to the account number that was copied
      setTimeout(() => setCopiedAccount(null), 2000); // Reset after 2 seconds
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

        {/* Account Info 1 */}
        <div className="mb-6 flex justify-center items-center space-x-4">
          <span className="text-lg font-semibold text-blue-950">
            Account: <span className="font-bold">{accountNumber}</span> —{" "}
            {bankName} {accountname}
          </span>
          <button
            onClick={() => copyToClipboard(accountNumber)} // Pass the specific account number
            className="inline-block px-8 py-3 mt-3 text-lg font-semibold text-black bg-gradient-to-tr from-blue-300 to-teal-50 rounded-full shadow-lg hover:from-blue-900 hover:to-white hover:-translate-y-1 transition"
          >
            {copiedAccount === accountNumber ? "Copied!" : "Copy"}
          </button>
        </div>
        
        {/* Account Info 2 */}
        <div className="mb-6 flex justify-center items-center space-x-4">
          <span className="text-lg font-semibold text-blue-950">
            Account: <span className="font-bold">{accountNumber1}</span> —{" "}
            {bankName1} {accountname1}
          </span>
          <button
            onClick={() => copyToClipboard(accountNumber1)} // Pass the specific account number
            className="inline-block px-8 py-3 mt-3 text-lg font-semibold text-black bg-gradient-to-tr from-blue-300 to-teal-50 rounded-full shadow-lg hover:from-blue-900 hover:to-white hover:-translate-y-1 transition"
          >
            {copiedAccount === accountNumber1 ? "Copied!" : "Copy"}
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
