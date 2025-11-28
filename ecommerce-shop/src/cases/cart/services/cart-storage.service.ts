import type { CartItemDTO } from '../dtos/cart-item.dto';
import type { CartStateDTO } from '../dtos/cart-state.dto';

const STORAGE_KEY = 'ecommerce-cart';
const STORAGE_VERSION = '1.0';

interface StoredCart {
  version: string;
  items: CartItemDTO[];
  timestamp: number;
}

export class CartStorageService {

  static load(): CartStateDTO {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return this.createEmptyCart();
      }

      const data: StoredCart = JSON.parse(stored);

      if (data.version !== STORAGE_VERSION || !Array.isArray(data.items)) {
        console.warn('Invalid cart data, resetting cart');
        return this.createEmptyCart();
      }

      return this.computeCartState(data.items);
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return this.createEmptyCart();
    }
  }

  static save(items: CartItemDTO[]): void {
    try {
      const data: StoredCart = {
        version: STORAGE_VERSION,
        items,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart storage:', error);
    }
  }

  private static computeCartState(items: CartItemDTO[]): CartStateDTO {
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      subtotal,
      itemCount,
    };
  }

  private static createEmptyCart(): CartStateDTO {
    return {
      items: [],
      subtotal: 0,
      itemCount: 0,
    };
  }
}