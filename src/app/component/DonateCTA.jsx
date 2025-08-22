export default function DonateCTA(){
  return(  
<section className="bg-blue-100 py-8 text-center">
  <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-800 drop-shadow-md">Support Our Mission</h2>
  <p className="text-lg text-blue-950 mb-8">
     Your donation helps us continue making a positive impact.
        Every contribution counts thank you for your support!
  </p>

  {/* Opay Account Details */}
  <div className="bg-blue-50 p-6 rounded-lg inline-block shadow-md">
    <p className="text-lg font-semibold">Opay Account Name:</p>
    <p className="text-xl text-black-600">CSSF FUNAAB</p>
    <p className="mt-2 text-lg font-semibold">Opay Number:</p>
    <p className="text-xl text-black-600">801*******</p>
  </div>

  {/* Donate Button (Opay Payment Link if available) */}
  <a
    href="https://pay.opaycheckout.com/xyzfellowship" // replace with real link
    target="_blank"
    rel="noopener noreferrer"
              className="inline-block px-8 py-3 mt-3 text-lg font-semibold text-black bg-gradient-to-tr from-blue-300 to-teal-50 rounded-full shadow-lg hover:from-blue-900 hover:to-white hover:-translate-y-1 transition"
  >
    Donate with Opay
  </a>
</section>
 )
}
