"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "../utils/supabase/client";

export default function BannerAdmin() {
  const [banners, setBanners] = useState([]);
  const [eventName, setEventName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const supabase = createClient();

  // Load existing banners so we can delete them
  const fetchBanners = async () => {
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("created_at", { ascending: false });
    setBanners(data || []);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile || !eventName) return alert("Please select a file and name.");

    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `banners/${Date.now()}.${fileExt}`;

      // 1. Upload file to Storage
      const { error: uploadError } = await supabase.storage
        .from("event-banners")
        .upload(filePath, imageFile);
      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage.from("event-banners").getPublicUrl(filePath);

      // 3. Save to DB (including the filePath so we can delete it later)
      const { error: dbError } = await supabase.from("banners").insert([{ 
        event_name: eventName, 
        image_url: publicUrl,
        storage_path: filePath 
      }]);

      if (dbError) throw dbError;
      alert("Banner uploaded!");
      setEventName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchBanners();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id, storagePath) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      // 1. Delete from Storage Bucket
      if (storagePath) {
        const { error: storageError } = await supabase.storage
          .from("event-banners")
          .remove([storagePath]);
        if (storageError) throw storageError;
      }

      // 2. Delete from Database Table
      const { error: dbError } = await supabase.from("banners").delete().eq("id", id);
      if (dbError) throw dbError;

      alert("Banner deleted successfully!");
      fetchBanners();
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* UPLOAD SECTION */}
      <form onSubmit={handleUpload} className="p-6 bg-white rounded-xl shadow-md border border-blue-100">
        <h3 className="text-xl font-bold mb-4 text-blue-900">Add New Banner</h3>
        <input 
          type="text" placeholder="Event Name" value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg text-black"
        />
        <input 
          type="file" accept="image/*" ref={fileInputRef}
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full mb-4 text-sm text-slate-500"
        />
        <button disabled={isUploading} className="w-full bg-blue-700 text-white p-3 rounded-lg font-bold">
          {isUploading ? "Uploading..." : "Upload Banner"}
        </button>
      </form>

      {/* MANAGE/DELETE SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-blue-900">Live Banners</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="border rounded-lg p-3 flex flex-col items-center">
              <img src={banner.image_url} alt={banner.event_name} className="w-full h-32 object-cover rounded-md mb-2" />
              <p className="font-medium text-sm text-gray-800">{banner.event_name}</p>
              <button 
                onClick={() => handleDelete(banner.id, banner.storage_path)}
                className="mt-2 text-red-600 text-xs font-bold hover:underline"
              >
                Delete Permanently
              </button>
            </div>
          ))}
          {banners.length === 0 && <p className="text-gray-400 italic">No banners uploaded yet.</p>}
        </div>
      </div>
    </div>
  );
}