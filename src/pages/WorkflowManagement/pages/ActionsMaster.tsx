import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Pencil, ToggleLeft, ToggleRight, X,
  Send, FileCheck, CheckCircle, XCircle, RotateCcw, ArrowRight,
  HelpCircle, Users, ThumbsUp, Award, Ban, RefreshCw, Clock, Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { actions as initialActions } from '../data/mockData';
import type { WMAction } from '../types';
import { toast } from 'sonner';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Send, FileCheck, CheckCircle, XCircle, RotateCcw, ArrowRight,
  HelpCircle, Users, ThumbsUp, Award, Ban, RefreshCw, Clock,
};

const processNames = ['Registration', 'Certificate Issuance', 'Renewal', 'Disciplinary'];

const ActionsMaster = () => {
  const [data, setData] = useState<WMAction[]>(initialActions);
  const [search, setSearch] = useState('');
  const [processFilter, setProcessFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<WMAction | null>(null);

  const filtered = useMemo(() =>
    data.filter((a) => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.systemName.toLowerCase().includes(search.toLowerCase())) return false;
      if (processFilter !== 'all' && a.processName !== processFilter) return false;
      if (statusFilter !== 'all' && (statusFilter === 'active' ? !a.active : a.active)) return false;
      return true;
    }),
    [data, search, processFilter, statusFilter]
  );

  const openDrawer = (action?: WMAction) => {
    setEditing(action || null);
    setDrawerOpen(true);
  };

  const toggleActive = (id: string) => {
    setData((prev) => prev.map((a) => a.id === id ? { ...a, active: !a.active } : a));
    toast.success('Status updated');
  };

  const handleSave = (action: WMAction) => {
    if (editing) {
      setData((prev) => prev.map((a) => a.id === action.id ? action : a));
      toast.success('Action updated');
    } else {
      setData((prev) => [...prev, { ...action, id: `act-${Date.now()}`, updatedAt: new Date().toISOString().slice(0, 10), updatedBy: 'Admin' }]);
      toast.success('Action created');
    }
    setDrawerOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground font-display">Action Master</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage all workflow actions available across processes
          </p>
        </div>
        <Button onClick={() => openDrawer()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="w-4 h-4 mr-1.5" /> New Action
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Actions', value: data.length, color: 'bg-primary/10 text-primary' },
          { label: 'Active', value: data.filter((a) => a.active).length, color: 'bg-emerald-500/10 text-emerald-700' },
          { label: 'Inactive', value: data.filter((a) => !a.active).length, color: 'bg-muted text-muted-foreground' },
        ].map((stat) => (
          <div key={stat.label} className={cn('rounded-xl p-3.5 flex items-center gap-3', stat.color)}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-0 bg-muted/50 focus-visible:ring-primary/30"
          />
        </div>
        <Select value={processFilter} onValueChange={setProcessFilter}>
          <SelectTrigger className="w-[180px] bg-muted/50 border-0">
            <SelectValue placeholder="Process" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="all">All Processes</SelectItem>
            {processNames.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-muted/50 border-0">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Action</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">System Name</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Process</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">NoteSheet Text</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Status</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filtered.map((action) => {
                const Icon = iconMap[action.icon] || CheckCircle;
                return (
                  <motion.tr
                    key={action.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group border-b border-border/50 hover:bg-primary/[0.02] transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                          action.active ? 'bg-primary/10' : 'bg-muted'
                        )}>
                          <Icon className={cn('w-4 h-4', action.active ? 'text-primary' : 'text-muted-foreground')} />
                        </div>
                        <span className="font-medium text-sm text-foreground">{action.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                        {action.systemName}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                        {action.processName}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="text-xs text-muted-foreground truncate" title={action.noteSheetText}>
                        {action.noteSheetText}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => toggleActive(action.id)} className="inline-flex">
                        {action.active ? (
                          <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 hover:bg-emerald-500/20 text-[10px] cursor-pointer">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground border-border hover:bg-muted text-[10px] cursor-pointer">
                            Inactive
                          </Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDrawer(action)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDrawer(action)}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No actions match your filters
          </div>
        )}
      </div>

      {/* Edit Drawer */}
      <ActionDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        action={editing}
        onSave={handleSave}
      />
    </div>
  );
};

/* ─── Action Drawer ─── */
interface DrawerProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  action: WMAction | null;
  onSave: (a: WMAction) => void;
}

const ActionDrawer = ({ open, onOpenChange, action, onSave }: DrawerProps) => {
  const [form, setForm] = useState<Partial<WMAction>>({});

  const resetForm = () => {
    if (action) {
      setForm(action);
    } else {
      setForm({
        name: '', systemName: '', processName: 'Registration',
        noteSheetText: '', icon: 'CheckCircle', tooltipTitle: '', active: true,
      });
    }
  };

  // Reset form when drawer opens
  useState(() => { resetForm(); });

  const handleSubmit = () => {
    if (!form.name || !form.systemName) {
      toast.error('Name and system name are required');
      return;
    }
    onSave({
      id: action?.id || '',
      name: form.name || '',
      systemName: form.systemName || '',
      processName: form.processName || 'Registration',
      noteSheetText: form.noteSheetText || '',
      icon: form.icon || 'CheckCircle',
      tooltipTitle: form.tooltipTitle || '',
      active: form.active ?? true,
      updatedAt: new Date().toISOString().slice(0, 10),
      updatedBy: 'Admin',
    });
  };

  const upd = (field: keyof WMAction, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Sync form with action prop
  const isEditing = !!action;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[440px] sm:max-w-[440px] bg-card overflow-y-auto" onOpenAutoFocus={(e) => { e.preventDefault(); resetForm(); }}>
        <SheetHeader>
          <SheetTitle className="text-base">
            {isEditing ? 'Edit Action' : 'New Action'}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5 mt-6">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Action Name</Label>
            <Input value={form.name || ''} onChange={(e) => upd('name', e.target.value)} placeholder="e.g. Approve" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">System Name</Label>
            <Input value={form.systemName || ''} onChange={(e) => upd('systemName', e.target.value)} placeholder="e.g. APPROVE" className="font-mono" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Process Name</Label>
            <Select value={form.processName || 'Registration'} onValueChange={(v) => upd('processName', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card">
                {processNames.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">NoteSheet Text</Label>
            <Textarea
              value={form.noteSheetText || ''}
              onChange={(e) => upd('noteSheetText', e.target.value)}
              placeholder="Text that appears on the note sheet..."
              rows={3}
              className="resize-none text-sm"
            />
            <p className="text-[10px] text-muted-foreground text-right">
              {(form.noteSheetText || '').length} characters
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tooltip Title</Label>
            <Input value={form.tooltipTitle || ''} onChange={(e) => upd('tooltipTitle', e.target.value)} placeholder="Tooltip on hover" />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label className="text-sm">Active</Label>
            <Switch checked={form.active ?? true} onCheckedChange={(v) => upd('active', v)} />
          </div>

          {/* Preview */}
          <div className="rounded-xl bg-muted/40 border border-border p-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Button Preview</p>
            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-primary text-primary-foreground">
                <CheckCircle className="w-4 h-4 mr-1.5" />
                {form.name || 'Action Name'}
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-border">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSubmit}>
              {isEditing ? 'Update Action' : 'Create Action'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ActionsMaster;
