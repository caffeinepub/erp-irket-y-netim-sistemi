import { ReactNode } from 'react';

interface PermissionGateProps {
  hasPermission: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PermissionGate({ hasPermission, children, fallback = null }: PermissionGateProps) {
  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
