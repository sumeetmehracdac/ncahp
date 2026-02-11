import { useState } from 'react';
import { ModuleLayout } from '../components/ModuleLayout';
import { NCAHP_ADMIN, MOCK_DEFAULT_AMOUNTS, APPLICATION_TYPES } from '../data/mockData';
import type { DefaultAmount } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, IndianRupee, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DefaultAmountsPage() {
  const [amounts, setAmounts] = useState<DefaultAmount[]>(MOCK_DEFAULT_AMOUNTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DefaultAmount | null>(null);

  // Form state
  const [formAppType, setFormAppType] = useState('');
  const [formMin, setFormMin] = useState('');
  const [formMax, setFormMax] = useState('');
  const [formDefault, setFormDefault] = useState('');
  const [formIsRelaxation, setFormIsRelaxation] = useState(false);
  const [formIsGst, setFormIsGst] = useState(false);
  const [formSgst, setFormSgst] = useState('');
  const [formCgst, setFormCgst] = useState('');
  const [formIgst, setFormIgst] = useState('');
  const [formUtgst, setFormUtgst] = useState('');

  const usedAppTypeIds = amounts.map(a => a.applicationTypeId);
  const availableAppTypes = APPLICATION_TYPES.filter(
    at => !usedAppTypeIds.includes(at.applicationTypeId) || editing?.applicationTypeId === at.applicationTypeId
  );

  const openCreate = () => {
    setEditing(null);
    setFormAppType('');
    setFormMin(''); setFormMax(''); setFormDefault('');
    setFormIsRelaxation(false); setFormIsGst(false);
    setFormSgst(''); setFormCgst(''); setFormIgst(''); setFormUtgst('');
    setDialogOpen(true);
  };

  const openEdit = (item: DefaultAmount) => {
    setEditing(item);
    setFormAppType(String(item.applicationTypeId));
    setFormMin(String(item.minAmount)); setFormMax(String(item.maxAmount)); setFormDefault(String(item.defaultAmount));
    setFormIsRelaxation(item.isRelaxation); setFormIsGst(item.isGst);
    setFormSgst(item.sgst !== null ? String(item.sgst) : '');
    setFormCgst(item.cgst !== null ? String(item.cgst) : '');
    setFormIgst(item.igst !== null ? String(item.igst) : '');
    setFormUtgst(item.utgst !== null ? String(item.utgst) : '');
    setDialogOpen(true);
  };

  const handleSave = () => {
    const min = parseFloat(formMin);
    const max = parseFloat(formMax);
    const def = parseFloat(formDefault);

    if (!formAppType || isNaN(min) || isNaN(max) || isNaN(def)) {
      toast.error('Please fill all required fields');
      return;
    }
    if (max < min) { toast.error('Max must be ≥ Min'); return; }
    if (def < min || def > max) { toast.error('Default must be between Min and Max'); return; }

    const appType = APPLICATION_TYPES.find(at => at.applicationTypeId === Number(formAppType));
    const entry: DefaultAmount = {
      defaultAmountId: editing?.defaultAmountId ?? amounts.length + 1,
      applicationTypeId: Number(formAppType),
      applicationType: appType,
      minAmount: min, maxAmount: max, defaultAmount: def,
      isRelaxation: formIsRelaxation, isGst: formIsGst,
      sgst: formSgst ? parseFloat(formSgst) : null,
      cgst: formCgst ? parseFloat(formCgst) : null,
      igst: formIgst ? parseFloat(formIgst) : null,
      utgst: formUtgst ? parseFloat(formUtgst) : null,
      isActive: true,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editing) {
      setAmounts(prev => prev.map(a => a.defaultAmountId === editing.defaultAmountId ? entry : a));
      toast.success('Default amount updated');
    } else {
      setAmounts(prev => [...prev, entry]);
      toast.success('Default amount created');
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setAmounts(prev => prev.filter(a => a.defaultAmountId !== id));
    toast.success('Default amount deleted');
  };

  return (
    <ModuleLayout
      adminContext={NCAHP_ADMIN}
      title="Default Amount Configuration"
      subtitle="Set min, max, and default fee amounts per application type. Control state-level relaxation and GST settings."
      actions={
        <Button onClick={openCreate} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" /> Add Default Amount
        </Button>
      }
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5 pb-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <IndianRupee className="h-5 w-5 text-teal-700" />
            </div>
            <div>
              <p className="text-2xl font-bold">{amounts.length}</p>
              <p className="text-xs text-muted-foreground">Application Types Configured</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-2xl font-bold">{amounts.filter(a => a.isRelaxation).length}</p>
              <p className="text-xs text-muted-foreground">Relaxation Enabled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-2xl font-bold">{amounts.filter(a => a.isGst).length}</p>
              <p className="text-xs text-muted-foreground">GST Applicable</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application Type</TableHead>
                <TableHead className="text-right">Min (₹)</TableHead>
                <TableHead className="text-right">Default (₹)</TableHead>
                <TableHead className="text-right">Max (₹)</TableHead>
                <TableHead className="text-center">Relaxation</TableHead>
                <TableHead className="text-center">GST</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {amounts.map(item => (
                <TableRow key={item.defaultAmountId}>
                  <TableCell className="font-medium">{item.applicationType?.name}</TableCell>
                  <TableCell className="text-right tabular-nums">₹{item.minAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">₹{item.defaultAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-right tabular-nums">₹{item.maxAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    {item.isRelaxation ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Enabled</Badge>
                    ) : (
                      <Badge variant="secondary">Disabled</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.isGst ? (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                        {[item.sgst && `S:${item.sgst}%`, item.cgst && `C:${item.cgst}%`].filter(Boolean).join(' ')}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">N/A</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.defaultAmountId)} className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {amounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No default amounts configured. Click "Add Default Amount" to start.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'Add'} Default Amount</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the fee configuration for this application type.' : 'Configure fee bounds for a new application type.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Application Type *</Label>
              <Select value={formAppType} onValueChange={setFormAppType} disabled={!!editing}>
                <SelectTrigger><SelectValue placeholder="Select application type" /></SelectTrigger>
                <SelectContent>
                  {availableAppTypes.map(at => (
                    <SelectItem key={at.applicationTypeId} value={String(at.applicationTypeId)}>
                      {at.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Min Amount (₹) *</Label>
                <Input type="number" value={formMin} onChange={e => setFormMin(e.target.value)} min={0} />
              </div>
              <div>
                <Label>Default Amount (₹) *</Label>
                <Input type="number" value={formDefault} onChange={e => setFormDefault(e.target.value)} />
              </div>
              <div>
                <Label>Max Amount (₹) *</Label>
                <Input type="number" value={formMax} onChange={e => setFormMax(e.target.value)} />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Allow State Relaxation</Label>
                <p className="text-xs text-muted-foreground">States can set custom amounts within bounds</p>
              </div>
              <Switch checked={formIsRelaxation} onCheckedChange={setFormIsRelaxation} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>GST Applicable</Label>
                <p className="text-xs text-muted-foreground">Apply GST on this application type</p>
              </div>
              <Switch checked={formIsGst} onCheckedChange={setFormIsGst} />
            </div>

            {formIsGst && (
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs">SGST %</Label>
                  <Input type="number" value={formSgst} onChange={e => setFormSgst(e.target.value)} min={0} />
                </div>
                <div>
                  <Label className="text-xs">CGST %</Label>
                  <Input type="number" value={formCgst} onChange={e => setFormCgst(e.target.value)} min={0} />
                </div>
                <div>
                  <Label className="text-xs">IGST %</Label>
                  <Input type="number" value={formIgst} onChange={e => setFormIgst(e.target.value)} min={0} />
                </div>
                <div>
                  <Label className="text-xs">UTGST %</Label>
                  <Input type="number" value={formUtgst} onChange={e => setFormUtgst(e.target.value)} min={0} />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
              {editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModuleLayout>
  );
}
