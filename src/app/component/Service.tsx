import { FaPrayingHands, FaBible, FaChurch, FaRegSun } from "react-icons/fa";
import type { FC } from "react";

const services = [
  { icon: <FaPrayingHands className="text-blue-500 text-2xl" />, text: "Monday: Prayer Meeting 6 - 7:30pm" },
  { icon: <FaBible className="text-green-500 text-2xl" />, text: "Wednesday: Bible Study 2pm - 4pm" },
  { icon: <FaChurch className="text-purple-500 text-2xl" />, text: "Last Friday of the month Vigil 10pm" },
  { icon: <FaRegSun className="text-yellow-500 text-2xl" />, text: "Sunday: Thanksgiving Service 8am" },
];

const Service: FC = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-blue-50 via-blue-50 to-blue-50 text-gray-800">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-900 drop-shadow-md">
        Weekly Services
      </h2>

      <div className="max-w-3xl mx-auto grid grid-cols-1 gap-8">
        <div className="bg-blue-50 p-6 shadow-blue-950 rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-3 flex flex-col items-start">
          {services.map((svc, idx) => (
            <div key={idx} className="flex items-center mb-4 gap-3 last:mb-0">
              {svc.icon}
              <h3 className="text-xl font-semibold">{svc.text}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;
