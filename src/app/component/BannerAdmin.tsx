"use client";

import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Loader2, Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Banner {
  id: string;
  event_name: string;
  image_url: string;
  created_at: string;
}

export default function BannerAdmin() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchBanners();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
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
        method: "GET",
        cache: "no-store",
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Failed to fetch banners");

      setBanners(payload.banners || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setBanners([]);
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      return toast.error("Please select a banner image");
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("event-banners")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("event-banners")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || "";
      if (!accessToken) throw new Error("Please login again");

      const apiRes = await fetch("/api/banner/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          event_name: eventName.trim(),
          eventDate,
          eventTime,
          image_url: publicUrl,
        }),
      });

      const apiData = await apiRes.json();
      if (!apiRes.ok) throw new Error(apiData.error || "Failed to save banner");

      setEventName("");
      setEventDate("");
      setEventTime("");
      setFile(null);
      fetchBanners();
      toast.success("Banner added successfully!");
    } catch (error) {
      console.error("Upload process failed:", error);
      toast.error((error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    toast("Are you sure you want to delete this banner?", {
      action: {
        label: "Delete",
        onClick: async () => {
          setLoading(true);
          try {
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData?.session?.access_token || "";
            if (!accessToken) throw new Error("Please login again");

            const res = await fetch("/api/banner/delete", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ id, image_url: imageUrl }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Delete failed");

            await fetchBanners();
            toast.success("Banner deleted.");
          } catch (error) {
            toast.error((error as Error).message);
          } finally {
            setLoading(false);
          }
        },
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-blue-900">Banner Management</h1>
        <p className="text-sm text-slate-500">Upload images for the homepage carousel.</p>
      </div>

      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30">
        <CardContent className="pt-6">
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-blue-900 ml-1">Event Name</label>
              <Input
                placeholder="e.g. Sunday Service"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-blue-900 ml-1">Event Date</label>
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-blue-900 ml-1">Event Time</label>
              <Input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-blue-900 ml-1">Banner Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="bg-white"
                required
              />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.length === 0 && !uploading && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-slate-400">
            <ImageIcon className="mx-auto h-12 w-12 mb-2 opacity-20" />
            <p>No banners found. Upload one to get started.</p>
          </div>
        )}

        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative group rounded-xl overflow-hidden shadow-md border-2 border-white bg-white transition-all hover:shadow-xl"
          >
            <div className="aspect-video w-full overflow-hidden bg-slate-100">
              <img
                src={banner.image_url}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                alt={banner.event_name}
              />
            </div>
            <div className="p-3 flex justify-between items-center bg-white">
              <span className="font-bold text-sm text-blue-900 uppercase truncate pr-2">
                {banner.event_name || "UNTITLED EVENT"}
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
