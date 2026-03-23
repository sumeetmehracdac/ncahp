import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy, Check, ChevronRight, AlertTriangle, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { schemes } from '../data/mockData';
import { toast } from 'sonner';

const components = [
  { id: 'actions', label: 'Actions', desc: 'Action definitions' },
  { id: 'conditions', label: 'Conditions', desc: 'Condition variables & ranges' },
  { id: 'permissions', label: 'Permissions', desc: 'Role–action permissions' },
  { id: 'routing', label: 'Routing', desc: 'Next role after action' },
  { id: 'orchestration', label: 'Orchestration', desc: 'Approval master rules' },
  { id: 'statuses', label: 'Status Mappings', desc: 'PI status text' },
];

const WorkflowCopy = () => {
  const [step, setStep] = useState(1);
  const [copyType, setCopyType] = useState<'proposal' | 'monitoring' | 'both'>('proposal');
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set(components.map((c) => c.id)));
  const [sourceScheme, setSourceScheme] = useState('');
  const [targetSchemes, setTargetSchemes] = useState<Set<string>>(new Set());

  const toggleComponent = (id: string) => {
    setSelectedComponents((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleTarget = (id: string) => {
    setTargetSchemes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCopy = () => {
    toast.success(`Workflow copied to ${targetSchemes.size} scheme(s)`);
    setStep(4);
  };

  const canProceed = () => {
    if (step === 1) return selectedComponents.size > 0;
    if (step === 2) return sourceScheme && targetSchemes.size > 0;
    if (step === 3) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground font-display">Workflow Copy</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Replicate workflow configuration between schemes
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[
          { n: 1, label: 'Select Components' },
          { n: 2, label: 'Source & Target' },
          { n: 3, label: 'Review & Confirm' },
          { n: 4, label: 'Complete' },
        ].map((s, i, arr) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              step === s.n ? 'bg-primary text-primary-foreground' :
              step > s.n ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {step > s.n ? <Check className="w-3.5 h-3.5" /> : <span>{s.n}</span>}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground/40" />}
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h2 className="text-base font-semibold mb-1">What to copy?</h2>
                <p className="text-sm text-muted-foreground">Select workflow type and components to include</p>
              </div>

              <div className="flex gap-3">
                {[
                  { value: 'proposal' as const, label: 'Proposal Workflow' },
                  { value: 'monitoring' as const, label: 'Monitoring Workflow' },
                  { value: 'both' as const, label: 'Both' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCopyType(opt.value)}
                    className={cn(
                      'flex-1 p-4 rounded-xl border-2 text-left transition-all',
                      copyType === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/20'
                    )}
                  >
                    <p className="text-sm font-medium">{opt.label}</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {components.map((comp) => (
                  <label
                    key={comp.id}
                    className={cn(
                      'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                      selectedComponents.has(comp.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/20'
                    )}
                  >
                    <Checkbox
                      checked={selectedComponents.has(comp.id)}
                      onCheckedChange={() => toggleComponent(comp.id)}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium">{comp.label}</p>
                      <p className="text-[11px] text-muted-foreground">{comp.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h2 className="text-base font-semibold mb-1">Source & Target Schemes</h2>
                <p className="text-sm text-muted-foreground">Select which scheme to copy from and where to copy to</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-primary">Source Scheme</h3>
                  <Select value={sourceScheme} onValueChange={setSourceScheme}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select source..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      {schemes.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-accent">Target Scheme(s)</h3>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto rounded-xl border border-border divide-y divide-border">
                    {schemes.filter((s) => s.id !== sourceScheme).map((s) => (
                      <label key={s.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 cursor-pointer">
                        <Checkbox
                          checked={targetSchemes.has(s.id)}
                          onCheckedChange={() => toggleTarget(s.id)}
                        />
                        <span className="text-sm">{s.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{targetSchemes.size} selected</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h2 className="text-base font-semibold mb-1">Review & Confirm</h2>
                <p className="text-sm text-muted-foreground">Verify the copy operation before proceeding</p>
              </div>

              <div className="rounded-xl bg-muted/30 border border-border p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Source</p>
                    <Badge className="bg-primary/10 text-primary border-0">{schemes.find((s) => s.id === sourceScheme)?.name}</Badge>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary/40" />
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Targets ({targetSchemes.size})</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(targetSchemes).map((id) => (
                        <Badge key={id} variant="outline" className="text-[10px]">{schemes.find((s) => s.id === id)?.name}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Components</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(selectedComponents).map((id) => (
                      <Badge key={id} className="bg-emerald-500/10 text-emerald-700 border-emerald-200 text-[10px]">
                        {components.find((c) => c.id === id)?.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-4 rounded-xl bg-amber-500/10 text-amber-700">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">This will overwrite existing configurations</p>
                  <p className="text-xs mt-0.5 opacity-80">
                    Target schemes with existing workflow data will be replaced.
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-1">Copy Complete</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Workflow configuration has been successfully copied to {targetSchemes.size} scheme(s).
              </p>
              <Button className="mt-6" onClick={() => { setStep(1); setSourceScheme(''); setTargetSchemes(new Set()); }}>
                Start New Copy
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {step < 4 && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
            Back
          </Button>
          <Button
            onClick={() => step === 3 ? handleCopy() : setStep(step + 1)}
            disabled={!canProceed()}
          >
            {step === 3 ? (
              <><Copy className="w-4 h-4 mr-1.5" /> Execute Copy</>
            ) : (
              <>Next <ChevronRight className="w-4 h-4 ml-1" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkflowCopy;
