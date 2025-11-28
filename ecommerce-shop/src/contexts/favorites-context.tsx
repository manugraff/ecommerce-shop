import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from './auth-context';
import { favoritesService } from '../cases/favorites/services';
import type { FavoriteDTO } from '../cases/favorites/dtos';

interface FavoritesContextValue {

  favorites: FavoriteDTO[];

  loading: boolean;

  isFavorite: (productId: string) => boolean;

  toggleFavorite: (productId: string) => void;

  addFavorite: (productId: string) => void;

  removeFavorite: (productId: string) => void;

  favoritesCount: number;

  clearFavorites: () => void;

  refreshFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(() => {
    if (!user?.id) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      const userFavorites = favoritesService.getFavorites(user.id);
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const isFavorite = useCallback((productId: string): boolean => {
    if (!user?.id) return false;
    return favorites.some(fav => fav.productId === productId);
  }, [favorites, user?.id]);

  const addFavorite = useCallback((productId: string) => {
    if (!user?.id) {
      console.warn('Cannot add favorite: User not authenticated');
      return;
    }

    try {
      const newFavorite = favoritesService.addFavorite(user.id, productId);
      setFavorites(prev => [...prev, newFavorite]);
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }, [user?.id]);

  const removeFavorite = useCallback((productId: string) => {
    if (!user?.id) {
      console.warn('Cannot remove favorite: User not authenticated');
      return;
    }

    try {
      const success = favoritesService.removeFavorite(user.id, productId);
      if (success) {
        setFavorites(prev => prev.filter(fav => fav.productId !== productId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }, [user?.id]);

  const toggleFavorite = useCallback((productId: string) => {
    if (!user?.id) {
      console.warn('Cannot toggle favorite: User not authenticated');
      return;
    }

    try {
      const result = favoritesService.toggleFavorite(user.id, productId);

      if (result.isFavorite && result.favorite) {
        setFavorites(prev => [...prev, result.favorite!]);
      } else {
        setFavorites(prev => prev.filter(fav => fav.productId !== productId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [user?.id]);

  const clearFavorites = useCallback(() => {
    if (!user?.id) return;

    try {
      favoritesService.clearFavorites(user.id);
      setFavorites([]);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  }, [user?.id]);

  const refreshFavorites = useCallback(() => {
    loadFavorites();
  }, [loadFavorites]);

  const value: FavoritesContextValue = {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    favoritesCount: favorites.length,
    clearFavorites,
    refreshFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }

  return context;
}