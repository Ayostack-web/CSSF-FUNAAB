import { FaPrayingHands, FaBible, FaChurch, FaRegSun } from "react-icons/fa";

export default function Experience() {
  const experienceList = [
    {
      Day1: "Monday: Prayer Meeting 6 - 7:30pm",
      Day2: "Bible Study: 2pm - 4pm",
      LastFriday: "Last Friday of the month Vigil",
      Sunday: "Sunday: Thanksgiving Service 8pm",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-blue-100 via-blue-100 to-blue-100 text-gray-800">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-800 drop-shadow-md">
        Weekly Services
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {experienceList.map((exp, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-3 flex flex-col items-start"
          >
            <div className="flex items-center mb-4 gap-3">
              <FaPrayingHands className="text-blue-500 text-2xl" />
              <h3 className="text-xl font-semibold">{exp.Day1}</h3>
            </div>

            <div className="flex items-center mb-4 gap-3">
              <FaBible className="text-green-500 text-2xl" />
              <h3 className="text-xl font-semibold">{exp.Day2}</h3>
            </div>

            <div className="flex items-center mb-4 gap-3">
              <FaChurch className="text-purple-500 text-2xl" />
              <h3 className="text-xl font-semibold">{exp.LastFriday}</h3>
            </div>

            <div className="flex items-center gap-3">
              <FaRegSun className="text-yellow-500 text-2xl" />
              <h3 className="text-xl font-semibold">{exp.Sunday}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
