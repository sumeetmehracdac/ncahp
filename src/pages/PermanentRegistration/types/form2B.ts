// Form 2B Types - Indian Nationals with Foreign Qualification

export interface Form2BAddressFields {
  addressLine1: string;
  addressLine2: string;
  city: string;
  pincode: string;
  district: string;
  state: string;
}

export interface Form2BAcademicQualification {
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

export interface Form2BInternship {
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

export interface Form2BExperience {
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

export interface Form2BPracticeState {
  institutionName: string;
  address: string;
  state: string;
  district: string;
  proofDocument: File | null;
}

export interface Form2BDeclaration {
  permitCancellation: boolean;
  permitCancellationDetails: string;
  legalDispute: boolean;
  legalDisputeDetails: string;
  previousPermissions: string[];
}

export interface Form2BDocuments {
  transcripts: File | null;
  undergradSyllabus: File | null;
  postgradSyllabus: File | null;
  professionalRegistration: File | null;
  equivalenceCertificate: File | null;
  validIdProof: File | null;
  medicalFitness: File | null;
  endorsementLetter: File | null;
  differentlyAbledProof: File | null;
}

export interface Form2BData {
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
  placeOfBirth: string;
  fatherName: string;
  motherName: string;
  citizenshipType: 'birth' | 'domicile' | '';
  domicileDate: string;
  isDifferentlyAbled: boolean;
  permanentAddress: Form2BAddressFields;
  correspondenceAddressDifferent: boolean;
  correspondenceAddress: Form2BAddressFields;
  stateOfResidence: string;
  stateFromAadhaar: string;
  differentStateProof: File | null;

  // Step 3: Practice State
  practiceInOtherState: boolean;
  practiceStates: Form2BPracticeState[];

  // Step 4: Academic Qualification
  academicQualifications: Form2BAcademicQualification[];

  // Step 5: Internship/Clinical Training
  internships: Form2BInternship[];

  // Step 6: Professional Experience (optional)
  experiences: Form2BExperience[];

  // Step 7: Documents
  documents: Form2BDocuments;

  // Step 8: Declaration & Review
  declaration: Form2BDeclaration;
  declarationAccepted: boolean;
}

export const initialForm2BData: Form2BData = {
  registrationType: '2B',
  profession: '',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
  photo: null,
  placeOfBirth: '',
  fatherName: '',
  motherName: '',
  citizenshipType: '',
  domicileDate: '',
  isDifferentlyAbled: false,
  permanentAddress: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    pincode: '',
    district: '',
    state: ''
  },
  correspondenceAddressDifferent: false,
  correspondenceAddress: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    pincode: '',
    district: '',
    state: ''
  },
  stateOfResidence: '',
  stateFromAadhaar: '',
  differentStateProof: null,
  practiceInOtherState: false,
  practiceStates: [],
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
    equivalenceCertificate: null,
    validIdProof: null,
    medicalFitness: null,
    endorsementLetter: null,
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
