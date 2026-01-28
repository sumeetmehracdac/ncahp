import { motion, AnimatePresence } from "framer-motion";
import { FileText, AlertTriangle, Download, Eye } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Form2AData, Form2ADeclaration } from "../../types/form2A";

interface Props {
  formData: Form2AData;
  updateFormData: <K extends keyof Form2AData>(field: K, value: Form2AData[K]) => void;
  onSubmit: () => void;
}

const DeclarationStep2A = ({ formData, updateFormData, onSubmit }: Props) => {
  const updateDeclaration = (field: keyof Form2ADeclaration, value: boolean | string) => {
    updateFormData("declaration", { ...formData.declaration, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">Declaration & Submission</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Please answer the following questions and provide required declarations.
        </p>
      </div>

      {/* Part A: Background Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Part A: Background Information</h3>

        {/* Question 1 */}
        <div className="bg-slate-50 rounded-xl p-6 border space-y-4">
          <Label className="text-sm font-medium leading-relaxed">
            Have you ever faced cancellation, suspension, or revocation of any medical/healthcare license, permit, or registration by any country or regulatory authority? <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={formData.declaration.permitCancellation ? "yes" : "no"}
            onValueChange={(v) => updateDeclaration("permitCancellation", v === "yes")}
            className="flex gap-4"
          >
            {["Yes", "No"].map((opt) => (
              <Label
                key={opt}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${(opt === "Yes" && formData.declaration.permitCancellation) ||
                    (opt === "No" && !formData.declaration.permitCancellation)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <RadioGroupItem value={opt.toLowerCase()} />
                <span className="text-sm">{opt}</span>
              </Label>
            ))}
          </RadioGroup>
          <AnimatePresence>
            {formData.declaration.permitCancellation && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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

        {/* Question 2 */}
        <div className="bg-slate-50 rounded-xl p-6 border space-y-4">
          <Label className="text-sm font-medium leading-relaxed">
            Have you been involved in or are you currently facing any legal, disciplinary, or regulatory proceedings related to your medical or professional practice in any country? <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={formData.declaration.legalDispute ? "yes" : "no"}
            onValueChange={(v) => updateDeclaration("legalDispute", v === "yes")}
            className="flex gap-4"
          >
            {["Yes", "No"].map((opt) => (
              <Label
                key={opt}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${(opt === "Yes" && formData.declaration.legalDispute) ||
                    (opt === "No" && !formData.declaration.legalDispute)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <RadioGroupItem value={opt.toLowerCase()} />
                <span className="text-sm">{opt}</span>
              </Label>
            ))}
          </RadioGroup>
          <AnimatePresence>
            {formData.declaration.legalDispute && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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

      {/* Part B: Declaration by the Applicant */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Part B: Declaration by the Applicant</h3>

        <div className="bg-slate-50 rounded-xl p-6 border space-y-4">
          <p className="text-sm text-foreground font-medium">I hereby solemnly declare that:</p>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground leading-relaxed">
            <li>I have carefully read, understood, and agree to abide by all applicable Rules, Regulations, Guidelines, and Instructions issued by the National Commission for Allied and Healthcare Professions (NCAHP) and other competent authorities in India.</li>
            <li>I understand that any permission, provisional registration, or temporary license granted to me shall not be construed as a vested right for regular or permanent registration in India, and that such permission is valid only for the approved purpose and period.</li>
            <li>I hereby declare that I am medically fit to practice/study as a medical/allied healthcare professional in India.</li>
            <li>The information furnished above is true, correct, and complete to the best of my knowledge and belief. I understand that any false statement, suppression of facts, or misrepresentation may lead to rejection or cancellation of my registration/license and may attract legal action under applicable laws.</li>
          </ol>
        </div>

        {/* Declaration Acceptance */}
        <div className="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <Checkbox
            id="accept"
            checked={formData.declarationAccepted}
            onCheckedChange={(c) => updateFormData("declarationAccepted", c as boolean)}
            className="mt-1"
          />
          <Label htmlFor="accept" className="cursor-pointer text-sm leading-relaxed">
            I confirm that I have read and understood the above declarations, and that all information provided in this application is true, correct, and complete. <span className="text-destructive">*</span>
          </Label>
        </div>
      </div>

      {/* Application Preview and Download */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button type="button" variant="outline" className="flex-1 gap-2">
          <Eye className="w-4 h-4" /> Application Preview
        </Button>
        <Button type="button" variant="outline" className="flex-1 gap-2">
          <Download className="w-4 h-4" /> Application PDF Download
        </Button>
      </div>

      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-800">
          <strong>Important:</strong> Any false statement, suppression of facts, or misrepresentation may lead to rejection or cancellation of your registration/license and may attract legal action under applicable laws.
        </p>
      </div>
    </div>
  );
};

export default DeclarationStep2A;
