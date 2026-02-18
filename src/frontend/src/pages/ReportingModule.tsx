import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile, useReport } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { CompanyRole } from '../backend';

export default function ReportingModule() {
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const [activeTab, setActiveTab] = useState('personnel');
  const { data: personnelReport } = useReport('personel_aktivite');
  const { data: taskReport } = useReport('gorev_tamamlanma');
  const { data: performanceReport } = useReport('yetkili_performans');

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
      </div>
    );
  }

  if (!userProfile || !userProfile.permissions.reportView) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Yetkisiz Erişim</CardTitle>
            <CardDescription>Bu modülü görüntüleme yetkiniz yok</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/' })}>Ana Sayfaya Dön</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const backRoute = userProfile.role === CompanyRole.Owner ? '/owner' : userProfile.role === CompanyRole.Manager ? '/manager' : '/employee';

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate({ to: backRoute })} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri
        </Button>
        <h1 className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-2">Raporlama</h1>
        <p className="text-orange-700 dark:text-orange-300">Şirket raporlarını görüntüleyin</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personnel">Personel Aktivite</TabsTrigger>
          <TabsTrigger value="tasks">Görev Tamamlanma</TabsTrigger>
          <TabsTrigger value="performance">Yetkili Performans</TabsTrigger>
        </TabsList>

        <TabsContent value="personnel">
          <Card>
            <CardHeader>
              <CardTitle>Personel Aktivite Raporu</CardTitle>
              <CardDescription>Personel aktivitelerini ve sistem kullanımını görüntüleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{personnelReport || 'Rapor yükleniyor...'}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Görev Tamamlanma Raporu</CardTitle>
              <CardDescription>Görev tamamlanma istatistiklerini görüntüleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{taskReport || 'Rapor yükleniyor...'}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Yetkili Performans Özeti</CardTitle>
              <CardDescription>Yetkili bazlı performans metriklerini görüntüleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{performanceReport || 'Rapor yükleniyor...'}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
