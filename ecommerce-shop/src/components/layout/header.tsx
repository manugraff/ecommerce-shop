import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { CartDrawer } from '../../cases/cart/components/cart-drawer';
import { useCart } from '../../cases/cart/contexts/cart-context';
import { useFavorites } from '../../contexts/favorites-context';
import { Badge } from '../ui/badge';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { cart } = useCart();
  const { favoritesCount } = useFavorites();

  const cartItemCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <>
      <header className="h-16 border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 h-full">
          {}
          <Link to="/" className="font-bold text-2xl text-rose-600 hover:text-rose-700 transition-colors">
            Glow Up
          </Link>

          {}
          {onSearchChange && (
            <div className="hidden md:flex flex-1 justify-center px-8">
              <div className="max-w-lg w-full">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {}
          <div className="flex items-center gap-4">
            {}
            {user && (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 rounded-full hover:bg-rose-50 transition-colors relative"
                  aria-label="Menu do usuário"
                >
                  <User className="h-5 w-5 text-rose-600" />
                </button>

                {}
                {isUserMenuOpen && (
                  <>
                    {}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-1">
                        <Link
                          to="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 transition-colors"
                        >
                          <ShoppingBag className="h-4 w-4 text-rose-600" />
                          Meus Pedidos
                        </Link>
                        <Link
                          to="/favorites"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 transition-colors"
                        >
                          <Heart className="h-4 w-4 text-rose-600" />
                          Meus Favoritos
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 text-rose-600" />
                          Sair
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {}
            <Link to="/favorites" className="p-2 rounded-full hover:bg-rose-50 transition-colors relative">
              <Heart className="h-5 w-5 text-rose-600" />
              {favoritesCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-rose-600 text-white p-0 min-w-5">
                  {favoritesCount}
                </Badge>
              )}
            </Link>

            {}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full hover:bg-rose-50 transition-colors relative"
            >
              <ShoppingBag className="h-5 w-5 text-rose-600" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-rose-600 text-white p-0 min-w-5">
                  {cartItemCount}
                </Badge>
              )}
            </button>

            {}
            {!user && (
              <Link
                to="/login"
                className="text-rose-600 hover:text-rose-700 font-medium transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}