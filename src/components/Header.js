"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { Button } from './ui/button';
import { ArrowLeft, Menu, X, LogOut, Home, Palette, Languages } from 'lucide-react';

export default function Header({ title, showBackButton = false, backTo = '/' }) {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic theme-aware classes
  const getThemeClasses = () => {
    const baseClasses = 'sticky top-0 z-40 backdrop-blur-sm transition-all duration-300';
    const themeMap = {
      light: 'bg-white/80 border-b border-gray-200 shadow-sm',
      dark: 'bg-gray-900/80 border-b border-gray-800 shadow-lg',
      blue: 'bg-blue-50/80 border-b border-blue-200 shadow-sm',
      'blue-new': 'bg-blue-900/80 border-b border-blue-700 shadow-lg',
      green: 'bg-green-50/80 border-b border-green-200 shadow-sm',
      orange: 'bg-orange-50/80 border-b border-orange-200 shadow-sm',
      'orange-gold': 'bg-gradient-to-r from-orange-50/80 to-yellow-50/80 border-b border-orange-200 shadow-sm',
      violet: 'bg-violet-50/80 border-b border-violet-200 shadow-sm',
      yellow: 'bg-yellow-50/80 border-b border-yellow-200 shadow-sm',
      rose: 'bg-rose-50/80 border-b border-rose-200 shadow-sm',
    };
    return `${baseClasses} ${themeMap[theme] || themeMap.light}`;
  };

  const getTitleClasses = () => {
    const themeMap = {
      light: 'text-gray-900',
      dark: 'text-white',
      blue: 'text-blue-900',
      'blue-new': 'text-blue-100',
      green: 'text-green-900',
      orange: 'text-orange-900',
      'orange-gold': 'text-orange-900',
      violet: 'text-violet-900',
      yellow: 'text-yellow-900',
      rose: 'text-rose-900',
    };
    return themeMap[theme] || themeMap.light;
  };

  const getMobileMenuClasses = () => {
    const themeMap = {
      light: 'border-gray-200 bg-white/95',
      dark: 'border-gray-700 bg-gray-900/95',
      blue: 'border-blue-200 bg-blue-50/95',
      'blue-new': 'border-blue-700 bg-blue-900/95',
      green: 'border-green-200 bg-green-50/95',
      orange: 'border-orange-200 bg-orange-50/95',
      'orange-gold': 'border-orange-200 bg-gradient-to-r from-orange-50/95 to-yellow-50/95',
      violet: 'border-violet-200 bg-violet-50/95',
      yellow: 'border-yellow-200 bg-yellow-50/95',
      rose: 'border-rose-200 bg-rose-50/95',
    };
    return themeMap[theme] || themeMap.light;
  };

  return (
    <nav className={getThemeClasses()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {showBackButton ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(backTo)}
                className="gap-2 hover:scale-105 transition-transform"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{t('navigation.home')}</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="gap-2 hover:scale-105 transition-transform"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">{t('navigation.home')}</span>
              </Button>
            )}
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
            <h1 className={`text-lg sm:text-xl font-bold truncate ${getTitleClasses()}`}>
              {title || t('home.title')}
            </h1>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100/50 dark:bg-gray-800/50">
              <Palette className="w-4 h-4 opacity-70" />
              <ThemeSwitcher />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100/50 dark:bg-gray-800/50">
              <Languages className="w-4 h-4 opacity-70" />
              <LanguageSwitcher />
            </div>
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>
            <Button
              onClick={logout}
              variant="destructive"
              size="sm"
              className="gap-2 hover:scale-105 transition-transform shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">{t('auth.logout')}</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:scale-105 transition-transform"
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
          <div className={`md:hidden pb-4 border-t mt-2 pt-4 space-y-3 animate-in slide-in-from-top-2 duration-200 ${getMobileMenuClasses()}`}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 opacity-70" />
                  <span className="text-sm font-medium">
                    {t('settings.theme') || 'Theme'}
                  </span>
                </div>
                <ThemeSwitcher />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 opacity-70" />
                  <span className="text-sm font-medium">
                    {t('settings.language') || 'Language'}
                  </span>
                </div>
                <LanguageSwitcher />
              </div>
              <Button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                variant="destructive"
                className="w-full gap-2 shadow-sm hover:scale-[1.02] transition-transform"
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
