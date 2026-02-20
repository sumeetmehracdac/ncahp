// ============= Mock Data for Registration Process Mapping =============

export interface ApplicationType {
  id: number;
  name: string;
  formCode: string;
  description: string;
  color: string;
}

export interface Process {
  id: number;
  name: string;
  path: string;
  processType: 'SUB' | 'MENU' | 'REV';
  description: string;
}

export interface ProcessMapping {
  mappingId: number;
  processId: number;
  sequence: number;
  isActive: boolean;
}

export interface ProfessionMappingStatus {
  professionId: number;
  professionName: string;
  professionShortName: string;
  hasCustomMapping: boolean;
}

export const applicationTypes: ApplicationType[] = [
  {
    id: 1, name: 'Permanent Registration', formCode: 'Form 1A',
    description: 'Standard permanent registration for Indian nationals with Indian qualifications',
    color: 'teal',
  },
  {
    id: 2, name: 'Provisional Registration', formCode: 'Form 1B',
    description: 'Provisional registration for professionals completing internship',
    color: 'blue',
  },
  {
    id: 3, name: 'Interim Registration', formCode: 'Form 1C',
    description: 'Short-term interim registration for specific circumstances',
    color: 'orange',
  },
  {
    id: 4, name: 'Temporary Registration (Foreigners)', formCode: 'Form 2A',
    description: 'Temporary registration for foreign nationals',
    color: 'purple',
  },
  {
    id: 5, name: 'Regular Registration (Foreign-qualified Indians)', formCode: 'Form 2B',
    description: 'Registration for Indian nationals with foreign qualifications',
    color: 'indigo',
  },
];

export const allSubProcesses: Process[] = [
  { id: 1, name: 'Registration Type Selection', path: '/registration-type', processType: 'SUB', description: 'Select profession and registration type' },
  { id: 2, name: 'Personal Information', path: '/personal-info', processType: 'SUB', description: 'Identity, contact, and address details' },
  { id: 3, name: 'Education History', path: '/education-history', processType: 'SUB', description: '10th, 12th and Diploma qualifications' },
  { id: 4, name: 'Healthcare Qualification', path: '/healthcare-qualification', processType: 'SUB', description: 'Primary allied healthcare degree' },
  { id: 5, name: 'Internship / Clinical Training', path: '/internship', processType: 'SUB', description: 'Internship and clinical field work' },
  { id: 6, name: 'Professional Experience', path: '/professional-experience', processType: 'SUB', description: 'Work and employment history' },
  { id: 7, name: 'Practice Geography', path: '/practice-geography', processType: 'SUB', description: 'State and institution of practice' },
  { id: 8, name: 'Document Upload', path: '/document-upload', processType: 'SUB', description: 'Certificates and proof documents' },
  { id: 9, name: 'Review & Submit', path: '/review-submit', processType: 'SUB', description: 'Final verification and submission' },
  { id: 10, name: 'Purpose of Registration', path: '/purpose-registration', processType: 'SUB', description: 'Purpose, duration, and previous permissions' },
  { id: 11, name: 'Passport & Visa Details', path: '/passport-visa', processType: 'SUB', description: 'Travel document information' },
  { id: 12, name: 'Academic Qualification (Foreign)', path: '/academic-qualification', processType: 'SUB', description: 'Foreign institution qualifications' },
  { id: 13, name: 'Declaration', path: '/declaration', processType: 'SUB', description: 'Legal acknowledgement and consent' },
  { id: 14, name: 'Practice Location', path: '/practice-location', processType: 'SUB', description: 'Hospital/institution for practice' },
];

// Default process mappings per application type
export const defaultMappings: Record<number, ProcessMapping[]> = {
  1: [ // Form 1A - Permanent Registration
    { mappingId: 101, processId: 1, sequence: 1, isActive: true },
    { mappingId: 102, processId: 2, sequence: 2, isActive: true },
    { mappingId: 103, processId: 3, sequence: 3, isActive: true },
    { mappingId: 104, processId: 4, sequence: 4, isActive: true },
    { mappingId: 105, processId: 5, sequence: 5, isActive: true },
    { mappingId: 106, processId: 6, sequence: 6, isActive: true },
    { mappingId: 107, processId: 7, sequence: 7, isActive: true },
    { mappingId: 108, processId: 8, sequence: 8, isActive: true },
    { mappingId: 109, processId: 9, sequence: 9, isActive: true },
  ],
  2: [ // Form 1B - Provisional Registration
    { mappingId: 201, processId: 1, sequence: 1, isActive: true },
    { mappingId: 202, processId: 2, sequence: 2, isActive: true },
    { mappingId: 203, processId: 4, sequence: 3, isActive: true },
    { mappingId: 204, processId: 5, sequence: 4, isActive: true },
    { mappingId: 205, processId: 14, sequence: 5, isActive: true },
    { mappingId: 206, processId: 8, sequence: 6, isActive: true },
    { mappingId: 207, processId: 13, sequence: 7, isActive: true },
  ],
  3: [ // Form 1C - Interim Registration
    { mappingId: 301, processId: 1, sequence: 1, isActive: true },
    { mappingId: 302, processId: 2, sequence: 2, isActive: true },
    { mappingId: 303, processId: 4, sequence: 3, isActive: true },
    { mappingId: 304, processId: 8, sequence: 4, isActive: true },
    { mappingId: 305, processId: 13, sequence: 5, isActive: true },
  ],
  4: [ // Form 2A - Temporary (Foreigners)
    { mappingId: 401, processId: 1, sequence: 1, isActive: true },
    { mappingId: 402, processId: 2, sequence: 2, isActive: true },
    { mappingId: 403, processId: 14, sequence: 3, isActive: true },
    { mappingId: 404, processId: 11, sequence: 4, isActive: true },
    { mappingId: 405, processId: 12, sequence: 5, isActive: true },
    { mappingId: 406, processId: 5, sequence: 6, isActive: true },
    { mappingId: 407, processId: 6, sequence: 7, isActive: true },
    { mappingId: 408, processId: 8, sequence: 8, isActive: true },
    { mappingId: 409, processId: 13, sequence: 9, isActive: true },
  ],
  5: [ // Form 2B - Regular (Foreign-qualified Indians)
    { mappingId: 501, processId: 1, sequence: 1, isActive: true },
    { mappingId: 502, processId: 2, sequence: 2, isActive: true },
    { mappingId: 503, processId: 10, sequence: 3, isActive: true },
    { mappingId: 504, processId: 12, sequence: 4, isActive: true },
    { mappingId: 505, processId: 5, sequence: 5, isActive: true },
    { mappingId: 506, processId: 6, sequence: 6, isActive: true },
    { mappingId: 507, processId: 8, sequence: 7, isActive: true },
    { mappingId: 508, processId: 13, sequence: 8, isActive: true },
  ],
};

// Professions with mapping status per application type
export const professionMappingStatuses: Record<number, ProfessionMappingStatus[]> = {
  1: [
    { professionId: 1, professionName: 'Physiotherapist', professionShortName: 'PT', hasCustomMapping: true },
    { professionId: 2, professionName: 'Medical Lab Technologist', professionShortName: 'MLT', hasCustomMapping: true },
    { professionId: 3, professionName: 'Optometrist', professionShortName: 'OPT', hasCustomMapping: false },
    { professionId: 4, professionName: 'Dietician', professionShortName: 'DT', hasCustomMapping: false },
    { professionId: 5, professionName: 'Occupational Therapist', professionShortName: 'OT', hasCustomMapping: false },
    { professionId: 6, professionName: 'Radiotherapy Technologist', professionShortName: 'RT', hasCustomMapping: true },
    { professionId: 7, professionName: 'Physician Associates', professionShortName: 'PA', hasCustomMapping: false },
    { professionId: 8, professionName: 'Psychologist', professionShortName: 'PSY', hasCustomMapping: false },
    { professionId: 9, professionName: 'Biomedical Engineer', professionShortName: 'BME', hasCustomMapping: true },
    { professionId: 10, professionName: 'Health Information Management Professional', professionShortName: 'HIM', hasCustomMapping: false },
    { professionId: 11, professionName: 'Cardiovascular Technologist', professionShortName: 'CVT', hasCustomMapping: false },
    { professionId: 12, professionName: 'Nuclear Medicine Technologist', professionShortName: 'NMT', hasCustomMapping: true },
  ],
  2: [
    { professionId: 1, professionName: 'Physiotherapist', professionShortName: 'PT', hasCustomMapping: false },
    { professionId: 2, professionName: 'Medical Lab Technologist', professionShortName: 'MLT', hasCustomMapping: true },
    { professionId: 3, professionName: 'Optometrist', professionShortName: 'OPT', hasCustomMapping: false },
    { professionId: 4, professionName: 'Dietician', professionShortName: 'DT', hasCustomMapping: false },
    { professionId: 5, professionName: 'Occupational Therapist', professionShortName: 'OT', hasCustomMapping: false },
  ],
  3: [
    { professionId: 1, professionName: 'Physiotherapist', professionShortName: 'PT', hasCustomMapping: false },
    { professionId: 2, professionName: 'Medical Lab Technologist', professionShortName: 'MLT', hasCustomMapping: false },
  ],
  4: [
    { professionId: 1, professionName: 'Physiotherapist', professionShortName: 'PT', hasCustomMapping: true },
    { professionId: 3, professionName: 'Optometrist', professionShortName: 'OPT', hasCustomMapping: false },
  ],
  5: [
    { professionId: 1, professionName: 'Physiotherapist', professionShortName: 'PT', hasCustomMapping: false },
    { professionId: 2, professionName: 'Medical Lab Technologist', professionShortName: 'MLT', hasCustomMapping: true },
    { professionId: 6, professionName: 'Radiotherapy Technologist', professionShortName: 'RT', hasCustomMapping: false },
  ],
};

// Custom profession mappings (overrides)
export const customProfessionMappings: Record<string, ProcessMapping[]> = {
  '1-1': [ // Form 1A, Physiotherapist
    { mappingId: 1001, processId: 1, sequence: 1, isActive: true },
    { mappingId: 1002, processId: 2, sequence: 2, isActive: true },
    { mappingId: 1003, processId: 4, sequence: 3, isActive: true }, // skip education history
    { mappingId: 1004, processId: 5, sequence: 4, isActive: true },
    { mappingId: 1005, processId: 6, sequence: 5, isActive: true },
    { mappingId: 1006, processId: 7, sequence: 6, isActive: true },
    { mappingId: 1007, processId: 8, sequence: 7, isActive: true },
    { mappingId: 1008, processId: 9, sequence: 8, isActive: true },
  ],
  '1-2': [ // Form 1A, MLT
    { mappingId: 2001, processId: 1, sequence: 1, isActive: true },
    { mappingId: 2002, processId: 2, sequence: 2, isActive: true },
    { mappingId: 2003, processId: 3, sequence: 3, isActive: true },
    { mappingId: 2004, processId: 4, sequence: 4, isActive: true },
    { mappingId: 2005, processId: 5, sequence: 5, isActive: true },
    { mappingId: 2006, processId: 8, sequence: 6, isActive: true },
    { mappingId: 2007, processId: 9, sequence: 7, isActive: true },
  ],
  '1-6': [ // Form 1A, Radiotherapy Tech
    { mappingId: 3001, processId: 1, sequence: 1, isActive: true },
    { mappingId: 3002, processId: 2, sequence: 2, isActive: true },
    { mappingId: 3003, processId: 3, sequence: 3, isActive: true },
    { mappingId: 3004, processId: 4, sequence: 4, isActive: true },
    { mappingId: 3005, processId: 5, sequence: 5, isActive: true },
    { mappingId: 3006, processId: 6, sequence: 6, isActive: true },
    { mappingId: 3007, processId: 8, sequence: 7, isActive: true },
    { mappingId: 3008, processId: 9, sequence: 8, isActive: true },
  ],
};
