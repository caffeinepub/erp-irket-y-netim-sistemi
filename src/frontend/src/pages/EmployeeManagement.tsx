import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile, usePersonnelList, useGenerateInviteCode } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Copy, Check } from 'lucide-react';
import { CompanyRole } from '../backend';
import RoleBadge from '../components/RoleBadge';

export default function EmployeeManagement() {
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: personnel = [], isLoading: personnelLoading } = usePersonnelList();
  const generateInvite = useGenerateInviteCode();
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const employees = personnel.filter((p) => {
    return userProfile?.role === CompanyRole.Manager || userProfile?.role === CompanyRole.Owner;
  });

  const handleGenerateInvite = async () => {
    try {
      const duration = BigInt(7 * 24 * 60 * 60 * 1000000000);
      const code = await generateInvite.mutateAsync({ role: CompanyRole.Employee, duration });
      setInviteCode(code);
    } catch (error: any) {
      alert(error.message || 'Davet kodu oluşturulamadı');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (profileLoading || personnelLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
      </div>
    );
  }

  if (!userProfile || (userProfile.role !== CompanyRole.Manager && userProfile.role !== CompanyRole.Owner)) {
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate({ to: '/manager' })} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
          <h1 className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-2">Personel Listesi</h1>
          <p className="text-orange-700 dark:text-orange-300">Personelleri yönetin ve davet kodu oluşturun</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Personel Davet Et
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Personel Davet Kodu Oluştur</DialogTitle>
              <DialogDescription>
                Yeni personel eklemek için davet kodu oluşturun. Kod 7 gün geçerlidir.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {!inviteCode ? (
                <Button onClick={handleGenerateInvite} disabled={generateInvite.isPending} className="w-full">
                  {generateInvite.isPending ? 'Oluşturuluyor...' : 'Davet Kodu Oluştur'}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Label>Davet Kodu</Label>
                  <div className="flex gap-2">
                    <Input value={inviteCode} readOnly />
                    <Button onClick={handleCopyCode} variant="outline" size="icon">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Bu kodu yeni personel ile paylaşın. Personel Giriş ekranından kullanabilir.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personel Listesi</CardTitle>
          <CardDescription>Şirketinizdeki tüm personelleri görüntüleyin</CardDescription>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
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
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.adSoyad}</TableCell>
                    <TableCell>
                      <RoleBadge role={CompanyRole.Employee} />
                    </TableCell>
                    <TableCell>
                      <span className={employee.aktifMi ? 'text-green-600' : 'text-red-600'}>
                        {employee.aktifMi ? 'Aktif' : 'Pasif'}
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
