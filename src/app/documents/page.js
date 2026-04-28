"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header';
import { getClientDocuments } from '../services/api/cases';
import { ArrowLeft, FileText, Download, User, Loader2, File } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DocumentUpload from '../../components/DocumentUpload';

export default function DocumentsPage() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClientDocuments();
  }, []);

  const fetchClientDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getClientDocuments();
      
      if (response.success) {
        setDocuments(response.data || []);
      } else {
        setError(response.message || t('documents.errorLoadingDocuments'));
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.response?.data?.message || t('documents.errorLoadingDocuments'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (documentUrl, documentName) => {
    // Open document in new tab or trigger download
    window.open(documentUrl, '_blank');
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return <File className="w-8 h-8 text-gray-700" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-8 h-8 text-gray-700" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <File className="w-8 h-8 text-gray-700" />;
      default:
        return <File className="w-8 h-8 text-gray-700" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <Header title={t('documents.title')} showBackButton={true} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="w-6 h-6 text-gray-700" />
                  {t('documents.title')}
                </CardTitle>
                <CardDescription className="mt-2">
                  {t('documents.description')}
                </CardDescription>
              </div>
              <div className="text-right bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 flex items-center gap-1 justify-end">
                  <User className="w-3 h-3" />
                  {t('home.username')}
                </p>
                <p className="font-semibold text-gray-900 mt-1">{user?.name || user?.username}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="border-0 shadow-lg">
            <CardContent className="flex flex-col justify-center items-center py-12">
              <Loader2 className="w-12 h-12 text-gray-600 animate-spin" />
              <p className="mt-4 text-gray-600">{t('common.loading')}</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Upload Section */}
        <div className="mb-8">
          <DocumentUpload onUploadSuccess={fetchClientDocuments} />
        </div>

        {/* Documents List */}
        {!loading && !error && (
          <div className="space-y-4">
            {documents.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-12 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('documents.noDocuments')}
                  </h3>
                  <p className="text-gray-500">
                    {t('documents.noDocumentsDesc')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <Card
                    key={doc.id}
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                          {getFileIcon(doc.document_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 break-words line-clamp-2 mb-1">
                            {doc.document_name || t('documents.untitledDocument')}
                          </h3>
                          {doc.uploaded_by_name && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                              <User className="w-3 h-3" />
                              <span>
                                {t('documents.uploadedBy')} {doc.uploaded_by_name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownload(doc.document_url, doc.document_name)}
                        className="w-full gap-2"
                        variant="default"
                      >
                        <Download className="w-4 h-4" />
                        {t('documents.viewButton')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Statistics */}
        {!loading && documents.length > 0 && (
          <Card className="mt-6 border-0 shadow-lg ">
            <CardHeader>
              <CardTitle className="text-lg">
                {t('documents.statistics')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4  rounded-lg shadow-sm">
                <div className="p-3  rounded-full">
                  <FileText className="w-8 h-8 " />
                </div>
                <div>
                  <p className="text-sm  font-medium">
                    {t('documents.totalDocuments')}
                  </p>
                  <p className="text-3xl font-bold ">{documents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
