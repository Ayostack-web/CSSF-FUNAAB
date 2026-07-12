"use client";

import { useState, useEffect, type FC } from "react";
import { createClient } from "../../utils/supabase/client";
import { toast } from "sonner";

interface AccountInfo {
  accountName: string;
  accountNumber: string;
  bank: string;
}

const AccountInfoSettings: FC = () => {
  const [current, setCurrent] = useState<AccountInfo>({ accountName: "", accountNumber: "", bank: "" });
  const [input, setInput] = useState<AccountInfo>({ accountName: "", accountNumber: "", bank: "" });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchAccountInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/account-number/update");
      const data = await res.json();
      const info = { accountName: data.accountName || "", accountNumber: data.accountNumber || "", bank: data.bank || "" };
      setCurrent(info);
      setInput(info);
    } catch {
      setCurrent({ accountName: "", accountNumber: "", bank: "" });
      setInput({ accountName: "", accountNumber: "", bank: "" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || "";
      if (!accessToken) throw new Error("Please login again");

      const res = await fetch("/api/account-number/update", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrent(input);
        toast.success("Account info updated successfully.");
      } else {
        throw new Error(data.error || "Failed to update account info.");
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Error updating account info.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || "";
      if (!accessToken) throw new Error("Please login again");

      const res = await fetch("/api/account-number/update", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ accountName: "", accountNumber: "", bank: "" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const empty = { accountName: "", accountNumber: "", bank: "" };
        setCurrent(empty);
        setInput(empty);
        toast.success("Account info deleted.");
      } else {
        throw new Error(data.error || "Failed to delete account info.");
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Error deleting account info.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const hasData = current.accountName || current.accountNumber || current.bank;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Account Info</h2>
      <form onSubmit={handleUpdate} className="space-y-5">
        <input
          type="text"
          placeholder="Account Name"
          className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
          value={input.accountName}
          onChange={(e) => setInput({ ...input, accountName: e.target.value })}
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Account Number"
          className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
          value={input.accountNumber}
          onChange={(e) => setInput({ ...input, accountNumber: e.target.value })}
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Bank"
          className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
          value={input.bank}
          onChange={(e) => setInput({ ...input, bank: e.target.value })}
          disabled={loading}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            disabled={loading || !hasData}
            onClick={handleDelete}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
        <p className="text-gray-500 text-sm">
          Current: <span className="font-mono">{current.accountName || "Not set"} {current.accountNumber || ""} {current.bank || ""}</span>
        </p>
      </form>
    </div>
  );
};

export default AccountInfoSettings;
