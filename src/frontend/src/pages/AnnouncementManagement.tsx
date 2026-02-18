import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile, useAnnouncementList, useAddAnnouncement, useDeleteAnnouncement } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { CompanyRole } from '../backend';

export default function AnnouncementManagement() {
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: announcements = [], isLoading: announcementsLoading } = useAnnouncementList();
  const addAnnouncement = useAddAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [content, setContent] = useState('');
  const [targetRole, setTargetRole] = useState<string>('all');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Lütfen duyuru içeriği girin');
      return;
    }

    try {
      const announcementId = Date.now().toString();
      const role = targetRole === 'all' ? null : (targetRole as CompanyRole);

      await addAnnouncement.mutateAsync({
        id: announcementId,
        icerik: content,
        hedefRol: role,
      });

      setContent('');
      setTargetRole('all');
      setDialogOpen(false);
    } catch (error: any) {
      alert(error.message || 'Duyuru eklenemedi');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) return;
    try {
      await deleteAnnouncement.mutateAsync(id);
    } catch (error: any) {
      alert(error.message || 'Duyuru silinemedi');
    }
  };

  if (profileLoading || announcementsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-700"></div>
      </div>
    );
  }

  if (!userProfile || !userProfile.permissions.announcementView) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Yetkisiz Erişim</CardTitle>
            <CardDescription>Bu modülü görüntüleme yetkiniz yok</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/' })}>Ana Sayfaya Dön</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const backRoute = userProfile.role === CompanyRole.Owner ? '/owner' : userProfile.role === CompanyRole.Manager ? '/manager' : '/employee';

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate({ to: backRoute })} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
          <h1 className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">Duyuru Sistemi</h1>
          <p className="text-yellow-700 dark:text-yellow-300">Duyuruları yönetin ve görüntüleyin</p>
        </div>
        {userProfile.permissions.announcementAdd && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Duyuru
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Duyuru Oluştur</DialogTitle>
                <DialogDescription>Duyuru detaylarını girin</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="content">Duyuru İçeriği</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Duyuru içeriği"
                    rows={5}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="targetRole">Hedef Rol</Label>
                  <Select value={targetRole} onValueChange={setTargetRole} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      <SelectItem value={CompanyRole.Owner}>Sahip</SelectItem>
                      <SelectItem value={CompanyRole.Manager}>Yetkili</SelectItem>
                      <SelectItem value={CompanyRole.Employee}>Personel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={addAnnouncement.isPending} className="w-full">
                  {addAnnouncement.isPending ? 'Ekleniyor...' : 'Duyuru Ekle'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">Henüz duyuru yok</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{announcement.icerik}</CardTitle>
                    <CardDescription>
                      {new Date(Number(announcement.olusturmaTarihi) / 1000000).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' • '}
                      {announcement.hedefRol
                        ? announcement.hedefRol === CompanyRole.Owner
                          ? 'Sahip'
                          : announcement.hedefRol === CompanyRole.Manager
                          ? 'Yetkili'
                          : 'Personel'
                        : 'Tümü'}
                    </CardDescription>
                  </div>
                  {userProfile.permissions.announcementDelete && (
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(announcement.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
