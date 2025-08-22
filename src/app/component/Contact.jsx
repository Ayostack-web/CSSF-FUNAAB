const Contact = () => {
  return (
    <section
      id="contact"
      className="bg-blue-100 py-4 px-4 text-center"
    >
       {/* Contact Info */}
        <div className="mb-8 space-y-2  text-gray-700 text-left">
           <h2 className="text-3xl font-bold text-gray-800 mb-5">CONTACT US</h2>
          <p className="font-bold" >🏠 5, Olugbenga Ladebo Street,
            Harmony Estate, Funaab Gate,
            Abeokuta, Ogun State.
          </p>
          <p className="font-bold">📞 (123) 456-7890</p>
          <p className="font-bold">📧 hello@pizzaheaven.com</p>
        </div>

       { /* Contact Form 
        <form className="bg-white p-6 rounded-2xl shadow-md space-y-4 text-left">
          <input
            type="text"
            placeholder="Your Name"
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <textarea
            placeholder="Your Message"
            required
            rows={4}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
          <button
            type="submit"
                 className="inline-block px-8 py-3 text-lg font-semibold text-black bg-gradient-to-tr from-blue-300 to-teal-50 rounded-full shadow-lg hover:from-blue-900 hover:to-white hover:-translate-y-1 transition"
          >
            Send Message
          </button>
        </form>*/}
    </section>
  );
};

export default Contact;
