import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Upload, AlertCircle, CheckCircle2, FileCheck, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form2BData, Form2BAddressFields } from "../../types/form2B";
import { indianStates } from "../../index";

interface Props {
  formData: Form2BData;
  updateFormData: <K extends keyof Form2BData>(field: K, value: Form2BData[K]) => void;
}

const PersonalInfoStep2B = ({ formData, updateFormData }: Props) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDifferentState, setIsDifferentState] = useState(false);

  // Sample Aadhaar State (simulated from signup)
  const aadhaarState = formData.stateFromAadhaar || "Maharashtra";

  useEffect(() => {
    // Set default state of residence from Aadhaar if not already set
    if (!formData.stateOfResidence && aadhaarState) {
      updateFormData("stateOfResidence", aadhaarState);
    }
    // Initialize stateFromAadhaar if empty
    if (!formData.stateFromAadhaar) {
      updateFormData("stateFromAadhaar", "Maharashtra");
    }
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData("photo", file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updatePermanentAddress = (field: keyof Form2BAddressFields, value: string) => {
    updateFormData("permanentAddress", { ...formData.permanentAddress, [field]: value });
  };

  const updateCorrespondenceAddress = (field: keyof Form2BAddressFields, value: string) => {
    updateFormData("correspondenceAddress", { ...formData.correspondenceAddress, [field]: value });
  };

  const handleDifferentlyAbledProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData("documents", { ...formData.documents, differentlyAbledProof: file });
    }
  };

  const handleDifferentStateProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData("differentStateProof", file);
    }
  };

  const handleDifferentStateToggle = () => {
    if (isDifferentState) {
      // Resetting to Aadhaar state
      updateFormData("stateOfResidence", aadhaarState);
      updateFormData("differentStateProof", null);
    }
    setIsDifferentState(!isDifferentState);
  };

  return (
    <div className="space-y-8">

      {/* Pre-filled Fields (Read-only) */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Pre-filled from your account registration</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              label: "Full Name",
              value: [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(" ")
            },
            { label: "Gender", value: formData.gender },
            { label: "Age", value: `${formData.age} years` },
            {
              label: "Date of Birth",
              value: formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }) : ""
            },
            { label: "Email", value: formData.email },
            { label: "Mobile", value: formData.phoneNumber },
          ].map((field) => (
            <div key={field.label} className="bg-white rounded-lg p-3 border border-border">
              <p className="text-xs font-medium text-muted-foreground mb-1">{field.label}</p>
              <p className="font-medium text-foreground">{field.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Upload */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Passport Photo <span className="text-destructive">*</span></Label>
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className={`w-32 h-40 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${photoPreview ? "border-primary bg-primary/5" : "border-border bg-muted"}`}>
              {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : <Upload className="w-8 h-8 text-muted-foreground" />}
            </div>
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Place of Birth & Parents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Place of Birth <span className="text-destructive">*</span></Label>
          <Input placeholder="City, State" value={formData.placeOfBirth} onChange={(e) => updateFormData("placeOfBirth", e.target.value)} className="h-11" />
        </div>
        <div className="space-y-2">
          <Label>Father's Name <span className="text-destructive">*</span></Label>
          <Input placeholder="Father's name" value={formData.fatherName} onChange={(e) => updateFormData("fatherName", e.target.value)} className="h-11" />
        </div>
        <div className="space-y-2">
          <Label>Mother's Name <span className="text-destructive">*</span></Label>
          <Input placeholder="Mother's name" value={formData.motherName} onChange={(e) => updateFormData("motherName", e.target.value)} className="h-11" />
        </div>
      </div>

      {/* Differently Abled */}
      {/* Is Differently Abled */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-foreground">
          Is Differently Abled? <span className="text-destructive">*</span>
        </Label>
        <div className="bg-slate-50 rounded-xl p-6 border border-border space-y-4">
          <RadioGroup
            value={formData.isDifferentlyAbled ? "yes" : "no"}
            onValueChange={(value) => {
              updateFormData("isDifferentlyAbled", value === "yes");
              if (value === "no") {
                updateFormData("documents", { ...formData.documents, differentlyAbledProof: null });
              }
            }}
            className="flex gap-4"
          >
            <Label
              htmlFor="differently-abled-yes"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.isDifferentlyAbled
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
                }`}
            >
              <RadioGroupItem value="yes" id="differently-abled-yes" />
              <span className="text-sm font-medium">Yes</span>
            </Label>
            <Label
              htmlFor="differently-abled-no"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${!formData.isDifferentlyAbled
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
                }`}
            >
              <RadioGroupItem value="no" id="differently-abled-no" />
              <span className="text-sm font-medium">No</span>
            </Label>
          </RadioGroup>

          {/* Conditional Certificate Upload */}
          <AnimatePresence>
            {formData.isDifferentlyAbled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label className="text-sm text-muted-foreground">
                  Upload Disability Certificate <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-all ${formData.documents.differentlyAbledProof
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                      }`}
                  >
                    {formData.documents.differentlyAbledProof ? (
                      <FileCheck className="w-5 h-5 text-primary" />
                    ) : (
                      <Upload className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground truncate">
                      {formData.documents.differentlyAbledProof
                        ? formData.documents.differentlyAbledProof.name
                        : "Upload certificate (PDF, JPG, PNG)"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDifferentlyAbledProofChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Citizenship */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Are you a Citizen of India? <span className="text-destructive">*</span></Label>
        <RadioGroup value={formData.citizenshipType} onValueChange={(value) => updateFormData("citizenshipType", value as "birth" | "domicile")} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer ${formData.citizenshipType === "birth" ? "border-primary bg-primary/5" : "border-border"}`}>
            <RadioGroupItem value="birth" />
            <div><span className="font-medium">By Birth</span><p className="text-sm text-muted-foreground">Born in India</p></div>
          </Label>
          <Label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer ${formData.citizenshipType === "domicile" ? "border-primary bg-primary/5" : "border-border"}`}>
            <RadioGroupItem value="domicile" />
            <div><span className="font-medium">By Domicile</span><p className="text-sm text-muted-foreground">Acquired citizenship</p></div>
          </Label>
        </RadioGroup>
        <AnimatePresence>
          {formData.citizenshipType === "domicile" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <Label>Date of acquiring Indian Citizenship <span className="text-destructive">*</span></Label>
              <Input type="date" value={formData.domicileDate} onChange={(e) => updateFormData("domicileDate", e.target.value)} className="h-11 max-w-xs mt-2" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Permanent Address */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Permanent Address <span className="text-destructive">*</span></Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label className="text-sm text-muted-foreground">Address Line 1</Label>
            <Input placeholder="House/Flat No., Street" value={formData.permanentAddress.addressLine1} onChange={(e) => updatePermanentAddress("addressLine1", e.target.value)} className="h-11" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label className="text-sm text-muted-foreground">Address Line 2</Label>
            <Input placeholder="Area, Landmark" value={formData.permanentAddress.addressLine2} onChange={(e) => updatePermanentAddress("addressLine2", e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">City</Label>
            <Input value={formData.permanentAddress.city} onChange={(e) => updatePermanentAddress("city", e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Pincode</Label>
            <Input value={formData.permanentAddress.pincode} onChange={(e) => updatePermanentAddress("pincode", e.target.value)} className="h-11" maxLength={6} />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">District</Label>
            <Input value={formData.permanentAddress.district} onChange={(e) => updatePermanentAddress("district", e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">State</Label>
            <Select value={formData.permanentAddress.state} onValueChange={(value) => updatePermanentAddress("state", value)}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent className="max-h-60 bg-white">{indianStates.map((state) => <SelectItem key={state} value={state}>{state}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Correspondence Address Checkbox */}
      <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border">
        <Checkbox id="corrDiff" checked={formData.correspondenceAddressDifferent} onCheckedChange={(checked) => updateFormData("correspondenceAddressDifferent", checked as boolean)} />
        <Label htmlFor="corrDiff" className="cursor-pointer text-sm font-medium">Correspondence address different from permanent address?</Label>
      </div>

      {/* State of Residence with Aadhaar Logic */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">State of Residence <span className="text-destructive">*</span></Label>

        {!isDifferentState ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border">
              <Input value={aadhaarState} className="h-11 bg-muted flex-1" disabled />
              <span className="text-sm text-muted-foreground">(Default from Aadhaar)</span>
            </div>
            <button
              type="button"
              onClick={handleDifferentStateToggle}
              className="text-sm text-primary underline hover:text-primary/80 cursor-pointer"
            >
              Click here, if it is different from Aadhaar?
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 p-4 bg-slate-50 rounded-lg border"
          >
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Select Different State</Label>
              <button
                type="button"
                onClick={handleDifferentStateToggle}
                className="text-sm text-muted-foreground underline hover:text-foreground"
              >
                Reset to Aadhaar State
              </button>
            </div>
            <Select value={formData.stateOfResidence} onValueChange={(value) => updateFormData("stateOfResidence", value)}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent className="max-h-60 bg-white">{indianStates.map((state) => <SelectItem key={state} value={state}>{state}</SelectItem>)}</SelectContent>
            </Select>
            <div className="space-y-2">
              <Label className="text-sm">Upload Supporting Document <span className="text-destructive">*</span></Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDifferentStateProofChange}
                  className="h-11"
                />
                {formData.differentStateProof && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Uploaded
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Proof of residence in the selected state</p>
            </div>
          </motion.div>
        )}

        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800"><strong>Note:</strong> Your application will be submitted to the respective State Council of the state selected above.</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep2B;
