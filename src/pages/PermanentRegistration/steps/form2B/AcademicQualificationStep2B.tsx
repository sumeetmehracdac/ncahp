import { GraduationCap, Plus, Trash2 } from "lucide-react";
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
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">Academic Qualification</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Enter your academic qualifications in allied and healthcare professions.</p>
      </div>

      <div className="space-y-6">
        {formData.academicQualifications.map((qual, index) => (
          <div key={qual.id} className="p-5 border border-border rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Qualification {index + 1}</span>
              {formData.academicQualifications.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeQualification(qual.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name of Qualification <span className="text-destructive">*</span></Label>
                <Input value={qual.qualificationName} onChange={(e) => updateQualification(qual.id, 'qualificationName', e.target.value)} placeholder="e.g., Bachelor of Physiotherapy" />
              </div>
              <div className="space-y-2">
                <Label>Name of Institution <span className="text-destructive">*</span></Label>
                <Input value={qual.institutionName} onChange={(e) => updateQualification(qual.id, 'institutionName', e.target.value)} placeholder="College/Institute name" />
              </div>
              <div className="space-y-2">
                <Label>University/Regulatory Authority <span className="text-destructive">*</span></Label>
                <Input value={qual.university} onChange={(e) => updateQualification(qual.id, 'university', e.target.value)} placeholder="University or regulatory body name" />
              </div>
              <div className="space-y-2">
                <Label>Name of Course <span className="text-destructive">*</span></Label>
                <Input value={qual.courseName} onChange={(e) => updateQualification(qual.id, 'courseName', e.target.value)} placeholder="Course name" />
              </div>
              <div className="space-y-2">
                <Label>Country <span className="text-destructive">*</span></Label>
                <Input value={qual.country} onChange={(e) => updateQualification(qual.id, 'country', e.target.value)} placeholder="Country of study" />
              </div>
              <div className="space-y-2">
                <Label>Duration of Learning (in months)</Label>
                <Input type="number" value={qual.durationMonths} onChange={(e) => updateQualification(qual.id, 'durationMonths', e.target.value)} placeholder="e.g., 48" />
              </div>
              <div className="space-y-2">
                <Label>Mode of Instruction <span className="text-destructive">*</span></Label>
                <Select value={qual.modeOfLearning} onValueChange={(value) => updateQualification(qual.id, 'modeOfLearning', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Medium of Instruction (specify language) <span className="text-destructive">*</span></Label>
                <Input value={qual.mediumOfInstruction} onChange={(e) => updateQualification(qual.id, 'mediumOfInstruction', e.target.value)} placeholder="e.g., English" />
              </div>
              <div className="space-y-2">
                <Label>Year of admission</Label>
                <Input type="number" value={qual.admissionYear} onChange={(e) => updateQualification(qual.id, 'admissionYear', e.target.value)} placeholder="e.g., 2018" min="1950" max="2030" />
              </div>
              <div className="space-y-2">
                <Label>Year of passing <span className="text-destructive">*</span></Label>
                <Input type="number" value={qual.passingYear} onChange={(e) => updateQualification(qual.id, 'passingYear', e.target.value)} placeholder="e.g., 2022" min="1950" max="2030" />
              </div>
              <div className="space-y-2">
                <Label>Upload Certificate (Core Competency Mapping)</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateQualification(qual.id, 'certificate', e.target.files?.[0] || null)} />
                <p className="text-xs text-muted-foreground">Certificate with core competency mapping</p>
              </div>
              <div className="space-y-2">
                <Label>Upload Transcript</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateQualification(qual.id, 'transcript', e.target.files?.[0] || null)} />
                <p className="text-xs text-muted-foreground">To be endorsed by the respective University/Institute</p>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Upload Attested Syllabus</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateQualification(qual.id, 'syllabus', e.target.files?.[0] || null)} />
                <p className="text-xs text-muted-foreground">To be endorsed by the respective University/Institute</p>
              </div>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addQualification} className="w-full gap-2">
          <Plus className="w-4 h-4" /> Add Another Qualification
        </Button>
      </div>
    </div>
  );
};

export default AcademicQualificationStep2B;
