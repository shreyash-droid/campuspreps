"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";

export default function SubjectTabs() {
  const params = useParams(); // ✅ now inside component
  const { year, subject } = params;
  const [activeTab, setActiveTab] = useState("notes");
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (index) => {
    setFavorites((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };
  

  return (
    <div className="text-white w-[90%] mx-auto mt-8">
      {/* ✅ Back Button to Subjects Page */}
      <Link
        href={`/subjects/${year}`}
        className="flex items-center text-white mb-4 hover:text-blue-400 transition"
      >
        <ArrowLeft className="w-8 h-8 mr-2" />
        <span>Back to Subjects</span>
      </Link>

      <h1 className="text-3xl font-bold capitalize py-2 mb-4">{subject}</h1>

      {/* Tabs */}
      <div className="flex w-full rounded-full overflow-hidden border border-white mb-6">
        {["notes", "qp", "yt"].map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setActiveTab(tabKey)}
            className={`flex-1 px-4 py-2 font-semibold transition ${
              activeTab === tabKey ? "bg-white text-black" : "bg-transparent"
            }`}
          >
            {{
              notes: "Module-wise Notes",
              qp: "Question Papers",
              yt: "Youtube Links",
            }[tabKey]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "notes" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
                key={i}
                className="bg-white text-black p-4 rounded-lg flex justify-between items-center"
            >
                <span className="text-lg">Module - {i + 1}</span>
                <button onClick={() => toggleFavorite(i)} className="text-2xl">
                {favorites.includes(i) ? "★" : "☆"}
                </button>
            </div>
            ))}
        </div>
      )}

      {activeTab === "qp" && (
        <div className="grid grid-cols-1 px-40 sm:grid-cols-2 gap-4 py-2">
          <div className="bg-white text-black p-4 rounded-lg font-semibold hover:bg-white/80 transition duration-200">
            MID-SEM
          </div>
          <div className="bg-white text-black p-4 rounded-lg font-semibold hover:bg-white/80 transition duration-200">
            END-SEM
          </div>
        </div>
      )}

      {activeTab === "yt" && (  
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-white px-10">
              <span className="font-semibold">Module {i + 1} - </span>
              www.youtube.com/link{i + 1}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
