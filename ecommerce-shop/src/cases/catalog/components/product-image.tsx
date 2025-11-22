import { Package } from 'lucide-react';

export function ProductImage() {
  return (
    <div className="w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center">
      <Package className="h-16 w-16 text-gray-400" />
    </div>
  );
}
