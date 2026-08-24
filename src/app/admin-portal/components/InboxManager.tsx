"use client";

import { useState, useEffect, useCallback, type FC } from "react";
import { createClient } from "../../utils/supabase/client";
import { toast } from "sonner";
import { MailOpen, Trash2, Phone, Mail, CheckCheck } from "lucide-react";

interface Message {
  id: string;
  name: string;
  contact: string | null;
  body: string;
  is_read: boolean;
  created_at: string;
}

function contactHref(contact: string): { href: string; icon: typeof Phone; label: string } | null {
  const trimmed = contact.trim();
  if (!trimmed) return null;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { href: `mailto:${trimmed}`, icon: Mail, label: trimmed };
  }
  const digits = trimmed.replace(/[^\d+]/g, "");
  if (digits.replace(/\D/g, "").length >= 7) {
    return {
      href: `https://wa.me/${digits.replace(/\D/g, "")}`,
      icon: Phone,
      label: trimmed,
    };
  }
  return null;
}

const InboxManager: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const supabase = createClient();

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages((data || []) as Message[]);
  }, [supabase]);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("messages-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages, supabase]);

  const toggleRead = async (msg: Message) => {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: !msg.is_read })
      .eq("id", msg.id);
    if (error) {
      toast.error("Error updating message: " + error.message);
      return;
    }
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, is_read: !m.is_read } : m))
    );
  };

  const markAllRead = async () => {
    const unreadIds = messages.filter((m) => !m.is_read).map((m) => m.id);
    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .in("id", unreadIds);
    if (error) {
      toast.error("Error marking all as read: " + error.message);
      return;
    }
    setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
    toast.success("All messages marked as read.");
  };

  const handleDelete = (id: string) => {
    toast("Are you sure you want to delete this message?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const { error } = await supabase.from("messages").delete().eq("id", id);
          if (error) {
            toast.error("Error deleting: " + error.message);
            return;
          }
          toast.success("Message deleted.");
          setMessages((prev) => prev.filter((m) => m.id !== id));
        },
      },
    });
  };

  const visible = filter === "unread" ? messages.filter((m) => !m.is_read) : messages;
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="card-shell">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="card-title text-xl">
          Inbox
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-red-500 text-white text-xs font-bold align-middle">
              {unreadCount} new
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter(filter === "all" ? "unread" : "all")}
            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
              filter === "unread"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {filter === "all" ? "Unread only" : "Show all"}
          </button>
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCheck size={15} />
            Mark all read
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {visible.map((msg) => {
          const link = msg.contact ? contactHref(msg.contact) : null;
          return (
            <div
              key={msg.id}
              className={`py-3 px-2 -mx-2 rounded-lg transition ${
                msg.is_read ? "" : "bg-blue-50/70"
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    {!msg.is_read && (
                      <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                    {msg.name}
                    <span className="text-xs font-normal text-gray-400">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap break-words">
                    {msg.body}
                  </p>
                  {link && (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <link.icon size={13} />
                      Reply via {link.icon === Mail ? "email" : "WhatsApp"}: {link.label}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleRead(msg)}
                    aria-label={msg.is_read ? "Mark as unread" : "Mark as read"}
                    title={msg.is_read ? "Mark as unread" : "Mark as read"}
                    className="p-2 rounded-md text-blue-600 hover:bg-blue-100 transition"
                  >
                    <MailOpen size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    aria-label="Delete message"
                    className="p-2 rounded-md text-red-500 hover:bg-red-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <p className="text-gray-400 text-sm">
            {filter === "unread" ? "No unread messages." : "No messages yet."}
          </p>
        )}
      </div>
    </div>
  );
};

export default InboxManager;
