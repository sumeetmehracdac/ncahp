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

// ============= STAKEHOLDER TYPES (3 options for Step 2) =============
// These represent the 3 stakeholder TYPES, not individual organizations
export const mockStakeholders: Stakeholder[] = [
  // NCAHP Head Office
  { stakeholderId: 'ST_HO', stakeholderType: 'NCAHP_HO', name: 'NCAHP Head Office', isActive: true },

  // State Council (generic - represents any state council)
  { stakeholderId: 'ST_SC', stakeholderType: 'STATE_COUNCIL', name: 'State Council', isActive: true },

  // External
  { stakeholderId: 'ST_EXT', stakeholderType: 'EXTERNAL', name: 'External', isActive: true },
];

// ============= COMMITTEE TYPES (Mapped to Stakeholder Types) =============
export const mockCommitteeTypes: CommitteeType[] = [
  // NCAHP HO Committee Types
  {
    committeeTypeId: 'CT001',
    typeName: 'Central Assessment Board (CAB)',
    stakeholderType: 'NCAHP_HO',
    description: 'Committee constituted by the Commission to undertake prescribed duties and functions',
    isActive: true
  },
  {
    committeeTypeId: 'CT002',
    typeName: 'Professional Council Committees',
    stakeholderType: 'NCAHP_HO',
    description: 'Subject matter committees under Professional Council',
    isActive: true
  },

  // State Council Committee Types
  {
    committeeTypeId: 'CT003',
    typeName: 'Autonomous Boards',
    stakeholderType: 'STATE_COUNCIL',
    description: 'Boards constituted by State Council for specific functions',
    isActive: true
  },

  // External Committee Types
  {
    committeeTypeId: 'CT004',
    typeName: 'Institutional Regulatory Committees',
    stakeholderType: 'EXTERNAL',
    description: 'Mandatory committees at educational institutions',
    isActive: true
  },
  {
    committeeTypeId: 'CT005',
    typeName: 'External Assessment Boards',
    stakeholderType: 'EXTERNAL',
    description: 'External bodies for assessment and compliance',
    isActive: true
  },
];

// ============= COMMITTEES (Mapped to Committee Types) =============
const generateCommittees = (): Committee[] => {
  const committees: Committee[] = [];

  // === NCAHP HO Committees (Central Assessment Board type) ===
  committees.push({
    committeeId: 'COM001',
    committeeName: 'Central Assessment Board (CAB)',
    committeeType: mockCommitteeTypes[0], // CAB type
    stakeholderType: 'NCAHP_HO',
    isActive: true
  });

  committees.push({
    committeeId: 'COM002',
    committeeName: 'CAB Sub-committees',
    committeeType: mockCommitteeTypes[0], // CAB type
    stakeholderType: 'NCAHP_HO',
    isActive: true
  });

  // === NCAHP HO Committees (Professional Council Committees type) ===
  committees.push({
    committeeId: 'COM003',
    committeeName: 'Equivalence Committee',
    committeeType: mockCommitteeTypes[1], // Professional Council type
    stakeholderType: 'NCAHP_HO',
    isActive: true
  });

  committees.push({
    committeeId: 'COM004',
    committeeName: 'Technical Evaluation Committee',
    committeeType: mockCommitteeTypes[1], // Professional Council type
    stakeholderType: 'NCAHP_HO',
    isActive: true
  });

  committees.push({
    committeeId: 'COM005',
    committeeName: 'Domain Expert Committee',
    committeeType: mockCommitteeTypes[1], // Professional Council type
    stakeholderType: 'NCAHP_HO',
    isActive: true
  });

  // === State-level Autonomous Boards for each state ===
  mockStates.forEach((state, idx) => {
    const baseId = 100 + idx * 10;

    // Under-graduate Allied and Healthcare Education Board
    committees.push({
      committeeId: `COM${baseId + 1}`,
      committeeName: `${state.stateName} Under-graduate Allied and Healthcare Education Board`,
      committeeType: mockCommitteeTypes[2], // Autonomous Boards type
      state: state,
      stakeholderType: 'STATE_COUNCIL',
      isActive: true
    });

    // Post-graduate Allied and Healthcare Education Board
    committees.push({
      committeeId: `COM${baseId + 2}`,
      committeeName: `${state.stateName} Post-graduate Allied and Healthcare Education Board`,
      committeeType: mockCommitteeTypes[2], // Autonomous Boards type
      state: state,
      stakeholderType: 'STATE_COUNCIL',
      isActive: true
    });

    // Allied and Healthcare Professions Assessment and Rating Board
    committees.push({
      committeeId: `COM${baseId + 3}`,
      committeeName: `${state.stateName} Allied and Healthcare Professions Assessment and Rating Board`,
      committeeType: mockCommitteeTypes[2], // Autonomous Boards type
      state: state,
      stakeholderType: 'STATE_COUNCIL',
      isActive: true
    });

    // Allied and Healthcare Professions Ethics and Registration Board
    committees.push({
      committeeId: `COM${baseId + 4}`,
      committeeName: `${state.stateName} Allied and Healthcare Professions Ethics and Registration Board`,
      committeeType: mockCommitteeTypes[2], // Autonomous Boards type
      state: state,
      stakeholderType: 'STATE_COUNCIL',
      isActive: true
    });

    // Autonomous Board Sub-committees
    committees.push({
      committeeId: `COM${baseId + 5}`,
      committeeName: `${state.stateName} Autonomous Board Sub-committees`,
      committeeType: mockCommitteeTypes[2], // Autonomous Boards type
      state: state,
      stakeholderType: 'STATE_COUNCIL',
      isActive: true
    });
  });

  // === External Committees (Institutional Regulatory) ===
  committees.push({
    committeeId: 'COM_EXT001',
    committeeName: 'Internal Complaints Committee',
    committeeType: mockCommitteeTypes[3], // Institutional Regulatory type
    stakeholderType: 'EXTERNAL',
    isActive: true
  });

  committees.push({
    committeeId: 'COM_EXT002',
    committeeName: 'Anti-ragging Committee',
    committeeType: mockCommitteeTypes[3], // Institutional Regulatory type
    stakeholderType: 'EXTERNAL',
    isActive: true
  });

  committees.push({
    committeeId: 'COM_EXT003',
    committeeName: 'Inspection Team',
    committeeType: mockCommitteeTypes[3], // Institutional Regulatory type
    stakeholderType: 'EXTERNAL',
    isActive: true
  });

  // === External Committees (External Assessment Boards) ===
  committees.push({
    committeeId: 'COM_EXT004',
    committeeName: 'Disability Assessment Boards',
    committeeType: mockCommitteeTypes[4], // External Assessment type
    stakeholderType: 'EXTERNAL',
    isActive: true
  });

  return committees;
};

export const mockCommittees: Committee[] = generateCommittees();

// ============= ROLES (Mapped to Stakeholder Types) =============
export const mockRoles: Role[] = [
  // NCAHP Head Office Roles
  { roleId: 'R001', roleName: 'Secretary to the Commission', stakeholderType: 'NCAHP_HO', description: 'Responsible for receiving appeals, modification of Central Register details, and providing duplicate certificates', isActive: true },
  { roleId: 'R002', roleName: 'President of the CAB', stakeholderType: 'NCAHP_HO', description: 'Appointed by the Commission to lead the Central Assessment Board', isActive: true },
  { roleId: 'R003', roleName: 'Member of the CAB', stakeholderType: 'NCAHP_HO', description: 'Appointed from Professional Councils to perform Commission functions', isActive: true },
  { roleId: 'R004', roleName: 'Expert', stakeholderType: 'NCAHP_HO', description: 'Engaged by the CAB for specialized tasks', isActive: true },

  // State Council Roles
  { roleId: 'R005', roleName: 'Secretary of the State Council', stakeholderType: 'STATE_COUNCIL', description: 'Oversees state-level registration fees, EC applications, and removal of defaulters from State Register', isActive: true },
  { roleId: 'R006', roleName: 'President of Autonomous Board', stakeholderType: 'STATE_COUNCIL', description: 'A person with postgraduate degree and at least 15 years of experience leading an autonomous board', isActive: true },
  { roleId: 'R007', roleName: 'Member of Autonomous Board', stakeholderType: 'STATE_COUNCIL', description: 'Registered professionals with at least 10 years of experience assisting board functions', isActive: true },
  { roleId: 'R008', roleName: 'State Council Secretariat', stakeholderType: 'STATE_COUNCIL', description: 'Personnel appointed by the State Government to assist autonomous boards', isActive: true },

  // External Roles
  { roleId: 'R009', roleName: 'Empaneled Assessors', stakeholderType: 'EXTERNAL', description: 'Professionals empanelled by CAB or autonomous boards to conduct inspections and rating assessments', isActive: true },
  { roleId: 'R010', roleName: 'Independent Rating Assessors', stakeholderType: 'EXTERNAL', description: 'Engaged by Assessment and Rating Board to conduct institution ratings', isActive: true },
  { roleId: 'R011', roleName: 'Principal / Dean', stakeholderType: 'EXTERNAL', description: 'Head of an allied and healthcare institution or specific department', isActive: true },
  { roleId: 'R012', roleName: 'Head of Department (HoD)', stakeholderType: 'EXTERNAL', description: 'Registered professional of Professor/Associate Professor rank with overall control of a department', isActive: true },
  { roleId: 'R013', roleName: 'Grievance Redressal Officer', stakeholderType: 'EXTERNAL', description: 'Mandatory role at institutions for handling reported grievances', isActive: true },
  { roleId: 'R014', roleName: 'Information Technology Manpower', stakeholderType: 'EXTERNAL', description: 'Qualified persons employed by institutions to maintain websites and content management', isActive: true },
  { roleId: 'R015', roleName: 'Supervising Dietitian/Nutritionist', stakeholderType: 'EXTERNAL', description: 'Qualified professional who must supervise applicant clinical experience in nutrition science', isActive: true },
  { roleId: 'R016', roleName: 'Psychology Professional (Supervisor)', stakeholderType: 'EXTERNAL', description: 'Professional who supervises post-qualification experience for psychologists', isActive: true },
  { roleId: 'R017', roleName: 'Registered Allied and Healthcare Professional', stakeholderType: 'EXTERNAL', description: 'Individuals who have obtained registration with State or Central Register', isActive: true },
  { roleId: 'R018', roleName: 'Provisionally Registered Professional', stakeholderType: 'EXTERNAL', description: 'Practicing professionals granted temporary registration under Section 38 of the Act', isActive: true },
  { roleId: 'R019', roleName: 'Interim Practicing Professional', stakeholderType: 'EXTERNAL', description: 'Persons offering services post-commencement of Act but prior to regulations', isActive: true },
];

// ============= EXISTING MAPPINGS =============
export const mockExistingMappings: UserRoleMapping[] = [
  {
    mappingId: 'MAP001',
    user: mockUsers[0],
    stakeholder: mockStakeholders[0], // NCAHP HO type
    committee: mockCommittees[0],
    role: mockRoles[1], // President of CAB
    assignedBy: mockUsers[1],
    status: 'ACTIVE',

    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    mappingId: 'MAP002',
    user: mockUsers[2],
    stakeholder: mockStakeholders[1], // State Council type
    committee: mockCommittees[5], // First state committee (Haryana UG Board)
    role: mockRoles[5], // President of Autonomous Board
    assignedBy: mockUsers[0],
    status: 'ACTIVE',

    createdAt: '2024-02-15T09:30:00Z'
  },
];

// ============= CURRENT USER CONTEXT =============
// Head Office Admin context - can assign to ALL stakeholder types (HO, SC, EXT)
export const mockCurrentUserContext: CurrentUserContext = {
  user: mockUsers[0],
  stakeholder: mockStakeholders[0], // NCAHP HO type
  canAssignToAllStates: true
};

// State Council Admin context - can only assign to SC + External (NOT HO)
// This admin belongs to Haryana State Council
export const mockStateUserContext: CurrentUserContext = {
  user: mockUsers[2],
  stakeholder: {
    ...mockStakeholders[1],
    state: mockStates[0] // Haryana State - this determines which committees they see
  },
  canAssignToAllStates: false
};
