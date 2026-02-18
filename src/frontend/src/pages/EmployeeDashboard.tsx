import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, Bell, BarChart3 } from 'lucide-react';
import { CompanyRole } from '../backend';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-700"></div>
      </div>
    );
  }

  if (!userProfile || userProfile.role !== CompanyRole.Employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Yetkisiz Erişim</CardTitle>
            <CardDescription>Bu sayfaya erişim yetkiniz yok</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/' })}>Ana Sayfaya Dön</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">Hoş Geldiniz, {userProfile.name}</h1>
        <p className="text-yellow-700 dark:text-yellow-300">Personel Paneli</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userProfile.permissions.taskView && (
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-amber-200 dark:border-amber-800" onClick={() => navigate({ to: '/tasks' })}>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-4">
                <CheckSquare className="w-6 h-6 text-amber-700 dark:text-amber-300" />
              </div>
              <CardTitle className="text-amber-900 dark:text-amber-100">Görevler</CardTitle>
              <CardDescription className="text-amber-700 dark:text-amber-300">
                Görevlerinizi görüntüleyin
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {userProfile.permissions.announcementView && (
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-yellow-200 dark:border-yellow-800" onClick={() => navigate({ to: '/announcements' })}>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-yellow-700 dark:text-yellow-300" />
              </div>
              <CardTitle className="text-yellow-900 dark:text-yellow-100">Duyurular</CardTitle>
              <CardDescription className="text-yellow-700 dark:text-yellow-300">
                Duyuruları görüntüleyin
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {userProfile.permissions.reportView && (
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-orange-200 dark:border-orange-800" onClick={() => navigate({ to: '/reports' })}>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-orange-700 dark:text-orange-300" />
              </div>
              <CardTitle className="text-orange-900 dark:text-orange-100">Raporlar</CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                Raporları görüntüleyin
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {!userProfile.permissions.taskView && !userProfile.permissions.announcementView && !userProfile.permissions.reportView && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Henüz Yetkiniz Yok</CardTitle>
              <CardDescription>
                Yöneticiniz size henüz modül erişimi vermemiş. Lütfen yöneticinizle iletişime geçin.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
