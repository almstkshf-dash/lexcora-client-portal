"use client";

import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import { useRouter } from 'next/navigation';
import { FileText, FolderOpen, FileQuestion, User, Phone, Mail, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const router = useRouter();

  const quickLinks = [
    {
      title: t('home.myCases'),
      description: t('home.myCasesDesc'),
      icon: FolderOpen,
      route: '/cases',
      color: 'blue'
    },
    {
      title: t('home.documents'),
      description: t('home.documentsDesc'),
      icon: FileText,
      route: '/documents',
      color: 'green'
    },
    {
      title: t('home.requests'),
      description: t('home.requestsDesc'),
      icon: FileQuestion,
      route: '/requests',
      color: 'purple'
    },
    {
      title: t('home.finance'),
      description: t('home.financeDesc'),
      icon: FileText,
      route: '/finance',
      color: 'orange'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200',
      green: 'text-green-600 bg-green-50 hover:bg-green-100 border-green-200',
      purple: 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200',
      orange: 'text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen " dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <Header title={t('home.title')} showBackButton={false} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              {t('home.welcome', { name: user?.name || user?.username })}
            </CardTitle>
            <CardDescription>
              {t('home.welcomeDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg ">
                <div className="p-2 rounded-full bg-blue-100">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs ">{t('home.username')}</p>
                  <p className="text-sm font-semibold ">{user?.username}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg ">
                <div className="p-2 rounded-full ">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs ">{t('home.name')}</p>
                  <p className="text-sm font-semibold ">{user?.name || t('home.notAvailable')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg ">
                <div className="p-2 rounded-full ">
                  <Phone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs ">{t('home.phone')}</p>
                  <p className="text-sm font-semibold ">{user?.phone || t('home.notAvailable')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg ">
                <div className="p-2 rounded-full bg-orange-100">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs ">{t('home.status')}</p>
                  <p className={`text-sm font-semibold ${user?.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                    {user?.status || t('home.notAvailable')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links Section */}
        <div>
          <h2 className="text-lg font-semibold  mb-4">
            {t('home.quickLinks')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Card
                  key={link.route}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 ${getColorClasses(link.color)}`}
                  onClick={() => router.push(link.route)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`p-4 rounded-full ${getColorClasses(link.color)}`}>
                        <Icon className="w-12 h-12" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold  mb-1">
                          {link.title}
                        </h3>
                        <p className="text-sm ">
                          {link.description}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(link.route);
                        }}
                      >
                        {t('home.viewButton')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
