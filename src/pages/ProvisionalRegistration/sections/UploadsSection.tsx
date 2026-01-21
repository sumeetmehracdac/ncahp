import { Upload, FileCheck, X, Image, FileText, CreditCard, Stethoscope, Home, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionCard from '../components/SectionCard';
import { FormFieldGroup, FormRow, FormDivider } from '../components/FormFieldGroup';
import { ProvisionalFormData } from '../types';

interface Props {
  formData: ProvisionalFormData;
  updateFormData: <K extends keyof ProvisionalFormData>(field: K, value: ProvisionalFormData[K]) => void;
  sectionRef: React.RefObject<HTMLDivElement>;
}

interface DocumentSlot {
  key: keyof ProvisionalFormData['documents'];
  label: string;
  description: string;
  icon: React.ElementType;
  required: boolean;
  accept: string;
  maxSize: number; // in MB
}

const documentSlots: DocumentSlot[] = [
  {
    key: 'passportPhoto',
    label: 'Passport Size Photo',
    description: 'Recent passport-size photograph with white background',
    icon: Camera,
    required: true,
    accept: '.jpg,.jpeg,.png',
    maxSize: 2,
  },
  {
    key: 'signatureImage',
    label: 'Signature Image',
    description: 'Scanned signature on white paper',
    icon: FileText,
    required: true,
    accept: '.jpg,.jpeg,.png',
    maxSize: 1,
  },
  {
    key: 'idProof',
    label: 'Valid ID Proof',
    description: 'Aadhaar Card, PAN Card, Passport, or Voter ID',
    icon: CreditCard,
    required: true,
    accept: '.pdf,.jpg,.jpeg,.png',
    maxSize: 5,
  },
  {
    key: 'medicalFitnessCertificate',
    label: 'Medical Fitness Certificate',
    description: 'Recent medical fitness certificate from registered medical practitioner',
    icon: Stethoscope,
    required: true,
    accept: '.pdf,.jpg,.jpeg,.png',
    maxSize: 5,
  },
  {
    key: 'addressProof',
    label: 'Address Proof',
    description: 'Utility bill, bank statement, or any valid address proof',
    icon: Home,
    required: false,
    accept: '.pdf,.jpg,.jpeg,.png',
    maxSize: 5,
  },
];

const idProofTypes = [
  'Aadhaar Card',
  'PAN Card',
  'Passport',
  'Voter ID Card',
  'Driving License',
];

export default function UploadsSection({ formData, updateFormData, sectionRef }: Props) {
  const updateDocument = (key: keyof ProvisionalFormData['documents'], value: File | null | string) => {
    updateFormData('documents', {
      ...formData.documents,
      [key]: value,
    });
  };

  const handleFileUpload = (key: keyof ProvisionalFormData['documents'], file: File | null, maxSize: number) => {
    if (file && file.size > maxSize * 1024 * 1024) {
      alert(`File size should not exceed ${maxSize}MB`);
      return;
    }
    updateDocument(key, file);
  };

  const getUploadedCount = () => {
    const docs = formData.documents;
    let count = 0;
    if (docs.passportPhoto) count++;
    if (docs.signatureImage) count++;
    if (docs.idProof) count++;
    if (docs.medicalFitnessCertificate) count++;
    if (docs.addressProof) count++;
    return count;
  };

  const getRequiredCount = () => {
    const docs = formData.documents;
    let count = 0;
    if (docs.passportPhoto) count++;
    if (docs.signatureImage) count++;
    if (docs.idProof) count++;
    if (docs.medicalFitnessCertificate) count++;
    return count;
  };

  return (
    <SectionCard
      ref={sectionRef}
      id="uploads"
      number={7}
      title="Uploads"
      tagline="Uploading of Valid ID Proof, Medical Fitness Certificate, etc."
      icon={<Upload className="w-5 h-5" />}
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Upload Progress</span>
          <span className="text-sm text-muted-foreground">
            {getRequiredCount()}/4 required documents
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(getRequiredCount() / 4) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
          />
        </div>
      </div>

      {/* ID Proof Type Selection */}
      <div className="mb-6">
        <FormFieldGroup label="Select ID Proof Type" required>
          <Select
            value={formData.documents.idProofType}
            onValueChange={(value) => updateDocument('idProofType', value)}
          >
            <SelectTrigger className="h-11 max-w-md">
              <SelectValue placeholder="Select the type of ID proof you're uploading" />
            </SelectTrigger>
            <SelectContent>
              {idProofTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldGroup>
      </div>

      <FormDivider label="Required Documents" />

      {/* Document Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentSlots.map((slot) => {
          const file = formData.documents[slot.key] as File | null;
          const Icon = slot.icon;
          
          return (
            <motion.div
              key={slot.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                file 
                  ? 'border-success bg-success/5' 
                  : slot.required 
                    ? 'border-dashed border-border hover:border-primary/50 hover:bg-muted/30' 
                    : 'border-dashed border-border/50 hover:border-border hover:bg-muted/20'
              }`}
            >
              {/* Required Badge */}
              {slot.required && !file && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-destructive text-destructive-foreground text-xs font-medium rounded-full">
                  Required
                </span>
              )}
              
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  file ? 'bg-success/20' : 'bg-muted'
                }`}>
                  {file ? (
                    <FileCheck className="w-6 h-6 text-success" />
                  ) : (
                    <Icon className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground mb-1">{slot.label}</h4>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {slot.description}
                  </p>
                  
                  {file ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => updateDocument(slot.key, null)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg cursor-pointer hover:bg-primary-dark transition-colors">
                      <Upload className="w-4 h-4" />
                      Upload File
                      <input
                        type="file"
                        className="hidden"
                        accept={slot.accept}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleFileUpload(slot.key, file, slot.maxSize);
                        }}
                      />
                    </label>
                  )}
                  
                  {!file && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Max {slot.maxSize}MB • {slot.accept.replace(/\./g, '').toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Self-Attestation Notice */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-900">Self-Attestation Required</p>
            <p className="text-sm text-amber-800 mt-1">
              All uploaded documents must be self-attested. Please sign and date each document before uploading.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              {getUploadedCount()} of {documentSlots.length} documents uploaded
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {4 - getRequiredCount()} required document(s) remaining
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{Math.round((getUploadedCount() / documentSlots.length) * 100)}%</span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
