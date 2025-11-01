"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext({
  favorites: [],
  loading: false,
  isFavorited: () => false,
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  refreshFavorites: () => {},
});

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Fetch user favorites when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFavorites(data.favorites);
        }
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFavorited = (itemId, itemType) => {
    return favorites.some(fav => 
      fav.itemId === itemId && fav.itemType === itemType
    );
  };

  const addToFavorites = async (itemId, itemType) => {
    if (!isAuthenticated) return false;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'add',
          itemId,
          itemType
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFavorites(prev => [...prev, { itemId, itemType }]);
          return true;
        }
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
    return false;
  };

  const removeFromFavorites = async (itemId, itemType) => {
    if (!isAuthenticated) return false;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'remove',
          itemId,
          itemType
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFavorites(prev => 
            prev.filter(fav => 
              !(fav.itemId === itemId && fav.itemType === itemType)
            )
          );
          return true;
        }
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
    return false;
  };

  const value = {
    favorites,
    loading,
    isFavorited,
    addToFavorites,
    removeFromFavorites,
    refreshFavorites: fetchFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};