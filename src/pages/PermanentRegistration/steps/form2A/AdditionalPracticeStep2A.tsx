import { MapPin, Plus, Trash2, Upload } from "lucide-react";
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

const AdditionalPracticeStep2A = ({ formData, updateFormData }: Props) => {
  const addPracticeState = () => {
    const newState: Form2APracticeState = {
      state: '', district: '', institutionName: '', address: '', proofDocument: null
    };
    updateFormData("additionalPracticeStates", [...formData.additionalPracticeStates, newState]);
  };

  const updatePracticeState = (index: number, field: keyof Form2APracticeState, value: string | File | null) => {
    const updated = [...formData.additionalPracticeStates];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData("additionalPracticeStates", updated);
  };

  const removePracticeState = (index: number) => {
    updateFormData("additionalPracticeStates", formData.additionalPracticeStates.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">

      {formData.additionalPracticeStates.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-border">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No additional practice locations added</p>
          <Button type="button" variant="outline" onClick={addPracticeState} className="gap-2">
            <Plus className="w-4 h-4" /> Add Practice Location
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.additionalPracticeStates.map((ps, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-6 border border-border space-y-4 relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm text-primary">Practice Location {index + 1}</h4>
                <Button type="button" variant="ghost" size="icon" onClick={() => removePracticeState(index)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>I. State <span className="text-destructive">*</span></Label>
                  <Select value={ps.state} onValueChange={(v) => updatePracticeState(index, 'state', v)}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent className="max-h-60 bg-white">{indianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>II. District <span className="text-destructive">*</span></Label>
                  <Input placeholder="District" value={ps.district} onChange={(e) => updatePracticeState(index, 'district', e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>III. Name of Institution/Hospital/Clinic/Laboratory <span className="text-destructive">*</span></Label>
                  <Input placeholder="Institution Name" value={ps.institutionName} onChange={(e) => updatePracticeState(index, 'institutionName', e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>IV. Address <span className="text-destructive">*</span></Label>
                  <Input placeholder="Full Address" value={ps.address} onChange={(e) => updatePracticeState(index, 'address', e.target.value)} className="h-11" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>V. Supporting Document-1 (Upload)</Label>
                  <div className="relative">
                    <div className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-all ${ps.proofDocument ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm">{ps.proofDocument ? ps.proofDocument.name : "Click to Upload Document"}</span>
                    </div>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { const f = e.target.files?.[0]; if (f) updatePracticeState(index, 'proofDocument', f); }} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addPracticeState} className="w-full gap-2">
            <Plus className="w-4 h-4" /> Add Another Location
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdditionalPracticeStep2A;
