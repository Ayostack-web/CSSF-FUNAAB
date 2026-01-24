"use client";
import { useState } from "react";
import { createClient } from "../utils/supabase/client";

export default function BannerAdmin() {
  const [eventName, setEventName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile || !eventName) return alert("Please select a file and enter a name.");

    setIsUploading(true);
    try {
      // 1. Upload the file to your "event-banners" bucket
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`; // Unique name to avoid overwriting
      const filePath = `banners/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("event-banners")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // 2. Get the public URL for the image
      const { data: { publicUrl } } = supabase.storage
        .from("event-banners")
        .getPublicUrl(filePath);

      // 3. Save the public URL into your banners table
      const { error: dbError } = await supabase
        .from("banners")
        .insert([{ 
          event_name: eventName, 
          image_url: publicUrl,
          storage_path: filePath // Good to keep for when you want to delete the file later
        }]);

      if (dbError) throw dbError;

      alert("Success! Image uploaded and banner published.");
      setEventName("");
      setImageFile(null);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">New Event Banner</h3>
      <input 
        type="text" 
        placeholder="Event Name" 
        className="w-full p-2 mb-4 border rounded text-black"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />
      <input 
        type="file" 
        accept="image/*"
        className="w-full p-2 mb-4 text-sm"
        onChange={(e) => setImageFile(e.target.files[0])}
      />
      <button 
        disabled={isUploading}
        className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700"
      >
        {isUploading ? "Uploading..." : "Upload & Publish"}
      </button>
    </form>
  );
}