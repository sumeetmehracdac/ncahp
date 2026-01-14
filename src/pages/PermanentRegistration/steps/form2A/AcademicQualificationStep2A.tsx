import { GraduationCap, Plus, Trash2, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form2AData, Form2AAcademicQualification } from "../../types/form2A";

interface Props {
  formData: Form2AData;
  updateFormData: <K extends keyof Form2AData>(field: K, value: Form2AData[K]) => void;
}

const AcademicQualificationStep2A = ({ formData, updateFormData }: Props) => {
  const addQualification = () => {
    const newQual: Form2AAcademicQualification = {
      id: Date.now().toString(),
      qualificationName: '',
      institutionName: '',
      university: '',
      country: '',
      durationMonths: '',
      admissionDate: '',
      passingDate: '',
      certificate: null
    };
    updateFormData("academicQualifications", [...formData.academicQualifications, newQual]);
  };

  const updateQualification = (index: number, field: keyof Form2AAcademicQualification, value: string | File | null) => {
    const updated = [...formData.academicQualifications];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData("academicQualifications", updated);
  };

  const removeQualification = (index: number) => {
    if (formData.academicQualifications.length > 1) {
      const updated = formData.academicQualifications.filter((_, i) => i !== index);
      updateFormData("academicQualifications", updated);
    }
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateQualification(index, 'certificate', file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Academic Qualification
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Provide details of your academic qualifications related to allied and healthcare professions.
        </p>
      </div>

      {/* Qualifications List */}
      <div className="space-y-6">
        {formData.academicQualifications.map((qual, index) => (
          <div
            key={qual.id}
            className="bg-slate-50 rounded-xl p-6 border border-border space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Qualification {index + 1}</h3>
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQualification(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Name of Qualification <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="e.g., Bachelor of Medical Laboratory Technology"
                  value={qual.qualificationName}
                  onChange={(e) => updateQualification(index, 'qualificationName', e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Name of Institution <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Institution name"
                  value={qual.institutionName}
                  onChange={(e) => updateQualification(index, 'institutionName', e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  University <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="University name"
                  value={qual.university}
                  onChange={(e) => updateQualification(index, 'university', e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Country <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Country"
                  value={qual.country}
                  onChange={(e) => updateQualification(index, 'country', e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Duration of Course (in months) <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 48"
                  value={qual.durationMonths}
                  onChange={(e) => updateQualification(index, 'durationMonths', e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Date of Admission <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  value={qual.admissionDate}
                  onChange={(e) => updateQualification(index, 'admissionDate', e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Date of Passing <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  value={qual.passingDate}
                  onChange={(e) => updateQualification(index, 'passingDate', e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Attach Certificate <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-all ${
                      qual.certificate ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">
                      {qual.certificate ? qual.certificate.name : "Upload certificate"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(index, e)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add More Button */}
        <Button
          type="button"
          variant="outline"
          onClick={addQualification}
          className="w-full border-dashed border-2 h-12"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Qualification
        </Button>
      </div>
    </div>
  );
};

export default AcademicQualificationStep2A;
