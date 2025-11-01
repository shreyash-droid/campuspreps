"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function SubjectTabs() {
  const params = useParams();
  const { year, subject } = params;
  const [activeTab, setActiveTab] = useState("notes");
  const [favorites, setFavorites] = useState({
    notes: [],
    questionPapers: [],
    youtubeLinks: []
  });

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (type, item) => {
    setFavorites(prev => {
      const currentTypeArray = prev[type];
      const exists = currentTypeArray.some(f => f.id === item.id);
      
      const newFavorites = {
        ...prev,
        [type]: exists
          ? currentTypeArray.filter(f => f.id !== item.id)
          : [...currentTypeArray, item]
      };
      
      return newFavorites;
    });
  };

  const isItemFavorited = (type, itemId) => {
    return favorites[type].some(f => f.id === itemId);
  };

  // Mock data for each tab
  const moduleNotes = Array.from({ length: 6 }).map((_, i) => ({
    id: `note-${i}`,
    moduleNumber: i + 1,
    title: `Module ${i + 1} Notes`,
    subject: subject,
    year: year
  }));

  const questionPapers = [
    { id: 'qp-1', title: 'MID-SEM', type: 'mid-sem', subject, year },
    { id: 'qp-2', title: 'END-SEM', type: 'end-sem', subject, year }
  ];

  const youtubeLinks = Array.from({ length: 4 }).map((_, i) => ({
    id: `yt-${i}`,
    title: `Module ${i + 1} Video Tutorial`,
    moduleNumber: i + 1,
    url: `https://www.youtube.com/link${i + 1}`,
    subject,
    year
  }));

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
          {moduleNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white text-black p-4 rounded-lg flex justify-between items-center hover:shadow-lg transition-shadow"
            >
              <span className="text-lg">Module - {note.moduleNumber}</span>
              <button 
                onClick={() => toggleFavorite('notes', note)} 
                className="text-2xl text-yellow-500 hover:scale-110 transition-transform"
              >
                {isItemFavorited('notes', note.id) ? "★" : "☆"}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "qp" && (
        <div className="grid grid-cols-1 px-40 sm:grid-cols-2 gap-4 py-2">
          {questionPapers.map((paper) => (
            <div 
              key={paper.id}
              className="relative bg-white text-black p-4 rounded-lg hover:shadow-lg transition-all group"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{paper.title}</span>
                <button
                  onClick={() => toggleFavorite('questionPapers', paper)}
                  className="text-2xl text-yellow-500 hover:scale-110 transition-transform"
                >
                  {isItemFavorited('questionPapers', paper.id) ? "★" : "☆"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "yt" && (
        <div className="space-y-4">
          {youtubeLinks.map((link) => (
            <div 
              key={link.id}
              className="bg-white text-black p-4 rounded-lg flex justify-between items-center hover:shadow-lg transition-shadow"
            >
              <div className="flex-1">
                <span className="font-semibold">Module {link.moduleNumber} - </span>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Watch Video
                </a>
              </div>
              <button
                onClick={() => toggleFavorite('youtubeLinks', link)}
                className="text-2xl text-yellow-500 hover:scale-110 transition-transform"
              >
                {isItemFavorited('youtubeLinks', link.id) ? "★" : "☆"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
