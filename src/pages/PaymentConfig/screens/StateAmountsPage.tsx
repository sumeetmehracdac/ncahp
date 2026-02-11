import { useState } from 'react';
import { ModuleLayout } from '../components/ModuleLayout';
import { SC_ADMIN, MOCK_STATE_AMOUNTS, MOCK_DEFAULT_AMOUNTS, APPLICATION_TYPES, STATES } from '../data/mockData';
import type { StateSpecificAmount } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Pencil, Lock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StateAmountsPage() {
  const councilId = SC_ADMIN.stateCouncilId!;
  const councilStates = STATES.filter(s => s.stateCouncilId === councilId);
  const [amounts, setAmounts] = useState<StateSpecificAmount[]>(
    MOCK_STATE_AMOUNTS.filter(sa => sa.stateCouncilId === councilId)
  );
  const [filterAppType, setFilterAppType] = useState<string>('all');
  const [editItem, setEditItem] = useState<StateSpecificAmount | null>(null);
  const [formAmount, setFormAmount] = useState('');
  const [formIsGst, setFormIsGst] = useState(false);
  const [formSgst, setFormSgst] = useState('');
  const [formCgst, setFormCgst] = useState('');
  const [formIgst, setFormIgst] = useState('');
  const [formUtgst, setFormUtgst] = useState('');

  const filtered = filterAppType === 'all'
    ? amounts
    : amounts.filter(a => a.applicationTypeId === Number(filterAppType));

  const getDefaultForAppType = (appTypeId: number) =>
    MOCK_DEFAULT_AMOUNTS.find(d => d.applicationTypeId === appTypeId);

  const openEdit = (item: StateSpecificAmount) => {
    const def = getDefaultForAppType(item.applicationTypeId);
    if (def && !def.isRelaxation) {
      toast.error('Relaxation is disabled for this application type by NCAHP');
      return;
    }
    setEditItem(item);
    setFormAmount(String(item.amount));
    setFormIsGst(item.isGst ?? false);
    setFormSgst(item.sgst !== null ? String(item.sgst) : '');
    setFormCgst(item.cgst !== null ? String(item.cgst) : '');
    setFormIgst(item.igst !== null ? String(item.igst) : '');
    setFormUtgst(item.utgst !== null ? String(item.utgst) : '');
  };

  const handleSave = () => {
    if (!editItem) return;
    const def = getDefaultForAppType(editItem.applicationTypeId);
    const amount = parseFloat(formAmount);
    if (isNaN(amount)) { toast.error('Please enter a valid amount'); return; }
    if (def && (amount < def.minAmount || amount > def.maxAmount)) {
      toast.error(`Amount must be between ₹${def.minAmount} and ₹${def.maxAmount}`);
      return;
    }
    setAmounts(prev => prev.map(a =>
      a.stateSpecificAmountId === editItem.stateSpecificAmountId
        ? {
            ...a, amount,
            isGst: formIsGst || null,
            sgst: formSgst ? parseFloat(formSgst) : null,
            cgst: formCgst ? parseFloat(formCgst) : null,
            igst: formIgst ? parseFloat(formIgst) : null,
            utgst: formUtgst ? parseFloat(formUtgst) : null,
            updatedAt: new Date().toISOString(),
          }
        : a
    ));
    toast.success('State amount updated');
    setEditItem(null);
  };

  return (
    <ModuleLayout
      adminContext={SC_ADMIN}
      title="State Specific Amounts"
      subtitle="Customize fee amounts for states within your council. Amounts must stay within national bounds."
    >
      {/* Filter */}
      <div className="flex items-center gap-3 mb-6">
        <Label className="text-sm text-muted-foreground whitespace-nowrap">Filter by Application Type:</Label>
        <Select value={filterAppType} onValueChange={setFilterAppType}>
          <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {APPLICATION_TYPES.map(at => (
              <SelectItem key={at.applicationTypeId} value={String(at.applicationTypeId)}>{at.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>Application Type</TableHead>
                <TableHead className="text-right">National Range</TableHead>
                <TableHead className="text-right">State Amount (₹)</TableHead>
                <TableHead className="text-center">GST Override</TableHead>
                <TableHead className="text-center">Relaxation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => {
                const def = getDefaultForAppType(item.applicationTypeId);
                const canEdit = def?.isRelaxation ?? false;
                return (
                  <TableRow key={item.stateSpecificAmountId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {item.state?.stateName}
                      </div>
                    </TableCell>
                    <TableCell>{item.applicationType?.name}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                      {def ? `₹${def.minAmount} – ₹${def.maxAmount}` : '—'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">₹{item.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      {item.isGst !== null ? (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Custom</Badge>
                      ) : (
                        <Badge variant="secondary">Inherited</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {canEdit ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Enabled</Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1"><Lock className="h-3 w-3" /> Locked</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => openEdit(item)}
                        disabled={!canEdit}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No state amounts found for the selected filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={open => !open && setEditItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit State Amount</DialogTitle>
            <DialogDescription>
              {editItem?.state?.stateName} — {editItem?.applicationType?.name}
            </DialogDescription>
          </DialogHeader>
          {editItem && (() => {
            const def = getDefaultForAppType(editItem.applicationTypeId);
            return (
              <div className="space-y-4">
                {def && (
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <span className="text-muted-foreground">National bounds:</span>{' '}
                    <span className="font-medium">₹{def.minAmount} – ₹{def.maxAmount}</span>{' '}
                    <span className="text-muted-foreground">(Default: ₹{def.defaultAmount})</span>
                  </div>
                )}
                <div>
                  <Label>State Amount (₹) *</Label>
                  <Input type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Override GST</Label>
                    <p className="text-xs text-muted-foreground">Leave off to inherit national GST rates</p>
                  </div>
                  <Switch checked={formIsGst} onCheckedChange={setFormIsGst} />
                </div>
                {formIsGst && (
                  <div className="grid grid-cols-4 gap-3">
                    <div><Label className="text-xs">SGST %</Label><Input type="number" value={formSgst} onChange={e => setFormSgst(e.target.value)} /></div>
                    <div><Label className="text-xs">CGST %</Label><Input type="number" value={formCgst} onChange={e => setFormCgst(e.target.value)} /></div>
                    <div><Label className="text-xs">IGST %</Label><Input type="number" value={formIgst} onChange={e => setFormIgst(e.target.value)} /></div>
                    <div><Label className="text-xs">UTGST %</Label><Input type="number" value={formUtgst} onChange={e => setFormUtgst(e.target.value)} /></div>
                  </div>
                )}
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModuleLayout>
  );
}
