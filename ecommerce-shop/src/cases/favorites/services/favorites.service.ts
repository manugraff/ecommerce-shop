import type {
  FavoriteDTO,
  FavoritesStorageDTO
} from '../dtos';
import { DEFAULT_FAVORITES_STORAGE } from '../dtos';

class FavoritesService {

  private getStorageKey(userId: string): string {
    return `favs_${userId}`;
  }

  getFavorites(userId: string): FavoriteDTO[] {
    try {
      const key = this.getStorageKey(userId);
      const stored = localStorage.getItem(key);

      if (!stored) {
        return [];
      }

      const data: FavoritesStorageDTO = JSON.parse(stored);

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

  addFavorite(userId: string, productId: string): FavoriteDTO {
    const favorites = this.getFavorites(userId);

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

  removeFavorite(userId: string, productId: string): boolean {
    const favorites = this.getFavorites(userId);
    const updatedFavorites = favorites.filter(fav => fav.productId !== productId);

    if (updatedFavorites.length === favorites.length) {
      return false;
    }

    this.saveFavorites(userId, updatedFavorites);
    return true;
  }

  isFavorite(userId: string, productId: string): boolean {
    const favorites = this.getFavorites(userId);
    return favorites.some(fav => fav.productId === productId);
  }

  toggleFavorite(userId: string, productId: string): { favorite: FavoriteDTO | null; isFavorite: boolean } {
    if (this.isFavorite(userId, productId)) {
      this.removeFavorite(userId, productId);
      return { favorite: null, isFavorite: false };
    } else {
      const favorite = this.addFavorite(userId, productId);
      return { favorite, isFavorite: true };
    }
  }

  clearFavorites(userId: string): void {
    try {
      const key = this.getStorageKey(userId);
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing favorites from localStorage:', error);
    }
  }

  getFavoritesCount(userId: string): number {
    return this.getFavorites(userId).length;
  }
}

export const favoritesService = new FavoritesService();