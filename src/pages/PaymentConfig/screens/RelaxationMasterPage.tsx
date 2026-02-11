import { useState } from 'react';
import { ModuleLayout } from '../components/ModuleLayout';
import { NCAHP_ADMIN, MOCK_RELAXATIONS } from '../data/mockData';
import type { RelaxationMaster } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

export default function RelaxationMasterPage() {
  const [relaxations, setRelaxations] = useState<RelaxationMaster[]>(MOCK_RELAXATIONS);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RelaxationMaster | null>(null);

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  
  const [formActive, setFormActive] = useState(true);

  const filtered = relaxations.filter(r =>
    r.relaxationName.toLowerCase().includes(search.toLowerCase()) ||
    (r.relaxationDescription ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setFormName(''); setFormDesc(''); setFormActive(true);
    setDialogOpen(true);
  };

  const openEdit = (item: RelaxationMaster) => {
    setEditing(item);
    setFormName(item.relaxationName);
    setFormDesc(item.relaxationDescription ?? '');
    setFormActive(item.isActive);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) { toast.error('Name is required'); return; }

    const entry: RelaxationMaster = {
      relaxationId: editing?.relaxationId ?? relaxations.length + 10,
      relaxationName: formName.trim(),
      relaxationDescription: formDesc.trim() || null,
      isActive: formActive,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editing) {
      setRelaxations(prev => prev.map(r => r.relaxationId === editing.relaxationId ? entry : r));
      toast.success('Relaxation updated');
    } else {
      setRelaxations(prev => [...prev, entry]);
      toast.success('Relaxation created');
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setRelaxations(prev => prev.filter(r => r.relaxationId !== id));
    toast.success('Relaxation deleted');
  };

  return (
    <ModuleLayout
      adminContext={NCAHP_ADMIN}
      title="Relaxation Master"
      subtitle="Define relaxation criteria. Available to all state councils."
      actions={
        <Button onClick={openCreate} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" /> Add Relaxation
        </Button>
      }
    >
      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search relaxations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => (
                <TableRow key={item.relaxationId}>
                  <TableCell className="font-medium">{item.relaxationName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {item.relaxationDescription ?? '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.isActive ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.relaxationId)} className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    No relaxations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'Add'} Relaxation</DialogTitle>
            <DialogDescription>
              Define a relaxation criterion.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Relaxation Name *</Label>
              <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Women Candidate Discount" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Detailed description..." rows={3} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch checked={formActive} onCheckedChange={setFormActive} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">{editing ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModuleLayout>
  );
}
