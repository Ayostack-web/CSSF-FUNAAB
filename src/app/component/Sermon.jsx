"use client";
import { useState } from "react";
import { getDriveStreamLink } from "../utils/formatDriveLink";

export default function SermonsMedia({ serverSermons }) {
  const tabs = ["Annointed Sounds", "Sermons", "Worship Music"];
  const [activeTab, setActiveTab] = useState("Annointed Sounds");

  const staticMedia = {
    "Annointed Sounds": [
      { type: "video", id: "5taka1Ftu-E", title: "Yahweh Sabaoth" },
      { type: "video", id: "85B_DpmMunk", title: "Omemma" },
    ],
    "Worship Music": [
      {
        type: "audio",
        src: "/media/Dunsin-Oyekan-Worthy-of-My-Praise-(CeeNaija.com) (1).mp3",
        title: "Worthy of My Praise",
      },
      {
        type: "audio",
        src: "/media/Nathaniel_Bassey_-_Hallelujah_Challenge_Praise_Medley_CeeNaija.com_ (1).mp3",
        title: "Hallelujah Challenge",
      },
    ],
  };

  const mediaData = {
    ...staticMedia,
    "Sermons": serverSermons.map((s) => ({
      type: "drive_embed", // Updated type
      link: s.drive_link,
      title: s.title,
    })),
  };

  return (
    <section id="sermon" className="py-10 px-4 bg-blue-50">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-800 drop-shadow-md">
        Sermons & Media
      </h2>

      <div className="flex justify-center gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === tab ? "bg-blue-600 text-white shadow-lg" : "bg-white text-blue-600 border border-blue-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {mediaData[activeTab]?.map((item, idx) => (
          <div key={idx} className="bg-white shadow-md rounded-lg overflow-hidden border border-blue-100">
            
            {/* YouTube Videos */}
            {item.type === "video" && (
              <iframe width="100%" height="250" src={`https://www.youtube.com/embed/${item.id}`} title={item.title} allowFullScreen></iframe>
            )}

            {/* Local Audio Files */}
            {item.type === "audio" && (
              <div className="p-4 bg-slate-50">
                <audio controls className="w-full">
                  <source src={item.src} type="audio/mpeg" />
                </audio>
              </div>
            )}

            {/* UPDATED: Google Drive Iframe Player */}
            {item.type === "drive_embed" && (
              <div className="relative w-full h-[150px] bg-slate-100">
                <iframe
                  src={getDriveStreamLink(item.link)}
                  width="100%"
                  height="100%"
                  allow="autoplay"
                  className="rounded-t-lg"
                ></iframe>
              </div>
            )}

            <div className="p-4">
              <h3 className="font-semibold text-blue-900">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

