"use client";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
// ✅ Removed the non-existent AdminPortal import that caused the build failure
import BannerAdmin from "../component/BannerAdmin"; 


export default function AdminDashboardPage() {
  // --- Verification State ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [passkey, setPasskey] = useState("");
  const SECRET_KEY = "CSSF_GATE_777"; 

  // --- Upload Form State (Sermons) ---
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  
  // --- Dashboard State ---
  const [sermons, setSermons] = useState([]);
  
  const supabase = createClient();

  // Fetch sermons for the admin list
  const fetchSermons = async () => {
    const { data } = await supabase
      .from("sermons")
      .select("*")
      .order("created_at", { ascending: false });
    setSermons(data || []);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSermons();
    }
  }, [isAdmin]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passkey === SECRET_KEY) {
      setIsAdmin(true);
    } else {
      alert("Incorrect Access Key");
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title || !link) return alert("Please provide both a title and a link.");

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
      const { error } = await supabase.from("sermons").delete().eq("id", id);
      if (error) alert("Error deleting: " + error.message);
      else fetchSermons(); 
    }
  };

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 w-full max-w-md">
          <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">Admin Verification</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Secret Access Key"
              className="w-full p-3 border rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
            />
            <button className="w-full bg-blue-800 text-white py-2 rounded-lg font-bold hover:bg-blue-900 transition text-center">
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
            <h1 className="text-3xl font-bold text-blue-900">CSSF Admin Dashboard</h1>
            <p className="text-slate-500">Manage your website content in real-time.</p>
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
          </div>

          <div className="space-y-4">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-2">Event Banners</h3>
             <BannerAdmin /> 
          </div>
        </div>
        {/* ✅ Extra <AdminPortal /> tag removed to fix build error */}
      </div>
    </main>
  );
}