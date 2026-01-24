"use client";
import { useState } from "react";
import { createClient } from "../utils/supabase/client";

export default function BannerAdmin() {
  const [eventName, setEventName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile || !eventName) return alert("Please provide a name and an image.");

    setUploading(true);
    try {
      // 1. Generate a unique file name
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      // 2. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("event-banners")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // 3. Get the Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("event-banners")
        .getPublicUrl(filePath);

      // 4. Save the name and the new URL to the Database
      const { error: dbError } = await supabase
        .from("banners")
        .insert([{ 
          event_name: eventName, 
          image_url: publicUrl 
        }]);

      if (dbError) throw dbError;

      alert("Banner uploaded and published successfully!");
      setEventName("");
      setImageFile(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-blue-900">Upload Event Banner</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Name</label>
          <input 
            type="text"
            className="w-full p-2 border rounded-md text-black"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. Annual Convention 2025"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Image File</label>
          <input 
            type="file"
            accept="image/*"
            className="w-full p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <button 
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Upload & Update Website"}
        </button>
      </form>
    </div>
  );
}