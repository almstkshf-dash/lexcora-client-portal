"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { getClientCases } from '../services/api/cases';

export default function CasesPage() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const router = useRouter();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClientCases();
  }, []);

  const fetchClientCases = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getClientCases();
      
      if (response.success) {
        setCases(response.data || []);
      } else {
        setError(response.message || 'Failed to load cases');
      }
    } catch (err) {
      console.error('Error fetching cases:', err);
      setError(err.response?.data?.message || 'Failed to load cases');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← {t('navigation.home')}
              </button>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t('home.myCases')}</h2>
              <p className="text-gray-600 mt-1">{t('home.myCasesDesc')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{t('home.username')}</p>
              <p className="font-medium text-gray-900">{user?.name || user?.username}</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">{t('common.loading')}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Cases List */}
        {!loading && !error && (
          <div className="space-y-4">
            {cases.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  {t('common.welcome') === 'Welcome' ? 'No Cases Found' : 'لا توجد قضايا'}
                </h3>
                <p className="mt-1 text-gray-500">
                  {t('common.welcome') === 'Welcome' 
                    ? 'You don\'t have any cases yet.' 
                    : 'ليس لديك أي قضايا حتى الآن.'}
                </p>
              </div>
            ) : (
              cases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {caseItem.topic || (isArabic ? 'قضية بدون عنوان' : 'Untitled Case')}
                        </h3>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">
                            {isArabic ? 'رقم القضية:' : 'Case Number:'}
                          </span>{' '}
                          {caseItem.case_number || (isArabic ? 'غير متوفر' : 'N/A')}
                        </p>
                        
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">
                            {isArabic ? 'رقم الملف:' : 'File Number:'}
                          </span>{' '}
                          {caseItem.file_number || (isArabic ? 'غير متوفر' : 'N/A')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/cases/${caseItem.id}`)}
                      className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                    >
                      {isArabic ? 'عرض التفاصيل' : 'View Details'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Statistics */}
        {!loading && cases.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('common.welcome') === 'Welcome' ? 'Statistics' : 'الإحصائيات'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">
                  {t('common.welcome') === 'Welcome' ? 'Total Cases' : 'إجمالي القضايا'}
                </p>
                <p className="text-2xl font-bold text-blue-900">{cases.length}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
