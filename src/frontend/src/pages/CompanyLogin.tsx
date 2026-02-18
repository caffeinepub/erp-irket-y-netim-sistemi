import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Building2 } from 'lucide-react';
import CompanyRegistrationForm from '../components/CompanyRegistrationForm';
import { CompanyRole } from '../backend';

export default function CompanyLogin() {
  const navigate = useNavigate();
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [showRegistration, setShowRegistration] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (identity && isFetched && userProfile) {
      if (userProfile.role === CompanyRole.Owner) {
        navigate({ to: '/owner' });
      } else {
        setError('Bu hesap şirket sahibi değil. Lütfen doğru giriş ekranını kullanın.');
      }
    }
  }, [identity, userProfile, isFetched, navigate]);

  useEffect(() => {
    if (identity && isFetched && userProfile === null) {
      setShowRegistration(true);
    }
  }, [identity, isFetched, userProfile]);

  const handleLogin = async () => {
    try {
      setError(null);
      await login();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-amber-200 dark:border-amber-800">
          <CardHeader className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/' })}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri
            </Button>
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-amber-700 dark:text-amber-300" />
            </div>
            <CardTitle className="text-2xl text-amber-900 dark:text-amber-100">Şirket Girişi</CardTitle>
            <CardDescription className="text-amber-700 dark:text-amber-300">
              Internet Identity ile giriş yapın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
            <Button
              onClick={handleLogin}
              disabled={loginStatus === 'logging-in'}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              size="lg"
            >
              {loginStatus === 'logging-in' ? 'Giriş yapılıyor...' : 'Internet Identity ile Giriş Yap'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
          <p className="text-amber-700 dark:text-amber-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (showRegistration) {
    return <CompanyRegistrationForm />;
  }

  return null;
}
