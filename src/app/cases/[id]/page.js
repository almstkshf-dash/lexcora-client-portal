"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguage } from '../../../contexts/LanguageContext';
import Header from '../../../components/Header';
import { getClientCaseById } from '../../services/api/cases';
import { ArrowLeft, FileText, Calendar, User, Hash, AlertCircle, CheckCircle, Clock, Link as LinkIcon, Loader2, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CaseDetailsPage() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const router = useRouter();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCaseDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getClientCaseById(id);
      
      if (response.success) {
        setCaseData(response.data);
      } else {
        setError(response.message || t('cases.failedToLoadCaseDetails'));
      }
    } catch (err) {
      console.error('Error fetching case details:', err);
      setError(err.response?.data?.message || t('cases.failedToLoadCaseDetails'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCaseDetails();
    }
  }, [id, fetchCaseDetails]);

  const formatDate = (dateString) => {
    if (!dateString) return t('home.notAvailable');
    const date = new Date(dateString);
    return date.toLocaleDateString(isArabic ? 'ar-AE' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
      <div className="p-2 bg-white rounded-lg shadow-sm border">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <dt className="text-xs font-medium text-muted-foreground mb-1">{label}</dt>
        <dd className="text-sm font-semibold text-foreground break-words">
          {value || t('home.notAvailable')}
        </dd>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <Header 
        title={t('cases.caseDetailsTitle')} 
        showBackButton={true} 
        backTo="/cases" 
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Case Details */}
        {!loading && !error && caseData && (
          <div className="space-y-6">
            {/* Case Information Card */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-white border-b">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  {t('cases.caseInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow 
                    icon={FileText}
                    label={t('cases.caseTopic')} 
                    value={caseData.topic} 
                  />
                  <InfoRow 
                    icon={Hash}
                    label={t('cases.fileNumberLabel')} 
                    value={caseData.file_number} 
                  />
                  <InfoRow 
                    icon={Hash}
                    label={t('cases.caseNumberLabel')} 
                    value={caseData.case_number} 
                  />
                  <InfoRow 
                    icon={User}
                    label={t('cases.lawyerName')} 
                    value={caseData.lawyer_name} 
                  />
                  <InfoRow 
                    icon={FileText}
                    label={t('cases.caseType')} 
                    value={isArabic ? caseData.case_type_ar : caseData.case_type_en} 
                  />
                  <InfoRow 
                    icon={Calendar}
                    label={t('cases.startDate')} 
                    value={formatDate(caseData.start_date)} 
                  />
                </div>
                
                {caseData.additional_note && (
                  <div className="mt-6">
                    <Card className="bg-muted/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                          <AlertCircle className="w-4 h-4" />
                          {t('cases.additionalNotes')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {caseData.additional_note}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sessions Section */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-white border-b">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  {t('cases.caseSessions')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {Array.isArray(caseData.sessions) && caseData.sessions.length > 0 ? (
                  <div className="space-y-4">
                    {caseData.sessions.map((session, index) => (
                      <Card 
                        key={session.id} 
                        className="bg-card hover:shadow-lg transition-all duration-300"
                      >
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg border">
                                <Calendar className="w-5 h-5 text-primary" />
                              </div>
                              <h3 className="text-lg font-bold text-foreground">
                                {t('cases.sessionNumber', { number: index + 1 })}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                              <Clock className="w-4 h-4" />
                              {formatDate(session.session_date)}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {session.link && (
                              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg md:col-span-2 border">
                                <LinkIcon className="w-5 h-5 text-primary mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <span className="text-xs font-medium text-muted-foreground block mb-1">
                                    {t('cases.linkLabel')}
                                  </span>
                                  <a 
                                    href={session.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline break-all font-medium"
                                  >
                                    {session.link}
                                  </a>
                                </div>
                              </div>
                            )}

                            {session.decision && (
                              <div className="md:col-span-2">
                                <Card className="bg-muted/30">
                                  <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                                      <div>
                                        <span className="text-xs font-medium text-muted-foreground block mb-1">
                                          {t('cases.decisionLabel')}
                                        </span>
                                        <p className="text-sm text-foreground leading-relaxed">
                                          {session.decision}
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </div>

                          {(session.is_judgment_reserved === 1 || session.is_judgment_deferred === 1) && (
                            <div className="flex gap-2 mt-4">
                              {session.is_judgment_reserved === 1 && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  {t('cases.judgmentReserved')}
                                </span>
                              )}

                              {session.is_judgment_deferred === 1 && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                  <Clock className="w-3.5 h-3.5" />
                                  {t('cases.judgmentDeferred')}
                                </span>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-muted/50 rounded-full">
                        <Calendar className="w-12 h-12 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {t('cases.noSessions')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('cases.noSessionsDesc')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Financial Summary Section */}
        {!loading && !error && caseData && caseData.financial_summary && (
          <div className="mt-8">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-white border-b">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-primary" />
                  {t('finance.caseSummary')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoRow 
                    icon={TrendingUp}
                    label={t('finance.income')} 
                    value={new Intl.NumberFormat(isArabic ? 'ar-AE' : 'en-US', { style: 'currency', currency: 'AED' }).format(caseData.financial_summary.income || 0)} 
                  />
                  <InfoRow 
                    icon={TrendingDown}
                    label={t('finance.expense')} 
                    value={new Intl.NumberFormat(isArabic ? 'ar-AE' : 'en-US', { style: 'currency', currency: 'AED' }).format(caseData.financial_summary.expense || 0)} 
                  />
                  <InfoRow 
                    icon={AlertCircle}
                    label={t('finance.receivable')} 
                    value={new Intl.NumberFormat(isArabic ? 'ar-AE' : 'en-US', { style: 'currency', currency: 'AED' }).format(caseData.financial_summary.receivable || 0)} 
                  />
                  <InfoRow 
                    icon={CheckCircle}
                    label={t('finance.profit')} 
                    value={new Intl.NumberFormat(isArabic ? 'ar-AE' : 'en-US', { style: 'currency', currency: 'AED' }).format(caseData.financial_summary.profit || 0)} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
