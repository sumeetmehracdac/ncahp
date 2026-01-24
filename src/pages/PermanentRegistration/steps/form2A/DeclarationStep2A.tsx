import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form2AData, Form2ADeclaration } from "../../types/form2A";

interface Props {
  formData: Form2AData;
  updateFormData: <K extends keyof Form2AData>(field: K, value: Form2AData[K]) => void;
  onSubmit: () => void;
}

const DeclarationStep2A = ({ formData, updateFormData, onSubmit }: Props) => {
  const updateDeclaration = (field: keyof Form2ADeclaration, value: boolean | string | string[]) => {
    updateFormData("declaration", {
      ...formData.declaration,
      [field]: value
    });
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Declaration
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Please answer the following questions and provide required declarations.
        </p>
      </div>

      {/* Declaration Questions */}
      <div className="space-y-6">
        {/* Question 1 - Permit Cancellation */}
        <div className="bg-slate-50 rounded-xl p-6 border border-border space-y-4">
          <Label className="text-sm font-semibold text-foreground">
            1. Have you undergone incidence of Cancellation of Permit by any Country? <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={formData.declaration.permitCancellation ? "yes" : "no"}
            onValueChange={(value) => updateDeclaration("permitCancellation", value === "yes")}
            className="flex gap-4"
          >
            {["Yes", "No"].map((option) => (
              <Label
                key={option}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                  (option === "Yes" && formData.declaration.permitCancellation) ||
                  (option === "No" && !formData.declaration.permitCancellation)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value={option.toLowerCase()} />
                <span className="text-sm font-medium">{option}</span>
              </Label>
            ))}
          </RadioGroup>
          <AnimatePresence>
            {formData.declaration.permitCancellation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Textarea
                  placeholder="Please provide details..."
                  value={formData.declaration.permitCancellationDetails}
                  onChange={(e) => updateDeclaration("permitCancellationDetails", e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Question 2 - Legal Dispute */}
        <div className="bg-slate-50 rounded-xl p-6 border border-border space-y-4">
          <Label className="text-sm font-semibold text-foreground">
            2. Have you faced any Legal dispute in any Country in this regard? <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={formData.declaration.legalDispute ? "yes" : "no"}
            onValueChange={(value) => updateDeclaration("legalDispute", value === "yes")}
            className="flex gap-4"
          >
            {["Yes", "No"].map((option) => (
              <Label
                key={option}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                  (option === "Yes" && formData.declaration.legalDispute) ||
                  (option === "No" && !formData.declaration.legalDispute)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value={option.toLowerCase()} />
                <span className="text-sm font-medium">{option}</span>
              </Label>
            ))}
          </RadioGroup>
          <AnimatePresence>
            {formData.declaration.legalDispute && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Textarea
                  placeholder="Please provide details..."
                  value={formData.declaration.legalDisputeDetails}
                  onChange={(e) => updateDeclaration("legalDisputeDetails", e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Declaration Statement */}
      <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-xl p-6 border border-primary/20 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Declaration by the Applicant
        </h3>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>I, hereby declare that:</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>The information provided above is true and complete to the best of my knowledge. I understand that any false information or misrepresentation may result in cancellation of my registration.</li>
            <li>I have fully understood the NCAHP Rules and Regulations, I will not claim this permission/Temporary License issued, as my right to apply for Regular Registration/Permanent Registration in this Country (India) and I will exit India once my study and permitted period is completed.</li>
            <li>I hereby declare that I have taken all preventive and precautionary Vaccinations, measures and Health Screening authorized by Indian Embassy.</li>
          </ol>
        </div>
      </div>

      {/* Final Acceptance */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border border-border">
          <Checkbox
            id="declarationAccepted"
            checked={formData.declarationAccepted}
            onCheckedChange={(checked) => updateFormData("declarationAccepted", checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="declarationAccepted" className="cursor-pointer text-sm text-foreground leading-relaxed">
            I have read, understood, and agree to all the terms and conditions mentioned above. I confirm that all the information provided by me is true and accurate. <span className="text-destructive">*</span>
          </Label>
        </div>
      </div>

      {/* Warning Note */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Important:</strong> Providing false information may result in rejection of your application and potential legal action. Please ensure all details are accurate before submission.
        </div>
      </div>
    </div>
  );
};

export default DeclarationStep2A;
