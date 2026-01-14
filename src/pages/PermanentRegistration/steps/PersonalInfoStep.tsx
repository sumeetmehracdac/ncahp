import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, MapPin, AlertTriangle, Upload, Calendar, Info, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FormData, indianStates, AddressFields } from "../index";

interface Props {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const PersonalInfoStep = ({ formData, updateFormData }: Props) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation helpers
  const validatePincode = (pincode: string) => {
    if (!pincode) return null; // Not filled yet
    if (!/^\d{6}$/.test(pincode)) return 'Pincode must be 6 digits';
    return null;
  };

  const getFieldError = (field: string, value: string, required: boolean = false) => {
    if (!touched[field]) return null;
    if (required && !value) return 'This field is required';
    if (field.includes('pincode')) return validatePincode(value);
    return null;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData("photo", file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleStateProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData("differentStateProof", file);
    }
  };

  const updatePermanentAddress = (field: keyof AddressFields, value: string) => {
    updateFormData("permanentAddress", {
      ...formData.permanentAddress,
      [field]: value
    });
  };

  const updateCorrespondenceAddress = (field: keyof AddressFields, value: string) => {
    updateFormData("correspondenceAddress", {
      ...formData.correspondenceAddress,
      [field]: value
    });
  };

  const isDifferentState = formData.stateOfResidence !== formData.stateFromAadhaar && formData.stateOfResidence !== "";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">Personal Information</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Review your pre-filled information and complete the remaining fields.
        </p>
      </div>

      {/* Pre-filled Fields (Read-only) */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Pre-filled from your account registration</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Full Name", value: formData.name },
            { label: "Gender", value: formData.gender },
            { label: "Age", value: `${formData.age} years` },
            {
              label: "Date of Birth",
              value: new Date(formData.dateOfBirth).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            },
            { label: "Email", value: formData.email },
            { label: "Mobile", value: formData.mobile },
          ].map((field) => (
            <div key={field.label} className="bg-white rounded-lg p-3 border border-border">
              <span className="text-xs text-muted-foreground">{field.label}</span>
              <p className="font-medium text-foreground truncate">{field.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Upload */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-foreground">
          Passport Photo <span className="text-destructive">*</span>
        </Label>
        <div className="flex items-start gap-6">
          <div className="relative group">
            <div
              className={`w-32 h-40 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${photoPreview ? "border-primary bg-primary/5" : "border-border bg-muted hover:border-primary/50"
                }`}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-2">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <span className="text-xs text-muted-foreground">Upload Photo</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Recent passport-size photograph</p>
            <p>• White background preferred</p>
            <p>• Max file size: 2MB</p>
            <p>• Formats: JPG, PNG</p>
          </div>
        </div>
      </div>

      {/* Additional Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="placeOfBirth">
            Place of Birth <span className="text-destructive">*</span>
          </Label>
          <Input
            id="placeOfBirth"
            placeholder="City, State"
            value={formData.placeOfBirth}
            onChange={(e) => updateFormData("placeOfBirth", e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fatherName">
            Father's Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fatherName"
            placeholder="Enter father's full name"
            value={formData.fatherName}
            onChange={(e) => updateFormData("fatherName", e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="motherName">
            Mother's Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="motherName"
            placeholder="Enter mother's full name"
            value={formData.motherName}
            onChange={(e) => updateFormData("motherName", e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="presentOccupation">Present Occupation</Label>
          <Input
            id="presentOccupation"
            placeholder="e.g., Medical Lab Technologist"
            value={formData.presentOccupation}
            onChange={(e) => updateFormData("presentOccupation", e.target.value)}
            className="h-11"
          />
        </div>
      </div>

      {/* Citizenship */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-foreground">
          Are you a Citizen of India? <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={formData.citizenshipType}
          onValueChange={(value) => updateFormData("citizenshipType", value as "birth" | "domicile")}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Label
            htmlFor="birth"
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.citizenshipType === "birth"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
              }`}
          >
            <RadioGroupItem value="birth" id="birth" />
            <div>
              <span className="font-medium text-foreground">By Birth</span>
              <p className="text-sm text-muted-foreground">Born in India</p>
            </div>
          </Label>
          <Label
            htmlFor="domicile"
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.citizenshipType === "domicile"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
              }`}
          >
            <RadioGroupItem value="domicile" id="domicile" />
            <div>
              <span className="font-medium text-foreground">By Domicile</span>
              <p className="text-sm text-muted-foreground">Acquired citizenship</p>
            </div>
          </Label>
        </RadioGroup>

        <AnimatePresence>
          {formData.citizenshipType === "domicile" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Label htmlFor="domicileDate">
                Date of acquiring Indian Citizenship <span className="text-destructive">*</span>
              </Label>
              <Input
                id="domicileDate"
                type="date"
                value={formData.domicileDate}
                onChange={(e) => updateFormData("domicileDate", e.target.value)}
                className="h-11 max-w-xs"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Permanent Address Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold text-foreground">
            Permanent Address <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="perm-address1" className="text-sm text-muted-foreground">Address Line 1</Label>
              <Input
                id="perm-address1"
                placeholder="House/Flat No., Building Name, Street"
                value={formData.permanentAddress.addressLine1}
                onChange={(e) => updatePermanentAddress("addressLine1", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="perm-address2" className="text-sm text-muted-foreground">Address Line 2</Label>
              <Input
                id="perm-address2"
                placeholder="Area, Locality, Landmark (Optional)"
                value={formData.permanentAddress.addressLine2}
                onChange={(e) => updatePermanentAddress("addressLine2", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perm-city" className="text-sm text-muted-foreground">City</Label>
              <Input
                id="perm-city"
                placeholder="City"
                value={formData.permanentAddress.city}
                onChange={(e) => updatePermanentAddress("city", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perm-pincode" className="text-sm text-muted-foreground">Pincode</Label>
              <Input
                id="perm-pincode"
                placeholder="6-digit Pincode"
                value={formData.permanentAddress.pincode}
                onChange={(e) => {
                  // Only allow digits
                  const value = e.target.value.replace(/\D/g, '');
                  updatePermanentAddress("pincode", value);
                }}
                onBlur={() => setTouched(prev => ({ ...prev, 'perm-pincode': true }))}
                className={`h-11 ${getFieldError('perm-pincode', formData.permanentAddress.pincode) ? 'border-destructive focus:ring-destructive/50' : ''}`}
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                aria-describedby="perm-pincode-error"
              />
              {getFieldError('perm-pincode', formData.permanentAddress.pincode) && (
                <p id="perm-pincode-error" className="text-xs text-destructive">{getFieldError('perm-pincode', formData.permanentAddress.pincode)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="perm-district" className="text-sm text-muted-foreground">District</Label>
              <Input
                id="perm-district"
                placeholder="District"
                value={formData.permanentAddress.district}
                onChange={(e) => updatePermanentAddress("district", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perm-state" className="text-sm text-muted-foreground">State</Label>
              <Select
                value={formData.permanentAddress.state}
                onValueChange={(value) => updatePermanentAddress("state", value)}
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
          </div>
        </div>

        {/* Correspondence Address Checkbox */}
        <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-border">
          <Checkbox
            id="correspondenceAddressDifferent"
            checked={formData.correspondenceAddressDifferent}
            onCheckedChange={(checked) => updateFormData("correspondenceAddressDifferent", checked as boolean)}
          />
          <Label htmlFor="correspondenceAddressDifferent" className="cursor-pointer text-sm font-medium text-foreground">
            Correspondence address different from permanent address?
          </Label>
        </div>

        {/* Correspondence Address Section */}
        <AnimatePresence>
          {formData.correspondenceAddressDifferent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <Label className="text-base font-semibold text-foreground">
                Correspondence Address
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="corr-address1" className="text-sm text-muted-foreground">Address Line 1</Label>
                  <Input
                    id="corr-address1"
                    placeholder="House/Flat No., Building Name, Street"
                    value={formData.correspondenceAddress.addressLine1}
                    onChange={(e) => updateCorrespondenceAddress("addressLine1", e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="corr-address2" className="text-sm text-muted-foreground">Address Line 2</Label>
                  <Input
                    id="corr-address2"
                    placeholder="Area, Locality, Landmark (Optional)"
                    value={formData.correspondenceAddress.addressLine2}
                    onChange={(e) => updateCorrespondenceAddress("addressLine2", e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="corr-city" className="text-sm text-muted-foreground">City</Label>
                  <Input
                    id="corr-city"
                    placeholder="City"
                    value={formData.correspondenceAddress.city}
                    onChange={(e) => updateCorrespondenceAddress("city", e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="corr-pincode" className="text-sm text-muted-foreground">Pincode</Label>
                  <Input
                    id="corr-pincode"
                    placeholder="6-digit Pincode"
                    value={formData.correspondenceAddress.pincode}
                    onChange={(e) => updateCorrespondenceAddress("pincode", e.target.value)}
                    className="h-11"
                    maxLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="corr-district" className="text-sm text-muted-foreground">District</Label>
                  <Input
                    id="corr-district"
                    placeholder="District"
                    value={formData.correspondenceAddress.district}
                    onChange={(e) => updateCorrespondenceAddress("district", e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="corr-state" className="text-sm text-muted-foreground">State</Label>
                  <Select
                    value={formData.correspondenceAddress.state}
                    onValueChange={(value) => updateCorrespondenceAddress("state", value)}
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* State of Residence */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-base font-semibold text-foreground">
            State of Residence (as per Aadhaar) <span className="text-destructive">*</span>
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-white">
              <p>
                Default from your Aadhaar: <strong>{formData.stateFromAadhaar}</strong>
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm text-blue-800">
              State from Aadhaar: <strong>{formData.stateFromAadhaar}</strong>
            </span>
          </div>
          {formData.stateOfResidence === formData.stateFromAadhaar && (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          )}
        </div>

        <Select value={formData.stateOfResidence} onValueChange={(value) => updateFormData("stateOfResidence", value)}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select state of residence (as per Aadhaar)" />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-white">
            {indianStates.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
                {state === formData.stateFromAadhaar && (
                  <span className="ml-2 text-xs text-primary">(from Aadhaar)</span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Different State Warning & Upload */}
        <AnimatePresence>
          {isDifferentState && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800 mb-1">State differs from Aadhaar</p>
                    <p className="text-sm text-amber-700">
                      Your application will be submitted to the <strong>{formData.stateOfResidence}</strong> State
                      Council for processing. Please upload a valid proof of residence for this state.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Proof of Residence <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleStateProofChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 border-dashed transition-all ${formData.differentStateProof
                      ? "border-green-500 bg-green-50"
                      : "border-border hover:border-primary/50"
                      }`}
                  >
                    {formData.differentStateProof ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">{formData.differentStateProof.name}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <span className="text-muted-foreground">Upload proof of residence (PDF, JPG, PNG)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PersonalInfoStep;