"use client";
import { useState } from "react";

export default function SermonsMedia() {
  const tabs = ["Latest Sermons", "Podcast", "Worship Music"];
  const [activeTab, setActiveTab] = useState("Latest Sermons");

  const mediaData = {
    "Latest Sermons": [
      { type: "video", id: "5taka1Ftu-E", title: "Yahweh Sabaoth" },
      { type: "video", id: "85B_DpmMunk", title: "Omemma" },
    ],
    "Podcast": [
      { type: "audio", src: "/audio/episode1.mp3", title: "Episode 1: Hope" },
      { type: "audio", src: "/audio/episode2.mp3", title: "Episode 2: Grace" },
    ],
    "Worship Music": [
      { type: "audio", id: "/media/Dunsin-Oyekan-Worthy-of-My-Praise-(CeeNaija.com) (1).mp3", title: "Worthy of My Praise" },
      { type: "audio", src: "/media/Nathaniel_Bassey_-_Hallelujah_Challenge_Praise_Medley_CeeNaija.com_ (1).mp3", title: "Hallelujah Challenge" },
    ],
  };

  return (
    <section id="sermon" className="py-10 px-4 bg-blue-100">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-800 drop-shadow-md">
        Sermons & Media
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border border-blue-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {mediaData[activeTab]?.map((item, idx) => (
          <div
            key={idx}
            className="bg-blue-50 shadow rounded-lg overflow-hidden"
          >
            {item.type === "video" && (
              <div className="relative">
                <iframe
                  width="100%"
                  height="250"
                  src={`https://www.youtube.com/embed/${item.id}`}
                  title={item.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            {item.type === "audio" && (
              <div className="p-4">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <audio controls className="w-full">
                  <source src={item.src} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
