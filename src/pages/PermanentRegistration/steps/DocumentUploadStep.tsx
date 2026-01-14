import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileCheck,
  AlertTriangle,
  GraduationCap,
  FileText,
  CreditCard,
  Briefcase,
  Book,
  X,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const DocumentUploadStep = ({ formData, updateFormData }: Props) => {
  const { toast } = useToast();
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<{ name: string; url: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 5MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`;
    }
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please upload PDF, JPG, or PNG files only.';
    }
    return null;
  };

  const handleFileUpload = (key: keyof FormData, file: File | null) => {
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setErrors(prev => ({ ...prev, [key]: error }));
      toast({
        title: 'Upload Error',
        description: error,
        variant: 'destructive',
      });
      return;
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
    updateFormData(key, file as any);
    toast({
      title: 'File Uploaded',
      description: `${file.name} has been uploaded successfully.`,
      duration: 2000,
    });
  };

  const handleInputChange = (key: keyof FormData, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(key, file);
    }
    // Reset the input so the same file can be re-selected
    e.target.value = '';
  };

  const handleRemoveFile = (key: keyof FormData) => {
    updateFormData(key, null as any);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  const handleDragOver = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(key);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, key: keyof FormData) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(key, file);
    }
  };

  const handlePreview = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewFile({ name: file.name, url });
  };

  const closePreview = () => {
    if (previewFile) {
      URL.revokeObjectURL(previewFile.url);
      setPreviewFile(null);
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
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
      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200" role="alert">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
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
        <div className="w-full bg-border rounded-full h-2.5 overflow-hidden" role="progressbar" aria-valuenow={getUploadedCount()} aria-valuemin={0} aria-valuemax={documentSlots.length}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(getUploadedCount() / documentSlots.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-primary rounded-full"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className={getRequiredUploadedCount() === getRequiredCount() ? 'text-green-600 font-medium' : ''}>
            Required: {getRequiredUploadedCount()}/{getRequiredCount()}
            {getRequiredUploadedCount() === getRequiredCount() && ' ✓'}
          </span>
          <span>Optional: {getUploadedCount() - getRequiredUploadedCount()}/{documentSlots.length - getRequiredCount()}</span>
        </div>
      </div>

      {/* Document Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentSlots.map((slot, index) => {
          const file = formData[slot.key] as File | null;
          const isUploaded = file !== null;
          const isDraggedOver = dragOver === slot.key;
          const hasError = errors[slot.key];

          return (
            <motion.div
              key={slot.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onDragOver={(e) => handleDragOver(e, slot.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, slot.key)}
              className={`relative rounded-xl border-2 transition-all ${hasError
                  ? 'border-destructive bg-destructive/5'
                  : isDraggedOver
                    ? 'border-primary bg-primary/10 scale-[1.02]'
                    : isUploaded
                      ? 'border-green-500 bg-green-50/50'
                      : slot.required
                        ? 'border-dashed border-amber-300 bg-white hover:border-primary hover:bg-primary/5'
                        : 'border-dashed border-border bg-white hover:border-primary/50 hover:bg-muted/30'
                }`}
            >
              {/* Hidden file input */}
              <input
                type="file"
                ref={(el) => fileInputRefs.current[slot.key] = el}
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleInputChange(slot.key, e)}
                className="sr-only"
                aria-label={`Upload ${slot.label}`}
                id={`file-${slot.key}`}
              />

              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${hasError
                      ? 'bg-destructive/10 text-destructive'
                      : isUploaded
                        ? 'bg-green-100 text-green-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                    {hasError ? <AlertCircle className="w-6 h-6" /> : isUploaded ? <FileCheck className="w-6 h-6" /> : slot.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Label htmlFor={`file-${slot.key}`} className="font-medium text-foreground cursor-pointer">
                        {slot.label}
                      </Label>
                      {slot.required && (
                        <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">Required</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{slot.description}</p>

                    {hasError ? (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {hasError}
                      </p>
                    ) : isUploaded ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-green-700 min-w-0">
                          <FileCheck className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm font-medium truncate">{file?.name}</span>
                          <span className="text-xs text-green-600 flex-shrink-0">({formatFileSize(file?.size || 0)})</span>
                        </div>
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          {file?.type.startsWith('image/') && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(file!)}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                              aria-label={`Preview ${slot.label}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(slot.key)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            aria-label={`Remove ${slot.label}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[slot.key]?.click()}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-left"
                      >
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">Click or drag to upload (PDF, JPG, PNG - max 5MB)</span>
                      </button>
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
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Accepted File Formats & Limits</p>
            <ul className="list-disc list-inside space-y-0.5 text-blue-700">
              <li>PDF files (recommended for multi-page documents)</li>
              <li>JPEG/JPG images (max 5MB per file)</li>
              <li>PNG images (max 5MB per file)</li>
              <li>Tip: Use PDF for documents with multiple pages</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={closePreview}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white z-10"
              >
                <X className="w-4 h-4 mr-1" />
                Close
              </Button>
              <img
                src={previewFile.url}
                alt={previewFile.name}
                className="max-w-full h-auto rounded-lg shadow-2xl"
              />
              <p className="text-white text-center mt-2 text-sm">{previewFile.name}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentUploadStep;
