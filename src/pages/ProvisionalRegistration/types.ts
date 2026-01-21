// Types for Provisional Registration Form

export interface AddressFields {
  addressLine1: string;
  addressLine2: string;
  city: string;
  pincode: string;
  district: string;
  state: string;
}

export interface AcademicQualification {
  id: string;
  level: 'matriculation' | 'seniorSecondary' | 'diploma';
  schoolName: string;
  boardUniversity: string;
  yearOfPassing: string;
  percentage: string;
  certificate: File | null;
}

export interface HealthcareQualification {
  id: string;
  qualificationName: string;
  institutionName: string;
  university: string;
  country: string;
  durationMonths: string;
  admissionDate: string;
  passingDate: string;
  certificate: File | null;
}

export interface InternshipEntry {
  id: string;
  designation: string;
  organizationName: string;
  organizationType: 'hospital' | 'clinic' | 'laboratory' | 'fieldwork' | 'other';
  organizationAddress: string;
  country: string;
  startDate: string;
  endDate: string;
  coreDuties: string;
  supervisorName: string;
  certificate: File | null;
}

export interface WorkExperience {
  id: string;
  designation: string;
  organizationName: string;
  organizationType: string;
  organizationAddress: string;
  startDate: string;
  endDate: string;
  isCurrentEmployment: boolean;
  responsibilities: string;
  certificate: File | null;
}

export interface PracticeLocation {
  id: string;
  institutionName: string;
  institutionType: 'hospital' | 'clinic' | 'laboratory' | 'diagnosticCenter' | 'other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  registrationNumber: string;
  proof: File | null;
}

export interface UploadedDocuments {
  idProof: File | null;
  idProofType: string;
  medicalFitnessCertificate: File | null;
  passportPhoto: File | null;
  signatureImage: File | null;
  addressProof: File | null;
  additionalDocuments: File[];
}

export interface DeclarationData {
  noPendingCases: boolean;
  noMalpractice: boolean;
  informationAccuracy: boolean;
  termsAccepted: boolean;
  consentForVerification: boolean;
  applicantPlace: string;
  applicantDate: string;
}

export interface ProvisionalFormData {
  // Section 1: Personal Information
  firstName: string;
  middleName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other' | '';
  dateOfBirth: string;
  nationality: string;
  email: string;
  mobile: string;
  alternatePhone: string;
  aadhaarNumber: string;
  permanentAddress: AddressFields;
  correspondenceAddressSame: boolean;
  correspondenceAddress: AddressFields;
  fatherName: string;
  motherName: string;
  
  // Section 2: Academic Qualification
  academicQualifications: AcademicQualification[];
  
  // Section 3: Healthcare Qualification
  profession: string;
  healthcareQualifications: HealthcareQualification[];
  
  // Section 4: Internship/Clinical/Field Work
  internships: InternshipEntry[];
  hasNoInternship: boolean;
  
  // Section 5: Work Experience
  workExperiences: WorkExperience[];
  hasNoExperience: boolean;
  totalExperienceYears: string;
  
  // Section 6: Practice Location
  practiceLocations: PracticeLocation[];
  
  // Section 7: Uploads
  documents: UploadedDocuments;
  
  // Section 8: Declaration
  declaration: DeclarationData;
  
  // Meta
  completedSections: number[];
  lastModified: string;
}

export const initialFormData: ProvisionalFormData = {
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  nationality: 'Indian',
  email: '',
  mobile: '',
  alternatePhone: '',
  aadhaarNumber: '',
  permanentAddress: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    pincode: '',
    district: '',
    state: '',
  },
  correspondenceAddressSame: true,
  correspondenceAddress: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    pincode: '',
    district: '',
    state: '',
  },
  fatherName: '',
  motherName: '',
  academicQualifications: [
    { id: '1', level: 'matriculation', schoolName: '', boardUniversity: '', yearOfPassing: '', percentage: '', certificate: null },
    { id: '2', level: 'seniorSecondary', schoolName: '', boardUniversity: '', yearOfPassing: '', percentage: '', certificate: null },
  ],
  profession: '',
  healthcareQualifications: [
    { id: '1', qualificationName: '', institutionName: '', university: '', country: 'India', durationMonths: '', admissionDate: '', passingDate: '', certificate: null },
  ],
  internships: [],
  hasNoInternship: false,
  workExperiences: [],
  hasNoExperience: false,
  totalExperienceYears: '',
  practiceLocations: [
    { id: '1', institutionName: '', institutionType: 'hospital', address: '', city: '', state: '', pincode: '', registrationNumber: '', proof: null },
  ],
  documents: {
    idProof: null,
    idProofType: '',
    medicalFitnessCertificate: null,
    passportPhoto: null,
    signatureImage: null,
    addressProof: null,
    additionalDocuments: [],
  },
  declaration: {
    noPendingCases: false,
    noMalpractice: false,
    informationAccuracy: false,
    termsAccepted: false,
    consentForVerification: false,
    applicantPlace: '',
    applicantDate: new Date().toISOString().split('T')[0],
  },
  completedSections: [],
  lastModified: new Date().toISOString(),
};

export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export interface SectionConfig {
  id: number;
  key: string;
  title: string;
  tagline: string;
  icon: string;
}

export const sectionConfigs: SectionConfig[] = [
  { id: 1, key: 'personal', title: 'Personal Information', tagline: 'Basic information of applicant', icon: 'User' },
  { id: 2, key: 'academic', title: 'Academic Qualification', tagline: 'Details of Matriculation and Senior Secondary qualification', icon: 'GraduationCap' },
  { id: 3, key: 'healthcare', title: 'Primary Healthcare Qualifications', tagline: 'Essential healthcare qualifications for registration of practice under a specific profession', icon: 'Stethoscope' },
  { id: 4, key: 'internship', title: 'Internship/Clinical/Field Work', tagline: 'Details of internship, clinical training and field work', icon: 'ClipboardList' },
  { id: 5, key: 'experience', title: 'Work Experience', tagline: 'Professional experience history', icon: 'Briefcase' },
  { id: 6, key: 'practice', title: 'Practice Location', tagline: 'Details of hospital/institution/laboratory/clinic for practice', icon: 'MapPin' },
  { id: 7, key: 'uploads', title: 'Uploads', tagline: 'Uploading of Valid ID Proof, Medical Fitness Certificate, etc.', icon: 'Upload' },
  { id: 8, key: 'declaration', title: 'Declaration by Applicant', tagline: 'Legal acknowledgement and consent', icon: 'Shield' },
  { id: 9, key: 'review', title: 'Review & Submit', tagline: 'Final verification and submission', icon: 'CheckCircle' },
];
