

"use client";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import { FaCalendarAlt } from "react-icons/fa";

export default function BannerSection() {
  const [banner, setBanner] = useState(null);
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

  if (!banner) return null;

  return (
    <div className="w-full bg-blue-50 py-12 px-4">
       {/* H2 Header - Change "Kingdom Gatherings" to your preferred name from the list above */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-blue-800 mb-10 uppercase tracking-tight">
        Kingdom Gatherings
      </h2>
      <div className="max-w-4xl mx-auto bg-blue-50 rounded-3xl shadow-xl shadow-blue-800 overflow-hidden border border-blue-100 flex flex-col md:flex-row">
        
    
        <div className="md:w-1/2 h-85 md:h-auto overflow-hidden">
          <img 
            src={banner.image_url} 
            alt={banner.event_name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        

        <div className="p-8 md:w-1/2 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-blue-600 mb-3">
            <FaCalendarAlt size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Upcoming Event</span>
          </div>
          
          <h3 className="text-2xl font-bold text-blue-900 leading-tight mb-4">
            {banner.event_name}
          </h3>
        </div>
      </div>
    </div>
  );
}

 

