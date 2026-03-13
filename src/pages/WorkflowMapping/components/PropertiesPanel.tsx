import { useMemo } from 'react';
import { X, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useWorkflowStore } from '../store/workflowStore';
import { Workflow, Step, Transition } from '../types';

interface Props {
  workflow: Workflow;
}

const PropertiesPanel = ({ workflow }: Props) => {
  const {
    selectedElementId, selectedElementType, selectElement,
    updateStep, removeStep, updateTransition, removeTransition,
  } = useWorkflowStore();

  if (!selectedElementId) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center">
        <div>
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <span className="text-xl text-muted-foreground">⬡</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Select a step or transition</p>
          <p className="text-xs text-muted-foreground mt-1">Click any node or edge on the canvas</p>
        </div>
      </div>
    );
  }

  if (selectedElementType === 'step') {
    const step = workflow.steps.find(s => s.id === selectedElementId);
    if (!step) return null;
    const role = workflow.roles.find(r => r.id === step.roleId);
    const outTransitions = workflow.transitions.filter(t => t.fromStepId === step.id);

    return (
      <div className="h-full overflow-y-auto">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Step Properties</h3>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => selectElement(null, null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs">Step Name</Label>
            <Input
              value={step.name}
              onChange={e => updateStep(workflow.id, step.id, { name: e.target.value })}
              className="h-9 text-sm"
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <Badge variant="outline" className="capitalize">{step.type}</Badge>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label className="text-xs">Assigned Role</Label>
            <Select
              value={step.roleId}
              onValueChange={v => updateStep(workflow.id, step.id, { roleId: v })}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {workflow.roles.map(r => (
                  <SelectItem key={r.id} value={r.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                      {r.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          {step.type === 'task' && (
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Select
                value={step.category || 'internal'}
                onValueChange={v => updateStep(workflow.id, step.id, { category: v as Step['category'] })}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="internal">Internal Review</SelectItem>
                  <SelectItem value="external">External Review</SelectItem>
                  <SelectItem value="system">System Check</SelectItem>
                  <SelectItem value="notification">Notification Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Input
              value={step.description || ''}
              onChange={e => updateStep(workflow.id, step.id, { description: e.target.value })}
              placeholder="Optional description"
              className="h-9 text-sm"
            />
          </div>

          <Separator />

          {/* Outgoing Transitions */}
          <div>
            <Label className="text-xs font-semibold">Outgoing Transitions ({outTransitions.length})</Label>
            <div className="mt-2 space-y-2">
              {outTransitions.map(tr => {
                const action = workflow.actions.find(a => a.id === tr.actionId);
                const toStep = workflow.steps.find(s => s.id === tr.toStepId);
                return (
                  <div key={tr.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-xs">
                    <Badge variant="outline" className="text-[10px]">{action?.name || '—'}</Badge>
                    <span className="text-muted-foreground">→</span>
                    <span className="truncate flex-1">{toStep?.name || '—'}</span>
                  </div>
                );
              })}
              {outTransitions.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No outgoing transitions</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Delete */}
          {step.type !== 'start' && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-destructive hover:bg-destructive/10"
              onClick={() => {
                removeStep(workflow.id, step.id);
                selectElement(null, null);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Remove Step
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (selectedElementType === 'transition') {
    const transition = workflow.transitions.find(t => t.id === selectedElementId);
    if (!transition) return null;
    const fromStep = workflow.steps.find(s => s.id === transition.fromStepId);
    const toStep = workflow.steps.find(s => s.id === transition.toStepId);

    return (
      <div className="h-full overflow-y-auto">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Transition Properties</h3>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => selectElement(null, null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{fromStep?.name}</span>
            <span className="text-muted-foreground">→</span>
            <span className="font-medium">{toStep?.name}</span>
          </div>

          {/* Action */}
          <div className="space-y-1.5">
            <Label className="text-xs">Action</Label>
            <Select
              value={transition.actionId}
              onValueChange={v => updateTransition(workflow.id, transition.id, { actionId: v })}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {workflow.actions.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Condition */}
          <div className="space-y-1.5">
            <Label className="text-xs">Condition (optional)</Label>
            <Input
              value={transition.condition || ''}
              onChange={e => updateTransition(workflow.id, transition.id, { condition: e.target.value })}
              placeholder='e.g. amount > 100000'
              className="h-9 text-sm font-mono"
            />
          </div>

          {/* SLA */}
          <div className="space-y-1.5">
            <Label className="text-xs">SLA (optional)</Label>
            <Input
              value={transition.sla || ''}
              onChange={e => updateTransition(workflow.id, transition.id, { sla: e.target.value })}
              placeholder="e.g. 48 hours"
              className="h-9 text-sm"
            />
          </div>

          <Separator />

          <Button
            variant="outline"
            size="sm"
            className="w-full text-destructive hover:bg-destructive/10"
            onClick={() => {
              removeTransition(workflow.id, transition.id);
              selectElement(null, null);
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Remove Transition
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default PropertiesPanel;
