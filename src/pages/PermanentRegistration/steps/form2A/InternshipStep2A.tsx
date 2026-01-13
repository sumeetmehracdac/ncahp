import { Briefcase, Plus, Trash2, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form2AData, Form2AInternship } from "../../types/form2A";

interface Props {
  formData: Form2AData;
  updateFormData: <K extends keyof Form2AData>(field: K, value: Form2AData[K]) => void;
}

const InternshipStep2A = ({ formData, updateFormData }: Props) => {
  const addInternship = () => {
    const newInternship: Form2AInternship = {
      id: Date.now().toString(),
      designation: '',
      organizationNameAddress: '',
      country: '',
      startDate: '',
      completionDate: '',
      coreDuties: '',
      certificate: null
    };
    updateFormData("internships", [...formData.internships, newInternship]);
  };

  const updateInternship = (index: number, field: keyof Form2AInternship, value: string | File | null) => {
    const updated = [...formData.internships];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData("internships", updated);
  };

  const removeInternship = (index: number) => {
    const updated = formData.internships.filter((_, i) => i !== index);
    updateFormData("internships", updated);
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateInternship(index, 'certificate', file);
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
          Internship / Clinical Training
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Provide details of your internship or clinical training experience.
        </p>
      </div>

      {/* Internships List */}
      <div className="space-y-6">
        {formData.internships.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-border">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No internships added yet</p>
            <Button type="button" variant="outline" onClick={addInternship}>
              <Plus className="w-4 h-4 mr-2" />
              Add Internship
            </Button>
          </div>
        ) : (
          <>
            {formData.internships.map((internship, index) => (
              <div
                key={internship.id}
                className="bg-slate-50 rounded-xl p-6 border border-border space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Internship {index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInternship(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Designation <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="e.g., Intern, Trainee"
                      value={internship.designation}
                      onChange={(e) => updateInternship(index, 'designation', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Country <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="Country"
                      value={internship.country}
                      onChange={(e) => updateInternship(index, 'country', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Name & Address of Organisation <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="Organisation name and full address"
                      value={internship.organizationNameAddress}
                      onChange={(e) => updateInternship(index, 'organizationNameAddress', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Date of Start <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={internship.startDate}
                      onChange={(e) => updateInternship(index, 'startDate', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Date of Completion <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={internship.completionDate}
                      onChange={(e) => updateInternship(index, 'completionDate', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Core Duties <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      placeholder="Describe your core duties and responsibilities"
                      value={internship.coreDuties}
                      onChange={(e) => updateInternship(index, 'coreDuties', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Attach Certificate <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-all ${
                          internship.certificate ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground truncate">
                          {internship.certificate ? internship.certificate.name : "Upload certificate"}
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
              onClick={addInternship}
              className="w-full border-dashed border-2 h-12"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Internship
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default InternshipStep2A;
