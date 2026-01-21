import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ncahpLogo from '@/assets/ncahp-logo.png';

// Import types and initial data
import { ProvisionalFormData, initialFormData, sectionConfigs } from './types';

// Import components
import ProgressSidebar from './components/ProgressSidebar';

// Import sections
import {
  PersonalInfoSection,
  AcademicQualificationSection,
  HealthcareQualificationSection,
  InternshipSection,
  WorkExperienceSection,
  PracticeLocationSection,
  UploadsSection,
  DeclarationSection,
  ReviewSubmitSection,
} from './sections';

const AUTOSAVE_KEY = 'ncahp_provisional_registration_draft';

export default function ProvisionalRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState<ProvisionalFormData>(initialFormData);
  const [activeSection, setActiveSection] = useState('personal');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Section refs for scroll navigation
  const sectionRefs = {
    personal: useRef<HTMLDivElement>(null),
    academic: useRef<HTMLDivElement>(null),
    healthcare: useRef<HTMLDivElement>(null),
    internship: useRef<HTMLDivElement>(null),
    experience: useRef<HTMLDivElement>(null),
    practice: useRef<HTMLDivElement>(null),
    uploads: useRef<HTMLDivElement>(null),
    declaration: useRef<HTMLDivElement>(null),
    review: useRef<HTMLDivElement>(null),
  };

  // Update form data
  const updateFormData = useCallback(<K extends keyof ProvisionalFormData>(
    field: K, 
    value: ProvisionalFormData[K]
  ) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      lastModified: new Date().toISOString()
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Section validation
  const getSectionValidation = useCallback(() => {
    return {
      personal: !!(
        formData.firstName && 
        formData.lastName && 
        formData.gender && 
        formData.dateOfBirth && 
        formData.email && 
        formData.mobile &&
        formData.permanentAddress.addressLine1 &&
        formData.permanentAddress.city &&
        formData.permanentAddress.state &&
        formData.permanentAddress.pincode
      ),
      academic: formData.academicQualifications.some(q => 
        q.schoolName && q.boardUniversity && q.yearOfPassing
      ),
      healthcare: !!(
        formData.profession && 
        formData.healthcareQualifications.some(q => q.qualificationName && q.institutionName)
      ),
      internship: formData.hasNoInternship || formData.internships.length > 0,
      experience: formData.hasNoExperience || formData.workExperiences.length > 0,
      practice: formData.practiceLocations.some(l => 
        l.institutionName && l.city && l.state
      ),
      uploads: !!(
        formData.documents.passportPhoto &&
        formData.documents.signatureImage &&
        formData.documents.idProof &&
        formData.documents.medicalFitnessCertificate
      ),
      declaration: !!(
        formData.declaration.noPendingCases &&
        formData.declaration.noMalpractice &&
        formData.declaration.informationAccuracy &&
        formData.declaration.termsAccepted &&
        formData.declaration.consentForVerification &&
        formData.declaration.applicantPlace &&
        formData.declaration.applicantDate
      ),
      review: true, // Always accessible
    };
  }, [formData]);

  const sectionValidation = getSectionValidation();
  const completedSections = Object.entries(sectionValidation)
    .filter(([key, value]) => value && key !== 'review')
    .map(([key]) => sectionConfigs.find(s => s.key === key)?.id || 0);

  // Calculate overall progress
  const progress = (completedSections.length / 8) * 100;

  // Scroll to section
  const navigateToSection = useCallback((sectionKey: string) => {
    const ref = sectionRefs[sectionKey as keyof typeof sectionRefs];
    if (ref?.current) {
      const yOffset = -100; // Account for sticky header
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(sectionKey);
    }
  }, []);

  // Intersection observer for active section detection
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    Object.entries(sectionRefs).forEach(([key, ref]) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(key);
              }
            });
          },
          { threshold: 0.2, rootMargin: '-100px 0px -50% 0px' }
        );
        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  // Auto-save
  useEffect(() => {
    const saveToLocalStorage = () => {
      if (hasUnsavedChanges) {
        setIsSaving(true);
        const dataToSave = {
          ...formData,
          // Don't save File objects
          documents: {
            ...formData.documents,
            passportPhoto: formData.documents.passportPhoto?.name || null,
            signatureImage: formData.documents.signatureImage?.name || null,
            idProof: formData.documents.idProof?.name || null,
            medicalFitnessCertificate: formData.documents.medicalFitnessCertificate?.name || null,
            addressProof: formData.documents.addressProof?.name || null,
          },
        };
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(dataToSave));
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        setIsSaving(false);
      }
    };

    const autoSaveInterval = setInterval(saveToLocalStorage, 30000);
    return () => clearInterval(autoSaveInterval);
  }, [hasUnsavedChanges, formData]);

  // Load saved draft
  useEffect(() => {
    const savedDraft = localStorage.getItem(AUTOSAVE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        const savedDate = new Date(parsed.lastModified);
        const timeDiff = Date.now() - savedDate.getTime();
        
        if (timeDiff < 24 * 60 * 60 * 1000) {
          setFormData(prev => ({
            ...prev,
            ...parsed,
            documents: {
              ...initialFormData.documents,
              idProofType: parsed.documents?.idProofType || '',
            },
          }));
          setLastSaved(savedDate);
          toast({
            title: 'Draft Restored',
            description: `Your previous draft from ${savedDate.toLocaleString()} has been restored.`,
          });
        }
      } catch (e) {
        console.error('Failed to parse saved draft:', e);
      }
    }
  }, [toast]);

  // Manual save
  const handleManualSave = () => {
    setIsSaving(true);
    const dataToSave = {
      ...formData,
      documents: {
        ...formData.documents,
        passportPhoto: formData.documents.passportPhoto?.name || null,
        signatureImage: formData.documents.signatureImage?.name || null,
        idProof: formData.documents.idProof?.name || null,
        medicalFitnessCertificate: formData.documents.medicalFitnessCertificate?.name || null,
        addressProof: formData.documents.addressProof?.name || null,
      },
    };
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(dataToSave));
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    setIsSaving(false);
    toast({
      title: 'Draft Saved',
      description: 'Your progress has been saved successfully.',
    });
  };

  // Submit handler
  const handleSubmit = () => {
    toast({
      title: 'Application Submitted!',
      description: 'Your provisional registration application has been submitted successfully.',
    });
    localStorage.removeItem(AUTOSAVE_KEY);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50/20">
      {/* Header */}
      <header className="bg-primary border-b border-primary-dark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-primary-foreground hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="hidden sm:flex items-center gap-3">
                <img src={ncahpLogo} alt="NCAHP" className="h-10 w-auto" />
                <div>
                  <h1 className="text-lg font-display font-semibold text-white">
                    Provisional Registration
                  </h1>
                  <p className="text-xs text-white/80">Allied and Healthcare Professionals</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Save Status */}
              <div className="hidden md:flex items-center gap-2 text-xs text-white/80">
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Save className="w-3 h-3" />
                    </motion.div>
                    <span>Saving...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-green-300" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </>
                ) : null}
              </div>
              
              {/* Fee Badge */}
              <span className="px-3 py-1 bg-white/10 rounded-lg text-sm text-white font-medium">
                Fee: ₹2,000
              </span>
              
              {/* Save Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualSave}
                disabled={isSaving || !hasUnsavedChanges}
                className="border-white/40 text-white hover:bg-white/10"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Sidebar */}
      <ProgressSidebar
        activeSection={activeSection}
        completedSections={completedSections}
        onNavigate={navigateToSection}
        progress={progress}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 lg:ml-80 lg:mr-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span>Estimated time: 15-20 minutes</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Provisional Registration Application
          </h1>
          <p className="text-muted-foreground">
            Complete all sections below to submit your registration application for allied and healthcare professions.
          </p>
        </motion.div>

        {/* Form Sections */}
        <div className="space-y-8">
          <PersonalInfoSection
            formData={formData}
            updateFormData={updateFormData}
            sectionRef={sectionRefs.personal}
          />
          
          <AcademicQualificationSection
            formData={formData}
            updateFormData={updateFormData}
            sectionRef={sectionRefs.academic}
          />
          
          <HealthcareQualificationSection
            formData={formData}
            updateFormData={updateFormData}
            sectionRef={sectionRefs.healthcare}
          />
          
          <InternshipSection
            formData={formData}
            updateFormData={updateFormData}
            sectionRef={sectionRefs.internship}
          />
          
          <WorkExperienceSection
            formData={formData}
            updateFormData={updateFormData}
            sectionRef={sectionRefs.experience}
          />
          
          <PracticeLocationSection
            formData={formData}
            updateFormData={updateFormData}
            sectionRef={sectionRefs.practice}
          />
          
          <UploadsSection
            formData={formData}
            updateFormData={updateFormData}
            sectionRef={sectionRefs.uploads}
          />
          
          <DeclarationSection
            formData={formData}
            updateFormData={updateFormData}
            sectionRef={sectionRefs.declaration}
          />
          
          <ReviewSubmitSection
            formData={formData}
            updateFormData={updateFormData}
            sectionRef={sectionRefs.review}
            onSubmit={handleSubmit}
            sectionValidation={sectionValidation}
          />
        </div>

        {/* Bottom Spacer for mobile FAB */}
        <div className="h-24 lg:h-0" />
      </main>

      {/* Self-Attestation Notice */}
      <div className="fixed bottom-0 left-0 right-0 bg-amber-50 border-t border-amber-200 py-2 px-4 z-40 lg:hidden">
        <div className="flex items-center justify-center gap-2 text-sm text-amber-800">
          <span className="font-medium">Important:</span>
          <span>All documents must be self-attested</span>
        </div>
      </div>
    </div>
  );
}
