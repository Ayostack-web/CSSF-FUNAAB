import React from "react";

const events = [
  {
    title: "Brothers & Sisters week 2025",
    date: "November 10th - 16th; 2025",
    location: "Fellowship Auditorium ",
    link: "#",
  },
];

export default function UpcomingEvents() {
  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-800 drop-shadow-md">
          Upcoming Events
        </h2>
        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-1">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-blue-100 rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300 shadow-sky-500"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {event.title}
              </h3>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Date:</span> {event.date}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-medium">Location:</span> {event.location}
              </p>
              <a
                href={event.link}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Learn More
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


