import { MapPin, Plus, Trash2, Upload, Target, Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form2AData, Form2APracticeState, Form2APreviousPermission, purposeOfRegistrationOptions } from "../../types/form2A";
import { indianStates } from "../../index";

interface Props {
  formData: Form2AData;
  updateFormData: <K extends keyof Form2AData>(field: K, value: Form2AData[K]) => void;
}

const PurposeRegistrationStep2A = ({ formData, updateFormData }: Props) => {
  // Handle purpose checkbox changes
  const handlePurposeChange = (value: string, checked: boolean) => {
    if (checked) {
      updateFormData("purposeOfRegistration", [...formData.purposeOfRegistration, value]);
    } else {
      updateFormData("purposeOfRegistration", formData.purposeOfRegistration.filter(p => p !== value));
    }
  };

  // Practice State management
  const updatePracticeState = (index: number, field: keyof Form2APracticeState, value: string | File | null) => {
    const updated = [...formData.practiceStates];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData("practiceStates", updated);
  };

  const handlePracticeStateFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updatePracticeState(index, 'proofDocument', file);
    }
  };

  // Previous Permissions management
  const addPreviousPermission = () => {
    const newPermission: Form2APreviousPermission = {
      id: Date.now().toString(),
      countryName: '',
      regulatoryBody: '',
      licenseNumber: '',
      certificate: null
    };
    updateFormData("previousPermissions", [...formData.previousPermissions, newPermission]);
  };

  const updatePreviousPermission = (index: number, field: keyof Form2APreviousPermission, value: string | File | null) => {
    const updated = [...formData.previousPermissions];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData("previousPermissions", updated);
  };

  const removePreviousPermission = (index: number) => {
    const updated = formData.previousPermissions.filter((_, i) => i !== index);
    updateFormData("previousPermissions", updated);
  };

  const handlePermissionFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updatePreviousPermission(index, 'certificate', file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Purpose of Registration & Practice Location
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Specify the purpose of your registration and where you intend to practice in India.
        </p>
      </div>

      {/* Purpose of Registration */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-foreground flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Purpose of Registration <span className="text-destructive">*</span>
        </Label>
        <div className="bg-slate-50 rounded-xl p-6 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {purposeOfRegistrationOptions.map((option) => (
              <div key={option.value} className="flex items-start space-x-3">
                <Checkbox
                  id={`purpose-${option.value}`}
                  checked={formData.purposeOfRegistration.includes(option.value)}
                  onCheckedChange={(checked) => handlePurposeChange(option.value, checked as boolean)}
                />
                <Label
                  htmlFor={`purpose-${option.value}`}
                  className="text-sm text-foreground cursor-pointer leading-tight"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Duration & Dates */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-foreground">
          Duration of Stay in India <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="durationOfStayIndia" className="text-sm text-muted-foreground">Duration (in months/days)</Label>
            <Input
              id="durationOfStayIndia"
              placeholder="e.g., 12 months"
              value={formData.durationOfStayIndia}
              onChange={(e) => updateFormData("durationOfStayIndia", e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedStartDate" className="text-sm text-muted-foreground">Expected Start Date</Label>
            <Input
              id="expectedStartDate"
              type="date"
              value={formData.expectedStartDate}
              onChange={(e) => updateFormData("expectedStartDate", e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedEndDate" className="text-sm text-muted-foreground">Expected End Date</Label>
            <Input
              id="expectedEndDate"
              type="date"
              value={formData.expectedEndDate}
              onChange={(e) => updateFormData("expectedEndDate", e.target.value)}
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Practice Location in India */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-primary" />
          <Label className="text-base font-semibold text-foreground">
            Practice Location in India <span className="text-destructive">*</span>
          </Label>
        </div>

        {formData.practiceStates.map((ps, index) => (
          <div key={index} className="bg-slate-50 rounded-xl p-6 border border-border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  District <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="District name"
                  value={ps.district}
                  onChange={(e) => updatePracticeState(index, 'district', e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Name of Institution/Hospital/Clinic/Laboratory etc <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Institution name"
                  value={ps.institutionName}
                  onChange={(e) => updatePracticeState(index, 'institutionName', e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Full address"
                  value={ps.address}
                  onChange={(e) => updatePracticeState(index, 'address', e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Supporting Document (Invitation Letter/Admission letter/Appointment Letter etc.) <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-all ${
                      ps.proofDocument ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">
                      {ps.proofDocument ? ps.proofDocument.name : "Upload supporting document"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handlePracticeStateFileChange(index, e)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Previous Permissions Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-primary" />
          <Label className="text-base font-semibold text-foreground">
            Countries where you have already received similar Permission/License
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Please list any countries where you have received similar permission or license to practice.
        </p>

        {formData.previousPermissions.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-border">
            <Globe className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm mb-3">No previous permissions added</p>
            <Button type="button" variant="outline" onClick={addPreviousPermission}>
              <Plus className="w-4 h-4 mr-2" />
              Add Previous Permission
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.previousPermissions.map((permission, index) => (
              <div key={permission.id} className="bg-slate-50 rounded-xl p-6 border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">Permission {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePreviousPermission(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Country Name</Label>
                    <Input
                      placeholder="Country"
                      value={permission.countryName}
                      onChange={(e) => updatePreviousPermission(index, 'countryName', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Name of Regulatory Body</Label>
                    <Input
                      placeholder="Regulatory body"
                      value={permission.regulatoryBody}
                      onChange={(e) => updatePreviousPermission(index, 'regulatoryBody', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">License Number</Label>
                    <Input
                      placeholder="License number"
                      value={permission.licenseNumber}
                      onChange={(e) => updatePreviousPermission(index, 'licenseNumber', e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <Label className="text-sm text-muted-foreground">Upload Certificate</Label>
                    <div className="relative">
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-all ${
                          permission.certificate ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground truncate">
                          {permission.certificate ? permission.certificate.name : "Upload certificate"}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handlePermissionFileChange(index, e)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addPreviousPermission}
              className="w-full border-dashed border-2 h-12"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Permission
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurposeRegistrationStep2A;
