import type { 
  FavoriteDTO, 
  FavoritesStorageDTO 
} from '../dtos';
import { DEFAULT_FAVORITES_STORAGE } from '../dtos';

/**
 * Service for managing favorites in localStorage
 * Uses user-specific keys to isolate favorites per user
 */
class FavoritesService {
  /**
   * Get storage key for a specific user
   */
  private getStorageKey(userId: string): string {
    return `favs_${userId}`;
  }

  /**
   * Get user's favorites from localStorage
   */
  getFavorites(userId: string): FavoriteDTO[] {
    try {
      const key = this.getStorageKey(userId);
      const stored = localStorage.getItem(key);
      
      if (!stored) {
        return [];
      }

      const data: FavoritesStorageDTO = JSON.parse(stored);
      
      // Handle version compatibility (future migrations)
      if (data.version !== DEFAULT_FAVORITES_STORAGE.version) {
        console.warn('Favorites storage version mismatch, clearing data');
        this.clearFavorites(userId);
        return [];
      }

      return data.favorites || [];
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error);
      return [];
    }
  }

  /**
   * Save favorites to localStorage
   */
  private saveFavorites(userId: string, favorites: FavoriteDTO[]): void {
    try {
      const key = this.getStorageKey(userId);
      const data: FavoritesStorageDTO = {
        favorites,
        lastUpdated: new Date().toISOString(),
        version: DEFAULT_FAVORITES_STORAGE.version,
      };
      
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
      throw new Error('Failed to save favorites. Storage may be full.');
    }
  }

  /**
   * Add a product to favorites
   */
  addFavorite(userId: string, productId: string): FavoriteDTO {
    const favorites = this.getFavorites(userId);
    
    // Check if already favorited
    if (favorites.some(fav => fav.productId === productId)) {
      throw new Error('Product is already in favorites');
    }

    const newFavorite: FavoriteDTO = {
      id: `fav_${userId}_${productId}_${Date.now()}`,
      userId,
      productId,
      createdAt: new Date().toISOString(),
    };

    const updatedFavorites = [...favorites, newFavorite];
    this.saveFavorites(userId, updatedFavorites);
    
    return newFavorite;
  }

  /**
   * Remove a product from favorites
   */
  removeFavorite(userId: string, productId: string): boolean {
    const favorites = this.getFavorites(userId);
    const updatedFavorites = favorites.filter(fav => fav.productId !== productId);
    
    if (updatedFavorites.length === favorites.length) {
      return false; // Product was not in favorites
    }

    this.saveFavorites(userId, updatedFavorites);
    return true;
  }

  /**
   * Check if a product is favorited
   */
  isFavorite(userId: string, productId: string): boolean {
    const favorites = this.getFavorites(userId);
    return favorites.some(fav => fav.productId === productId);
  }

  /**
   * Toggle favorite status of a product
   */
  toggleFavorite(userId: string, productId: string): { favorite: FavoriteDTO | null; isFavorite: boolean } {
    if (this.isFavorite(userId, productId)) {
      this.removeFavorite(userId, productId);
      return { favorite: null, isFavorite: false };
    } else {
      const favorite = this.addFavorite(userId, productId);
      return { favorite, isFavorite: true };
    }
  }

  /**
   * Clear all favorites for a user
   */
  clearFavorites(userId: string): void {
    try {
      const key = this.getStorageKey(userId);
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing favorites from localStorage:', error);
    }
  }

  /**
   * Get favorites count for a user
   */
  getFavoritesCount(userId: string): number {
    return this.getFavorites(userId).length;
  }
}

// Export singleton instance
export const favoritesService = new FavoritesService();