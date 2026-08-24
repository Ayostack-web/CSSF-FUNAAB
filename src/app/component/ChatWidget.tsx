"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { createClient } from "../utils/supabase/client";
import { toast } from "sonner";

const MAX_NAME = 80;
const MAX_CONTACT = 120;
const MAX_BODY = 1000;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) return;

    if (!name.trim() || !body.trim()) {
      toast.error("Please enter your name and a message.");
      return;
    }
    if (name.length > MAX_NAME || contact.length > MAX_CONTACT || body.length > MAX_BODY) {
      toast.error("Message is too long. Please shorten it.");
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert({
        name: name.trim(),
        contact: contact.trim() || null,
        body: body.trim(),
      });
      if (error) throw new Error(error.message);

      toast.success("Message sent! The leadership will get back to you.");
      setName("");
      setContact("");
      setBody("");
      setOpen(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not send message";
      toast.error("Error: " + message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-blue-100 bg-white"
          >
            <div className="bg-blue-900 px-4 py-3 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-sm">Message CSSF FUNAAB</h3>
                <p className="text-blue-200 text-xs">We usually respond within a day.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="p-1.5 rounded-full text-blue-200 hover:text-white hover:bg-blue-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
              <input
                type="text"
                placeholder="Your name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={MAX_NAME}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Phone or email (optional)"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                maxLength={MAX_CONTACT}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Type your message or prayer request... *"
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={MAX_BODY}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {body.length}/{MAX_BODY}
                </span>
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition"
                >
                  <Send size={15} />
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className={`h-14 w-14 rounded-full shadow-xl flex items-center justify-center text-white transition-colors ${
          open ? "bg-slate-700" : "bg-blue-600 hover:bg-blue-700 animate-pulse"
        }`}
      >
        {open ? <X size={24} /> : <MessageCircle size={26} />}
      </motion.button>
    </div>
  );
}
