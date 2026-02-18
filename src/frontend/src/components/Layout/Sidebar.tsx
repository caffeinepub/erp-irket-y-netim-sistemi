import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Home, UserCog, Users, CheckSquare, Bell, BarChart3, Building2 } from 'lucide-react';
import { CompanyRole } from '../../backend';

export default function Sidebar() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  if (!userProfile) return null;

  const isActive = (path: string) => currentPath === path;

  return (
    <aside className="w-64 bg-white/60 dark:bg-neutral-800/60 backdrop-blur border-r border-amber-200 dark:border-amber-800 min-h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-2">
        {userProfile.role === CompanyRole.Owner && (
          <>
            <Button
              variant={isActive('/owner') ? 'default' : 'ghost'}
              className={`w-full justify-start ${isActive('/owner') ? 'bg-amber-600 text-white' : ''}`}
              onClick={() => navigate({ to: '/owner' })}
            >
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfa
            </Button>
            <Button
              variant={isActive('/owner/managers') ? 'default' : 'ghost'}
              className={`w-full justify-start ${isActive('/owner/managers') ? 'bg-amber-600 text-white' : ''}`}
              onClick={() => navigate({ to: '/owner/managers' })}
            >
              <UserCog className="w-4 h-4 mr-2" />
              Şirket Yetkilileri
            </Button>
            <Button
              variant={isActive('/personnel') ? 'default' : 'ghost'}
              className={`w-full justify-start ${isActive('/personnel') ? 'bg-amber-600 text-white' : ''}`}
              onClick={() => navigate({ to: '/personnel' })}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Tüm Personel
            </Button>
            <Button
              variant={isActive('/reports') ? 'default' : 'ghost'}
              className={`w-full justify-start ${isActive('/reports') ? 'bg-amber-600 text-white' : ''}`}
              onClick={() => navigate({ to: '/reports' })}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Raporlar
            </Button>
          </>
        )}

        {userProfile.role === CompanyRole.Manager && (
          <>
            <Button
              variant={isActive('/manager') ? 'default' : 'ghost'}
              className={`w-full justify-start ${isActive('/manager') ? 'bg-orange-600 text-white' : ''}`}
              onClick={() => navigate({ to: '/manager' })}
            >
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfa
            </Button>
            <Button
              variant={isActive('/manager/employees') ? 'default' : 'ghost'}
              className={`w-full justify-start ${isActive('/manager/employees') ? 'bg-orange-600 text-white' : ''}`}
              onClick={() => navigate({ to: '/manager/employees' })}
            >
              <Users className="w-4 h-4 mr-2" />
              Personel Listesi
            </Button>
            {userProfile.permissions.taskView && (
              <Button
                variant={isActive('/tasks') ? 'default' : 'ghost'}
                className={`w-full justify-start ${isActive('/tasks') ? 'bg-orange-600 text-white' : ''}`}
                onClick={() => navigate({ to: '/tasks' })}
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Görevler
              </Button>
            )}
            {userProfile.permissions.announcementView && (
              <Button
                variant={isActive('/announcements') ? 'default' : 'ghost'}
                className={`w-full justify-start ${isActive('/announcements') ? 'bg-orange-600 text-white' : ''}`}
                onClick={() => navigate({ to: '/announcements' })}
              >
                <Bell className="w-4 h-4 mr-2" />
                Duyurular
              </Button>
            )}
            {userProfile.permissions.reportView && (
              <Button
                variant={isActive('/reports') ? 'default' : 'ghost'}
                className={`w-full justify-start ${isActive('/reports') ? 'bg-orange-600 text-white' : ''}`}
                onClick={() => navigate({ to: '/reports' })}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Raporlar
              </Button>
            )}
          </>
        )}

        {userProfile.role === CompanyRole.Employee && (
          <>
            <Button
              variant={isActive('/employee') ? 'default' : 'ghost'}
              className={`w-full justify-start ${isActive('/employee') ? 'bg-yellow-600 text-white' : ''}`}
              onClick={() => navigate({ to: '/employee' })}
            >
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfa
            </Button>
            {userProfile.permissions.taskView && (
              <Button
                variant={isActive('/tasks') ? 'default' : 'ghost'}
                className={`w-full justify-start ${isActive('/tasks') ? 'bg-yellow-600 text-white' : ''}`}
                onClick={() => navigate({ to: '/tasks' })}
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Görevler
              </Button>
            )}
            {userProfile.permissions.announcementView && (
              <Button
                variant={isActive('/announcements') ? 'default' : 'ghost'}
                className={`w-full justify-start ${isActive('/announcements') ? 'bg-yellow-600 text-white' : ''}`}
                onClick={() => navigate({ to: '/announcements' })}
              >
                <Bell className="w-4 h-4 mr-2" />
                Duyurular
              </Button>
            )}
            {userProfile.permissions.reportView && (
              <Button
                variant={isActive('/reports') ? 'default' : 'ghost'}
                className={`w-full justify-start ${isActive('/reports') ? 'bg-yellow-600 text-white' : ''}`}
                onClick={() => navigate({ to: '/reports' })}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Raporlar
              </Button>
            )}
          </>
        )}
      </nav>
    </aside>
  );
}
