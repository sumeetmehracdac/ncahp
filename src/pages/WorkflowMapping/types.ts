export interface ApplicationType {
  id: string;
  name: string;
  category: string;
  hasWorkflow: boolean;
  status: 'none' | 'draft' | 'published';
  updatedAt: string;
  updatedBy: string;
}

export interface Role {
  id: string;
  name: string;
  color: string;
}

export interface Step {
  id: string;
  type: 'start' | 'task' | 'decision' | 'end';
  name: string;
  roleId: string;
  description?: string;
  category?: 'internal' | 'external' | 'system' | 'notification';
  position: { x: number; y: number };
}

export interface Action {
  id: string;
  name: string;
}

export interface Transition {
  id: string;
  fromStepId: string;
  actionId: string;
  toStepId: string;
  condition?: string;
  sla?: string;
  notification?: string;
}

export interface Workflow {
  id: string;
  applicationTypeId: string;
  version: string;
  roles: Role[];
  steps: Step[];
  actions: Action[];
  transitions: Transition[];
  status: 'draft' | 'published';
}

export interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning';
  message: string;
  elementId?: string;
  elementType?: 'step' | 'transition';
}

export interface CopyConflict {
  applicationTypeId: string;
  applicationTypeName: string;
  existingStatus: 'none' | 'draft' | 'published';
  resolution: 'create' | 'overwrite' | 'new_version' | 'skip';
}
