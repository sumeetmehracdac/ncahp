import { useState } from 'react';
import { ModuleLayout } from '../components/ModuleLayout';
import {
  SC_ADMIN, NCAHP_ADMIN,
  MOCK_STAKEHOLDER_RELAXATIONS, MOCK_RELAXATIONS,
  APPLICATION_TYPES, STATES,
} from '../data/mockData';
import type { StakeholderRelaxation, AdminContext } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ArrowUpDown, GripVertical } from 'lucide-react';

// Toggle admin for demo
const DEMO_ADMIN: AdminContext = SC_ADMIN;

export default function StakeholderRelaxationsPage() {
  const admin = DEMO_ADMIN;
  const isNCahp = admin.adminType === 'NCAHP';
  const stakeholderTypeId = isNCahp ? 21 : 23;

  const [items, setItems] = useState<StakeholderRelaxation[]>(
    MOCK_STAKEHOLDER_RELAXATIONS.filter(sr => sr.stakeholderTypeId === stakeholderTypeId)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<StakeholderRelaxation | null>(null);

  const [formRelaxation, setFormRelaxation] = useState('');
  const [formAppType, setFormAppType] = useState('');
  const [formState, setFormState] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formFrom, setFormFrom] = useState('');
  const [formTo, setFormTo] = useState('');
  const [formOrder, setFormOrder] = useState('');

  const councilStates = !isNCahp
    ? STATES.filter(s => s.stateCouncilId === admin.stateCouncilId)
    : [];

  const openCreate = () => {
    setEditing(null);
    setFormRelaxation(''); setFormAppType(''); setFormState('');
    setFormAmount(''); setFormFrom(''); setFormTo(''); setFormOrder('');
    setDialogOpen(true);
  };

  const openEdit = (item: StakeholderRelaxation) => {
    setEditing(item);
    setFormRelaxation(String(item.relaxationId));
    setFormAppType(String(item.applicationTypeId));
    setFormState(item.stateId ? String(item.stateId) : '');
    setFormAmount(String(item.amount));
    setFormFrom(item.fromDate ?? '');
    setFormTo(item.toDate ?? '');
    setFormOrder(String(item.order));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formRelaxation || !formAppType || !formAmount || !formOrder) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!isNCahp && !formState) {
      toast.error('State is required for State Council');
      return;
    }
    const amount = parseFloat(formAmount);
    const order = parseInt(formOrder);
    if (isNaN(amount) || amount < 0) { toast.error('Invalid amount'); return; }
    if (isNaN(order) || order < 1) { toast.error('Priority order must be ≥ 1'); return; }

    const relaxation = MOCK_RELAXATIONS.find(r => r.relaxationId === Number(formRelaxation));
    const appType = APPLICATION_TYPES.find(at => at.applicationTypeId === Number(formAppType));
    const state = formState ? STATES.find(s => s.stateId === Number(formState)) : undefined;

    const entry: StakeholderRelaxation = {
      stakeholderRelaxationId: editing?.stakeholderRelaxationId ?? items.length + 100,
      stakeholderTypeId,
      stateCouncilId: isNCahp ? null : admin.stateCouncilId!,
      stateId: formState ? Number(formState) : null,
      state: state ?? undefined,
      applicationTypeId: Number(formAppType),
      applicationType: appType,
      relaxationId: Number(formRelaxation),
      relaxation: relaxation ?? undefined,
      amount,
      fromDate: formFrom || null,
      toDate: formTo || null,
      order,
      isActive: true,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editing) {
      setItems(prev => prev.map(i => i.stakeholderRelaxationId === editing.stakeholderRelaxationId ? entry : i));
      toast.success('Relaxation assignment updated');
    } else {
      setItems(prev => [...prev, entry]);
      toast.success('Relaxation assigned');
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(i => i.stakeholderRelaxationId !== id));
    toast.success('Relaxation assignment removed');
  };

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <ModuleLayout
      adminContext={admin}
      title="Stakeholder Relaxations"
      subtitle={isNCahp
        ? 'Assign relaxations at the national level per application type.'
        : 'Assign relaxations to states within your council with priority ordering.'
      }
      actions={
        <Button onClick={openCreate} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" /> Assign Relaxation
        </Button>
      }
    >
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">
                  <ArrowUpDown className="h-4 w-4 mx-auto" />
                </TableHead>
                <TableHead>Relaxation</TableHead>
                <TableHead>Application Type</TableHead>
                {!isNCahp && <TableHead>State</TableHead>}
                <TableHead className="text-right">Amount (₹)</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map(item => (
                <TableRow key={item.stakeholderRelaxationId}>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="tabular-nums">{item.order}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.relaxation?.relaxationName ?? '—'}</TableCell>
                  <TableCell>{item.applicationType?.name ?? '—'}</TableCell>
                  {!isNCahp && <TableCell>{item.state?.stateName ?? '—'}</TableCell>}
                  <TableCell className="text-right tabular-nums font-semibold">₹{item.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.fromDate && item.toDate
                      ? `${item.fromDate} → ${item.toDate}`
                      : item.fromDate
                        ? `From ${item.fromDate}`
                        : 'Always'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.stakeholderRelaxationId)} className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isNCahp ? 6 : 7} className="text-center py-10 text-muted-foreground">
                    No relaxation assignments yet.
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
            <DialogTitle>{editing ? 'Edit' : 'Assign'} Relaxation</DialogTitle>
            <DialogDescription>
              {isNCahp ? 'Assign at national level.' : 'Assign to a state within your council.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Relaxation *</Label>
              <Select value={formRelaxation} onValueChange={setFormRelaxation}>
                <SelectTrigger><SelectValue placeholder="Select relaxation" /></SelectTrigger>
                <SelectContent>
                  {MOCK_RELAXATIONS.filter(r => r.isActive).map(r => (
                    <SelectItem key={r.relaxationId} value={String(r.relaxationId)}>{r.relaxationName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Application Type *</Label>
              <Select value={formAppType} onValueChange={setFormAppType}>
                <SelectTrigger><SelectValue placeholder="Select application type" /></SelectTrigger>
                <SelectContent>
                  {APPLICATION_TYPES.map(at => (
                    <SelectItem key={at.applicationTypeId} value={String(at.applicationTypeId)}>{at.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!isNCahp && (
              <div>
                <Label>State *</Label>
                <Select value={formState} onValueChange={setFormState}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {councilStates.map(s => (
                      <SelectItem key={s.stateId} value={String(s.stateId)}>{s.stateName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Amount (₹) *</Label>
                <Input type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} min={0} />
              </div>
              <div>
                <Label>Priority Order *</Label>
                <Input type="number" value={formOrder} onChange={e => setFormOrder(e.target.value)} min={1} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>From Date</Label>
                <Input type="date" value={formFrom} onChange={e => setFormFrom(e.target.value)} />
              </div>
              <div>
                <Label>To Date</Label>
                <Input type="date" value={formTo} onChange={e => setFormTo(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">{editing ? 'Update' : 'Assign'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModuleLayout>
  );
}
