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
      <h3 className="font-semibold text-lg mb-4">Categorias</h3>
      <Link
        to="/"
        className={`block px-3 py-2 rounded-md transition-colors ${
          isAllActive
            ? 'bg-blue-100 text-blue-700 font-medium'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        Todas
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className={`block px-3 py-2 rounded-md transition-colors ${
            isActive(category.id)
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
