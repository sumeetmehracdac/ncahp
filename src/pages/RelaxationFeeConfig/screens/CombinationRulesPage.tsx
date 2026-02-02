import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleLayout } from '../components/ModuleLayout';
import { CriterionBadge } from '../components/CriterionBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Pencil,
  Trash2,
  Layers,
  Calculator,
  IndianRupee,
  Eye,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  Info,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import {
  mockCombinationRules,
  mockRelaxationPolicies,
  mockNationalFeeConfigs,
  mockSCAdminContext,
  calculateFee,
} from '../data/mockData';
import {
  REGISTRATION_TYPES,
  type CombinationRule,
  type ApplicationMethod,
} from '../types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CombinationRulesPage() {
  const [selectedRegType, setSelectedRegType] = useState('reg-1');
  const [rules, setRules] = useState(mockCombinationRules);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CombinationRule | null>(null);

  const filteredRules = useMemo(
    () => rules.filter(r => r.registrationTypeId === selectedRegType),
    [rules, selectedRegType]
  );

  const nationalConfig = mockNationalFeeConfigs.find(c => c.registrationTypeId === selectedRegType);
  const baseFee = nationalConfig?.defaultAmount || 5000;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
    toast.success('Combination rule deleted');
  };

  const handleCreateRule = (data: Partial<CombinationRule>) => {
    const newRule: CombinationRule = {
      id: `combo-${Date.now()}`,
      councilId: mockSCAdminContext.councilId || '',
      registrationTypeId: selectedRegType,
      criteriaIds: data.criteriaIds || [],
      criteria: data.criteria || [],
      applicationMethod: data.applicationMethod || 'CUSTOM',
      combinedPercent: data.combinedPercent || 0,
      minFinalAmount: data.minFinalAmount || 0,
      effectiveFrom: data.effectiveFrom || new Date().toISOString(),
      estimatedUsersAffected: Math.floor(Math.random() * 300) + 50,
      estimatedAnnualImpact: Math.floor(Math.random() * 50000) + 10000,
      status: 'ACTIVE',
      changeReason: data.changeReason,
      createdAt: new Date().toISOString(),
    };
    setRules(prev => [...prev, newRule]);
    setIsCreateModalOpen(false);
    toast.success('Combination rule created successfully');
  };

  const handleUpdateRule = (data: Partial<CombinationRule>) => {
    if (!editingRule) return;
    setRules(prev =>
      prev.map(r =>
        r.id === editingRule.id ? { ...r, ...data } : r
      )
    );
    setEditingRule(null);
    toast.success('Combination rule updated');
  };

  return (
    <ModuleLayout
      adminContext={mockSCAdminContext}
      title={`Combination Rules - ${mockSCAdminContext.councilName}`}
      subtitle="Define custom discounts for multiple criteria"
      actions={
        <>
          <Badge variant="secondary" className="gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            {filteredRules.length} Rules
          </Badge>
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
          >
            <Plus className="h-4 w-4" />
            Create New Rule
          </Button>
        </>
      }
    >
      {/* Registration Type Selector */}
      <div className="mb-6 flex items-center gap-3">
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

      {/* Rules Cards */}
      {filteredRules.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredRules.map((rule, index) => {
            const sumPercent = rule.criteria.reduce((sum, c) => {
              const policy = mockRelaxationPolicies.find(p => p.criterionId === c.id);
              return sum + (policy?.relaxationPercent || 0);
            }, 0);

            const discountDiff = sumPercent - rule.combinedPercent;

            return (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          Rule #{index + 1}:
                          <span className="text-muted-foreground font-normal">
                            {rule.criteria.map(c => c.criterionName).join(' + ')}
                          </span>
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingRule(rule)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Criteria Badges */}
                    <div className="flex flex-wrap gap-2">
                      {rule.criteria.map(c => (
                        <CriterionBadge
                          key={c.id}
                          category={c.category}
                          name={c.criterionName}
                          size="sm"
                        />
                      ))}
                    </div>

                    {/* Comparison */}
                    <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Instead of:</p>
                        <p className="text-lg font-semibold text-foreground line-through decoration-muted-foreground">
                          {sumPercent}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ({rule.criteria
                            .map(c => {
                              const policy = mockRelaxationPolicies.find(p => p.criterionId === c.id);
                              return `${policy?.relaxationPercent || 0}%`;
                            })
                            .join(' + ')})
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Apply:</p>
                        <p className="text-lg font-bold text-teal-600">{rule.combinedPercent}%</p>
                        <p className="text-xs text-muted-foreground">
                          ({rule.applicationMethod === 'CUSTOM' ? 'Custom' : 'Sum'})
                        </p>
                      </div>
                    </div>

                    {/* Savings info */}
                    {discountDiff > 0 && (
                      <div className="flex items-center gap-2 text-sm text-emerald-700">
                        <TrendingUp className="h-4 w-4" />
                        <span>
                          {discountDiff}% less discount = {formatCurrency((baseFee * discountDiff) / 100)} more
                          revenue/applicant
                        </span>
                      </div>
                    )}

                    <Separator />

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            rule.applicationMethod === 'CUSTOM'
                              ? 'border-purple-200 text-purple-700'
                              : 'border-blue-200 text-blue-700'
                          )}
                        >
                          {rule.applicationMethod}
                        </Badge>
                        <span className="text-muted-foreground">
                          Min: {formatCurrency(rule.minFinalAmount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(rule.effectiveFrom)}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        ~{rule.estimatedUsersAffected} affected
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        <Eye className="h-3.5 w-3.5" />
                        View Calculations
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-dashed bg-muted/30 p-12 text-center"
        >
          <Layers className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-medium text-foreground">No Combination Rules</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a rule to define custom discounts when multiple criteria apply
          </p>
          <Button
            className="mt-4 gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create First Rule
          </Button>
        </motion.div>
      )}

      {/* Create/Edit Modal */}
      <CreateCombinationRuleModal
        isOpen={isCreateModalOpen || !!editingRule}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingRule(null);
        }}
        onSubmit={editingRule ? handleUpdateRule : handleCreateRule}
        rule={editingRule}
        baseFee={baseFee}
        registrationTypeId={selectedRegType}
        existingRules={rules}
      />
    </ModuleLayout>
  );
}

// Create Combination Rule Modal
interface CreateCombinationRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<CombinationRule>) => void;
  rule?: CombinationRule | null;
  baseFee: number;
  registrationTypeId: string;
  existingRules: CombinationRule[];
}

function CreateCombinationRuleModal({
  isOpen,
  onClose,
  onSubmit,
  rule,
  baseFee,
  registrationTypeId,
  existingRules,
}: CreateCombinationRuleModalProps) {
  const isEditing = !!rule;

  const [selectedCriteriaIds, setSelectedCriteriaIds] = useState<string[]>(
    rule?.criteriaIds || []
  );
  const [applicationMethod, setApplicationMethod] = useState<ApplicationMethod>(
    rule?.applicationMethod || 'CUSTOM'
  );
  const [combinedPercent, setCombinedPercent] = useState(rule?.combinedPercent || 0);
  const [minFinalAmount, setMinFinalAmount] = useState(rule?.minFinalAmount || 0);
  const [effectiveFrom, setEffectiveFrom] = useState(
    rule?.effectiveFrom?.split('T')[0] || new Date().toISOString().split('T')[0]
  );
  const [changeReason, setChangeReason] = useState(rule?.changeReason || '');

  // Reset when modal opens/closes
  useState(() => {
    if (isOpen && rule) {
      setSelectedCriteriaIds(rule.criteriaIds);
      setApplicationMethod(rule.applicationMethod);
      setCombinedPercent(rule.combinedPercent);
      setMinFinalAmount(rule.minFinalAmount);
      setEffectiveFrom(rule.effectiveFrom.split('T')[0]);
      setChangeReason(rule.changeReason || '');
    } else if (isOpen && !rule) {
      setSelectedCriteriaIds([]);
      setApplicationMethod('CUSTOM');
      setCombinedPercent(0);
      setMinFinalAmount(0);
      setEffectiveFrom(new Date().toISOString().split('T')[0]);
      setChangeReason('');
    }
  });

  const enabledPolicies = mockRelaxationPolicies.filter(
    p => p.registrationTypeId === registrationTypeId && p.isEnabled
  );

  const sumPercent = useMemo(() => {
    return selectedCriteriaIds.reduce((sum, id) => {
      const policy = enabledPolicies.find(p => p.criterionId === id);
      return sum + (policy?.relaxationPercent || 0);
    }, 0);
  }, [selectedCriteriaIds, enabledPolicies]);

  const selectedCriteria = useMemo(() => {
    return selectedCriteriaIds.map(id => {
      const policy = enabledPolicies.find(p => p.criterionId === id);
      return policy?.criterion;
    }).filter(Boolean);
  }, [selectedCriteriaIds, enabledPolicies]);

  const toggleCriterion = (criterionId: string) => {
    setSelectedCriteriaIds(prev =>
      prev.includes(criterionId)
        ? prev.filter(id => id !== criterionId)
        : [...prev, criterionId]
    );
  };

  // Check for duplicate combination
  const isDuplicate = useMemo(() => {
    if (selectedCriteriaIds.length < 2) return false;
    const selectedSet = new Set(selectedCriteriaIds);
    
    return existingRules.some(r => {
      if (isEditing && r.id === rule?.id) return false;
      const ruleSet = new Set(r.criteriaIds);
      return ruleSet.size === selectedSet.size && [...ruleSet].every(id => selectedSet.has(id));
    });
  }, [selectedCriteriaIds, existingRules, isEditing, rule]);

  const isValid =
    selectedCriteriaIds.length >= 2 &&
    combinedPercent >= 0 &&
    combinedPercent <= 100 &&
    !isDuplicate;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);

  const withoutRuleAmount = baseFee - (baseFee * sumPercent) / 100;
  const withRuleAmount = baseFee - (baseFee * combinedPercent) / 100;
  const difference = withRuleAmount - withoutRuleAmount;

  const handleSubmit = () => {
    if (!isValid) return;

    onSubmit({
      criteriaIds: selectedCriteriaIds,
      criteria: selectedCriteria as any,
      applicationMethod,
      combinedPercent: applicationMethod === 'SUM' ? sumPercent : combinedPercent,
      minFinalAmount,
      effectiveFrom: new Date(effectiveFrom).toISOString(),
      changeReason,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Combination Rule' : 'Create Combination Rule'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Select Criteria */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-xs font-medium text-teal-700">
                1
              </span>
              Select Criteria to Combine
            </h4>

            <div className="space-y-2 rounded-lg border p-3">
              {enabledPolicies.map(policy => (
                <label
                  key={policy.criterionId}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all',
                    selectedCriteriaIds.includes(policy.criterionId)
                      ? 'border-teal-300 bg-teal-50'
                      : 'border-transparent bg-muted/50 hover:bg-muted'
                  )}
                >
                  <Checkbox
                    checked={selectedCriteriaIds.includes(policy.criterionId)}
                    onCheckedChange={() => toggleCriterion(policy.criterionId)}
                  />
                  <div className="flex flex-1 items-center justify-between">
                    <CriterionBadge
                      category={policy.criterion.category}
                      name={policy.criterion.criterionName}
                      size="sm"
                    />
                    <Badge variant="secondary">{policy.relaxationPercent}%</Badge>
                  </div>
                </label>
              ))}
            </div>

            {selectedCriteriaIds.length >= 2 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Selected:</span>
                <span className="font-medium">
                  {selectedCriteria.map(c => c?.criterionName).join(' + ')}
                </span>
              </div>
            )}

            {isDuplicate && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                A rule already exists for this combination
              </div>
            )}
          </div>

          <Separator />

          {/* Step 2: Define Custom Discount */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-xs font-medium text-teal-700">
                2
              </span>
              Define Custom Discount
            </h4>

            <div className="space-y-3">
              <Label>Application Method</Label>
              <RadioGroup
                value={applicationMethod}
                onValueChange={v => setApplicationMethod(v as ApplicationMethod)}
                className="grid grid-cols-2 gap-3"
              >
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all',
                    applicationMethod === 'SUM' && 'border-teal-300 bg-teal-50'
                  )}
                >
                  <RadioGroupItem value="SUM" />
                  <div>
                    <p className="font-medium">SUM</p>
                    <p className="text-xs text-muted-foreground">Add percentages ({sumPercent}%)</p>
                  </div>
                </label>
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all',
                    applicationMethod === 'CUSTOM' && 'border-teal-300 bg-teal-50'
                  )}
                >
                  <RadioGroupItem value="CUSTOM" />
                  <div>
                    <p className="font-medium">CUSTOM</p>
                    <p className="text-xs text-muted-foreground">Set custom percentage</p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {applicationMethod === 'CUSTOM' && (
              <div className="space-y-2">
                <Label>Custom Combined Percentage</Label>
                <div className="relative w-32">
                  <Input
                    type="number"
                    value={combinedPercent}
                    onChange={e => setCombinedPercent(parseInt(e.target.value) || 0)}
                    min={0}
                    max={100}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
                {combinedPercent < sumPercent && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Offering {sumPercent - combinedPercent}% less than SUM to balance budget
                  </p>
                )}
                {combinedPercent > sumPercent && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Custom % is higher than SUM ({sumPercent}%)
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>Minimum Final Amount</Label>
              <div className="relative w-40">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  value={minFinalAmount}
                  onChange={e => setMinFinalAmount(parseInt(e.target.value) || 0)}
                  min={0}
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Lowest fee after this discount is applied
              </p>
            </div>
          </div>

          <Separator />

          {/* Step 3: Preview */}
          {selectedCriteriaIds.length >= 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-xs font-medium text-teal-700">
                  3
                </span>
                Preview & Schedule
              </h4>

              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Example Calculation (Base Fee: {formatCurrency(baseFee)}):
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Without Rule:</p>
                    <p className="font-medium">Base: {formatCurrency(baseFee)}</p>
                    <p className="text-red-600">Discount: {sumPercent}% ({formatCurrency((baseFee * sumPercent) / 100)})</p>
                    <p className="font-semibold">After: {formatCurrency(withoutRuleAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">With This Rule:</p>
                    <p className="font-medium">Base: {formatCurrency(baseFee)}</p>
                    <p className="text-red-600">
                      Discount: {applicationMethod === 'SUM' ? sumPercent : combinedPercent}% (
                      {formatCurrency((baseFee * (applicationMethod === 'SUM' ? sumPercent : combinedPercent)) / 100)})
                    </p>
                    <p className="font-semibold text-teal-600">After: {formatCurrency(withRuleAmount)}</p>
                  </div>
                </div>

                {difference > 0 && (
                  <div className="flex items-center gap-2 rounded bg-emerald-50 p-2 text-sm text-emerald-700">
                    <TrendingUp className="h-4 w-4" />
                    {formatCurrency(difference)} more revenue per applicant
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Effective From</Label>
                  <Input
                    type="date"
                    value={effectiveFrom}
                    onChange={e => setEffectiveFrom(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reason for Rule</Label>
                <Textarea
                  placeholder="Strategic discount policy..."
                  value={changeReason}
                  onChange={e => setChangeReason(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
          >
            {isEditing ? 'Update Rule' : 'Create Rule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
