import { MapPin, Plus, Trash2, Upload, Building, CheckSquare, Globe, Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form2AData, Form2APracticeState, Form2APreviousPermission, purposeOfRegistrationOptions } from "../../types/form2A";
import { indianStates } from "../../index";

interface Props {
  formData: Form2AData;
  updateFormData: <K extends keyof Form2AData>(field: K, value: Form2AData[K]) => void;
}

const PracticeStateStep2A = ({ formData, updateFormData }: Props) => {
  // Practice State Handlers
  const addPracticeState = () => {
    const newState: Form2APracticeState = {
      institutionName: '',
      address: '',
      state: '',
      district: '',
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

  const handlePracticeFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updatePracticeState(index, 'proofDocument', file);
    }
  };

  // Previous Permission Handlers
  const addPreviousPermission = () => {
    const newPermission: Form2APreviousPermission = {
      id: Date.now().toString(),
      countryName: '',
      regulatoryBody: '',
      licenseNumber: '',
      dateOfInitialRegistration: '',
      dateOfExpiry: '',
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

  // Ensure at least one practice state exists
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
          Practice Details & History
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Provide details about your purpose, intended practice location in India, and previous registrations.
        </p>
      </div>

      {/* I. Purpose of Registration */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckSquare className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">I. Purpose of Registration</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-border">
          {purposeOfRegistrationOptions.map((option) => (
            <div key={option.value} className="flex items-start space-x-3 p-2">
              <Checkbox
                id={`purpose-${option.value}`}
                checked={formData.purposeOfRegistration.includes(option.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFormData("purposeOfRegistration", [...formData.purposeOfRegistration, option.value]);
                  } else {
                    updateFormData("purposeOfRegistration", formData.purposeOfRegistration.filter(v => v !== option.value));
                  }
                }}
              />
              <Label
                htmlFor={`purpose-${option.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer pt-0.5"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* State of Residence in India */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">State of Residence in India</h3>
        </div>
        <p className="text-sm text-muted-foreground -mt-2 mb-2">
          State of residence in India will be considered as state of registration
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-slate-50 rounded-xl border border-border">
          <div className="space-y-2">
            <Label>State <span className="text-destructive">*</span></Label>
            <Select
              value={formData.stateOfResidenceIndia}
              onValueChange={(value) => updateFormData("stateOfResidenceIndia", value)}
            >
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
              placeholder="District"
              value={formData.districtOfResidenceIndia}
              onChange={(e) => updateFormData("districtOfResidenceIndia", e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Address (optional)</Label>
            <Input
              placeholder="Address"
              value={formData.addressOfResidenceIndia}
              onChange={(e) => updateFormData("addressOfResidenceIndia", e.target.value)}
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* II, III, IV. Duration & Dates */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Duration & Dates</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-slate-50 rounded-xl border border-border">
          <div className="space-y-2">
            <Label>II. Duration of stay in India (in months/days)</Label>
            <Input
              placeholder="e.g., 6 months"
              value={formData.durationOfStayIndia}
              onChange={(e) => updateFormData("durationOfStayIndia", e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>III. Expected Start Date</Label>
            <Input
              type="date"
              value={formData.expectedStartDate}
              onChange={(e) => updateFormData("expectedStartDate", e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>IV. Expected End Date</Label>
            <Input
              type="date"
              value={formData.expectedEndDate}
              onChange={(e) => updateFormData("expectedEndDate", e.target.value)}
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* V - IX. Practice Locations */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Practice Location(s)</h3>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPracticeState}
            className="gap-2"
          >
            <Plus className="w-4 h-4" /> Add Location
          </Button>
        </div>

        {formData.practiceStates.map((ps, index) => (
          <div key={index} className="bg-slate-50 rounded-xl p-6 border border-border space-y-4 relative">
            <div className="absolute top-4 right-4">
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePracticeState(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Practice Location {index + 1}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>V. State <span className="text-destructive">*</span></Label>
                <Select
                  value={ps.state}
                  onValueChange={(value) => updatePracticeState(index, 'state', value)}
                >
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
                <Label>VI. District <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="District"
                  value={ps.district}
                  onChange={(e) => updatePracticeState(index, 'district', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label>VII. Name of Institution/Hospital/Clinic/Laboratory <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="Institution Name"
                  value={ps.institutionName}
                  onChange={(e) => updatePracticeState(index, 'institutionName', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label>VIII. Address <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="Full Address"
                  value={ps.address}
                  onChange={(e) => updatePracticeState(index, 'address', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label>IX. Supporting Document-1 (Upload) <span className="text-destructive">*</span></Label>
                <p className="text-xs text-muted-foreground mb-2">
                  (Invitation Letter/Admission letter/ Appointment Letter etc.)
                </p>
                <div className="relative">
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-all ${ps.proofDocument ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                  >
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground font-medium">
                      {ps.proofDocument ? ps.proofDocument.name : "Click to Upload Document"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handlePracticeFileChange(index, e)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* X. Previous Permissions Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            I. Please list the Countries to which had already received similar Permission/ License?
          </h3>
        </div>

        <div className="border border-border rounded-xl overflow-hidden bg-slate-50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Country Name</th>
                  <th className="px-4 py-3 text-left font-medium">Name of Regulatory Body</th>
                  <th className="px-4 py-3 text-left font-medium">License Number</th>
                  <th className="px-4 py-3 text-left font-medium">Date of Initial Registration/License</th>
                  <th className="px-4 py-3 text-left font-medium">Date of Expiry of Registration/License</th>
                  <th className="px-4 py-3 text-left font-medium">Upload Certificate</th>
                  <th className="px-4 py-3 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {formData.previousPermissions.map((perm, index) => (
                  <tr key={index} className="bg-white">
                    <td className="p-3">
                      <Input
                        placeholder="Country"
                        value={perm.countryName}
                        onChange={(e) => updatePreviousPermission(index, 'countryName', e.target.value)}
                        className="h-10"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        placeholder="Reg. Body"
                        value={perm.regulatoryBody}
                        onChange={(e) => updatePreviousPermission(index, 'regulatoryBody', e.target.value)}
                        className="h-10"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        placeholder="License No."
                        value={perm.licenseNumber}
                        onChange={(e) => updatePreviousPermission(index, 'licenseNumber', e.target.value)}
                        className="h-10"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="date"
                        value={perm.dateOfInitialRegistration}
                        onChange={(e) => updatePreviousPermission(index, 'dateOfInitialRegistration', e.target.value)}
                        className="h-10"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="date"
                        value={perm.dateOfExpiry}
                        onChange={(e) => updatePreviousPermission(index, 'dateOfExpiry', e.target.value)}
                        className="h-10"
                      />
                    </td>
                    <td className="p-3">
                      <div className="relative">
                        <div className={`flex items-center gap-2 p-2 rounded border border-dashed ${perm.certificate ? 'bg-primary/5 border-primary' : 'bg-muted/50 border-input'}`}>
                          <Upload className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs truncate max-w-[150px]">
                            {perm.certificate ? perm.certificate.name : "Upload"}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handlePermissionFileChange(index, e)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePreviousPermission(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {formData.previousPermissions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No previous permissions added.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-slate-100 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPreviousPermission}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Previous Permission
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeStateStep2A;
