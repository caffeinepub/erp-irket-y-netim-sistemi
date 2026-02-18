import { Badge } from '@/components/ui/badge';
import { Durum } from '../backend';

interface StatusBadgeProps {
  status: Durum;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusText = () => {
    switch (status) {
      case Durum.beklemede:
        return 'Bekliyor';
      case Durum.devamEdiyor:
        return 'Devam Ediyor';
      case Durum.tamamlandi:
        return 'Tamamlandı';
      default:
        return 'Bilinmeyen';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case Durum.beklemede:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case Durum.devamEdiyor:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case Durum.tamamlandi:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return <Badge className={getStatusColor()}>{getStatusText()}</Badge>;
}
