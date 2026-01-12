import { useState, useEffect } from 'react';
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
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ncahpLogo from '@/assets/ncahp-logo.png';

// Import step components
import RegistrationTypeStep from './steps/RegistrationTypeStep';
import PersonalInfoStep from './steps/PersonalInfoStep';
import EducationHistoryStep from './steps/EducationHistoryStep';
import HealthcareQualificationStep from './steps/HealthcareQualificationStep';
import InternshipStep from './steps/InternshipStep';
import ProfessionalExperienceStep from './steps/ProfessionalExperienceStep';
import PracticeGeographyStep from './steps/PracticeGeographyStep';
import DocumentUploadStep from './steps/DocumentUploadStep';
import ReviewSubmitStep from './steps/ReviewSubmitStep';

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
  durationMonths: string;
  admissionDate: string;
  passingDate: string;
  certificate: File | null;
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
  
  // Screen 9 - Final
  aadhaarConsent: boolean;
  declarationAccepted: boolean;
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

const steps = [
  { id: 1, title: 'Registration Type', icon: FileCheck, description: 'Select profession & type' },
  { id: 2, title: 'Personal Information', icon: User, description: 'Identity & profile' },
  { id: 3, title: 'Education History', icon: GraduationCap, description: 'Prior qualifications' },
  { id: 4, title: 'Healthcare Qualification', icon: Stethoscope, description: 'Allied healthcare degrees' },
  { id: 5, title: 'Internship', icon: Briefcase, description: 'Clinical training' },
  { id: 6, title: 'Experience', icon: Briefcase, description: 'Professional history' },
  { id: 7, title: 'Practice Location', icon: MapPin, description: 'Geographic intent' },
  { id: 8, title: 'Documents', icon: Upload, description: 'Upload certificates' },
  { id: 9, title: 'Review & Submit', icon: FileText, description: 'Final verification' }
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
  const [isBlocked, setIsBlocked] = useState(hasProvisionalOrInterimStatus);
  
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
      { id: '3', schoolName: '', board: '', yearOfPassing: '', certificate: null },
    ],
    healthcareQualifications: [
      { id: '1', qualificationName: '', institutionName: '', university: '', durationMonths: '', admissionDate: '', passingDate: '', certificate: null }
    ],
    otherQualifications: [],
    internships: [],
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
    declarationAccepted: false
  });

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = (): boolean => {
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
  };

  const nextStep = () => {
    if (canProceed() && currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
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
    const commonProps = { formData, updateFormData };
    
    switch (currentStep) {
      case 1:
        return <RegistrationTypeStep {...commonProps} />;
      case 2:
        return <PersonalInfoStep {...commonProps} />;
      case 3:
        return <EducationHistoryStep {...commonProps} />;
      case 4:
        return <HealthcareQualificationStep {...commonProps} />;
      case 5:
        return <InternshipStep {...commonProps} />;
      case 6:
        return <ProfessionalExperienceStep {...commonProps} />;
      case 7:
        return <PracticeGeographyStep {...commonProps} />;
      case 8:
        return <DocumentUploadStep {...commonProps} />;
      case 9:
        return <ReviewSubmitStep {...commonProps} onSubmit={handleSubmit} />;
      default:
        return null;
    }
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
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/90 hidden md:block">
                Application Fee: <strong className="text-accent">₹2,000</strong> (max)
              </span>
              <Button variant="outline" size="sm" onClick={() => navigate('/')} className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                Save & Exit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
              Permanent Registration
            </h2>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          
          {/* Step Progress Bar */}
          <div className="relative">
            <div className="overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex items-center min-w-max gap-2">
                {steps.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;
                  const StepIcon = step.icon;
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <button
                        onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                        disabled={step.id > currentStep}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                          isActive 
                            ? 'bg-accent text-white shadow-lg shadow-accent/25' 
                            : isCompleted
                              ? 'bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer'
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-white/20' : isCompleted ? 'bg-primary/20' : 'bg-muted-foreground/20'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <StepIcon className="w-4 h-4" />
                          )}
                        </div>
                        <span className="text-sm font-medium hidden lg:block">{step.title}</span>
                      </button>
                      
                      {index < steps.length - 1 && (
                        <div className={`w-8 h-0.5 mx-1 ${
                          isCompleted ? 'bg-primary' : 'bg-border'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
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
    </div>
  );
};

export default PermanentRegistration;
