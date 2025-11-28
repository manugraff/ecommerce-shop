import { Tag, Home } from 'lucide-react';
import { NavigationDropdown } from '../../../components/navigation/navigation-dropdown';
import { useCategories } from '../hooks/use-categories';
import type { DropdownItem } from '../../../components/navigation/types/dropdown-types';

export function CategoryDropdown() {
  const { data: categories, isLoading, error, refetch } = useCategories();

  const dropdownItems: DropdownItem[] = [

    {
      id: 'all',
      label: 'Todas as Categorias',
      href: '/',
      icon: <Home className="h-4 w-4" />,
    },

    ...(categories || []).map((category) => ({
      id: category.id,
      label: category.name,
      href: `/category/${category.id}`,
      icon: <Tag className="h-4 w-4" />,
    })),
  ];

  const handleRetry = () => {
    refetch();
  };

  return (
    <NavigationDropdown
      trigger={
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          <span className="hidden sm:inline">Categorias</span>
        </div>
      }
      items={dropdownItems}
      isLoading={isLoading}
      error={error?.message}
      onRetry={handleRetry}
      emptyMessage="Nenhuma categoria disponível"
      className="mr-2"
    />
  );
}