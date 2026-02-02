import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ModuleLayout } from '../components/ModuleLayout';
import { FeeRangeSlider } from '../components/FeeRangeSlider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  History,
  IndianRupee,
  Info,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
} from 'lucide-react';
import {
  mockNationalFeeConfigs,
  mockStateCouncilFeeConfigs,
  mockSCAdminContext,
} from '../data/mockData';
import { REGISTRATION_TYPES } from '../types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function StateFeeConfigPage() {
  const [activeTab, setActiveTab] = useState('reg-1');
  const [stateConfigs, setStateConfigs] = useState(mockStateCouncilFeeConfigs);
  const [editingValues, setEditingValues] = useState<{
    [key: string]: {
      defaultAmount: number;
      minAmount: number;
      maxAmount: number;
      changeReason: string;
    };
  }>({});
  const [hasChanges, setHasChanges] = useState<{ [key: string]: boolean }>({});

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

  const getNationalConfig = (registrationTypeId: string) => {
    return mockNationalFeeConfigs.find(c => c.registrationTypeId === registrationTypeId);
  };

  const getStateConfig = (registrationTypeId: string) => {
    return stateConfigs.find(c => c.registrationTypeId === registrationTypeId);
  };

  const getEditingValue = (registrationTypeId: string) => {
    const stateConfig = getStateConfig(registrationTypeId);
    const nationalConfig = getNationalConfig(registrationTypeId);
    
    if (editingValues[registrationTypeId]) {
      return editingValues[registrationTypeId];
    }
    
    return {
      defaultAmount: stateConfig?.defaultAmount || nationalConfig?.defaultAmount || 0,
      minAmount: stateConfig?.minAmount || nationalConfig?.minAmount || 0,
      maxAmount: stateConfig?.maxAmount || nationalConfig?.maxAmount || 0,
      changeReason: '',
    };
  };

  const updateEditingValue = (
    registrationTypeId: string,
    field: string,
    value: number | string
  ) => {
    setEditingValues(prev => ({
      ...prev,
      [registrationTypeId]: {
        ...getEditingValue(registrationTypeId),
        [field]: value,
      },
    }));
    setHasChanges(prev => ({ ...prev, [registrationTypeId]: true }));
  };

  const validateBounds = (registrationTypeId: string) => {
    const values = getEditingValue(registrationTypeId);
    const national = getNationalConfig(registrationTypeId);
    
    if (!national) return { valid: false, errors: ['National config not found'] };
    
    const errors: string[] = [];
    
    if (values.defaultAmount < national.minAmount) {
      errors.push(`Default fee must be at least ${formatCurrency(national.minAmount)}`);
    }
    if (values.defaultAmount > national.maxAmount) {
      errors.push(`Default fee cannot exceed ${formatCurrency(national.maxAmount)}`);
    }
    if (values.minAmount < national.minAmount) {
      errors.push(`Minimum cannot be below ${formatCurrency(national.minAmount)}`);
    }
    if (values.minAmount > values.defaultAmount) {
      errors.push('Minimum must be less than or equal to default');
    }
    if (values.maxAmount > national.maxAmount) {
      errors.push(`Maximum cannot exceed ${formatCurrency(national.maxAmount)}`);
    }
    if (values.maxAmount < values.defaultAmount) {
      errors.push('Maximum must be greater than or equal to default');
    }
    
    return { valid: errors.length === 0, errors };
  };

  const handleSave = (registrationTypeId: string) => {
    const validation = validateBounds(registrationTypeId);
    if (!validation.valid) {
      toast.error(validation.errors[0]);
      return;
    }
    
    const values = getEditingValue(registrationTypeId);
    const existingConfig = getStateConfig(registrationTypeId);
    const national = getNationalConfig(registrationTypeId);
    
    if (existingConfig) {
      setStateConfigs(prev =>
        prev.map(c =>
          c.registrationTypeId === registrationTypeId
            ? {
                ...c,
                defaultAmount: values.defaultAmount,
                minAmount: values.minAmount,
                maxAmount: values.maxAmount,
                version: `v${parseFloat(c.version.slice(1)) + 0.1}`,
              }
            : c
        )
      );
    }
    
    setHasChanges(prev => ({ ...prev, [registrationTypeId]: false }));
    toast.success('Fee configuration saved successfully');
  };

  const handleReset = (registrationTypeId: string) => {
    const stateConfig = getStateConfig(registrationTypeId);
    const nationalConfig = getNationalConfig(registrationTypeId);
    
    setEditingValues(prev => {
      const newValues = { ...prev };
      delete newValues[registrationTypeId];
      return newValues;
    });
    setHasChanges(prev => ({ ...prev, [registrationTypeId]: false }));
  };

  const currentConfig = getStateConfig(activeTab);
  const currentVersion = currentConfig?.version || 'v1.0';
  const currentEffective = currentConfig?.effectiveFrom || new Date().toISOString();

  return (
    <ModuleLayout
      adminContext={mockSCAdminContext}
      title={`Fee Configuration - ${mockSCAdminContext.councilName}`}
      subtitle="Set fees within national bounds"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2">
            <History className="h-4 w-4" />
            View History
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Update
          </Button>
        </>
      }
    >
      {/* Version Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between rounded-xl border bg-gradient-to-r from-slate-50 to-slate-100/50 px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-white">
            Current Config: {currentVersion}
          </Badge>
          <Badge variant="outline" className="text-muted-foreground">
            Effective: {formatDate(currentEffective)}
          </Badge>
        </div>
      </motion.div>

      {/* National Bounds Reference Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4"
      >
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-blue-900">
              NATIONAL BOUNDS (Set by NCAHP HO) - Your fees must stay within these limits:
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {mockNationalFeeConfigs.map(config => (
                <div
                  key={config.id}
                  className="rounded-lg bg-white/80 px-3 py-2 text-xs"
                >
                  <p className="font-medium text-blue-800">{config.registrationType.name}</p>
                  <p className="text-blue-600 mt-0.5">
                    {formatCurrency(config.minAmount)} - {formatCurrency(config.maxAmount)}
                  </p>
                  <p className="text-blue-500">
                    (Default: {formatCurrency(config.defaultAmount)})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs for Registration Types */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          {REGISTRATION_TYPES.map(type => (
            <TabsTrigger
              key={type.id}
              value={type.id}
              className="py-2.5 text-xs sm:text-sm data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              {type.name.replace(' Registration', '')}
            </TabsTrigger>
          ))}
        </TabsList>

        {REGISTRATION_TYPES.map(type => {
          const national = getNationalConfig(type.id);
          const state = getStateConfig(type.id);
          const values = getEditingValue(type.id);
          const validation = validateBounds(type.id);
          const changed = hasChanges[type.id];

          if (!national) return null;

          return (
            <TabsContent key={type.id} value={type.id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    {mockSCAdminContext.councilName} Fee - {type.name}
                  </h3>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                  {/* Left Column - Form */}
                  <div className="space-y-6">
                    {/* Default Fee */}
                    <div className="space-y-3">
                      <Label htmlFor={`default-${type.id}`}>
                        Default Fee <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id={`default-${type.id}`}
                          type="number"
                          value={values.defaultAmount}
                          onChange={e =>
                            updateEditingValue(type.id, 'defaultAmount', parseInt(e.target.value) || 0)
                          }
                          className="pl-9"
                        />
                      </div>
                    </div>

                    {/* Visual Slider */}
                    <FeeRangeSlider
                      value={values.defaultAmount}
                      onChange={v => updateEditingValue(type.id, 'defaultAmount', v)}
                      nationalMin={national.minAmount}
                      nationalMax={national.maxAmount}
                      nationalDefault={national.defaultAmount}
                    />

                    <Separator />

                    {/* Min Fee */}
                    <div className="space-y-2">
                      <Label htmlFor={`min-${type.id}`}>
                        Minimum Fee (for your state) <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id={`min-${type.id}`}
                          type="number"
                          value={values.minAmount}
                          onChange={e =>
                            updateEditingValue(type.id, 'minAmount', parseInt(e.target.value) || 0)
                          }
                          className="pl-9"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Must be between {formatCurrency(national.minAmount)} and{' '}
                        {formatCurrency(values.defaultAmount)} (your default)
                      </p>
                    </div>

                    {/* Max Fee */}
                    <div className="space-y-2">
                      <Label htmlFor={`max-${type.id}`}>
                        Maximum Fee (for your state) <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id={`max-${type.id}`}
                          type="number"
                          value={values.maxAmount}
                          onChange={e =>
                            updateEditingValue(type.id, 'maxAmount', parseInt(e.target.value) || 0)
                          }
                          className="pl-9"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Must be between {formatCurrency(values.defaultAmount)} (your default) and{' '}
                        {formatCurrency(national.maxAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Validation & Actions */}
                  <div className="space-y-6">
                    {/* Validation Status */}
                    <div
                      className={cn(
                        'rounded-xl p-5',
                        validation.valid ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {validation.valid ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            <span className="font-medium text-emerald-800">
                              Configuration Valid
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <span className="font-medium text-red-800">
                              Validation Errors
                            </span>
                          </>
                        )}
                      </div>
                      
                      {!validation.valid && (
                        <ul className="space-y-1 text-sm text-red-700">
                          {validation.errors.map((error, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="mt-1">•</span>
                              {error}
                            </li>
                          ))}
                        </ul>
                      )}

                      {validation.valid && (
                        <p className="text-sm text-emerald-700">
                          All values are within national bounds. Ready to save.
                        </p>
                      )}
                    </div>

                    {/* Change Reason */}
                    <div className="space-y-2">
                      <Label htmlFor={`reason-${type.id}`}>Reason for Change</Label>
                      <Textarea
                        id={`reason-${type.id}`}
                        placeholder="State budget revision..."
                        value={values.changeReason}
                        onChange={e =>
                          updateEditingValue(type.id, 'changeReason', e.target.value)
                        }
                        rows={3}
                      />
                    </div>

                    {/* Effective Date */}
                    <div className="space-y-2">
                      <Label>Effective From</Label>
                      <Input
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleReset(type.id)}
                        disabled={!changed}
                        className="gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Reset
                      </Button>
                      <Button
                        onClick={() => handleSave(type.id)}
                        disabled={!validation.valid}
                        className="flex-1 gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          );
        })}
      </Tabs>
    </ModuleLayout>
  );
}
