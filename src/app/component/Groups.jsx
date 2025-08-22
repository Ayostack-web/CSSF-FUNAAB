import Image from "next/image";
import { FaMusic, FaPrayingHands, FaHandsHelping, FaPhotoVideo } from "react-icons/fa";
import { GiDramaMasks } from "react-icons/gi";

export default function Groups() {
  const Groups = [
    {
      image: "/img/1755458216579.jpg",
      name: "Prayer Unit",
      icon: <FaPrayingHands className="inline-block ml-2 text-lg" />,
      about: "🙏 Connecting hearts to heaven through prayer. Join us in faith and fellowship!✨."
    },
    {
      image: "/img/1755456350605.jpg",
      name: "Choir",
      icon: <FaMusic className="inline-block ml-2 text-lg" />,
      about: "🎶 Lifting hearts with every note! Join our choir and feel the joy of worship.🙌✨."
    },
    {
      image: "/img/1755455924019.jpg",
      name: "Drama Unit",
      icon: <GiDramaMasks className="inline-block ml-2 text-lg" />,
      about: "🎭 Bringing God's word to life through creativity and performance!✨🙏."
    },
    {
      image: "/img/1755458107944.jpg",
      name: "Evangelical Unit",
      icon: <FaHandsHelping className="inline-block ml-2 text-lg" />,
      about: "📢 Sharing God's love with the world, one heart at a time!✨🙏."
    },
    {
      image: "/img/1755456270644.jpg",
      name: "Media Unit",
      icon: <FaPhotoVideo className="inline-block ml-2 text-lg" />,
      about: "🎥 Capturing and sharing the message of God through creativity and technology"
    },
  ];

  return (
    <section className="py-8 px-4 bg-blue-100 text-black">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-800 drop-shadow-md">MINISTRIES</h2>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
        {Groups.map((grp, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md shadow-gray-500 hover:shadow-xl transition-shadow overflow-hidden"
          >
            {/* Image */}
            <div className="relative w-full h-64">
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
              <p className="mt-2">{grp.about}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
