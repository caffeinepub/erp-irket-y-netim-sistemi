import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, CompanyRole, Bilgi, Bilgi__1, Bilgi__2, Durum, Rol, Yetki } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useRegisterCompany() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ companyId, companyName }: { companyId: string; companyName: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.kurumKaydet(companyId, companyName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGenerateInviteCode() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ role, duration }: { role: CompanyRole; duration: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.davetKoduOlustur(role, duration);
    },
  });
}

export function useInviteCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ code, userName }: { code: string; userName: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.davetKoduKullan(code, userName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function usePersonnelList() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Bilgi[]>({
    queryKey: ['personnel'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.personelListele();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useActivePersonnelList() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Bilgi[]>({
    queryKey: ['activePersonnel'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.aktifPersonelleriListele();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddPersonnel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; adSoyad: string; rol: Rol; yetkiler: Yetki; userId: Principal }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.personelKaydet(data.id, data.adSoyad, data.rol, data.yetkiler, data.userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel'] });
      queryClient.invalidateQueries({ queryKey: ['activePersonnel'] });
    },
  });
}

export function useUpdatePersonnel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; adSoyad: string; rol: Rol; yetkiler: Yetki; aktifMi: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.personelGuncelle(data.id, data.adSoyad, data.rol, data.yetkiler, data.aktifMi);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel'] });
      queryClient.invalidateQueries({ queryKey: ['activePersonnel'] });
    },
  });
}

export function useDeletePersonnel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.personelSil(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnel'] });
      queryClient.invalidateQueries({ queryKey: ['activePersonnel'] });
    },
  });
}

export function useTaskList() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Bilgi__1[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.gorevleriListele();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useTasksByStatus(durum: Durum) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Bilgi__1[]>({
    queryKey: ['tasks', durum],
    queryFn: async () => {
      if (!actor) return [];
      return actor.gorevleriByDurum(durum);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      aciklama: string;
      oncelik: bigint;
      sorumluId: Principal;
      baslangicTarihi: bigint;
      bitisTarihi: bigint;
      durum: Durum;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.gorevKaydet(
        data.id,
        data.aciklama,
        data.oncelik,
        data.sorumluId,
        data.baslangicTarihi,
        data.bitisTarihi,
        data.durum
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; aciklama: string; oncelik: bigint; durum: Durum }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.gorevGuncelle(data.id, data.aciklama, data.oncelik, data.durum);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.gorevSil(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useAnnouncementList() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Bilgi__2[]>({
    queryKey: ['announcements'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.duyurulariListele();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; icerik: string; hedefRol: CompanyRole | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.duyuruKaydet(data.id, data.icerik, data.hedefRol);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.duyuruSil(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useReport(reportType: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: ['report', reportType],
    queryFn: async () => {
      if (!actor) return '';
      return actor.raporAl(reportType);
    },
    enabled: !!actor && !actorFetching && !!reportType,
  });
}
