import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2, ArrowRight, Play, Square, Settings2, AlertCircle, Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Role, ActionDef, WorkflowStep, StepAction } from '../types';
import { cn } from '@/lib/utils';

interface Props {
  step: WorkflowStep;
  allSteps: WorkflowStep[];
  roles: Role[];
  actionDefs: ActionDef[];
  onUpdate: (updates: Partial<WorkflowStep>) => void;
  onUpdateActions: (actions: StepAction[]) => void;
  onDelete: () => void;
}

const StepConfigurator = ({
  step, allSteps, roles, actionDefs, onUpdate, onUpdateActions, onDelete,
}: Props) => {
  const role = roles.find((r) => r.id === step.roleId);
  const otherSteps = allSteps.filter((s) => s.id !== step.id);

  const isActionEnabled = (actionId: string) =>
    step.actions.some((a) => a.actionId === actionId);

  const toggleAction = (actionId: string) => {
    if (isActionEnabled(actionId)) {
      onUpdateActions(step.actions.filter((a) => a.actionId !== actionId));
    } else {
      onUpdateActions([...step.actions, { actionId, targetStepId: '' }]);
    }
  };

  const updateActionTarget = (actionId: string, targetStepId: string) => {
    onUpdateActions(
      step.actions.map((a) =>
        a.actionId === actionId ? { ...a, targetStepId } : a
      )
    );
  };

  const unroutedCount = step.actions.filter((a) => !a.targetStepId).length;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Colored header bar */}
      <div className={cn(
        'px-6 py-4 flex items-center justify-between',
        step.type === 'start' && 'bg-emerald-500/10 border-b border-emerald-200/50',
        step.type === 'terminal' && 'bg-destructive/5 border-b border-destructive/10',
        step.type === 'process' && 'bg-primary/5 border-b border-primary/10'
      )}>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              step.type === 'start' && 'bg-emerald-500/15',
              step.type === 'terminal' && 'bg-destructive/10',
              step.type === 'process' && 'bg-primary/15'
            )}
          >
            {step.type === 'start' ? (
              <Play className="w-5 h-5 text-emerald-600" />
            ) : step.type === 'terminal' ? (
              <Square className="w-5 h-5 text-destructive" />
            ) : (
              <Settings2 className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Step Configuration</h2>
            <p className="text-[11px] text-muted-foreground">
              Define behavior and action routing for this step
            </p>
          </div>
        </div>
        {step.type !== 'start' && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 mr-1" /> Remove
          </Button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Step Name</Label>
            <Input
              value={step.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="h-9 focus-visible:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Step Type</Label>
              <Select
                value={step.type}
                onValueChange={(v: WorkflowStep['type']) => onUpdate({ type: v })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="start">Start</SelectItem>
                  <SelectItem value="process">Process</SelectItem>
                  <SelectItem value="terminal">Terminal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned Role</Label>
              <Select
                value={step.roleId}
                onValueChange={(v) => onUpdate({ roleId: v })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select role..." />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-black/10"
                          style={{ backgroundColor: r.color }}
                        />
                        {r.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</Label>
            <Textarea
              value={step.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={2}
              className="resize-none text-sm focus-visible:ring-primary/30"
              placeholder="Describe what happens at this step..."
            />
          </div>
        </div>

        {/* Actions & Routing */}
        {step.type !== 'terminal' && (
          <>
            <Separator className="bg-border/60" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Allowed Actions & Routing
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Select actions this role can perform and where each routes to
                    </p>
                  </div>
                </div>
                {unroutedCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-accent border-accent/30 bg-accent/5 text-[10px]"
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {unroutedCount} unrouted
                  </Badge>
                )}
              </div>

              <div className="space-y-2.5">
                {actionDefs.map((action) => {
                  const enabled = isActionEnabled(action.id);
                  const stepAction = step.actions.find(
                    (a) => a.actionId === action.id
                  );

                  return (
                    <div
                      key={action.id}
                      className={cn(
                        'rounded-xl border p-3.5 transition-all duration-150',
                        enabled
                          ? 'border-primary/30 bg-primary/[0.04] shadow-sm'
                          : 'border-border bg-muted/20 hover:bg-muted/40'
                      )}
                    >
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={enabled}
                          onCheckedChange={() => toggleAction(action.id)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span className={cn(
                          'font-medium text-sm flex-1',
                          enabled ? 'text-foreground' : 'text-muted-foreground'
                        )}>
                          {action.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[9px] uppercase tracking-wider',
                            action.type === 'positive' &&
                              'text-emerald-700 border-emerald-200 bg-emerald-50',
                            action.type === 'negative' &&
                              'text-destructive border-destructive/20 bg-destructive/5',
                            action.type === 'neutral' && 'text-muted-foreground bg-muted/50'
                          )}
                        >
                          {action.type}
                        </Badge>
                      </label>

                      <AnimatePresence>
                        {enabled && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden"
                          >
                            <div className="flex items-center gap-2.5 mt-3 pl-9">
                              <ArrowRight className="w-4 h-4 text-primary/50 shrink-0" />
                              <span className="text-xs text-muted-foreground shrink-0">
                                Routes to
                              </span>
                              <Select
                                value={stepAction?.targetStepId || ''}
                                onValueChange={(v) =>
                                  updateActionTarget(action.id, v)
                                }
                              >
                                <SelectTrigger
                                  className={cn(
                                    'h-8 text-xs flex-1',
                                    !stepAction?.targetStepId &&
                                      'border-accent/50 bg-accent/5'
                                  )}
                                >
                                  <SelectValue placeholder="Select target step..." />
                                </SelectTrigger>
                                <SelectContent className="bg-card">
                                  {otherSteps.map((s) => (
                                    <SelectItem
                                      key={s.id}
                                      value={s.id}
                                      className="text-xs"
                                    >
                                      {s.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {step.type === 'terminal' && (
          <>
            <Separator />
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-6 text-center">
              <Square className="w-8 h-8 text-primary/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Terminal steps end the workflow. No actions or routing needed.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StepConfigurator;
