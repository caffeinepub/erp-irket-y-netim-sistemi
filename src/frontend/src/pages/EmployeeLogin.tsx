import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useInviteCode } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users } from 'lucide-react';
import { CompanyRole } from '../backend';

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [inviteCode, setInviteCode] = useState('');
  const [userName, setUserName] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const useInviteMutation = useInviteCode();

  useEffect(() => {
    if (identity && isFetched && userProfile) {
      if (userProfile.role === CompanyRole.Employee) {
        navigate({ to: '/employee' });
      } else {
        setError('Bu hesap personel değil. Lütfen doğru giriş ekranını kullanın.');
      }
    }
  }, [identity, userProfile, isFetched, navigate]);

  useEffect(() => {
    if (identity && isFetched && userProfile === null) {
      setShowInviteForm(true);
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

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim() || !userName.trim()) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      setError(null);
      await useInviteMutation.mutateAsync({ code: inviteCode, userName });
      navigate({ to: '/employee' });
    } catch (err: any) {
      console.error('Invite code error:', err);
      setError(err.message || 'Davet kodu kullanılamadı. Lütfen geçerli bir kod girin.');
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/' })}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri
            </Button>
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
              <Users className="w-8 h-8 text-yellow-700 dark:text-yellow-300" />
            </div>
            <CardTitle className="text-2xl text-yellow-900 dark:text-yellow-100">Personel Girişi</CardTitle>
            <CardDescription className="text-yellow-700 dark:text-yellow-300">
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
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-700 mx-auto mb-4"></div>
          <p className="text-yellow-700 dark:text-yellow-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (showInviteForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/' })}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri
            </Button>
            <CardTitle className="text-2xl text-yellow-900 dark:text-yellow-100">Davet Kodu Girişi</CardTitle>
            <CardDescription className="text-yellow-700 dark:text-yellow-300">
              Personel olarak kayıt olmak için davet kodunuzu girin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}
              <div>
                <Label htmlFor="userName">Adınız Soyadınız</Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ad Soyad"
                  required
                />
              </div>
              <div>
                <Label htmlFor="inviteCode">Davet Kodu</Label>
                <Input
                  id="inviteCode"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Davet kodunu girin"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={useInviteMutation.isPending}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {useInviteMutation.isPending ? 'Kaydediliyor...' : 'Kayıt Ol'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
