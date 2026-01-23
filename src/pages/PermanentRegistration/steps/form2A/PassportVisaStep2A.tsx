import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Plane, AlertCircle, Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form2AData, Form2APassportDetails, Form2AVisaDetails, Form2AEmergencyContact, Form2AContactPersonIndia } from "../../types/form2A";

interface Props {
  formData: Form2AData;
  updateFormData: <K extends keyof Form2AData>(field: K, value: Form2AData[K]) => void;
}

// Common visa types for India
const visaTypes = [
  'Tourist Visa',
  'Business Visa',
  'Medical Visa',
  'Student Visa',
  'Research Visa',
  'Employment Visa',
  'Conference Visa',
  'Entry Visa',
  'e-Visa',
  'Other'
];

const PassportVisaStep2A = ({ formData, updateFormData }: Props) => {
  // Local state for optional sections
  const [hasVisa, setHasVisa] = useState(formData.visaDetails.visaNumber !== '');

  const updatePassportDetails = (field: keyof Form2APassportDetails, value: string) => {
    updateFormData("passportDetails", {
      ...formData.passportDetails,
      [field]: value
    });
  };

  const updateVisaDetails = (field: keyof Form2AVisaDetails, value: string) => {
    updateFormData("visaDetails", {
      ...formData.visaDetails,
      [field]: value
    });
  };

  const updateEmergencyContact = (field: keyof Form2AEmergencyContact, value: string) => {
    updateFormData("emergencyContact", {
      ...formData.emergencyContact,
      [field]: value
    });
  };

  const updateContactPersonIndia = (field: keyof Form2AContactPersonIndia, value: string) => {
    updateFormData("contactPersonIndia", {
      ...formData.contactPersonIndia,
      [field]: value
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Screen-4: Passport & Visa Details
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Provide your travel document details and emergency contact information.
        </p>
      </div>

      {/* I. Passport Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">I. Passport Details</h3>
        </div>
        <div className="bg-slate-50 rounded-xl p-6 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passportNumber">
                Passport Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="passportNumber"
                placeholder="Passport Number"
                value={formData.passportDetails.passportNumber}
                onChange={(e) => updatePassportDetails("passportNumber", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuingCountry">
                Issuing Country <span className="text-destructive">*</span>
              </Label>
              <Input
                id="issuingCountry"
                placeholder="Issuing Country"
                value={formData.passportDetails.issuingCountry}
                onChange={(e) => updatePassportDetails("issuingCountry", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportIssueDate">
                Date of Issue <span className="text-destructive">*</span>
              </Label>
              <Input
                id="passportIssueDate"
                type="date"
                value={formData.passportDetails.issueDate}
                onChange={(e) => updatePassportDetails("issueDate", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportExpiry">
                Expiry Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="passportExpiry"
                type="date"
                value={formData.passportDetails.expiryDate}
                onChange={(e) => updatePassportDetails("expiryDate", e.target.value)}
                className="h-11"
              />
            </div>
          </div>
        </div>
      </div>

      {/* II. VISA Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Plane className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">II. VISA Details (if already holds)</h3>
        </div>
        <div className="bg-slate-50 rounded-xl p-6 border border-border space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Label className="text-sm font-medium">Do you already hold a valid Visa?</Label>
            <RadioGroup
              value={hasVisa ? "yes" : "no"}
              onValueChange={(val) => setHasVisa(val === "yes")}
              className="flex items-center gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="visa-yes" />
                <Label htmlFor="visa-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="visa-no" />
                <Label htmlFor="visa-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <AnimatePresence>
            {hasVisa && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="visaNumber">Visa Number</Label>
                  <Input
                    id="visaNumber"
                    placeholder="Visa Number"
                    value={formData.visaDetails.visaNumber}
                    onChange={(e) => updateVisaDetails("visaNumber", e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visaType">Visa Type</Label>
                  <Select
                    value={formData.visaDetails.visaType}
                    onValueChange={(value) => updateVisaDetails("visaType", value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select visa type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {visaTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visaIssueDate">Visa Issue Date</Label>
                  <Input
                    id="visaIssueDate"
                    type="date"
                    value={formData.visaDetails.issueDate}
                    onChange={(e) => updateVisaDetails("issueDate", e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visaExpiryDate">Visa Expiry Date</Label>
                  <Input
                    id="visaExpiryDate"
                    type="date"
                    value={formData.visaDetails.expiryDate}
                    onChange={(e) => updateVisaDetails("expiryDate", e.target.value)}
                    className="h-11"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* III. Emergency Contact */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">III. Emergency Contact Information</h3>
        </div>
        <div className="bg-slate-50 rounded-xl p-6 border border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">
                Name of Emergency Contact Person <span className="text-destructive">*</span>
              </Label>
              <Input
                id="emergencyName"
                placeholder="Full name"
                value={formData.emergencyContact.name}
                onChange={(e) => updateEmergencyContact("name", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyRelationship">
                Relationship to Applicant <span className="text-destructive">*</span>
              </Label>
              <Input
                id="emergencyRelationship"
                placeholder="Relationship"
                value={formData.emergencyContact.relationship}
                onChange={(e) => updateEmergencyContact("relationship", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">
                Contact Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="emergencyContact"
                placeholder="Contact Number"
                value={formData.emergencyContact.contactNumber}
                onChange={(e) => updateEmergencyContact("contactNumber", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyEmail">Email (if available)</Label>
              <Input
                id="emergencyEmail"
                type="email"
                placeholder="Email Address"
                value={formData.emergencyContact.email}
                onChange={(e) => updateEmergencyContact("email", e.target.value)}
                className="h-11"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyAddress">Address (if different from applicant)</Label>
            <Input
              id="emergencyAddress"
              placeholder="Full address"
              value={formData.emergencyContact.address}
              onChange={(e) => updateEmergencyContact("address", e.target.value)}
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* IV. Contact Person in India */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">IV. Do you have any Contact Person in India?</h3>
        </div>
        <div className="bg-slate-50 rounded-xl p-6 border border-border space-y-4">
          <RadioGroup
            value={formData.hasContactPersonIndia ? "yes" : "no"}
            onValueChange={(value) => updateFormData("hasContactPersonIndia", value === "yes")}
            className="flex gap-4 mb-4"
          >
            <Label
              htmlFor="contact-india-yes"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.hasContactPersonIndia
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
                }`}
            >
              <RadioGroupItem value="yes" id="contact-india-yes" />
              <span className="text-sm font-medium">Yes</span>
            </Label>
            <Label
              htmlFor="contact-india-no"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${!formData.hasContactPersonIndia
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
                }`}
            >
              <RadioGroupItem value="no" id="contact-india-no" />
              <span className="text-sm font-medium">No</span>
            </Label>
          </RadioGroup>

          <AnimatePresence>
            {formData.hasContactPersonIndia && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactIndiaName">Name of Contact Person (India)</Label>
                    <Input
                      id="contactIndiaName"
                      placeholder="Full name"
                      value={formData.contactPersonIndia.name}
                      onChange={(e) => updateContactPersonIndia("name", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactIndiaRel">Relationship to Applicant</Label>
                    <Input
                      id="contactIndiaRel"
                      placeholder="Relationship"
                      value={formData.contactPersonIndia.relationship}
                      onChange={(e) => updateContactPersonIndia("relationship", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactIndiaNumber">Contact Number (India)</Label>
                    <Input
                      id="contactIndiaNumber"
                      placeholder="Phone number"
                      value={formData.contactPersonIndia.contactNumber}
                      onChange={(e) => updateContactPersonIndia("contactNumber", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactIndiaEmail">Email Address (if available)</Label>
                    <Input
                      id="contactIndiaEmail"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.contactPersonIndia.email}
                      onChange={(e) => updateContactPersonIndia("email", e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactIndiaAddress">Address in India</Label>
                  <Input
                    id="contactIndiaAddress"
                    placeholder="Full address"
                    value={formData.contactPersonIndia.address}
                    onChange={(e) => updateContactPersonIndia("address", e.target.value)}
                    className="h-11"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PassportVisaStep2A;
