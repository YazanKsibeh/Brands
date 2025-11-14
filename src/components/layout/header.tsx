"use client";

/**
 * Header Component for LocalStyle Dashboard
 * Provides breadcrumb navigation and user actions
 */

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  Search,
  Settings,
  User,
  ChevronRight,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Breadcrumb mapping
const breadcrumbMap: Record<string, string> = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/categories': 'Categories',
  '/orders': 'Orders',
  '/branches': 'Branches',
  '/staff': 'Staff',
  '/brand': 'Brand Profile',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
};

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  // Generate breadcrumb items
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Dashboard', href: '/' }];

    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const label = breadcrumbMap[currentPath] || path.charAt(0).toUpperCase() + path.slice(1);
      breadcrumbs.push({ label, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  const currentPage = breadcrumbMap[pathname] || 'Page';

  return (
    <header
      className={cn(
        'flex items-center justify-between h-16 px-6 bg-background border-b border-border',
        className
      )}
    >
      {/* Left side - Breadcrumb */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{currentPage}</h1>
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && <ChevronRight className="h-3 w-3" />}
                <span
                  className={cn(
                    index === breadcrumbs.length - 1
                      ? 'text-foreground font-medium'
                      : 'hover:text-foreground cursor-pointer'
                  )}
                >
                  {index === 0 ? (
                    <Home className="h-3 w-3" />
                  ) : (
                    crumb.label
                  )}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-4">
        {/* Search Button */}
        <Button variant="ghost" size="icon" className="relative">
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 px-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.role?.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};