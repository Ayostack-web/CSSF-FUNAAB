import Image from "next/image";

export default function AboutUs() {
  return (
    <section className="bg-blue-100 py-6 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Image */}
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/img/1755455608396.jpg" // ✅ Correct reference (public/img/main.jpg)
            alt="Our Mission"
            fill
            className="object-cover"
          />
        </div>

        {/* Right Side - Text */}
        <div>
          <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-800 drop-shadow-md">
            Our Mission
          </h2>
          <p className="text-gray-800 leading-relaxed mb-6">
            We are a passionate community committed to transforming lives through faith, service, 
            and unity. Our mission is to create a welcoming space where everyone can grow spiritually, 
            build meaningful relationships, and discover their purpose in God’s plan.
          </p>
          <p className="text-gray-800 leading-relaxed mb-6">
            Guided by our core values of love, compassion, and integrity, we strive to impact our 
            local and global communities through outreach, worship, and discipleship.
          </p>
          <a
            href="#"
            className="inline-block px-8 py-3 text-lg font-semibold text-black bg-gradient-to-tr from-blue-300 to-teal-50 rounded-full shadow-lg hover:from-blue-900 hover:to-white hover:-translate-y-1 transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
