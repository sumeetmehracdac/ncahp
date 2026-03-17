import { ApplicationType, Role, ActionDef, Workflow } from '../types';

export const roles: Role[] = [
  { id: 'role-applicant', name: 'Applicant', color: '#0d9488' },
  { id: 'role-clerk', name: 'Dealing Clerk', color: '#2563eb' },
  { id: 'role-so', name: 'Section Officer', color: '#7c3aed' },
  { id: 'role-us', name: 'Under Secretary', color: '#c026d3' },
  { id: 'role-ds', name: 'Deputy Secretary', color: '#dc2626' },
  { id: 'role-committee', name: 'Committee Member', color: '#ea580c' },
  { id: 'role-registrar', name: 'Registrar', color: '#ca8a04' },
];

export const actionDefs: ActionDef[] = [
  { id: 'act-submit', name: 'Submit Application', type: 'positive' },
  { id: 'act-approve', name: 'Approve', type: 'positive' },
  { id: 'act-reject', name: 'Reject', type: 'negative' },
  { id: 'act-sendback', name: 'Send Back for Revision', type: 'negative' },
  { id: 'act-forward', name: 'Forward to Next Level', type: 'neutral' },
  { id: 'act-clarify', name: 'Request Clarification', type: 'neutral' },
  { id: 'act-refer', name: 'Refer to Committee', type: 'neutral' },
  { id: 'act-issue', name: 'Issue Certificate', type: 'positive' },
];

export const applicationTypes: ApplicationType[] = [
  { id: 'at-1a', name: 'Form 1A: Provisional Registration', category: 'Registration', description: 'Initial provisional registration for healthcare professionals entering practice', workflowStatus: 'published', updatedAt: '2026-03-15' },
  { id: 'at-2a', name: 'Form 2A: Permanent Registration (Indian)', category: 'Registration', description: 'Permanent registration for Indian healthcare professionals with completed training', workflowStatus: 'draft', updatedAt: '2026-03-10' },
  { id: 'at-2b', name: 'Form 2B: Permanent Registration (Foreign)', category: 'Registration', description: 'Permanent registration for foreign-qualified healthcare professionals', workflowStatus: 'none', updatedAt: '2026-03-08' },
  { id: 'at-3', name: 'Form 3: Additional Qualification', category: 'Registration', description: 'Registration of additional qualifications for already registered professionals', workflowStatus: 'none', updatedAt: '2026-03-05' },
  { id: 'at-4', name: 'Form 4: Good Standing Certificate', category: 'Certificate', description: 'Certificate of good standing for professionals seeking practice abroad', workflowStatus: 'none', updatedAt: '2026-03-01' },
  { id: 'at-5', name: 'Form 5: Renewal of Registration', category: 'Registration', description: 'Periodic renewal of existing registration', workflowStatus: 'none', updatedAt: '2026-02-28' },
  { id: 'at-6', name: 'Form 6: NOC Application', category: 'Certificate', description: 'No Objection Certificate for inter-state or international practice', workflowStatus: 'none', updatedAt: '2026-02-25' },
  { id: 'at-7', name: 'Form 7: Duplicate Certificate', category: 'Certificate', description: 'Request for duplicate registration certificate', workflowStatus: 'none', updatedAt: '2026-02-20' },
  { id: 'at-8', name: 'Form 8: Name/Address Change', category: 'Administrative', description: 'Update personal details on registration records', workflowStatus: 'none', updatedAt: '2026-02-15' },
  { id: 'at-9', name: 'Form 9: Voluntary Surrender', category: 'Administrative', description: 'Voluntary surrender of registration by professional', workflowStatus: 'none', updatedAt: '2026-02-10' },
  { id: 'at-10', name: 'Form 10: Restoration of Registration', category: 'Registration', description: 'Restoration of previously surrendered or lapsed registration', workflowStatus: 'none', updatedAt: '2026-02-05' },
  { id: 'at-11', name: 'Form 11: Temporary Registration', category: 'Registration', description: 'Temporary registration for visiting foreign professionals', workflowStatus: 'none', updatedAt: '2026-02-01' },
];

export const workflows: Workflow[] = [
  {
    id: 'wf-1a',
    applicationTypeId: 'at-1a',
    status: 'published',
    version: '1.0',
    updatedAt: '2026-03-15',
    steps: [
      { id: 'step-1', name: 'Application Submission', type: 'start', roleId: 'role-applicant', description: 'Applicant submits the registration form with all required documents and fees', order: 1, actions: [{ actionId: 'act-submit', targetStepId: 'step-2' }] },
      { id: 'step-2', name: 'Document Verification', type: 'process', roleId: 'role-clerk', description: 'Dealing clerk verifies submitted documents for completeness and authenticity', order: 2, actions: [{ actionId: 'act-approve', targetStepId: 'step-3' }, { actionId: 'act-sendback', targetStepId: 'step-1' }, { actionId: 'act-reject', targetStepId: 'step-6' }] },
      { id: 'step-3', name: 'Technical Review', type: 'process', roleId: 'role-so', description: 'Section officer reviews application technical details and qualification validity', order: 3, actions: [{ actionId: 'act-approve', targetStepId: 'step-4' }, { actionId: 'act-sendback', targetStepId: 'step-2' }, { actionId: 'act-refer', targetStepId: 'step-5' }] },
      { id: 'step-4', name: 'Final Approval', type: 'process', roleId: 'role-registrar', description: 'Registrar provides final approval and authorises certificate issuance', order: 4, actions: [{ actionId: 'act-approve', targetStepId: 'step-7' }, { actionId: 'act-reject', targetStepId: 'step-6' }, { actionId: 'act-sendback', targetStepId: 'step-3' }] },
      { id: 'step-5', name: 'Committee Review', type: 'process', roleId: 'role-committee', description: 'Committee reviews referred applications requiring special consideration', order: 5, actions: [{ actionId: 'act-approve', targetStepId: 'step-4' }, { actionId: 'act-reject', targetStepId: 'step-6' }] },
      { id: 'step-6', name: 'Application Rejected', type: 'terminal', roleId: 'role-clerk', description: 'Application is rejected and the applicant is formally notified with reasons', order: 6, actions: [] },
      { id: 'step-7', name: 'Certificate Issued', type: 'terminal', roleId: 'role-registrar', description: 'Registration certificate is generated and issued to the applicant', order: 7, actions: [] },
    ],
  },
  {
    id: 'wf-2a',
    applicationTypeId: 'at-2a',
    status: 'draft',
    version: '0.1',
    updatedAt: '2026-03-10',
    steps: [
      { id: 's2a-1', name: 'Application Submission', type: 'start', roleId: 'role-applicant', description: 'Applicant submits permanent registration application', order: 1, actions: [{ actionId: 'act-submit', targetStepId: 's2a-2' }] },
      { id: 's2a-2', name: 'Initial Screening', type: 'process', roleId: 'role-clerk', description: 'Dealing clerk performs initial document screening and data validation', order: 2, actions: [{ actionId: 'act-forward', targetStepId: 's2a-3' }, { actionId: 'act-sendback', targetStepId: 's2a-1' }] },
      { id: 's2a-3', name: 'Detailed Verification', type: 'process', roleId: 'role-so', description: 'Section officer performs detailed qualification and experience verification', order: 3, actions: [{ actionId: 'act-approve', targetStepId: 's2a-4' }, { actionId: 'act-reject', targetStepId: 's2a-5' }] },
      { id: 's2a-4', name: 'Registration Granted', type: 'terminal', roleId: 'role-registrar', description: 'Permanent registration is granted to the applicant', order: 4, actions: [] },
      { id: 's2a-5', name: 'Application Rejected', type: 'terminal', roleId: 'role-clerk', description: 'Application is rejected with formal notification', order: 5, actions: [] },
    ],
  },
];
