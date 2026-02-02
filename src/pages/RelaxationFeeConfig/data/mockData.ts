import type {
  RelaxationCriterion,
  NationalFeeConfig,
  StateCouncilFeeConfig,
  RelaxationPolicy,
  CombinationRule,
  UserEligibility,
  State,
  Council,
  AdminContext,
  REGISTRATION_TYPES,
} from '../types';
import { REGISTRATION_TYPES as REG_TYPES } from '../types';

// States
export const mockStates: State[] = [
  { stateId: 'state-1', stateName: 'Delhi', stateCode: 'DL' },
  { stateId: 'state-2', stateName: 'Haryana', stateCode: 'HR' },
  { stateId: 'state-3', stateName: 'Maharashtra', stateCode: 'MH' },
  { stateId: 'state-4', stateName: 'Karnataka', stateCode: 'KA' },
  { stateId: 'state-5', stateName: 'Tamil Nadu', stateCode: 'TN' },
];

// Councils
export const mockCouncils: Council[] = [
  { councilId: 'council-1', councilName: 'Delhi State Council', state: mockStates[0], isActive: true },
  { councilId: 'council-2', councilName: 'Haryana State Council', state: mockStates[1], isActive: true },
  { councilId: 'council-3', councilName: 'Maharashtra State Council', state: mockStates[2], isActive: true },
  { councilId: 'council-4', councilName: 'Karnataka State Council', state: mockStates[3], isActive: true },
  { councilId: 'council-5', councilName: 'Tamil Nadu State Council', state: mockStates[4], isActive: true },
];

// Relaxation Criteria (Master Data - NCAHP HO)
export const mockCriteria: RelaxationCriterion[] = [
  {
    id: 'crit-1',
    criterionCode: 'FEMALE',
    criterionName: 'Woman',
    category: 'GENDER',
    fieldMapping: { userFieldName: 'gender', expectedValue: 'Female' },
    description: 'Relaxation for female applicants',
    isActive: true,
    usageCount: 28,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'crit-2',
    criterionCode: 'SC',
    criterionName: 'Scheduled Caste',
    category: 'CATEGORY',
    fieldMapping: { userFieldName: 'category', expectedValue: 'SC' },
    description: 'Relaxation for Scheduled Caste applicants',
    isActive: true,
    usageCount: 28,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'crit-3',
    criterionCode: 'ST',
    criterionName: 'Scheduled Tribe',
    category: 'CATEGORY',
    fieldMapping: { userFieldName: 'category', expectedValue: 'ST' },
    description: 'Relaxation for Scheduled Tribe applicants',
    isActive: true,
    usageCount: 26,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'crit-4',
    criterionCode: 'PWD',
    criterionName: 'Person with Disability',
    category: 'ABILITY',
    fieldMapping: { userFieldName: 'disability_status', expectedValue: 'PWD' },
    description: 'Relaxation for persons with disabilities',
    isActive: true,
    usageCount: 25,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'crit-5',
    criterionCode: 'OBC',
    criterionName: 'Other Backward Class',
    category: 'CATEGORY',
    fieldMapping: { userFieldName: 'category', expectedValue: 'OBC' },
    description: 'Relaxation for OBC applicants',
    isActive: false,
    usageCount: 12,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z',
  },
  {
    id: 'crit-6',
    criterionCode: 'ARMED_FORCES',
    criterionName: 'Armed Forces Personnel',
    category: 'OCCUPATION',
    fieldMapping: { userFieldName: 'occupation', expectedValue: 'Armed_Forces' },
    description: 'Relaxation for serving armed forces personnel',
    isActive: true,
    usageCount: 18,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'crit-7',
    criterionCode: 'SENIOR_CITIZEN',
    criterionName: 'Senior Citizen',
    category: 'AGE',
    fieldMapping: { userFieldName: 'age', expectedValue: '>=60' },
    description: 'Relaxation for applicants aged 60 and above',
    isActive: true,
    usageCount: 8,
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 'crit-8',
    criterionCode: 'EWS',
    criterionName: 'Economically Weaker Section',
    category: 'CATEGORY',
    fieldMapping: { userFieldName: 'category', expectedValue: 'EWS' },
    description: 'Relaxation for EWS applicants',
    isActive: true,
    usageCount: 15,
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-03-01T00:00:00Z',
  },
];

// National Fee Configurations (NCAHP HO)
export const mockNationalFeeConfigs: NationalFeeConfig[] = [
  {
    id: 'nfc-1',
    registrationTypeId: 'reg-1',
    registrationType: REG_TYPES[0],
    defaultAmount: 5000,
    minAmount: 3000,
    maxAmount: 8000,
    gstApplicable: true,
    gstPercentage: 18,
    effectiveFrom: '2026-01-01T00:00:00Z',
    version: 'v2.3',
    status: 'ACTIVE',
    stateCouncilsUsingCustom: 8,
    totalStateCouncils: 28,
    createdAt: '2025-12-15T00:00:00Z',
  },
  {
    id: 'nfc-2',
    registrationTypeId: 'reg-2',
    registrationType: REG_TYPES[1],
    defaultAmount: 3000,
    minAmount: 2000,
    maxAmount: 5000,
    gstApplicable: true,
    gstPercentage: 18,
    effectiveFrom: '2026-01-01T00:00:00Z',
    version: 'v2.1',
    status: 'ACTIVE',
    stateCouncilsUsingCustom: 5,
    totalStateCouncils: 28,
    createdAt: '2025-12-15T00:00:00Z',
  },
  {
    id: 'nfc-3',
    registrationTypeId: 'reg-3',
    registrationType: REG_TYPES[2],
    defaultAmount: 1500,
    minAmount: 1000,
    maxAmount: 2500,
    gstApplicable: false,
    gstPercentage: 0,
    effectiveFrom: '2026-01-01T00:00:00Z',
    version: 'v1.5',
    status: 'ACTIVE',
    stateCouncilsUsingCustom: 3,
    totalStateCouncils: 28,
    createdAt: '2025-12-15T00:00:00Z',
  },
  {
    id: 'nfc-4',
    registrationTypeId: 'reg-4',
    registrationType: REG_TYPES[3],
    defaultAmount: 2000,
    minAmount: 1500,
    maxAmount: 3500,
    gstApplicable: true,
    gstPercentage: 18,
    effectiveFrom: '2026-01-01T00:00:00Z',
    version: 'v1.2',
    status: 'ACTIVE',
    stateCouncilsUsingCustom: 2,
    totalStateCouncils: 28,
    createdAt: '2025-12-15T00:00:00Z',
  },
];

// State Council Fee Configurations (Delhi example)
export const mockStateCouncilFeeConfigs: StateCouncilFeeConfig[] = [
  {
    id: 'sfc-1',
    councilId: 'council-1',
    council: mockCouncils[0],
    registrationTypeId: 'reg-1',
    registrationType: REG_TYPES[0],
    nationalConfig: mockNationalFeeConfigs[0],
    defaultAmount: 5000,
    minAmount: 4000,
    maxAmount: 7000,
    effectiveFrom: '2026-01-15T00:00:00Z',
    version: 'v1.2',
    status: 'ACTIVE',
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'sfc-2',
    councilId: 'council-1',
    council: mockCouncils[0],
    registrationTypeId: 'reg-2',
    registrationType: REG_TYPES[1],
    nationalConfig: mockNationalFeeConfigs[1],
    defaultAmount: 3000,
    minAmount: 2500,
    maxAmount: 4500,
    effectiveFrom: '2026-01-15T00:00:00Z',
    version: 'v1.1',
    status: 'ACTIVE',
    createdAt: '2026-01-10T00:00:00Z',
  },
];

// Relaxation Policies (Delhi example)
export const mockRelaxationPolicies: RelaxationPolicy[] = [
  {
    id: 'pol-1',
    councilId: 'council-1',
    registrationTypeId: 'reg-1',
    criterionId: 'crit-1',
    criterion: mockCriteria[0],
    isEnabled: true,
    relaxationPercent: 10,
    minFinalAmount: 0,
    effectiveFrom: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'pol-2',
    councilId: 'council-1',
    registrationTypeId: 'reg-1',
    criterionId: 'crit-2',
    criterion: mockCriteria[1],
    isEnabled: true,
    relaxationPercent: 15,
    minFinalAmount: 0,
    effectiveFrom: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'pol-3',
    councilId: 'council-1',
    registrationTypeId: 'reg-1',
    criterionId: 'crit-3',
    criterion: mockCriteria[2],
    isEnabled: true,
    relaxationPercent: 15,
    minFinalAmount: 0,
    effectiveFrom: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'pol-4',
    councilId: 'council-1',
    registrationTypeId: 'reg-1',
    criterionId: 'crit-4',
    criterion: mockCriteria[3],
    isEnabled: true,
    relaxationPercent: 20,
    minFinalAmount: 500,
    effectiveFrom: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'pol-5',
    councilId: 'council-1',
    registrationTypeId: 'reg-1',
    criterionId: 'crit-5',
    criterion: mockCriteria[4],
    isEnabled: false,
    relaxationPercent: 0,
    minFinalAmount: 0,
    effectiveFrom: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'pol-6',
    councilId: 'council-1',
    registrationTypeId: 'reg-1',
    criterionId: 'crit-6',
    criterion: mockCriteria[5],
    isEnabled: true,
    relaxationPercent: 25,
    minFinalAmount: 0,
    effectiveFrom: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-15T00:00:00Z',
  },
];

// Combination Rules (Delhi example)
export const mockCombinationRules: CombinationRule[] = [
  {
    id: 'combo-1',
    councilId: 'council-1',
    registrationTypeId: 'reg-1',
    criteriaIds: ['crit-1', 'crit-2'],
    criteria: [mockCriteria[0], mockCriteria[1]],
    applicationMethod: 'CUSTOM',
    combinedPercent: 22,
    minFinalAmount: 0,
    effectiveFrom: '2026-01-01T00:00:00Z',
    estimatedUsersAffected: 234,
    estimatedAnnualImpact: 35100,
    status: 'ACTIVE',
    changeReason: 'Strategic discount policy for Woman+SC combination',
    createdAt: '2025-12-20T00:00:00Z',
  },
  {
    id: 'combo-2',
    councilId: 'council-1',
    registrationTypeId: 'reg-1',
    criteriaIds: ['crit-1', 'crit-4'],
    criteria: [mockCriteria[0], mockCriteria[3]],
    applicationMethod: 'CUSTOM',
    combinedPercent: 25,
    minFinalAmount: 500,
    effectiveFrom: '2026-01-01T00:00:00Z',
    estimatedUsersAffected: 67,
    estimatedAnnualImpact: 16750,
    status: 'ACTIVE',
    changeReason: 'Special policy for Woman+PWD combination',
    createdAt: '2025-12-20T00:00:00Z',
  },
  {
    id: 'combo-3',
    councilId: 'council-1',
    registrationTypeId: 'reg-1',
    criteriaIds: ['crit-2', 'crit-4'],
    criteria: [mockCriteria[1], mockCriteria[3]],
    applicationMethod: 'SUM',
    combinedPercent: 35,
    minFinalAmount: 500,
    effectiveFrom: '2026-01-01T00:00:00Z',
    estimatedUsersAffected: 45,
    estimatedAnnualImpact: 12500,
    status: 'ACTIVE',
    changeReason: 'Standard SUM policy for SC+PWD',
    createdAt: '2025-12-20T00:00:00Z',
  },
];

// User Eligibility (sample users)
export const mockUserEligibility: UserEligibility[] = [
  {
    userId: 'user-1',
    userEmail: 'ananya.sharma@email.com',
    userName: 'Ananya Sharma',
    profileData: {
      gender: 'Female',
      category: 'SC',
      disabilityStatus: 'None',
      residentialState: 'Delhi',
      age: 32,
    },
    eligibleCriteria: [
      {
        criterion: mockCriteria[0],
        verifiedAt: '2026-01-20T00:00:00Z',
        verifiedBy: 'SYSTEM',
      },
      {
        criterion: mockCriteria[1],
        verifiedAt: '2026-01-20T00:00:00Z',
        verifiedBy: 'SYSTEM',
      },
    ],
  },
  {
    userId: 'user-2',
    userEmail: 'rajesh.kumar@email.com',
    userName: 'Rajesh Kumar',
    profileData: {
      gender: 'Male',
      category: 'ST',
      disabilityStatus: 'PWD',
      residentialState: 'Delhi',
      age: 45,
    },
    eligibleCriteria: [
      {
        criterion: mockCriteria[2],
        verifiedAt: '2026-01-18T00:00:00Z',
        verifiedBy: 'SYSTEM',
      },
      {
        criterion: mockCriteria[3],
        verifiedAt: '2026-01-18T00:00:00Z',
        verifiedBy: 'MANUAL',
      },
    ],
  },
  {
    userId: 'user-3',
    userEmail: 'priya.patel@email.com',
    userName: 'Priya Patel',
    profileData: {
      gender: 'Female',
      category: 'General',
      disabilityStatus: 'PWD',
      occupation: 'Armed_Forces',
      residentialState: 'Delhi',
      age: 28,
    },
    eligibleCriteria: [
      {
        criterion: mockCriteria[0],
        verifiedAt: '2026-01-19T00:00:00Z',
        verifiedBy: 'SYSTEM',
      },
      {
        criterion: mockCriteria[3],
        verifiedAt: '2026-01-19T00:00:00Z',
        verifiedBy: 'MANUAL',
      },
      {
        criterion: mockCriteria[5],
        verifiedAt: '2026-01-19T00:00:00Z',
        verifiedBy: 'SYSTEM',
      },
    ],
  },
];

// Admin Contexts
export const mockHOAdminContext: AdminContext = {
  adminType: 'HO',
  adminName: 'NCAHP Head Office Admin',
  canEditNational: true,
  canEditState: false,
};

export const mockSCAdminContext: AdminContext = {
  adminType: 'SC',
  adminName: 'Delhi Council Admin',
  councilId: 'council-1',
  councilName: 'Delhi State Council',
  state: mockStates[0],
  canEditNational: false,
  canEditState: true,
};

// Helper functions
export function getCriteriaForCouncil(councilId: string): RelaxationCriterion[] {
  return mockCriteria.filter(c => c.isActive);
}

export function getPoliciesForCouncil(councilId: string, registrationTypeId: string): RelaxationPolicy[] {
  return mockRelaxationPolicies.filter(
    p => p.councilId === councilId && p.registrationTypeId === registrationTypeId
  );
}

export function getCombinationRulesForCouncil(councilId: string, registrationTypeId: string): CombinationRule[] {
  return mockCombinationRules.filter(
    r => r.councilId === councilId && r.registrationTypeId === registrationTypeId
  );
}

export function getNationalFeeConfigForType(registrationTypeId: string): NationalFeeConfig | undefined {
  return mockNationalFeeConfigs.find(c => c.registrationTypeId === registrationTypeId);
}

export function getStateFeeConfigForCouncil(councilId: string, registrationTypeId: string): StateCouncilFeeConfig | undefined {
  return mockStateCouncilFeeConfigs.find(
    c => c.councilId === councilId && c.registrationTypeId === registrationTypeId
  );
}

// Calculate fee with relaxations
export function calculateFee(
  baseFee: number,
  selectedCriteriaIds: string[],
  policies: RelaxationPolicy[],
  combinationRules: CombinationRule[],
  gstApplicable: boolean,
  gstPercentage: number
): {
  totalDiscount: number;
  discountAmount: number;
  feeAfterDiscount: number;
  cgst: number;
  sgst: number;
  totalPayable: number;
  appliedRule?: CombinationRule;
} {
  // Check for combination rule first
  const matchingRule = combinationRules.find(rule => {
    const ruleSet = new Set(rule.criteriaIds);
    const selectedSet = new Set(selectedCriteriaIds);
    return ruleSet.size === selectedSet.size && [...ruleSet].every(id => selectedSet.has(id));
  });

  let totalDiscount = 0;

  if (matchingRule) {
    totalDiscount = matchingRule.combinedPercent;
  } else {
    // Sum individual percentages
    selectedCriteriaIds.forEach(criterionId => {
      const policy = policies.find(p => p.criterionId === criterionId && p.isEnabled);
      if (policy) {
        totalDiscount += policy.relaxationPercent;
      }
    });
  }

  const discountAmount = Math.round((baseFee * totalDiscount) / 100);
  const feeAfterDiscount = baseFee - discountAmount;
  
  const cgst = gstApplicable ? Math.round((feeAfterDiscount * gstPercentage / 2) / 100) : 0;
  const sgst = cgst;
  const totalPayable = feeAfterDiscount + cgst + sgst;

  return {
    totalDiscount,
    discountAmount,
    feeAfterDiscount,
    cgst,
    sgst,
    totalPayable,
    appliedRule: matchingRule,
  };
}
