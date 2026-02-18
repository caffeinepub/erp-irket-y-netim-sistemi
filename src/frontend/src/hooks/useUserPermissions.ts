import { useGetCallerUserProfile } from './useQueries';
import type { ModulePermissions } from '../backend';

export function useUserPermissions() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  const permissions: ModulePermissions | null = userProfile?.permissions || null;

  return {
    permissions,
    isLoading,
    hasPersonnelView: permissions?.personnelView || false,
    hasPersonnelAdd: permissions?.personnelAdd || false,
    hasPersonnelEdit: permissions?.personnelEdit || false,
    hasPersonnelDelete: permissions?.personnelDelete || false,
    hasTaskView: permissions?.taskView || false,
    hasTaskAdd: permissions?.taskAdd || false,
    hasTaskEdit: permissions?.taskEdit || false,
    hasTaskDelete: permissions?.taskDelete || false,
    hasAnnouncementView: permissions?.announcementView || false,
    hasAnnouncementAdd: permissions?.announcementAdd || false,
    hasAnnouncementEdit: permissions?.announcementEdit || false,
    hasAnnouncementDelete: permissions?.announcementDelete || false,
    hasReportView: permissions?.reportView || false,
  };
}
