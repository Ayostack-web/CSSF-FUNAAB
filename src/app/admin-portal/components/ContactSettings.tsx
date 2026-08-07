"use client";

import { useState, useEffect, type FC } from "react";
import { createClient } from "../../utils/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="card-shell">
      <h2 className="card-title text-2xl mb-6">Contact Info</h2>
      <form onSubmit={handleUpdate} className="space-y-5">
        <Input
          type="tel"
          placeholder="Primary Phone Number"
          className="h-12 rounded-lg"
          value={input.phone}
          onChange={(e) => setInput({ ...input, phone: e.target.value })}
          disabled={loading}
          required
        />
        <Input
          type="tel"
          placeholder="Secondary Phone Number"
          className="h-12 rounded-lg"
          value={input.phoneSecondary}
          onChange={(e) => setInput({ ...input, phoneSecondary: e.target.value })}
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Saving..." : "Save Phone Numbers"}
        </Button>
        <p className="text-gray-500 text-sm">
          Current: <span className="font-mono">{[phone, phoneSecondary].filter(Boolean).join(" , ") || "Not set"}</span>
        </p>
      </form>
    </div>
  );
};

export default ContactSettings;
