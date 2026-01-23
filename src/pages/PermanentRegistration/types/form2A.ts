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
  expiryDate: string;
}

export interface Form2AVisaDetails {
  visaNumber: string;
  visaType: 'student' | 'research' | 'other' | '';
  issueDate: string;
  expiryDate: string;
}

export interface Form2AAcademicQualification {
  id: string;
  qualificationName: string;
  institutionName: string;
  university: string;
  country: string;
  durationMonths: string;
  admissionDate: string;
  passingDate: string;
  modeOfLearning: 'regular' | 'distance' | 'online' | '';
  mediumOfInstruction: string;
  regulatoryAuthority: string;
  certificate: File | null;
}

export interface Form2AInternship {
  id: string;
  designation: string;
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
  certificate: File | null;
}

export interface Form2APracticeState {
  institutionName: string;
  address: string;
  state: string;
  district: string;
  proofDocument: File | null;
}

export interface Form2ADeclaration {
  permitCancellation: boolean;
  permitCancellationDetails: string;
  legalDispute: boolean;
  legalDisputeDetails: string;
  previousPermissions: string[];
}

export interface Form2ADocuments {
  transcripts: File | null;
  undergradSyllabus: File | null;
  postgradSyllabus: File | null;
  professionalRegistration: File | null;
  passportCopy: File | null;
  visaCopy: File | null;
  proofOfAddress: File | null;
  englishProficiency: File | null;
  equivalenceCertificate: File | null;
  medicalFitness: File | null;
  sponsorshipProof: File | null;
  differentlyAbledProof: File | null;
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
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  photo: File | null;
  fatherName: string;
  motherName: string;
  nationality: string;
  isDifferentlyAbled: boolean;
  permanentAddress: Form2AAddressFields;
  correspondenceAddressDifferent: boolean;
  correspondenceAddress: Form2AAddressFields;
  
  // Purpose of Registration
  purposeOfRegistration: 'practice' | 'teaching' | 'research' | 'other' | '';
  purposeOfRegistrationOther: string;
  durationOfPracticeIndia: string;
  expectedStartDate: string;
  expectedEndDate: string;

  // Step 3: Practice State
  practiceStates: Form2APracticeState[];

  // Step 4: Passport & Visa + Emergency Contact
  passportDetails: Form2APassportDetails;
  visaDetails: Form2AVisaDetails;
  emergencyContact: Form2AEmergencyContact;
  contactPersonIndia: Form2AContactPersonIndia;

  // Step 5: Academic Qualification
  academicQualifications: Form2AAcademicQualification[];

  // Step 6: Internship/Clinical Training
  internships: Form2AInternship[];

  // Step 7: Professional Experience (optional)
  experiences: Form2AExperience[];

  // Step 8: Documents
  documents: Form2ADocuments;

  // Step 9: Declaration
  declaration: Form2ADeclaration;
  declarationAccepted: boolean;
}

export const initialForm2AData: Form2AData = {
  registrationType: '2A',
  profession: '',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
  photo: null,
  fatherName: '',
  motherName: '',
  nationality: '',
  isDifferentlyAbled: false,
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
  purposeOfRegistration: '',
  purposeOfRegistrationOther: '',
  durationOfPracticeIndia: '',
  expectedStartDate: '',
  expectedEndDate: '',
  practiceStates: [],
  passportDetails: {
    passportNumber: '',
    issuingCountry: '',
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
      country: '',
      durationMonths: '',
      admissionDate: '',
      passingDate: '',
      modeOfLearning: '',
      mediumOfInstruction: '',
      regulatoryAuthority: '',
      certificate: null
    }
  ],
  internships: [],
  experiences: [],
  documents: {
    transcripts: null,
    undergradSyllabus: null,
    postgradSyllabus: null,
    professionalRegistration: null,
    passportCopy: null,
    visaCopy: null,
    proofOfAddress: null,
    englishProficiency: null,
    equivalenceCertificate: null,
    medicalFitness: null,
    sponsorshipProof: null,
    differentlyAbledProof: null
  },
  declaration: {
    permitCancellation: false,
    permitCancellationDetails: '',
    legalDispute: false,
    legalDisputeDetails: '',
    previousPermissions: []
  },
  declarationAccepted: false
};
