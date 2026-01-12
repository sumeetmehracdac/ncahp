import { motion } from 'framer-motion';
import { FileCheck, ChevronRight, Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { FormData } from '../index';
import ProfessionSelect from '@/components/ProfessionSelect';
import { getProfessionByName } from '@/data/professions';

interface Props {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const RegistrationTypeStep = ({ formData, updateFormData }: Props) => {
  const registrationTypes = [
    { value: 'fresh', label: 'Fresh Registration', description: 'First-time registration with NCAHP' },
    { value: 'conversion', label: 'Conversion from Provisional', description: 'Convert provisional to permanent' },
    { value: 'foreign', label: 'Foreign Qualification', description: 'Registration with foreign degree' }
  ];

  const selectedProfession = formData.profession ? getProfessionByName(formData.profession) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <FileCheck className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Registration Type & Profession
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Select your registration type and the allied healthcare profession you wish to register for.
        </p>
      </div>

      {/* Registration Type Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-foreground">
          Type of Registration <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {registrationTypes.map((type) => (
            <motion.button
              key={type.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateFormData('registrationType', type.value)}
              className={`p-5 rounded-xl border-2 text-left transition-all ${
                formData.registrationType === type.value
                  ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10'
                  : 'border-border bg-card hover:border-accent/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`font-semibold ${
                  formData.registrationType === type.value ? 'text-accent' : 'text-foreground'
                }`}>
                  {type.label}
                </span>
                {formData.registrationType === type.value && (
                  <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Profession Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-foreground">
          Select Profession <span className="text-destructive">*</span>
        </Label>
        <ProfessionSelect
          value={formData.profession}
          onValueChange={(value) => updateFormData('profession', value)}
          placeholder="Search or select your profession..."
        />
      </div>

      {/* Selection Summary */}
      {formData.registrationType && formData.profession && selectedProfession && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-xl p-5 border border-primary/20"
        >
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            Your Selection
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-accent" />
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Registration Type</span>
                <p className="font-medium text-foreground capitalize">
                  {registrationTypes.find(t => t.value === formData.registrationType)?.label}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${selectedProfession.color}15` }}
              >
                <selectedProfession.icon
                  className="w-6 h-6"
                  style={{ color: selectedProfession.color }}
                />
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Profession</span>
                <p className="font-medium text-foreground">{formData.profession}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RegistrationTypeStep;
