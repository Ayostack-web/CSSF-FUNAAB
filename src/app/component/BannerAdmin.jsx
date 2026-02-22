"use client";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Loader2, Plus, Image as ImageIcon } from "lucide-react";

export default function BannerAdmin() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [eventName, setEventName] = useState("");
  const [file, setFile] = useState(null);
  const supabase = createClient();

  // 1. Fetch all banners on load
  useEffect(() => {
    fetchBanners();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchBanners();
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  async function fetchBanners() {
    try {
      const res = await fetch(`/api/banner/list?t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store'
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || 'Failed to fetch banners');
      }

      setBanners(payload.banners || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setBanners([]);
    }
  }

  // 2. Handle Image Upload & Database Insert
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !eventName) return alert("Please provide both name and image");

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      // Upload directly to the bucket root
      const filePath = fileName; 

      // --- STEP A: UPLOAD TO STORAGE ---
      const { error: uploadError } = await supabase.storage
        .from("event-banners") // Bucket name must be exact
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // --- STEP B: GET THE FULL PUBLIC LINK ---
      const { data: urlData } = supabase.storage
        .from("event-banners") // Must match the bucket above
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || "";
      if (!accessToken) throw new Error("Please login again");

      // --- STEP C: INSERT INTO DATABASE VIA SERVER API ---
      const apiRes = await fetch('/api/banner/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ event_name: eventName, image_url: publicUrl })
      });

      const apiData = await apiRes.json();
      if (!apiRes.ok) throw new Error(apiData.error || 'Failed to save banner');

      // SUCCESS: Reset form and refresh
      setEventName("");
      setFile(null);
      fetchBanners(); 
      alert("Banner added successfully!");
    } catch (error) {
      console.error("Upload process failed:", error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  // 3. Handle Delete
  const handleDelete = async (id, imageUrl) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || "";
      if (!accessToken) throw new Error("Please login again");

      const res = await fetch('/api/banner/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ id, image_url: imageUrl })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');

      await fetchBanners();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-blue-900">Banner Management</h1>
        <p className="text-sm text-slate-500">Upload images for the homepage carousel.</p>
      </div>

      {/* Upload Form */}
      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30">
        <CardContent className="pt-6">
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-blue-900 ml-1">Event Name</label>
              <Input 
                placeholder="e.g. Sunday Service" 
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="bg-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-blue-900 ml-1">Banner Image</label>
              <div className="flex gap-2">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="bg-white"
                  required
                />
              </div>
            </div>

            <Button disabled={uploading} className="bg-blue-700 hover:bg-blue-800 w-full">
              {uploading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Banner
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Banners Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.length === 0 && !uploading && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-slate-400">
            <ImageIcon className="mx-auto h-12 w-12 mb-2 opacity-20" />
            <p>No banners found. Upload one to get started.</p>
          </div>
        )}

        {banners.map((banner) => (
          <div key={banner.id} className="relative group rounded-xl overflow-hidden shadow-md border-2 border-white bg-white transition-all hover:shadow-xl">
            <div className="aspect-video w-full overflow-hidden bg-slate-100">
              <img 
                src={banner.image_url} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                alt={banner.event_name} 
              />
            </div>
            <div className="p-3 flex justify-between items-center bg-white">
              <span className="font-bold text-sm text-blue-900 uppercase truncate pr-2">
                {banner.event_name}
              </span>
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={() => handleDelete(banner.id, banner.image_url)}
                className="h-8 w-8"
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}