/**
 * Represents a single favorite item
 */
export interface FavoriteDTO {
  /** Unique identifier for the favorite item */
  id: string;
  /** Customer/User ID who favorited the product */
  userId: string;
  /** ID of the favorited product */
  productId: string;
  /** Timestamp when the favorite was created */
  createdAt: string;
}

/**
 * Type for creating a new favorite (without auto-generated fields)
 */
export interface CreateFavoriteDTO {
  userId: string;
  productId: string;
}