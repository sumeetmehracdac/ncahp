import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Form2AData, Form2ADocuments } from "../../types/form2A";

interface Props {
  formData: Form2AData;
  updateFormData: <K extends keyof Form2AData>(field: K, value: Form2AData[K]) => void;
}

const documentsList: { key: keyof Form2ADocuments; label: string; required: boolean }[] = [
  { key: 'passportCopy', label: 'Copy of Passport', required: true },
  { key: 'visaCopy', label: 'Copy of Visa', required: true },
  { key: 'englishProficiency', label: 'English Language Proficiency Certificate (if applicable)', required: false },
  { key: 'endorsementLetter', label: 'Endorsement Letter (Letter from regulatory body of respective allied and healthcare profession about validity of degree to practice from the country of healthcare qualification obtained)', required: true },
  { key: 'sponsorshipProof', label: 'Proof of Sponsorship or Financial Support (if any)', required: false },
];

const DocumentsStep2A = ({ formData, updateFormData }: Props) => {
  const updateDocument = (key: keyof Form2ADocuments, file: File | null) => {
    updateFormData("documents", {
      ...formData.documents,
      [key]: file
    });
  };

  const handleFileChange = (key: keyof Form2ADocuments, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateDocument(key, file);
    }
  };

  return (
    <div className="space-y-8">

      {/* Documents Grid */}
      <div className="grid grid-cols-1 gap-4">
        {documentsList.map((doc) => {
          const file = formData.documents[doc.key];
          const isUploaded = file !== null;

          return (
            <div
              key={doc.key}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isUploaded
                  ? "border-primary bg-primary/5"
                  : doc.required
                    ? "border-border hover:border-primary/50"
                    : "border-dashed border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isUploaded ? "bg-primary/20" : "bg-muted"
                  }`}
                >
                  {isUploaded ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Upload className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Label className="text-sm font-medium text-foreground">
                    {doc.label}
                    {doc.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {isUploaded ? file.name : "Click to upload (PDF, JPG, PNG)"}
                  </p>
                </div>
              </div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(doc.key, e)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          );
        })}
      </div>

      {/* Info Note */}
      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> All documents must be self-attested on every page. Documents should be clear and legible. Maximum file size per document is 5MB.
        </p>
      </div>
    </div>
  );
};

export default DocumentsStep2A;
