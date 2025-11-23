import type { FavoriteDTO } from './favorite.dto';

/**
 * Schema for storing favorites in localStorage
 * Supports versioning for future migrations
 */
export interface FavoritesStorageDTO {
  /** Array of favorite items for the user */
  favorites: FavoriteDTO[];
  /** Timestamp of last update for sync purposes */
  lastUpdated: string;
  /** Schema version for migration compatibility */
  version: number;
}

/**
 * Current storage schema version
 */
export const FAVORITES_STORAGE_VERSION = 1;

/**
 * Default empty storage structure
 */
export const DEFAULT_FAVORITES_STORAGE: FavoritesStorageDTO = {
  favorites: [],
  lastUpdated: new Date().toISOString(),
  version: FAVORITES_STORAGE_VERSION,
};