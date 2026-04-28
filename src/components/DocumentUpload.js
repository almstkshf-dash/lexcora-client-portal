"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { uploadDocument, getClientCases } from '../app/services/api/cases';
import { Upload, X, File, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DocumentUpload({ onUploadSuccess }) {
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const [file, setFile] = useState(null);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await getClientCases();
      if (response.success) {
        setCases(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching cases for upload:', err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError(t('documents.selectFileFirst'));
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      if (selectedCase && selectedCase !== "none") {
        formData.append('case_id', selectedCase);
      }
      formData.append('document_name', file.name);

      const response = await uploadDocument(formData);

      if (response.success) {
        setSuccess(true);
        setFile(null);
        setSelectedCase("");
        if (onUploadSuccess) onUploadSuccess();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || t('documents.errorMessage'));
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || t('documents.errorMessage'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gray-50/50 border-b border-gray-100">
        <CardTitle className="text-xl flex items-center gap-2">
          <Upload className="w-5 h-5 text-gray-700" />
          {t('documents.uploadTitle')}
        </CardTitle>
        <CardDescription>
          {t('documents.uploadDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* File Selection */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">
              {t('documents.selectFile')}
            </Label>
            {!file ? (
              <div 
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/30 hover:bg-gray-50/50 hover:border-gray-300 transition-all cursor-pointer"
                onClick={() => document.getElementById('file-upload').click()}
              >
                <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  {t('documents.clickToSelect')}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {t('documents.maxSize')}
                </p>
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <File className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Case Selection (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="case-select">
              {t('documents.relatedCase')}
            </Label>
            <Select value={selectedCase} onValueChange={setSelectedCase}>
              <SelectTrigger id="case-select" className="bg-white rounded-xl h-11 border-gray-200">
                <SelectValue placeholder={t('documents.selectCase')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('documents.noSpecificCase')}</SelectItem>
                {cases.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.case_number} - {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Feedback Messages */}
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-800 rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-100 text-green-800 rounded-xl">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                {t('documents.successMessage')}
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Button */}
          <Button 
            onClick={handleUpload} 
            disabled={!file || uploading}
            className="w-full h-12 rounded-xl text-md font-semibold gap-2 shadow-md hover:shadow-lg transition-all"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('documents.uploading')}
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                {t('documents.uploadButton')}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
