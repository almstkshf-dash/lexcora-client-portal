"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguage } from '../../../contexts/LanguageContext';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { getClientCaseById } from '../../services/api/cases';

export default function CaseDetailsPage() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const router = useRouter();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCaseDetails();
    }
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getClientCaseById(id);
      
      if (response.success) {
        setCaseData(response.data);
      } else {
        setError(response.message || 'Failed to load case details');
      }
    } catch (err) {
      console.error('Error fetching case details:', err);
      setError(err.response?.data?.message || 'Failed to load case details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return isArabic ? 'غير متوفر' : 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(isArabic ? 'ar-AE' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const InfoRow = ({ label, value }) => (
    <div className="py-3 border-b border-gray-200 last:border-0">
      <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
      <dd className="text-sm text-gray-900">{value || (isArabic ? 'غير متوفر' : 'N/A')}</dd>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.push('/cases')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← {isArabic ? 'العودة للقضايا' : 'Back to Cases'}
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                {isArabic ? 'تفاصيل القضية' : 'Case Details'}
              </h1>
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

        {/* Case Details */}
        {!loading && !error && caseData && (
          <div className="space-y-6">
            {/* Case Information Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">
                  {isArabic ? 'معلومات القضية' : 'Case Information'}
                </h2>
              </div>
              <div className="p-6">
                <dl className="divide-y divide-gray-200">
                  <InfoRow 
                    label={isArabic ? 'عنوان القضية' : 'Case Topic'} 
                    value={caseData.topic} 
                  />
                  <InfoRow 
                    label={isArabic ? 'رقم الملف' : 'File Number'} 
                    value={caseData.file_number} 
                  />
                  <InfoRow 
                    label={isArabic ? 'رقم القضية' : 'Case Number'} 
                    value={caseData.case_number} 
                  />
                  <InfoRow 
                    label={isArabic ? 'اسم المحامي' : 'Lawyer Name'} 
                    value={caseData.lawyer_name} 
                  />
                  <InfoRow 
                    label={isArabic ? 'نوع القضية' : 'Case Type'} 
                    value={isArabic ? caseData.case_type_ar : caseData.case_type_en} 
                  />
                  <InfoRow 
                    label={isArabic ? 'تاريخ البدء' : 'Start Date'} 
                    value={formatDate(caseData.start_date)} 
                  />
                  {caseData.additional_note && (
                    <div className="py-3">
                      <dt className="text-sm font-medium text-gray-500 mb-2">
                        {isArabic ? 'ملاحظات إضافية' : 'Additional Notes'}
                      </dt>
                      <dd className="text-sm text-gray-900 bg-gray-50 p-4 rounded-md">
                        {caseData.additional_note}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Sessions Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">
                  {isArabic ? 'جلسات القضية' : 'Case Sessions'}
                </h2>
              </div>
              <div className="p-6">
                {caseData.sessions && caseData.sessions.length > 0 ? (
                  <div className="space-y-4">
                    {caseData.sessions.map((session, index) => (
                      <div 
                        key={session.id} 
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {isArabic ? `الجلسة ${index + 1}` : `Session ${index + 1}`}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {formatDate(session.session_date)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              {isArabic ? 'التاريخ:' : 'Date:'}
                            </span>
                            <p className="text-sm text-gray-900 mt-1">
                              {formatDate(session.session_date)}
                            </p>
                          </div>

                          {session.link && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">
                                {isArabic ? 'الرابط:' : 'Link:'}
                              </span>
                              <a 
                                href={session.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 mt-1 block break-all"
                              >
                                {session.link}
                              </a>
                            </div>
                          )}

                          {session.decision && (
                            <div className="md:col-span-2">
                              <span className="text-sm font-medium text-gray-500">
                                {isArabic ? 'القرار:' : 'Decision:'}
                              </span>
                              <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded">
                                {session.decision}
                              </p>
                            </div>
                          )}

                          {session.is_judgment_reserved === 1 && (
                            <div>
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                {isArabic ? 'حجز للحكم' : 'Judgment Reserved'}
                              </span>
                            </div>
                          )}

                          {session.is_judgment_deferred === 1 && (
                            <div>
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                {isArabic ? 'تأجيل الحكم' : 'Judgment Deferred'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      {isArabic ? 'لا توجد جلسات' : 'No Sessions'}
                    </h3>
                    <p className="mt-1 text-gray-500">
                      {isArabic 
                        ? 'لم يتم تسجيل أي جلسات لهذه القضية بعد.' 
                        : 'No sessions have been recorded for this case yet.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
