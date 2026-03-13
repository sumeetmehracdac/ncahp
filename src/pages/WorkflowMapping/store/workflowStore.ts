import { create } from 'zustand';
import { ApplicationType, Workflow, Step, Transition, ValidationIssue, CopyConflict } from '../types';
import { applicationTypes, sampleWorkflows } from '../data/mockData';
import { validateWorkflow } from '../lib/validation';

interface WorkflowState {
  // Data
  applicationTypes: ApplicationType[];
  workflows: Workflow[];
  
  // Editor state
  activeWorkflowId: string | null;
  selectedElementId: string | null;
  selectedElementType: 'step' | 'transition' | null;
  isDirty: boolean;
  validationIssues: ValidationIssue[];
  
  // UI state
  showRulesTable: boolean;
  showValidation: boolean;
  
  // Actions
  setActiveWorkflow: (id: string | null) => void;
  selectElement: (id: string | null, type: 'step' | 'transition' | null) => void;
  
  getActiveWorkflow: () => Workflow | undefined;
  getWorkflowByAppType: (appTypeId: string) => Workflow | undefined;
  
  addStep: (workflowId: string, step: Step) => void;
  updateStep: (workflowId: string, stepId: string, updates: Partial<Step>) => void;
  removeStep: (workflowId: string, stepId: string) => void;
  
  addTransition: (workflowId: string, transition: Transition) => void;
  updateTransition: (workflowId: string, transitionId: string, updates: Partial<Transition>) => void;
  removeTransition: (workflowId: string, transitionId: string) => void;
  
  runValidation: (workflowId: string) => void;
  
  saveWorkflow: (workflowId: string) => void;
  publishWorkflow: (workflowId: string) => void;
  
  copyWorkflow: (sourceId: string, targetAppTypeIds: string[], conflicts: CopyConflict[]) => void;
  createWorkflow: (appTypeId: string, fromTemplateId?: string) => string;
  
  toggleRulesTable: () => void;
  toggleValidation: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  applicationTypes,
  workflows: sampleWorkflows,
  
  activeWorkflowId: null,
  selectedElementId: null,
  selectedElementType: null,
  isDirty: false,
  validationIssues: [],
  
  showRulesTable: false,
  showValidation: false,
  
  setActiveWorkflow: (id) => set({ activeWorkflowId: id, selectedElementId: null, selectedElementType: null, validationIssues: [] }),
  
  selectElement: (id, type) => set({ selectedElementId: id, selectedElementType: type }),
  
  getActiveWorkflow: () => {
    const state = get();
    return state.workflows.find(w => w.id === state.activeWorkflowId);
  },
  
  getWorkflowByAppType: (appTypeId) => {
    return get().workflows.find(w => w.applicationTypeId === appTypeId);
  },
  
  addStep: (workflowId, step) => set(state => ({
    workflows: state.workflows.map(w =>
      w.id === workflowId ? { ...w, steps: [...w.steps, step] } : w
    ),
    isDirty: true,
  })),
  
  updateStep: (workflowId, stepId, updates) => set(state => ({
    workflows: state.workflows.map(w =>
      w.id === workflowId
        ? { ...w, steps: w.steps.map(s => s.id === stepId ? { ...s, ...updates } : s) }
        : w
    ),
    isDirty: true,
  })),
  
  removeStep: (workflowId, stepId) => set(state => ({
    workflows: state.workflows.map(w =>
      w.id === workflowId
        ? {
            ...w,
            steps: w.steps.filter(s => s.id !== stepId),
            transitions: w.transitions.filter(t => t.fromStepId !== stepId && t.toStepId !== stepId),
          }
        : w
    ),
    isDirty: true,
  })),
  
  addTransition: (workflowId, transition) => set(state => ({
    workflows: state.workflows.map(w =>
      w.id === workflowId ? { ...w, transitions: [...w.transitions, transition] } : w
    ),
    isDirty: true,
  })),
  
  updateTransition: (workflowId, transitionId, updates) => set(state => ({
    workflows: state.workflows.map(w =>
      w.id === workflowId
        ? { ...w, transitions: w.transitions.map(t => t.id === transitionId ? { ...t, ...updates } : t) }
        : w
    ),
    isDirty: true,
  })),
  
  removeTransition: (workflowId, transitionId) => set(state => ({
    workflows: state.workflows.map(w =>
      w.id === workflowId
        ? { ...w, transitions: w.transitions.filter(t => t.id !== transitionId) }
        : w
    ),
    isDirty: true,
  })),
  
  runValidation: (workflowId) => {
    const workflow = get().workflows.find(w => w.id === workflowId);
    if (!workflow) return;
    const issues = validateWorkflow(workflow);
    set({ validationIssues: issues });
  },
  
  saveWorkflow: (workflowId) => set(state => ({
    workflows: state.workflows.map(w =>
      w.id === workflowId ? { ...w, status: 'draft' as const } : w
    ),
    applicationTypes: state.applicationTypes.map(at => {
      const wf = state.workflows.find(w => w.id === workflowId);
      if (wf && at.id === wf.applicationTypeId) {
        return { ...at, hasWorkflow: true, status: 'draft' as const, updatedAt: new Date().toISOString().split('T')[0], updatedBy: 'Admin' };
      }
      return at;
    }),
    isDirty: false,
  })),
  
  publishWorkflow: (workflowId) => set(state => ({
    workflows: state.workflows.map(w =>
      w.id === workflowId ? { ...w, status: 'published' as const } : w
    ),
    applicationTypes: state.applicationTypes.map(at => {
      const wf = state.workflows.find(w => w.id === workflowId);
      if (wf && at.id === wf.applicationTypeId) {
        return { ...at, hasWorkflow: true, status: 'published' as const, updatedAt: new Date().toISOString().split('T')[0], updatedBy: 'Admin' };
      }
      return at;
    }),
    isDirty: false,
  })),
  
  copyWorkflow: (sourceId, targetAppTypeIds, conflicts) => set(state => {
    const source = state.workflows.find(w => w.id === sourceId);
    if (!source) return state;
    
    const newWorkflows = [...state.workflows];
    const newAppTypes = [...state.applicationTypes];
    
    for (const targetId of targetAppTypeIds) {
      const conflict = conflicts.find(c => c.applicationTypeId === targetId);
      if (conflict?.resolution === 'skip') continue;
      
      const existingIdx = newWorkflows.findIndex(w => w.applicationTypeId === targetId);
      const newWf: Workflow = {
        ...source,
        id: `wf-copy-${targetId}-${Date.now()}`,
        applicationTypeId: targetId,
        status: 'draft',
        version: conflict?.resolution === 'new_version' ? `${parseFloat(source.version) + 0.1}` : source.version,
      };
      
      if (existingIdx >= 0 && conflict?.resolution !== 'skip' as string) {
        newWorkflows[existingIdx] = newWf;
      } else {
        newWorkflows.push(newWf);
      }
      
      const atIdx = newAppTypes.findIndex(at => at.id === targetId);
      if (atIdx >= 0) {
        newAppTypes[atIdx] = { ...newAppTypes[atIdx], hasWorkflow: true, status: 'draft', updatedAt: new Date().toISOString().split('T')[0], updatedBy: 'Admin' };
      }
    }
    
    return { workflows: newWorkflows, applicationTypes: newAppTypes };
  }),
  
  createWorkflow: (appTypeId, fromTemplateId) => {
    const state = get();
    const template = fromTemplateId ? state.workflows.find(w => w.id === fromTemplateId) : undefined;
    const newId = `wf-new-${Date.now()}`;
    
    const newWorkflow: Workflow = template
      ? { ...template, id: newId, applicationTypeId: appTypeId, status: 'draft', version: '0.1' }
      : {
          id: newId,
          applicationTypeId: appTypeId,
          version: '0.1',
          status: 'draft',
          roles: [],
          steps: [
            { id: 'step-start', type: 'start', name: 'Start', roleId: '', position: { x: 100, y: 200 } },
          ],
          actions: [],
          transitions: [],
        };
    
    set(state => ({
      workflows: [...state.workflows, newWorkflow],
      applicationTypes: state.applicationTypes.map(at =>
        at.id === appTypeId ? { ...at, hasWorkflow: true, status: 'draft' as const, updatedAt: new Date().toISOString().split('T')[0], updatedBy: 'Admin' } : at
      ),
      activeWorkflowId: newId,
    }));
    
    return newId;
  },
  
  toggleRulesTable: () => set(state => ({ showRulesTable: !state.showRulesTable })),
  toggleValidation: () => set(state => ({ showValidation: !state.showValidation })),
}));
