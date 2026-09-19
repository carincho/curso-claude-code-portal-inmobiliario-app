"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  addFavorite as addFavoriteRequest,
  fetchFavorites,
  removeFavorite as removeFavoriteRequest,
} from "@/lib/favorites-client";

type FavoritesContextValue = {
  favoriteIds: Set<string>;
  isLoading: boolean;
  toggleFavorite: (propertyId: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const EMPTY_FAVORITE_IDS: Set<string> = new Set();

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, apiUrl } = useAuth();
  const [loadedFavoriteIds, setLoadedFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const favoriteIds = user ? loadedFavoriteIds : EMPTY_FAVORITE_IDS;
  const isLoading = user ? isLoadingFavorites : false;

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    fetchFavorites(apiUrl)
      .then((properties) => {
        if (!cancelled) {
          setLoadedFavoriteIds(new Set(properties.map((property) => property.id)));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingFavorites(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, apiUrl]);

  const toggleFavorite = useCallback(
    async (propertyId: string) => {
      const wasFavorite = favoriteIds.has(propertyId);

      setLoadedFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorite) {
          next.delete(propertyId);
        } else {
          next.add(propertyId);
        }
        return next;
      });

      try {
        if (wasFavorite) {
          await removeFavoriteRequest(apiUrl, propertyId);
        } else {
          await addFavoriteRequest(apiUrl, propertyId);
        }
      } catch {
        setLoadedFavoriteIds((prev) => {
          const next = new Set(prev);
          if (wasFavorite) {
            next.add(propertyId);
          } else {
            next.delete(propertyId);
          }
          return next;
        });
      }
    },
    [favoriteIds, apiUrl],
  );

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isLoading, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  }

  return context;
}
