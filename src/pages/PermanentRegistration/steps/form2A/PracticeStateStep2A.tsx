import { MapPin, Plus, Trash2, Upload, Building } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form2AData, Form2APracticeState } from "../../types/form2A";
import { indianStates } from "../../index";

interface Props {
  formData: Form2AData;
  updateFormData: <K extends keyof Form2AData>(field: K, value: Form2AData[K]) => void;
}

const PracticeStateStep2A = ({ formData, updateFormData }: Props) => {
  const addPracticeState = () => {
    const newState: Form2APracticeState = {
      institutionName: '',
      address: '',
      state: '',
      proofDocument: null
    };
    updateFormData("practiceStates", [...formData.practiceStates, newState]);
  };

  const updatePracticeState = (index: number, field: keyof Form2APracticeState, value: string | File | null) => {
    const updated = [...formData.practiceStates];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData("practiceStates", updated);
  };

  const removePracticeState = (index: number) => {
    const updated = formData.practiceStates.filter((_, i) => i !== index);
    updateFormData("practiceStates", updated);
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updatePracticeState(index, 'proofDocument', file);
    }
  };

  // Add first state if empty
  if (formData.practiceStates.length === 0) {
    addPracticeState();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Indian State(s) of Practice
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Specify the Indian state(s) where you intend to practice during your temporary registration.
        </p>
      </div>

      {/* Practice States List */}
      <div className="space-y-6">
        {formData.practiceStates.map((ps, index) => (
          <div
            key={index}
            className="bg-slate-50 rounded-xl p-6 border border-border space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Practice Location {index + 1}</h3>
              </div>
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePracticeState(index)}
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
                  Name of Institution/Hospital <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="e.g., Apollo Hospitals"
                  value={ps.institutionName}
                  onChange={(e) => updatePracticeState(index, 'institutionName', e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  State <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={ps.state}
                  onValueChange={(value) => updatePracticeState(index, 'state', value)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 bg-white">
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Full address of the institution"
                  value={ps.address}
                  onChange={(e) => updatePracticeState(index, 'address', e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Proof of Practice <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-all ${
                      ps.proofDocument ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {ps.proofDocument ? ps.proofDocument.name : "Upload proof document (Offer letter, appointment letter, etc.)"}
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
          onClick={addPracticeState}
          className="w-full border-dashed border-2 h-12"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Practice Location
        </Button>
      </div>
    </div>
  );
};

export default PracticeStateStep2A;
