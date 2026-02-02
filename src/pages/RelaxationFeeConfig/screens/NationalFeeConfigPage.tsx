import { useState } from 'react';
import { motion } from 'framer-motion';
import { ModuleLayout } from '../components/ModuleLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  History,
  Pencil,
  AlertTriangle,
  CheckCircle2,
  IndianRupee,
  ArrowRight,
  Building2,
  Info,
} from 'lucide-react';
import { mockNationalFeeConfigs, mockHOAdminContext } from '../data/mockData';
import { FeeRangeSlider } from '../components/FeeRangeSlider';
import type { NationalFeeConfig } from '../types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function NationalFeeConfigPage() {
  const [feeConfigs, setFeeConfigs] = useState(mockNationalFeeConfigs);
  const [editingConfig, setEditingConfig] = useState<NationalFeeConfig | null>(null);
  const [editForm, setEditForm] = useState({
    defaultAmount: 0,
    minAmount: 0,
    maxAmount: 0,
    gstApplicable: true,
    effectiveFrom: '',
    changeReason: '',
    impactReviewed: false,
  });

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

  const handleEditClick = (config: NationalFeeConfig) => {
    setEditingConfig(config);
    setEditForm({
      defaultAmount: config.defaultAmount,
      minAmount: config.minAmount,
      maxAmount: config.maxAmount,
      gstApplicable: config.gstApplicable,
      effectiveFrom: new Date().toISOString().split('T')[0],
      changeReason: '',
      impactReviewed: false,
    });
  };

  const isFormValid = () => {
    if (!editForm.changeReason || !editForm.impactReviewed) return false;
    if (editForm.minAmount >= editForm.defaultAmount) return false;
    if (editForm.maxAmount <= editForm.defaultAmount) return false;
    return true;
  };

  const handleSaveConfig = () => {
    if (!editingConfig || !isFormValid()) return;

    setFeeConfigs(prev =>
      prev.map(c =>
        c.id === editingConfig.id
          ? {
              ...c,
              defaultAmount: editForm.defaultAmount,
              minAmount: editForm.minAmount,
              maxAmount: editForm.maxAmount,
              gstApplicable: editForm.gstApplicable,
              version: `v${parseFloat(c.version.slice(1)) + 0.1}`,
            }
          : c
      )
    );

    toast.success(`Fee configuration for ${editingConfig.registrationType.name} scheduled`);
    setEditingConfig(null);
  };

  const currentVersion = feeConfigs[0]?.version || 'v2.3';
  const currentEffective = feeConfigs[0]?.effectiveFrom || new Date().toISOString();

  return (
    <ModuleLayout
      adminContext={mockHOAdminContext}
      title="National Fee Configuration"
      subtitle="Set default fees and bounds for all India"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2">
            <History className="h-4 w-4" />
            View History
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule New Version
          </Button>
        </>
      }
    >
      {/* Version Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between rounded-xl border bg-gradient-to-r from-teal-50 to-emerald-50 px-5 py-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
            <Building2 className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                Current Version: {currentVersion}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                Effective: {formatDate(currentEffective)}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              These configurations apply to all {feeConfigs[0]?.totalStateCouncils || 28} state councils
            </p>
          </div>
        </div>
      </motion.div>

      {/* Fee Configuration Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {feeConfigs.map((config, index) => (
          <motion.div
            key={config.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {config.registrationType.name}
                    </CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {config.registrationType.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(config)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Default Fee */}
                <div className="text-center">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Default Fee (National)
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {formatCurrency(config.defaultAmount)}
                  </p>
                </div>

                {/* Range Visualization */}
                <div className="relative py-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="text-left">
                      <span className="text-xs text-muted-foreground">Min</span>
                      <p className="font-semibold">{formatCurrency(config.minAmount)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Max</span>
                      <p className="font-semibold">{formatCurrency(config.maxAmount)}</p>
                    </div>
                  </div>
                  <div className="relative h-2 rounded-full bg-slate-100">
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600"
                      style={{
                        left: '0%',
                        width: `${((config.defaultAmount - config.minAmount) / (config.maxAmount - config.minAmount)) * 100}%`,
                      }}
                    />
                    <div
                      className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-teal-600 shadow-sm"
                      style={{
                        left: `${((config.defaultAmount - config.minAmount) / (config.maxAmount - config.minAmount)) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  </div>
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    (Default)
                  </p>
                </div>

                <Separator />

                {/* GST Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">GST Applicable:</span>
                    {config.gstApplicable ? (
                      <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Yes ({config.gstPercentage}%)
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </div>
                </div>

                {/* State Council Usage */}
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">State Councils Using Custom Fees:</span>
                    <span className="font-semibold">
                      {config.stateCouncilsUsingCustom}/{config.totalStateCouncils}
                    </span>
                  </div>
                  <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs">
                    View Details <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editingConfig} onOpenChange={() => setEditingConfig(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Edit National Fee - {editingConfig?.registrationType.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Default Fee */}
            <div className="space-y-2">
              <Label htmlFor="defaultAmount">
                Default Fee <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="defaultAmount"
                  type="number"
                  value={editForm.defaultAmount}
                  onChange={e =>
                    setEditForm(prev => ({ ...prev, defaultAmount: parseInt(e.target.value) || 0 }))
                  }
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended fee for state councils
              </p>
            </div>

            {/* Min Amount */}
            <div className="space-y-2">
              <Label htmlFor="minAmount">
                Minimum Allowed <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="minAmount"
                  type="number"
                  value={editForm.minAmount}
                  onChange={e =>
                    setEditForm(prev => ({ ...prev, minAmount: parseInt(e.target.value) || 0 }))
                  }
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                State councils cannot go below this
              </p>
            </div>

            {/* Max Amount */}
            <div className="space-y-2">
              <Label htmlFor="maxAmount">
                Maximum Allowed <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="maxAmount"
                  type="number"
                  value={editForm.maxAmount}
                  onChange={e =>
                    setEditForm(prev => ({ ...prev, maxAmount: parseInt(e.target.value) || 0 }))
                  }
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                State councils cannot exceed this
              </p>
            </div>

            {/* Validation Messages */}
            {editForm.minAmount >= editForm.defaultAmount && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                Min must be less than default
              </div>
            )}
            {editForm.maxAmount <= editForm.defaultAmount && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                Max must be greater than default
              </div>
            )}

            <Separator />

            {/* GST Toggle */}
            <div className="flex items-center justify-between">
              <Label>GST Applicable</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">No</span>
                <Switch
                  checked={editForm.gstApplicable}
                  onCheckedChange={checked =>
                    setEditForm(prev => ({ ...prev, gstApplicable: checked }))
                  }
                />
                <span className="text-sm text-muted-foreground">Yes</span>
              </div>
            </div>

            <Separator />

            {/* Effective Date */}
            <div className="space-y-2">
              <Label htmlFor="effectiveFrom">
                Effective From <span className="text-destructive">*</span>
              </Label>
              <Input
                id="effectiveFrom"
                type="date"
                value={editForm.effectiveFrom}
                onChange={e =>
                  setEditForm(prev => ({ ...prev, effectiveFrom: e.target.value }))
                }
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-muted-foreground">
                When this configuration becomes active
              </p>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="changeReason">
                Reason for Change <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="changeReason"
                placeholder="Annual fee revision as per policy..."
                value={editForm.changeReason}
                onChange={e =>
                  setEditForm(prev => ({ ...prev, changeReason: e.target.value }))
                }
                rows={2}
              />
            </div>

            {/* Impact Warning */}
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-amber-800">
                This will affect {editingConfig?.totalStateCouncils || 28} state councils
              </span>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="impactReviewed"
                checked={editForm.impactReviewed}
                onCheckedChange={checked =>
                  setEditForm(prev => ({ ...prev, impactReviewed: checked as boolean }))
                }
              />
              <Label htmlFor="impactReviewed" className="text-sm font-normal cursor-pointer">
                I have reviewed the impact of this change
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingConfig(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveConfig}
              disabled={!isFormValid()}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
            >
              Schedule Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModuleLayout>
  );
}
