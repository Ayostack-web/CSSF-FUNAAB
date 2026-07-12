"use client";

import { useState, useEffect, useCallback, type FC } from "react";
import { createClient } from "../../utils/supabase/client";
import { toast } from "sonner";

interface Sermon {
  id: string;
  title: string;
  drive_link: string;
  created_at: string;
}

const SermonManager: FC = () => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const supabase = createClient();

  const fetchSermons = useCallback(async () => {
    const { data } = await supabase
      .from("sermons")
      .select("*")
      .order("created_at", { ascending: false });
    setSermons(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !link) {
      toast.error("Please provide both a title and a link.");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("sermons")
      .insert([{ title, drive_link: link }]);

    setLoading(false);

    if (error) {
      toast.error("Error: " + error.message);
    } else {
      toast.success("Sermon published successfully!");
      setTitle("");
      setLink("");
      fetchSermons();
    }
  };

  const handleDelete = async (id: string) => {
    toast("Are you sure you want to delete this sermon?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const { error } = await supabase.from("sermons").delete().eq("id", id);
          if (error) {
            toast.error("Error deleting: " + error.message);
          } else {
            toast.success("Sermon deleted.");
            fetchSermons();
          }
        },
      },
    });
  };

  return (
    <>
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Upload Sermon</h2>
        <form onSubmit={handlePublish} className="space-y-5">
          <input
            type="text"
            placeholder="Sermon Title"
            className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Google Drive Link"
            className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            {loading ? "Publishing..." : "Publish to Website"}
          </button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Live Sermons List</h2>
        <div className="divide-y divide-gray-100">
          {sermons.map((sermon) => (
            <div key={sermon.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{sermon.title}</p>
                <p className="text-xs text-gray-400">{new Date(sermon.created_at).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDelete(sermon.id)}
                className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          ))}
          {sermons.length === 0 && <p className="text-gray-400 text-sm">No sermons found.</p>}
        </div>
      </div>
    </>
  );
};

export default SermonManager;
