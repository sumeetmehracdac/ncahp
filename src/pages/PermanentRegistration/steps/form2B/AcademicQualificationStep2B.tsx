import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
      country: '',
      durationMonths: '',
      admissionDate: '',
      passingDate: '',
      certificate: null
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
        <p className="text-muted-foreground max-w-xl mx-auto">Enter your foreign academic qualifications in healthcare.</p>
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
                <Label>Qualification Name <span className="text-destructive">*</span></Label>
                <Input value={qual.qualificationName} onChange={(e) => updateQualification(qual.id, 'qualificationName', e.target.value)} placeholder="e.g., Bachelor of Physiotherapy" />
              </div>
              <div className="space-y-2">
                <Label>Institution Name <span className="text-destructive">*</span></Label>
                <Input value={qual.institutionName} onChange={(e) => updateQualification(qual.id, 'institutionName', e.target.value)} placeholder="College/University name" />
              </div>
              <div className="space-y-2">
                <Label>University <span className="text-destructive">*</span></Label>
                <Input value={qual.university} onChange={(e) => updateQualification(qual.id, 'university', e.target.value)} placeholder="Awarding university" />
              </div>
              <div className="space-y-2">
                <Label>Country <span className="text-destructive">*</span></Label>
                <Input value={qual.country} onChange={(e) => updateQualification(qual.id, 'country', e.target.value)} placeholder="Country of study" />
              </div>
              <div className="space-y-2">
                <Label>Duration (months)</Label>
                <Input type="number" value={qual.durationMonths} onChange={(e) => updateQualification(qual.id, 'durationMonths', e.target.value)} placeholder="e.g., 48" />
              </div>
              <div className="space-y-2">
                <Label>Admission Date</Label>
                <Input type="date" value={qual.admissionDate} onChange={(e) => updateQualification(qual.id, 'admissionDate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Passing Date <span className="text-destructive">*</span></Label>
                <Input type="date" value={qual.passingDate} onChange={(e) => updateQualification(qual.id, 'passingDate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Certificate</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateQualification(qual.id, 'certificate', e.target.files?.[0] || null)} />
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
