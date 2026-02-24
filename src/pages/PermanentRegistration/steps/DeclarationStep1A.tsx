import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle, Download, Eye } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { FormData } from "../index";

interface Props {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onSubmit: () => void;
}

const DeclarationStep1A = ({ formData, updateFormData, onSubmit }: Props) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Declaration & Submission
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Please answer the background questions and accept the declaration before submitting.
        </p>
      </div>

      {/* Part A: Background Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
          Part A: Background Information
        </h3>

        {/* Question 1 */}
        <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-border">
          <Label className="text-sm font-medium leading-relaxed">
            Have you ever faced cancellation, suspension, or revocation of any medical/healthcare license, permit, or registration by any country or regulatory authority?
          </Label>
          <RadioGroup
            value={formData.permitCancellation ? "yes" : "no"}
            onValueChange={(val) => {
              updateFormData("permitCancellation", val === "yes");
              if (val === "no") updateFormData("permitCancellationDetails", "");
            }}
            className="flex gap-4"
          >
            <Label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.permitCancellation ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
              <RadioGroupItem value="yes" /> <span className="text-sm font-medium">Yes</span>
            </Label>
            <Label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${!formData.permitCancellation ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
              <RadioGroupItem value="no" /> <span className="text-sm font-medium">No</span>
            </Label>
          </RadioGroup>
          <AnimatePresence>
            {formData.permitCancellation && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <Textarea
                  placeholder="Please provide details..."
                  value={formData.permitCancellationDetails}
                  onChange={(e) => updateFormData("permitCancellationDetails", e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Question 2 */}
        <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-border">
          <Label className="text-sm font-medium leading-relaxed">
            Have you been involved in or are you currently facing any legal, disciplinary, or regulatory proceedings related to your medical or professional practice in any country?
          </Label>
          <RadioGroup
            value={formData.legalDispute ? "yes" : "no"}
            onValueChange={(val) => {
              updateFormData("legalDispute", val === "yes");
              if (val === "no") updateFormData("legalDisputeDetails", "");
            }}
            className="flex gap-4"
          >
            <Label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.legalDispute ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
              <RadioGroupItem value="yes" /> <span className="text-sm font-medium">Yes</span>
            </Label>
            <Label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${!formData.legalDispute ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
              <RadioGroupItem value="no" /> <span className="text-sm font-medium">No</span>
            </Label>
          </RadioGroup>
          <AnimatePresence>
            {formData.legalDispute && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <Textarea
                  placeholder="Please provide details..."
                  value={formData.legalDisputeDetails}
                  onChange={(e) => updateFormData("legalDisputeDetails", e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Part B: Declaration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
          Part B: Declaration by the Applicant
        </h3>
        <div className="bg-white rounded-xl p-5 border border-border space-y-3">
          <p className="text-sm text-foreground font-medium">I hereby solemnly declare that:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
            <li>I have carefully read, understood, and agree to abide by all applicable Rules, Regulations, Guidelines, and Instructions issued by the National Commission for Allied and Healthcare Professions (NCAHP) and other competent authorities in India.</li>
            <li>I understand that any permission, provisional registration, or temporary license granted to me shall not be construed as a vested right for regular or permanent registration in India, and that such permission is valid only for the approved purpose and period.</li>
            <li>I hereby declare that I am medically fit to practice/study as a medical/allied healthcare professional in India.</li>
            <li>The information furnished above is true, correct, and complete to the best of my knowledge and belief. I understand that any false statement, suppression of facts, or misrepresentation may lead to rejection or cancellation of my registration/license and may attract legal action under applicable laws.</li>
          </ol>
          <div className="pt-4 border-t border-border">
            <Label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={formData.declarationAccepted}
                onCheckedChange={(checked) => updateFormData("declarationAccepted", checked as boolean)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-sm font-medium text-foreground">
                I accept the above declaration <span className="text-destructive">*</span>
              </span>
            </Label>
          </div>
        </div>
      </div>

      {/* Preview/Download */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 rounded-xl border border-border">
        <Button variant="outline" className="gap-2"><Eye className="w-4 h-4" />Application Preview</Button>
        <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Application PDF Download</Button>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <strong>Important:</strong> Once submitted, you will not be able to edit this application. Please review all information carefully before submission.
        </p>
      </div>
    </div>
  );
};

export default DeclarationStep1A;
