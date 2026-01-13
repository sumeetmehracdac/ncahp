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
      institutionName: '',
      address: '',
      state: '',
      proofDocument: null
    };
    updateFormData("practiceStates", [...formData.practiceStates, newState]);
  };

  const removePracticeState = (index: number) => {
    const updated = formData.practiceStates.filter((_, i) => i !== index);
    updateFormData("practiceStates", updated);
  };

  const updatePracticeState = (index: number, field: keyof Form2BPracticeState, value: string | File | null) => {
    const updated = formData.practiceStates.map((state, i) => 
      i === index ? { ...state, [field]: value } : state
    );
    updateFormData("practiceStates", updated);
  };

  return (
    <div className="space-y-8">
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">Practice Location</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Specify where you intend to practice in India.</p>
      </div>

      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
        <div>
          <Label className="text-base font-medium">Do you intend to practice in multiple states?</Label>
          <p className="text-sm text-muted-foreground">Add the states where you plan to practice</p>
        </div>
        <Switch
          checked={formData.practiceInOtherState}
          onCheckedChange={(checked) => updateFormData("practiceInOtherState", checked)}
        />
      </div>

      {formData.practiceInOtherState && (
        <div className="space-y-4">
          {formData.practiceStates.map((state, index) => (
            <div key={index} className="p-4 border border-border rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Practice Location {index + 1}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removePracticeState(index)} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>State <span className="text-destructive">*</span></Label>
                  <Select value={state.state} onValueChange={(value) => updatePracticeState(index, 'state', value)}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {indianStates.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Institution Name <span className="text-destructive">*</span></Label>
                  <Input 
                    value={state.institutionName} 
                    onChange={(e) => updatePracticeState(index, 'institutionName', e.target.value)}
                    placeholder="Clinic/Lab/Hospital name"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Institution Address <span className="text-destructive">*</span></Label>
                  <Input 
                    value={state.address} 
                    onChange={(e) => updatePracticeState(index, 'address', e.target.value)}
                    placeholder="Full address"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Proof of Practice (if any)</Label>
                  <Input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => updatePracticeState(index, 'proofDocument', e.target.files?.[0] || null)}
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
