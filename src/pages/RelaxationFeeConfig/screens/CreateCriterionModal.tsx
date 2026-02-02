import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Check, Info, Link2, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CATEGORY_CONFIG,
  FIELD_OPTIONS,
  type RelaxationCriterion,
  type CriterionCategory,
} from '../types';

interface CreateCriterionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<RelaxationCriterion>) => void;
  criterion?: RelaxationCriterion | null;
  existingCodes: string[];
}

export function CreateCriterionModal({
  isOpen,
  onClose,
  onSubmit,
  criterion,
  existingCodes,
}: CreateCriterionModalProps) {
  const isEditing = !!criterion;
  
  const [formData, setFormData] = useState({
    criterionName: '',
    criterionCode: '',
    category: '' as CriterionCategory | '',
    userFieldName: '',
    expectedValue: '',
    description: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTestingQuery, setIsTestingQuery] = useState(false);
  const [testResult, setTestResult] = useState<number | null>(null);

  // Reset form when opening/closing or switching criteria
  useEffect(() => {
    if (isOpen) {
      if (criterion) {
        setFormData({
          criterionName: criterion.criterionName,
          criterionCode: criterion.criterionCode,
          category: criterion.category,
          userFieldName: criterion.fieldMapping.userFieldName,
          expectedValue: criterion.fieldMapping.expectedValue,
          description: criterion.description || '',
          isActive: criterion.isActive,
        });
      } else {
        setFormData({
          criterionName: '',
          criterionCode: '',
          category: '',
          userFieldName: '',
          expectedValue: '',
          description: '',
          isActive: true,
        });
      }
      setErrors({});
      setTestResult(null);
    }
  }, [isOpen, criterion]);

  // Auto-generate code from name
  useEffect(() => {
    if (!isEditing && formData.criterionName && !formData.criterionCode) {
      const code = formData.criterionName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .substring(0, 20);
      setFormData(prev => ({ ...prev, criterionCode: code }));
    }
  }, [formData.criterionName, isEditing]);

  // Auto-set field name when category changes
  useEffect(() => {
    if (formData.category && formData.category in FIELD_OPTIONS) {
      const fieldInfo = FIELD_OPTIONS[formData.category as CriterionCategory];
      setFormData(prev => ({
        ...prev,
        userFieldName: fieldInfo.field,
        expectedValue: '',
      }));
    }
  }, [formData.category]);

  const fieldValues = useMemo(() => {
    if (formData.category && formData.category in FIELD_OPTIONS) {
      return FIELD_OPTIONS[formData.category as CriterionCategory].values;
    }
    return [];
  }, [formData.category]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.criterionName || formData.criterionName.length < 2) {
      newErrors.criterionName = 'Name must be at least 2 characters';
    } else if (formData.criterionName.length > 50) {
      newErrors.criterionName = 'Name must be less than 50 characters';
    }

    if (!formData.criterionCode || formData.criterionCode.length < 2) {
      newErrors.criterionCode = 'Code must be at least 2 characters';
    } else if (!/^[A-Z0-9_]+$/.test(formData.criterionCode)) {
      newErrors.criterionCode = 'Code must be uppercase letters, numbers, and underscores only';
    } else if (
      existingCodes.includes(formData.criterionCode) &&
      formData.criterionCode !== criterion?.criterionCode
    ) {
      newErrors.criterionCode = 'This code already exists';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.expectedValue) {
      newErrors.expectedValue = 'Please select an expected value';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestQuery = async () => {
    setIsTestingQuery(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setTestResult(Math.floor(Math.random() * 2000) + 100);
    setIsTestingQuery(false);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      criterionName: formData.criterionName,
      criterionCode: formData.criterionCode,
      category: formData.category as CriterionCategory,
      fieldMapping: {
        userFieldName: formData.userFieldName,
        expectedValue: formData.expectedValue,
      },
      description: formData.description || undefined,
      isActive: formData.isActive,
    });
  };

  const categories = Object.keys(CATEGORY_CONFIG) as CriterionCategory[];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? 'Edit Relaxation Criterion' : 'Create New Relaxation Criterion'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              Basic Information
            </h4>

            <div className="space-y-2">
              <Label htmlFor="criterionName">
                Criterion Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="criterionName"
                placeholder="e.g., Woman, Senior Citizen"
                value={formData.criterionName}
                onChange={e => setFormData(prev => ({ ...prev, criterionName: e.target.value }))}
                className={cn(errors.criterionName && 'border-destructive')}
              />
              {errors.criterionName ? (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.criterionName}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  This will be displayed to state councils
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="criterionCode">
                Criterion Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="criterionCode"
                placeholder="AUTO_GENERATED"
                value={formData.criterionCode}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    criterionCode: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''),
                  }))
                }
                className={cn('font-mono', errors.criterionCode && 'border-destructive')}
              />
              {errors.criterionCode ? (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.criterionCode}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Unique identifier, uppercase, no spaces
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, category: value as CriterionCategory }))
                }
              >
                <SelectTrigger className={cn(errors.category && 'border-destructive')}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      <span className="flex items-center gap-2">
                        <span>{CATEGORY_CONFIG[cat].icon}</span>
                        <span>{CATEGORY_CONFIG[cat].label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.category}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this relaxation criterion..."
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <Separator />

          {/* Field Mapping */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Link2 className="h-4 w-4 text-teal-500" />
              Field Mapping
              <span className="text-xs font-normal text-muted-foreground">
                (defines how to check eligibility)
              </span>
            </h4>

            <div className="space-y-2">
              <Label htmlFor="userFieldName">User Table Field</Label>
              <Input
                id="userFieldName"
                value={formData.userFieldName}
                disabled
                className="bg-muted font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Auto-populated based on Category selection
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedValue">
                Expected Value <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.expectedValue}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, expectedValue: value }))
                }
                disabled={!formData.category}
              >
                <SelectTrigger className={cn(errors.expectedValue && 'border-destructive')}>
                  <SelectValue placeholder="Select expected value" />
                </SelectTrigger>
                <SelectContent>
                  {fieldValues.map(val => (
                    <SelectItem key={val} value={val}>
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.expectedValue && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.expectedValue}
                </p>
              )}
            </div>

            {/* Preview Box */}
            <AnimatePresence>
              {formData.userFieldName && formData.expectedValue && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg border bg-slate-50 p-4 space-y-3"
                >
                  <div className="flex items-start gap-2 text-sm">
                    <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">
                        This criterion will match users where:
                      </p>
                      <code className="mt-1 block text-xs bg-white px-2 py-1 rounded border">
                        user.{formData.userFieldName} == "{formData.expectedValue}"
                      </code>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleTestQuery}
                      disabled={isTestingQuery}
                      className="gap-2"
                    >
                      {isTestingQuery ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Search className="h-3.5 w-3.5" />
                      )}
                      Test Query
                    </Button>

                    {testResult !== null && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-sm text-emerald-700"
                      >
                        <Check className="h-4 w-4" />
                        ~{testResult.toLocaleString()} users match
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Separator />

          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Active Status</Label>
              <p className="text-xs text-muted-foreground">
                Criterion available for state councils
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={checked =>
                setFormData(prev => ({ ...prev, isActive: checked }))
              }
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
          >
            {isEditing ? 'Update Criterion' : 'Save Criterion'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
