import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Search, Check, AlertTriangle, ChevronRight, X, FileEdit, CheckCircle2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useWorkflowStore } from '../store/workflowStore';
import { CopyConflict } from '../types';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedSourceId?: string | null;
  preSelectedTargetIds?: string[];
}

const CopyWizard = ({ open, onOpenChange, preSelectedSourceId, preSelectedTargetIds }: Props) => {
  const { applicationTypes, workflows, copyWorkflow } = useWorkflowStore();
  const [step, setStep] = useState(0);
  const [sourceWorkflowId, setSourceWorkflowId] = useState<string>('');
  const [targetScope, setTargetScope] = useState<'all' | 'selected'>('selected');
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set());
  const [targetSearch, setTargetSearch] = useState('');
  const [conflicts, setConflicts] = useState<CopyConflict[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(0);
      setConfirmed(false);
      if (preSelectedSourceId) setSourceWorkflowId(preSelectedSourceId);
      if (preSelectedTargetIds) {
        setSelectedTargets(new Set(preSelectedTargetIds));
        setTargetScope('selected');
      }
    }
  }, [open, preSelectedSourceId, preSelectedTargetIds]);

  const sourceWorkflow = workflows.find(w => w.id === sourceWorkflowId);
  const sourceAppType = sourceWorkflow ? applicationTypes.find(at => at.id === sourceWorkflow.applicationTypeId) : null;

  const workflowsWithData = workflows.filter(w => w.steps.length > 0);

  const targetAppTypes = useMemo(() => {
    const sourceAppId = sourceWorkflow?.applicationTypeId;
    return applicationTypes
      .filter(at => at.id !== sourceAppId)
      .filter(at => !targetSearch || at.name.toLowerCase().includes(targetSearch.toLowerCase()));
  }, [applicationTypes, sourceWorkflow, targetSearch]);

  const finalTargets = useMemo(() => {
    if (targetScope === 'all') return applicationTypes.filter(at => at.id !== sourceWorkflow?.applicationTypeId).map(at => at.id);
    return Array.from(selectedTargets);
  }, [targetScope, selectedTargets, applicationTypes, sourceWorkflow]);

  const buildConflicts = () => {
    const result: CopyConflict[] = finalTargets.map(tid => {
      const at = applicationTypes.find(a => a.id === tid)!;
      const existing = workflows.find(w => w.applicationTypeId === tid);
      return {
        applicationTypeId: tid,
        applicationTypeName: at.name,
        existingStatus: at.status,
        resolution: at.status === 'none' ? 'create' : null,
      };
    });
    setConflicts(result);
  };

  const handleNext = () => {
    if (step === 1) buildConflicts();
    setStep(s => s + 1);
  };

  const handleCopy = () => {
    if (!sourceWorkflowId) return;
    const resolvedConflicts = conflicts.map(c => ({
      ...c,
      resolution: c.resolution || ('overwrite' as const),
    }));
    copyWorkflow(sourceWorkflowId, finalTargets, resolvedConflicts);
    toast.success(`Workflow copied to ${finalTargets.length} application type(s)`);
    onOpenChange(false);
  };

  const canProceed = () => {
    if (step === 0) return !!sourceWorkflowId;
    if (step === 1) return targetScope === 'all' || selectedTargets.size > 0;
    if (step === 2) return conflicts.every(c => c.resolution !== null);
    if (step === 3) return confirmed;
    return false;
  };

  const newCount = conflicts.filter(c => c.existingStatus === 'none').length;
  const overwriteCount = conflicts.filter(c => c.existingStatus !== 'none' && c.resolution !== 'skip').length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="w-5 h-5 text-primary" />
            Copy Workflow Mapping
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 mb-6">
          {['Source', 'Targets', 'Conflicts', 'Confirm'].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step ? 'bg-primary text-primary-foreground' : i === step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}>
                {label}
              </span>
              {i < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
            </div>
          ))}
        </div>

        {/* Step 0: Source */}
        {step === 0 && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Select source workflow to copy from:</Label>
            <Select value={sourceWorkflowId} onValueChange={setSourceWorkflowId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a workflow..." />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {workflowsWithData.map(wf => {
                  const at = applicationTypes.find(a => a.id === wf.applicationTypeId);
                  return (
                    <SelectItem key={wf.id} value={wf.id}>
                      {at?.name || wf.id} (v{wf.version}, {wf.status})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {sourceWorkflow && (
              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-1">
                <p><strong>Steps:</strong> {sourceWorkflow.steps.length}</p>
                <p><strong>Roles:</strong> {sourceWorkflow.roles.length}</p>
                <p><strong>Transitions:</strong> {sourceWorkflow.transitions.length}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Target Scope */}
        {step === 1 && (
          <div className="space-y-4">
            <RadioGroup value={targetScope} onValueChange={(v) => setTargetScope(v as 'all' | 'selected')}>
              <div className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/30">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer flex-1">Copy to all application types ({applicationTypes.length - 1})</Label>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/30">
                <RadioGroupItem value="selected" id="selected" />
                <Label htmlFor="selected" className="cursor-pointer flex-1">Copy to selected application types</Label>
              </div>
            </RadioGroup>

            {targetScope === 'selected' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search..." value={targetSearch} onChange={e => setTargetSearch(e.target.value)} className="pl-10" />
                </div>
                <div className="max-h-[300px] overflow-y-auto border border-border rounded-lg divide-y divide-border">
                  {targetAppTypes.map(at => (
                    <label key={at.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 cursor-pointer">
                      <Checkbox
                        checked={selectedTargets.has(at.id)}
                        onCheckedChange={() => {
                          const next = new Set(selectedTargets);
                          next.has(at.id) ? next.delete(at.id) : next.add(at.id);
                          setSelectedTargets(next);
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{at.name}</p>
                        <p className="text-xs text-muted-foreground">{at.category}</p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {at.status === 'none' ? 'No workflow' : at.status}
                      </Badge>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{selectedTargets.size} selected</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Conflict Resolution */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Review how existing workflows should be handled:</p>
            <div className="max-h-[400px] overflow-y-auto border border-border rounded-lg divide-y divide-border">
              {conflicts.map(c => (
                <div key={c.applicationTypeId} className="px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate flex-1">{c.applicationTypeName}</span>
                    <Badge variant="outline" className="text-xs ml-2">
                      {c.existingStatus === 'none' ? 'New' : c.existingStatus}
                    </Badge>
                  </div>
                  {c.existingStatus === 'none' ? (
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Will create new workflow
                    </p>
                  ) : (
                    <Select
                      value={c.resolution || ''}
                      onValueChange={(v) => {
                        setConflicts(prev => prev.map(cc =>
                          cc.applicationTypeId === c.applicationTypeId
                            ? { ...cc, resolution: v as CopyConflict['resolution'] }
                            : cc
                        ));
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Choose action..." />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        <SelectItem value="overwrite">Overwrite existing</SelectItem>
                        <SelectItem value="new_version">Create new version</SelectItem>
                        <SelectItem value="skip">Skip (keep existing)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <p>
                Copying workflow from <strong>{sourceAppType?.name}</strong> (v{sourceWorkflow?.version}) to <strong>{finalTargets.length}</strong> application type(s):
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>{newCount} new workflow(s) will be created</li>
                <li>{overwriteCount} existing workflow(s) will be modified</li>
              </ul>
            </div>
            <label className="flex items-start gap-3 p-3 rounded-lg border border-border">
              <Checkbox checked={confirmed} onCheckedChange={(v) => setConfirmed(!!v)} className="mt-0.5" />
              <span className="text-sm">I understand that existing configurations may be overwritten where selected.</span>
            </label>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="ghost" onClick={() => step === 0 ? onOpenChange(false) : setStep(s => s - 1)}>
            {step === 0 ? 'Cancel' : '← Back'}
          </Button>
          {step < 3 ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next →
            </Button>
          ) : (
            <Button onClick={handleCopy} disabled={!canProceed()} className="bg-primary text-primary-foreground">
              <Copy className="w-4 h-4 mr-2" /> Copy Mapping
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CopyWizard;
