"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header';
import { getClientFinanceSummary, getClientInvoices } from '../services/api/finance';
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Download, 
  CreditCard, 
  History, 
  Loader2, 
  AlertCircle,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Receipt,
  CalendarDays
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function FinancePage() {
  const { user } = useAuth();
  const { t, locale } = useTranslation();
  const { isArabic } = useLanguage();
  const router = useRouter();
  
  const [summary, setSummary] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, invoicesRes] = await Promise.allSettled([
        getClientFinanceSummary(),
        getClientInvoices()
      ]);

      if (summaryRes.status === 'fulfilled' && summaryRes.value?.success) {
        setSummary(summaryRes.value.data);
      }
      if (invoicesRes.status === 'fulfilled' && invoicesRes.value?.success) {
        setInvoices(invoicesRes.value.data || []);
      }

    } catch (err) {
      console.error('Error fetching finance data:', err);
      setError(t('finance.errorLoadingData') || 'Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(isArabic ? 'ar-AE' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/10 text-green-600 border-green-200/50 hover:bg-green-500/20">{t('finance.paid') || 'Paid'}</Badge>;
      case 'unpaid':
        return <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-200/50 hover:bg-red-500/20">{t('finance.unpaid') || 'Unpaid'}</Badge>;
      case 'partial':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200/50 hover:bg-amber-500/20">{t('finance.partial') || 'Partial'}</Badge>;
      default:
        return <Badge variant="outline" className="opacity-70">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pb-20" dir={isArabic ? 'rtl' : 'ltr'}>
      <Header title={t('finance.title')} showBackButton={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="relative overflow-hidden border-none shadow-2xl shadow-blue-500/10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-2 group transition-all hover:-translate-y-1">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
            <CardHeader className="pb-2 pt-6 px-6">
              <div className="flex justify-between items-start">
                 <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
                    <ArrowDownRight className="w-6 h-6 text-blue-100" />
                 </div>
                 <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
                    {t('finance.aed')}
                 </Badge>
              </div>
              <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-widest mt-6">
                {t('finance.receivable')}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              {loading ? (
                <Skeleton className="h-12 w-3/4 bg-white/20 rounded-xl" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono tracking-tighter">
                    {formatCurrency(summary?.receivable)}
                  </span>
                </div>
              )}
              <p className="text-xs mt-3 text-blue-100/70 font-medium max-w-[200px]">
                {t('finance.receivableDesc')}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none shadow-xl bg-white dark:bg-slate-900 rounded-3xl p-2 group transition-all hover:-translate-y-1">
            <CardHeader className="pb-2 pt-6 px-6">
              <div className="flex justify-between items-start">
                 <div className="p-3 bg-green-500/10 rounded-2xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                 </div>
              </div>
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-6">
                {t('finance.income')}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              {loading ? (
                <Skeleton className="h-12 w-3/4 rounded-xl" />
              ) : (
                <p className="text-4xl font-black font-mono tracking-tighter text-slate-900 dark:text-white">
                  {formatCurrency(summary?.income)}
                </p>
              )}
              <p className="text-xs mt-3 text-slate-400 font-medium">
                {t('finance.incomeDesc')}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none shadow-xl bg-white dark:bg-slate-900 rounded-3xl p-2 group transition-all hover:-translate-y-1">
            <CardHeader className="pb-2 pt-6 px-6">
              <div className="flex justify-between items-start">
                 <div className="p-3 bg-amber-500/10 rounded-2xl">
                    <Wallet className="w-6 h-6 text-amber-600" />
                 </div>
              </div>
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-6">
                {t('finance.expense')}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              {loading ? (
                <Skeleton className="h-12 w-3/4 rounded-xl" />
              ) : (
                <p className="text-4xl font-black font-mono tracking-tighter text-slate-900 dark:text-white">
                  {formatCurrency(summary?.expense)}
                </p>
              )}
              <p className="text-xs mt-3 text-slate-400 font-medium">
                {t('finance.expenseDesc')}
              </p>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8 border-none shadow-lg bg-red-500/5 text-red-600 rounded-2xl">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="font-medium ml-2">{error}</AlertDescription>
          </Alert>
        )}

        {/* Invoices List Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-600 rounded-full" />
                {t('finance.recentInvoices')}
              </h3>
              <p className="text-slate-500 text-sm mt-1">{t('finance.description')}</p>
            </div>
            <Button variant="outline" className="rounded-2xl border-slate-200 dark:border-slate-800 gap-2 font-bold px-6 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900">
              <Download className="w-4 h-4" />
              {t('finance.exportAll')}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {loading ? (
              [1, 2, 3].map(i => (
                <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden">
                  <CardContent className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <Skeleton className="w-16 h-16 rounded-2xl" />
                      <div className="space-y-3">
                        <Skeleton className="h-6 w-48 rounded-lg" />
                        <Skeleton className="h-4 w-32 rounded-lg" />
                      </div>
                    </div>
                    <Skeleton className="h-12 w-32 rounded-2xl" />
                  </CardContent>
                </Card>
              ))
            ) : invoices.length === 0 ? (
              <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[40px] py-24 text-center">
                <div className="flex flex-col items-center max-w-sm mx-auto">
                  <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-8 animate-bounce duration-[3s]">
                    <Receipt className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                    {t('finance.noInvoices')}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {t('finance.noInvoicesDesc')}
                  </p>
                </div>
              </Card>
            ) : (
              invoices.map((invoice) => (
                <Card 
                  key={invoice.id}
                  className="group relative border-none shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 cursor-pointer"
                  onClick={() => {/* Navigate to details if needed */}}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Left: Info Section */}
                      <div className="flex-1 p-6 lg:p-8 flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-500/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <Receipt className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{invoice.invoice_number}</span>
                            {getStatusBadge(invoice.status)}
                          </div>
                          <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
                            <span className="flex items-center gap-2">
                              <CalendarDays className="w-4 h-4 text-slate-400" />
                              {new Date(invoice.invoice_date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount Section */}
                      <div className="bg-slate-50/50 dark:bg-slate-800/30 lg:w-72 p-6 lg:p-8 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center border-t lg:border-t-0 lg:border-l dark:border-slate-800">
                        <div className="lg:text-right">
                          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
                            {t('finance.totalAmount')}
                          </p>
                          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">
                            {formatCurrency(invoice.amount)} <span className="text-xs font-sans text-slate-400">AED</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 lg:mt-4">
                           <Button 
                             size="icon"
                             variant="ghost" 
                             className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-950 shadow-sm border border-slate-100 dark:border-slate-800 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"
                           >
                             {isArabic ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                           </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
