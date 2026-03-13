import { ApplicationType, Workflow, Role, Action } from '../types';

export const defaultRoles: Role[] = [
  { id: 'role-1', name: 'Applicant', color: '#E0F2FE' },
  { id: 'role-2', name: 'Clerk / Data Entry Operator', color: '#F0FDF4' },
  { id: 'role-3', name: 'Section Officer', color: '#FEF9C3' },
  { id: 'role-4', name: 'Deputy Secretary', color: '#FCE7F3' },
  { id: 'role-5', name: 'Secretary / Approving Authority', color: '#EDE9FE' },
  { id: 'role-6', name: 'External Organisation', color: '#FFEDD5' },
];

export const defaultActions: Action[] = [
  { id: 'act-approve', name: 'Approve' },
  { id: 'act-reject', name: 'Reject' },
  { id: 'act-forward', name: 'Forward' },
  { id: 'act-send-back', name: 'Send Back' },
  { id: 'act-request-info', name: 'Request Clarification' },
  { id: 'act-escalate', name: 'Escalate' },
  { id: 'act-submit', name: 'Submit' },
  { id: 'act-verify', name: 'Verify' },
];

export const applicationTypes: ApplicationType[] = [
  { id: 'app-1a', name: 'Form 1A: Regular Registration (Indian National, Indian Qualification)', category: 'Permanent Registration', hasWorkflow: true, status: 'published', updatedAt: '2026-03-10', updatedBy: 'Admin' },
  { id: 'app-1b', name: 'Form 1B: Regular Registration (Indian National, Foreign Qualification)', category: 'Permanent Registration', hasWorkflow: true, status: 'draft', updatedAt: '2026-03-08', updatedBy: 'Admin' },
  { id: 'app-1c', name: 'Form 1C: Provisional Registration', category: 'Provisional Registration', hasWorkflow: true, status: 'published', updatedAt: '2026-03-05', updatedBy: 'System Admin' },
  { id: 'app-2a', name: 'Form 2A: Temporary Registration (Indian National, Foreign Qualification)', category: 'Temporary Registration', hasWorkflow: false, status: 'none', updatedAt: '', updatedBy: '' },
  { id: 'app-2b', name: 'Form 2B: Temporary Registration (Foreign National)', category: 'Temporary Registration', hasWorkflow: false, status: 'none', updatedAt: '', updatedBy: '' },
  { id: 'app-3a', name: 'Form 3A: Interim Registration', category: 'Interim Registration', hasWorkflow: false, status: 'none', updatedAt: '', updatedBy: '' },
  { id: 'app-add-1', name: 'Additional Qualification Registration', category: 'Additional Registration', hasWorkflow: false, status: 'none', updatedAt: '', updatedBy: '' },
  { id: 'app-ren-1', name: 'Registration Renewal – Standard', category: 'Renewal', hasWorkflow: true, status: 'published', updatedAt: '2026-02-20', updatedBy: 'Admin' },
  { id: 'app-ren-2', name: 'Registration Renewal – Lapsed', category: 'Renewal', hasWorkflow: false, status: 'none', updatedAt: '', updatedBy: '' },
  { id: 'app-noc-1', name: 'No Objection Certificate (NOC)', category: 'NOC', hasWorkflow: false, status: 'none', updatedAt: '', updatedBy: '' },
  { id: 'app-dup-1', name: 'Duplicate Certificate Issuance', category: 'Certificate', hasWorkflow: false, status: 'none', updatedAt: '', updatedBy: '' },
  { id: 'app-good-1', name: 'Good Standing Certificate', category: 'Certificate', hasWorkflow: true, status: 'draft', updatedAt: '2026-03-01', updatedBy: 'Admin' },
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `app-gen-${i + 1}`,
    name: `Application Type ${i + 13}`,
    category: ['Permanent Registration', 'Temporary Registration', 'Renewal', 'Certificate', 'NOC'][i % 5],
    hasWorkflow: i % 4 === 0,
    status: (i % 4 === 0 ? (i % 8 === 0 ? 'published' : 'draft') : 'none') as ApplicationType['status'],
    updatedAt: i % 4 === 0 ? '2026-02-15' : '',
    updatedBy: i % 4 === 0 ? 'Admin' : '',
  })),
];

// Sample workflow for Form 1A
export const sampleWorkflows: Workflow[] = [
  {
    id: 'wf-1a',
    applicationTypeId: 'app-1a',
    version: '1.0',
    status: 'published',
    roles: defaultRoles,
    actions: defaultActions,
    steps: [
      { id: 'step-start', type: 'start', name: 'Application Submitted', roleId: 'role-1', position: { x: 50, y: 50 } },
      { id: 'step-clerk', type: 'task', name: 'Document Verification', roleId: 'role-2', category: 'internal', description: 'Verify all submitted documents', position: { x: 300, y: 150 } },
      { id: 'step-so', type: 'task', name: 'Technical Review', roleId: 'role-3', category: 'internal', description: 'Review qualifications and eligibility', position: { x: 550, y: 250 } },
      { id: 'step-ext', type: 'task', name: 'External Verification', roleId: 'role-6', category: 'external', description: 'Verify credentials with issuing institution', position: { x: 550, y: 450 } },
      { id: 'step-ds', type: 'task', name: 'Recommendation Review', roleId: 'role-4', category: 'internal', description: 'Review and make recommendation', position: { x: 800, y: 350 } },
      { id: 'step-sec', type: 'task', name: 'Final Approval', roleId: 'role-5', category: 'internal', description: 'Final approval or rejection', position: { x: 1050, y: 450 } },
      { id: 'step-approved', type: 'end', name: 'Approved', roleId: 'role-5', position: { x: 1300, y: 350 } },
      { id: 'step-rejected', type: 'end', name: 'Rejected', roleId: 'role-5', position: { x: 1300, y: 550 } },
    ],
    transitions: [
      { id: 'tr-1', fromStepId: 'step-start', actionId: 'act-submit', toStepId: 'step-clerk' },
      { id: 'tr-2', fromStepId: 'step-clerk', actionId: 'act-forward', toStepId: 'step-so' },
      { id: 'tr-3', fromStepId: 'step-clerk', actionId: 'act-send-back', toStepId: 'step-start' },
      { id: 'tr-4', fromStepId: 'step-so', actionId: 'act-forward', toStepId: 'step-ds' },
      { id: 'tr-5', fromStepId: 'step-so', actionId: 'act-request-info', toStepId: 'step-ext' },
      { id: 'tr-6', fromStepId: 'step-so', actionId: 'act-send-back', toStepId: 'step-clerk' },
      { id: 'tr-7', fromStepId: 'step-ext', actionId: 'act-verify', toStepId: 'step-so' },
      { id: 'tr-8', fromStepId: 'step-ds', actionId: 'act-approve', toStepId: 'step-sec' },
      { id: 'tr-9', fromStepId: 'step-ds', actionId: 'act-send-back', toStepId: 'step-so' },
      { id: 'tr-10', fromStepId: 'step-sec', actionId: 'act-approve', toStepId: 'step-approved' },
      { id: 'tr-11', fromStepId: 'step-sec', actionId: 'act-reject', toStepId: 'step-rejected' },
    ],
  },
  {
    id: 'wf-1b',
    applicationTypeId: 'app-1b',
    version: '0.1',
    status: 'draft',
    roles: defaultRoles.slice(0, 5),
    actions: defaultActions,
    steps: [
      { id: 'step-start', type: 'start', name: 'Application Submitted', roleId: 'role-1', position: { x: 50, y: 50 } },
      { id: 'step-clerk', type: 'task', name: 'Initial Screening', roleId: 'role-2', category: 'internal', position: { x: 300, y: 150 } },
      { id: 'step-so', type: 'task', name: 'Qualification Assessment', roleId: 'role-3', category: 'internal', position: { x: 550, y: 250 } },
      { id: 'step-sec', type: 'task', name: 'Approval', roleId: 'role-5', category: 'internal', position: { x: 800, y: 350 } },
      { id: 'step-done', type: 'end', name: 'Completed', roleId: 'role-5', position: { x: 1050, y: 350 } },
    ],
    transitions: [
      { id: 'tr-1', fromStepId: 'step-start', actionId: 'act-submit', toStepId: 'step-clerk' },
      { id: 'tr-2', fromStepId: 'step-clerk', actionId: 'act-forward', toStepId: 'step-so' },
      { id: 'tr-3', fromStepId: 'step-so', actionId: 'act-forward', toStepId: 'step-sec' },
      { id: 'tr-4', fromStepId: 'step-sec', actionId: 'act-approve', toStepId: 'step-done' },
    ],
  },
  {
    id: 'wf-1c',
    applicationTypeId: 'app-1c',
    version: '2.0',
    status: 'published',
    roles: defaultRoles.slice(0, 4),
    actions: defaultActions,
    steps: [
      { id: 'step-start', type: 'start', name: 'Application Submitted', roleId: 'role-1', position: { x: 50, y: 50 } },
      { id: 'step-clerk', type: 'task', name: 'Verification', roleId: 'role-2', category: 'internal', position: { x: 300, y: 150 } },
      { id: 'step-so', type: 'task', name: 'Review', roleId: 'role-3', category: 'internal', position: { x: 550, y: 250 } },
      { id: 'step-ds', type: 'task', name: 'Provisional Approval', roleId: 'role-4', category: 'internal', position: { x: 800, y: 350 } },
      { id: 'step-approved', type: 'end', name: 'Provisionally Registered', roleId: 'role-4', position: { x: 1050, y: 350 } },
    ],
    transitions: [
      { id: 'tr-1', fromStepId: 'step-start', actionId: 'act-submit', toStepId: 'step-clerk' },
      { id: 'tr-2', fromStepId: 'step-clerk', actionId: 'act-forward', toStepId: 'step-so' },
      { id: 'tr-3', fromStepId: 'step-so', actionId: 'act-forward', toStepId: 'step-ds' },
      { id: 'tr-4', fromStepId: 'step-ds', actionId: 'act-approve', toStepId: 'step-approved' },
    ],
  },
];
