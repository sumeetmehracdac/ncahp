import { Target, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form2BData, Form2BPurposeOfRegistration, Form2BPreviousPermission } from "../../types/form2B";
import { indianStates } from "../../index";

interface Props {
  formData: Form2BData;
  updateFormData: <K extends keyof Form2BData>(field: K, value: Form2BData[K]) => void;
}

const purposeOptions = [
  { key: 'higherStudies', label: 'Higher Studies / Academic Bridging (e.g., PG (degree/diploma), Fellowship, Research Work)' },
  { key: 'workshopTraining', label: 'Workshop/Training' },
  { key: 'teaching', label: 'Teaching' },
  { key: 'observership', label: 'Observership' },
  { key: 'clinicalWork', label: 'Clinical Work' },
  { key: 'communityHealthcare', label: 'Community Healthcare work' },
] as const;

const PurposeRegistrationStep2B = ({ formData, updateFormData }: Props) => {
  const purpose = formData.purposeOfRegistration;

  const updatePurpose = <K extends keyof Form2BPurposeOfRegistration>(field: K, value: Form2BPurposeOfRegistration[K]) => {
    updateFormData("purposeOfRegistration", { ...purpose, [field]: value });
  };

  const addPreviousPermission = () => {
    const newPermission: Form2BPreviousPermission = {
      id: Date.now().toString(),
      country: '',
      regulatoryBody: '',
      licenseNumber: '',
      certificate: null
    };
    updatePurpose("previousPermissions", [...purpose.previousPermissions, newPermission]);
  };

  const removePreviousPermission = (id: string) => {
    updatePurpose("previousPermissions", purpose.previousPermissions.filter(p => p.id !== id));
  };

  const updatePreviousPermission = (id: string, field: keyof Form2BPreviousPermission, value: string | File | null) => {
    const updated = purpose.previousPermissions.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    );
    updatePurpose("previousPermissions", updated);
  };

  return (
    <div className="space-y-8">
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">Purpose of Registration</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Select the purpose and provide details for your registration.</p>
      </div>

      {/* Purpose Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Purpose of Registration (any one) <span className="text-destructive">*</span></Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {purposeOptions.map((option) => (
            <div
              key={option.key}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                purpose[option.key] ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => updatePurpose(option.key, !purpose[option.key])}
            >
              <Checkbox
                checked={purpose[option.key]}
                onCheckedChange={(checked) => updatePurpose(option.key, checked as boolean)}
                className="mt-0.5"
              />
              <Label className="cursor-pointer text-sm font-medium leading-relaxed">{option.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Duration and Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Duration of stay in India (in months/days) <span className="text-destructive">*</span></Label>
          <Input
            placeholder="e.g., 6 months"
            value={purpose.durationOfStay}
            onChange={(e) => updatePurpose("durationOfStay", e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label>Expected start date <span className="text-destructive">*</span></Label>
          <Input
            type="date"
            value={purpose.expectedStartDate}
            onChange={(e) => updatePurpose("expectedStartDate", e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label>Expected End date <span className="text-destructive">*</span></Label>
          <Input
            type="date"
            value={purpose.expectedEndDate}
            onChange={(e) => updatePurpose("expectedEndDate", e.target.value)}
            className="h-11"
          />
        </div>
      </div>

      {/* Practice Location */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Practice Location Details</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>State <span className="text-destructive">*</span></Label>
            <Select value={purpose.practiceState} onValueChange={(value) => updatePurpose("practiceState", value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-white">
                {indianStates.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>District <span className="text-destructive">*</span></Label>
            <Input
              placeholder="District name"
              value={purpose.practiceDistrict}
              onChange={(e) => updatePurpose("practiceDistrict", e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Name of Institution/Hospital/Clinic/Laboratory etc <span className="text-destructive">*</span></Label>
            <Input
              placeholder="Institution name"
              value={purpose.institutionName}
              onChange={(e) => updatePurpose("institutionName", e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Address <span className="text-destructive">*</span></Label>
            <Input
              placeholder="Full address"
              value={purpose.institutionAddress}
              onChange={(e) => updatePurpose("institutionAddress", e.target.value)}
              className="h-11"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Supporting Document-1 (Upload)</Label>
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => updatePurpose("supportingDocument", e.target.files?.[0] || null)}
            className="h-11"
          />
        </div>
      </div>

      {/* Previous Permissions Table */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Please list the Countries in which you had already received similar Permission/License:</Label>
        
        {purpose.previousPermissions.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground mb-4">No previous permissions added</p>
            <Button type="button" variant="outline" onClick={addPreviousPermission} className="gap-2">
              <Plus className="w-4 h-4" /> Add Permission
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
              <div className="col-span-3">Country</div>
              <div className="col-span-3">Name of Regulatory Body</div>
              <div className="col-span-2">License Number</div>
              <div className="col-span-3">Upload Certificate</div>
              <div className="col-span-1"></div>
            </div>
            
            {purpose.previousPermissions.map((permission, index) => (
              <div key={permission.id} className="p-4 border border-border rounded-xl space-y-3 md:space-y-0 md:grid md:grid-cols-12 md:gap-2 md:items-center">
                <div className="md:col-span-3">
                  <Label className="md:hidden text-xs text-muted-foreground mb-1">Country</Label>
                  <Input
                    placeholder="Country"
                    value={permission.country}
                    onChange={(e) => updatePreviousPermission(permission.id, 'country', e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="md:col-span-3">
                  <Label className="md:hidden text-xs text-muted-foreground mb-1">Regulatory Body</Label>
                  <Input
                    placeholder="Regulatory Body"
                    value={permission.regulatoryBody}
                    onChange={(e) => updatePreviousPermission(permission.id, 'regulatoryBody', e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="md:hidden text-xs text-muted-foreground mb-1">License Number</Label>
                  <Input
                    placeholder="License #"
                    value={permission.licenseNumber}
                    onChange={(e) => updatePreviousPermission(permission.id, 'licenseNumber', e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="md:col-span-3">
                  <Label className="md:hidden text-xs text-muted-foreground mb-1">Certificate</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => updatePreviousPermission(permission.id, 'certificate', e.target.files?.[0] || null)}
                    className="h-10 text-sm"
                  />
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePreviousPermission(permission.id)}
                    className="text-destructive hover:text-destructive h-10 w-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={addPreviousPermission} className="w-full gap-2">
              <Plus className="w-4 h-4" /> Add Another Permission
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurposeRegistrationStep2B;
