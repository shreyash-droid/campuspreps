"use client";

import { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoriteButton({ 
  itemId, 
  itemType, // 'note', 'pyq', 'link'
  onLoginRequired,
  className = "",
  size = "w-6 h-6"
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isFavorited, addToFavorites, removeFromFavorites } = useFavorites();
  
  const favorited = isFavorited(itemId, itemType);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated
    if (!isAuthenticated) {
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }

    setIsLoading(true);
    
    try {
      let success;
      if (favorited) {
        success = await removeFromFavorites(itemId, itemType);
      } else {
        success = await addToFavorites(itemId, itemType);
      }
      
      if (!success) {
        // Handle error - could show a toast notification
        console.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavoriteClick}
      disabled={isLoading}
      className={`
        p-2 rounded-full transition-all duration-200 
        ${isAuthenticated 
          ? 'hover:bg-red-50 hover:scale-110' 
          : 'hover:bg-gray-100'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={
        !isAuthenticated 
          ? "Login to add to favorites" 
          : favorited 
            ? "Remove from favorites" 
            : "Add to favorites"
      }
    >
      {isLoading ? (
        <div className={`${size} border-2 border-red-500 border-t-transparent rounded-full animate-spin`} />
      ) : (
        <>
          {favorited ? (
            <HeartIconSolid className={`${size} text-red-500`} />
          ) : (
            <HeartIcon className={`${size} ${isAuthenticated ? 'text-gray-400 hover:text-red-500' : 'text-gray-300'}`} />
          )}
        </>
      )}
    </button>
  );
}