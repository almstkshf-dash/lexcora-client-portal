"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { getClientRequests, createClientRequest } from '../services/api/requests';

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
    // Status can be: 'approved', 'pending', 'rejected'
    if (status === 'approved') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {isArabic ? 'موافق عليه' : 'Approved'}
        </span>
      );
    } else if (status === 'rejected') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {isArabic ? 'مرفوض' : 'Rejected'}
        </span>
      );
    }
    // Default: pending
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        {isArabic ? 'قيد المراجعة' : 'Pending'}
      </span>
    );
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
              <h2 className="text-2xl font-bold text-gray-900">{t('requests.title')}</h2>
              <p className="text-gray-600 mt-1">{t('requests.description')}</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {isArabic ? '+ طلب جديد' : '+ New Request'}
            </button>
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
        {error && !showCreateModal && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Requests List */}
        {!loading && !error && (
          <div className="space-y-4">
            {requests.length === 0 ? (
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
                  {t('requests.noRequests')}
                </h3>
                <p className="mt-1 text-gray-500">
                  {t('requests.noRequestsDesc')}
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {isArabic ? 'إنشاء طلب' : 'Create Request'}
                </button>
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.type || (isArabic ? 'طلب بدون عنوان' : 'Untitled Request')}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">
                            {isArabic ? 'التاريخ:' : 'Date:'}
                          </span>{' '}
                          {request.date ? new Date(request.date).toLocaleDateString() : (isArabic ? 'غير متوفر' : 'N/A')}
                        </p>
                        
                        {request.case_number && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">
                              {isArabic ? 'رقم القضية:' : 'Case Number:'}
                            </span>{' '}
                            {request.case_number}
                          </p>
                        )}
                        
                        {request.details && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {isArabic ? 'التفاصيل:' : 'Details:'}
                            </p>
                            <p className="text-sm text-gray-700">
                              {request.details}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Statistics */}
        {!loading && requests.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('requests.statistics')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">
                  {t('requests.totalRequests')}
                </p>
                <p className="text-2xl font-bold text-blue-900">{requests.length}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600 font-medium">
                  {t('requests.pendingRequests')}
                </p>
                <p className="text-2xl font-bold text-yellow-900">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">
                  {t('requests.approvedRequests')}
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {requests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600 font-medium">
                  {t('requests.rejectedRequests')}
                </p>
                <p className="text-2xl font-bold text-red-900">
                  {requests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {t('requests.createRequest')}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('requests.requestType')} *
                  </label>
                  <select
                    name="request_type"
                    value={formData.request_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  >
                    <option value="">
                      {isArabic ? 'اختر نوع الطلب...' : 'Select request type...'}
                    </option>
                    {requestTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('requests.requestDetails')} *
                  </label>
                  <textarea
                    name="request_title"
                    value={formData.request_title}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder={isArabic ? 'أدخل تفاصيل طلبك...' : 'Enter your request details...'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('requests.requestDate')}
                  </label>
                  <input
                    type="date"
                    name="request_date"
                    value={formData.request_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? (isArabic ? 'جاري الإرسال...' : 'Submitting...') : t('requests.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
