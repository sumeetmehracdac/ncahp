import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  User,
  GraduationCap,
  Stethoscope,
  Briefcase,
  MapPin,
  Upload,
  FileText,
  CreditCard,
  Shield,
  Plane,
  Globe,
  Save,
  X,
  HelpCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ncahpLogo from '@/assets/ncahp-logo.png';

// Auto-save key for localStorage
const AUTOSAVE_KEY = 'ncahp_permanent_registration_draft';

// Import step components - Main form
import RegistrationTypeStep from './steps/RegistrationTypeStep';
import PersonalInfoStep from './steps/PersonalInfoStep';
import EducationHistoryStep from './steps/EducationHistoryStep';
import HealthcareQualificationStep from './steps/HealthcareQualificationStep';
import OtherQualificationStep from './steps/OtherQualificationStep';
import InternshipStep from './steps/InternshipStep';
import ProfessionalExperienceStep from './steps/ProfessionalExperienceStep';
import PracticeGeographyStep from './steps/PracticeGeographyStep';
import DocumentUploadStep from './steps/DocumentUploadStep';
import DeclarationStep1A from './steps/DeclarationStep1A';

// Import Form 2A components
import {
  PersonalInfoStep2A,
  PracticeStateStep2A,
  PassportVisaStep2A,
  AcademicQualificationStep2A,
  InternshipStep2A,
  ExperienceStep2A,
  DocumentsStep2A,
  DeclarationStep2A
} from './steps/form2A';

// Import Form 2B components
import {
  PersonalInfoStep2B,
  PurposeRegistrationStep2B,
  AcademicQualificationStep2B,
  InternshipStep2B,
  ExperienceStep2B,
  PracticeStateStep2B,
  DocumentsStep2B,
  DeclarationStep2B
} from './steps/form2B';

// Import types
import { Form2AData, initialForm2AData } from './types/form2A';
import { Form2BData, initialForm2BData } from './types/form2B';

// Types
export interface EducationEntry {
  id: string;
  schoolName: string;
  board: string;
  yearOfPassing: string;
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
  transcript: File | null;
}

export interface InternshipEntry {
  id: string;
  designation: string;
  organizationName: string;
  organizationCountry: string;
  organizationAddress: string;
  startDate: string;
  completionDate: string;
  coreDuties: string;
  certificate: File | null;
}

export interface ExperienceEntry {
  id: string;
  designation: string;
  organizationName: string;
  organizationCountry: string;
  organizationAddress: string;
  startDate: string;
  completionDate: string;
  coreDuties: string;
  certificate: File | null;
}

export interface PracticeState {
  state: string;
  proofDocument: File | null;
  institutionName: string;
  institutionAddress: string;
}

export interface AddressFields {
  addressLine1: string;
  addressLine2: string;
  city: string;
  pincode: string;
  district: string;
  state: string;
}

export interface FormData {
  // Screen 1 - Registration Type
  registrationType: string;
  profession: string;

  // Screen 2 - Personal Info (1-6 are read-only from registration)
  name: string;
  gender: string;
  age: string;
  dateOfBirth: string;
  email: string;
  mobile: string;
  photo: File | null;
  placeOfBirth: string;
  fatherName: string;
  motherName: string;
  citizenshipType: 'birth' | 'domicile' | '';
  domicileDate: string;
  permanentAddress: AddressFields;
  correspondenceAddressDifferent: boolean;
  correspondenceAddress: AddressFields;
  presentOccupation: string;
  stateOfResidence: string;
  stateFromAadhaar: string;
  differentStateProof: File | null;

  // Screen 3 - Education History
  educationHistory: EducationEntry[];

  // Screen 4 - Healthcare Qualification
  healthcareQualifications: HealthcareQualification[];
  otherQualifications: HealthcareQualification[];

  // Screen 5 - Internship/Clinical Training
  internships: InternshipEntry[];

  // Screen 6 - Professional Experience
  experiences: ExperienceEntry[];

  // Screen 7 - Practice Geography
  practiceInOtherState: boolean;
  practiceStates: PracticeState[];

  // Screen 8 - Document Upload
  provisionalDegree: File | null;
  finalDegree: File | null;
  internshipCertificate: File | null;
  transcripts: File | null;
  curriculumSoftCopy: File | null;
  experienceEvidence: File | null;
  validIdProof: File | null;

  // Screen 9 - Declaration
  aadhaarConsent: boolean;
  declarationAccepted: boolean;
  isDifferentlyAbled: boolean;
  differentlyAbledCertificate: File | null;
  permitCancellation: boolean;
  permitCancellationDetails: string;
  legalDispute: boolean;
  legalDisputeDetails: string;
}

// Mock user data (simulating already registered user)
const mockUserData = {
  name: 'Dr. Priya Sharma',
  gender: 'Female',
  age: '28',
  dateOfBirth: '1997-03-15',
  email: 'priya.sharma@email.com',
  mobile: '+91 98765 43210',
  stateFromAadhaar: 'Gujarat'
};

// Check if user has provisional/interim status (blocking logic)
const hasProvisionalOrInterimStatus = false; // Set to true to test blocking

// Step definitions for each form type
const mainFormSteps = [
  { id: 1, title: 'Application Type', icon: FileCheck, description: 'Select allied and healthcare profession & type' },
  { id: 2, title: 'Personal Information', icon: User, description: 'Identity & profile' },
  { id: 3, title: 'Education History', icon: GraduationCap, description: 'Prior qualifications' },
  { id: 4, title: 'Healthcare Qualification', icon: Stethoscope, description: 'Allied healthcare degrees' },
  { id: 5, title: 'Additional Qualification', icon: GraduationCap, description: 'Additional qualifications' },
  { id: 6, title: 'Internship', icon: Briefcase, description: 'Clinical training' },
  { id: 7, title: 'Experience', icon: Briefcase, description: 'Allied and healthcare professional history' },
  { id: 8, title: 'Practice Location', icon: MapPin, description: 'Geographic intent' },
  { id: 9, title: 'Documents', icon: Upload, description: 'Upload certificates' },
  { id: 10, title: 'Declaration', icon: Shield, description: 'Declaration & submission' }
];

const form2ASteps = [
  { id: 1, title: 'Application Type', icon: FileCheck, description: 'Select allied and healthcare profession & type' },
  { id: 2, title: 'Personal Information', icon: User, description: 'Foreign national details' },
  { id: 3, title: 'Purpose & Practice', icon: Globe, description: 'Purpose of registration & practice location' },
  { id: 4, title: 'Passport & Visa', icon: Plane, description: 'Travel documents' },
  { id: 5, title: 'Academic Qualification', icon: GraduationCap, description: 'Foreign qualifications' },
  { id: 6, title: 'Internship', icon: Briefcase, description: 'Clinical training' },
  { id: 7, title: 'Experience', icon: Briefcase, description: 'Allied and healthcare professional history' },
  { id: 8, title: 'Documents', icon: Upload, description: 'Upload certificates' },
  { id: 9, title: 'Declaration', icon: Shield, description: 'Review & submit' }
];

const form2BSteps = [
  { id: 1, title: 'Application Type', icon: FileCheck, description: 'Select allied and healthcare profession & type' },
  { id: 2, title: 'Personal Information', icon: User, description: 'Identity & profile' },
  { id: 3, title: 'Academic Qualification', icon: GraduationCap, description: 'Foreign qualifications' },
  { id: 4, title: 'Internship', icon: Briefcase, description: 'Clinical training' },
  { id: 5, title: 'Experience', icon: Briefcase, description: 'Professional history' },
  { id: 6, title: 'State of Practice', icon: MapPin, description: 'Practice location' },
  { id: 7, title: 'Documents', icon: Upload, description: 'Upload certificates' },
  { id: 8, title: 'Declaration', icon: Shield, description: 'Review & submit' }
];

const form2CSteps = [
  { id: 1, title: 'Application Type', icon: FileCheck, description: 'Select allied and healthcare profession & type' },
  { id: 2, title: 'Personal Information', icon: User, description: 'Identity & profile' },
  { id: 3, title: 'Purpose of Registration', icon: Globe, description: 'Purpose & duration' },
  { id: 4, title: 'Academic Qualification', icon: GraduationCap, description: 'Foreign qualifications' },
  { id: 5, title: 'Internship', icon: Briefcase, description: 'Clinical training' },
  { id: 6, title: 'Experience', icon: Briefcase, description: 'Professional history' },
  { id: 7, title: 'Documents', icon: Upload, description: 'Upload certificates' },
  { id: 8, title: 'Declaration', icon: Shield, description: 'Review & submit' }
];

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export { indianStates };

const PermanentRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [highestStepReached, setHighestStepReached] = useState(1);
  const [isBlocked, setIsBlocked] = useState(hasProvisionalOrInterimStatus);
  const [activeFormType, setActiveFormType] = useState<'main' | '2A' | '2B' | '2C'>('main');

  // UI/UX Enhancement states
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const formContentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Main form data
  const [formData, setFormData] = useState<FormData>({
    registrationType: '',
    profession: '',
    name: mockUserData.name,
    gender: mockUserData.gender,
    age: mockUserData.age,
    dateOfBirth: mockUserData.dateOfBirth,
    email: mockUserData.email,
    mobile: mockUserData.mobile,
    photo: null,
    placeOfBirth: '',
    fatherName: '',
    motherName: '',
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
    presentOccupation: '',
    stateOfResidence: mockUserData.stateFromAadhaar,
    stateFromAadhaar: mockUserData.stateFromAadhaar,
    differentStateProof: null,
    educationHistory: [
      { id: '1', schoolName: '', board: '', yearOfPassing: '', certificate: null },
      { id: '2', schoolName: '', board: '', yearOfPassing: '', certificate: null },
    ],
    healthcareQualifications: [
      { id: '1', qualificationName: '', institutionName: '', university: '', country: '', durationMonths: '', admissionDate: '', passingDate: '', certificate: null, transcript: null }
    ],
    otherQualifications: [],
    internships: [
      { id: '1', designation: '', organizationName: '', organizationCountry: 'India', organizationAddress: '', startDate: '', completionDate: '', coreDuties: '', certificate: null }
    ],
    experiences: [],
    practiceInOtherState: false,
    practiceStates: [],
    provisionalDegree: null,
    finalDegree: null,
    internshipCertificate: null,
    transcripts: null,
    curriculumSoftCopy: null,
    experienceEvidence: null,
    validIdProof: null,
    aadhaarConsent: false,
    declarationAccepted: false,
    isDifferentlyAbled: false,
    differentlyAbledCertificate: null,
    permitCancellation: false,
    permitCancellationDetails: '',
    legalDispute: false,
    legalDisputeDetails: ''
  });

  // Form 2A data
  const [form2AData, setForm2AData] = useState<Form2AData>(initialForm2AData);

  // Form 2B data
  const [form2BData, setForm2BData] = useState<Form2BData>(initialForm2BData);

  // Form 2C data (uses Form2B types)
  const [form2CData, setForm2CData] = useState<Form2BData>({ ...initialForm2BData, registrationType: '2C' });
  // Auto-save effect - saves to localStorage every 30 seconds when there are changes
  // Auto-save effect - DISABLED per user request
  // useEffect(() => {
  //   const saveToLocalStorage = () => {
  //     if (hasUnsavedChanges) {
  //       setIsSaving(true);
  //       // Serialize form data (excluding File objects)
  //       const serializableData = {
  //         formData: {
  //           ...formData,
  //           photo: formData.photo?.name || null,
  //           differentStateProof: formData.differentStateProof?.name || null,
  //           provisionalDegree: formData.provisionalDegree?.name || null,
  //           finalDegree: formData.finalDegree?.name || null,
  //           internshipCertificate: formData.internshipCertificate?.name || null,
  //           transcripts: formData.transcripts?.name || null,
  //           curriculumSoftCopy: formData.curriculumSoftCopy?.name || null,
  //           experienceEvidence: formData.experienceEvidence?.name || null,
  //           validIdProof: formData.validIdProof?.name || null,
  //           differentlyAbledCertificate: formData.differentlyAbledCertificate?.name || null,
  //         },
  //         currentStep,
  //         activeFormType,
  //         savedAt: new Date().toISOString(),
  //       };
  //       localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(serializableData));
  //       setLastSaved(new Date());
  //       setHasUnsavedChanges(false);
  //       setIsSaving(false);
  //       toast({
  //         title: 'Draft Saved',
  //         description: 'Your progress has been auto-saved.',
  //         duration: 2000,
  //       });
  //     }
  //   };
  //
  //   const autoSaveInterval = setInterval(saveToLocalStorage, 30000); // 30 seconds
  //   return () => clearInterval(autoSaveInterval);
  // }, [hasUnsavedChanges, formData, currentStep, activeFormType, toast]);

  // Load saved draft on mount - DISABLED per user request
  // useEffect(() => {
  //   const savedDraft = localStorage.getItem(AUTOSAVE_KEY);
  //   if (savedDraft) {
  //     try {
  //       const parsed = JSON.parse(savedDraft);
  //       if (parsed.formData && parsed.savedAt) {
  //         const savedDate = new Date(parsed.savedAt);
  //         const timeDiff = Date.now() - savedDate.getTime();
  //         // Only restore if saved within last 24 hours
  //         if (timeDiff < 24 * 60 * 60 * 1000) {
  //           toast({
  //             title: 'Draft Restored',
  //             description: `Your previous draft from ${savedDate.toLocaleString()} has been restored.`,
  //             duration: 4000,
  //           });
  //           setFormData(prev => ({ ...prev, ...parsed.formData, photo: null }));
  //           setCurrentStep(parsed.currentStep || 1);
  //           setActiveFormType(parsed.activeFormType || 'main');
  //           setLastSaved(savedDate);
  //         }
  //       }
  //     } catch (e) {
  //       console.error('Failed to parse saved draft:', e);
  //     }
  //   }
  // }, []);

  // Check if progress bar can scroll
  const checkProgressBarScroll = useCallback(() => {
    const el = progressBarRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    checkProgressBarScroll();
    window.addEventListener('resize', checkProgressBarScroll);
    return () => window.removeEventListener('resize', checkProgressBarScroll);
  }, [checkProgressBarScroll, currentStep]);

  const scrollProgressBar = (direction: 'left' | 'right') => {
    const el = progressBarRef.current;
    if (el) {
      const maxScroll = el.scrollWidth - el.clientWidth;
      const currentScroll = el.scrollLeft;

      // Calculate how much we can scroll in the given direction
      let scrollAmount = 150;
      if (direction === 'left') {
        // Don't scroll more than what's available on the left
        scrollAmount = Math.min(scrollAmount, currentScroll);
      } else {
        // Don't scroll more than what's available on the right
        scrollAmount = Math.min(scrollAmount, maxScroll - currentScroll);
      }

      if (scrollAmount > 0) {
        el.scrollTo({
          left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
          behavior: 'smooth'
        });
      }

      // Check scroll state after animation
      setTimeout(checkProgressBarScroll, 350);
    }
  };

  // Manual save function
  const handleManualSave = useCallback(() => {
    setIsSaving(true);
    const serializableData = {
      formData: {
        ...formData,
        photo: formData.photo?.name || null,
        differentStateProof: formData.differentStateProof?.name || null,
        provisionalDegree: formData.provisionalDegree?.name || null,
        finalDegree: formData.finalDegree?.name || null,
        internshipCertificate: formData.internshipCertificate?.name || null,
        transcripts: formData.transcripts?.name || null,
        curriculumSoftCopy: formData.curriculumSoftCopy?.name || null,
        experienceEvidence: formData.experienceEvidence?.name || null,
        validIdProof: formData.validIdProof?.name || null,
        differentlyAbledCertificate: formData.differentlyAbledCertificate?.name || null,
      },
      currentStep,
      activeFormType,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(serializableData));
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    setIsSaving(false);
    toast({
      title: 'Draft Saved Successfully',
      description: 'Your progress has been saved. You can safely exit and resume later.',
    });
  }, [formData, currentStep, activeFormType, toast]);

  // Handle exit with unsaved changes warning
  const handleExit = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowExitModal(true);
    } else {
      navigate('/');
    }
  }, [hasUnsavedChanges, navigate]);

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);

    // Detect form type change
    if (field === 'registrationType') {
      const nameParts = formData.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
      const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

      // Form 2B (Temporary - Foreign nationals) uses Form2A components internally
      if (value === '2B') {
        setActiveFormType('2A');
        setForm2AData(prev => ({
          ...prev,
          profession: formData.profession,
          firstName,
          middleName,
          lastName,
          gender: formData.gender,
          age: formData.age,
          dateOfBirth: formData.dateOfBirth,
          email: formData.email,
          phoneNumber: formData.mobile
        }));
      // Form 1B (Regular - Indian with foreign qual) uses Form2B components internally
      } else if (value === '1B') {
        setActiveFormType('2B');
        setForm2BData(prev => ({
          ...prev,
          profession: formData.profession,
          firstName,
          middleName,
          lastName,
          gender: formData.gender,
          age: formData.age,
          dateOfBirth: formData.dateOfBirth,
          email: formData.email,
          phoneNumber: formData.mobile
        }));
      // Form 2A (Temporary - Indian with foreign qual) uses Form2C components internally
      } else if (value === '2A') {
        setActiveFormType('2C');
        setForm2CData(prev => ({
          ...prev,
          registrationType: '2A',
          profession: formData.profession,
          firstName,
          middleName,
          lastName,
          gender: formData.gender,
          age: formData.age,
          dateOfBirth: formData.dateOfBirth,
          email: formData.email,
          phoneNumber: formData.mobile
        }));
      } else {
        setActiveFormType('main');
      }
    }
  };

  const updateForm2AData = <K extends keyof Form2AData>(field: K, value: Form2AData[K]) => {
    setForm2AData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const updateForm2BData = <K extends keyof Form2BData>(field: K, value: Form2BData[K]) => {
    setForm2BData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const updateForm2CData = <K extends keyof Form2BData>(field: K, value: Form2BData[K]) => {
    setForm2CData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  // Get current steps based on form type
  const getCurrentSteps = () => {
    if (activeFormType === '2A') return form2ASteps;
    if (activeFormType === '2B') return form2BSteps;
    if (activeFormType === '2C') return form2CSteps;
    return mainFormSteps;
  };

  const steps = getCurrentSteps();

  const canProceed = (): boolean => {
    if (activeFormType === '2A') return canProceed2A();
    if (activeFormType === '2B') return canProceed2B();
    if (activeFormType === '2C') return canProceed2C();
    return canProceedMain();
  };

  const canProceedMain = (): boolean => {
    return true;
    /* Temporary Validation Bypass
    switch (currentStep) {
      case 1:
        return formData.registrationType !== '' && formData.profession !== '';
      case 2:
        return formData.placeOfBirth !== '' &&
          formData.fatherName !== '' &&
          formData.motherName !== '' &&
          formData.citizenshipType !== '' &&
          formData.permanentAddress.addressLine1 !== '' &&
          formData.permanentAddress.city !== '' &&
          formData.permanentAddress.pincode !== '' &&
          formData.permanentAddress.district !== '' &&
          formData.permanentAddress.state !== '' &&
          formData.stateOfResidence !== '' &&
          (formData.stateOfResidence === formData.stateFromAadhaar || formData.differentStateProof !== null);
      case 3:
        return formData.educationHistory.some(e => e.schoolName !== '' && e.board !== '');
      case 4:
        return formData.healthcareQualifications.some(q => q.qualificationName !== '' && q.institutionName !== '');
      case 5:
        return true; // Internship is optional
      case 6:
        return true; // Experience is optional
      case 7:
        return !formData.practiceInOtherState || formData.practiceStates.length > 0;
      case 8:
        return formData.validIdProof !== null;
      case 9:
        return formData.aadhaarConsent && formData.declarationAccepted;
      default:
        return false;
    }
    */
  };

  const canProceed2A = (): boolean => {
    return true;
    /* Temporary Validation Bypass
    switch (currentStep) {
      case 1:
        return formData.registrationType !== '' && formData.profession !== '';
      case 2:
        return form2AData.firstName !== '' &&
          form2AData.lastName !== '' &&
          form2AData.nationality !== '' &&
          form2AData.permanentAddress.addressLine1 !== '';
      case 3:
        return form2AData.practiceStates.length > 0;
      case 4:
        return form2AData.passportDetails.passportNumber !== '' &&
          form2AData.passportDetails.issuingCountry !== '' &&
          form2AData.passportDetails.expiryDate !== '' &&
          form2AData.emergencyContact.name !== '' &&
          form2AData.emergencyContact.contactNumber !== '';
      case 5:
        return form2AData.academicQualifications.some(q => q.qualificationName !== '');
      case 6:
        return true; // Optional
      case 7:
        return true; // Optional
      case 8:
        return form2AData.documents.passportCopy !== null;
      case 9:
        return form2AData.declarationAccepted;
      default:
        return false;
    }
    */
  };

  const canProceed2B = (): boolean => {
    return true;
    /* Temporary Validation Bypass
    switch (currentStep) {
      case 1:
        return formData.registrationType !== '' && formData.profession !== '';
      case 2:
        return form2BData.firstName !== '' &&
          form2BData.lastName !== '' &&
          form2BData.permanentAddress.addressLine1 !== '';
      case 3:
        // Purpose of Registration - at least one purpose selected and required fields filled
        return (form2BData.purposeOfRegistration.higherStudies ||
          form2BData.purposeOfRegistration.workshopTraining ||
          form2BData.purposeOfRegistration.teaching ||
          form2BData.purposeOfRegistration.observership ||
          form2BData.purposeOfRegistration.clinicalWork ||
          form2BData.purposeOfRegistration.communityHealthcare) &&
          form2BData.purposeOfRegistration.durationOfStay !== '' &&
          form2BData.purposeOfRegistration.practiceState !== '';
      case 4:
        return form2BData.academicQualifications.some(q => q.qualificationName !== '');
      case 5:
        return true; // Optional - Internship
      case 6:
        return true; // Optional - Experience
      case 7:
        return form2BData.documents.validIdProof !== null;
      case 8:
        return form2BData.declarationAccepted;
      default:
        return false;
    }
    */
  };

  const canProceed2C = (): boolean => {
    return true;
    /* Temporary Validation Bypass */
  };

  const nextStep = () => {
    if (canProceed() && currentStep < steps.length) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setHighestStepReached(prev => Math.max(prev, newStep));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    toast({
      title: 'Application Submitted Successfully!',
      description: 'Your permanent registration application has been submitted. You will receive updates via email.',
    });
    // Navigate to dashboard or success page
  };

  // Blocked state UI
  if (isBlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-foreground mb-3">
            Access Restricted
          </h1>
          <p className="text-muted-foreground mb-6">
            You currently hold a <strong className="text-red-600">Provisional</strong> or <strong className="text-red-600">Interim</strong> registration status.
            Please complete or withdraw your existing registration before applying for Permanent Registration.
          </p>
          <Button onClick={() => navigate('/')} variant="outline" className="mr-3">
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate('/contact')} className="bg-primary hover:bg-primary-dark">
            Contact Support
          </Button>
        </motion.div>
      </div>
    );
  }

  const renderStepContent = () => {
    // Step 1 is always the registration type selector
    if (currentStep === 1) {
      return <RegistrationTypeStep formData={formData} updateFormData={updateFormData} />;
    }

    // Form 2A steps (9 steps - removed Additional Practice)
    if (activeFormType === '2A') {
      switch (currentStep) {
        case 2:
          return <PersonalInfoStep2A formData={form2AData} updateFormData={updateForm2AData} />;
        case 3:
          return <PracticeStateStep2A formData={form2AData} updateFormData={updateForm2AData} />;
        case 4:
          return <PassportVisaStep2A formData={form2AData} updateFormData={updateForm2AData} />;
        case 5:
          return <AcademicQualificationStep2A formData={form2AData} updateFormData={updateForm2AData} />;
        case 6:
          return <InternshipStep2A formData={form2AData} updateFormData={updateForm2AData} />;
        case 7:
          return <ExperienceStep2A formData={form2AData} updateFormData={updateForm2AData} />;
        case 8:
          return <DocumentsStep2A formData={form2AData} updateFormData={updateForm2AData} />;
        case 9:
          return <DeclarationStep2A formData={form2AData} updateFormData={updateForm2AData} onSubmit={handleSubmit} />;
        default:
          return null;
      }
    }

    // Form 2B steps (8 steps - no Purpose)
    if (activeFormType === '2B') {
      switch (currentStep) {
        case 2:
          return <PersonalInfoStep2B formData={form2BData} updateFormData={updateForm2BData} />;
        case 3:
          return <AcademicQualificationStep2B formData={form2BData} updateFormData={updateForm2BData} />;
        case 4:
          return <InternshipStep2B formData={form2BData} updateFormData={updateForm2BData} />;
        case 5:
          return <ExperienceStep2B formData={form2BData} updateFormData={updateForm2BData} />;
        case 6:
          return <PracticeStateStep2B formData={form2BData} updateFormData={updateForm2BData} />;
        case 7:
          return <DocumentsStep2B formData={form2BData} updateFormData={updateForm2BData} />;
        case 8:
          return <DeclarationStep2B formData={form2BData} updateFormData={updateForm2BData} onSubmit={handleSubmit} />;
        default:
          return null;
      }
    }

    // Form 2C steps (8 steps - 2B + Purpose, no State of Practice)
    if (activeFormType === '2C') {
      switch (currentStep) {
        case 2:
          return <PersonalInfoStep2B formData={form2CData} updateFormData={updateForm2CData} />;
        case 3:
          return <PurposeRegistrationStep2B formData={form2CData} updateFormData={updateForm2CData} />;
        case 4:
          return <AcademicQualificationStep2B formData={form2CData} updateFormData={updateForm2CData} />;
        case 5:
          return <InternshipStep2B formData={form2CData} updateFormData={updateForm2CData} />;
        case 6:
          return <ExperienceStep2B formData={form2CData} updateFormData={updateForm2CData} />;
        case 7:
          return <DocumentsStep2B formData={form2CData} updateFormData={updateForm2CData} />;
        case 8:
          return <DeclarationStep2B formData={form2CData} updateFormData={updateForm2CData} onSubmit={handleSubmit} />;
        default:
          return null;
      }
    }

    // Main form steps (10 steps)
    const commonProps = { formData, updateFormData };
    switch (currentStep) {
      case 2:
        return <PersonalInfoStep {...commonProps} />;
      case 3:
        return <EducationHistoryStep {...commonProps} />;
      case 4:
        return <HealthcareQualificationStep {...commonProps} />;
      case 5:
        return <OtherQualificationStep {...commonProps} />;
      case 6:
        return <InternshipStep {...commonProps} />;
      case 7:
        return <ProfessionalExperienceStep {...commonProps} />;
      case 8:
        return <PracticeGeographyStep {...commonProps} />;
      case 9:
        return <DocumentUploadStep {...commonProps} />;
      case 10:
        return <DeclarationStep1A {...commonProps} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  // Get form type label for header
  const getFormTypeLabel = () => {
    const rt = formData.registrationType;
    if (rt === '1B') return 'Form 1B - Regular Registration (Indian nationals with foreign qualification)';
    if (rt === '1C') return 'Form 1C - Provisional Registration';
    if (rt === '2A') return 'Form 2A - Temporary Registration (Indian nationals with foreign qualification)';
    if (rt === '2B') return 'Form 2B - Temporary Registration (Foreign nationals with foreign qualification)';
    if (rt === '3A') return 'Form 3A - Interim Registration';
    return 'Form 1A - Regular Registration (Indian nationals with Indian qualification)';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50/20">
      {/* Header - Deep Teal Navbar */}
      <header className="bg-primary border-b border-primary-dark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <img src={ncahpLogo} alt="NCAHP" className="h-10 w-auto" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-display font-semibold text-white">NCAHP</h1>
                <p className="text-xs text-white/80">National Commission for Allied and Healthcare Professions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Save status indicator */}
              {isSaving ? (
                <span className="text-xs text-white/70 flex items-center gap-1">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Save className="w-3 h-3" />
                  </motion.div>
                  Saving...
                </span>
              ) : hasUnsavedChanges ? (
                <span className="text-xs text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Unsaved changes
                </span>
              ) : lastSaved ? (
                <span className="text-xs text-green-300 hidden md:flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Saved
                </span>
              ) : null}

              <span className="text-sm text-white/90 hidden lg:block">
                Fee: <strong className="text-accent">₹2,000</strong> (max)
              </span>

              <button
                type="button"
                onClick={handleManualSave}
                disabled={isSaving || !hasUnsavedChanges}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white border border-white/40 rounded-md hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save</span>
              </button>

              <button
                type="button"
                onClick={handleExit}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white border border-white/40 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Horizontal Step Tracker */}
      <div className="sticky top-16 z-40">
        {/* Step Tracker */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="relative flex items-center gap-1">
              {/* Left scroll arrow */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollProgressBar('left')}
                  className="flex-shrink-0 w-7 h-7 mr-1 flex items-center justify-center rounded-md bg-white border border-border shadow-sm hover:bg-muted transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}

              <div
                ref={progressBarRef}
                onScroll={checkProgressBarScroll}
                className="flex-1 overflow-x-auto pb-0.5 scrollbar-hide"
              >
                <div className="flex items-center min-w-max gap-0.5 px-0.5" role="navigation" aria-label="Form progress">
                  {steps.map((step, index) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;
                    const canNavigate = true;

                    return (
                      <div key={step.id} className="flex items-center">
                        <button
                          onClick={() => canNavigate && setCurrentStep(step.id)}
                          disabled={!canNavigate && step.id !== currentStep}
                          aria-label={`Step ${step.id}: ${step.title}${isCompleted ? ' (completed)' : isActive ? ' (current)' : ''}`}
                          aria-current={isActive ? 'step' : undefined}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 ${
                            isActive
                              ? 'bg-accent text-white shadow-md shadow-accent/25'
                              : isCompleted
                                ? 'bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer'
                                : 'bg-muted/60 text-muted-foreground hover:bg-muted cursor-pointer'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isActive ? 'bg-white/20' : 'bg-muted'
                            }`}>
                              {step.id}
                            </span>
                          )}
                          <span className="hidden md:block">{step.title}</span>
                        </button>

                        {index < steps.length - 1 && (
                          <div className={`w-4 h-0.5 mx-0.5 ${
                            step.id < currentStep ? 'bg-primary' : 'bg-border'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right scroll arrow */}
              {canScrollRight && (
                <button
                  onClick={() => scrollProgressBar('right')}
                  className="flex-shrink-0 w-7 h-7 ml-1 flex items-center justify-center rounded-md bg-white border border-border shadow-sm hover:bg-muted transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" ref={formContentRef}>

        {/* Step Context Card */}
        {currentStep > 1 && (
          <motion.div
            key={`step-header-${activeFormType}-${currentStep}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-gradient-to-r from-primary/5 via-white to-accent/5 rounded-xl border border-border p-5 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              {(() => {
                const currentStepData = steps.find(s => s.id === currentStep);
                const StepIcon = currentStepData?.icon || FileCheck;
                return <StepIcon className="w-5.5 h-5.5 text-primary" />;
              })()}
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-1">
              {steps.find(s => s.id === currentStep)?.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              {getFormTypeLabel()}
            </p>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs text-primary hover:text-primary-dark underline underline-offset-2 transition-colors"
            >
              Change Application Type
            </button>
          </motion.div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFormType}-${currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white rounded-2xl shadow-lg border border-border p-6 md:p-8 mb-6"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-3">
            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="gap-2 bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/25"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="gap-2 bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/25"
              >
                <Shield className="w-4 h-4" />
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Self-Attestation Notice - Persistent */}
      <div className="fixed bottom-0 left-0 right-0 bg-amber-50 border-t border-amber-200 py-2 px-4 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Important:</strong> All uploaded documents must be self-attested on every page.
          </span>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowExitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Unsaved Changes</h3>
                  <p className="text-sm text-muted-foreground">You have unsaved changes that will be lost.</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Would you like to save your progress before leaving? You can continue later from where you left off.
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem(AUTOSAVE_KEY);
                    navigate('/');
                  }}
                  className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/5"
                >
                  Discard & Exit
                </Button>
                <Button
                  onClick={() => {
                    handleManualSave();
                    setShowExitModal(false);
                    navigate('/');
                  }}
                  className="flex-1 bg-primary hover:bg-primary-dark"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save & Exit
                </Button>
              </div>

              <button
                onClick={() => setShowExitModal(false)}
                className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
              >
                Continue editing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PermanentRegistration;
