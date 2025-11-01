"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from '../../components/navbar';

const yearData = {
  "1": ["Mathematics", "Physics", "Chemistry", "English"],
  "2": ["DSA", "DBMS", "OOPs", "CN"],
  "3": ["AI", "Software Engineering", "Probability & Statistics", "Compiler"],
  "4": ["Cloud", "Blockchain", "Robot Modelling", "Project"],
};

export default function SubjectPage() {
  const params = useParams();
  const { year } = params;
  const subjects = yearData[year] || [];

  return (
    <>
    <Navbar />
    <section className="w-[90%] mx-auto mt-8 text-white">
      <Link href="/select-year" className="flex items-center text-white mb-4 hover:text-blue-400 transition">
        <ArrowLeft className="w-8 h-8 mr-2" />  
        Year select
      </Link>

      <h1 className="text-3xl font-bold mb-6 py-4">{year} Year Subjects</h1>

      <div className="grid grid-cols-2 gap-4">
        {subjects.map((subject, i) => (
          <Link
          href={`/subjects/${year}/${subject.toLowerCase()}`}
          key={i}
          className="bg-gray-700 rounded-xl p-6 flex justify-between items-center hover:bg-gray-600 transition"
        >
            <span className="text-xl">{subject}</span>
            <span>›</span>
          </Link>
        ))}
      </div>
    </section>
    </>
  );
}
