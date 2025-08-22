"use client";
import { useState } from "react";

export default function SermonsMedia() {
  const tabs = ["Latest Sermons", "Podcast", "Worship Music"];
  const [activeTab, setActiveTab] = useState("Latest Sermons");

  const mediaData = {
    "Latest Sermons": [
      { type: "video", id: "dQw4w9WgXcQ", title: "Faith in Hard Times" },
      { type: "video", id: "hY7m5jjJ9mM", title: "Walking in the Spirit" },
    ],
    "Podcast": [
      { type: "audio", src: "/audio/episode1.mp3", title: "Episode 1: Hope" },
      { type: "audio", src: "/audio/episode2.mp3", title: "Episode 2: Grace" },
    ],
    "Worship Music": [
      { type: "video", id: "fLexgOxsZu0", title: "Worship Song 1" },
      { type: "audio", src: "/audio/worship.mp3", title: "Worship Song 2" },
    ],
  };

  return (
    <section className="py-10 px-4 bg-blue-100">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-800 drop-shadow-md">Sermons & Media</h2>

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
        {mediaData[activeTab].map((item, idx) => (
          <div key={idx} className="bg-white shadow rounded-lg overflow-hidden">
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
