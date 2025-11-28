import { Star } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { SidebarDropdown } from '../../../components/navigation/sidebar-dropdown';
import { useBrands } from '../hooks/use-brands';
import type { SidebarDropdownItem } from '../../../components/navigation/types/sidebar-types';

export function SidebarBrandMenu() {
  const { data: brands, isLoading, error, refetch } = useBrands();
  const location = useLocation();

  const items: SidebarDropdownItem[] = (brands || [])
    .filter(brand => brand.isActive !== false)
    .map((brand) => ({
      id: brand.id,
      label: brand.name,
      href: `/brand/${brand.id}`,
      icon: <Star className="h-4 w-4" />,
      badge: brand.productCount ? `${brand.productCount}` : undefined,
      isActive: location.pathname === `/brand/${brand.id}`,
    }));

  const handleRetry = () => {
    refetch();
  };

  return (
    <SidebarDropdown
      title="Marcas"
      icon={<Star className="h-5 w-5" />}
      items={items}
      isLoading={isLoading}
      error={error?.message}
      onRetry={handleRetry}
      defaultExpanded={false}
      emptyMessage="Nenhuma marca disponível"
    />
  );
}