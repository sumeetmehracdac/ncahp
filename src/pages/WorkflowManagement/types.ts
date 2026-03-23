/* ─── Workflow Management Module Types ─── */

export interface WMAction {
  id: string;
  name: string;
  systemName: string;
  processName: string;
  noteSheetText: string;
  icon: string;
  tooltipTitle: string;
  active: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface WMRole {
  id: string;
  name: string;
  description: string;
  color: string;
  active: boolean;
}

export interface CommitteeType {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface RoleCommitteeMapping {
  id: string;
  roleId: string;
  committeeTypeId: string;
  active: boolean;
}

export interface ProposalStatus {
  id: string;
  name: string;
  code: string;
  category: 'initial' | 'in-review' | 'final' | 'terminal';
  color: string;
  active: boolean;
}

export interface PIStatusMapping {
  id: string;
  actionId: string;
  piStatusText: string;
  active: boolean;
}

export interface ConditionVariable {
  id: string;
  name: string;
  displayLabel: string;
  dataType: 'numeric' | 'categorical' | 'boolean';
  description: string;
}

export interface ConditionRange {
  id: string;
  variableId: string;
  min: number;
  max: number;
  label: string;
  active: boolean;
}

export interface RoutingRule {
  id: string;
  actionId: string;
  currentRoleId: string;
  nextRoleIds: string[];
  scheme: string;
  comments: string;
}

export interface ApprovalRule {
  id: string;
  scheme: string;
  currentRoleId: string;
  currentCommitteeTypeId: string;
  actionId: string;
  nextRoleId: string;
  nextCommitteeTypeId: string;
  conditionLabel: string;
  resultingStatusId: string;
  monitoringFlag: boolean;
  active: boolean;
}

export interface FileViewConfig {
  id: string;
  actionId: string;
  linkName: string;
  link: string;
  viewLink: boolean;
  remarks: boolean;
  showRemarks: boolean;
  parameters: string;
}

export interface Scheme {
  id: string;
  name: string;
}

export type ProcessName = 'Registration' | 'Certificate Issuance' | 'Renewal' | 'Disciplinary';

/* Navigation structure */
export interface NavLayer {
  label: string;
  icon: string;
  pages: NavPage[];
}

export interface NavPage {
  label: string;
  path: string;
  description: string;
}
