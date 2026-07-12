"use client";

import { useState, useEffect, useCallback, type FC } from "react";
import { createClient } from "../../utils/supabase/client";
import { toast } from "sonner";

interface WorshipImage {
  id: string;
  title: string;
  image_url: string;
  created_at: string;
}

const WorshipManager: FC = () => {
  const [worshipTitle, setWorshipTitle] = useState("");
  const [worshipImage, setWorshipImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [worship, setWorship] = useState<WorshipImage[]>([]);
  const supabase = createClient();

  const fetchWorship = useCallback(async () => {
    const { data } = await supabase
      .from("worship_images")
      .select("*")
      .order("order", { ascending: true });
    setWorship(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchWorship();
  }, [fetchWorship]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!worshipTitle || !worshipImage) {
      toast.error("Please provide both a title and an image.");
      return;
    }

    setLoading(true);
    try {
      const fileName = `worship-${Date.now()}-${worshipImage.name}`;
      const { error: uploadError } = await supabase.storage
        .from("worship_images")
        .upload(fileName, worshipImage);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("worship_images").getPublicUrl(fileName);
      const imageUrl = data.publicUrl;

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || "";
      if (!accessToken) throw new Error("Please login again");

      const apiRes = await fetch("/api/worship/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ title: worshipTitle, image_url: imageUrl, order: worship.length + 1 }),
      });

      const apiData = await apiRes.json();
      if (!apiRes.ok) throw new Error(apiData.error || "Server insert failed");

      toast.success("Worship image uploaded successfully!");
      setWorshipTitle("");
      setWorshipImage(null);
      fetchWorship();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Upload failed";
      toast.error("Error uploading: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast("Are you sure you want to delete this worship image?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const item = worship.find((w) => w.id === id);
            const image_url = item?.image_url || null;

            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData?.session?.access_token || "";
            if (!accessToken) throw new Error("Please login again");

            const res = await fetch("/api/worship/delete", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
              body: JSON.stringify({ id, image_url }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Delete failed");
            toast.success("Worship image deleted.");
            fetchWorship();
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
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Upload Worship Image</h2>
        <form onSubmit={handleUpload} className="space-y-5">
          <input
            type="text"
            placeholder="Image Title"
            className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
            value={worshipTitle}
            onChange={(e) => setWorshipTitle(e.target.value)}
          />
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none file:bg-blue-100 file:text-blue-900 file:px-3 file:py-1 file:rounded file:cursor-pointer file:border-0"
              onChange={(e) => setWorshipImage(e.target.files?.[0] || null)}
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition disabled:bg-gray-400"
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Worship Images</h2>
        <div className="divide-y divide-gray-100">
          {worship.map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          ))}
          {worship.length === 0 && <p className="text-gray-400 text-sm">No worship images found.</p>}
        </div>
      </div>
    </>
  );
};

export default WorshipManager;
