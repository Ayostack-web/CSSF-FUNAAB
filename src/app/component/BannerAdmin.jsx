"use client";
import { useState, useRef } from "react"; // Added useRef to reset the file input
import { createClient } from "../utils/supabase/client";

export default function BannerAdmin() {
  const [eventName, setEventName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // Added preview state
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef(null); // Reference to the file input DOM element
  const supabase = createClient();

  // Handle file selection and generate a preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a temporary URL for preview
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile || !eventName) return alert("Please select a file and enter a name.");

    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("event-banners")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("event-banners")
        .getPublicUrl(filePath);

      // 3. Save to Database
      const { error: dbError } = await supabase
        .from("banners")
        .insert([{ 
          event_name: eventName, 
          image_url: publicUrl,
          storage_path: filePath 
        }]);

      if (dbError) throw dbError;

      alert("Success! Image uploaded and banner published.");
      
      // Reset Form
      setEventName("");
      setImageFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Clear the file input visually
      
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl border border-blue-50">
      <h3 className="text-xl font-bold mb-6 text-blue-900 text-center">New Event Banner</h3>
      
      <form onSubmit={handleUpload} className="space-y-4">
        {/* Event Name Input */}
        <input 
          type="text" 
          placeholder="Enter Event Name" 
          className="w-full p-3 border rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />

        {/* File Input */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50">
          <input 
            type="file" 
            accept="image/*"
            ref={fileInputRef}
            className="hidden" // Hide the ugly default input
            id="banner-upload"
            onChange={handleFileChange}
          />
          <label 
            htmlFor="banner-upload" 
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Select Image
          </label>
          
          {/* Image Preview */}
          {previewUrl && (
            <div className="mt-4 w-full max-w-[200px] h-[120px] rounded-lg overflow-hidden shadow-md">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          
          <p className="text-xs text-blue-400 mt-2">
            {imageFile ? imageFile.name : "No file chosen (PNG, JPG, WEBP)"}
          </p>
        </div>

        {/* Submit Button */}
        <button 
          disabled={isUploading}
          className="w-full bg-blue-800 text-white p-3 rounded-lg font-bold hover:bg-blue-900 transition disabled:bg-slate-400"
        >
          {isUploading ? "Uploading to Server..." : "Upload & Publish Banner"}
        </button>
      </form>
    </div>
  );
}