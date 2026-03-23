import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
import { statuses as initialStatuses } from '../data/mockData';
import type { ProposalStatus } from '../types';
import { toast } from 'sonner';

const categories = ['initial', 'in-review', 'final', 'terminal'] as const;

const categoryColors: Record<string, string> = {
  initial: 'bg-blue-500/10 text-blue-700 border-blue-200',
  'in-review': 'bg-amber-500/10 text-amber-700 border-amber-200',
  final: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  terminal: 'bg-red-500/10 text-red-700 border-red-200',
};

const StatusMaster = () => {
  const [data, setData] = useState<ProposalStatus[]>(initialStatuses);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<ProposalStatus | null>(null);

  const filtered = useMemo(() =>
    data.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.code.toLowerCase().includes(search.toLowerCase())) return false;
      if (catFilter !== 'all' && s.category !== catFilter) return false;
      return true;
    }),
    [data, search, catFilter]
  );

  const openDrawer = (status?: ProposalStatus) => {
    setEditing(status || null);
    setDrawerOpen(true);
  };

  const toggleActive = (id: string) => {
    setData((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
    toast.success('Status updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground font-display">Status Master</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Define the vocabulary of proposal and application statuses
          </p>
        </div>
        <Button onClick={() => openDrawer()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="w-4 h-4 mr-1.5" /> New Status
        </Button>
      </div>

      {/* Category overview */}
      <div className="grid grid-cols-4 gap-3">
        {categories.map((cat) => {
          const count = data.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setCatFilter(catFilter === cat ? 'all' : cat)}
              className={cn(
                'rounded-xl p-3.5 text-left transition-all border-2',
                catFilter === cat ? 'border-primary shadow-sm' : 'border-transparent',
                categoryColors[cat]
              )}
            >
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs capitalize opacity-80">{cat.replace('-', ' ')}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search statuses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-0 bg-muted/50 focus-visible:ring-primary/30"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Code</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Category</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Active</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filtered.map((status) => (
                <motion.tr
                  key={status.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group border-b border-border/50 hover:bg-primary/[0.02] transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: status.color }} />
                      <span className="font-medium text-sm text-foreground">{status.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">{status.code}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-[10px] capitalize', categoryColors[status.category])}>
                      {status.category.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <button onClick={() => toggleActive(status.id)}>
                      {status.active ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 text-[10px] cursor-pointer">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-[10px] cursor-pointer">Inactive</Badge>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => openDrawer(status)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Status Preview */}
      <div className="bg-card rounded-xl border border-border p-5">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Live Preview — Status Flow</p>
        <div className="flex items-center gap-2 flex-wrap">
          {data.filter((s) => s.active).sort((a, b) => {
            const order = { initial: 0, 'in-review': 1, final: 2, terminal: 3 };
            return order[a.category] - order[b.category];
          }).map((status, i, arr) => (
            <div key={status.id} className="flex items-center gap-2">
              <div
                className="px-3 py-1.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: status.color }}
              >
                {status.name}
              </div>
              {i < arr.length - 1 && (
                <div className="w-4 h-px bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[400px] sm:max-w-[400px] bg-card">
          <SheetHeader>
            <SheetTitle>{editing ? 'Edit Status' : 'New Status'}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Name</Label>
              <Input defaultValue={editing?.name || ''} placeholder="e.g. Under Review" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Code</Label>
              <Input defaultValue={editing?.code || ''} placeholder="e.g. UNDER_REVIEW" className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Category</Label>
              <Select defaultValue={editing?.category || 'initial'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  {categories.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c.replace('-', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={() => { setDrawerOpen(false); toast.success('Saved'); }}>Save</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default StatusMaster;
