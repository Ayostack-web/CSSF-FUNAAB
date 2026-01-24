"use client";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

export default function BannerAdmin() {
  const [banners, setBanners] = useState([]);
  const [eventName, setEventName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  // 1. Fetch banners to show what can be deleted
  const fetchBanners = async () => {
    const { data } = await supabase.from("banners").select("*").order("created_at", { ascending: false });
    setBanners(data || []);
  };

  useEffect(() => { fetchBanners(); }, []);

  // 2. Updated Upload Logic (already handles file upload)
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile || !eventName) return alert("Please provide a name and image.");
    setUploading(true);
    
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("event-banners").upload(filePath, imageFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("event-banners").getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("banners").insert([{ 
        event_name: eventName, 
        image_url: publicUrl,
        storage_path: filePath // Store this to make deletion easier later
      }]);

      if (dbError) throw dbError;
      alert("Banner uploaded!");
      fetchBanners();
    } catch (err) { alert(err.message); } finally { setUploading(false); }
  };

  // 3. NEW: Delete Logic
  const handleDelete = async (banner) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      // Delete from Storage first
      if (banner.storage_path) {
        const { error: storageError } = await supabase.storage
          .from("event-banners")
          .remove([banner.storage_path]);
        if (storageError) throw storageError;
      }

      // Delete from Database
      const { error: dbError } = await supabase.from("banners").delete().eq("id", banner.id);
      if (dbError) throw dbError;

      alert("Banner and image deleted successfully.");
      fetchBanners();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-blue-900">Upload Event Banner</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full p-2 border rounded-md" />
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full p-2 text-sm" />
          <button disabled={uploading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">
            {uploading ? "Uploading..." : "Publish Banner"}
          </button>
        </form>
      </div>

      {/* Delete List */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-blue-900">Manage Banners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="border p-4 rounded-lg flex flex-col items-center">
              <img src={b.image_url} alt={b.event_name} className="w-32 h-20 object-cover mb-2 rounded" />
              <p className="text-sm font-bold text-gray-800">{b.event_name}</p>
              <button onClick={() => handleDelete(b)} className="mt-2 text-red-600 text-xs font-bold hover:underline">
                Delete Banner & Image
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}