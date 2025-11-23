import { Package } from 'lucide-react';

export function ProductImage() {
  return (
    <div className="w-full aspect-square bg-linear-to-br from-rose-50 to-pink-50 rounded-t-lg flex items-center justify-center overflow-hidden">
      <Package className="h-16 w-16 text-rose-300" />
    </div>
  );
}
