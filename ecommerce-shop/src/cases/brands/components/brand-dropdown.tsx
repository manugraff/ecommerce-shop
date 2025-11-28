import { Star } from 'lucide-react';
import { NavigationDropdown } from '../../../components/navigation/navigation-dropdown';
import { useBrands } from '../hooks/use-brands';
import type { DropdownItem } from '../../../components/navigation/types/dropdown-types';

export function BrandDropdown() {
  const { data: brands, isLoading, error, refetch } = useBrands();

  const dropdownItems: DropdownItem[] = (brands || [])
    .filter(brand => brand.isActive !== false)
    .map((brand) => ({
      id: brand.id,
      label: brand.name,
      href: `/brand/${brand.id}`,
      badge: brand.productCount ? `${brand.productCount}` : undefined,
      icon: <Star className="h-4 w-4" />,
    }));

  const handleRetry = () => {
    refetch();
  };

  return (
    <NavigationDropdown
      trigger={
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          <span className="hidden sm:inline">Marcas</span>
        </div>
      }
      items={dropdownItems}
      isLoading={isLoading}
      error={error?.message}
      onRetry={handleRetry}
      emptyMessage="Nenhuma marca disponível"
      className="mr-2"
    />
  );
}