export interface ApplicationType {
  id: string;
  name: string;
  category: string;
  description: string;
  workflowStatus: 'none' | 'draft' | 'published';
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  color: string;
}

export interface ActionDef {
  id: string;
  name: string;
  type: 'positive' | 'negative' | 'neutral';
}

export interface StepAction {
  actionId: string;
  targetStepId: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'start' | 'process' | 'terminal';
  roleId: string;
  description: string;
  order: number;
  actions: StepAction[];
}

export interface Workflow {
  id: string;
  applicationTypeId: string;
  steps: WorkflowStep[];
  status: 'draft' | 'published';
  version: string;
  updatedAt: string;
}
