"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

// Year data
const yearData = [
  {
    title: "1st Year",
    subjects: ["Maths", "Physics", "Chemistry", "English"],
    image: "/1st.png",
  },
  {
    title: "2nd Year",
    subjects: ["DSA", "DBMS", "OOPS", "CN"],
    image: "/2nd.png",
  },
  {
    title: "3rd Year",
    subjects: ["AI", "ML", "OS", "Compiler"],
    image: "/3rd.png",
  },
  {
    title: "4th Year",
    subjects: ["Cloud", "Blockchain", "IoT", "Project"],
    image: "/4th.png",
  },
];

export default function YearSelector() {
  return (
    <section className="w-[90%] mx-auto mt-8 text-white">
      {/* Back Button */}
      <Link href="/" className="flex items-center text-white mb-4 hover:text-blue-400 transition">
        <ArrowLeft className="w-8 h-8 mr-2" />
        <span>Home</span>
      </Link>

      <h1 className="text-3xl font-bold mb-6">Select Your Year</h1>

      {/* Year Cards */}
      <div className="flex flex-col gap-6">
        {yearData.map((year, index) => (
          <Link href={`/subjects/${index + 1}`} key={index}>
            <div
              className="bg-gradient-to-l from-yellow-100 to-white rounded-xl px-6 py-6 flex flex-col md:flex-row items-start 
              md:items-center justify-between gap-4 md:gap-10 backdrop-blur-md 
              hover:scale-105 transition duration-300 cursor-pointer"
            >
              {/* Circle Avatar */}
              <div className="w-28 h-24 rounded-full bg-gray-600 overflow-hidden">
                <Image src={year.image} alt={year.title} width={112} height={96} className="w-full h-full object-cover" />
              </div>

              {/* Year Title + Subjects */}
              <div className="flex flex-col gap-2 w-full">
                
                <h3 className="text-xl font-bold mb-1 text-black">{year.title}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 text-black">
                  {year.subjects.map((subj, i) => (
                    <span key={i}>{subj}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
