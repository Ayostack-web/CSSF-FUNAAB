"use client";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import { FaCalendarAlt, FaTimes } from "react-icons/fa";

export default function BannerOverlay() {
  const [banner, setBanner] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchBanner = async () => {
      const { data } = await supabase
        .from("banners")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);
      
      if (data && data.length > 0) setBanner(data[0]);
    };
    fetchBanner();
  }, []);

  if (!banner || !isVisible) return null;

  return (
    <div className="fixed bottom-10 right-10 z-50 max-w-sm animate-bounce-in">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-600 relative">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black"
        >
          <FaTimes size={12} />
        </button>
        
        <img 
          src={banner.image_url} 
          alt={banner.event_name} 
          className="w-full h-40 object-cover"
        />
        
        <div className="p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <FaCalendarAlt size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Upcoming Event</span>
          </div>
          <h3 className="font-bold text-gray-900 leading-tight mb-3">
            {banner.event_name}
          </h3>
          <a 
            href={banner.image_url} 
            target="_blank" 
            className="block text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
          >
            View Full Banner
          </a>
        </div>
      </div>
    </div>
  );
}