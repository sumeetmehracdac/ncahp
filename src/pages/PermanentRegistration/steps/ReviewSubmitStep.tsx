import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  Shield,
  User,
  GraduationCap,
  Stethoscope,
  Briefcase,
  MapPin,
  Upload,
  CreditCard,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FormData } from '../index';

interface Props {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onSubmit: () => void;
}

const ReviewSubmitStep = ({ formData, updateFormData, onSubmit }: Props) => {
  const [showPreview, setShowPreview] = useState(false);

  const sections = [
    {
      id: 'registration',
      title: 'Registration Details',
      icon: <FileText className="w-4 h-4" />,
      items: [
        { label: 'Registration Type', value: formData.registrationType },
        { label: 'Profession', value: formData.profession }
      ]
    },
    {
      id: 'personal',
      title: 'Personal Information',
      icon: <User className="w-4 h-4" />,
      items: [
        { label: 'Name', value: formData.name },
        { label: 'Gender', value: formData.gender },
        { label: 'Date of Birth', value: formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('en-IN') : '-' },
        { label: 'Email', value: formData.email },
        { label: 'Mobile', value: formData.mobile },
        { label: 'Father\'s Name', value: formData.fatherName || '-' },
        { label: 'Mother\'s Name', value: formData.motherName || '-' },
        { label: 'Citizenship', value: formData.citizenshipType === 'birth' ? 'By Birth' : 'By Domicile' },
        { label: 'State of Residence', value: formData.stateOfResidence }
      ]
    },
    {
      id: 'education',
      title: 'Educational Qualifications',
      icon: <GraduationCap className="w-4 h-4" />,
      items: formData.educationHistory.filter(e => e.schoolName).map((edu, i) => ({
        label: `Qualification ${i + 1}`,
        value: `${edu.schoolName} - ${edu.board} (${edu.yearOfPassing})`,
        hasAttachment: edu.certificate !== null
      }))
    },
    {
      id: 'healthcare',
      title: 'Healthcare Qualifications',
      icon: <Stethoscope className="w-4 h-4" />,
      items: formData.healthcareQualifications.filter(q => q.qualificationName).map((qual, i) => ({
        label: qual.qualificationName,
        value: `${qual.institutionName}, ${qual.university}`,
        subtitle: qual.durationMonths ? `Duration: ${qual.durationMonths} months` : undefined,
        hasAttachment: qual.certificate !== null
      }))
    },
    {
      id: 'experience',
      title: 'Professional Experience',
      icon: <Briefcase className="w-4 h-4" />,
      items: formData.experiences.length > 0 
        ? formData.experiences.map((exp, i) => ({
            label: exp.designation,
            value: exp.organizationName,
            hasAttachment: exp.certificate !== null
          }))
        : [{ label: 'No experience added', value: '-' }]
    },
    {
      id: 'practice',
      title: 'Practice Geography',
      icon: <MapPin className="w-4 h-4" />,
      items: [
        { label: 'State of Registration', value: formData.stateOfResidence },
        { 
          label: 'Practice in Other States', 
          value: formData.practiceInOtherState 
            ? formData.practiceStates.map(s => s.state).join(', ') 
            : 'No' 
        }
      ]
    },
    {
      id: 'documents',
      title: 'Uploaded Documents',
      icon: <Upload className="w-4 h-4" />,
      items: [
        { label: 'Provisional Degree', value: formData.provisionalDegree?.name || 'Not uploaded' },
        { label: 'Final Degree', value: formData.finalDegree?.name || 'Not uploaded' },
        { label: 'Transcripts', value: formData.transcripts?.name || 'Not uploaded' },
        { label: 'ID Proof', value: formData.validIdProof?.name || 'Not uploaded' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Review & Submit
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Please review all information carefully before submitting your permanent registration application.
        </p>
      </div>

      {/* Application Fee Notice */}
      <div className="bg-gradient-to-r from-primary/5 to-teal-50 rounded-xl p-5 border border-primary/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Application Fee</h4>
            <p className="text-sm text-muted-foreground">Maximum fee: <strong className="text-foreground">₹2,000</strong> (excluding taxes)</p>
          </div>
        </div>
      </div>

      {/* SLA Notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Processing Timeline</p>
          <p>
            Your State Council has <strong>30 days</strong> to review and process your application. 
            You can track the status from your dashboard.
          </p>
        </div>
      </div>

      {/* Review Sections */}
      <Accordion type="multiple" defaultValue={['registration', 'personal']} className="space-y-3">
        {sections.map((section) => (
          <AccordionItem 
            key={section.id} 
            value={section.id}
            className="border border-border rounded-xl overflow-hidden bg-white"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  {section.icon}
                </div>
                <span className="font-medium text-foreground">{section.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      <p className="font-medium text-foreground text-sm">{item.value || '-'}</p>
                      {'subtitle' in item && item.subtitle && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                      )}
                    </div>
                    {'hasAttachment' in item && item.hasAttachment && (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Preview/Download Buttons */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 rounded-xl border border-border">
        <Button 
          variant="outline" 
          onClick={() => setShowPreview(true)}
          className="gap-2"
        >
          <Eye className="w-4 h-4" />
          Preview Application
        </Button>
        <Button 
          variant="outline" 
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Download as PDF
        </Button>
      </div>

      {/* Aadhaar Consent */}
      <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800">Aadhaar Consent Clause</h4>
            <p className="text-sm text-amber-700 mt-1">
              I hereby give my consent to the National Commission for Allied and Healthcare Professions (NCAHP) 
              to process my personal information, including Aadhaar details, for the purpose of reviewing 
              my registration application.
            </p>
          </div>
        </div>
        <Label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={formData.aadhaarConsent}
            onCheckedChange={(checked) => updateFormData('aadhaarConsent', checked as boolean)}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="text-sm font-medium text-amber-800">
            I agree to the Aadhaar consent clause <span className="text-destructive">*</span>
          </span>
        </Label>
      </div>

      {/* Declaration */}
      <div className="bg-white rounded-xl p-5 border border-border">
        <div className="flex items-start gap-3 mb-4">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground">Declaration</h4>
            <p className="text-sm text-muted-foreground mt-1">
              I hereby declare that all the information provided by me in this application is true, 
              complete, and correct to the best of my knowledge and belief. I understand that any 
              false statement or misrepresentation may lead to rejection of my application or 
              revocation of registration.
            </p>
          </div>
        </div>
        <Label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={formData.declarationAccepted}
            onCheckedChange={(checked) => updateFormData('declarationAccepted', checked as boolean)}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="text-sm font-medium text-foreground">
            I accept the declaration and terms <span className="text-destructive">*</span>
          </span>
        </Label>
      </div>

      {/* Submit Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-5 rounded-xl border-2 ${
          formData.aadhaarConsent && formData.declarationAccepted
            ? 'bg-green-50 border-green-200'
            : 'bg-slate-50 border-border'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {formData.aadhaarConsent && formData.declarationAccepted ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <span className="font-medium text-green-800">Ready to submit</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-6 h-6 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">
                  Accept all terms to submit
                </span>
              </>
            )}
          </div>
          <Button
            onClick={onSubmit}
            disabled={!formData.aadhaarConsent || !formData.declarationAccepted}
            className="gap-2 bg-gradient-to-r from-primary to-teal-600 hover:from-primary-dark hover:to-teal-700 text-white shadow-lg"
          >
            <Shield className="w-4 h-4" />
            Submit Application
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewSubmitStep;
