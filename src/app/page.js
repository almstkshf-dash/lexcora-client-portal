"use client";

import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useRouter } from 'next/navigation';
import { FileText, FolderOpen, FileQuestion } from 'lucide-react';

export default function Home() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">{t('home.title')}</h1>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                {t('auth.logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('home.welcome', { name: user?.name || user?.username })}
          </h2>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('home.username')}:</p>
                <p className="text-base font-medium text-gray-900">{user?.username}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">{t('home.name')}:</p>
                <p className="text-base font-medium text-gray-900">{user?.name || t('home.notAvailable')}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">{t('home.phone')}:</p>
                <p className="text-base font-medium text-gray-900">{user?.phone || t('home.notAvailable')}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">{t('home.status')}:</p>
                <p className={`text-base font-medium ${user?.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {user?.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {t('home.quickLinks')}
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <button
              onClick={() => router.push('/cases')}
              className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer bg-white aspect-square"
            >
              <FolderOpen className="w-16 h-16 text-blue-600 mb-4" />
              <h4 className="font-semibold text-gray-900 text-center">{t('home.myCases')}</h4>
            </button>
            <button
              onClick={() => router.push('/documents')}
              className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:shadow-lg transition-all cursor-pointer bg-white aspect-square"
            >
              <FileText className="w-16 h-16 text-green-600 mb-4" />
              <h4 className="font-semibold text-gray-900 text-center">{t('home.documents')}</h4>
            </button>
            <button
              onClick={() => router.push('/requests')}
              className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer bg-white aspect-square"
            >
              <FileQuestion className="w-16 h-16 text-purple-600 mb-4" />
              <h4 className="font-semibold text-gray-900 text-center">{t('home.requests')}</h4>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
