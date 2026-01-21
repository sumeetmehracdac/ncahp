import { Shield, AlertTriangle, Scale, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import SectionCard from '../components/SectionCard';
import { FormFieldGroup, FormRow, FormDivider } from '../components/FormFieldGroup';
import { ProvisionalFormData } from '../types';

interface Props {
  formData: ProvisionalFormData;
  updateFormData: <K extends keyof ProvisionalFormData>(field: K, value: ProvisionalFormData[K]) => void;
  sectionRef: React.RefObject<HTMLDivElement>;
}

export default function DeclarationSection({ formData, updateFormData, sectionRef }: Props) {
  const updateDeclaration = (field: keyof ProvisionalFormData['declaration'], value: boolean | string) => {
    updateFormData('declaration', {
      ...formData.declaration,
      [field]: value,
    });
  };

  const allDeclarationsAccepted = 
    formData.declaration.noPendingCases &&
    formData.declaration.noMalpractice &&
    formData.declaration.informationAccuracy &&
    formData.declaration.termsAccepted &&
    formData.declaration.consentForVerification;

  return (
    <SectionCard
      ref={sectionRef}
      id="declaration"
      number={8}
      title="Declaration by Applicant"
      tagline="Legal acknowledgement and consent"
      icon={<Shield className="w-5 h-5" />}
    >
      {/* Legal Header */}
      <div className="mb-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
            <Scale className="w-7 h-7 text-slate-700" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-foreground">
              Declaration & Undertaking
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              I hereby declare the following statements to be true and correct to the best of my knowledge and belief.
              I understand that any false statement may result in rejection of my application and/or legal action.
            </p>
          </div>
        </div>
      </div>

      {/* Declaration Checkboxes */}
      <div className="space-y-4">
        {/* No Pending Cases */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-xl border-2 transition-all ${
            formData.declaration.noPendingCases 
              ? 'border-success bg-success/5' 
              : 'border-border hover:border-primary/30'
          }`}
        >
          <div className="flex items-start space-x-4">
            <Checkbox
              id="noPendingCases"
              checked={formData.declaration.noPendingCases}
              onCheckedChange={(checked) => updateDeclaration('noPendingCases', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="noPendingCases" className="text-sm font-medium text-foreground cursor-pointer leading-relaxed">
                I declare that there are no pending criminal cases, disciplinary proceedings, or investigations against me 
                before any court, tribunal, or regulatory body in India or abroad.
              </Label>
            </div>
            {formData.declaration.noPendingCases && (
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
            )}
          </div>
        </motion.div>

        {/* No Malpractice */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-xl border-2 transition-all ${
            formData.declaration.noMalpractice 
              ? 'border-success bg-success/5' 
              : 'border-border hover:border-primary/30'
          }`}
        >
          <div className="flex items-start space-x-4">
            <Checkbox
              id="noMalpractice"
              checked={formData.declaration.noMalpractice}
              onCheckedChange={(checked) => updateDeclaration('noMalpractice', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="noMalpractice" className="text-sm font-medium text-foreground cursor-pointer leading-relaxed">
                I declare that I have not been found guilty of professional misconduct, malpractice, or ethical violations 
                in my capacity as an allied and healthcare professional.
              </Label>
            </div>
            {formData.declaration.noMalpractice && (
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
            )}
          </div>
        </motion.div>

        {/* Information Accuracy */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-4 rounded-xl border-2 transition-all ${
            formData.declaration.informationAccuracy 
              ? 'border-success bg-success/5' 
              : 'border-border hover:border-primary/30'
          }`}
        >
          <div className="flex items-start space-x-4">
            <Checkbox
              id="informationAccuracy"
              checked={formData.declaration.informationAccuracy}
              onCheckedChange={(checked) => updateDeclaration('informationAccuracy', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="informationAccuracy" className="text-sm font-medium text-foreground cursor-pointer leading-relaxed">
                I certify that all information provided in this application is true, complete, and accurate. 
                I understand that any false or misleading information may result in rejection of my application 
                and/or cancellation of registration if already granted.
              </Label>
            </div>
            {formData.declaration.informationAccuracy && (
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
            )}
          </div>
        </motion.div>

        {/* Terms Accepted */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-4 rounded-xl border-2 transition-all ${
            formData.declaration.termsAccepted 
              ? 'border-success bg-success/5' 
              : 'border-border hover:border-primary/30'
          }`}
        >
          <div className="flex items-start space-x-4">
            <Checkbox
              id="termsAccepted"
              checked={formData.declaration.termsAccepted}
              onCheckedChange={(checked) => updateDeclaration('termsAccepted', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="termsAccepted" className="text-sm font-medium text-foreground cursor-pointer leading-relaxed">
                I agree to abide by the rules, regulations, and code of conduct prescribed by the 
                National Commission for Allied and Healthcare Professions (NCAHP) and any amendments thereto.
              </Label>
            </div>
            {formData.declaration.termsAccepted && (
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
            )}
          </div>
        </motion.div>

        {/* Consent for Verification */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-4 rounded-xl border-2 transition-all ${
            formData.declaration.consentForVerification 
              ? 'border-success bg-success/5' 
              : 'border-border hover:border-primary/30'
          }`}
        >
          <div className="flex items-start space-x-4">
            <Checkbox
              id="consentForVerification"
              checked={formData.declaration.consentForVerification}
              onCheckedChange={(checked) => updateDeclaration('consentForVerification', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="consentForVerification" className="text-sm font-medium text-foreground cursor-pointer leading-relaxed">
                I authorize NCAHP to verify the documents and information provided by me with the issuing authorities, 
                educational institutions, and other relevant bodies. I also consent to my data being processed 
                in accordance with the applicable data protection laws.
              </Label>
            </div>
            {formData.declaration.consentForVerification && (
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
            )}
          </div>
        </motion.div>
      </div>

      <FormDivider />

      {/* Place and Date */}
      <FormRow columns={2}>
        <FormFieldGroup label="Place" required>
          <Input
            placeholder="Enter city/town"
            value={formData.declaration.applicantPlace}
            onChange={(e) => updateDeclaration('applicantPlace', e.target.value)}
            className="h-11"
          />
        </FormFieldGroup>
        <FormFieldGroup label="Date" required>
          <Input
            type="date"
            value={formData.declaration.applicantDate}
            onChange={(e) => updateDeclaration('applicantDate', e.target.value)}
            className="h-11"
          />
        </FormFieldGroup>
      </FormRow>

      {/* Warning Notice */}
      <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">Important Warning</p>
            <p className="text-sm text-destructive/90 mt-1">
              Providing false information or forged documents is a punishable offence under the 
              National Commission for Allied and Healthcare Professions Act, 2021 and may result in 
              criminal prosecution, permanent disqualification, and other legal consequences.
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              Declaration Status
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {allDeclarationsAccepted 
                ? 'All declarations accepted' 
                : `${5 - [
                    formData.declaration.noPendingCases,
                    formData.declaration.noMalpractice,
                    formData.declaration.informationAccuracy,
                    formData.declaration.termsAccepted,
                    formData.declaration.consentForVerification,
                  ].filter(Boolean).length} declaration(s) remaining`
              }
            </p>
          </div>
          {allDeclarationsAccepted && (
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
