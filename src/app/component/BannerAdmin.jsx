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
    if (!imageFile || !eventName) return alert("Please select a file and enter a name.");

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
          
          {/* MOBILE FRIENDLY UPLOAD BOX */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-100 rounded-lg p-6 bg-blue-50">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" // Forces camera on mobile
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              id="banner-upload"
            />
            <label 
              htmlFor="banner-upload" 
              className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg active:scale-95"
            >
              {imageFile ? "Change Image" : "Select or Take Photo"}
            </label>

            {previewUrl && (
              <div className="mt-4 relative w-full max-w-[300px] h-40 rounded-lg overflow-hidden shadow-inner bg-white border">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              </div>
            )}
            <p className="mt-2 text-xs text-blue-400">{imageFile ? imageFile.name : "Tap to open camera or gallery"}</p>
          </div>

          <button 
            disabled={isUploading} 
            className="w-full bg-blue-800 text-white p-4 rounded-lg font-bold hover:bg-blue-900 transition disabled:bg-gray-400 shadow-md"
          >
            {isUploading ? "Uploading..." : "Publish to Website"}
          </button>
        </div>
      </form>

      {/* MANAGE SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-blue-900">Live Banners</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="border rounded-xl p-4 flex flex-col items-center bg-slate-50 shadow-sm">
              <img src={banner.image_url} alt={banner.event_name} className="w-full h-40 object-cover rounded-lg mb-3" />
              <p className="font-bold text-gray-800 text-center">{banner.event_name}</p>
              <button 
                onClick={() => handleDelete(banner.id, banner.storage_path)}
                disabled={deletingId === banner.id}
                className="mt-3 text-red-600 text-sm font-bold bg-red-50 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition w-full border border-red-100"
              >
                {deletingId === banner.id ? "Deleting..." : "Delete Banner"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}