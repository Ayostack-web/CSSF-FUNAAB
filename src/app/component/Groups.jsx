import Image from "next/image";
import { FaMusic, FaPrayingHands, FaHandsHelping, FaPhotoVideo } from "react-icons/fa";
import { GiCrossedSwords, GiDramaMasks } from "react-icons/gi";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function Groups() {
  const Groups = [
    {
      image: "/img/IMG_20251102_233014_825.jpg",
      name: "Prayer Unit",
      icon: <FaPrayingHands className="inline-block ml-2 text-lg" />,
      about: "🙏 Connecting hearts to heaven through prayer. Join us in faith and fellowship!✨."
    },
    {
      image: "/img/IMG_20251102_163931_572.jpg",
      name: "Choir",
      icon: <FaMusic className="inline-block ml-2 text-lg" />,
      about: "🎶 Lifting hearts with every note! Join our choir and feel the joy of worship.🙌✨."
    },
    {
      image: "/img/IMG_20251102_232336_623.jpg",
      name: "Drama unit",
      icon: <GiDramaMasks className="inline-block ml-2 text-lg" />,
      about: "🎭 Bringing God's word to life through creativity and performance!✨🙏."
    },
    {
      image: "/img/IMG_20251102_232759_670.jpg",
      name: "Evangelical Unit",
      icon: <FaHandsHelping className="inline-block ml-2 text-lg" />,
      about: "📢 Sharing God's love with the world, one heart at a time!✨🙏."
    },
    {
      image: "/img/IMG_20251102_221019_834.jpg",
      name: "Media Unit",
      icon: <FaPhotoVideo className="inline-block ml-2 text-lg" />,
      about: "🎥 Capturing and sharing the message of God through creativity and technology."
    },
     {
      image: "/img/IMG_20251103_132510_405~2.jpg",
      name: "Levite Unit",
       icon: <GiCrossedSwords className="inline-block ml-2 text-lg" />,
      about: "To create an atmosphere where God's presence is honoured and His people are lifted.",
      link: "#",
    },
  ];

  return (
    <section id="Group" className="py-8 px-4 bg-blue-50 text-black">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-800 drop-shadow-md">KINGDOM BUILDERS</h2>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">
        {Groups.map((grp, idx) => (
          <div
            key={idx}
            className="bg-blue-50 rounded-lg shadow-lg shadow-blue-950 hover:shadow-xl transition-shadow overflow-hidden"
          >
            {/* Image */}
            <div className="relative w-full h-80">
              <Image
                src={grp.image}
                alt={grp.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold flex items-center">
                {grp.name} {grp.icon}
              </h3>
              <p className="mt-2">{grp.about}</p> <br />
               {/* Optional link */}
                 <a
                  href={grp.link}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Learn More <FaExternalLinkAlt size={14} />
                </a> 
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}



 