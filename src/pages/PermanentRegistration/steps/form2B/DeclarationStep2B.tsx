import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, AlertTriangle, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Form2BData, Form2BDeclaration } from "../../types/form2B";

interface Props {
  formData: Form2BData;
  updateFormData: <K extends keyof Form2BData>(field: K, value: Form2BData[K]) => void;
  onSubmit: () => void;
}

const DeclarationStep2B = ({ formData, updateFormData, onSubmit }: Props) => {
  const updateDeclaration = (field: keyof Form2BDeclaration, value: boolean | string | string[]) => {
    updateFormData("declaration", { ...formData.declaration, [field]: value });
  };

  const addPreviousPermission = () => {
    updateDeclaration("previousPermissions", [...formData.declaration.previousPermissions, '']);
  };

  const updatePreviousPermission = (index: number, value: string) => {
    const updated = [...formData.declaration.previousPermissions];
    updated[index] = value;
    updateDeclaration("previousPermissions", updated);
  };

  const removePreviousPermission = (index: number) => {
    updateDeclaration("previousPermissions", formData.declaration.previousPermissions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">Declaration</h2>
      </div>

      <div className="space-y-6">
        {/* Question 1 */}
        <div className="bg-slate-50 rounded-xl p-6 border space-y-4">
          <Label className="text-sm font-semibold">1. Have you undergone incidence of Cancellation of Permit by any Country? <span className="text-destructive">*</span></Label>
          <RadioGroup value={formData.declaration.permitCancellation ? "yes" : "no"} onValueChange={(v) => updateDeclaration("permitCancellation", v === "yes")} className="flex gap-4">
            {["Yes", "No"].map((opt) => (
              <Label key={opt} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer ${(opt === "Yes" && formData.declaration.permitCancellation) || (opt === "No" && !formData.declaration.permitCancellation) ? "border-primary bg-primary/5" : "border-border"}`}>
                <RadioGroupItem value={opt.toLowerCase()} /><span className="text-sm">{opt}</span>
              </Label>
            ))}
          </RadioGroup>
          <AnimatePresence>
            {formData.declaration.permitCancellation && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Textarea placeholder="Details..." value={formData.declaration.permitCancellationDetails} onChange={(e) => updateDeclaration("permitCancellationDetails", e.target.value)} rows={2} className="mt-2" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Question 2 */}
        <div className="bg-slate-50 rounded-xl p-6 border space-y-4">
          <Label className="text-sm font-semibold">2. Have you faced any Legal dispute in any Country? <span className="text-destructive">*</span></Label>
          <RadioGroup value={formData.declaration.legalDispute ? "yes" : "no"} onValueChange={(v) => updateDeclaration("legalDispute", v === "yes")} className="flex gap-4">
            {["Yes", "No"].map((opt) => (
              <Label key={opt} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer ${(opt === "Yes" && formData.declaration.legalDispute) || (opt === "No" && !formData.declaration.legalDispute) ? "border-primary bg-primary/5" : "border-border"}`}>
                <RadioGroupItem value={opt.toLowerCase()} /><span className="text-sm">{opt}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Question 3 */}
        <div className="bg-slate-50 rounded-xl p-6 border space-y-4">
          <Label className="text-sm font-semibold">3. Countries with similar Permission/License:</Label>
          <div className="space-y-3">
            {formData.declaration.previousPermissions.map((country, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input placeholder="Country" value={country} onChange={(e) => updatePreviousPermission(index, e.target.value)} className="h-10" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removePreviousPermission(index)} className="text-destructive h-10 w-10"><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addPreviousPermission}><Plus className="w-4 h-4 mr-1" />Add</Button>
          </div>
        </div>
      </div>

      {/* Declaration Acceptance */}
      <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border">
        <Checkbox id="accept" checked={formData.declarationAccepted} onCheckedChange={(c) => updateFormData("declarationAccepted", c as boolean)} className="mt-1" />
        <Label htmlFor="accept" className="cursor-pointer text-sm leading-relaxed">I confirm all information is true and accurate. <span className="text-destructive">*</span></Label>
      </div>

      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-800"><strong>Important:</strong> False information may result in rejection.</p>
      </div>
    </div>
  );
};

export default DeclarationStep2B;
