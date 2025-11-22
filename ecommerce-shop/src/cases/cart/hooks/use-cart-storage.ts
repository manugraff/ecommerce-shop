import { useState, useEffect } from 'react';
import type { CartItemDTO } from '../dtos/cart-item.dto';
import type { CartStateDTO } from '../dtos/cart-state.dto';
import { CartStorageService } from '../services/cart-storage.service';

export function useCartStorage() {
  const [cart, setCart] = useState<CartStateDTO>(() => CartStorageService.load());

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    CartStorageService.save(cart.items);
  }, [cart]);

  const updateCart = (items: CartItemDTO[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    setCart({
      items,
      subtotal,
      itemCount,
    });
  };

  return { cart, updateCart };
}
