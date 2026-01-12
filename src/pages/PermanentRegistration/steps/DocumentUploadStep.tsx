import { motion } from 'framer-motion';
import { 
  Upload, 
  FileCheck,
  AlertTriangle,
  GraduationCap,
  FileText,
  CreditCard,
  Briefcase,
  Book
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { FormData } from '../index';

interface Props {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

interface DocumentSlot {
  key: keyof FormData;
  label: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
}

const DocumentUploadStep = ({ formData, updateFormData }: Props) => {
  const documentSlots: DocumentSlot[] = [
    {
      key: 'provisionalDegree',
      label: 'Provisional Degree',
      description: 'Provisional degree certificate issued by the university',
      icon: <GraduationCap className="w-5 h-5" />,
      required: false
    },
    {
      key: 'finalDegree',
      label: 'Final Degree Certificate',
      description: 'Final degree/diploma certificate for your qualification',
      icon: <GraduationCap className="w-5 h-5" />,
      required: true
    },
    {
      key: 'internshipCertificate',
      label: 'Internship Completion Certificate',
      description: 'Certificate confirming completion of mandatory internship',
      icon: <Briefcase className="w-5 h-5" />,
      required: false
    },
    {
      key: 'transcripts',
      label: 'Academic Transcripts',
      description: 'Transcript issued by your institute/university',
      icon: <FileText className="w-5 h-5" />,
      required: true
    },
    {
      key: 'curriculumSoftCopy',
      label: 'Curriculum Soft Copy',
      description: 'Soft copy of the curriculum followed in your programme',
      icon: <Book className="w-5 h-5" />,
      required: false
    },
    {
      key: 'experienceEvidence',
      label: 'Evidence of Experience',
      description: 'Work experience certificates (if applicable)',
      icon: <Briefcase className="w-5 h-5" />,
      required: false
    },
    {
      key: 'validIdProof',
      label: 'Valid ID Proof',
      description: 'Aadhaar / Passport / Voter ID',
      icon: <CreditCard className="w-5 h-5" />,
      required: true
    }
  ];

  const handleFileUpload = (key: keyof FormData, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData(key, file as any);
    }
  };

  const getUploadedCount = () => {
    return documentSlots.filter(slot => formData[slot.key] !== null).length;
  };

  const getRequiredUploadedCount = () => {
    return documentSlots.filter(slot => slot.required && formData[slot.key] !== null).length;
  };

  const getRequiredCount = () => {
    return documentSlots.filter(slot => slot.required).length;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Document Repository
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Upload all required documents for your permanent registration application.
        </p>
      </div>

      {/* Self-Attestation Warning */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold mb-1">Self-Attestation Required</p>
          <p>
            All uploaded documents must be <strong>self-attested on every page</strong>. 
            Documents without proper attestation may lead to application rejection.
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      <div className="bg-slate-50 rounded-xl p-4 border border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Upload Progress</span>
          <span className="text-sm text-muted-foreground">
            {getUploadedCount()} of {documentSlots.length} documents
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(getUploadedCount() / documentSlots.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-primary rounded-full"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Required: {getRequiredUploadedCount()}/{getRequiredCount()}</span>
          <span>Optional: {getUploadedCount() - getRequiredUploadedCount()}/{documentSlots.length - getRequiredCount()}</span>
        </div>
      </div>

      {/* Document Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentSlots.map((slot, index) => {
          const file = formData[slot.key] as File | null;
          const isUploaded = file !== null;
          
          return (
            <motion.div
              key={slot.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative rounded-xl border-2 transition-all ${
                isUploaded 
                  ? 'border-green-500 bg-green-50/50' 
                  : slot.required 
                    ? 'border-dashed border-amber-300 bg-white hover:border-primary hover:bg-primary/5' 
                    : 'border-dashed border-border bg-white hover:border-primary/50 hover:bg-muted/30'
              }`}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(slot.key, e)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isUploaded 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isUploaded ? <FileCheck className="w-6 h-6" /> : slot.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Label className="font-medium text-foreground">{slot.label}</Label>
                      {slot.required && (
                        <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">Required</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{slot.description}</p>
                    
                    {isUploaded ? (
                      <div className="flex items-center gap-2 text-green-700">
                        <FileCheck className="w-4 h-4" />
                        <span className="text-sm font-medium truncate">{file?.name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">Click to upload (PDF, JPG, PNG)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Accepted Formats */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Accepted File Formats</p>
            <ul className="list-disc list-inside space-y-0.5 text-blue-700">
              <li>PDF files (recommended for multi-page documents)</li>
              <li>JPEG/JPG images (max 5MB per file)</li>
              <li>PNG images (max 5MB per file)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
