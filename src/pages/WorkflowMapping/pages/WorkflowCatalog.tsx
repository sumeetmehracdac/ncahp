import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Plus, Copy, Eye, Edit2, MoreHorizontal,
  CheckCircle2, FileEdit, FileX, ChevronDown, ArrowUpDown,
  LayoutGrid, List, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { useWorkflowStore } from '../store/workflowStore';
import CopyWizard from '../components/CopyWizard';
import { toast } from 'sonner';

const statusConfig = {
  published: { label: 'Published', icon: CheckCircle2, className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  draft: { label: 'Draft', icon: FileEdit, className: 'bg-amber-100 text-amber-700 border-amber-200' },
  none: { label: 'No Workflow', icon: FileX, className: 'bg-muted text-muted-foreground border-border' },
};

const WorkflowCatalog = () => {
  const navigate = useNavigate();
  const { applicationTypes, workflows, createWorkflow, setActiveWorkflow } = useWorkflowStore();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<'name' | 'category' | 'status' | 'updatedAt'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [copyWizardOpen, setCopyWizardOpen] = useState(false);
  const [copySourceId, setCopySourceId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(applicationTypes.map(at => at.category));
    return Array.from(cats).sort();
  }, [applicationTypes]);

  const filtered = useMemo(() => {
    let items = applicationTypes.filter(at => {
      if (search && !at.name.toLowerCase().includes(search.toLowerCase()) && !at.category.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'all' && at.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && at.status !== statusFilter) return false;
      return true;
    });

    items.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    return items;
  }, [applicationTypes, search, categoryFilter, statusFilter, sortField, sortDir]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(f => f.id)));
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleEdit = (appTypeId: string) => {
    const wf = workflows.find(w => w.applicationTypeId === appTypeId);
    if (wf) {
      setActiveWorkflow(wf.id);
      navigate(`/workflows/${wf.id}/editor`);
    } else {
      const newId = createWorkflow(appTypeId);
      navigate(`/workflows/${newId}/editor`);
    }
  };

  const handleView = (appTypeId: string) => {
    const wf = workflows.find(w => w.applicationTypeId === appTypeId);
    if (wf) {
      setActiveWorkflow(wf.id);
      navigate(`/workflows/${wf.id}/editor`);
    }
  };

  const handleCopyFrom = (appTypeId: string) => {
    const wf = workflows.find(w => w.applicationTypeId === appTypeId);
    if (wf) {
      setCopySourceId(wf.id);
      setCopyWizardOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-[1600px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Workflow Catalog</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage workflow mappings for {applicationTypes.length} application types
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                ← Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Filters Bar */}
        <div className="bg-card rounded-xl border border-border p-4 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search application types..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="none">No Workflow</SelectItem>
              </SelectContent>
            </Select>
            {(search || categoryFilter !== 'all' || statusFilter !== 'all') && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all'); }}>
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  {selectedIds.size} application type{selectedIds.size > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => setCopyWizardOpen(true)}>
                    <Copy className="w-4 h-4 mr-2" /> Copy Mapping To Selected
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
                    Clear Selection
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="w-12 px-4 py-3">
                    <Checkbox
                      checked={selectedIds.size === filtered.length && filtered.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left px-4 py-3">
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                      Application Type <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3">
                    <button onClick={() => handleSort('category')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                      Category <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3">
                    <button onClick={() => handleSort('status')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                      Status <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3">
                    <button onClick={() => handleSort('updatedAt')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
                      Last Updated <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="w-16 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((at, idx) => {
                  const config = statusConfig[at.status];
                  const StatusIcon = config.icon;
                  return (
                    <motion.tr
                      key={at.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedIds.has(at.id)}
                          onCheckedChange={() => toggleSelect(at.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-foreground">{at.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">{at.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`gap-1 ${config.className}`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-muted-foreground">
                          {at.updatedAt || '—'}
                          {at.updatedBy && <span className="ml-1 text-xs">by {at.updatedBy}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card">
                            {at.hasWorkflow && (
                              <DropdownMenuItem onClick={() => handleView(at.id)}>
                                <Eye className="w-4 h-4 mr-2" /> View Workflow
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleEdit(at.id)}>
                              <Edit2 className="w-4 h-4 mr-2" /> {at.hasWorkflow ? 'Edit Workflow' : 'Create Workflow'}
                            </DropdownMenuItem>
                            {at.hasWorkflow && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleCopyFrom(at.id)}>
                                  <Copy className="w-4 h-4 mr-2" /> Copy To Other Types…
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <FileX className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No application types match your filters.</p>
            </div>
          )}

          <div className="px-4 py-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
            Showing {filtered.length} of {applicationTypes.length} application types
          </div>
        </div>
      </div>

      {/* Copy Wizard */}
      <CopyWizard
        open={copyWizardOpen}
        onOpenChange={setCopyWizardOpen}
        preSelectedSourceId={copySourceId}
        preSelectedTargetIds={selectedIds.size > 0 ? Array.from(selectedIds) : undefined}
      />
    </div>
  );
};

export default WorkflowCatalog;
