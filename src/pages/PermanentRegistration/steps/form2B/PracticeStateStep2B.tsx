import { MapPin, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form2BData, Form2BPracticeState } from "../../types/form2B";
import { indianStates } from "../../index";

interface Props {
  formData: Form2BData;
  updateFormData: <K extends keyof Form2BData>(field: K, value: Form2BData[K]) => void;
}

const PracticeStateStep2B = ({ formData, updateFormData }: Props) => {
  const addPracticeState = () => {
    const newState: Form2BPracticeState = {
      state: "",
      district: "",
      institutionName: "",
      address: "",
      proofDocument: null,
    };
    updateFormData("practiceStates", [...formData.practiceStates, newState]);
  };

  const removePracticeState = (index: number) => {
    const updated = formData.practiceStates.filter((_, i) => i !== index);
    updateFormData("practiceStates", updated);
  };

  const updatePracticeState = (index: number, field: keyof Form2BPracticeState, value: string | File | null) => {
    const updated = formData.practiceStates.map((state, i) => (i === index ? { ...state, [field]: value } : state));
    updateFormData("practiceStates", updated);
  };

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
        <div>
          <Label className="text-base font-medium">
            Are you desirous of practicing the recognized profession in a state other than state of residence (state of registration)?
          </Label>
          <p className="text-sm text-muted-foreground mt-1">Add the states where you plan to practice</p>
        </div>
        <Switch
          checked={formData.practiceInOtherState}
          onCheckedChange={(checked) => updateFormData("practiceInOtherState", checked)}
        />
      </div>

      {formData.practiceInOtherState && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground font-medium">In case of Yes:</p>
          
          {formData.practiceStates.map((state, index) => (
            <div key={index} className="p-4 border border-border rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Practice Location {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePracticeState(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    1. State <span className="text-destructive">*</span>
                  </Label>
                  <Select value={state.state} onValueChange={(value) => updatePracticeState(index, "state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {indianStates.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>
                    2. District <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={state.district}
                    onChange={(e) => updatePracticeState(index, "district", e.target.value)}
                    placeholder="District name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    3. Name of Institution/Hospital/Clinic/Laboratory etc <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={state.institutionName}
                    onChange={(e) => updatePracticeState(index, "institutionName", e.target.value)}
                    placeholder="Institution name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    4. Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={state.address}
                    onChange={(e) => updatePracticeState(index, "address", e.target.value)}
                    placeholder="Full address"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>5. Supporting Document-1 (Upload)</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => updatePracticeState(index, "proofDocument", e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addPracticeState} className="w-full gap-2">
            <Plus className="w-4 h-4" /> Add Another State
          </Button>
        </div>
      )}
    </div>
  );
};

export default PracticeStateStep2B;
