"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthRedirect } from '../hooks/useAuth';
import { getSubjectData } from '../data/subjectData';
import Navbar from '../components/navbar';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('notes');
  const [favorites, setFavorites] = useState({
    notes: [],
    questionPapers: [],
    youtubeLinks: []
  });
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    avatar: '/profile.svg'
  });

  useAuthRedirect();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserInfo({
        name: user.name,
        email: user.email,
        avatar: user.avatar || '/profile.svg'
      });
    }

    // Fetch favorites from localStorage or API
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Function to get Drive URL for a favorited item
  const getDriveUrl = (item, type) => {
    if (type === 'youtubeLinks' && item.url) {
      return item.url;
    }

    // For notes and question papers, get from subject data
    if (item.year && item.subject) {
      const subjectInfo = getSubjectData(parseInt(item.year), item.subject);
      
      if (type === 'notes' && subjectInfo?.modules) {
        const module = subjectInfo.modules.find(m => m.id === item.id);
        return module?.driveUrl;
      }
      
      if (type === 'questionPapers' && subjectInfo?.questionPapers) {
        const paper = subjectInfo.questionPapers.find(p => p.id === item.id);
        return paper?.driveUrl;
      }
    }

    return item.driveUrl || null;
  };

  const TabContent = () => {
    switch (activeTab) {
      case 'notes':
        return (
          <div className="grid grid-cols-1 gap-4">
            {favorites.notes.map((note, index) => {
              const driveUrl = getDriveUrl(note, 'notes');
              return (
                <div 
                  key={index} 
                  className={`bg-white rounded-lg p-4 text-black transition-shadow ${
                    driveUrl ? 'cursor-pointer hover:shadow-lg' : ''
                  }`}
                  onClick={() => {
                    if (driveUrl) {
                      window.open(driveUrl, '_blank');
                    }
                  }}
                >
                  <h3 className="text-lg font-semibold">Module - {note.moduleNumber}</h3>
                  <p className="text-gray-600">{note.title}</p>
                  {note.subject && note.year && (
                    <p className="text-sm text-gray-500 mt-1">
                      {note.subject} - Year {note.year}
                    </p>
                  )}
                  {driveUrl ? (
                    <p className="text-sm text-green-600 mt-2">Click to open notes</p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2">Notes not available</p>
                  )}
                </div>
              );
            })}
            {favorites.notes.length === 0 && (
              <div className="text-center text-gray-500">No favorite notes yet</div>
            )}
          </div>
        );
      case 'questionPapers':
        return (
          <div className="grid grid-cols-1 gap-4">
            {favorites.questionPapers.map((paper, index) => {
              const driveUrl = getDriveUrl(paper, 'questionPapers');
              return (
                <div 
                  key={index} 
                  className={`bg-white rounded-lg p-4 text-black transition-shadow ${
                    driveUrl ? 'cursor-pointer hover:shadow-lg' : ''
                  }`}
                  onClick={() => {
                    if (driveUrl) {
                      window.open(driveUrl, '_blank');
                    }
                  }}
                >
                  <h3 className="text-lg font-semibold">{paper.title}</h3>
                  <p className="text-gray-600">{paper.type}</p>
                  {paper.subject && paper.year && (
                    <p className="text-sm text-gray-500 mt-1">
                      {paper.subject} - Year {paper.year}
                    </p>
                  )}
                  {driveUrl ? (
                    <p className="text-sm text-green-600 mt-2">Click to open paper</p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2">Paper not available</p>
                  )}
                </div>
              );
            })}
            {favorites.questionPapers.length === 0 && (
              <div className="text-center text-gray-500">No favorite question papers yet</div>
            )}
          </div>
        );
      case 'youtubeLinks':
        return (
          <div className="grid grid-cols-1 gap-4">
            {favorites.youtubeLinks.map((link, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg p-4 text-black cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => window.open(link.url, '_blank')}
              >
                <h3 className="text-lg font-semibold">{link.title}</h3>
                {link.subject && link.year && (
                  <p className="text-sm text-gray-500 mt-1">
                    {link.subject} - Year {link.year}
                  </p>
                )}
                <p className="text-sm text-blue-600 mt-2">Click to watch video</p>
              </div>
            ))}
            {favorites.youtubeLinks.length === 0 && (
              <div className="text-center text-gray-500">No favorite videos yet</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white p-8">
        {/* Breadcrumb */}
        <div className="text-sm mb-8">
          <Link href="/" className="hover:text-blue-400">Home</Link>
          <span className="mx-2">›</span>
          <span>Profile</span>
        </div>

        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-12">
          <div className="w-24 h-24 rounded-full bg-white overflow-hidden">
            <Image
              src={userInfo.avatar}
              alt="Profile"
              width={96}
              height={96}
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{userInfo.name}</h1>
            <p className="text-gray-400">{userInfo.email}</p>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">Favourites</h2>
          
          {/* Tabs - Same style as SubjectTabs */}
          <div className="flex w-full rounded-full overflow-hidden border border-white mb-6">
            {[
              { key: 'notes', label: 'Module-wise Notes' },
              { key: 'questionPapers', label: 'Question Papers' },
              { key: 'youtubeLinks', label: 'Youtube Links' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-4 py-2 font-semibold transition ${
                  activeTab === tab.key ? "bg-white text-black" : "bg-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            <TabContent />
          </div>
        </div>
      </div>
    </>
  );
}