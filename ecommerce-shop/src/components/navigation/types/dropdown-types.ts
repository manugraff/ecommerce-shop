import type { ReactNode } from 'react';

export interface NavigationDropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

export interface DropdownItem {
  id: string;
  label: string;
  href: string;
  badge?: string | number;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface DropdownState {
  isOpen: boolean;
  selectedItem?: string;
}