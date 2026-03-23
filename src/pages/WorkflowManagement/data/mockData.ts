import type {
  WMAction, WMRole, CommitteeType, RoleCommitteeMapping,
  ProposalStatus, PIStatusMapping, ConditionVariable, ConditionRange,
  RoutingRule, ApprovalRule, FileViewConfig, Scheme,
} from '../types';

/* ─── Schemes ─── */
export const schemes: Scheme[] = [
  { id: 'sch-prov', name: 'Provisional Registration' },
  { id: 'sch-perm-in', name: 'Permanent Registration (Indian)' },
  { id: 'sch-perm-for', name: 'Permanent Registration (Foreign)' },
  { id: 'sch-addl', name: 'Additional Qualification' },
  { id: 'sch-gs', name: 'Good Standing Certificate' },
  { id: 'sch-renew', name: 'Renewal of Registration' },
  { id: 'sch-noc', name: 'NOC Application' },
];

/* ─── Actions ─── */
export const actions: WMAction[] = [
  { id: 'act-submit', name: 'Submit Application', systemName: 'SUBMIT', processName: 'Registration', noteSheetText: 'Application submitted by the applicant for processing.', icon: 'Send', tooltipTitle: 'Submit for review', active: true, updatedAt: '2026-03-20', updatedBy: 'Admin' },
  { id: 'act-verify', name: 'Verify Documents', systemName: 'VERIFY_DOCS', processName: 'Registration', noteSheetText: 'Documents verified for completeness and authenticity.', icon: 'FileCheck', tooltipTitle: 'Verify submitted documents', active: true, updatedAt: '2026-03-19', updatedBy: 'Admin' },
  { id: 'act-approve', name: 'Approve', systemName: 'APPROVE', processName: 'Registration', noteSheetText: 'Application approved at the current stage.', icon: 'CheckCircle', tooltipTitle: 'Approve application', active: true, updatedAt: '2026-03-18', updatedBy: 'Admin' },
  { id: 'act-reject', name: 'Reject', systemName: 'REJECT', processName: 'Registration', noteSheetText: 'Application rejected with documented reasons.', icon: 'XCircle', tooltipTitle: 'Reject application', active: true, updatedAt: '2026-03-18', updatedBy: 'Admin' },
  { id: 'act-sendback', name: 'Send Back for Revision', systemName: 'SEND_BACK', processName: 'Registration', noteSheetText: 'Application returned to applicant for corrections.', icon: 'RotateCcw', tooltipTitle: 'Return for corrections', active: true, updatedAt: '2026-03-17', updatedBy: 'Admin' },
  { id: 'act-forward', name: 'Forward to Next Level', systemName: 'FORWARD', processName: 'Registration', noteSheetText: 'Application forwarded to the next authority for review.', icon: 'ArrowRight', tooltipTitle: 'Forward to next level', active: true, updatedAt: '2026-03-16', updatedBy: 'Admin' },
  { id: 'act-clarify', name: 'Request Clarification', systemName: 'REQ_CLARIFY', processName: 'Registration', noteSheetText: 'Clarification requested from the applicant regarding submission.', icon: 'HelpCircle', tooltipTitle: 'Ask for clarification', active: true, updatedAt: '2026-03-15', updatedBy: 'Admin' },
  { id: 'act-refer', name: 'Refer to Committee', systemName: 'REFER_COMMITTEE', processName: 'Registration', noteSheetText: 'Application referred to the designated committee for expert review.', icon: 'Users', tooltipTitle: 'Send to committee', active: true, updatedAt: '2026-03-14', updatedBy: 'Admin' },
  { id: 'act-recommend', name: 'Recommend Approval', systemName: 'RECOMMEND', processName: 'Registration', noteSheetText: 'Committee recommends approval of the application.', icon: 'ThumbsUp', tooltipTitle: 'Recommend for approval', active: true, updatedAt: '2026-03-13', updatedBy: 'Admin' },
  { id: 'act-issue', name: 'Issue Certificate', systemName: 'ISSUE_CERT', processName: 'Certificate Issuance', noteSheetText: 'Registration certificate issued to the applicant.', icon: 'Award', tooltipTitle: 'Issue certificate', active: true, updatedAt: '2026-03-12', updatedBy: 'Admin' },
  { id: 'act-suspend', name: 'Suspend Registration', systemName: 'SUSPEND', processName: 'Disciplinary', noteSheetText: 'Registration suspended pending investigation.', icon: 'Ban', tooltipTitle: 'Suspend registration', active: false, updatedAt: '2026-03-10', updatedBy: 'Admin' },
  { id: 'act-restore', name: 'Restore Registration', systemName: 'RESTORE', processName: 'Disciplinary', noteSheetText: 'Registration restored after resolution of suspension.', icon: 'RefreshCw', tooltipTitle: 'Restore registration', active: false, updatedAt: '2026-03-10', updatedBy: 'Admin' },
  { id: 'act-renew', name: 'Process Renewal', systemName: 'PROCESS_RENEW', processName: 'Renewal', noteSheetText: 'Renewal application processed and registration validity extended.', icon: 'Clock', tooltipTitle: 'Process renewal', active: true, updatedAt: '2026-03-08', updatedBy: 'Admin' },
];

/* ─── Roles ─── */
export const roles: WMRole[] = [
  { id: 'role-applicant', name: 'Applicant', description: 'Individual applying for registration or certificate', color: '#0d9488', active: true },
  { id: 'role-clerk', name: 'Dealing Clerk', description: 'First point of contact for document verification', color: '#2563eb', active: true },
  { id: 'role-so', name: 'Section Officer', description: 'Technical review and qualification assessment', color: '#7c3aed', active: true },
  { id: 'role-us', name: 'Under Secretary', description: 'Administrative oversight and escalation handling', color: '#c026d3', active: true },
  { id: 'role-ds', name: 'Deputy Secretary', description: 'Senior administrative authority for complex cases', color: '#dc2626', active: true },
  { id: 'role-js', name: 'Joint Secretary', description: 'Policy-level decision making authority', color: '#b91c1c', active: true },
  { id: 'role-ms', name: 'Member Secretary', description: 'Executive authority of the commission', color: '#ea580c', active: true },
  { id: 'role-chair', name: 'Chairperson', description: 'Head of committee with final decision authority', color: '#d97706', active: true },
  { id: 'role-cm', name: 'Committee Member', description: 'Expert member providing domain assessment', color: '#65a30d', active: true },
  { id: 'role-fo', name: 'Finance Officer', description: 'Financial verification and fee validation', color: '#0891b2', active: true },
  { id: 'role-reg', name: 'Registrar', description: 'Final authority for certificate issuance', color: '#4f46e5', active: true },
];

/* ─── Committee Types ─── */
export const committeeTypes: CommitteeType[] = [
  { id: 'ct-none', name: 'No Committee Type', description: 'Individual role without committee assignment', active: true },
  { id: 'ct-pac', name: 'Professional Advisory Committee', description: 'Advisory body for professional standards', active: true },
  { id: 'ct-expert', name: 'Expert Committee', description: 'Domain expert panel for technical evaluation', active: true },
  { id: 'ct-apex', name: 'Apex Committee', description: 'Highest decision-making body of the commission', active: true },
  { id: 'ct-ethics', name: 'Ethics Committee', description: 'Body handling ethical compliance and disciplinary matters', active: true },
  { id: 'ct-taskforce', name: 'Task Force', description: 'Special purpose committee for time-bound assignments', active: true },
];

/* ─── Role-Committee Mappings ─── */
export const roleCommitteeMappings: RoleCommitteeMapping[] = [
  { id: 'rcm-1', roleId: 'role-clerk', committeeTypeId: 'ct-none', active: true },
  { id: 'rcm-2', roleId: 'role-so', committeeTypeId: 'ct-none', active: true },
  { id: 'rcm-3', roleId: 'role-us', committeeTypeId: 'ct-none', active: true },
  { id: 'rcm-4', roleId: 'role-ds', committeeTypeId: 'ct-none', active: true },
  { id: 'rcm-5', roleId: 'role-chair', committeeTypeId: 'ct-pac', active: true },
  { id: 'rcm-6', roleId: 'role-chair', committeeTypeId: 'ct-expert', active: true },
  { id: 'rcm-7', roleId: 'role-chair', committeeTypeId: 'ct-apex', active: true },
  { id: 'rcm-8', roleId: 'role-cm', committeeTypeId: 'ct-pac', active: true },
  { id: 'rcm-9', roleId: 'role-cm', committeeTypeId: 'ct-expert', active: true },
  { id: 'rcm-10', roleId: 'role-cm', committeeTypeId: 'ct-ethics', active: true },
  { id: 'rcm-11', roleId: 'role-ms', committeeTypeId: 'ct-apex', active: true },
  { id: 'rcm-12', roleId: 'role-ms', committeeTypeId: 'ct-none', active: true },
  { id: 'rcm-13', roleId: 'role-fo', committeeTypeId: 'ct-none', active: true },
  { id: 'rcm-14', roleId: 'role-reg', committeeTypeId: 'ct-none', active: true },
  { id: 'rcm-15', roleId: 'role-chair', committeeTypeId: 'ct-ethics', active: true },
  { id: 'rcm-16', roleId: 'role-cm', committeeTypeId: 'ct-taskforce', active: true },
];

/* ─── Proposal Statuses ─── */
export const statuses: ProposalStatus[] = [
  { id: 'st-submitted', name: 'Submitted', code: 'SUBMITTED', category: 'initial', color: '#2563eb', active: true },
  { id: 'st-under-verification', name: 'Under Verification', code: 'UNDER_VERIF', category: 'in-review', color: '#d97706', active: true },
  { id: 'st-verified', name: 'Verified', code: 'VERIFIED', category: 'in-review', color: '#0d9488', active: true },
  { id: 'st-under-review', name: 'Under Review', code: 'UNDER_REVIEW', category: 'in-review', color: '#2563eb', active: true },
  { id: 'st-pending-committee', name: 'Pending Committee Review', code: 'PENDING_COMM', category: 'in-review', color: '#7c3aed', active: true },
  { id: 'st-committee-reviewed', name: 'Committee Reviewed', code: 'COMM_REVIEWED', category: 'in-review', color: '#4f46e5', active: true },
  { id: 'st-recommended', name: 'Recommended for Approval', code: 'RECOMMENDED', category: 'in-review', color: '#65a30d', active: true },
  { id: 'st-approved', name: 'Approved', code: 'APPROVED', category: 'final', color: '#16a34a', active: true },
  { id: 'st-rejected', name: 'Rejected', code: 'REJECTED', category: 'terminal', color: '#dc2626', active: true },
  { id: 'st-returned', name: 'Returned for Revision', code: 'RETURNED', category: 'in-review', color: '#ea580c', active: true },
  { id: 'st-cert-issued', name: 'Certificate Issued', code: 'CERT_ISSUED', category: 'terminal', color: '#059669', active: true },
  { id: 'st-suspended', name: 'Suspended', code: 'SUSPENDED', category: 'terminal', color: '#dc2626', active: false },
  { id: 'st-restored', name: 'Restored', code: 'RESTORED', category: 'final', color: '#0d9488', active: false },
];

/* ─── PI Status Mappings ─── */
export const piStatusMappings: PIStatusMapping[] = [
  { id: 'pi-1', actionId: 'act-submit', piStatusText: 'Your application has been submitted successfully and is under processing.', active: true },
  { id: 'pi-2', actionId: 'act-verify', piStatusText: 'Your documents are being verified by the processing authority.', active: true },
  { id: 'pi-3', actionId: 'act-approve', piStatusText: 'Your application has been approved at the current stage.', active: true },
  { id: 'pi-4', actionId: 'act-reject', piStatusText: 'Your application has been rejected. Please check remarks for details.', active: true },
  { id: 'pi-5', actionId: 'act-sendback', piStatusText: 'Your application has been returned for corrections. Please review and resubmit.', active: true },
  { id: 'pi-6', actionId: 'act-forward', piStatusText: 'Your application has been forwarded to the next authority for review.', active: true },
  { id: 'pi-7', actionId: 'act-clarify', piStatusText: 'Clarification has been requested regarding your application. Please respond.', active: true },
  { id: 'pi-8', actionId: 'act-refer', piStatusText: 'Your application has been referred to a committee for expert review.', active: true },
  { id: 'pi-9', actionId: 'act-issue', piStatusText: 'Your registration certificate has been issued. Download from the portal.', active: true },
];

/* ─── Condition Variables ─── */
export const conditionVariables: ConditionVariable[] = [
  { id: 'cv-amount', name: 'proposal_amt', displayLabel: 'Proposal Amount', dataType: 'numeric', description: 'Total requested grant amount in the proposal' },
  { id: 'cv-none', name: 'no_condition', displayLabel: 'No Condition', dataType: 'boolean', description: 'Default pass-through with no conditional branching' },
  { id: 'cv-experience', name: 'experience_years', displayLabel: 'Experience (Years)', dataType: 'numeric', description: 'Years of professional experience of the applicant' },
];

/* ─── Condition Ranges ─── */
export const conditionRanges: ConditionRange[] = [
  { id: 'cr-1', variableId: 'cv-amount', min: 0, max: 8000000, label: '0 – 80 Lakhs', active: true },
  { id: 'cr-2', variableId: 'cv-amount', min: 8000000, max: 50000000, label: '80L – 5 Crores', active: true },
  { id: 'cr-3', variableId: 'cv-amount', min: 50000000, max: 999999999, label: 'Above 5 Crores', active: true },
  { id: 'cr-4', variableId: 'cv-experience', min: 0, max: 2, label: '0 – 2 Years', active: true },
  { id: 'cr-5', variableId: 'cv-experience', min: 2, max: 5, label: '2 – 5 Years', active: true },
  { id: 'cr-6', variableId: 'cv-experience', min: 5, max: 100, label: '5+ Years', active: true },
];

/* ─── Routing Rules ─── */
export const routingRules: RoutingRule[] = [
  { id: 'rr-1', actionId: 'act-approve', currentRoleId: 'role-clerk', nextRoleIds: ['role-so'], scheme: 'sch-prov', comments: 'After clerk approval, forward to section officer' },
  { id: 'rr-2', actionId: 'act-approve', currentRoleId: 'role-so', nextRoleIds: ['role-us'], scheme: 'sch-prov', comments: 'Section officer approval routes to under secretary' },
  { id: 'rr-3', actionId: 'act-refer', currentRoleId: 'role-so', nextRoleIds: ['role-chair', 'role-cm'], scheme: 'sch-prov', comments: 'Referral goes to committee chairperson and members' },
  { id: 'rr-4', actionId: 'act-approve', currentRoleId: 'role-us', nextRoleIds: ['role-reg'], scheme: 'sch-prov', comments: 'Under secretary approval routes to registrar for final decision' },
  { id: 'rr-5', actionId: 'act-sendback', currentRoleId: 'role-so', nextRoleIds: ['role-clerk'], scheme: 'sch-prov', comments: 'Send back returns to clerk for re-verification' },
  { id: 'rr-6', actionId: 'act-reject', currentRoleId: 'role-reg', nextRoleIds: ['role-clerk'], scheme: 'sch-prov', comments: 'Registrar rejection notifies clerk for closure' },
  { id: 'rr-7', actionId: 'act-approve', currentRoleId: 'role-reg', nextRoleIds: ['role-reg'], scheme: 'sch-prov', comments: 'Registrar approval triggers certificate issuance' },
];

/* ─── Approval Rules ─── */
export const approvalRules: ApprovalRule[] = [
  { id: 'ar-1', scheme: 'sch-prov', currentRoleId: 'role-clerk', currentCommitteeTypeId: 'ct-none', actionId: 'act-verify', nextRoleId: 'role-so', nextCommitteeTypeId: 'ct-none', conditionLabel: 'No Condition', resultingStatusId: 'st-verified', monitoringFlag: false, active: true },
  { id: 'ar-2', scheme: 'sch-prov', currentRoleId: 'role-so', currentCommitteeTypeId: 'ct-none', actionId: 'act-approve', nextRoleId: 'role-us', nextCommitteeTypeId: 'ct-none', conditionLabel: 'No Condition', resultingStatusId: 'st-under-review', monitoringFlag: false, active: true },
  { id: 'ar-3', scheme: 'sch-prov', currentRoleId: 'role-so', currentCommitteeTypeId: 'ct-none', actionId: 'act-refer', nextRoleId: 'role-chair', nextCommitteeTypeId: 'ct-expert', conditionLabel: 'No Condition', resultingStatusId: 'st-pending-committee', monitoringFlag: false, active: true },
  { id: 'ar-4', scheme: 'sch-prov', currentRoleId: 'role-us', currentCommitteeTypeId: 'ct-none', actionId: 'act-approve', nextRoleId: 'role-reg', nextCommitteeTypeId: 'ct-none', conditionLabel: '0 – 80 Lakhs', resultingStatusId: 'st-recommended', monitoringFlag: false, active: true },
  { id: 'ar-5', scheme: 'sch-prov', currentRoleId: 'role-us', currentCommitteeTypeId: 'ct-none', actionId: 'act-forward', nextRoleId: 'role-ds', nextCommitteeTypeId: 'ct-none', conditionLabel: '80L – 5 Crores', resultingStatusId: 'st-under-review', monitoringFlag: false, active: true },
  { id: 'ar-6', scheme: 'sch-prov', currentRoleId: 'role-chair', currentCommitteeTypeId: 'ct-expert', actionId: 'act-recommend', nextRoleId: 'role-us', nextCommitteeTypeId: 'ct-none', conditionLabel: 'No Condition', resultingStatusId: 'st-committee-reviewed', monitoringFlag: false, active: true },
  { id: 'ar-7', scheme: 'sch-prov', currentRoleId: 'role-reg', currentCommitteeTypeId: 'ct-none', actionId: 'act-approve', nextRoleId: 'role-reg', nextCommitteeTypeId: 'ct-none', conditionLabel: 'No Condition', resultingStatusId: 'st-approved', monitoringFlag: false, active: true },
  { id: 'ar-8', scheme: 'sch-prov', currentRoleId: 'role-reg', currentCommitteeTypeId: 'ct-none', actionId: 'act-issue', nextRoleId: 'role-reg', nextCommitteeTypeId: 'ct-none', conditionLabel: 'No Condition', resultingStatusId: 'st-cert-issued', monitoringFlag: false, active: true },
  { id: 'ar-9', scheme: 'sch-perm-in', currentRoleId: 'role-clerk', currentCommitteeTypeId: 'ct-none', actionId: 'act-verify', nextRoleId: 'role-so', nextCommitteeTypeId: 'ct-none', conditionLabel: 'No Condition', resultingStatusId: 'st-verified', monitoringFlag: false, active: true },
  { id: 'ar-10', scheme: 'sch-perm-in', currentRoleId: 'role-so', currentCommitteeTypeId: 'ct-none', actionId: 'act-approve', nextRoleId: 'role-ds', nextCommitteeTypeId: 'ct-none', conditionLabel: 'No Condition', resultingStatusId: 'st-under-review', monitoringFlag: false, active: true },
];

/* ─── File View Configs ─── */
export const fileViewConfigs: FileViewConfig[] = [
  { id: 'fvc-1', actionId: 'act-approve', linkName: 'View Application', link: '/applications/:id', viewLink: true, remarks: true, showRemarks: true, parameters: 'applicationId' },
  { id: 'fvc-2', actionId: 'act-reject', linkName: 'View Application', link: '/applications/:id', viewLink: true, remarks: true, showRemarks: true, parameters: 'applicationId,reason' },
  { id: 'fvc-3', actionId: 'act-refer', linkName: 'Committee Brief', link: '/committee/:id/brief', viewLink: true, remarks: false, showRemarks: false, parameters: 'committeeId' },
  { id: 'fvc-4', actionId: 'act-issue', linkName: 'Certificate Preview', link: '/certificates/:id/preview', viewLink: true, remarks: false, showRemarks: false, parameters: 'certificateId' },
];

/* ─── Role-Action Permissions (matrix data) ─── */
export const roleActionPermissions: Record<string, string[]> = {
  'role-applicant': ['act-submit'],
  'role-clerk': ['act-verify', 'act-sendback', 'act-clarify', 'act-forward'],
  'role-so': ['act-approve', 'act-reject', 'act-sendback', 'act-forward', 'act-clarify', 'act-refer'],
  'role-us': ['act-approve', 'act-reject', 'act-sendback', 'act-forward'],
  'role-ds': ['act-approve', 'act-reject', 'act-forward'],
  'role-js': ['act-approve', 'act-reject'],
  'role-ms': ['act-approve', 'act-reject', 'act-forward'],
  'role-chair': ['act-approve', 'act-reject', 'act-recommend'],
  'role-cm': ['act-recommend', 'act-clarify'],
  'role-fo': ['act-approve', 'act-reject', 'act-clarify'],
  'role-reg': ['act-approve', 'act-reject', 'act-issue', 'act-suspend', 'act-restore'],
};
