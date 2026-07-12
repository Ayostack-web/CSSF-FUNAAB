"use client";

import { useState, useEffect, type FC } from "react";
import { createClient } from "../../utils/supabase/client";
import { toast } from "sonner";

const ContactSettings: FC = () => {
  const [phone, setPhone] = useState("");
  const [phoneSecondary, setPhoneSecondary] = useState("");
  const [input, setInput] = useState({ phone: "", phoneSecondary: "" });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchPhone = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/site-settings/footer-phone");
      const data = await res.json();
      const p = data.footerPhone || "";
      const ps = data.footerPhoneSecondary || "";
      setPhone(p);
      setPhoneSecondary(ps);
      setInput({ phone: p, phoneSecondary: ps });
    } catch {
      setPhone("");
      setPhoneSecondary("");
      setInput({ phone: "", phoneSecondary: "" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhone();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || "";
      if (!accessToken) throw new Error("Please login again");

      const res = await fetch("/api/site-settings/footer-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ footerPhone: input.phone, footerPhoneSecondary: input.phoneSecondary }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update phone numbers");

      setPhone(input.phone);
      setPhoneSecondary(input.phoneSecondary);
      toast.success("Contact phone numbers updated successfully.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error updating phone numbers.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Contact Info</h2>
      <form onSubmit={handleUpdate} className="space-y-5">
        <input
          type="tel"
          placeholder="Primary Phone Number"
          className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
          value={input.phone}
          onChange={(e) => setInput({ ...input, phone: e.target.value })}
          disabled={loading}
          required
        />
        <input
          type="tel"
          placeholder="Secondary Phone Number"
          className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
          value={input.phoneSecondary}
          onChange={(e) => setInput({ ...input, phoneSecondary: e.target.value })}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Save Phone Numbers"}
        </button>
        <p className="text-gray-500 text-sm">
          Current: <span className="font-mono">{[phone, phoneSecondary].filter(Boolean).join(" , ") || "Not set"}</span>
        </p>
      </form>
    </div>
  );
};

export default ContactSettings;
