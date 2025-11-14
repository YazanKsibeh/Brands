"use client";

/**
 * Sidebar Navigation Component for LocalStyle Dashboard
 * Provides role-based navigation with collapsible menu
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/store/auth/auth-thunks';
import { Button } from '@/components/ui/button';
import {
  Package,
  Users,
  Building2,
  BarChart3,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Store,
  Palette,
  ShoppingBag,
  User,
  Crown,
  Shield,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  badge?: string;
}

// Navigation items based on user roles
const navigationItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: BarChart3,
    roles: ['admin', 'brand_owner', 'branch_manager', 'staff'],
  },
  {
    title: 'Products',
    href: '/products',
    icon: Package,
    roles: ['admin', 'brand_owner', 'branch_manager', 'staff'],
  },
  {
    title: 'Categories',
    href: '/categories',
    icon: Palette,
    roles: ['admin', 'brand_owner', 'branch_manager'],
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: ShoppingBag,
    roles: ['admin', 'brand_owner', 'branch_manager', 'staff'],
  },
  {
    title: 'Branches',
    href: '/branches',
    icon: Building2,
    roles: ['admin', 'brand_owner'],
  },
  {
    title: 'Staff',
    href: '/staff',
    icon: Users,
    roles: ['admin', 'brand_owner', 'branch_manager'],
  },
  {
    title: 'Brand Profile',
    href: '/brand',
    icon: Store,
    roles: ['admin', 'brand_owner'],
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
    roles: ['admin', 'brand_owner', 'branch_manager'],
    badge: '3',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['admin', 'brand_owner', 'branch_manager', 'staff'],
  },
];

// Role icons mapping
const roleIcons = {
  admin: Crown,
  brand_owner: Shield,
  branch_manager: UserCheck,
  staff: User,
};

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  const getRoleIcon = () => {
    if (!user?.role) return User;
    return roleIcons[user.role as keyof typeof roleIcons] || User;
  };

  const getRoleDisplayName = (role: string) => {
    return role.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div
      className={cn(
        'flex flex-col h-screen bg-card border-r border-border transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Cozy</h1>
              <p className="text-xs text-muted-foreground">Brand Dashboard</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            {React.createElement(getRoleIcon(), {
              className: 'h-5 w-5 text-muted-foreground',
            })}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role ? getRoleDisplayName(user.role) : 'Role'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                isCollapsed && 'justify-center'
              )}
            >
              <item.icon className={cn('h-5 w-5', isCollapsed ? 'mx-auto' : '')} />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <span className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            'w-full justify-start text-muted-foreground hover:text-foreground',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <LogOut className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
          {!isCollapsed && 'Sign Out'}
        </Button>
      </div>
    </div>
  );
};