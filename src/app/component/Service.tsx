import { HandHeart, BookOpen, Church, Sun } from "lucide-react";
import type { FC } from "react";

const services = [
  { icon: <HandHeart size={24} className="text-blue-500" />, text: "Monday: Prayer Meeting 6 - 7:30pm" },
  { icon: <BookOpen size={24} className="text-green-500" />, text: "Wednesday: Bible Study 2pm - 4pm" },
  { icon: <Church size={24} className="text-purple-500" />, text: "Last Friday of the month Vigil 10pm" },
  { icon: <Sun size={24} className="text-yellow-500" />, text: "Sunday: Thanksgiving Service 8am" },
];

const Service: FC = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-blue-50 via-blue-50 to-blue-50 text-gray-800">
      <h2 className="section-title text-4xl text-center mb-12">
        Weekly Services
      </h2>

      <div className="max-w-3xl mx-auto grid grid-cols-1 gap-8">
        <div className="section-shell p-6 shadow-blue-950 rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-3 flex flex-col items-start">
          {services.map((svc, idx) => (
            <div key={idx} className="group flex items-center mb-4 gap-3 last:mb-0">
              <span className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                {svc.icon}
              </span>
              <h3 className="text-xl font-semibold transition-colors duration-300 group-hover:text-blue-800">
                {svc.text}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;
