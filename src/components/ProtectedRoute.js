"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

export default function ProtectedRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  // List of public routes that don't require authentication
  const publicRoutes = ['/login'];

  useEffect(() => {
    // If not loading and not authenticated, and not on a public route
    if (!loading && !isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, pathname, router]);

  // Show loading spinner only on protected routes, not on login page
  if (loading && !publicRoutes.includes(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid  border-r-transparent"></div>
          <p className="mt-2 ">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // If on a public route, always show content
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // If not authenticated and not on a public route, don't render anything
  // (will redirect in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
}
