// ============= Relaxation Criteria & Fee Configuration Module Types =============

// Category types for relaxation criteria
export type CriterionCategory = 'GENDER' | 'CATEGORY' | 'ABILITY' | 'OCCUPATION' | 'AGE';

// Application method for combination rules
export type ApplicationMethod = 'SUM' | 'CUSTOM';

// Admin type
export type AdminType = 'HO' | 'SC';

// Registration types
export type RegistrationType = 'REGULAR' | 'PROVISIONAL' | 'TEMPORARY' | 'INTERIM';

// Status types
export type ConfigStatus = 'ACTIVE' | 'SCHEDULED' | 'EXPIRED';

// State entity
export interface State {
  stateId: string;
  stateName: string;
  stateCode: string;
}

// Council entity
export interface Council {
  councilId: string;
  councilName: string;
  state: State;
  isActive: boolean;
}

// Registration Type entity
export interface RegistrationTypeEntity {
  id: string;
  name: string;
  code: RegistrationType;
  description: string;
  isActive: boolean;
}

// Field mapping for criteria
export interface FieldMapping {
  userFieldName: string;
  expectedValue: string;
}

// Relaxation Criterion (master data - NCAHP HO)
export interface RelaxationCriterion {
  id: string;
  criterionCode: string;
  criterionName: string;
  category: CriterionCategory;
  fieldMapping: FieldMapping;
  description?: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// National Fee Configuration (NCAHP HO sets bounds)
export interface NationalFeeConfig {
  id: string;
  registrationTypeId: string;
  registrationType: RegistrationTypeEntity;
  defaultAmount: number;
  minAmount: number;
  maxAmount: number;
  gstApplicable: boolean;
  gstPercentage: number;
  effectiveFrom: string;
  effectiveTo?: string;
  version: string;
  status: ConfigStatus;
  stateCouncilsUsingCustom: number;
  totalStateCouncils: number;
  changeReason?: string;
  createdAt: string;
}

// State Council Fee Configuration
export interface StateCouncilFeeConfig {
  id: string;
  councilId: string;
  council: Council;
  registrationTypeId: string;
  registrationType: RegistrationTypeEntity;
  nationalConfig: NationalFeeConfig;
  defaultAmount: number;
  minAmount: number;
  maxAmount: number;
  effectiveFrom: string;
  effectiveTo?: string;
  version: string;
  status: ConfigStatus;
  changeReason?: string;
  createdAt: string;
}

// Relaxation Policy (State Council sets percentages)
export interface RelaxationPolicy {
  id: string;
  councilId: string;
  registrationTypeId: string;
  criterionId: string;
  criterion: RelaxationCriterion;
  isEnabled: boolean;
  relaxationPercent: number;
  minFinalAmount: number;
  effectiveFrom: string;
  effectiveTo?: string;
  updatedAt: string;
}

// Combination Rule (State Council multi-criteria discounts)
export interface CombinationRule {
  id: string;
  councilId: string;
  registrationTypeId: string;
  criteriaIds: string[];
  criteria: RelaxationCriterion[];
  applicationMethod: ApplicationMethod;
  combinedPercent: number;
  minFinalAmount: number;
  effectiveFrom: string;
  effectiveTo?: string;
  estimatedUsersAffected: number;
  estimatedAnnualImpact: number;
  status: ConfigStatus;
  changeReason?: string;
  createdAt: string;
}

// User eligibility
export interface UserEligibility {
  userId: string;
  userEmail: string;
  userName: string;
  profileData: {
    gender?: string;
    category?: string;
    disabilityStatus?: string;
    occupation?: string;
    residentialState?: string;
    age?: number;
  };
  eligibleCriteria: {
    criterion: RelaxationCriterion;
    verifiedAt: string;
    verifiedBy: 'SYSTEM' | 'MANUAL';
    validUntil?: string;
  }[];
}

// Fee calculation breakdown
export interface FeeBreakdown {
  baseFee: number;
  appliedCriteria: RelaxationCriterion[];
  appliedPercent: number;
  appliedAmount: number;
  feeAfterRelaxation: number;
  gstApplicable: boolean;
  cgstAmount: number;
  sgstAmount: number;
  totalTaxAmount: number;
  totalPayableAmount: number;
  calculationDetails: string[];
}

// Current admin context
export interface AdminContext {
  adminType: AdminType;
  adminName: string;
  councilId?: string;
  councilName?: string;
  state?: State;
  canEditNational: boolean;
  canEditState: boolean;
}

// Form data types
export interface CreateCriterionFormData {
  criterionName: string;
  criterionCode: string;
  category: CriterionCategory;
  userFieldName: string;
  expectedValue: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateFeeConfigFormData {
  defaultAmount: number;
  minAmount: number;
  maxAmount: number;
  gstApplicable?: boolean;
  effectiveFrom: string;
  changeReason: string;
}

export interface UpdatePolicyFormData {
  isEnabled: boolean;
  relaxationPercent: number;
  minFinalAmount: number;
}

export interface CreateCombinationRuleFormData {
  criteriaIds: string[];
  applicationMethod: ApplicationMethod;
  combinedPercent: number;
  minFinalAmount: number;
  effectiveFrom: string;
  changeReason?: string;
}

// Navigation item for sidebar
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  adminTypes: AdminType[];
  description?: string;
}

// Category display config
export const CATEGORY_CONFIG: Record<CriterionCategory, { icon: string; color: string; bgColor: string; label: string }> = {
  GENDER: { icon: '👩', color: 'text-emerald-700', bgColor: 'bg-emerald-100', label: 'Gender' },
  CATEGORY: { icon: '📋', color: 'text-amber-700', bgColor: 'bg-amber-100', label: 'Category' },
  ABILITY: { icon: '♿', color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'Ability' },
  OCCUPATION: { icon: '🎖️', color: 'text-purple-700', bgColor: 'bg-purple-100', label: 'Occupation' },
  AGE: { icon: '🎂', color: 'text-rose-700', bgColor: 'bg-rose-100', label: 'Age' },
};

// Field options by category
export const FIELD_OPTIONS: Record<CriterionCategory, { field: string; values: string[] }> = {
  GENDER: { field: 'gender', values: ['Female', 'Male', 'Other'] },
  CATEGORY: { field: 'category', values: ['SC', 'ST', 'OBC', 'General', 'EWS'] },
  ABILITY: { field: 'disability_status', values: ['PWD', 'None'] },
  OCCUPATION: { field: 'occupation', values: ['Armed_Forces', 'Ex_Serviceman', 'Central_Govt', 'State_Govt', 'Private'] },
  AGE: { field: 'age', values: ['>=60', '>=65', '>=70'] },
};

// Registration type options
export const REGISTRATION_TYPES: RegistrationTypeEntity[] = [
  { id: 'reg-1', name: 'Regular Registration', code: 'REGULAR', description: 'Standard registration for healthcare professionals', isActive: true },
  { id: 'reg-2', name: 'Provisional Registration', code: 'PROVISIONAL', description: 'Temporary registration pending full qualification', isActive: true },
  { id: 'reg-3', name: 'Temporary Registration', code: 'TEMPORARY', description: 'Short-term registration for specific purposes', isActive: true },
  { id: 'reg-4', name: 'Interim Registration', code: 'INTERIM', description: 'Interim registration during transition period', isActive: true },
];
