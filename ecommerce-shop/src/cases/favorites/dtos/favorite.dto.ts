export interface FavoriteDTO {

  id: string;

  userId: string;

  productId: string;

  createdAt: string;
}

export interface CreateFavoriteDTO {
  userId: string;
  productId: string;
}