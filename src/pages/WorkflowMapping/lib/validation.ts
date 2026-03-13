import { Workflow, ValidationIssue } from '../types';

export function validateWorkflow(workflow: Workflow): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Check for start node
  const startNodes = workflow.steps.filter(s => s.type === 'start');
  if (startNodes.length === 0) {
    issues.push({ id: 'v-no-start', severity: 'error', message: 'Workflow has no Start node.' });
  }
  if (startNodes.length > 1) {
    issues.push({ id: 'v-multi-start', severity: 'warning', message: 'Workflow has multiple Start nodes.' });
  }
  
  // Check for end node
  const endNodes = workflow.steps.filter(s => s.type === 'end');
  if (endNodes.length === 0) {
    issues.push({ id: 'v-no-end', severity: 'error', message: 'Workflow has no End/terminal node.' });
  }
  
  // Check for orphan steps (no incoming or outgoing)
  for (const step of workflow.steps) {
    if (step.type === 'start') continue;
    const hasIncoming = workflow.transitions.some(t => t.toStepId === step.id);
    if (!hasIncoming) {
      issues.push({
        id: `v-orphan-in-${step.id}`,
        severity: 'error',
        message: `Step "${step.name}" has no incoming transitions.`,
        elementId: step.id,
        elementType: 'step',
      });
    }
  }
  
  for (const step of workflow.steps) {
    if (step.type === 'end') continue;
    const hasOutgoing = workflow.transitions.some(t => t.fromStepId === step.id);
    if (!hasOutgoing) {
      issues.push({
        id: `v-orphan-out-${step.id}`,
        severity: step.type === 'start' ? 'error' : 'warning',
        message: `Step "${step.name}" has no outgoing transitions (dead end).`,
        elementId: step.id,
        elementType: 'step',
      });
    }
  }
  
  // Check transitions with missing targets
  for (const tr of workflow.transitions) {
    const fromStep = workflow.steps.find(s => s.id === tr.fromStepId);
    const toStep = workflow.steps.find(s => s.id === tr.toStepId);
    if (!fromStep) {
      issues.push({
        id: `v-bad-from-${tr.id}`,
        severity: 'error',
        message: `Transition references non-existent source step.`,
        elementId: tr.id,
        elementType: 'transition',
      });
    }
    if (!toStep) {
      issues.push({
        id: `v-bad-to-${tr.id}`,
        severity: 'error',
        message: `Transition references non-existent target step.`,
        elementId: tr.id,
        elementType: 'transition',
      });
    }
  }
  
  // Check reachability from start
  if (startNodes.length > 0) {
    const reachable = new Set<string>();
    const queue = [startNodes[0].id];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (reachable.has(current)) continue;
      reachable.add(current);
      const outgoing = workflow.transitions.filter(t => t.fromStepId === current);
      for (const t of outgoing) {
        if (!reachable.has(t.toStepId)) queue.push(t.toStepId);
      }
    }
    
    for (const step of workflow.steps) {
      if (!reachable.has(step.id) && step.type !== 'start') {
        issues.push({
          id: `v-unreach-${step.id}`,
          severity: 'warning',
          message: `Step "${step.name}" is not reachable from Start.`,
          elementId: step.id,
          elementType: 'step',
        });
      }
    }
    
    // Check if any end node is reachable
    const reachableEnd = endNodes.some(e => reachable.has(e.id));
    if (!reachableEnd && endNodes.length > 0) {
      issues.push({
        id: 'v-no-path-to-end',
        severity: 'error',
        message: 'No terminal node is reachable from Start.',
      });
    }
  }
  
  return issues;
}
