import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import type { SidebarDropdownProps } from './types/sidebar-types';

export function SidebarDropdown({
  title,
  icon,
  items,
  isLoading = false,
  error,
  onRetry,
  defaultExpanded = true,
  emptyMessage = 'Nenhum item disponível',
  className = '',
}: SidebarDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderContent = () => {
    if (!isExpanded) return null;

    if (isLoading) {
      return (
        <div className="mt-3 space-y-2 animate-pulse">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-8 w-full bg-rose-100" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="mt-3 p-3 text-center bg-red-50 rounded-lg border border-red-100">
          <AlertCircle className="h-5 w-5 text-red-500 mx-auto mb-2" />
          <p className="text-xs text-red-600 mb-2">{error}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="text-xs h-7 px-2"
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
        <div className="mt-3 p-3 text-center text-xs text-gray-500 bg-gray-50 rounded-lg">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="mt-3 space-y-1">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className={`
              block w-full flex items-center justify-between p-2 text-sm rounded-lg transition-colors
              ${item.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-rose-50 cursor-pointer'
              }
              ${item.isActive
                ? 'bg-rose-50 text-rose-600 font-medium'
                : 'text-gray-700 hover:text-rose-600'
              }
            `}
            onClick={(e) => item.disabled && e.preventDefault()}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {item.icon}
              <span className="truncate">{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full ml-2 shrink-0">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-rose-100 p-5 ${className}`}>
      {}
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 rounded-lg p-1 -m-1 transition-colors hover:bg-rose-50"
        aria-expanded={isExpanded}
        aria-controls={`sidebar-dropdown-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center gap-3">
          <div className="text-rose-600 shrink-0">
            {icon}
          </div>
          <h3 className="font-semibold text-lg text-gray-900 truncate">
            {title}
          </h3>
        </div>
        <div className="text-rose-600 shrink-0 ml-2">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </div>
      </button>

      {}
      <div
        id={`sidebar-dropdown-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
}