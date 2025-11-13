"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import Header from '../../components/Header';
import { getClientRequests, createClientRequest } from '../services/api/requests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle, Loader2, Plus, Calendar, User } from 'lucide-react';

export default function RequestsPage() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    request_type: '',
    request_title: '',
    request_date: new Date().toISOString().split('T')[0]
  });

  // Request type options
  const requestTypes = isArabic ? [
    { value: 'استشارة قانونية', label: 'استشارة قانونية' },
    { value: 'طلب مستند', label: 'طلب مستند' },
    { value: 'تحديث حالة القضية', label: 'تحديث حالة القضية' },
    { value: 'موعد', label: 'موعد' },
    { value: 'استفسار مالي', label: 'استفسار مالي' },
    { value: 'أخرى', label: 'أخرى' }
  ] : [
    { value: 'Legal Consultation', label: 'Legal Consultation' },
    { value: 'Document Request', label: 'Document Request' },
    { value: 'Case Update', label: 'Case Update' },
    { value: 'Appointment', label: 'Appointment' },
    { value: 'Financial Inquiry', label: 'Financial Inquiry' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    fetchClientRequests();
  }, []);

  const fetchClientRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getClientRequests();
      
      if (response.success) {
        setRequests(response.data || []);
      } else {
        setError(response.message || 'Failed to load requests');
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.request_type) {
      setError(isArabic ? 'يرجى اختيار نوع الطلب' : 'Please select a request type');
      return;
    }
    
    if (!formData.request_title.trim()) {
      setError(isArabic ? 'يرجى إدخال تفاصيل الطلب' : 'Please enter request details');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const response = await createClientRequest(formData);
      
      if (response.success) {
        // Close modal and reset form
        setShowCreateModal(false);
        setFormData({
          request_type: '',
          request_title: '',
          request_date: new Date().toISOString().split('T')[0]
        });
        
        // Refresh requests list
        await fetchClientRequests();
      } else {
        setError(response.message || 'Failed to create request');
      }
    } catch (err) {
      console.error('Error creating request:', err);
      setError(err.response?.data?.message || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  // Theme-aware utility functions
  const getThemeColors = () => {
    const themeMap = {
      light: {
        bg: 'bg-gray-50',
        bgSecondary: 'bg-white',
        bgHover: 'hover:bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
        textMuted: 'text-gray-500',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        cardBg: 'bg-white',
        shadow: 'shadow-sm hover:shadow-md',
      },
      dark: {
        bg: 'bg-gray-900',
        bgSecondary: 'bg-gray-800',
        bgHover: 'hover:bg-gray-700',
        border: 'border-gray-700',
        text: 'text-white',
        textSecondary: 'text-gray-300',
        textMuted: 'text-gray-400',
        iconBg: 'bg-blue-900/30',
        iconColor: 'text-blue-400',
        cardBg: 'bg-gray-800',
        shadow: 'shadow-lg hover:shadow-xl',
      },
      blue: {
        bg: 'bg-blue-50',
        bgSecondary: 'bg-white',
        bgHover: 'hover:bg-blue-100',
        border: 'border-blue-200',
        text: 'text-blue-900',
        textSecondary: 'text-blue-700',
        textMuted: 'text-blue-600',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        cardBg: 'bg-white',
        shadow: 'shadow-blue-100 hover:shadow-blue-200',
      },
      'blue-new': {
        bg: 'bg-blue-950',
        bgSecondary: 'bg-blue-900',
        bgHover: 'hover:bg-blue-800',
        border: 'border-blue-700',
        text: 'text-blue-50',
        textSecondary: 'text-blue-200',
        textMuted: 'text-blue-300',
        iconBg: 'bg-blue-800',
        iconColor: 'text-blue-300',
        cardBg: 'bg-blue-900',
        shadow: 'shadow-lg hover:shadow-blue-900/50',
      },
      green: {
        bg: 'bg-green-50',
        bgSecondary: 'bg-white',
        bgHover: 'hover:bg-green-100',
        border: 'border-green-200',
        text: 'text-green-900',
        textSecondary: 'text-green-700',
        textMuted: 'text-green-600',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        cardBg: 'bg-white',
        shadow: 'shadow-green-100 hover:shadow-green-200',
      },
      orange: {
        bg: 'bg-orange-50',
        bgSecondary: 'bg-white',
        bgHover: 'hover:bg-orange-100',
        border: 'border-orange-200',
        text: 'text-orange-900',
        textSecondary: 'text-orange-700',
        textMuted: 'text-orange-600',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        cardBg: 'bg-white',
        shadow: 'shadow-orange-100 hover:shadow-orange-200',
      },
      'orange-gold': {
        bg: 'bg-gradient-to-br from-orange-50 to-yellow-50',
        bgSecondary: 'bg-white',
        bgHover: 'hover:bg-gradient-to-br hover:from-orange-100 hover:to-yellow-100',
        border: 'border-orange-200',
        text: 'text-orange-900',
        textSecondary: 'text-orange-700',
        textMuted: 'text-orange-600',
        iconBg: 'bg-gradient-to-br from-orange-100 to-yellow-100',
        iconColor: 'text-orange-600',
        cardBg: 'bg-white',
        shadow: 'shadow-orange-100 hover:shadow-orange-200',
      },
      violet: {
        bg: 'bg-violet-50',
        bgSecondary: 'bg-white',
        bgHover: 'hover:bg-violet-100',
        border: 'border-violet-200',
        text: 'text-violet-900',
        textSecondary: 'text-violet-700',
        textMuted: 'text-violet-600',
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600',
        cardBg: 'bg-white',
        shadow: 'shadow-violet-100 hover:shadow-violet-200',
      },
      yellow: {
        bg: 'bg-yellow-50',
        bgSecondary: 'bg-white',
        bgHover: 'hover:bg-yellow-100',
        border: 'border-yellow-200',
        text: 'text-yellow-900',
        textSecondary: 'text-yellow-700',
        textMuted: 'text-yellow-600',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        cardBg: 'bg-white',
        shadow: 'shadow-yellow-100 hover:shadow-yellow-200',
      },
      rose: {
        bg: 'bg-rose-50',
        bgSecondary: 'bg-white',
        bgHover: 'hover:bg-rose-100',
        border: 'border-rose-200',
        text: 'text-rose-900',
        textSecondary: 'text-rose-700',
        textMuted: 'text-rose-600',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-600',
        cardBg: 'bg-white',
        shadow: 'shadow-rose-100 hover:shadow-rose-200',
      },
    };
    return themeMap[theme] || themeMap.light;
  };

  const colors = getThemeColors();

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-100 text-green-700 border border-green-200 shadow-sm">
          <CheckCircle className="w-3.5 h-3.5" />
          {isArabic ? 'موافق عليه' : 'Approved'}
        </div>
      );
    } else if (status === 'rejected') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-700 border border-red-200 shadow-sm">
          <XCircle className="w-3.5 h-3.5" />
          {isArabic ? 'مرفوض' : 'Rejected'}
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
        <Clock className="w-3.5 h-3.5" />
        {isArabic ? 'قيد المراجعة' : 'Pending'}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-300`}>
      {/* Navigation */}
      <Header title={t('requests.title')} showBackButton={true} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Card className={`mb-6 ${colors.cardBg} ${colors.border} border ${colors.shadow} transition-all duration-300`}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className={`text-2xl ${colors.text}`}>{t('requests.title')}</CardTitle>
                <CardDescription className={colors.textSecondary}>{t('requests.description')}</CardDescription>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="gap-2 hover:scale-105 transition-transform shadow-md"
              >
                <Plus className="w-4 h-4" />
                {isArabic ? 'طلب جديد' : 'New Request'}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className={`w-8 h-8 animate-spin ${colors.iconColor} mx-auto`} />
              <p className={`mt-2 ${colors.textSecondary}`}>{t('common.loading')}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !showCreateModal && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Requests List */}
        {!loading && !error && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <Card className={`${colors.cardBg} ${colors.border} border ${colors.shadow} transition-all duration-300`}>
                <CardContent className="p-12 text-center">
                  <div className={`w-16 h-16 ${colors.iconBg} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300`}>
                    <FileText className={`w-8 h-8 ${colors.iconColor}`} />
                  </div>
                  <h3 className={`text-lg font-medium ${colors.text} mb-2`}>
                    {t('requests.noRequests')}
                  </h3>
                  <p className={`${colors.textSecondary} mb-6`}>
                    {t('requests.noRequestsDesc')}
                  </p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="gap-2 hover:scale-105 transition-transform shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    {isArabic ? 'إنشاء طلب' : 'Create Request'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              requests.map((request) => (
                <Card
                  key={request.id}
                  className={`${colors.cardBg} ${colors.border} border ${colors.shadow} transition-all duration-300 hover:scale-[1.01]`}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center transition-colors duration-300`}>
                          <FileText className={`w-5 h-5 ${colors.iconColor}`} />
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold ${colors.text}`}>
                            {request.type || (isArabic ? 'طلب بدون عنوان' : 'Untitled Request')}
                          </h3>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="space-y-3">
                      <div className={`flex items-center gap-2 text-sm ${colors.textSecondary}`}>
                        <Calendar className={`w-4 h-4 ${colors.textMuted}`} />
                        <span className="font-medium">
                          {isArabic ? 'التاريخ:' : 'Date:'}
                        </span>
                        <span>
                          {request.date ? new Date(request.date).toLocaleDateString() : (isArabic ? 'غير متوفر' : 'N/A')}
                        </span>
                      </div>
                      
                      {request.case_number && (
                        <div className={`flex items-center gap-2 text-sm ${colors.textSecondary}`}>
                          <FileText className={`w-4 h-4 ${colors.textMuted}`} />
                          <span className="font-medium">
                            {isArabic ? 'رقم القضية:' : 'Case Number:'}
                          </span>
                          <span>{request.case_number}</span>
                        </div>
                      )}
                      
                      {request.details && (
                        <div className={`mt-4 p-4 ${colors.bg} rounded-lg border ${colors.border} transition-colors duration-300`}>
                          <p className={`text-sm font-medium ${colors.text} mb-2 flex items-center gap-2`}>
                            <User className={`w-4 h-4 ${colors.iconColor}`} />
                            {isArabic ? 'التفاصيل:' : 'Details:'}
                          </p>
                          <p className={`text-sm ${colors.textSecondary} leading-relaxed`}>
                            {request.details}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Statistics */}
        {!loading && requests.length > 0 && (
          <Card className={`mt-6 ${colors.cardBg} ${colors.border} border ${colors.shadow} transition-all duration-300`}>
            <CardHeader>
              <CardTitle className={colors.text}>{t('requests.statistics')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`p-4 ${colors.bg} rounded-lg border ${colors.border} ${colors.bgHover} transition-all duration-200 hover:scale-105`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center transition-colors duration-300`}>
                      <FileText className={`w-5 h-5 ${colors.iconColor}`} />
                    </div>
                    <p className={`text-sm ${colors.textSecondary} font-medium`}>
                      {t('requests.totalRequests')}
                    </p>
                  </div>
                  <p className={`text-2xl font-bold ${colors.text}`}>{requests.length}</p>
                </div>
                <div className={`p-4 ${colors.bg} rounded-lg border ${colors.border} ${colors.bgHover} transition-all duration-200 hover:scale-105`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className={`text-sm ${colors.textSecondary} font-medium`}>
                      {t('requests.pendingRequests')}
                    </p>
                  </div>
                  <p className={`text-2xl font-bold ${colors.text}`}>
                    {requests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <div className={`p-4 ${colors.bg} rounded-lg border ${colors.border} ${colors.bgHover} transition-all duration-200 hover:scale-105`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <p className={`text-sm ${colors.textSecondary} font-medium`}>
                      {t('requests.approvedRequests')}
                    </p>
                  </div>
                  <p className={`text-2xl font-bold ${colors.text}`}>
                    {requests.filter(r => r.status === 'approved').length}
                  </p>
                </div>
                <div className={`p-4 ${colors.bg} rounded-lg border ${colors.border} ${colors.bgHover} transition-all duration-200 hover:scale-105`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <p className={`text-sm ${colors.textSecondary} font-medium`}>
                      {t('requests.rejectedRequests')}
                    </p>
                  </div>
                  <p className={`text-2xl font-bold ${colors.text}`}>
                    {requests.filter(r => r.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <Card className={`max-w-md w-full ${colors.cardBg} ${colors.border} border shadow-2xl animate-in zoom-in-95 duration-200`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className={colors.text}>{t('requests.createRequest')}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError(null);
                  }}
                  className="h-8 w-8 p-0 hover:scale-110 transition-transform"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                      {t('requests.requestType')} *
                    </label>
                    <Select
                      value={formData.request_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, request_type: value }))}
                    >
                      <SelectTrigger className={`${colors.border} ${colors.bgSecondary} ${colors.text}`}>
                        <SelectValue placeholder={isArabic ? 'اختر نوع الطلب...' : 'Select request type...'} />
                      </SelectTrigger>
                      <SelectContent>
                        {requestTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                      {t('requests.requestDetails')} *
                    </label>
                    <textarea
                      name="request_title"
                      value={formData.request_title}
                      onChange={handleInputChange}
                      rows="4"
                      className={`w-full px-3 py-2 border ${colors.border} ${colors.bgSecondary} ${colors.text} rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 resize-none transition-all duration-200`}
                      placeholder={isArabic ? 'أدخل تفاصيل طلبك...' : 'Enter your request details...'}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                      {t('requests.requestDate')}
                    </label>
                    <input
                      type="date"
                      name="request_date"
                      value={formData.request_date}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${colors.border} ${colors.bgSecondary} ${colors.text} rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200`}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false);
                      setError(null);
                    }}
                    className="flex-1 hover:scale-105 transition-transform"
                    disabled={submitting}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 hover:scale-105 transition-transform shadow-md"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        {isArabic ? 'جاري الإرسال...' : 'Submitting...'}
                      </>
                    ) : (
                      t('requests.submit')
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
