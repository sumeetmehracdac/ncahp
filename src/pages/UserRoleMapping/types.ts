// ============= NCAHP User-Role-Committee Mapping Types =============

// Stakeholder Types (3 levels in the hierarchy)
export type StakeholderType = 'NCAHP_HO' | 'STATE_COUNCIL' | 'EXTERNAL';

// Assignment Status
export type AssignmentStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_APPROVAL' | 'REVOKED';

// State entity
export interface State {
  stateId: string;
  stateName: string;
  stateCode: string;
  isActive: boolean;
}

// User entity
export interface User {
  userId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  isActive: boolean;
}

// Stakeholder entity
export interface Stakeholder {
  stakeholderId: string;
  stakeholderType: StakeholderType;
  name: string;
  state?: State;
  isActive: boolean;
}

// Committee Type entity
export interface CommitteeType {
  committeeTypeId: string;
  typeName: string;
  stakeholderType: StakeholderType;
  description?: string;
  isActive: boolean;
}

// Committee entity
export interface Committee {
  committeeId: string;
  committeeName: string;
  committeeType: CommitteeType;
  state?: State;
  stakeholderType: StakeholderType;
  isActive: boolean;
}

// Role entity
export interface Role {
  roleId: string;
  roleName: string;
  stakeholderType?: StakeholderType; // Map roles to stakeholder types for RBAC filtering
  committeeType?: CommitteeType; // NULL if unmapped (wildcard role)
  description?: string;
  isActive: boolean;
}

// User-Role Mapping (the main assignment)
export interface UserRoleMapping {
  mappingId: string;
  user: User;
  stakeholder: Stakeholder;
  committee: Committee;
  role: Role;
  assignedBy: User;
  status: AssignmentStatus;

  createdAt: string;
}

// Form data for the 6-step wizard
export interface UserRoleMappingFormData {
  userId: string;
  stakeholderId: string;
  committeeTypeId: string;
  committeeId: string;
  roleIds: string[]; // Support multi-role selection
  defaultRoleId: string; // Default role from the selected roles
}

// Filter options state
export interface FilterOptions {
  users: User[];
  stakeholders: Stakeholder[];
  committeeTypes: CommitteeType[];
  committees: Committee[];
  roles: Role[];
}

// Current user context (for state filtering)
export interface CurrentUserContext {
  user: User;
  stakeholder: Stakeholder;
  canAssignToAllStates: boolean;
}

// Step configuration
export interface StepConfig {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
}

// Step validation result
export interface StepValidation {
  isValid: boolean;
  errorMessage?: string;
}
