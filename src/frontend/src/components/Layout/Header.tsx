import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Building2, LogOut } from 'lucide-react';
import RoleBadge from '../RoleBadge';

export default function Header() {
  const navigate = useNavigate();
  const { clear, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  if (!identity) return null;

  return (
    <header className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur border-b border-amber-200 dark:border-amber-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-amber-700 dark:text-amber-300" />
            <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100">ERP Master</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {userProfile && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium text-amber-900 dark:text-amber-100">{userProfile.name}</p>
                <RoleBadge role={userProfile.role} />
              </div>
            </div>
          )}
          <Button onClick={handleLogout} variant="outline" className="border-amber-300 dark:border-amber-700">
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış
          </Button>
        </div>
      </div>
    </header>
  );
}
