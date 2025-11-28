import { Tag, Home } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { SidebarDropdown } from '../../../components/navigation/sidebar-dropdown';
import { useCategories } from '../hooks/use-categories';
import type { SidebarDropdownItem } from '../../../components/navigation/types/sidebar-types';

export function SidebarCategoryMenu() {
  const { data: categories, isLoading, error, refetch } = useCategories();
  const location = useLocation();

  const items: SidebarDropdownItem[] = [

    {
      id: 'all',
      label: 'Todas as Categorias',
      href: '/',
      icon: <Home className="h-4 w-4" />,
      isActive: location.pathname === '/',
    },

    ...(categories || []).map((category) => ({
      id: category.id,
      label: category.name,
      href: `/category/${category.id}`,
      icon: <Tag className="h-4 w-4" />,
      isActive: location.pathname === `/category/${category.id}`,
    })),
  ];

  const handleRetry = () => {
    refetch();
  };

  return (
    <SidebarDropdown
      title="Categorias"
      icon={<Tag className="h-5 w-5" />}
      items={items}
      isLoading={isLoading}
      error={error?.message}
      onRetry={handleRetry}
      defaultExpanded={false}
      emptyMessage="Nenhuma categoria disponível"
    />
  );
}