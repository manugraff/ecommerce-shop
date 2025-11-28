import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { ProductDTO } from '../../catalog/dtos/product.dto';
import type { CartStateDTO } from '../dtos/cart-state.dto';
import type { CartItemDTO } from '../dtos/cart-item.dto';
import { useCartStorage } from '../hooks/use-cart-storage';
import { useToast } from '../../../contexts/toast-context';

interface CartContextValue {
  cart: CartStateDTO;
  addToCart: (product: ProductDTO, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { cart, updateCart } = useCartStorage();
  const { success, info } = useToast();

  const addToCart = (product: ProductDTO, quantity: number = 1) => {
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.id === product.id
    );

    let newItems: CartItemDTO[];

    if (existingItemIndex >= 0) {

      newItems = [...cart.items];
      const newQuantity = newItems[existingItemIndex].quantity + quantity;
      newItems[existingItemIndex] = {
        product,
        quantity: newQuantity,
        lineTotal: product.price * newQuantity,
      };
      success(`${product.name} atualizado no carrinho!`);
    } else {

      newItems = [
        ...cart.items,
        {
          product,
          quantity,
          lineTotal: product.price * quantity,
        },
      ];
      success(`${product.name} adicionado ao carrinho!`);
    }

    updateCart(newItems);
  };

  const removeFromCart = (productId: string) => {
    const item = cart.items.find((item) => item.product.id === productId);
    const newItems = cart.items.filter((item) => item.product.id !== productId);
    updateCart(newItems);
    if (item) {
      info(`${item.product.name} removido do carrinho`);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newItems = cart.items.map((item) =>
      item.product.id === productId
        ? {
            ...item,
            quantity,
            lineTotal: item.product.price * quantity,
          }
        : item
    );

    updateCart(newItems);
  };

  const clearCart = () => {
    updateCart([]);
    info('Carrinho limpo');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}