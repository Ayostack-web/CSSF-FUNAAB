"use client";

import { useState, useEffect, useCallback, type FC } from "react";
import { createClient } from "../../utils/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MemoryVerse {
  id: string;
  quote: string;
  reference: string;
  created_at: string;
}

const MemoryVerseManager: FC = () => {
  const [quote, setQuote] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [verses, setVerses] = useState<MemoryVerse[]>([]);
  const supabase = createClient();

  const getAccessToken = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token || "";
    if (!accessToken) throw new Error("Please login again");
    return accessToken;
  };

  const fetchVerses = useCallback(async () => {
    const { data } = await supabase
      .from("memory_verses")
      .select("*")
      .order("created_at", { ascending: false });
    setVerses(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchVerses();
  }, [fetchVerses]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote || !reference) {
      toast.error("Please provide both the verse text and its reference.");
      return;
    }

    setLoading(true);
    try {
      const accessToken = await getAccessToken();

      const res = await fetch("/api/memory-verses/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ quote, reference }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server insert failed");

      toast.success("Memory verse added successfully!");
      setQuote("");
      setReference("");
      fetchVerses();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Add failed";
      toast.error("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast("Are you sure you want to delete this verse?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const accessToken = await getAccessToken();

            const res = await fetch("/api/memory-verses/delete", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
              body: JSON.stringify({ id }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Delete failed");

            toast.success("Memory verse deleted.");
            fetchVerses();
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            toast.error("Error deleting: " + message);
          }
        },
      },
    });
  };

  return (
    <>
      <div className="card-shell">
        <h2 className="card-title text-2xl mb-6">Add Memory Verse</h2>
        <form onSubmit={handlePublish} className="space-y-5">
          <Input
            type="text"
            placeholder="Verse Reference (e.g. John 3:16 (NIV))"
            className="h-12 rounded-lg"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
          <textarea
            placeholder="Verse text..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Adding..." : "Add to Website"}
          </Button>
        </form>
      </div>

      <div className="card-shell">
        <h2 className="card-title text-xl mb-4">Live Memory Verses List</h2>
        <div className="divide-y divide-gray-100">
          {verses.map((verse) => (
            <div key={verse.id} className="py-3 flex justify-between items-start">
              <div className="pr-4">
                <p className="font-bold text-gray-800 text-sm">{verse.reference}</p>
                <p className="text-sm text-gray-500 italic">&ldquo;{verse.quote}&rdquo;</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(verse.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(verse.id)}
                className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-100 transition shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
          {verses.length === 0 && <p className="text-gray-400 text-sm">No memory verses found.</p>}
        </div>
      </div>
    </>
  );
};

export default MemoryVerseManager;
