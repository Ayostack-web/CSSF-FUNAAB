



"use client";
import { useState, useRef } from "react";
import { getDriveStreamLink } from "../utils/formatDriveLink";
import Autoplay from "embla-carousel-autoplay";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  CarouselIndicators,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

export default function SermonsMedia({ serverSermons = [], serverWorship = [] }) {
  // FIX 1: Ensure Tab name matches the logic below
  const tabs = ["Annointed Sounds", "Sermons", "Gallery"];
  const [activeTab, setActiveTab] = useState("Annointed Sounds");
  
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  const staticMedia = {
    "Annointed Sounds": [
      { type: "video", id: "5taka1Ftu-E", title: "Yahweh Sabaoth" },
      { type: "video", id: "85B_DpmMunk", title: "Omemma" },
    ],
  };

  const mediaData = {
    ...staticMedia,
    "Sermons": serverSermons.map((s) => ({
      type: "drive_embed",
      link: s.drive_link,
      title: s.title,
    })),
  };

  return (
    <section id="sermon" className="py-10 px-4 bg-blue-50">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-800 drop-shadow-md">
        Sermons & Media
      </h2>

      {/* TABS NAVIGATION */}
      <div className="flex justify-center gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              activeTab === tab 
                ? "bg-blue-600 text-white shadow-lg scale-105" 
                : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-6xl mx-auto">
        {/* FIX 2: Check for "Gallery" tab to show the images */}
        {activeTab === "Gallery" ? (
          serverWorship.length > 0 ? (
            <Carousel
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              className="w-full relative"
              opts={{ align: "center", loop: true }}
            >
              <CarouselContent>
                {serverWorship.map((item, idx) => (
                  <CarouselItem key={idx} index={idx} className="basis-full md:basis-1/2 lg:basis-1/3">
                    <Card className="border-none overflow-hidden shadow-xl rounded-2xl bg-white group">
                      <div className="relative aspect-square overflow-hidden">
                        <img 
                          src={item.image_url || ""} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop";
                          }}
                        />
                        {/* Overlay text */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6">
                          <h3 className="text-white font-bold text-xl">{item.title}</h3>
                          <p className="text-blue-200 text-xs uppercase tracking-widest mt-1">Worship Image</p>
                        </div>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {typeof CarouselPrevious === "function" && (
                <CarouselPrevious className="left-0 bg-white border-blue-600 text-blue-600" />
              )}
              {typeof CarouselNext === "function" && (
                <CarouselNext className="right-0 bg-white border-blue-600 text-blue-600" />
              )}
              <CarouselIndicators className="hidden md:flex" />
            </Carousel>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-inner border-2 border-dashed border-blue-200">
              <p className="text-xl font-semibold text-gray-400">The Gallery is currently empty</p>
            </div>
          )
        ) : (
          /* SERMONS AND ANNOINTED SOUNDS GRID */
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {mediaData[activeTab]?.map((item, idx) => (
              <div key={idx} className="bg-white shadow-lg rounded-2xl overflow-hidden border border-blue-100 transition-transform hover:-translate-y-1">
                
                {item.type === "video" && (
                  <div className="aspect-video">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${item.id}`} 
                      title={item.title} 
                      allowFullScreen
                      className="border-none"
                    ></iframe>
                  </div>
                )}

                {item.type === "drive_embed" && (
                  <div className="relative w-full aspect-video bg-slate-900">
                    <iframe
                      src={getDriveStreamLink(item.link)}
                      width="100%"
                      height="100%"
                      allow="autoplay"
                      className="border-none"
                    ></iframe>
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-bold text-lg text-blue-900 leading-tight">{item.title}</h3>
                  <span className="text-xs font-bold text-blue-400 uppercase mt-2 block tracking-wider">
                    {activeTab === "Sermons" ? "Message" : "Live Worship"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}