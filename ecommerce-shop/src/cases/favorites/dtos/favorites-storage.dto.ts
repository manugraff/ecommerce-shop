import type { FavoriteDTO } from './favorite.dto';

export interface FavoritesStorageDTO {

  favorites: FavoriteDTO[];

  lastUpdated: string;

  version: number;
}

export const FAVORITES_STORAGE_VERSION = 1;

export const DEFAULT_FAVORITES_STORAGE: FavoritesStorageDTO = {
  favorites: [],
  lastUpdated: new Date().toISOString(),
  version: FAVORITES_STORAGE_VERSION,
};