// ============= Payment System Module Types =============

export type AdminType = 'NCAHP' | 'SC';

export type RelaxationApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// ---- Entities ----

export interface ApplicationType {
  applicationTypeId: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface State {
  stateId: number;
  stateName: string;
  stateCode: string;
  stateCouncilId: number;
}

export interface StateCouncil {
  stateCouncilId: number;
  councilName: string;
  isActive: boolean;
}

// Table 1: default_amount
export interface DefaultAmount {
  defaultAmountId: number;
  applicationTypeId: number;
  applicationType?: ApplicationType;
  minAmount: number;
  maxAmount: number;
  defaultAmount: number;
  isRelaxation: boolean;
  isGst: boolean;
  sgst: number | null;
  cgst: number | null;
  igst: number | null;
  utgst: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Table 2: state_specific_amount
export interface StateSpecificAmount {
  stateSpecificAmountId: number;
  stateCouncilId: number;
  stateCouncil?: StateCouncil;
  stateId: number;
  state?: State;
  applicationTypeId: number;
  applicationType?: ApplicationType;
  amount: number;
  isGst: boolean | null;
  sgst: number | null;
  cgst: number | null;
  igst: number | null;
  utgst: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Table 3: relaxation_master
export interface RelaxationMaster {
  relaxationId: number;
  relaxationName: string;
  relaxationDescription: string | null;
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Table 4: stakeholder_relaxation
export interface StakeholderRelaxation {
  stakeholderRelaxationId: number;
  stakeholderTypeId: number; // 21=NCAHP, 23=State Council
  stateCouncilId: number | null;
  stateCouncil?: StateCouncil;
  stateId: number | null;
  state?: State;
  applicationTypeId: number;
  applicationType?: ApplicationType;
  relaxationId: number;
  relaxation?: RelaxationMaster;
  amount: number;
  fromDate: string | null;
  toDate: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Table 5: relaxation_application
export interface RelaxationApplication {
  relaxationApplicationId: number;
  stateCouncilId: number;
  stateCouncil?: StateCouncil;
  description: string;
  status: RelaxationApplicationStatus;
  adminRemarks: string | null;
  approvedRelaxationId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Fee calculation result
export interface FeeBreakdown {
  baseFee: number;
  relaxationApplied: boolean;
  relaxationName?: string;
  relaxedAmount?: number;
  isGst: boolean;
  sgstRate: number;
  cgstRate: number;
  igstRate: number;
  utgstRate: number;
  sgstAmount: number;
  cgstAmount: number;
  igstAmount: number;
  utgstAmount: number;
  totalGst: number;
  totalPayable: number;
}

// Admin context
export interface AdminContext {
  adminType: AdminType;
  adminName: string;
  stateCouncilId?: number;
  councilName?: string;
  state?: State;
  canEditNational: boolean;
  canEditState: boolean;
}
