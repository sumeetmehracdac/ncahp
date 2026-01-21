import { CheckCircle, FileText, User, GraduationCap, Stethoscope, Briefcase, MapPin, Upload, Shield, AlertTriangle, Send, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SectionCard from '../components/SectionCard';
import { ProvisionalFormData, sectionConfigs } from '../types';

interface Props {
  formData: ProvisionalFormData;
  updateFormData: <K extends keyof ProvisionalFormData>(field: K, value: ProvisionalFormData[K]) => void;
  sectionRef: React.RefObject<HTMLDivElement>;
  onSubmit: () => void;
  sectionValidation: Record<string, boolean>;
}

export default function ReviewSubmitSection({ formData, updateFormData, sectionRef, onSubmit, sectionValidation }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const allSectionsComplete = Object.values(sectionValidation).every(Boolean);
  
  const handleSubmit = async () => {
    if (!allSectionsComplete) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    onSubmit();
    setIsSubmitting(false);
  };

  const getSectionStatus = (key: string) => {
    return sectionValidation[key] ?? false;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <SectionCard
      ref={sectionRef}
      id="review"
      number={9}
      title="Review & Submit"
      tagline="Final verification and submission"
      icon={<CheckCircle className="w-5 h-5" />}
    >
      {/* Completion Status Header */}
      <div className={`mb-8 p-6 rounded-xl border-2 ${
        allSectionsComplete 
          ? 'bg-success/10 border-success' 
          : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
            allSectionsComplete ? 'bg-success' : 'bg-amber-100'
          }`}>
            {allSectionsComplete ? (
              <Check className="w-7 h-7 text-success-foreground" />
            ) : (
              <AlertTriangle className="w-7 h-7 text-amber-700" />
            )}
          </div>
          <div>
            <h3 className={`text-lg font-display font-semibold ${
              allSectionsComplete ? 'text-success' : 'text-amber-900'
            }`}>
              {allSectionsComplete 
                ? 'Application Ready for Submission' 
                : 'Application Incomplete'
              }
            </h3>
            <p className={`text-sm mt-1 ${
              allSectionsComplete ? 'text-success/80' : 'text-amber-800'
            }`}>
              {allSectionsComplete 
                ? 'All sections have been completed. Please review your information below before submitting.'
                : 'Please complete all required sections before submitting your application.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Section Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {sectionConfigs.slice(0, 8).map((section) => {
          const isComplete = getSectionStatus(section.key);
          return (
            <div
              key={section.key}
              className={`p-3 rounded-lg border flex items-center gap-2 ${
                isComplete 
                  ? 'bg-success/10 border-success/30' 
                  : 'bg-muted/50 border-border'
              }`}
            >
              {isComplete ? (
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground flex-shrink-0" />
              )}
              <span className={`text-xs font-medium truncate ${
                isComplete ? 'text-success' : 'text-muted-foreground'
              }`}>
                {section.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Review Accordion */}
      <Accordion type="multiple" defaultValue={['personal']} className="space-y-3">
        {/* Personal Information */}
        <AccordionItem value="personal" className="border rounded-xl px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <span className="font-medium">Personal Information</span>
              {getSectionStatus('personal') && (
                <CheckCircle className="w-4 h-4 text-success ml-2" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Full Name</span>
                <p className="font-medium">{`${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim() || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Gender</span>
                <p className="font-medium capitalize">{formData.gender || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date of Birth</span>
                <p className="font-medium">{formatDate(formData.dateOfBirth)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email</span>
                <p className="font-medium">{formData.email || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Mobile</span>
                <p className="font-medium">{formData.mobile || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Aadhaar</span>
                <p className="font-medium">{formData.aadhaarNumber || 'Not provided'}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Academic Qualification */}
        <AccordionItem value="academic" className="border rounded-xl px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span className="font-medium">Academic Qualification</span>
              {getSectionStatus('academic') && (
                <CheckCircle className="w-4 h-4 text-success ml-2" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-3">
              {formData.academicQualifications.map((qual, index) => (
                <div key={qual.id} className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium capitalize">{qual.level.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-sm text-muted-foreground">
                    {qual.schoolName || 'School not specified'} • {qual.boardUniversity || 'Board not specified'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Year: {qual.yearOfPassing || 'N/A'} • {qual.percentage || 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Healthcare Qualification */}
        <AccordionItem value="healthcare" className="border rounded-xl px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-primary" />
              <span className="font-medium">Healthcare Qualifications</span>
              {getSectionStatus('healthcare') && (
                <CheckCircle className="w-4 h-4 text-success ml-2" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="mb-3">
              <span className="text-muted-foreground text-sm">Selected Profession</span>
              <p className="font-medium">{formData.profession || 'Not selected'}</p>
            </div>
            <div className="space-y-3">
              {formData.healthcareQualifications.map((qual, index) => (
                <div key={qual.id} className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium">{qual.qualificationName || 'Qualification not specified'}</p>
                  <p className="text-sm text-muted-foreground">
                    {qual.institutionName || 'Institution not specified'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {qual.university || 'University not specified'} • {qual.country}
                  </p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Practice Locations */}
        <AccordionItem value="practice" className="border rounded-xl px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium">Practice Locations</span>
              {getSectionStatus('practice') && (
                <CheckCircle className="w-4 h-4 text-success ml-2" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-3">
              {formData.practiceLocations.map((loc, index) => (
                <div key={loc.id} className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium">{loc.institutionName || 'Institution not specified'}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {loc.institutionType.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[loc.city, loc.state].filter(Boolean).join(', ') || 'Address not provided'}
                  </p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Documents */}
        <AccordionItem value="uploads" className="border rounded-xl px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-primary" />
              <span className="font-medium">Uploaded Documents</span>
              {getSectionStatus('uploads') && (
                <CheckCircle className="w-4 h-4 text-success ml-2" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                {formData.documents.passportPhoto ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                )}
                <span>Passport Photo</span>
              </div>
              <div className="flex items-center gap-2">
                {formData.documents.signatureImage ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                )}
                <span>Signature</span>
              </div>
              <div className="flex items-center gap-2">
                {formData.documents.idProof ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                )}
                <span>ID Proof</span>
              </div>
              <div className="flex items-center gap-2">
                {formData.documents.medicalFitnessCertificate ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                )}
                <span>Medical Fitness</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Declaration */}
        <AccordionItem value="declaration" className="border rounded-xl px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-medium">Declaration</span>
              {getSectionStatus('declaration') && (
                <CheckCircle className="w-4 h-4 text-success ml-2" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {formData.declaration.noPendingCases ? <CheckCircle className="w-4 h-4 text-success" /> : <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />}
                <span>No pending cases declaration</span>
              </div>
              <div className="flex items-center gap-2">
                {formData.declaration.noMalpractice ? <CheckCircle className="w-4 h-4 text-success" /> : <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />}
                <span>No malpractice declaration</span>
              </div>
              <div className="flex items-center gap-2">
                {formData.declaration.informationAccuracy ? <CheckCircle className="w-4 h-4 text-success" /> : <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />}
                <span>Information accuracy declaration</span>
              </div>
              <div className="flex items-center gap-2">
                {formData.declaration.termsAccepted ? <CheckCircle className="w-4 h-4 text-success" /> : <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />}
                <span>Terms accepted</span>
              </div>
              <div className="flex items-center gap-2">
                {formData.declaration.consentForVerification ? <CheckCircle className="w-4 h-4 text-success" /> : <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />}
                <span>Verification consent</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Place</span>
                <p className="font-medium">{formData.declaration.applicantPlace || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date</span>
                <p className="font-medium">{formatDate(formData.declaration.applicantDate)}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Fee Notice */}
      <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Application Fee</p>
            <p className="text-xs text-muted-foreground">Non-refundable processing fee</p>
          </div>
          <p className="text-2xl font-display font-bold text-primary">₹2,000</p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <Button
          onClick={handleSubmit}
          disabled={!allSectionsComplete || isSubmitting}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-accent to-accent-hover hover:from-accent-hover hover:to-accent text-accent-foreground shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Submit Application
            </>
          )}
        </Button>
        {!allSectionsComplete && (
          <p className="text-center text-sm text-destructive mt-3">
            Please complete all required sections before submitting
          </p>
        )}
      </div>
    </SectionCard>
  );
}
