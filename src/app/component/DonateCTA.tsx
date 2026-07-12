"use client";

import { useState, useEffect, type FC } from "react";
import { toast } from "sonner";

interface DonateCTAProps {
  onClose: () => void;
}

const DonateCTA: FC<DonateCTAProps> = ({ onClose }) => {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bank, setBank] = useState("");

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const res = await fetch("/api/account-number/update");
        const data = await res.json();
        setAccountName(data.accountName || "");
        setAccountNumber(data.accountNumber || "");
        setBank(data.bank || "");
      } catch {
        setAccountName("");
        setAccountNumber("");
        setBank("");
      }
    };
    fetchAccountInfo();
  }, []);

  const copyToClipboard = async (accountNum: string) => {
    try {
      await navigator.clipboard.writeText(accountNum);
      setCopiedAccount(accountNum);
      toast.success("Account number copied!", {
        description: "Send your pledge and share proof with us on any of our social media pages.",
      });
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch (e) {
      toast.error("Failed to copy. Please copy manually.");
      console.error("copy failed", e);
    }
  };

  return (
    <section
      id="give"
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
    >
      <div className="bg-gray-100 p-7 rounded-2xl shadow-2xl max-w-lg w-full text-center relative">
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

        <div className="mb-6 flex justify-center items-center space-x-4">
          <span className="text-lg font-semibold text-blue-950">
            Account: <span className="font-bold">{accountNumber || "-"}</span> — {bank || ""} {accountName || ""}
          </span>
          <button
            onClick={() => copyToClipboard(accountNumber)}
            className="inline-block px-8 py-3 mt-3 text-lg font-semibold text-black bg-gradient-to-tr from-blue-300 to-teal-50 rounded-full shadow-lg hover:from-blue-900 hover:to-white hover:-translate-y-1 transition"
          >
            {copiedAccount === accountNumber ? "Copied!" : "Copy"}
          </button>
        </div>

        <button
          onClick={() => {
            if (accountNumber) {
              copyToClipboard(accountNumber);
            } else {
              toast.info("Account details not available yet. Please try again later.");
            }
          }}
          className="inline-block px-8 py-3 mt-3 text-lg font-semibold text-black bg-gradient-to-tr from-blue-300 to-teal-50 rounded-full shadow-lg hover:from-blue-900 hover:to-white hover:-translate-y-1 transition"
        >
          Pledge 👆
        </button>
      </div>
    </section>
  );
};

export default DonateCTA;
