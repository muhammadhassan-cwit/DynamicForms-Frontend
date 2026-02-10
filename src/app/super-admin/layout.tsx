'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import {
  HomeIcon,
  BuildingIcon,
  LogoutIcon,
  ShieldIcon,
  MenuIcon,
  XIcon,
} from '@/components/icons';

const navItems = [
  { label: 'Dashboard', href: '/super-admin', icon: HomeIcon },
  { label: 'Companies', href: '/super-admin/companies', icon: BuildingIcon },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Clear any stale server-side cookies before redirecting to prevent
      // an infinite loop (middleware redirects /login back if token cookie exists)
      logout().then(() => router.push('/login'));
      return;
    }

    if (!isLoading && isAuthenticated && !user?.isSuperAdmin) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router, user, logout]);

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out successfully');
    router.push('/login');
  };

  if (isLoading || !isAuthenticated || !user?.isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-700/50">
        <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <ShieldIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight">DynamicForms</h1>
          <p className="text-xs text-gray-400">Super Admin</p>
        </div>
      </div>

      {/* Mobile close button */}
      <div className="flex items-center justify-end px-4 pt-3 md:hidden">
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
          aria-label="Close sidebar"
        >
          <XIcon />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Menu</p>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/super-admin' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User info & logout */}
      <div className="px-3 py-4 border-t border-gray-700/50">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-indigo-400">
              {user?.fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'S'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.fullName || user?.email}</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-all duration-200"
        >
          <LogoutIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-200 ease-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-900 scrollbar-thin overflow-y-auto flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200/60 px-4 sm:px-6 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <MenuIcon />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Super Admin Panel</h2>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
