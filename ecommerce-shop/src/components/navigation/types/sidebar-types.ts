export interface SidebarDropdownItem {
  id: string;
  label: string;
  href: string;
  badge?: string | number;
  icon?: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
}

export interface SidebarDropdownProps {
  title: string;
  icon: React.ReactNode;
  items: SidebarDropdownItem[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  defaultExpanded?: boolean;
  emptyMessage?: string;
  className?: string;
}