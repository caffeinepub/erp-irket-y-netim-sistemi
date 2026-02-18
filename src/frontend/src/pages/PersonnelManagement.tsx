import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile, usePersonnelList } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import RoleBadge from '../components/RoleBadge';
import { CompanyRole } from '../backend';

export default function PersonnelManagement() {
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: personnel = [], isLoading: personnelLoading } = usePersonnelList();

  if (profileLoading || personnelLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (!userProfile || !userProfile.permissions.personnelView) {
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate({ to: userProfile.role === CompanyRole.Owner ? '/owner' : '/manager' })} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri
        </Button>
        <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-2">Personel Yönetimi</h1>
        <p className="text-amber-700 dark:text-amber-300">Tüm personeli görüntüleyin</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personel Listesi</CardTitle>
          <CardDescription>Şirketinizdeki tüm personeller</CardDescription>
        </CardHeader>
        <CardContent>
          {personnel.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Henüz personel eklenmemiş</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad Soyad</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personnel.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">{person.adSoyad}</TableCell>
                    <TableCell>
                      <RoleBadge role={person.rol === 'yonetici' ? CompanyRole.Manager : CompanyRole.Employee} />
                    </TableCell>
                    <TableCell>
                      <span className={person.aktifMi ? 'text-green-600' : 'text-red-600'}>
                        {person.aktifMi ? 'Aktif' : 'Pasif'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
