"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "../utils/supabase/client";

export default function BannerAdmin() {
  const [banners, setBanners] = useState([]);
  const [eventName, setEventName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  const fileInputRef = useRef(null);
  const supabase = createClient();

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile || !eventName) return alert("Please select a file and name.");

    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `banners/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("event-banners")
        .upload(filePath, imageFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("event-banners").getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("banners").insert([{ 
        event_name: eventName, 
        image_url: publicUrl,
        storage_path: filePath 
      }]);

      if (dbError) throw dbError;

      alert("Banner uploaded successfully!");
      setEventName("");
      setImageFile(null);
      setPreviewUrl(null);
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

    setDeletingId(id);
    try {
      if (storagePath) {
        await supabase.storage.from("event-banners").remove([storagePath]);
      }
      await supabase.from("banners").delete().eq("id", id);
      fetchBanners();
    } catch (err) {
      alert("Error deleting: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <form onSubmit={handleUpload} className="p-6 bg-white rounded-xl shadow-md border border-blue-100">
        <h3 className="text-xl font-bold mb-4 text-blue-900">Add New Event Banner</h3>
        
        <div className="space-y-4">
          <input 
            type="text" placeholder="Event Name (e.g. Sunday Service)" 
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
          />
          
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-100 rounded-lg p-6 bg-blue-50">
            <input 
              type="file" accept="image/*" ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
            {previewUrl && (
              <div className="mt-4 relative w-full max-w-[300px] h-40 rounded-lg overflow-hidden shadow-inner bg-white">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          <button 
            disabled={isUploading} 
            className="w-full bg-blue-700 text-white p-3 rounded-lg font-bold hover:bg-blue-800 transition disabled:bg-gray-400"
          >
            {isUploading ? "Uploading to Server..." : "Publish Banner"}
          </button>
        </div>
      </form>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-blue-900">Live Banners</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="border rounded-xl p-4 flex flex-col items-center bg-slate-50 relative group">
              <img src={banner.image_url} alt={banner.event_name} className="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" />
              <p className="font-bold text-gray-800">{banner.event_name}</p>
              <button 
                onClick={() => handleDelete(banner.id, banner.storage_path)}
                disabled={deletingId === banner.id}
                className="mt-3 text-red-600 text-sm font-bold bg-red-50 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition w-full"
              >
                {deletingId === banner.id ? "Deleting..." : "Remove Banner"}
              </button>
            </div>
          ))}
          {banners.length === 0 && <p className="text-gray-400 italic text-center col-span-2 py-10">No banners currently live.</p>}
        </div>
      </div>
    </div>
  );
}