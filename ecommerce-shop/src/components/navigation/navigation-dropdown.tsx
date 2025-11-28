import { Link } from 'react-router-dom';
import { ChevronDown, AlertCircle, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import type { NavigationDropdownProps } from './types/dropdown-types';

export function NavigationDropdown({
  trigger,
  items,
  isLoading = false,
  error,
  onRetry,
  emptyMessage = 'Nenhum item disponível',
  className = '',
}: NavigationDropdownProps) {
  const renderContent = () => {

    if (isLoading) {
      return (
        <div className="p-2 space-y-1">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-3">{error}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Tentar novamente
            </Button>
          )}
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <div className="p-4 text-center text-sm text-gray-500">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="p-1">
        {items.map((item) => (
          <DropdownMenuItem key={item.id} asChild className="cursor-pointer">
            <Link
              to={item.href}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-rose-50 hover:text-rose-600 transition-colors rounded-md ${
                item.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-9 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors ${className}`}
        >
          {trigger}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56 bg-white border border-gray-200 shadow-lg"
      >
        {renderContent()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}