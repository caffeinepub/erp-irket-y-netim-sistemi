import { Badge } from '@/components/ui/badge';
import { CompanyRole } from '../backend';

interface RoleBadgeProps {
  role: CompanyRole;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const getRoleText = () => {
    switch (role) {
      case CompanyRole.Owner:
        return 'Sahip';
      case CompanyRole.Manager:
        return 'Yetkili';
      case CompanyRole.Employee:
        return 'Personel';
      default:
        return 'Bilinmeyen';
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case CompanyRole.Owner:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case CompanyRole.Manager:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case CompanyRole.Employee:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return <Badge className={getRoleColor()}>{getRoleText()}</Badge>;
}
