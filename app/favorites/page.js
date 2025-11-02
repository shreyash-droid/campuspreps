"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import Link from 'next/link';
import { HeartIcon, BookOpenIcon, DocumentTextIcon, LinkIcon } from '@heroicons/react/24/solid';

export default function FavoritesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { favorites, loading: favoritesLoading, refreshFavorites } = useFavorites();
  const [groupedFavorites, setGroupedFavorites] = useState({
    notes: [],
    pyq: [],
    links: []
  });

  useEffect(() => {
    if (isAuthenticated) {
      refreshFavorites();
    }
  }, [isAuthenticated, refreshFavorites]);

  useEffect(() => {
    // Group favorites by type
    const grouped = favorites.reduce((acc, fav) => {
      if (!acc[fav.itemType]) {
        acc[fav.itemType] = [];
      }
      acc[fav.itemType].push(fav);
      return acc;
    }, { notes: [], pyq: [], links: [] });
    
    setGroupedFavorites(grouped);
  }, [favorites]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your favorites.
          </p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    );
  }

  const FavoriteSection = ({ title, items, type, icon: Icon, emptyMessage }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Icon className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
          {items.length}
        </span>
      </div>
      
      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={`${item.itemType}_${item.itemId}_${index}`}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center">
                <Icon className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-700">
                  {type.charAt(0).toUpperCase() + type.slice(1)} ID: {item.itemId}
                </span>
              </div>
              <HeartIcon className="w-5 h-5 text-red-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <HeartIcon className="w-8 h-8 text-red-500 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
          </div>
          <p className="text-gray-600">
            All your favorited notes, previous year questions, and links in one place
          </p>
        </div>

        {/* Loading State */}
        {favoritesLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your favorites...</p>
          </div>
        )}

        {/* Favorites Content */}
        {!favoritesLoading && (
          <>
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h3>
                <p className="text-gray-500 mb-6">
                  Start exploring and add your favorite notes, PYQs, and links!
                </p>
                <Link
                  href="/select-year"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Browse Content
                </Link>
              </div>
            ) : (
              <div className="grid gap-8">
                <FavoriteSection
                  title="Notes"
                  items={groupedFavorites.notes}
                  type="notes"
                  icon={BookOpenIcon}
                  emptyMessage="No favorite notes yet"
                />
                
                <FavoriteSection
                  title="Previous Year Questions"
                  items={groupedFavorites.pyq}
                  type="pyq"
                  icon={DocumentTextIcon}
                  emptyMessage="No favorite PYQs yet"
                />
                
                <FavoriteSection
                  title="Links"
                  items={groupedFavorites.links}
                  type="links"
                  icon={LinkIcon}
                  emptyMessage="No favorite links yet"
                />
              </div>
            )}
          </>
        )}

        {/* Stats Summary */}
        {!favoritesLoading && favorites.length > 0 && (
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-800 mb-2">Quick Stats</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{groupedFavorites.notes.length}</div>
                <div className="text-sm text-blue-600">Notes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{groupedFavorites.pyq.length}</div>
                <div className="text-sm text-blue-600">PYQs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{groupedFavorites.links.length}</div>
                <div className="text-sm text-blue-600">Links</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}