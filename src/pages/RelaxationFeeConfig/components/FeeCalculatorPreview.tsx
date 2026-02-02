import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, X, Info, Link2 } from 'lucide-react';
import { CriterionBadge } from './CriterionBadge';
import type { RelaxationPolicy, CombinationRule, RelaxationCriterion } from '../types';
import { calculateFee } from '../data/mockData';

interface FeeCalculatorPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  baseFee: number;
  policies: RelaxationPolicy[];
  combinationRules: CombinationRule[];
  gstApplicable: boolean;
  gstPercentage: number;
  onCreateCombinationRule?: (criteriaIds: string[]) => void;
}

export function FeeCalculatorPreview({
  isOpen,
  onClose,
  baseFee,
  policies,
  combinationRules,
  gstApplicable,
  gstPercentage,
  onCreateCombinationRule,
}: FeeCalculatorPreviewProps) {
  const [selectedCriteriaIds, setSelectedCriteriaIds] = useState<string[]>([]);

  const enabledPolicies = useMemo(() => 
    policies.filter(p => p.isEnabled), 
    [policies]
  );

  const calculation = useMemo(() => {
    if (selectedCriteriaIds.length === 0) return null;
    
    return calculateFee(
      baseFee,
      selectedCriteriaIds,
      policies,
      combinationRules,
      gstApplicable,
      gstPercentage
    );
  }, [baseFee, selectedCriteriaIds, policies, combinationRules, gstApplicable, gstPercentage]);

  const toggleCriterion = (criterionId: string) => {
    setSelectedCriteriaIds(prev =>
      prev.includes(criterionId)
        ? prev.filter(id => id !== criterionId)
        : [...prev, criterionId]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const canCreateCombinationRule = useMemo(() => {
    if (selectedCriteriaIds.length < 2) return false;
    
    // Check if rule already exists for this combination
    const selectedSet = new Set(selectedCriteriaIds);
    const exists = combinationRules.some(rule => {
      const ruleSet = new Set(rule.criteriaIds);
      return ruleSet.size === selectedSet.size && [...ruleSet].every(id => selectedSet.has(id));
    });
    
    return !exists;
  }, [selectedCriteriaIds, combinationRules]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-4">
            <div className="flex items-center gap-3 text-white">
              <Calculator className="h-5 w-5" />
              <span className="font-semibold">Fee Calculator Preview</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex h-[calc(100%-60px)] flex-col overflow-hidden">
            {/* Base Fee Display */}
            <div className="border-b bg-slate-50 px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Base Fee</span>
                <span className="text-xl font-bold text-foreground">
                  {formatCurrency(baseFee)}
                </span>
              </div>
            </div>

            {/* Criteria Selection */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <h4 className="mb-3 text-sm font-medium text-foreground">
                Select Applicant Criteria:
              </h4>
              <div className="space-y-2">
                {enabledPolicies.map((policy) => (
                  <label
                    key={policy.criterionId}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all',
                      selectedCriteriaIds.includes(policy.criterionId)
                        ? 'border-teal-300 bg-teal-50'
                        : 'border-border hover:border-muted-foreground/50 hover:bg-muted/50'
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
                      <Badge variant="secondary" className="text-xs">
                        {policy.relaxationPercent}%
                      </Badge>
                    </div>
                  </label>
                ))}
              </div>

              {/* Calculation Display */}
              <AnimatePresence mode="wait">
                {calculation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-6"
                  >
                    <Separator className="mb-4" />
                    <h4 className="mb-3 text-sm font-medium text-foreground">
                      Calculation:
                    </h4>

                    <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                      {/* Base Fee */}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Base Fee:</span>
                        <span className="font-medium">{formatCurrency(baseFee)}</span>
                      </div>

                      {/* Relaxations */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-medium text-muted-foreground">
                          Relaxations Applied:
                        </span>
                        {selectedCriteriaIds.map((id) => {
                          const policy = policies.find(p => p.criterionId === id);
                          if (!policy) return null;
                          const amount = Math.round((baseFee * policy.relaxationPercent) / 100);
                          return (
                            <div key={id} className="flex justify-between text-sm pl-3">
                              <span className="text-muted-foreground">
                                • {policy.criterion.criterionName} ({policy.relaxationPercent}%):
                              </span>
                              <span className="text-red-600 font-medium">
                                -{formatCurrency(amount)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Combination Rule Notice */}
                      {calculation.appliedRule && (
                        <div className="flex items-start gap-2 rounded bg-amber-50 p-2 text-xs">
                          <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span className="text-amber-800">
                            Combination rule applied: {calculation.totalDiscount}% instead of summing individual percentages.
                          </span>
                        </div>
                      )}

                      {!calculation.appliedRule && selectedCriteriaIds.length > 1 && (
                        <div className="flex items-start gap-2 rounded bg-blue-50 p-2 text-xs">
                          <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-blue-800">
                            Using SUM method ({calculation.totalDiscount}%). No custom combination rule exists.
                          </span>
                        </div>
                      )}

                      <Separator />

                      {/* Subtotal */}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-medium">{formatCurrency(calculation.feeAfterDiscount)}</span>
                      </div>

                      {/* GST */}
                      {gstApplicable && (
                        <div className="space-y-1.5">
                          <span className="text-xs font-medium text-muted-foreground">
                            GST (INTRA_STATE):
                          </span>
                          <div className="flex justify-between text-sm pl-3">
                            <span className="text-muted-foreground">
                              • CGST ({gstPercentage / 2}%):
                            </span>
                            <span className="font-medium">{formatCurrency(calculation.cgst)}</span>
                          </div>
                          <div className="flex justify-between text-sm pl-3">
                            <span className="text-muted-foreground">
                              • SGST ({gstPercentage / 2}%):
                            </span>
                            <span className="font-medium">{formatCurrency(calculation.sgst)}</span>
                          </div>
                        </div>
                      )}

                      <Separator />

                      {/* Total */}
                      <div className="flex justify-between pt-1">
                        <span className="font-semibold text-foreground">TOTAL PAYABLE:</span>
                        <span className="text-xl font-bold text-teal-600">
                          {formatCurrency(calculation.totalPayable)}
                        </span>
                      </div>
                    </div>

                    {/* Create Combination Rule CTA */}
                    {canCreateCombinationRule && onCreateCombinationRule && (
                      <Button
                        variant="outline"
                        className="mt-4 w-full gap-2"
                        onClick={() => onCreateCombinationRule(selectedCriteriaIds)}
                      >
                        <Link2 className="h-4 w-4" />
                        Create Combination Rule
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty State */}
              {!calculation && (
                <div className="mt-8 text-center text-sm text-muted-foreground">
                  <Calculator className="mx-auto mb-2 h-10 w-10 opacity-30" />
                  <p>Select criteria above to see fee calculation</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
