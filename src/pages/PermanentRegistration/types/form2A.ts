// Form 2A Types - Foreign Nationals with Foreign Qualification

export interface Form2AAddressFields {
  addressLine1: string;
  addressLine2: string;
  city: string;
  pincode: string;
  country: string;
}

export interface Form2AEmergencyContact {
  name: string;
  relationship: string;
  contactNumber: string;
  email: string;
  address: string;
}

export interface Form2AContactPersonIndia {
  name: string;
  relationship: string;
  contactNumber: string;
  email: string;
  address: string;
}

export interface Form2APassportDetails {
  passportNumber: string;
  issuingCountry: string;
  issueDate: string;
  expiryDate: string;
}

export interface Form2AVisaDetails {
  visaNumber: string;
  visaType: string;
  issueDate: string;
  expiryDate: string;
}

export interface Form2AAcademicQualification {
  id: string;
  qualificationName: string;
  institutionName: string;
  university: string;
  courseName: string;
  country: string;
  durationMonths: string;
  admissionYear: string;
  passingYear: string;
  modeOfLearning: string; // "Yes" (Regular) or "No"
  mediumOfInstruction: string;
  regulatoryAuthority: string;
  certificate: File | null;
  transcript: File | null;
  attestedSyllabus: File | null;
}

export interface Form2AInternship {
  id: string;
  programName: string;
  organizationNameAddress: string;
  country: string;
  startDate: string;
  completionDate: string;
  totalHours: string;
  coreDuties: string;
  certificate: File | null;
}

export interface Form2AExperience {
  id: string;
  designation: string;
  organizationNameAddress: string;
  country: string;
  startDate: string;
  completionDate: string;
  coreDuties: string;
  licenseNumber: string;
  issuingAuthority: string;
  certificate: File | null;
}

export interface Form2APracticeState {
  state: string;
  district: string;
  institutionName: string;
  address: string;
  proofDocument: File | null;
}

export interface Form2APreviousPermission {
  id: string;
  countryName: string;
  regulatoryBody: string;
  licenseNumber: string;
  dateOfInitialRegistration: string;
  dateOfExpiry: string;
  certificate: File | null;
}

export interface Form2ADeclaration {
  permitCancellation: boolean;
  permitCancellationDetails: string;
  legalDispute: boolean;
  legalDisputeDetails: string;
}

export interface Form2ADocuments {
  passportCopy: File | null;
  visaCopy: File | null;
  englishProficiency: File | null;
  endorsementLetter: File | null;
  sponsorshipProof: File | null;
}

export interface Form2AData {
  // Step 1: Registration Type & Profession (shared)
  registrationType: string;
  profession: string;

  // Step 2: Personal Details
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  age: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  photo: File | null;
  isDifferentlyAbled: boolean;
  differentlyAbledCertificate: File | null;
  fatherName: string;
  motherName: string;
  nationality: string;
  permanentAddress: Form2AAddressFields;
  correspondenceAddressDifferent: boolean;
  correspondenceAddress: Form2AAddressFields;

  // Step 3: Purpose of Registration & Practice Location (Combined as per PDF Screen-3)
  purposeOfRegistration: string[];
  durationOfStayIndia: string;
  expectedStartDate: string;
  expectedEndDate: string;
  stateOfResidenceIndia: string;
  districtOfResidenceIndia: string;
  addressOfResidenceIndia: string;
  practiceStates: Form2APracticeState[];
  previousPermissions: Form2APreviousPermission[];

  // Step 4: Passport & Visa + Emergency Contact
  passportDetails: Form2APassportDetails;
  visaDetails: Form2AVisaDetails;
  emergencyContact: Form2AEmergencyContact;
  hasContactPersonIndia: boolean;
  contactPersonIndia: Form2AContactPersonIndia;

  // Step 5: Academic Qualification
  academicQualifications: Form2AAcademicQualification[];

  // Step 6: Internship/Clinical Training
  internships: Form2AInternship[];

  // Step 7: Professional Experience (optional)
  experiences: Form2AExperience[];

  // Step 8: State of Practice in India (separate from Screen-3)
  additionalPracticeStates: Form2APracticeState[];

  // Step 9: Documents
  documents: Form2ADocuments;

  // Step 10: Declaration
  declaration: Form2ADeclaration;
  declarationAccepted: boolean;
}

export const purposeOfRegistrationOptions = [
  { value: 'higher_studies', label: 'Higher Studies / Academic Bridging (e.g., PG (degree/diploma), Fellowship, Research Work)' },
  { value: 'workshop', label: 'Workshop/Training' },
  { value: 'teaching', label: 'Teaching' },
  { value: 'observership', label: 'Observership' },
  { value: 'clinical_work', label: 'Clinical Work' },
  { value: 'community_healthcare', label: 'Community Healthcare work' }
];

export const initialForm2AData: Form2AData = {
  registrationType: '2A',
  profession: '',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  age: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
  photo: null,
  isDifferentlyAbled: false,
  differentlyAbledCertificate: null,
  fatherName: '',
  motherName: '',
  nationality: '',
  permanentAddress: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    pincode: '',
    country: ''
  },
  correspondenceAddressDifferent: false,
  correspondenceAddress: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    pincode: '',
    country: ''
  },
  purposeOfRegistration: [],
  durationOfStayIndia: '',
  expectedStartDate: '',
  expectedEndDate: '',
  stateOfResidenceIndia: '',
  districtOfResidenceIndia: '',
  addressOfResidenceIndia: '',
  practiceStates: [
    {
      state: '',
      district: '',
      institutionName: '',
      address: '',
      proofDocument: null
    }
  ],
  previousPermissions: [],
  passportDetails: {
    passportNumber: '',
    issuingCountry: '',
    issueDate: '',
    expiryDate: ''
  },
  visaDetails: {
    visaNumber: '',
    visaType: '',
    issueDate: '',
    expiryDate: ''
  },
  emergencyContact: {
    name: '',
    relationship: '',
    contactNumber: '',
    email: '',
    address: ''
  },
  hasContactPersonIndia: false,
  contactPersonIndia: {
    name: '',
    relationship: '',
    contactNumber: '',
    email: '',
    address: ''
  },
  academicQualifications: [
    {
      id: '1',
      qualificationName: '',
      institutionName: '',
      university: '',
      courseName: '',
      country: '',
      durationMonths: '',
      admissionYear: '',
      passingYear: '',
      modeOfLearning: '',
      mediumOfInstruction: '',
      regulatoryAuthority: '',
      certificate: null,
      transcript: null,
      attestedSyllabus: null
    }
  ],
  internships: [
    {
      id: '1',
      programName: '',
      organizationNameAddress: '',
      country: '',
      startDate: '',
      completionDate: '',
      totalHours: '',
      coreDuties: '',
      certificate: null
    }
  ],
  experiences: [],
  additionalPracticeStates: [],
  documents: {
    passportCopy: null,
    visaCopy: null,
    englishProficiency: null,
    endorsementLetter: null,
    sponsorshipProof: null
  },
  declaration: {
    permitCancellation: false,
    permitCancellationDetails: '',
    legalDispute: false,
    legalDisputeDetails: ''
  },
  declarationAccepted: false
};
