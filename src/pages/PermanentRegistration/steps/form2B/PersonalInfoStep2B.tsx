import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
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

  return (
    <div className="space-y-8">
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">Personal Details</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Indian national with foreign qualification registration.</p>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>First Name <span className="text-destructive">*</span></Label>
          <Input placeholder="First Name" value={formData.firstName} onChange={(e) => updateFormData("firstName", e.target.value)} className="h-11 bg-muted" disabled />
        </div>
        <div className="space-y-2">
          <Label>Middle Name</Label>
          <Input placeholder="Middle Name" value={formData.middleName} onChange={(e) => updateFormData("middleName", e.target.value)} className="h-11 bg-muted" disabled />
        </div>
        <div className="space-y-2">
          <Label>Last Name <span className="text-destructive">*</span></Label>
          <Input placeholder="Last Name" value={formData.lastName} onChange={(e) => updateFormData("lastName", e.target.value)} className="h-11 bg-muted" disabled />
        </div>
      </div>

      {/* Gender, Age & DOB */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Gender <span className="text-destructive">*</span></Label>
          <RadioGroup value={formData.gender} onValueChange={(value) => updateFormData("gender", value)} className="flex gap-4" disabled>
            {["Male", "Female", "Other"].map((g) => (
              <Label key={g} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-not-allowed transition-all ${formData.gender === g ? "border-primary bg-primary/5" : "border-border bg-muted opacity-50"}`}>
                <RadioGroupItem value={g} />
                <span className="text-sm font-medium">{g}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label>Age <span className="text-destructive">*</span></Label>
          <Input type="number" value={formData.age} onChange={(e) => updateFormData("age", e.target.value)} className="h-11 bg-muted" disabled />
        </div>
        <div className="space-y-2">
          <Label>Date of Birth <span className="text-destructive">*</span></Label>
          <Input type="date" value={formData.dateOfBirth} onChange={(e) => updateFormData("dateOfBirth", e.target.value)} className="h-11 bg-muted" disabled />
        </div>
      </div>

      {/* Contact & Photo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Email <span className="text-destructive">*</span></Label>
          <Input type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} className="h-11 bg-muted" disabled />
        </div>
        <div className="space-y-2">
          <Label>Phone Number <span className="text-destructive">*</span></Label>
          <Input placeholder="+91 98765 43210" value={formData.phoneNumber} onChange={(e) => updateFormData("phoneNumber", e.target.value)} className="h-11 bg-muted" disabled />
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
      <div className="space-y-4">
        <Label className="text-base font-semibold">Is differently abled? <span className="text-destructive">*</span></Label>
        <RadioGroup
          value={formData.isDifferentlyAbled ? "yes" : "no"}
          onValueChange={(value) => updateFormData("isDifferentlyAbled", value === "yes")}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="diff-yes" />
            <Label htmlFor="diff-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="diff-no" />
            <Label htmlFor="diff-no">No</Label>
          </div>
        </RadioGroup>

        <AnimatePresence>
          {formData.isDifferentlyAbled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Label>Upload Certificate <span className="text-destructive">*</span></Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDifferentlyAbledProofChange}
                  className="h-11"
                />
                {formData.documents.differentlyAbledProof && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Uploaded
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

      {/* State of Residence */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">State of Residence <span className="text-destructive">*</span></Label>
        <Select value={formData.stateOfResidence} onValueChange={(value) => updateFormData("stateOfResidence", value)}>
          <SelectTrigger className="h-11"><SelectValue placeholder="Select state" /></SelectTrigger>
          <SelectContent className="max-h-60 bg-white">{indianStates.map((state) => <SelectItem key={state} value={state}>{state}</SelectItem>)}</SelectContent>
        </Select>
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800"><strong>Note:</strong> Your application will be submitted to the respective State Council of the state selected above.</p>
        </div>
      </div>
    </div >
  );
};

export default PersonalInfoStep2B;
