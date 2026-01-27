import { GraduationCap, Plus, Trash2, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form2BData, Form2BAcademicQualification } from "../../types/form2B";

interface Props {
  formData: Form2BData;
  updateFormData: <K extends keyof Form2BData>(field: K, value: Form2BData[K]) => void;
}

const AcademicQualificationStep2B = ({ formData, updateFormData }: Props) => {
  const addQualification = () => {
    const newQual: Form2BAcademicQualification = {
      id: Date.now().toString(),
      qualificationName: '',
      institutionName: '',
      university: '',
      courseName: '',
      country: '',
      durationMonths: '',
      admissionYear: '',
      passingYear: '',
      modeOfLearning: '',
      mediumOfInstruction: '',
      certificate: null,
      transcript: null,
      syllabus: null
    };
    updateFormData("academicQualifications", [...formData.academicQualifications, newQual]);
  };

  const removeQualification = (id: string) => {
    const updated = formData.academicQualifications.filter(q => q.id !== id);
    updateFormData("academicQualifications", updated);
  };

  const updateQualification = (id: string, field: keyof Form2BAcademicQualification, value: string | File | null) => {
    const updated = formData.academicQualifications.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    );
    updateFormData("academicQualifications", updated);
  };

  return (
    <div className="space-y-8">
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">Screen-4: Academic Qualification</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Enter your academic qualifications in allied and healthcare professions.</p>
      </div>

      <div className="space-y-6">
        {formData.academicQualifications.map((qual, index) => (
          <div key={qual.id} className="p-5 border border-border rounded-xl bg-slate-50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Qualification {index + 1}</span>
              {formData.academicQualifications.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeQualification(qual.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Name of Qualification */}
              <div className="space-y-2">
                <Label>Name of Qualification <span className="text-destructive">*</span></Label>
                <Input value={qual.qualificationName} onChange={(e) => updateQualification(qual.id, 'qualificationName', e.target.value)} placeholder="e.g., Bachelor of Physiotherapy" className="h-11" />
              </div>
              {/* Name of Institution */}
              <div className="space-y-2">
                <Label>Name of Institution <span className="text-destructive">*</span></Label>
                <Input value={qual.institutionName} onChange={(e) => updateQualification(qual.id, 'institutionName', e.target.value)} placeholder="College/Institute name" className="h-11" />
              </div>
              {/* University */}
              <div className="space-y-2">
                <Label>University <span className="text-destructive">*</span></Label>
                <Input value={qual.university} onChange={(e) => updateQualification(qual.id, 'university', e.target.value)} placeholder="University name" className="h-11" />
              </div>
              {/* Name of regulatory authority */}
              <div className="space-y-2">
                <Label>Name of regulatory authority recognising the university and the program <span className="text-destructive">*</span></Label>
                <Input value={qual.courseName} onChange={(e) => updateQualification(qual.id, 'courseName', e.target.value)} placeholder="Regulatory Authority" className="h-11" />
              </div>
              {/* Country */}
              <div className="space-y-2">
                <Label>Country <span className="text-destructive">*</span></Label>
                <Input value={qual.country} onChange={(e) => updateQualification(qual.id, 'country', e.target.value)} placeholder="Country of study" className="h-11" />
              </div>
              {/* Duration of Course (in months) */}
              <div className="space-y-2">
                <Label>Duration of Course (in months) <span className="text-destructive">*</span></Label>
                <Input type="number" value={qual.durationMonths} onChange={(e) => updateQualification(qual.id, 'durationMonths', e.target.value)} placeholder="e.g., 48" className="h-11" />
              </div>
              {/* Mode of Learning - Regular (Yes/No) */}
              <div className="space-y-2">
                <Label>Mode of Learning - Regular (Yes/No) <span className="text-destructive">*</span></Label>
                <Select value={qual.modeOfLearning} onValueChange={(value) => updateQualification(qual.id, 'modeOfLearning', value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="regular">Yes (Regular)</SelectItem>
                    <SelectItem value="distance">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Medium of Instruction (specify language) */}
              <div className="space-y-2">
                <Label>Medium of Instruction (specify language) <span className="text-destructive">*</span></Label>
                <Input value={qual.mediumOfInstruction} onChange={(e) => updateQualification(qual.id, 'mediumOfInstruction', e.target.value)} placeholder="e.g., English" className="h-11" />
              </div>
              {/* Year of admission */}
              <div className="space-y-2">
                <Label>Year of admission <span className="text-destructive">*</span></Label>
                <Input type="number" value={qual.admissionYear} onChange={(e) => updateQualification(qual.id, 'admissionYear', e.target.value)} placeholder="e.g., 2018" min="1950" max="2030" className="h-11" />
              </div>
              {/* Year of passing */}
              <div className="space-y-2">
                <Label>Year of passing <span className="text-destructive">*</span></Label>
                <Input type="number" value={qual.passingYear} onChange={(e) => updateQualification(qual.id, 'passingYear', e.target.value)} placeholder="e.g., 2022" min="1950" max="2030" className="h-11" />
              </div>
              {/* Upload Certificate */}
              <div className="space-y-2">
                <Label>Upload Certificate <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <div className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-all ${qual.certificate ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground font-medium truncate">
                      {qual.certificate ? qual.certificate.name : "Upload Certificate"}
                    </span>
                  </div>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateQualification(qual.id, 'certificate', e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              {/* Upload Transcript (Core Competency Mapping) */}
              <div className="space-y-2">
                <Label>Upload Transcript (Core Competency Mapping) <span className="text-destructive">*</span></Label>
                <p className="text-xs text-muted-foreground">(to be endorsed by the respected University/Institute)</p>
                <div className="relative">
                  <div className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-all ${qual.transcript ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground font-medium truncate">
                      {qual.transcript ? qual.transcript.name : "Upload Transcript"}
                    </span>
                  </div>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateQualification(qual.id, 'transcript', e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              {/* Upload attested syllabus */}
              <div className="space-y-2">
                <Label>Upload attested syllabus <span className="text-destructive">*</span></Label>
                <p className="text-xs text-muted-foreground">(to be endorsed by the respected University/Institute)</p>
                <div className="relative">
                  <div className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-all ${qual.syllabus ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground font-medium truncate">
                      {qual.syllabus ? qual.syllabus.name : "Upload Attested Syllabus"}
                    </span>
                  </div>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateQualification(qual.id, 'syllabus', e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addQualification} className="w-full gap-2 border-dashed border-2 h-12">
          <Plus className="w-4 h-4" /> Add Another Qualification
        </Button>
      </div>
    </div>
  );
};

export default AcademicQualificationStep2B;
