/*     
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



"use client";
import { motion } from "framer-motion";
import { FaGraduationCap, FaPrayingHands, FaBookOpen } from "react-icons/fa";

export default function Upcoming() {
  return (
    <section className="py-16 px-6 bg-blue-50 dark:bg-gray-900 border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border-2 border-blue-50 bg-blue-100 p-8 md:p-12 shadow-xl shadow-blue-900/5"
        >
     
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-50/50" />
          
          <div className="relative z-10 text-center">
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-6 shadow-lg shadow-blue-600/20"
            >
              <FaGraduationCap className="text-3xl" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Exam Grace & <span className="text-blue-600">Success</span>
            </h2>

            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-8" />

            <p className="text-lg md:text-xl text-gray-800 italic leading-relaxed mb-10 max-w-2xl mx-auto">
              "For the Lord gives wisdom; from His mouth come knowledge and understanding."
              <span className="block font-bold text-blue-600 not-italic mt-2 text-sm uppercase tracking-wider">
                — Proverbs 2:6
              </span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">1</div>
                <p className="text-gray-700 font-medium">Retentive Memory & Clarity</p>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">2</div>
                <p className="text-gray-700 font-medium">Divine Speed & Accuracy</p>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors cursor-default"
            >
              <FaPrayingHands />
              RECEIVE GRACE
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



*/

