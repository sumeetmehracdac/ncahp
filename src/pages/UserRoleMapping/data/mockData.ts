import type { 
  State, 
  User, 
  Stakeholder, 
  CommitteeType, 
  Committee, 
  Role, 
  UserRoleMapping,
  CurrentUserContext 
} from '../types';

// ============= STATES =============
export const mockStates: State[] = [
  { stateId: 'ST001', stateName: 'Haryana', stateCode: 'HR', isActive: true },
  { stateId: 'ST002', stateName: 'Gujarat', stateCode: 'GJ', isActive: true },
  { stateId: 'ST003', stateName: 'Maharashtra', stateCode: 'MH', isActive: true },
  { stateId: 'ST004', stateName: 'Karnataka', stateCode: 'KA', isActive: true },
  { stateId: 'ST005', stateName: 'Tamil Nadu', stateCode: 'TN', isActive: true },
  { stateId: 'ST006', stateName: 'Kerala', stateCode: 'KL', isActive: true },
  { stateId: 'ST007', stateName: 'Uttar Pradesh', stateCode: 'UP', isActive: true },
  { stateId: 'ST008', stateName: 'Rajasthan', stateCode: 'RJ', isActive: true },
  { stateId: 'ST009', stateName: 'West Bengal', stateCode: 'WB', isActive: true },
  { stateId: 'ST010', stateName: 'Punjab', stateCode: 'PB', isActive: true },
];

// ============= USERS =============
export const mockUsers: User[] = [
  { userId: 'U001', email: 'anil.sharma@ncahp.gov.in', fullName: 'Anil Sharma', avatarUrl: '', isActive: true },
  { userId: 'U002', email: 'priya.verma@ncahp.gov.in', fullName: 'Priya Verma', avatarUrl: '', isActive: true },
  { userId: 'U003', email: 'rajesh.kumar@haryana.gov.in', fullName: 'Rajesh Kumar', avatarUrl: '', isActive: true },
  { userId: 'U004', email: 'sunita.devi@haryana.gov.in', fullName: 'Sunita Devi', avatarUrl: '', isActive: true },
  { userId: 'U005', email: 'amit.patel@gujarat.gov.in', fullName: 'Amit Patel', avatarUrl: '', isActive: true },
  { userId: 'U006', email: 'meera.joshi@maharashtra.gov.in', fullName: 'Meera Joshi', avatarUrl: '', isActive: true },
  { userId: 'U007', email: 'suresh.nair@kerala.gov.in', fullName: 'Suresh Nair', avatarUrl: '', isActive: true },
  { userId: 'U008', email: 'kavitha.rajan@tamilnadu.gov.in', fullName: 'Kavitha Rajan', avatarUrl: '', isActive: true },
  { userId: 'U009', email: 'vikram.singh@rajasthan.gov.in', fullName: 'Vikram Singh', avatarUrl: '', isActive: true },
  { userId: 'U010', email: 'deepa.sharma@punjab.gov.in', fullName: 'Deepa Sharma', avatarUrl: '', isActive: true },
  { userId: 'U011', email: 'arjun.reddy@karnataka.gov.in', fullName: 'Arjun Reddy', avatarUrl: '', isActive: true },
  { userId: 'U012', email: 'neha.gupta@external.org', fullName: 'Neha Gupta', avatarUrl: '', isActive: true },
];

// ============= STAKEHOLDERS =============
export const mockStakeholders: Stakeholder[] = [
  // NCAHP HO (National Level)
  { stakeholderId: 'SH001', stakeholderType: 'NCAHP_HO', name: 'NCAHP Headquarters', isActive: true },
  
  // State Councils
  { stakeholderId: 'SH002', stakeholderType: 'STATE_COUNCIL', name: 'Haryana State Council', state: mockStates[0], isActive: true },
  { stakeholderId: 'SH003', stakeholderType: 'STATE_COUNCIL', name: 'Gujarat State Council', state: mockStates[1], isActive: true },
  { stakeholderId: 'SH004', stakeholderType: 'STATE_COUNCIL', name: 'Maharashtra State Council', state: mockStates[2], isActive: true },
  { stakeholderId: 'SH005', stakeholderType: 'STATE_COUNCIL', name: 'Karnataka State Council', state: mockStates[3], isActive: true },
  { stakeholderId: 'SH006', stakeholderType: 'STATE_COUNCIL', name: 'Tamil Nadu State Council', state: mockStates[4], isActive: true },
  { stakeholderId: 'SH007', stakeholderType: 'STATE_COUNCIL', name: 'Kerala State Council', state: mockStates[5], isActive: true },
  { stakeholderId: 'SH008', stakeholderType: 'STATE_COUNCIL', name: 'Uttar Pradesh State Council', state: mockStates[6], isActive: true },
  { stakeholderId: 'SH009', stakeholderType: 'STATE_COUNCIL', name: 'Rajasthan State Council', state: mockStates[7], isActive: true },
  { stakeholderId: 'SH010', stakeholderType: 'STATE_COUNCIL', name: 'West Bengal State Council', state: mockStates[8], isActive: true },
  { stakeholderId: 'SH011', stakeholderType: 'STATE_COUNCIL', name: 'Punjab State Council', state: mockStates[9], isActive: true },
  
  // External
  { stakeholderId: 'SH012', stakeholderType: 'EXTERNAL', name: 'External Partner Organization', isActive: true },
];

// ============= COMMITTEE TYPES =============
export const mockCommitteeTypes: CommitteeType[] = [
  { 
    committeeTypeId: 'CT001', 
    typeName: 'Ethics & Registration Board', 
    stakeholderType: 'NCAHP_HO',
    description: 'National level ethics and registration oversight',
    isActive: true 
  },
  { 
    committeeTypeId: 'CT002', 
    typeName: 'Assessment & Rating Board', 
    stakeholderType: 'STATE_COUNCIL',
    description: 'State-level assessment and rating of professionals',
    isActive: true 
  },
  { 
    committeeTypeId: 'CT003', 
    typeName: 'State Council', 
    stakeholderType: 'STATE_COUNCIL',
    description: 'State regulatory council for healthcare professionals',
    isActive: true 
  },
  { 
    committeeTypeId: 'CT004', 
    typeName: 'Undergraduate Board', 
    stakeholderType: 'STATE_COUNCIL',
    description: 'Undergraduate education and curriculum oversight',
    isActive: true 
  },
  { 
    committeeTypeId: 'CT005', 
    typeName: 'Postgraduate Board', 
    stakeholderType: 'STATE_COUNCIL',
    description: 'Postgraduate education and specialization oversight',
    isActive: true 
  },
  { 
    committeeTypeId: 'CT006', 
    typeName: 'Disciplinary Committee', 
    stakeholderType: 'NCAHP_HO',
    description: 'National disciplinary action committee',
    isActive: true 
  },
];

// ============= COMMITTEES =============
const generateStateCommittees = (): Committee[] => {
  const committees: Committee[] = [];
  
  // NCAHP HO committees (national level, no state)
  committees.push({
    committeeId: 'COM001',
    committeeName: 'National Ethics & Registration Board',
    committeeType: mockCommitteeTypes[0],
    stakeholderType: 'NCAHP_HO',
    isActive: true
  });
  
  committees.push({
    committeeId: 'COM002',
    committeeName: 'National Disciplinary Committee',
    committeeType: mockCommitteeTypes[5],
    stakeholderType: 'NCAHP_HO',
    isActive: true
  });
  
  // State-level committees for each state
  mockStates.forEach((state, idx) => {
    // Assessment & Rating Board
    committees.push({
      committeeId: `COM${100 + idx * 10 + 1}`,
      committeeName: `${state.stateName} Assessment & Rating Board`,
      committeeType: mockCommitteeTypes[1],
      state: state,
      stakeholderType: 'STATE_COUNCIL',
      isActive: true
    });
    
    // State Council
    committees.push({
      committeeId: `COM${100 + idx * 10 + 2}`,
      committeeName: `${state.stateName} State Council`,
      committeeType: mockCommitteeTypes[2],
      state: state,
      stakeholderType: 'STATE_COUNCIL',
      isActive: true
    });
    
    // UG Board
    committees.push({
      committeeId: `COM${100 + idx * 10 + 3}`,
      committeeName: `${state.stateName} Undergraduate Board`,
      committeeType: mockCommitteeTypes[3],
      state: state,
      stakeholderType: 'STATE_COUNCIL',
      isActive: true
    });
    
    // PG Board
    committees.push({
      committeeId: `COM${100 + idx * 10 + 4}`,
      committeeName: `${state.stateName} Postgraduate Board`,
      committeeType: mockCommitteeTypes[4],
      state: state,
      stakeholderType: 'STATE_COUNCIL',
      isActive: true
    });
  });
  
  return committees;
};

export const mockCommittees: Committee[] = generateStateCommittees();

// ============= ROLES =============
export const mockRoles: Role[] = [
  { roleId: 'R001', roleName: 'Chairperson', description: 'Head of the committee', isActive: true },
  { roleId: 'R002', roleName: 'Vice-Chairperson', description: 'Deputy head of the committee', isActive: true },
  { roleId: 'R003', roleName: 'Member', description: 'Regular committee member', isActive: true },
  { roleId: 'R004', roleName: 'Member Secretary', description: 'Administrative secretary', isActive: true },
  { roleId: 'R005', roleName: 'Assessor', description: 'Conducts assessments and evaluations', isActive: true },
  { roleId: 'R006', roleName: 'Coordinator', description: 'Coordinates committee activities', isActive: true },
  { roleId: 'R007', roleName: 'Academic Visitor', description: 'Observer for academic matters', isActive: true },
  { roleId: 'R008', roleName: 'Technical Advisor', description: 'Provides technical expertise', isActive: true },
];

// ============= EXISTING MAPPINGS =============
export const mockExistingMappings: UserRoleMapping[] = [
  {
    mappingId: 'MAP001',
    user: mockUsers[0],
    stakeholder: mockStakeholders[0],
    committee: mockCommittees[0],
    role: mockRoles[0],
    assignedBy: mockUsers[1],
    status: 'ACTIVE',
    validFrom: '2024-01-01',
    validUntil: '2026-12-31',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    mappingId: 'MAP002',
    user: mockUsers[2],
    stakeholder: mockStakeholders[1],
    committee: mockCommittees[2],
    role: mockRoles[0],
    assignedBy: mockUsers[0],
    status: 'ACTIVE',
    validFrom: '2024-02-15',
    createdAt: '2024-02-15T09:30:00Z'
  },
  {
    mappingId: 'MAP003',
    user: mockUsers[4],
    stakeholder: mockStakeholders[2],
    committee: mockCommittees[6],
    role: mockRoles[2],
    assignedBy: mockUsers[0],
    status: 'ACTIVE',
    validFrom: '2024-03-01',
    createdAt: '2024-03-01T11:00:00Z'
  },
];

// ============= CURRENT USER CONTEXT =============
// Simulating that the current logged-in user is an NCAHP HO admin
export const mockCurrentUserContext: CurrentUserContext = {
  user: mockUsers[0],
  stakeholder: mockStakeholders[0],
  canAssignToAllStates: true // NCAHP HO can assign to all states
};

// For testing state-filtered view, use this context instead:
export const mockStateUserContext: CurrentUserContext = {
  user: mockUsers[2],
  stakeholder: mockStakeholders[1], // Haryana State Council
  canAssignToAllStates: false
};
