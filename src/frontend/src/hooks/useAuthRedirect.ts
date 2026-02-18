import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from './useQueries';
import { useInternetIdentity } from './useInternetIdentity';
import { CompanyRole } from '../backend';

export function useAuthRedirect() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!identity || isLoading || !isFetched) return;

    if (userProfile) {
      switch (userProfile.role) {
        case CompanyRole.Owner:
          navigate({ to: '/owner' });
          break;
        case CompanyRole.Manager:
          navigate({ to: '/manager' });
          break;
        case CompanyRole.Employee:
          navigate({ to: '/employee' });
          break;
      }
    }
  }, [identity, userProfile, isLoading, isFetched, navigate]);

  return { userProfile, isLoading, isFetched };
}
