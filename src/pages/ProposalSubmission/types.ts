// ============================================================================
// PROPOSAL SUBMISSION FORM - TYPE DEFINITIONS
// ============================================================================

// --------------------------------------------------------------------------
// SCREEN 1: PROPOSAL DETAILS
// --------------------------------------------------------------------------

export interface COPIDetail {
  id: string;
  name: string;
  designation: string;
  department: string;
  institution: string;
}

export interface ProposalDetailsData {
  fundingOrganisation: string;
  totalOutlay: string;
  workOrderNumber: string;
  workOrderDate: string;
  startDate: string;
  endDate: string;
  objective: string;
  deliverables: string;
  fundingAgency: string;
  coPIs: COPIDetail[];
  endorsementLetter: File | null;
  originalProposal: File | null;
}

export const FUNDING_AGENCIES = [
  { value: 'ANRF', label: 'ANRF (Anusandhan National Research Foundation)' },
  { value: 'CSIR', label: 'CSIR (Council of Scientific and Industrial Research)' },
  { value: 'DST', label: 'DST (Department of Science and Technology)' },
  { value: 'DBT', label: 'DBT (Department of Biotechnology)' },
  { value: 'ICMR', label: 'ICMR (Indian Council of Medical Research)' },
] as const;

// --------------------------------------------------------------------------
// SCREEN 2: BUDGET MASTER
// --------------------------------------------------------------------------

// Year-wise cost structure (reusable across budget types)
export interface YearwiseCost {
  year1: number;
  year2: number;
  year3: number;
}

// Budget for Equipment
export interface EquipmentItem {
  id: string;
  genericName: string;
  make: string;
  model: string;
  quantity: number;
  isImported: boolean;
  costInINR: number;
  spareTimePercent: number;
  detailedJustification: string;
  institute: string;
}

// Budget for Research Personnel
export interface PersonnelDesignation {
  value: string;
  label: string;
}

export const PERSONNEL_DESIGNATIONS: PersonnelDesignation[] = [
  { value: 'JRF-SRF-RA', label: 'JOM-Research Fellowship JRF SRF RA' },
  { value: 'OTHER', label: 'JOM- Research Personnel other than JRF SRF RA' },
];

export interface PersonnelEmolument {
  year: string;
  monthlyEmolument: number;
  hra: 'No HRA' | 'HRA';
  workMonths: number;
  total: number;
  medicalAllowance: number;
  grandTotal: number;
}

export interface ResearchPersonnelItem {
  id: string;
  designation: string;
  numberOfPersons: number;
  detailedJustification: string;
  yearwiseEmoluments: PersonnelEmolument[];
  grossTotal: number;
  institute: string;
}

// Budget for Consumables
export interface ConsumableItem {
  id: string;
  detailedJustification: string;
  yearwiseCost: YearwiseCost;
  grossTotal: number;
  institute: string;
}

// Budget for Travel
export type TravelType = 'Inland travel' | 'International travel';

export interface TravelItem {
  id: string;
  travelType: TravelType;
  detailedJustification: string;
  yearwiseCost: YearwiseCost;
  grossTotal: number;
  institute: string;
}

// Budget for Contingency
export interface ContingencyItem {
  id: string;
  detailedJustification: string;
  yearwiseCost: YearwiseCost;
  grossTotal: number;
  institute: string;
}

// Budget for Other Cost
export interface OtherCostItem {
  id: string;
  otherCostType: string;
  detailedJustification: string;
  yearwiseCost: YearwiseCost;
  grossTotal: number;
  institute: string;
}

// Budget for Overhead
export interface OverheadItem {
  id: string;
  yearwiseCost: YearwiseCost;
  grossTotal: number;
  institute: string;
}

// --------------------------------------------------------------------------
// COMPLETE FORM STATE
// --------------------------------------------------------------------------

export interface BudgetMasterData {
  equipment: EquipmentItem[];
  personnel: ResearchPersonnelItem[];
  consumables: ConsumableItem[];
  travel: TravelItem[];
  contingency: ContingencyItem[];
  otherCost: OtherCostItem[];
  overhead: OverheadItem[];
}

export interface ProposalFormState {
  proposalDetails: ProposalDetailsData;
  budgetMaster: BudgetMasterData;
  currentScreen: 'proposal' | 'budget';
  currentBudgetStep: number;
}

// Initial state factories
export const createInitialProposalDetails = (): ProposalDetailsData => ({
  fundingOrganisation: 'All India Institute of Medical Sciences (AIIMS)',
  totalOutlay: '',
  workOrderNumber: '',
  workOrderDate: '',
  startDate: '',
  endDate: '',
  objective: '',
  deliverables: '',
  fundingAgency: '',
  coPIs: [],
  endorsementLetter: null,
  originalProposal: null,
});

export const createInitialBudgetMaster = (): BudgetMasterData => ({
  equipment: [],
  personnel: [],
  consumables: [],
  travel: [],
  contingency: [],
  otherCost: [],
  overhead: [],
});

export const createInitialFormState = (): ProposalFormState => ({
  proposalDetails: createInitialProposalDetails(),
  budgetMaster: createInitialBudgetMaster(),
  currentScreen: 'proposal',
  currentBudgetStep: 1,
});

// Budget steps configuration
export const BUDGET_STEPS = [
  { id: 1, title: 'Equipment', shortTitle: 'Equipment' },
  { id: 2, title: 'Research Personnel', shortTitle: 'Personnel' },
  { id: 3, title: 'Consumables', shortTitle: 'Consumables' },
  { id: 4, title: 'Travel', shortTitle: 'Travel' },
  { id: 5, title: 'Contingency', shortTitle: 'Contingency' },
  { id: 6, title: 'Other Cost', shortTitle: 'Other' },
  { id: 7, title: 'Overhead', shortTitle: 'Overhead' },
] as const;
