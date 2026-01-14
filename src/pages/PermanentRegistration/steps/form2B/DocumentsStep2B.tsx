import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Form2BData, Form2BDocuments } from "../../types/form2B";

interface Props {
  formData: Form2BData;
  updateFormData: <K extends keyof Form2BData>(field: K, value: Form2BData[K]) => void;
}

const documentsList: { key: keyof Form2BDocuments; label: string; required: boolean }[] = [
  { key: 'transcripts', label: 'Transcripts', required: true },
  { key: 'undergradSyllabus', label: 'Attested syllabus of Undergraduate program', required: true },
  { key: 'postgradSyllabus', label: 'Attested syllabus of Postgraduate program (if applicable)', required: false },
  { key: 'professionalRegistration', label: 'Allied and Healthcare Professional Registration number (if applicable)', required: false },
  { key: 'proofOfAddress', label: 'Proof of Address', required: true },
  { key: 'equivalenceCertificate', label: 'Equivalence Certificate (if applicable)', required: false },
  { key: 'medicalFitness', label: 'Medical/Fitness Certificate including vaccination details', required: true },
];

const DocumentsStep2B = ({ formData, updateFormData }: Props) => {
  const updateDocument = (key: keyof Form2BDocuments, file: File | null) => {
    updateFormData("documents", { ...formData.documents, [key]: file });
  };

  const handleFileChange = (key: keyof Form2BDocuments, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) updateDocument(key, file);
  };

  return (
    <div className="space-y-8">
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">Document Checklist</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Upload required documents for your registration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentsList.map((doc) => {
          const file = formData.documents[doc.key];
          const isUploaded = file !== null;
          return (
            <div key={doc.key} className={`relative p-4 rounded-xl border-2 transition-all ${isUploaded ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isUploaded ? "bg-primary/20" : "bg-muted"}`}>
                  {isUploaded ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <Label className="text-sm font-medium">{doc.label}{doc.required && <span className="text-destructive ml-1">*</span>}</Label>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{isUploaded ? file.name : "Click to upload"}</p>
                </div>
              </div>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(doc.key, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentsStep2B;
