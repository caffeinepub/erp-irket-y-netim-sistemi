import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useRegisterCompany, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2 } from 'lucide-react';
import { CompanyRole } from '../backend';

export default function CompanyRegistrationForm() {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const registerCompany = useRegisterCompany();
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId.trim() || !companyName.trim() || !ownerName.trim()) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      await registerCompany.mutateAsync({ companyId, companyName });
      
      await saveProfile.mutateAsync({
        name: ownerName,
        companyId,
        role: CompanyRole.Owner,
        permissions: {
          personnelView: true,
          personnelAdd: true,
          personnelEdit: true,
          personnelDelete: true,
          taskView: true,
          taskAdd: true,
          taskEdit: true,
          taskDelete: true,
          announcementView: true,
          announcementAdd: true,
          announcementEdit: true,
          announcementDelete: true,
          reportView: true,
        },
        active: true,
      });

      navigate({ to: '/owner' });
    } catch (error: any) {
      alert(error.message || 'Şirket kaydı başarısız oldu');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-amber-200 dark:border-amber-800">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-amber-700 dark:text-amber-300" />
          </div>
          <CardTitle className="text-2xl text-amber-900 dark:text-amber-100">Şirket Kaydı</CardTitle>
          <CardDescription className="text-amber-700 dark:text-amber-300">
            Yeni şirketinizi kaydedin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="ownerName">Adınız Soyadınız</Label>
              <Input
                id="ownerName"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Ad Soyad"
                required
              />
            </div>
            <div>
              <Label htmlFor="companyId">Şirket ID</Label>
              <Input
                id="companyId"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                placeholder="Benzersiz şirket ID"
                required
              />
            </div>
            <div>
              <Label htmlFor="companyName">Şirket Adı</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Şirket adı"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={registerCompany.isPending || saveProfile.isPending}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              {registerCompany.isPending || saveProfile.isPending ? 'Kaydediliyor...' : 'Şirketi Kaydet'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
