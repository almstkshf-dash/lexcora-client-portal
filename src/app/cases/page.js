"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header';
import { getClientCases } from '../services/api/cases';
import { ArrowLeft, FolderOpen, FileText, Hash, Loader2, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    <div className="min-h-screen  " dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <Header title={t('cases.title')} showBackButton={true} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FolderOpen className="w-6 h-6 text-blue-600" />
                  {t('home.myCases')}
                </CardTitle>
                <CardDescription className="mt-2">
                  {t('home.myCasesDesc')}
                </CardDescription>
              </div>
              <div className="text-right bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                  <User className="w-3 h-3" />
                  {t('home.username')}
                </p>
                <p className="font-semibold text-foreground mt-1">{user?.name || user?.username}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="border-0 shadow-lg">
            <CardContent className="flex flex-col justify-center items-center py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="mt-4 text-muted-foreground">{t('common.loading')}</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Cases List */}
        {!loading && !error && (
          <div className="space-y-4">
            {cases.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-muted/50 rounded-full">
                      <FolderOpen className="w-12 h-12 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {isArabic ? 'لا توجد قضايا' : 'No Cases Found'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isArabic ? 'ليس لديك أي قضايا حتى الآن.' : 'You don\'t have any cases yet.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              cases.map((caseItem) => (
                <Card
                  key={caseItem.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => router.push(`/cases/${caseItem.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-blue-600 transition-colors">
                            {caseItem.topic || (isArabic ? 'قضية بدون عنوان' : 'Untitled Case')}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 p-3  rounded-lg">
                            <Hash className="w-4 h-4 " />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {isArabic ? 'رقم القضية' : 'Case Number'}
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {caseItem.case_number || (isArabic ? 'غير متوفر' : 'N/A')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 p-3  rounded-lg">
                            <FileText className="w-4 h-4 " />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {isArabic ? 'رقم الملف' : 'File Number'}
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {caseItem.file_number || (isArabic ? 'غير متوفر' : 'N/A')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/cases/${caseItem.id}`);
                        }}
                        className="shrink-0"
                      >
                        {isArabic ? 'عرض التفاصيل' : 'View Details'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Statistics */}
        {!loading && cases.length > 0 && (
          <Card className="mt-6 border-0 shadow-lg  ">
            <CardHeader>
              <CardTitle className="text-lg">
                {isArabic ? 'الإحصائيات' : 'Statistics'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4  rounded-lg shadow-sm">
                <div className="p-3  rounded-full">
                  <FolderOpen className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {isArabic ? 'إجمالي القضايا' : 'Total Cases'}
                  </p>
                  <p className="text-3xl font-bold text-foreground">{cases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
