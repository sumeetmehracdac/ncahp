import type {
  ApplicationType,
  State,
  StateCouncil,
  DefaultAmount,
  StateSpecificAmount,
  RelaxationMaster,
  StakeholderRelaxation,
  RelaxationApplication,
} from '../types';

// ---- Application Types ----
export const APPLICATION_TYPES: ApplicationType[] = [
  { applicationTypeId: 1, name: 'Permanent Registration', code: 'PERM_REG', isActive: true },
  { applicationTypeId: 2, name: 'Provisional Registration', code: 'PROV_REG', isActive: true },
  { applicationTypeId: 3, name: 'Additional Qualification', code: 'ADD_QUAL', isActive: true },
  { applicationTypeId: 4, name: 'Good Standing Certificate', code: 'GSC', isActive: true },
  { applicationTypeId: 5, name: 'NOC for Abroad Practice', code: 'NOC_ABROAD', isActive: true },
];

// ---- State Councils ----
export const STATE_COUNCILS: StateCouncil[] = [
  { stateCouncilId: 1, councilName: 'Haryana State Council', isActive: true },
  { stateCouncilId: 2, councilName: 'Delhi State Council', isActive: true },
  { stateCouncilId: 3, councilName: 'Maharashtra State Council', isActive: true },
  { stateCouncilId: 4, councilName: 'Tamil Nadu State Council', isActive: true },
];

// ---- States ----
export const STATES: State[] = [
  { stateId: 1, stateName: 'Haryana', stateCode: 'HR', stateCouncilId: 1 },
  { stateId: 2, stateName: 'Delhi', stateCode: 'DL', stateCouncilId: 2 },
  { stateId: 3, stateName: 'Maharashtra', stateCode: 'MH', stateCouncilId: 3 },
  { stateId: 4, stateName: 'Goa', stateCode: 'GA', stateCouncilId: 3 },
  { stateId: 5, stateName: 'Tamil Nadu', stateCode: 'TN', stateCouncilId: 4 },
  { stateId: 6, stateName: 'Puducherry', stateCode: 'PY', stateCouncilId: 4 },
];

// ---- Default Amounts ----
export const MOCK_DEFAULT_AMOUNTS: DefaultAmount[] = [
  {
    defaultAmountId: 1, applicationTypeId: 1,
    applicationType: APPLICATION_TYPES[0],
    minAmount: 500, maxAmount: 5000, defaultAmount: 1000,
    isRelaxation: true, isGst: true,
    sgst: 9, cgst: 9, igst: 18, utgst: 0,
    isActive: true, createdAt: '2026-01-15T00:00:00Z', updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    defaultAmountId: 2, applicationTypeId: 2,
    applicationType: APPLICATION_TYPES[1],
    minAmount: 200, maxAmount: 2000, defaultAmount: 500,
    isRelaxation: true, isGst: true,
    sgst: 9, cgst: 9, igst: 18, utgst: 0,
    isActive: true, createdAt: '2026-01-15T00:00:00Z', updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    defaultAmountId: 3, applicationTypeId: 3,
    applicationType: APPLICATION_TYPES[2],
    minAmount: 300, maxAmount: 3000, defaultAmount: 750,
    isRelaxation: false, isGst: false,
    sgst: null, cgst: null, igst: null, utgst: null,
    isActive: true, createdAt: '2026-01-20T00:00:00Z', updatedAt: '2026-01-20T00:00:00Z',
  },
  {
    defaultAmountId: 4, applicationTypeId: 4,
    applicationType: APPLICATION_TYPES[3],
    minAmount: 100, maxAmount: 1000, defaultAmount: 250,
    isRelaxation: true, isGst: true,
    sgst: 9, cgst: 9, igst: 18, utgst: 0,
    isActive: true, createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z',
  },
];

// ---- State Specific Amounts ----
export const MOCK_STATE_AMOUNTS: StateSpecificAmount[] = [
  {
    stateSpecificAmountId: 1, stateCouncilId: 1, stateCouncil: STATE_COUNCILS[0],
    stateId: 1, state: STATES[0], applicationTypeId: 1, applicationType: APPLICATION_TYPES[0],
    amount: 800, isGst: null, sgst: null, cgst: null, igst: null, utgst: null,
    isActive: true, createdAt: '2026-01-16T00:00:00Z', updatedAt: '2026-01-16T00:00:00Z',
  },
  {
    stateSpecificAmountId: 2, stateCouncilId: 2, stateCouncil: STATE_COUNCILS[1],
    stateId: 2, state: STATES[1], applicationTypeId: 1, applicationType: APPLICATION_TYPES[0],
    amount: 1000, isGst: true, sgst: 0, cgst: 0, igst: 18, utgst: 0,
    isActive: true, createdAt: '2026-01-16T00:00:00Z', updatedAt: '2026-01-16T00:00:00Z',
  },
  {
    stateSpecificAmountId: 3, stateCouncilId: 3, stateCouncil: STATE_COUNCILS[2],
    stateId: 3, state: STATES[2], applicationTypeId: 1, applicationType: APPLICATION_TYPES[0],
    amount: 1200, isGst: null, sgst: null, cgst: null, igst: null, utgst: null,
    isActive: true, createdAt: '2026-01-16T00:00:00Z', updatedAt: '2026-01-16T00:00:00Z',
  },
  {
    stateSpecificAmountId: 4, stateCouncilId: 3, stateCouncil: STATE_COUNCILS[2],
    stateId: 4, state: STATES[3], applicationTypeId: 1, applicationType: APPLICATION_TYPES[0],
    amount: 900, isGst: null, sgst: null, cgst: null, igst: null, utgst: null,
    isActive: true, createdAt: '2026-01-16T00:00:00Z', updatedAt: '2026-01-16T00:00:00Z',
  },
  {
    stateSpecificAmountId: 5, stateCouncilId: 1, stateCouncil: STATE_COUNCILS[0],
    stateId: 1, state: STATES[0], applicationTypeId: 2, applicationType: APPLICATION_TYPES[1],
    amount: 400, isGst: null, sgst: null, cgst: null, igst: null, utgst: null,
    isActive: true, createdAt: '2026-01-16T00:00:00Z', updatedAt: '2026-01-16T00:00:00Z',
  },
];

// ---- Relaxation Master ----
export const MOCK_RELAXATIONS: RelaxationMaster[] = [
  {
    relaxationId: 1, relaxationName: 'Women Candidate Discount',
    relaxationDescription: '50% discount for all women candidates',
    relaxationQuery: "gender = 'Female'",
    isActive: true, createdAt: '2026-01-10T00:00:00Z', updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    relaxationId: 2, relaxationName: 'SC/ST Category Discount',
    relaxationDescription: 'Discount for SC/ST category applicants',
    relaxationQuery: "category IN ('SC', 'ST')",
    isActive: true, createdAt: '2026-01-10T00:00:00Z', updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    relaxationId: 3, relaxationName: 'PWD Applicant Discount',
    relaxationDescription: 'Discount for persons with disability',
    relaxationQuery: "disability_status = 'PWD'",
    isActive: true, createdAt: '2026-01-12T00:00:00Z', updatedAt: '2026-01-12T00:00:00Z',
  },
  {
    relaxationId: 4, relaxationName: 'Senior Citizen Discount',
    relaxationDescription: 'Discount for applicants aged 60 and above',
    relaxationQuery: 'age >= 60',
    isActive: true, createdAt: '2026-01-15T00:00:00Z', updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    relaxationId: 5, relaxationName: 'Armed Forces Discount',
    relaxationDescription: 'Discount for armed forces personnel',
    relaxationQuery: "occupation = 'Armed_Forces'",
    isActive: false, createdAt: '2026-01-18T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z',
  },
];

// ---- Stakeholder Relaxations ----
export const MOCK_STAKEHOLDER_RELAXATIONS: StakeholderRelaxation[] = [
  {
    stakeholderRelaxationId: 1, stakeholderTypeId: 23,
    stateCouncilId: 1, stateCouncil: STATE_COUNCILS[0],
    stateId: 1, state: STATES[0],
    applicationTypeId: 1, applicationType: APPLICATION_TYPES[0],
    relaxationId: 1, relaxation: MOCK_RELAXATIONS[0],
    amount: 500, fromDate: '2026-02-01', toDate: '2026-12-31', order: 1,
    isActive: true, createdAt: '2026-01-20T00:00:00Z', updatedAt: '2026-01-20T00:00:00Z',
  },
  {
    stakeholderRelaxationId: 2, stakeholderTypeId: 23,
    stateCouncilId: 1, stateCouncil: STATE_COUNCILS[0],
    stateId: 1, state: STATES[0],
    applicationTypeId: 1, applicationType: APPLICATION_TYPES[0],
    relaxationId: 2, relaxation: MOCK_RELAXATIONS[1],
    amount: 400, fromDate: '2026-02-01', toDate: null, order: 2,
    isActive: true, createdAt: '2026-01-20T00:00:00Z', updatedAt: '2026-01-20T00:00:00Z',
  },
  {
    stakeholderRelaxationId: 3, stakeholderTypeId: 21,
    stateCouncilId: null, stateId: null,
    applicationTypeId: 1, applicationType: APPLICATION_TYPES[0],
    relaxationId: 3, relaxation: MOCK_RELAXATIONS[2],
    amount: 300, fromDate: null, toDate: null, order: 1,
    isActive: true, createdAt: '2026-01-22T00:00:00Z', updatedAt: '2026-01-22T00:00:00Z',
  },
];

// ---- Relaxation Applications ----
export const MOCK_RELAXATION_APPLICATIONS: RelaxationApplication[] = [
  {
    relaxationApplicationId: 1, stateCouncilId: 1, stateCouncil: STATE_COUNCILS[0],
    description: 'Request for EWS category discount – 25% discount for Economically Weaker Section applicants',
    status: 'PENDING', adminRemarks: null, approvedRelaxationId: null,
    isActive: true, createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z',
  },
  {
    relaxationApplicationId: 2, stateCouncilId: 3, stateCouncil: STATE_COUNCILS[2],
    description: 'Request for rural area practitioners discount – 30% off for healthcare workers serving in rural areas',
    status: 'APPROVED', adminRemarks: 'Approved. Added as relaxation ID 6.',
    approvedRelaxationId: 6,
    isActive: true, createdAt: '2026-01-25T00:00:00Z', updatedAt: '2026-01-28T00:00:00Z',
  },
  {
    relaxationApplicationId: 3, stateCouncilId: 2, stateCouncil: STATE_COUNCILS[1],
    description: 'Request for government employee discount – waive fees entirely for govt employees',
    status: 'REJECTED', adminRemarks: 'Complete fee waiver not within policy guidelines. Please resubmit with a partial discount proposal.',
    approvedRelaxationId: null,
    isActive: true, createdAt: '2026-01-20T00:00:00Z', updatedAt: '2026-01-26T00:00:00Z',
  },
];

// ---- Admin Contexts ----
export const NCAHP_ADMIN = {
  adminType: 'NCAHP' as const,
  adminName: 'Dr. Rajesh Kumar',
  canEditNational: true,
  canEditState: false,
};

export const SC_ADMIN = {
  adminType: 'SC' as const,
  adminName: 'Dr. Priya Sharma',
  stateCouncilId: 1,
  councilName: 'Haryana State Council',
  state: STATES[0],
  canEditNational: false,
  canEditState: true,
};
