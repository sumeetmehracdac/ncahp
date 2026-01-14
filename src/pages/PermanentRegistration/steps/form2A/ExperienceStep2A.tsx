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
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Allied and Healthcare Professional Experience
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Provide details of your allied and healthcare professional experience (if any). This section is optional.
        </p>
      </div>

      {/* Experience List */}
      <div className="space-y-6">
        {formData.experiences.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-border">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">No allied and healthcare professional experience added</p>
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
                    <Label className="text-sm text-muted-foreground">Designation</Label>
                    <Input
                      placeholder="e.g., Lab Technician"
                      value={exp.designation}
                      onChange={(e) => updateExperience(index, 'designation', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Country</Label>
                    <Input
                      placeholder="Country"
                      value={exp.country}
                      onChange={(e) => updateExperience(index, 'country', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-sm text-muted-foreground">Name & Address of Organisation</Label>
                    <Input
                      placeholder="Organisation name and full address"
                      value={exp.organizationNameAddress}
                      onChange={(e) => updateExperience(index, 'organizationNameAddress', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Date of Start</Label>
                    <Input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Date of Completion</Label>
                    <Input
                      type="date"
                      value={exp.completionDate}
                      onChange={(e) => updateExperience(index, 'completionDate', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-sm text-muted-foreground">Core Duties</Label>
                    <Textarea
                      placeholder="Describe your core duties and responsibilities"
                      value={exp.coreDuties}
                      onChange={(e) => updateExperience(index, 'coreDuties', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-sm text-muted-foreground">Attach Certificate</Label>
                    <div className="relative">
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-all ${
                          exp.certificate ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
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
