import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2, ArrowRight, Play, Square, Settings2, AlertCircle,
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
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              step.type === 'start' && 'bg-emerald-500/10',
              step.type === 'terminal' && 'bg-destructive/10',
              step.type === 'process' && 'bg-primary/10'
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
            <h2 className="text-lg font-semibold text-foreground">Step Configuration</h2>
            <p className="text-xs text-muted-foreground">
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

      <Separator />

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Step Name</Label>
          <Input
            value={step.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Step Type</Label>
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
            <Label className="text-xs font-medium">Assigned Role</Label>
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
                        className="w-2.5 h-2.5 rounded-full shrink-0"
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
          <Label className="text-xs font-medium">Description</Label>
          <Textarea
            value={step.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={2}
            className="resize-none text-sm"
            placeholder="Describe what happens at this step..."
          />
        </div>
      </div>

      {/* Actions & Routing */}
      {step.type !== 'terminal' && (
        <>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Allowed Actions & Routing
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select actions this role can perform and where each routes to
                </p>
              </div>
              {unroutedCount > 0 && (
                <Badge
                  variant="outline"
                  className="text-amber-600 border-amber-300 bg-amber-50 text-[10px]"
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
                        ? 'border-primary/25 bg-primary/[0.03]'
                        : 'border-border bg-background'
                    )}
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={enabled}
                        onCheckedChange={() => toggleAction(action.id)}
                      />
                      <span className="font-medium text-sm flex-1">
                        {action.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[9px] uppercase tracking-wider',
                          action.type === 'positive' &&
                            'text-emerald-600 border-emerald-200',
                          action.type === 'negative' &&
                            'text-destructive border-destructive/30',
                          action.type === 'neutral' && 'text-muted-foreground'
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
                            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
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
                                    'border-amber-300'
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
          <div className="rounded-xl bg-muted/30 p-6 text-center">
            <Square className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Terminal steps end the workflow. No actions or routing needed.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default StepConfigurator;
