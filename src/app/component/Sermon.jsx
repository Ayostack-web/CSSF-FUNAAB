/*
"use client";
import { useState } from "react";

export default function SermonsMedia() {
  const tabs = ["Annointed Sounds", "Podcast", "Worship Music"];
  const [activeTab, setActiveTab] = useState("Annointed Sounds");

  const mediaData = {
    "Annointed Sounds": [
      { type: "video", id: "5taka1Ftu-E", title: "Yahweh Sabaoth" },
      { type: "video", id: "85B_DpmMunk", title: "Omemma" },
    ],
       "Podcast": [
      { type: "audio", src: "/audio/episode1.mp3", title: "Episode 1: Hope" },
      { link: "https://drive.google.com/file/d/1eszL473_TZiEOgwZb7z49RRVot1ApFae/view?usp=drivesdk" , title: "Worker's Meeting:" },
    ], 
  

    "Worship Music": [
      { type: "audio", src: "/media/Dunsin-Oyekan-Worthy-of-My-Praise-(CeeNaija.com) (1).mp3", title: "Worthy of My Praise" },
      { type: "audio", src: "/media/Nathaniel_Bassey_-_Hallelujah_Challenge_Praise_Medley_CeeNaija.com_ (1).mp3", title: "Hallelujah Challenge" },
    ],
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
    </section> )} 

    
*/






/*   

When the Spirit repeats a truth, it’s because, He desires it to take deeper root in us. What may sound familiar is often God’s way of strengthening our understanding and guiding us into lasting transformation.  
  
Each repeated word is an invitation to listen again, this time, with a heart ready to obey.  
*Access the messages here:*  
Worker's Meeting:  
https://drive.google.com/file/d/1eszL473_TZiEOgwZb7z49RRVot1ApFae/view?usp=drivesdk  
  
Sunday School:  
https://drive.google.com/file/d/1XSMkHh-uLyUDZUm9IecdGMTpzFeoTsA0/view?usp=drivesdk  
  
Sermon:  
https://drive.google.com/file/d/1pt7ZrzrW52_dBnJWve2fzd94q8gvdEAm/view?usp=drivesdk  
  
School Of The Spirit:  
https://drive.google.com/file/d/1v7341dzrVp4bmDXFZpLds3Q9qqY-jWmn/view?usp=drivesdk


 */



"use client";
import { useState } from "react";

export default function SermonsMedia() {
  const tabs = ["Annointed Sounds", "Sermons", "Worship Music"];
  const [activeTab, setActiveTab] = useState("Annointed Sounds");

  const mediaData = {
    "Annointed Sounds": [
      { type: "video", id: "5taka1Ftu-E", title: "Yahweh Sabaoth" },
      { type: "video", id: "85B_DpmMunk", title: "Omemma" },
    ],

    "Sermons": [
      {
        type: "drive",
        link: "https://drive.google.com/file/d/1eszL473_TZiEOgwZb7z49RRVot1ApFae/view?usp=drivesdk",
        title: "Worker's Meeting",
      },
      {
        type: "drive",
        link: " https://drive.google.com/file/d/1XSMkHh-uLyUDZUm9IecdGMTpzFeoTsA0/view?usp=drivesdk ",
        title: "Sunday School" ,
      },
      {
        type: "drive",
        link: "https://drive.google.com/file/d/1pt7ZrzrW52_dBnJWve2fzd94q8gvdEAm/view?usp=drivesdk ",
        title: "Sermon",
      },
            {
        type: "drive",
        link: "https://drive.google.com/file/d/1v7341dzrVp4bmDXFZpLds3Q9qqY-jWmn/view?usp=drivesdk ",
        title: "School Of The Spirit",
      },

      
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

  // helper to convert google drive "view" link to embeddable preview
  const getDriveEmbedLink = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
  };

  return (
    <section id="sermon" className="py-10 px-4 bg-blue-50">
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
            {/* YouTube Videos */}
            {item.type === "video" && (
              <iframe
                width="100%"
                height="250"
                src={`https://www.youtube.com/embed/${item.id}`}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}

            {/* Local Audio Files */}
            {item.type === "audio" && (
              <div className="p-4">
                <audio controls className="w-full">
                  <source src={item.src} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Google Drive Embedded Player */}
            {item.type === "drive" && (
              <div className="relative">
                <iframe
                  src={getDriveEmbedLink(item.link)}
                  width="100%"
                  height="80"
                  allow="autoplay"
                  className="rounded"
                ></iframe>
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
