import { useNavigate } from '@tanstack/react-router';
import { Building2, UserCog, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-amber-900 dark:text-amber-100 mb-4">ERP Master</h1>
          <p className="text-xl text-amber-700 dark:text-amber-300">Şirket Yönetim Sistemi</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-neutral-800/80 backdrop-blur">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-amber-700 dark:text-amber-300" />
              </div>
              <CardTitle className="text-2xl text-amber-900 dark:text-amber-100">Şirket Girişi</CardTitle>
              <CardDescription className="text-amber-700 dark:text-amber-300">
                Yeni şirket kaydı veya şirket sahibi girişi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate({ to: '/company-login' })}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                size="lg"
              >
                Devam Et
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-orange-200 dark:border-orange-800 bg-white/80 dark:bg-neutral-800/80 backdrop-blur">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <UserCog className="w-8 h-8 text-orange-700 dark:text-orange-300" />
              </div>
              <CardTitle className="text-2xl text-orange-900 dark:text-orange-100">Yetkili Girişi</CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                Şirket yetkilisi girişi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate({ to: '/manager-login' })}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                size="lg"
              >
                Devam Et
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-yellow-200 dark:border-yellow-800 bg-white/80 dark:bg-neutral-800/80 backdrop-blur">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Users className="w-8 h-8 text-yellow-700 dark:text-yellow-300" />
              </div>
              <CardTitle className="text-2xl text-yellow-900 dark:text-yellow-100">Personel Girişi</CardTitle>
              <CardDescription className="text-yellow-700 dark:text-yellow-300">
                Personel girişi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate({ to: '/employee-login' })}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                size="lg"
              >
                Devam Et
              </Button>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-16 text-center text-sm text-amber-700 dark:text-amber-400">
          <p>
            © {new Date().getFullYear()} Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-900 dark:hover:text-amber-200"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
