//"use client"
//import { useRouter } from "next/navigation";

export default function Herovideo(){

  return (
    <section
      id="hero"
      className="relative h-[80vh] flex items-center justify-center text-center text-white overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Hero Text */}
      <div className="relative z-10 px-4">
        <h1 className="text-4xl text-blue-200 md:text-6xl font-bold mb-4">
          A Family in Christ on Campus
        </h1>
        <p className="text-lg md:text-xl mb-8 text-blue-100">
          Join us for worship, prayer, and impact
        </p>
        <a
          href="./About"
          className="inline-block px-8 py-3 text-lg font-semibold text-black bg-gradient-to-tr from-blue-300 to-teal-50 rounded-full shadow-lg hover:from-blue-900 hover:to-white hover:-translate-y-1 transition"
        >
          Join Us
        </a>
      </div>
    </section>
  );
};



