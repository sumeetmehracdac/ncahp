import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleLayout } from '../components/ModuleLayout';
import { CriterionBadge, CategoryBadge } from '../components/CriterionBadge';
import { FeeCalculatorPreview } from '../components/FeeCalculatorPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
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
  Save,
  RotateCcw,
  Calculator,
  CheckCircle2,
  Info,
  IndianRupee,
  Percent,
} from 'lucide-react';
import {
  mockCriteria,
  mockRelaxationPolicies,
  mockCombinationRules,
  mockNationalFeeConfigs,
  mockSCAdminContext,
} from '../data/mockData';
import { REGISTRATION_TYPES, type RelaxationPolicy } from '../types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function RelaxationPoliciesPage() {
  const [selectedRegType, setSelectedRegType] = useState('reg-1');
  const [policies, setPolicies] = useState(mockRelaxationPolicies);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    [key: string]: { isEnabled: boolean; relaxationPercent: number; minFinalAmount: number };
  }>({});
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const activeCriteria = useMemo(() => mockCriteria.filter(c => c.isActive), []);

  // Build policy data with criteria that might not have policies yet
  const policyData = useMemo(() => {
    return activeCriteria.map(criterion => {
      const existingPolicy = policies.find(
        p => p.criterionId === criterion.id && p.registrationTypeId === selectedRegType
      );

      const editValue = editValues[criterion.id];

      return {
        criterion,
        policy: existingPolicy,
        isEnabled: editValue?.isEnabled ?? existingPolicy?.isEnabled ?? false,
        relaxationPercent: editValue?.relaxationPercent ?? existingPolicy?.relaxationPercent ?? 0,
        minFinalAmount: editValue?.minFinalAmount ?? existingPolicy?.minFinalAmount ?? 0,
        isModified: !!editValue,
      };
    });
  }, [activeCriteria, policies, selectedRegType, editValues]);

  const enabledPoliciesForCalc = useMemo(() => {
    return policyData
      .filter(p => p.isEnabled)
      .map(p => ({
        id: `calc-${p.criterion.id}`,
        councilId: mockSCAdminContext.councilId || '',
        registrationTypeId: selectedRegType,
        criterionId: p.criterion.id,
        criterion: p.criterion,
        isEnabled: true,
        relaxationPercent: p.relaxationPercent,
        minFinalAmount: p.minFinalAmount,
        effectiveFrom: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })) as RelaxationPolicy[];
  }, [policyData, selectedRegType]);

  const nationalConfig = mockNationalFeeConfigs.find(c => c.registrationTypeId === selectedRegType);
  const baseFee = nationalConfig?.defaultAmount || 5000;

  const handleToggleEnabled = (criterionId: string, enabled: boolean) => {
    const current = policyData.find(p => p.criterion.id === criterionId);
    if (!current) return;

    setEditValues(prev => ({
      ...prev,
      [criterionId]: {
        isEnabled: enabled,
        relaxationPercent: prev[criterionId]?.relaxationPercent ?? current.relaxationPercent,
        minFinalAmount: prev[criterionId]?.minFinalAmount ?? current.minFinalAmount,
      },
    }));
  };

  const handleUpdatePercent = (criterionId: string, value: number) => {
    const current = policyData.find(p => p.criterion.id === criterionId);
    if (!current) return;

    setEditValues(prev => ({
      ...prev,
      [criterionId]: {
        isEnabled: prev[criterionId]?.isEnabled ?? current.isEnabled,
        relaxationPercent: Math.min(100, Math.max(0, value)),
        minFinalAmount: prev[criterionId]?.minFinalAmount ?? current.minFinalAmount,
      },
    }));
  };

  const handleUpdateMinFinal = (criterionId: string, value: number) => {
    const current = policyData.find(p => p.criterion.id === criterionId);
    if (!current) return;

    setEditValues(prev => ({
      ...prev,
      [criterionId]: {
        isEnabled: prev[criterionId]?.isEnabled ?? current.isEnabled,
        relaxationPercent: prev[criterionId]?.relaxationPercent ?? current.relaxationPercent,
        minFinalAmount: Math.max(0, value),
      },
    }));
  };

  const handleSaveRow = (criterionId: string) => {
    const editValue = editValues[criterionId];
    if (!editValue) return;

    // In real app, this would save to backend
    setPolicies(prev => {
      const existing = prev.find(
        p => p.criterionId === criterionId && p.registrationTypeId === selectedRegType
      );
      
      if (existing) {
        return prev.map(p =>
          p.criterionId === criterionId && p.registrationTypeId === selectedRegType
            ? {
                ...p,
                isEnabled: editValue.isEnabled,
                relaxationPercent: editValue.relaxationPercent,
                minFinalAmount: editValue.minFinalAmount,
                updatedAt: new Date().toISOString(),
              }
            : p
        );
      } else {
        const criterion = activeCriteria.find(c => c.id === criterionId);
        if (!criterion) return prev;
        
        return [
          ...prev,
          {
            id: `pol-${Date.now()}`,
            councilId: mockSCAdminContext.councilId || '',
            registrationTypeId: selectedRegType,
            criterionId,
            criterion,
            ...editValue,
            effectiveFrom: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
      }
    });

    const criterion = activeCriteria.find(c => c.id === criterionId);
    toast.success(`Policy saved for ${criterion?.criterionName}`);

    setEditValues(prev => {
      const newValues = { ...prev };
      delete newValues[criterionId];
      return newValues;
    });
    setEditingRowId(null);
  };

  const handleSaveAll = () => {
    Object.keys(editValues).forEach(criterionId => handleSaveRow(criterionId));
    toast.success('All changes saved');
  };

  const handleResetAll = () => {
    setEditValues({});
    setSelectedRows([]);
    toast.info('Changes reset');
  };

  const handleBulkEnable = () => {
    selectedRows.forEach(criterionId => {
      const current = policyData.find(p => p.criterion.id === criterionId);
      if (current) {
        setEditValues(prev => ({
          ...prev,
          [criterionId]: {
            isEnabled: true,
            relaxationPercent: prev[criterionId]?.relaxationPercent ?? current.relaxationPercent,
            minFinalAmount: prev[criterionId]?.minFinalAmount ?? current.minFinalAmount,
          },
        }));
      }
    });
  };

  const handleBulkDisable = () => {
    selectedRows.forEach(criterionId => {
      const current = policyData.find(p => p.criterion.id === criterionId);
      if (current) {
        setEditValues(prev => ({
          ...prev,
          [criterionId]: {
            isEnabled: false,
            relaxationPercent: prev[criterionId]?.relaxationPercent ?? current.relaxationPercent,
            minFinalAmount: prev[criterionId]?.minFinalAmount ?? current.minFinalAmount,
          },
        }));
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === policyData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(policyData.map(p => p.criterion.id));
    }
  };

  const toggleSelectRow = (criterionId: string) => {
    setSelectedRows(prev =>
      prev.includes(criterionId)
        ? prev.filter(id => id !== criterionId)
        : [...prev, criterionId]
    );
  };

  const hasChanges = Object.keys(editValues).length > 0;
  const enabledCount = policyData.filter(p => p.isEnabled).length;

  return (
    <ModuleLayout
      adminContext={mockSCAdminContext}
      title={`Relaxation Policies - ${mockSCAdminContext.councilName}`}
      subtitle="Set discounts for different applicant categories"
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCalculatorOpen(true)}
            className="gap-2"
          >
            <Calculator className="h-4 w-4" />
            Preview Calculator
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetAll}
            disabled={!hasChanges}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSaveAll}
            disabled={!hasChanges}
            className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
          >
            <Save className="h-4 w-4" />
            Save All Changes
          </Button>
        </>
      }
    >
      {/* Registration Type Selector */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Registration Type:</span>
          <Select value={selectedRegType} onValueChange={setSelectedRegType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGISTRATION_TYPES.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            {enabledCount} of {policyData.length} enabled
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <IndianRupee className="h-3.5 w-3.5" />
            Base Fee: ₹{baseFee.toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 flex items-center gap-3 rounded-lg border bg-muted/50 p-3"
          >
            <span className="text-sm font-medium">{selectedRows.length} selected</span>
            <Button variant="outline" size="sm" onClick={handleBulkEnable}>
              Enable Selected
            </Button>
            <Button variant="outline" size="sm" onClick={handleBulkDisable}>
              Disable Selected
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Policies Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border bg-white shadow-sm overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedRows.length === policyData.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[200px]">Criterion</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center w-[100px]">Enabled</TableHead>
              <TableHead className="w-[120px]">
                <div className="flex items-center gap-1">
                  <Percent className="h-3.5 w-3.5" />
                  Discount
                </div>
              </TableHead>
              <TableHead className="w-[140px]">
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5" />
                  Min Final
                </div>
              </TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policyData.map((row, index) => (
              <motion.tr
                key={row.criterion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={cn(
                  'group transition-colors',
                  row.isModified && 'bg-amber-50/50',
                  selectedRows.includes(row.criterion.id) && 'bg-teal-50/50'
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(row.criterion.id)}
                    onCheckedChange={() => toggleSelectRow(row.criterion.id)}
                  />
                </TableCell>
                <TableCell>
                  <CriterionBadge
                    category={row.criterion.category}
                    name={row.criterion.criterionName}
                    size="md"
                  />
                </TableCell>
                <TableCell>
                  <CategoryBadge category={row.criterion.category} />
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={row.isEnabled}
                    onCheckedChange={checked =>
                      handleToggleEnabled(row.criterion.id, checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="relative">
                    <Input
                      type="number"
                      value={row.relaxationPercent}
                      onChange={e =>
                        handleUpdatePercent(row.criterion.id, parseInt(e.target.value) || 0)
                      }
                      disabled={!row.isEnabled}
                      className="h-9 w-20 pr-7 text-center"
                      min={0}
                      max={100}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      type="number"
                      value={row.minFinalAmount}
                      onChange={e =>
                        handleUpdateMinFinal(row.criterion.id, parseInt(e.target.value) || 0)
                      }
                      disabled={!row.isEnabled}
                      className="h-9 w-24 pl-6"
                      min={0}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveRow(row.criterion.id)}
                    disabled={!row.isModified}
                    className={cn(
                      'h-8 opacity-0 group-hover:opacity-100 transition-opacity',
                      row.isModified && 'opacity-100'
                    )}
                  >
                    Save
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>

        {/* Info Footer */}
        <div className="border-t bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            <span>
              Changes are highlighted in yellow. Click "Save" on individual rows or "Save All Changes" to persist.
            </span>
          </div>
        </div>
      </motion.div>

      {/* Fee Calculator Preview */}
      <FeeCalculatorPreview
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        baseFee={baseFee}
        policies={enabledPoliciesForCalc}
        combinationRules={mockCombinationRules}
        gstApplicable={nationalConfig?.gstApplicable || false}
        gstPercentage={nationalConfig?.gstPercentage || 18}
      />
    </ModuleLayout>
  );
}
