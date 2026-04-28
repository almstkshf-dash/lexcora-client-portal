'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';

// shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  
  const { login, loading, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { isArabic, direction } = useLanguage();
  const router = useRouter();
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('expired') === 'true') {
        setSessionExpired(true);
      }
    }
  }, []);

  // Load saved credentials on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedUsername && savedPassword) {
      setFormData({
        username: savedUsername,
        password: savedPassword
      });
      setRememberMe(true);
    }
  }, []);

  // Redirect to home if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = t('auth.usernameRequired');
    }
    
    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (formData.password.length < 3) {
      newErrors.password = t('auth.passwordMinLength');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', formData.username);
          localStorage.setItem('rememberedPassword', formData.password);
        } else {
          localStorage.removeItem('rememberedUsername');
          localStorage.removeItem('rememberedPassword');
        }
      } else {
        setError(t('auth.invalidCredentials'));
      }
    } catch (err) {
      setError(t('auth.invalidCredentials'));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Don't show login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen py-8 px-4 bg-cover bg-center bg-no-repeat bg-fixed w-full" style={{ backgroundImage: "url('/background.jpg')", backgroundSize: 'cover' }} dir={direction}>
      <div className="w-full max-w-md mx-auto">
        {/* Login Card */}
        <Card className="shadow-lg bg-white/10 backdrop-blur-sm">
          <CardHeader className="flex items-center flex-col">
            <div className="mx-auto">
              <Image height='60' width='60' src="/log_in_card_logo.png" alt={t('auth.logoAlt')} className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-white text-center mb-1">
              LEXCORA
            </h1>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {sessionExpired && !error && (
                  <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                    <AlertDescription>
                      {t('auth.sessionExpired')}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-white">
                    {t('auth.username')}
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder={t('auth.username')}
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`h-11 text-white placeholder:text-white/70 ${errors.username ? 'border-red-500' : ''}`}
                    disabled={loading}
                    dir="rtl"
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-white">
                    {t('auth.password')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.password')}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`h-11 pl-10 text-white placeholder:text-white/70 ${errors.password ? 'border-red-500' : ''}`}
                      disabled={loading}
                      dir="rtl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                      disabled={loading}
                      tabIndex={-1}
                      aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="rememberMe" 
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <Label 
                    htmlFor="rememberMe" 
                    className="text-sm mx-2 text-white cursor-pointer select-none"
                  >
                    {t('auth.rememberMe')}
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('auth.loggingIn')}
                    </>
                  ) : (
                    t('auth.loginButton')
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-1">
            <p className="text-white text-xs font-medium">
              {t('auth.supportInfo')}
            </p>
            <p className="text-white text-xs">
              {t('auth.supportContact')}
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
