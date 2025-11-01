"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthRedirect } from '../hooks/useAuth';
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

  const TabContent = () => {
    switch (activeTab) {
      case 'notes':
        return (
          <div className="grid grid-cols-1 gap-4">
            {favorites.notes.map((note, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-black">
                <h3 className="text-lg font-semibold">Module - {note.moduleNumber}</h3>
                <p className="text-gray-600">{note.title}</p>
              </div>
            ))}
            {favorites.notes.length === 0 && (
              <div className="text-center text-gray-500">No favorite notes yet</div>
            )}
          </div>
        );
      case 'questionPapers':
        return (
          <div className="grid grid-cols-1 gap-4">
            {favorites.questionPapers.map((paper, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-black">
                <h3 className="text-lg font-semibold">{paper.title}</h3>
                <p className="text-gray-600">{paper.type}</p>
              </div>
            ))}
            {favorites.questionPapers.length === 0 && (
              <div className="text-center text-gray-500">No favorite question papers yet</div>
            )}
          </div>
        );
      case 'youtubeLinks':
        return (
          <div className="grid grid-cols-1 gap-4">
            {favorites.youtubeLinks.map((link, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-black">
                <h3 className="text-lg font-semibold">{link.title}</h3>
                <a href={link.url} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">
                  Watch Video
                </a>
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
          
          {/* Tabs */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setActiveTab('notes')}
              className={`p-4 text-center rounded-lg transition-colors ${
                activeTab === 'notes' 
                ? 'bg-white text-black' 
                : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              Module-wise Notes
            </button>
            <button
              onClick={() => setActiveTab('questionPapers')}
              className={`p-4 text-center rounded-lg transition-colors ${
                activeTab === 'questionPapers'
                ? 'bg-white text-black'
                : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              Question Papers
            </button>
            <button
              onClick={() => setActiveTab('youtubeLinks')}
              className={`p-4 text-center rounded-lg transition-colors ${
                activeTab === 'youtubeLinks'
                ? 'bg-white text-black'
                : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              Youtube Links
            </button>
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