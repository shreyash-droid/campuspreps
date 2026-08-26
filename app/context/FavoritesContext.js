"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext(null);

const EMPTY = { notes: [], questionPapers: [], youtubeLinks: [] };
const STORAGE_KEY = "favorites";

/**
 * Single source of truth for favorites across the whole app.
 * Backed by localStorage so it works for every visitor and syncs across tabs.
 * Shape: { notes: [...items], questionPapers: [...items], youtubeLinks: [...items] }
 */
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites({ ...EMPTY, ...JSON.parse(stored) });
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  // Persist on every change (after hydration so we don't clobber stored data).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore quota / private mode */
    }
  }, [favorites, hydrated]);

  // Keep other tabs in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setFavorites({ ...EMPTY, ...JSON.parse(e.newValue) });
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleFavorite = useCallback((type, item) => {
    setFavorites((prev) => {
      const arr = prev[type] || [];
      const exists = arr.some((f) => f.id === item.id);
      return {
        ...prev,
        [type]: exists ? arr.filter((f) => f.id !== item.id) : [...arr, item],
      };
    });
  }, []);

  const isFavorited = useCallback(
    (type, id) => (favorites[type] || []).some((f) => f.id === id),
    [favorites]
  );

  const totalCount =
    (favorites.notes?.length || 0) +
    (favorites.questionPapers?.length || 0) +
    (favorites.youtubeLinks?.length || 0);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorited, totalCount, hydrated }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
