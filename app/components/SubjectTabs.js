"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getSubjectData } from "../data/subjectData";

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

  // Get subject data from our configuration
  const subjectInfo = getSubjectData(parseInt(year), subject);

  // Fallback data if subject not found in configuration
  const fallbackData = {
    modules: Array.from({ length: 6 }).map((_, i) => ({
      id: `${subject}-${year}-${i}`,
      moduleNumber: i + 1,
      title: `Module ${i + 1} Notes`,
      driveUrl: null,
      subject: subject,
      year: year
    })),
    questionPapers: [
      { id: `${subject}-${year}-cats`, title: 'CATs', type: 'cats', driveUrl: null, subject, year },
      { id: `${subject}-${year}-fats`, title: 'FATs', type: 'fats', driveUrl: null, subject, year }
    ],
    youtubeLinks: []
  };

  const currentData = subjectInfo || fallbackData;

  return (
    <div className="text-white w-[90%] mx-auto mt-8">
      <Link
        href={`/subjects/${year}`}
        className="flex items-center text-white mb-4 hover:text-blue-400 transition"
      >
        <ArrowLeft className="w-8 h-8 mr-2" />
        <span>Back to Subjects</span>
      </Link>

      <h1 className="text-3xl font-bold capitalize py-2 mb-4">{subjectInfo?.name || subject}</h1>

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

      {/* Module Notes Tab */}
      {activeTab === "notes" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
          {currentData.modules.map((module) => (
            <div
              key={module.id}
              className="bg-white text-black p-4 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    if (module.driveUrl) {
                      window.open(module.driveUrl, '_blank');
                    }
                  }}
                >
                  <span className="text-lg font-semibold">Module - {module.moduleNumber}</span>
                  {module.driveUrl ? (
                    <p className="text-sm text-green-600 mt-1">Click to open notes</p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">Coming soon</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite('notes', module);
                  }}
                  className="text-2xl hover:scale-110 transition-transform ml-2"
                >
                  {isItemFavorited('notes', module.id) ? "★" : "☆"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Question Papers Tab */}
      {activeTab === "qp" && (
        <div className="grid grid-cols-1 px-40 sm:grid-cols-2 gap-4 py-2">
          {currentData.questionPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white text-black p-4 rounded-lg hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    if (paper.driveUrl) {
                      window.open(paper.driveUrl, '_blank');
                    }
                  }}
                >
                  <span className="font-semibold">{paper.title}</span>
                  {paper.driveUrl ? (
                    <p className="text-sm text-green-600 mt-1">Click to open</p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">Coming soon</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite('questionPapers', paper);
                  }}
                  className="text-2xl hover:scale-110 transition-transform ml-2"
                >
                  {isItemFavorited('questionPapers', paper.id) ? "★" : "☆"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* YouTube Links Tab */}
      {activeTab === "yt" && (
        <div className="space-y-4">
          {currentData.youtubeLinks.length > 0 ? (
            currentData.youtubeLinks.map((link) => (
              <div
                key={link.id}
                className="bg-white text-black p-4 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <span className="font-semibold">Module {link.moduleNumber} - </span>
                    <span className="text-blue-600 hover:underline">{link.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite('youtubeLinks', link);
                    }}
                    className="text-2xl hover:scale-110 transition-transform ml-2"
                  >
                    {isItemFavorited('youtubeLinks', link.id) ? "★" : "☆"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white text-black p-4 rounded-lg text-center">
              <span>No video tutorials available yet</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
