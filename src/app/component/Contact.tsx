"use client";

import { useEffect, useState } from "react";
import type { FC } from "react";

const Contact: FC = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const res = await fetch("/api/site-settings/footer-phone", { cache: "no-store" });
        const data = await res.json();
        const phones: string[] = Array.isArray(data.footerPhones)
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
    <section id="contact" className="section-shell py-2 px-4 text-center">
      <div className="mb-8 space-y-2 text-gray-700 text-left">
        <h2 className="section-title text-3xl mb-5">CONTACT US</h2>
        <p className="font-bold">
          5, Olugbenga Ladebo Street, Harmony Estate, Funaab Gate, Abeokuta, Ogun State.
        </p>
        {phoneNumbers.length > 0 && (
          <p className="font-bold">{phoneNumbers.join(" / ")}</p>
        )}
      </div>
    </section>
  );
};

export default Contact;
