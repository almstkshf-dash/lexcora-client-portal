"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
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

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium    ">
          <CheckCircle className="w-3.5 h-3.5" />
          {isArabic ? 'موافق عليه' : 'Approved'}
        </div>
      );
    } else if (status === 'rejected') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium   ">
          <XCircle className="w-3.5 h-3.5" />
          {isArabic ? 'مرفوض' : 'Rejected'}
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium  text-gray-900 border ">
        <Clock className="w-3.5 h-3.5" />
        {isArabic ? 'قيد المراجعة' : 'Pending'}
      </div>
    );
  };

  return (
    <div className="min-h-screen ">
      {/* Navigation */}
      <Header title={t('requests.title')} showBackButton={true} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Card className="mb-6 ">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">{t('requests.title')}</CardTitle>
                <CardDescription>{t('requests.description')}</CardDescription>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="gap-2  "
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
              <Loader2 className="w-8 h-8 animate-spin  mx-auto" />
              <p className="mt-2 ">{t('common.loading')}</p>
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
              <Card className="border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 " />
                  </div>
                  <h3 className="text-lg font-medium  mb-2">
                    {t('requests.noRequests')}
                  </h3>
                  <p className=" mb-6">
                    {t('requests.noRequestsDesc')}
                  </p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="gap-2 "
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
                  className=" transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 " />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold ">
                            {request.type || (isArabic ? 'طلب بدون عنوان' : 'Untitled Request')}
                          </h3>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm ">
                        <Calendar className="w-4 h-4 " />
                        <span className="font-medium">
                          {isArabic ? 'التاريخ:' : 'Date:'}
                        </span>
                        <span>
                          {request.date ? new Date(request.date).toLocaleDateString() : (isArabic ? 'غير متوفر' : 'N/A')}
                        </span>
                      </div>
                      
                      {request.case_number && (
                        <div className="flex items-center gap-2 text-sm ">
                          <FileText className="w-4 h-4 " />
                          <span className="font-medium">
                            {isArabic ? 'رقم القضية:' : 'Case Number:'}
                          </span>
                          <span>{request.case_number}</span>
                        </div>
                      )}
                      
                      {request.details && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border ">
                          <p className="text-sm font-medium  mb-2 flex items-center gap-2">
                            <User className="w-4 h-4 " />
                            {isArabic ? 'التفاصيل:' : 'Details:'}
                          </p>
                          <p className="text-sm  leading-relaxed">
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
          <Card className="mt-6 border-gray-200">
            <CardHeader>
              <CardTitle>{t('requests.statistics')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border ">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 " />
                    </div>
                    <p className="text-sm  font-medium">
                      {t('requests.totalRequests')}
                    </p>
                  </div>
                  <p className="text-2xl font-bold ">{requests.length}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 " />
                    </div>
                    <p className="text-sm  font-medium">
                      {t('requests.pendingRequests')}
                    </p>
                  </div>
                  <p className="text-2xl font-bold ">
                    {requests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 " />
                    </div>
                    <p className="text-sm  font-medium">
                      {t('requests.approvedRequests')}
                    </p>
                  </div>
                  <p className="text-2xl font-bold ">
                    {requests.filter(r => r.status === 'approved').length}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border ">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <XCircle className="w-5 h-5 " />
                    </div>
                    <p className="text-sm  font-medium">
                      {t('requests.rejectedRequests')}
                    </p>
                  </div>
                  <p className="text-2xl font-bold ">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full border-gray-200">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t('requests.createRequest')}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError(null);
                  }}
                  className="h-8 w-8 p-0"
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
                    <label className="block text-sm font-medium  mb-2">
                      {t('requests.requestType')} *
                    </label>
                    <Select
                      value={formData.request_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, request_type: value }))}
                    >
                      <SelectTrigger>
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
                    <label className="block text-sm font-medium  mb-2">
                      {t('requests.requestDetails')} *
                    </label>
                    <textarea
                      name="request_title"
                      value={formData.request_title}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white resize-none"
                      placeholder={isArabic ? 'أدخل تفاصيل طلبك...' : 'Enter your request details...'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium  mb-2">
                      {t('requests.requestDate')}
                    </label>
                    <input
                      type="date"
                      name="request_date"
                      value={formData.request_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2  rounded-lg "
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
                    className="flex-1"
                    disabled={submitting}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 "
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
