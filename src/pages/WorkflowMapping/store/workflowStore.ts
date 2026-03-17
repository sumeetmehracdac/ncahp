import { create } from 'zustand';
import { ApplicationType, Role, ActionDef, Workflow, WorkflowStep, StepAction } from '../types';
import {
  applicationTypes as initialAppTypes,
  roles as initialRoles,
  actionDefs as initialActions,
  workflows as initialWorkflows,
} from '../data/mockData';

const genId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

interface WorkflowState {
  applicationTypes: ApplicationType[];
  roles: Role[];
  actionDefs: ActionDef[];
  workflows: Workflow[];

  ensureWorkflow: (appTypeId: string) => void;
  updateStep: (workflowId: string, stepId: string, updates: Partial<WorkflowStep>) => void;
  updateStepActions: (workflowId: string, stepId: string, actions: StepAction[]) => void;
  addStep: (workflowId: string) => string;
  removeStep: (workflowId: string, stepId: string) => void;
  publishWorkflow: (workflowId: string) => void;
  copyWorkflow: (sourceAppTypeId: string, targetAppTypeIds: string[]) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  applicationTypes: initialAppTypes,
  roles: initialRoles,
  actionDefs: initialActions,
  workflows: initialWorkflows,

  ensureWorkflow: (appTypeId) => {
    const existing = get().workflows.find((w) => w.applicationTypeId === appTypeId);
    if (existing) return;

    const roles = get().roles;
    const newId = genId('wf');
    const startStepId = genId('step');

    set((state) => ({
      workflows: [
        ...state.workflows,
        {
          id: newId,
          applicationTypeId: appTypeId,
          status: 'draft' as const,
          version: '0.1',
          updatedAt: new Date().toISOString().slice(0, 10),
          steps: [
            {
              id: startStepId,
              name: 'Application Submission',
              type: 'start' as const,
              roleId: roles[0]?.id || '',
              description: 'Applicant submits the application form',
              order: 1,
              actions: [],
            },
          ],
        },
      ],
      applicationTypes: state.applicationTypes.map((at) =>
        at.id === appTypeId ? { ...at, workflowStatus: 'draft' as const } : at
      ),
    }));
  },

  updateStep: (workflowId, stepId, updates) =>
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === workflowId
          ? {
              ...w,
              steps: w.steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)),
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : w
      ),
    })),

  updateStepActions: (workflowId, stepId, actions) =>
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === workflowId
          ? {
              ...w,
              steps: w.steps.map((s) => (s.id === stepId ? { ...s, actions } : s)),
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : w
      ),
    })),

  addStep: (workflowId) => {
    const stepId = genId('step');
    const workflow = get().workflows.find((w) => w.id === workflowId);
    const maxOrder = workflow ? Math.max(...workflow.steps.map((s) => s.order), 0) : 0;
    const roles = get().roles;

    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === workflowId
          ? {
              ...w,
              steps: [
                ...w.steps,
                {
                  id: stepId,
                  name: 'New Step',
                  type: 'process' as const,
                  roleId: roles[1]?.id || roles[0]?.id || '',
                  description: '',
                  order: maxOrder + 1,
                  actions: [],
                },
              ],
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : w
      ),
    }));

    return stepId;
  },

  removeStep: (workflowId, stepId) =>
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === workflowId
          ? {
              ...w,
              steps: w.steps
                .filter((s) => s.id !== stepId)
                .map((s) => ({
                  ...s,
                  actions: s.actions.filter((a) => a.targetStepId !== stepId),
                })),
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : w
      ),
    })),

  publishWorkflow: (workflowId) =>
    set((state) => {
      const wf = state.workflows.find((w) => w.id === workflowId);
      if (!wf) return state;
      const now = new Date().toISOString().slice(0, 10);
      return {
        workflows: state.workflows.map((w) =>
          w.id === workflowId
            ? { ...w, status: 'published' as const, version: '1.0', updatedAt: now }
            : w
        ),
        applicationTypes: state.applicationTypes.map((at) =>
          at.id === wf.applicationTypeId
            ? { ...at, workflowStatus: 'published' as const, updatedAt: now }
            : at
        ),
      };
    }),

  copyWorkflow: (sourceAppTypeId, targetAppTypeIds) =>
    set((state) => {
      const sourceWf = state.workflows.find((w) => w.applicationTypeId === sourceAppTypeId);
      if (!sourceWf) return state;

      const existingWorkflows = state.workflows.filter(
        (w) => !targetAppTypeIds.includes(w.applicationTypeId)
      );

      const newWorkflows = [...existingWorkflows];

      targetAppTypeIds.forEach((targetId) => {
        const newWfId = genId('wf');
        const stepIdMap = new Map<string, string>();

        sourceWf.steps.forEach((step) => {
          stepIdMap.set(step.id, genId('step'));
        });

        newWorkflows.push({
          id: newWfId,
          applicationTypeId: targetId,
          steps: sourceWf.steps.map((step) => ({
            ...step,
            id: stepIdMap.get(step.id)!,
            actions: step.actions.map((a) => ({
              ...a,
              targetStepId: stepIdMap.get(a.targetStepId) || '',
            })),
          })),
          status: 'draft' as const,
          version: '0.1',
          updatedAt: new Date().toISOString().slice(0, 10),
        });
      });

      return {
        workflows: newWorkflows,
        applicationTypes: state.applicationTypes.map((at) =>
          targetAppTypeIds.includes(at.id)
            ? { ...at, workflowStatus: 'draft' as const, updatedAt: new Date().toISOString().slice(0, 10) }
            : at
        ),
      };
    }),
}));
