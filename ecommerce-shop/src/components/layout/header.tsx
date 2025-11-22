import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartIconBadge } from '../../cases/cart/components/cart-icon-badge';
import { CartDrawer } from '../../cases/cart/components/cart-drawer';
import { SearchBar } from '../../cases/catalog/components/search-bar';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="border-b bg-white sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <Link to="/" className="text-2xl font-bold hover:text-gray-700 whitespace-nowrap">
              E-commerce Shop
            </Link>
            {onSearchChange && (
              <div className="flex-1 max-w-2xl">
                <SearchBar 
                  value={searchQuery || ''} 
                  onChange={onSearchChange}
                />
              </div>
            )}
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir carrinho"
            >
              <CartIconBadge />
            </button>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-3">
              <Link to="/" className="text-xl font-bold hover:text-gray-700">
                E-commerce
              </Link>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsCartOpen(true)}
                aria-label="Abrir carrinho"
              >
                <CartIconBadge />
              </button>
            </div>
            {onSearchChange && (
              <SearchBar 
                value={searchQuery || ''} 
                onChange={onSearchChange}
              />
            )}
          </div>
        </div>
      </header>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
