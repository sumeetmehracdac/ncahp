import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleLayout } from '../components/ModuleLayout';
import { CriterionBadge, CategoryBadge } from '../components/CriterionBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Eye,
  Trash2,
  Download,
  Filter,
  Users,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';
import { mockCriteria, mockHOAdminContext } from '../data/mockData';
import { CATEGORY_CONFIG, type RelaxationCriterion, type CriterionCategory } from '../types';
import { CreateCriterionModal } from './CreateCriterionModal';
import { toast } from 'sonner';

type SortField = 'criterionName' | 'category' | 'usageCount' | 'updatedAt';
type SortOrder = 'asc' | 'desc';

export default function CriteriaManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('criterionName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [criteria, setCriteria] = useState<RelaxationCriterion[]>(mockCriteria);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<RelaxationCriterion | null>(null);

  // Filter and sort criteria
  const filteredCriteria = useMemo(() => {
    let result = [...criteria];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        c =>
          c.criterionName.toLowerCase().includes(query) ||
          c.criterionCode.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(c => c.category === categoryFilter);
    }

    // Status filter
    if (statusFilter === 'active') {
      result = result.filter(c => c.isActive);
    } else if (statusFilter === 'inactive') {
      result = result.filter(c => !c.isActive);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'criterionName':
          comparison = a.criterionName.localeCompare(b.criterionName);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'usageCount':
          comparison = a.usageCount - b.usageCount;
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [criteria, searchQuery, categoryFilter, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleToggleActive = (id: string) => {
    setCriteria(prev =>
      prev.map(c =>
        c.id === id ? { ...c, isActive: !c.isActive, updatedAt: new Date().toISOString() } : c
      )
    );
    const criterion = criteria.find(c => c.id === id);
    toast.success(
      `Criterion "${criterion?.criterionName}" ${criterion?.isActive ? 'deactivated' : 'activated'}`
    );
  };

  const handleCreateCriterion = (data: Partial<RelaxationCriterion>) => {
    const newCriterion: RelaxationCriterion = {
      id: `crit-${Date.now()}`,
      criterionCode: data.criterionCode || '',
      criterionName: data.criterionName || '',
      category: data.category || 'GENDER',
      fieldMapping: data.fieldMapping || { userFieldName: '', expectedValue: '' },
      description: data.description,
      isActive: data.isActive ?? true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCriteria(prev => [...prev, newCriterion]);
    setIsCreateModalOpen(false);
    toast.success(`Criterion "${newCriterion.criterionName}" created successfully`);
  };

  const handleUpdateCriterion = (data: Partial<RelaxationCriterion>) => {
    if (!editingCriterion) return;
    
    setCriteria(prev =>
      prev.map(c =>
        c.id === editingCriterion.id
          ? { ...c, ...data, updatedAt: new Date().toISOString() }
          : c
      )
    );
    setEditingCriterion(null);
    toast.success(`Criterion "${data.criterionName}" updated successfully`);
  };

  const handleDeleteCriterion = (id: string) => {
    const criterion = criteria.find(c => c.id === id);
    if (criterion && criterion.usageCount > 0) {
      toast.error(`Cannot delete. Used by ${criterion.usageCount} state councils.`);
      return;
    }
    setCriteria(prev => prev.filter(c => c.id !== id));
    toast.success('Criterion deleted');
  };

  const categories = Object.keys(CATEGORY_CONFIG) as CriterionCategory[];
  const totalActive = criteria.filter(c => c.isActive).length;
  const totalInactive = criteria.filter(c => !c.isActive).length;

  return (
    <ModuleLayout
      adminContext={mockHOAdminContext}
      title="Relaxation Criteria Management"
      subtitle="Define criteria that state councils can use for fee relaxations"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create Criterion
          </Button>
        </>
      }
    >
      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Criteria</p>
              <p className="text-2xl font-bold text-foreground">{criteria.length}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <Filter className="h-5 w-5 text-slate-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-emerald-600">{totalActive}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold text-amber-600">{totalInactive}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <XCircle className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search criteria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border bg-white shadow-sm overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[250px]">
                <button
                  onClick={() => handleSort('criterionName')}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Criterion
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead>Code</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Category
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead>Field Mapping</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">
                <button
                  onClick={() => handleSort('usageCount')}
                  className="flex items-center gap-1 hover:text-foreground mx-auto"
                >
                  Usage
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredCriteria.map((criterion, index) => (
                <motion.tr
                  key={criterion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03 }}
                  className="group"
                >
                  <TableCell>
                    <CriterionBadge
                      category={criterion.category}
                      name={criterion.criterionName}
                      size="md"
                    />
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                      {criterion.criterionCode}
                    </code>
                  </TableCell>
                  <TableCell>
                    <CategoryBadge category={criterion.category} />
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-help">
                          <code className="text-xs">
                            {criterion.fieldMapping.userFieldName}={criterion.fieldMapping.expectedValue}
                          </code>
                          <Info className="h-3.5 w-3.5" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-xs">
                          Matches users where <strong>{criterion.fieldMapping.userFieldName}</strong> equals{' '}
                          <strong>"{criterion.fieldMapping.expectedValue}"</strong>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={criterion.isActive}
                      onCheckedChange={() => handleToggleActive(criterion.id)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium">{criterion.usageCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingCriterion(criterion)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteCriterion(criterion.id)}
                          disabled={criterion.usageCount > 0}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>

        {filteredCriteria.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <Filter className="mx-auto mb-2 h-10 w-10 opacity-30" />
            <p>No criteria found matching your filters</p>
          </div>
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      <CreateCriterionModal
        isOpen={isCreateModalOpen || !!editingCriterion}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingCriterion(null);
        }}
        onSubmit={editingCriterion ? handleUpdateCriterion : handleCreateCriterion}
        criterion={editingCriterion}
        existingCodes={criteria.map(c => c.criterionCode)}
      />
    </ModuleLayout>
  );
}
