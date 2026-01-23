import { CreditCard, Plane, AlertCircle, Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form2AData, Form2APassportDetails, Form2AVisaDetails, Form2AEmergencyContact } from "../../types/form2A";

interface Props {
  formData: Form2AData;
  updateFormData: <K extends keyof Form2AData>(field: K, value: Form2AData[K]) => void;
}

const PassportVisaStep2A = ({ formData, updateFormData }: Props) => {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Passport & Visa Details
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Provide your travel document details and emergency contact information.
        </p>
      </div>

      {/* Passport Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <Label className="text-base font-semibold text-foreground">Passport Details</Label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-6 border border-border">
          <div className="space-y-2">
            <Label htmlFor="passportNumber">
              Passport Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="passportNumber"
              placeholder="e.g., AB1234567"
              value={formData.passportDetails.passportNumber}
              onChange={(e) => updatePassportDetails("passportNumber", e.target.value)}
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

      {/* VISA Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Plane className="w-5 h-5 text-primary" />
          <Label className="text-base font-semibold text-foreground">VISA Details (if already holds)</Label>
        </div>
        <div className="bg-slate-50 rounded-xl p-6 border border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-4">
              <Label className="text-sm text-muted-foreground">Visa Type</Label>
              <RadioGroup
                value={formData.visaDetails.visaType}
                onValueChange={(value) => updateVisaDetails("visaType", value)}
                className="flex gap-4"
              >
                {[
                  { value: "student", label: "Student" },
                  { value: "research", label: "Research" },
                  { value: "other", label: "Other" }
                ].map((type) => (
                  <Label
                    key={type.value}
                    htmlFor={`visa-${type.value}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${formData.visaDetails.visaType === type.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                      }`}
                  >
                    <RadioGroupItem value={type.value} id={`visa-${type.value}`} />
                    <span className="text-sm">{type.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-primary" />
          <Label className="text-base font-semibold text-foreground">Emergency Contact Information</Label>
        </div>
        <div className="bg-slate-50 rounded-xl p-6 border border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">
                Name of Emergency Contact <span className="text-destructive">*</span>
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
                placeholder="e.g., Spouse, Parent, Sibling"
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
                placeholder="+1 234 567 8900"
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
                placeholder="email@example.com"
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

      {/* Contact Person in India */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-primary" />
          <Label className="text-base font-semibold text-foreground">Do you have any Contact Person in India? (Optional)</Label>
        </div>
        <div className="bg-slate-50 rounded-xl p-6 border border-border space-y-4">
          <RadioGroup
            className="flex gap-4 mb-4"
            defaultValue="no"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="contact-yes" onClick={() => {
                const el = document.getElementById('contact-india-fields');
                if (el) el.style.display = 'block';
              }} />
              <Label htmlFor="contact-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="contact-no" onClick={() => {
                const el = document.getElementById('contact-india-fields');
                if (el) el.style.display = 'none';
              }} />
              <Label htmlFor="contact-no">No</Label>
            </div>
          </RadioGroup>

          <div id="contact-india-fields" style={{ display: 'none' }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactIndiaName">Name of Contact Person (India)</Label>
                <Input
                  id="contactIndiaName"
                  placeholder="Full name"
                  value={formData.contactPersonIndia.name}
                  onChange={(e) => updateFormData("contactPersonIndia", { ...formData.contactPersonIndia, name: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactIndiaRel">Relationship to Applicant</Label>
                <Input
                  id="contactIndiaRel"
                  placeholder="Relationship"
                  value={formData.contactPersonIndia.relationship}
                  onChange={(e) => updateFormData("contactPersonIndia", { ...formData.contactPersonIndia, relationship: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactIndiaNumber">Contact Number (India)</Label>
                <Input
                  id="contactIndiaNumber"
                  placeholder="Phone number"
                  value={formData.contactPersonIndia.contactNumber}
                  onChange={(e) => updateFormData("contactPersonIndia", { ...formData.contactPersonIndia, contactNumber: e.target.value })}
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
                  onChange={(e) => updateFormData("contactPersonIndia", { ...formData.contactPersonIndia, email: e.target.value })}
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
                onChange={(e) => updateFormData("contactPersonIndia", { ...formData.contactPersonIndia, address: e.target.value })}
                className="h-11"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Note:</strong> Please ensure your passport has at least 6 months validity from your expected start date of practice in India.
        </div>
      </div>
    </div>
  );
};

export default PassportVisaStep2A;
