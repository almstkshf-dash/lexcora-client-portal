"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from './ui/button';
import { ArrowLeft, Menu, X, LogOut, Home } from 'lucide-react';

export default function Header({ title, showBackButton = false, backTo = '/' }) {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {showBackButton ? (
              <Button
                variant="ghost"
                onClick={() => router.push(backTo)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{t('navigation.home')}</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">{t('navigation.home')}</span>
              </Button>
            )}
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              {title || t('home.title')}
            </h1>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Button
              onClick={logout}
              variant="destructive"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t('auth.logout')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-2 pt-4 space-y-3">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {t('settings.language') || 'Language'}
                </span>
                <LanguageSwitcher />
              </div>
              <Button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                variant="destructive"
                className="w-full gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t('auth.logout')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
