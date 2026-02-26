import { Briefcase, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form2BData, Form2BExperience } from "../../types/form2B";

interface Props {
  formData: Form2BData;
  updateFormData: <K extends keyof Form2BData>(field: K, value: Form2BData[K]) => void;
}

const ExperienceStep2B = ({ formData, updateFormData }: Props) => {
  const addExperience = () => {
    const newExp: Form2BExperience = {
      id: Date.now().toString(),
      designation: '',
      organizationNameAddress: '',
      country: '',
      startDate: '',
      completionDate: '',
      coreDuties: '',
      licenseNumber: '',
      issuingAuthority: '',
      certificate: null
    };
    updateFormData("experiences", [...formData.experiences, newExp]);
  };

  const removeExperience = (id: string) => {
    const updated = formData.experiences.filter(e => e.id !== id);
    updateFormData("experiences", updated);
  };

  const updateExperience = (id: string, field: keyof Form2BExperience, value: string | File | null) => {
    const updated = formData.experiences.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    );
    updateFormData("experiences", updated);
  };

  return (
    <div className="space-y-8">

      <div className="space-y-6">
        {formData.experiences.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">No experience records added yet</p>
            <Button type="button" variant="outline" onClick={addExperience} className="gap-2">
              <Plus className="w-4 h-4" /> Add Experience
            </Button>
          </div>
        ) : (
          <>
            {formData.experiences.map((exp, index) => (
              <div key={exp.id} className="p-5 border border-border rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Experience {index + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeExperience(exp.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Designation</Label>
                    <Input value={exp.designation} onChange={(e) => updateExperience(exp.id, 'designation', e.target.value)} placeholder="e.g., Senior Physiotherapist" />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input value={exp.country} onChange={(e) => updateExperience(exp.id, 'country', e.target.value)} placeholder="Country of work" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Name & Address of Organization</Label>
                    <Input value={exp.organizationNameAddress} onChange={(e) => updateExperience(exp.id, 'organizationNameAddress', e.target.value)} placeholder="Organization name and address" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of start</Label>
                    <Input type="date" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of completion</Label>
                    <Input type="date" value={exp.completionDate} onChange={(e) => updateExperience(exp.id, 'completionDate', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>License / Professional Registration Number (if any)</Label>
                    <Input value={exp.licenseNumber} onChange={(e) => updateExperience(exp.id, 'licenseNumber', e.target.value)} placeholder="Professional license number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Authority</Label>
                    <Input value={exp.issuingAuthority} onChange={(e) => updateExperience(exp.id, 'issuingAuthority', e.target.value)} placeholder="Authority that issued the license" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Core Duties</Label>
                    <Textarea value={exp.coreDuties} onChange={(e) => updateExperience(exp.id, 'coreDuties', e.target.value)} placeholder="Describe your responsibilities" rows={3} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Certificate Attached</Label>
                    <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateExperience(exp.id, 'certificate', e.target.files?.[0] || null)} />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addExperience} className="w-full gap-2">
              <Plus className="w-4 h-4" /> Add Another Experience
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExperienceStep2B;
