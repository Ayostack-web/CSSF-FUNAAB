"use client";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import BannerAdmin from "../component/BannerAdmin";

export default function AdminDashboardPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [passkey, setPasskey] = useState("");

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const [worshipTitle, setWorshipTitle] = useState("");
  const [worshipImage, setWorshipImage] = useState(null);
  const [worshipLoading, setWorshipLoading] = useState(false);

  const [sermons, setSermons] = useState([]);
  const [worship, setWorship] = useState([]);

  const supabase = createClient();

  const fetchSermons = async () => {
    const { data } = await supabase
      .from("sermons")
      .select("*")
      .order("created_at", { ascending: false });
    setSermons(data || []);
  };

  const fetchWorship = async () => {
    const { data } = await supabase
      .from("worship_images")
      .select("*")
      .order("order", { ascending: true });
    setWorship(data || []);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSermons();
      fetchWorship();
    }
  }, [isAdmin]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAdmin(true);
    } else {
      alert("Incorrect Access Key");
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title || !link)
      return alert("Please provide both a title and a link.");

    setLoading(true);
    const { error } = await supabase
      .from("sermons")
      .insert([{ title, drive_link: link }]);

    setLoading(false);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Sermon Published successfully!");
      setTitle("");
      setLink("");
      fetchSermons();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this sermon?")) {
      const { error } = await supabase
        .from("sermons")
        .delete()
        .eq("id", id);
      if (error) alert("Error deleting: " + error.message);
      else fetchSermons();
    }
  };

  const handleWorshipUpload = async (e) => {
    e.preventDefault();
    if (!worshipTitle || !worshipImage)
      return alert("Please provide both a title and an image.");

    setWorshipLoading(true);

    try {
      const fileName = `worship-${Date.now()}-${worshipImage.name}`;

      const { error: uploadError } = await supabase.storage
        .from("worship-images") // ← make sure this matches your bucket name
        .upload(fileName, worshipImage);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("worship-images")
        .getPublicUrl(fileName);

      const imageUrl = data.publicUrl;

      const apiRes = await fetch("/api/worship/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passkey": passkey || "",
        },
        body: JSON.stringify({
          title: worshipTitle,
          image_url: imageUrl,
          order: worship.length + 1,
        }),
      });

      const apiData = await apiRes.json();
      if (!apiRes.ok)
        throw new Error(apiData.error || "Server insert failed");

      alert("Worship image uploaded successfully!");
      setWorshipTitle("");
      setWorshipImage(null);
      fetchWorship();
    } catch (error) {
      alert("Error uploading: " + error.message);
    } finally {
      setWorshipLoading(false);
    }
  };

  const handleDeleteWorship = async (id) => {
    if (!confirm("Are you sure you want to delete this worship image?"))
      return;

    try {
      const item = worship.find((w) => w.id === id);
      const image_url = item?.image_url || null;

      const res = await fetch("/api/worship/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passkey": passkey || "",
        },
        body: JSON.stringify({ id, image_url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      fetchWorship();
    } catch (err) {
      alert("Error deleting: " + (err?.message || String(err)));
    }
  };

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 w-full max-w-md">
          <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">
            Admin Verification
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Secret Access Key"
              className="w-full p-3 border rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
            />
            <button className="w-full bg-blue-800 text-white py-2 rounded-lg font-bold hover:bg-blue-900 transition">
              Verify Identity
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">
              CSSF Admin Dashboard
            </h1>
            <p className="text-slate-500">
              Manage your website content in real-time.
            </p>
          </div>
          <button
            onClick={() => setIsAdmin(false)}
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col gap-8">
            {/* Your existing upload + list UI remains unchanged */}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-2">
              Event Banners
            </h3>
            <BannerAdmin />
          </div>
        </div>
      </div>
    </main>
  );
}