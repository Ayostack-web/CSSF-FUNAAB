import Image from 'next/image';

const About = () => {
  return (
    <section id="about" className="section-shell py-6 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Image */}
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/img/IMG_20251102_232411_744.jpg"
            alt="Our Mission"
            fill
            className="object-cover saturate-100"
          />
        </div>

        {/* Right Side - Text */}
        <div>
          <h2 className="section-title text-4xl text-center mb-12">
            Our Mission
          </h2>
          <p className="text-gray-900 leading-relaxed mb-6 font-sans font-bold">
            We are a passionate community committed to transforming lives through faith, service,
            and unity. Our mission is to create a welcoming space where everyone can grow
            spiritually, build meaningful relationships, and discover their purpose in God&apos;s
            plan.
          </p>
          <p className="text-gray-900 leading-relaxed mb-6 font-sans font-bold">
            Guided by our core values of love, compassion, and integrity, we strive to impact our
            local and global communities through outreach, worship, and discipleship.
          </p>
          <a
            href="#sermon"
            className="btn-cta px-8 py-3"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
