import { Briefcase, Plus, Trash2, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form2AData, Form2AExperience } from "../../types/form2A";

interface Props {
  formData: Form2AData;
  updateFormData: <K extends keyof Form2AData>(field: K, value: Form2AData[K]) => void;
}

const ExperienceStep2A = ({ formData, updateFormData }: Props) => {
  const addExperience = () => {
    const newExp: Form2AExperience = {
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

  const updateExperience = (index: number, field: keyof Form2AExperience, value: string | File | null) => {
    const updated = [...formData.experiences];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData("experiences", updated);
  };

  const removeExperience = (index: number) => {
    const updated = formData.experiences.filter((_, i) => i !== index);
    updateFormData("experiences", updated);
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateExperience(index, 'certificate', file);
    }
  };

  return (
    <div className="space-y-8">

      {/* Experience List */}
      <div className="space-y-6">
        {formData.experiences.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-border">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">No professional experience added</p>
            <p className="text-sm text-muted-foreground mb-4">This section is optional</p>
            <Button type="button" variant="outline" onClick={addExperience}>
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>
        ) : (
          <>
            {formData.experiences.map((exp, index) => (
              <div
                key={exp.id}
                className="bg-slate-50 rounded-xl p-6 border border-border space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Experience {index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Designation</Label>
                    <Input
                      placeholder="Designation"
                      value={exp.designation}
                      onChange={(e) => updateExperience(index, 'designation', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Name & Address of Organization</Label>
                    <Input
                      placeholder="Name & Address"
                      value={exp.organizationNameAddress}
                      onChange={(e) => updateExperience(index, 'organizationNameAddress', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      placeholder="Country"
                      value={exp.country}
                      onChange={(e) => updateExperience(index, 'country', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of start</Label>
                    <Input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of completion</Label>
                    <Input
                      type="date"
                      value={exp.completionDate}
                      onChange={(e) => updateExperience(index, 'completionDate', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Core Duties</Label>
                    <Textarea
                      placeholder="Core Duties"
                      value={exp.coreDuties}
                      onChange={(e) => updateExperience(index, 'coreDuties', e.target.value)}
                      rows={1}
                      className="h-11 min-h-[44px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>License / Professional Registration Number (if any)</Label>
                    <Input
                      placeholder="License Number"
                      value={exp.licenseNumber}
                      onChange={(e) => updateExperience(index, 'licenseNumber', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Authority (if any)</Label>
                    <Input
                      placeholder="Issuing Authority"
                      value={exp.issuingAuthority}
                      onChange={(e) => updateExperience(index, 'issuingAuthority', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Certificate Attached</Label>
                    <div className="relative">
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-all ${exp.certificate ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                      >
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground truncate">
                          {exp.certificate ? exp.certificate.name : "Upload certificate"}
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
              onClick={addExperience}
              className="w-full border-dashed border-2 h-12"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Experience
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExperienceStep2A;
