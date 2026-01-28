import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Upload, Globe, FileCheck, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Form2AData, Form2AAddressFields } from "../../types/form2A";

interface Props {
  formData: Form2AData;
  updateFormData: <K extends keyof Form2AData>(field: K, value: Form2AData[K]) => void;
}

const PersonalInfoStep2A = ({ formData, updateFormData }: Props) => {
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

  const handleDifferentlyAbledCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData("differentlyAbledCertificate", file);
    }
  };

  const updatePermanentAddress = (field: keyof Form2AAddressFields, value: string) => {
    updateFormData("permanentAddress", {
      ...formData.permanentAddress,
      [field]: value
    });
  };

  const updateCorrespondenceAddress = (field: keyof Form2AAddressFields, value: string) => {
    updateFormData("correspondenceAddress", {
      ...formData.correspondenceAddress,
      [field]: value
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">Personal Details</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Please provide your personal information for temporary registration.
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
                updateFormData("differentlyAbledCertificate", null);
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
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-all ${formData.differentlyAbledCertificate
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                      }`}
                  >
                    {formData.differentlyAbledCertificate ? (
                      <FileCheck className="w-5 h-5 text-primary" />
                    ) : (
                      <Upload className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground truncate">
                      {formData.differentlyAbledCertificate
                        ? formData.differentlyAbledCertificate.name
                        : "Upload certificate (PDF, JPG, PNG)"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDifferentlyAbledCertificateChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

      {/* Parent Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fatherName">
            Father's Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fatherName"
            placeholder="Father's full name"
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
            placeholder="Mother's full name"
            value={formData.motherName}
            onChange={(e) => updateFormData("motherName", e.target.value)}
            className="h-11"
          />
        </div>
      </div>

      {/* Nationality */}
      <div className="space-y-2">
        <Label htmlFor="nationality" className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Nationality <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nationality"
          placeholder="e.g., United States, United Kingdom"
          value={formData.nationality}
          onChange={(e) => updateFormData("nationality", e.target.value)}
          className="h-11"
        />
      </div>

      {/* Permanent Address */}
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
            <Label htmlFor="perm-pincode" className="text-sm text-muted-foreground">Postal/Zip Code</Label>
            <Input
              id="perm-pincode"
              placeholder="Postal Code"
              value={formData.permanentAddress.pincode}
              onChange={(e) => updatePermanentAddress("pincode", e.target.value)}
              className="h-11"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="perm-country" className="text-sm text-muted-foreground">Country</Label>
            <Input
              id="perm-country"
              placeholder="Country"
              value={formData.permanentAddress.country}
              onChange={(e) => updatePermanentAddress("country", e.target.value)}
              className="h-11"
            />
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
          Correspondence Address (if different from Permanent Address)
        </Label>
      </div>

      {/* Correspondence Address */}
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
                <Label htmlFor="corr-pincode" className="text-sm text-muted-foreground">Postal/Zip Code</Label>
                <Input
                  id="corr-pincode"
                  placeholder="Postal Code"
                  value={formData.correspondenceAddress.pincode}
                  onChange={(e) => updateCorrespondenceAddress("pincode", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="corr-country" className="text-sm text-muted-foreground">Country</Label>
                <Input
                  id="corr-country"
                  placeholder="Country"
                  value={formData.correspondenceAddress.country}
                  onChange={(e) => updateCorrespondenceAddress("country", e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalInfoStep2A;
