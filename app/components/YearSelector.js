"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

// Year data
const yearData = [
  {
    title: "1st Year",
    subjects: ["Mathematics", "Physics", "Chemistry", "English"],
    image: "/1st.png",
  },
  {
    title: "2nd Year",
    subjects: ["DSA", "DBMS", "OOPS", "CN"],
    image: "/2nd.png",
  },
  {
    title: "3rd Year",
    subjects: ["AI", "Software", "Probability", "Compiler"],
    image: "/3rd.png",
  },
  {
    title: "4th Year",
    subjects: ["Cloud", "Blockchain", "Robot Modelling", "Project"],
    image: "/4th.png",
  },
];

export default function YearSelector() {
  return (
    <section className="w-[95%] max-w-7xl mx-auto mt-8 text-white ">
      {/* Back Button */}
      <Link href="/" className="flex items-center text-white mb-8 hover:text-blue-400 transition">
        <ArrowLeft className="w-8 h-8 mr-2" />
        <span>Home</span>
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-center">Select Your Year</h1>

      {/* Horizontal Year Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {yearData.map((year, index) => (
          <Link href={`/subjects/${index + 1}`} key={index}>
            <div
              className="bg-gradient-to-r from-white to-gray-50 rounded-[20px] p-6 
              shadow-md hover:shadow-lg transition-all duration-300 ease-in-out
              hover:scale-105 hover:border-2 cursor-pointer "
            >
              {/* Student Avatar/Illustration */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 
                overflow-hidden border-2 border-blue-200 group-hover:border-blue-400 transition-colors">
                  <Image 
                    src={year.image} 
                    alt={year.title} 
                    width={64} 
                    height={64} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>

              {/* Year Title */}
              <h3 className="text-xl font-bold mb-4 text-center text-gray-800 
              group-hover:text-blue-700 transition-colors">
                {year.title}
              </h3>

              {/* Subjects List */}
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                {year.subjects.map((subject, i) => (
                  <div 
                    key={i} 
                    className="text-center py-1 px-2 bg-gray-100 rounded-lg 
                    group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors"
                  >
                    {subject}
                  </div>
                ))}
              </div>

              
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
