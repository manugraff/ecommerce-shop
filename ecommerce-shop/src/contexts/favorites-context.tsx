import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from './auth-context';
import { favoritesService } from '../cases/favorites/services';
import type { FavoriteDTO } from '../cases/favorites/dtos';

interface FavoritesContextValue {
  /** Array of current user's favorite items */
  favorites: FavoriteDTO[];
  /** Loading state for favorites operations */
  loading: boolean;
  /** Check if a product is favorited */
  isFavorite: (productId: string) => boolean;
  /** Toggle favorite status of a product */
  toggleFavorite: (productId: string) => void;
  /** Add a product to favorites */
  addFavorite: (productId: string) => void;
  /** Remove a product from favorites */
  removeFavorite: (productId: string) => void;
  /** Get total number of favorites */
  favoritesCount: number;
  /** Clear all favorites */
  clearFavorites: () => void;
  /** Refresh favorites from localStorage */
  refreshFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { customerData } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteDTO[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Load favorites from localStorage
   */
  const loadFavorites = useCallback(() => {
    if (!customerData?.id) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      const userFavorites = favoritesService.getFavorites(String(customerData.id));
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [customerData?.id]);

  /**
   * Load favorites when user changes or component mounts
   */
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  /**
   * Check if a product is favorited
   */
  const isFavorite = useCallback((productId: string): boolean => {
    if (!customerData?.id) return false;
    return favorites.some(fav => fav.productId === productId);
  }, [favorites, customerData?.id]);

  /**
   * Add a product to favorites
   */
  const addFavorite = useCallback((productId: string) => {
    if (!customerData?.id) {
      console.warn('Cannot add favorite: User not authenticated');
      return;
    }

    try {
      const newFavorite = favoritesService.addFavorite(String(customerData.id), productId);
      setFavorites(prev => [...prev, newFavorite]);
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }, [customerData?.id]);

  /**
   * Remove a product from favorites
   */
  const removeFavorite = useCallback((productId: string) => {
    if (!customerData?.id) {
      console.warn('Cannot remove favorite: User not authenticated');
      return;
    }

    try {
      const success = favoritesService.removeFavorite(String(customerData.id), productId);
      if (success) {
        setFavorites(prev => prev.filter(fav => fav.productId !== productId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }, [customerData?.id]);

  /**
   * Toggle favorite status
   */
  const toggleFavorite = useCallback((productId: string) => {
    if (!customerData?.id) {
      console.warn('Cannot toggle favorite: User not authenticated');
      return;
    }

    try {
      const result = favoritesService.toggleFavorite(String(customerData.id), productId);
      
      if (result.isFavorite && result.favorite) {
        setFavorites(prev => [...prev, result.favorite!]);
      } else {
        setFavorites(prev => prev.filter(fav => fav.productId !== productId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [customerData?.id]);

  /**
   * Clear all favorites
   */
  const clearFavorites = useCallback(() => {
    if (!customerData?.id) return;

    try {
      favoritesService.clearFavorites(String(customerData.id));
      setFavorites([]);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  }, [customerData?.id]);

  /**
   * Refresh favorites from localStorage
   */
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

/**
 * Hook to use favorites context
 */
export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }

  return context;
}