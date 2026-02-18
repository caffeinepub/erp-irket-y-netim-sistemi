import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile, useTaskList, useAddTask, useUpdateTask, useDeleteTask, useActivePersonnelList } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Durum, CompanyRole } from '../backend';
import StatusBadge from '../components/StatusBadge';

export default function TaskManagement() {
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: tasks = [], isLoading: tasksLoading } = useTaskList();
  const { data: personnel = [] } = useActivePersonnelList();
  const addTask = useAddTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('1');
  const [assignee, setAssignee] = useState('');
  const [status, setStatus] = useState<Durum>(Durum.beklemede);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !assignee || !startDate || !endDate) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const taskId = Date.now().toString();
      const selectedPerson = personnel.find((p) => p.userId.toString() === assignee);
      if (!selectedPerson) {
        alert('Geçersiz sorumlu seçimi');
        return;
      }

      await addTask.mutateAsync({
        id: taskId,
        aciklama: description,
        oncelik: BigInt(priority),
        sorumluId: selectedPerson.userId,
        baslangicTarihi: BigInt(new Date(startDate).getTime() * 1000000),
        bitisTarihi: BigInt(new Date(endDate).getTime() * 1000000),
        durum: status,
      });

      setDescription('');
      setPriority('1');
      setAssignee('');
      setStatus(Durum.beklemede);
      setStartDate('');
      setEndDate('');
      setDialogOpen(false);
    } catch (error: any) {
      alert(error.message || 'Görev eklenemedi');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu görevi silmek istediğinizden emin misiniz?')) return;
    try {
      await deleteTask.mutateAsync(id);
    } catch (error: any) {
      alert(error.message || 'Görev silinemedi');
    }
  };

  if (profileLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (!userProfile || !userProfile.permissions.taskView) {
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
          <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-2">Görev Yönetimi</h1>
          <p className="text-amber-700 dark:text-amber-300">Görevleri yönetin ve takip edin</p>
        </div>
        {userProfile.permissions.taskAdd && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Görev
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Yeni Görev Oluştur</DialogTitle>
                <DialogDescription>Görev detaylarını girin</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Görev açıklaması"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Öncelik</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="1"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="assignee">Sorumlu</Label>
                    <Select value={assignee} onValueChange={setAssignee} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Sorumlu seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {personnel.map((person) => (
                          <SelectItem key={person.id} value={person.userId.toString()}>
                            {person.adSoyad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Bitiş Tarihi</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Durum</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as Durum)} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Durum.beklemede}>Bekliyor</SelectItem>
                      <SelectItem value={Durum.devamEdiyor}>Devam Ediyor</SelectItem>
                      <SelectItem value={Durum.tamamlandi}>Tamamlandı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={addTask.isPending} className="w-full">
                  {addTask.isPending ? 'Ekleniyor...' : 'Görev Ekle'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Görev Listesi</CardTitle>
          <CardDescription>Tüm görevler</CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Henüz görev eklenmemiş</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Açıklama</TableHead>
                  <TableHead>Öncelik</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Başlangıç</TableHead>
                  <TableHead>Bitiş</TableHead>
                  {userProfile.permissions.taskDelete && <TableHead>İşlemler</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.aciklama}</TableCell>
                    <TableCell>{task.oncelik.toString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={task.durum} />
                    </TableCell>
                    <TableCell>{new Date(Number(task.baslangicTarihi) / 1000000).toLocaleDateString('tr-TR')}</TableCell>
                    <TableCell>{new Date(Number(task.bitisTarihi) / 1000000).toLocaleDateString('tr-TR')}</TableCell>
                    {userProfile.permissions.taskDelete && (
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
