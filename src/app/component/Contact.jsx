"use client";

import { useEffect, useState } from "react";

const Contact = () => {
  const [phoneNumbers, setPhoneNumbers] = useState([]);

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const res = await fetch("/api/site-settings/footer-phone", { cache: "no-store" });
        const data = await res.json();
        const phones = Array.isArray(data.footerPhones)
          ? data.footerPhones
          : [data.footerPhone, data.footerPhoneSecondary].filter(Boolean);
        setPhoneNumbers(phones);
      } catch {
        setPhoneNumbers([]);
      }
    };

    fetchPhoneNumber();
  }, []);

  return (
    <section
      id="contact"
      className="bg-blue-50 py-2 px-4 text-center"
    >
       {/* Contact Info */}
        <div className="mb-8 space-y-2  text-gray-700 text-left">
           <h2 className="text-3xl font-bold text-gray-800 mb-5">CONTACT US</h2>
          <p className="font-bold" >🏠 5, Olugbenga Ladebo Street,
            Harmony Estate, Funaab Gate,
            Abeokuta, Ogun State.
          </p>
          {phoneNumbers.length > 0 && (
            <p className="font-bold">📞 {phoneNumbers.join(" / ")}</p>
          )}
        </div>
    </section>
  );
};

export default Contact;
