"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header';
import { getClientCases } from '../services/api/cases';
import { ArrowLeft, FolderOpen, FileText, Hash, Loader2, User, Search, Filter, Briefcase, Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function CasesPage() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const router = useRouter();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredCases = useMemo(() => {
    return cases.filter(caseItem => {
      const searchStr = searchQuery.toLowerCase();
      return (
        caseItem.topic?.toLowerCase().includes(searchStr) ||
        caseItem.case_number?.toLowerCase().includes(searchStr) ||
        caseItem.file_number?.toLowerCase().includes(searchStr)
      );
    });
  }, [cases, searchQuery]);

  // Helper to render skeleton loading
  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <Header title={t('cases.title')} showBackButton={true} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-card to-muted/50 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <FolderOpen className="w-32 h-32" />
            </div>
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <FolderOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight">
                  {t('home.myCases')}
                </CardTitle>
              </div>
              <CardDescription className="text-lg">
                {t('home.myCasesDesc')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute -bottom-6 -right-6 opacity-10">
              <User className="w-24 h-24" />
            </div>
            <CardHeader>
              <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">
                {t('home.userInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold truncate">{user?.name || user?.username}</p>
              <p className="text-sm opacity-70 mt-1">{user?.email || t('home.username')}</p>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-0 hover:bg-white/30">
                  {t('cases.activeClient')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={t('common.search') + '...'}
              className="pl-10 h-12 border-0 shadow-md focus-visible:ring-primary/20 bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 border-0 shadow-md bg-card hover:bg-muted/50 gap-2">
            <Filter className="w-4 h-4" />
            {t('cases.filter')}
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-0 shadow-lg animate-in slide-in-from-top-2">
            <AlertDescription className="flex items-center gap-2">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={fetchClientCases} className="ml-auto underline">
                {t('cases.retry')}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Cases List */}
        <div className="space-y-6">
          {loading ? (
            renderSkeletons()
          ) : filteredCases.length === 0 ? (
            <Card className="border-0 shadow-lg bg-card">
              <CardContent className="py-20 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-6 bg-muted rounded-full animate-pulse">
                    <FolderOpen className="w-16 h-16 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {searchQuery ? t('cases.noResults') : t('cases.noCases')}
                </h3>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  {searchQuery 
                    ? t('cases.noResultsDesc')
                    : t('cases.noCasesDesc')}
                </p>
                {searchQuery && (
                  <Button variant="link" onClick={() => setSearchQuery('')} className="mt-4">
                    {t('cases.clearSearch')}
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredCases.map((caseItem, index) => (
                <Card
                  key={caseItem.id}
                  className="border-0 shadow-md hover:shadow-xl hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-300 cursor-pointer group bg-card overflow-hidden"
                  onClick={() => router.push(`/cases/${caseItem.id}`)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Briefcase className="w-7 h-7 text-primary" />
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {caseItem.topic || (isArabic ? 'قضية بدون عنوان' : 'Untitled Case')}
                          </h3>
                          <Badge variant="outline" className="bg-muted/30 border-0 px-3 py-1 text-xs font-medium">
                            {t('cases.inProgress')}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted/50 rounded-lg">
                              <Hash className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                                {isArabic ? 'رقم القضية' : 'Case Number'}
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {caseItem.case_number || (isArabic ? 'غير متوفر' : 'N/A')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted/50 rounded-lg">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                                {isArabic ? 'رقم الملف' : 'File Number'}
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {caseItem.file_number || (isArabic ? 'غير متوفر' : 'N/A')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted/50 rounded-lg">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                                {t('cases.addedDate')}
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {caseItem.created_at ? new Date(caseItem.created_at).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US') : (isArabic ? 'غير متوفر' : 'N/A')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex items-center md:border-l rtl:md:border-r md:pl-6 rtl:md:pr-6 md:h-12 border-muted">
                        <Button
                          variant="ghost"
                          className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 rounded-xl px-4 gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/cases/${caseItem.id}`);
                          }}
                        >
                          <span className="font-semibold">{isArabic ? 'التفاصيل' : 'Details'}</span>
                          <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Statistics Section */}
        {!loading && cases.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              {t('cases.statistics')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                      <FolderOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-0">
                      +12%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    {t('cases.totalCases')}
                  </p>
                  <p className="text-3xl font-bold text-foreground">{cases.length}</p>
                </CardContent>
              </Card>

              {/* Placeholder for other stats */}
              <Card className="border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/10 rounded-2xl">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-0">
                      {isArabic ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    {t('cases.ongoingCases')}
                  </p>
                  <p className="text-3xl font-bold text-foreground">{cases.length}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-2xl">
                      <Briefcase className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    {t('cases.closedCases')}
                  </p>
                  <p className="text-3xl font-bold text-foreground">0</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-500/10 rounded-2xl">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    {t('cases.upcomingSessions')}
                  </p>
                  <p className="text-3xl font-bold text-foreground">0</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
