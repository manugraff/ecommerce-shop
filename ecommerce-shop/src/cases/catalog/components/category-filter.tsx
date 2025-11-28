import { Link, useLocation } from 'react-router-dom';
import { useCategories } from '../hooks/use-categories';

export function CategoryFilter() {
  const { data: categories, isLoading } = useCategories();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  const isActive = (categoryId: string) => {
    return location.pathname === `/category/${categoryId}`;
  };

  const isAllActive = location.pathname === '/';

  return (
    <div className="space-y-2">
      <h3 className="font-bold text-lg mb-4 bg-linear-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
        <span>🏷️</span> Categorias
      </h3>
      <Link
        to="/"
        className={`block px-4 py-2.5 rounded-lg transition-all duration-200 ${
          isAllActive
            ? 'bg-linear-to-r from-rose-500 to-pink-600 text-white font-medium shadow-md'
            : 'hover:bg-rose-50 text-gray-700 hover:text-rose-600'
        }`}
      >
        ✨ Todas
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className={`block px-4 py-2.5 rounded-lg transition-all duration-200 ${
            isActive(category.id)
              ? 'bg-linear-to-r from-rose-500 to-pink-600 text-white font-medium shadow-md'
              : 'hover:bg-rose-50 text-gray-700 hover:text-rose-600'
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}