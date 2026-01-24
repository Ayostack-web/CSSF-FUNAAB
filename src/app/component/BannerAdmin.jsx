"use client";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

export default function BannerAdmin() {
  const [eventName, setEventName] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const fetchBanners = async () => {
    const { data } = await supabase.from("banners").select("*").order("created_at", { ascending: false });
    setBanners(data || []);
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleBannerUpload = async (e) => {
    e.preventDefault();
    if (!eventName || !imageLink) return alert("Fill all fields");
    setLoading(true);
    const { error } = await supabase.from("banners").insert([{ event_name: eventName, image_url: imageLink }]);
    setLoading(false);
    if (error) alert(error.message);
    else {
      alert("Banner Added!");
      setEventName(""); setImageLink("");
      fetchBanners();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this banner permanently?")) {
      const { error } = await supabase.from("banners").delete().eq("id", id);
      if (error) alert(error.message);
      else fetchBanners();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Add Event Banner</h2>
        <form onSubmit={handleBannerUpload} className="space-y-4">
          <input type="text" placeholder="Event Name" className="w-full p-2 border rounded text-black" value={eventName} onChange={e => setEventName(e.target.value)} />
          <input type="text" placeholder="Direct Image URL (.jpg, .png)" className="w-full p-2 border rounded text-black" value={imageLink} onChange={e => setImageLink(e.target.value)} />
          <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700" disabled={loading}>
            {loading ? "Saving..." : "Upload Banner"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Live Banners</h2>
        <div className="space-y-3">
          {banners.map(b => (
            <div key={b.id} className="flex items-center gap-4 p-2 border rounded-lg justify-between">
              <img src={b.image_url} alt="event" className="w-12 h-12 rounded object-cover border" />
              <p className="text-sm font-medium flex-1 text-black truncate">{b.event_name}</p>
              <button onClick={() => handleDelete(b.id)} className="text-red-500 text-xs font-bold hover:underline">Delete</button>
            </div>
          ))}
          {banners.length === 0 && <p className="text-gray-400 text-sm">No banners found.</p>}
        </div>
      </div>
    </div>
  );
}