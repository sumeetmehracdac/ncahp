// Form 2B Types - Temporary Registration for Foreign Qualified Indian Nationals

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
  courseName: string;
  country: string;
  durationMonths: string;
  admissionYear: string;
  passingYear: string;
  modeOfLearning: 'regular' | 'distance' | '';
  mediumOfInstruction: string;
  certificate: File | null;
  transcript: File | null;
  syllabus: File | null;
}

export interface Form2BInternship {
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

export interface Form2BExperience {
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

export interface Form2BPracticeState {
  state: string;
  district: string;
  institutionName: string;
  address: string;
  proofDocument: File | null;
}

export interface Form2BPreviousPermission {
  id: string;
  country: string;
  regulatoryBody: string;
  licenseNumber: string;
  certificate: File | null;
}

export interface Form2BPurposeOfRegistration {
  higherStudies: boolean;
  workshopTraining: boolean;
  teaching: boolean;
  observership: boolean;
  clinicalWork: boolean;
  communityHealthcare: boolean;
  durationOfStay: string;
  expectedStartDate: string;
  expectedEndDate: string;
  practiceState: string;
  practiceDistrict: string;
  institutionName: string;
  institutionAddress: string;
  supportingDocument: File | null;
  previousPermissions: Form2BPreviousPermission[];
}

export interface Form2BDeclaration {
  permitCancellation: boolean;
  permitCancellationDetails: string;
  legalDispute: boolean;
  legalDisputeDetails: string;
}

export interface Form2BDocuments {
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
  isDifferentlyAbled: boolean;
  citizenshipType: 'birth' | 'domicile' | '';
  domicileDate: string;
  permanentAddress: Form2BAddressFields;
  correspondenceAddressDifferent: boolean;
  correspondenceAddress: Form2BAddressFields;
  stateOfResidence: string;
  stateFromAadhaar: string;
  differentStateProof: File | null;

  // Step 3: Purpose of Registration
  purposeOfRegistration: Form2BPurposeOfRegistration;

  // Step 4: Academic Qualification
  academicQualifications: Form2BAcademicQualification[];

  // Step 5: Internship/Clinical Training
  internships: Form2BInternship[];

  // Step 6: Professional Experience (optional)
  experiences: Form2BExperience[];

  // Step 7: Practice State
  practiceInOtherState: boolean;
  practiceStates: Form2BPracticeState[];

  // Step 8: Documents
  documents: Form2BDocuments;

  // Step 9: Declaration & Review
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
  isDifferentlyAbled: false,
  citizenshipType: '',
  domicileDate: '',
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
  purposeOfRegistration: {
    higherStudies: false,
    workshopTraining: false,
    teaching: false,
    observership: false,
    clinicalWork: false,
    communityHealthcare: false,
    durationOfStay: '',
    expectedStartDate: '',
    expectedEndDate: '',
    practiceState: '',
    practiceDistrict: '',
    institutionName: '',
    institutionAddress: '',
    supportingDocument: null,
    previousPermissions: []
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
      certificate: null,
      transcript: null,
      syllabus: null
    }
  ],
  internships: [],
  experiences: [],
  practiceInOtherState: false,
  practiceStates: [],
  documents: {
    validIdProof: null,
    medicalFitness: null,
    endorsementLetter: null,
    differentlyAbledProof: null
  },
  declaration: {
    permitCancellation: false,
    permitCancellationDetails: '',
    legalDispute: false,
    legalDisputeDetails: ''
  },
  declarationAccepted: false
};
