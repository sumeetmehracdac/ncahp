import { useState } from "react";
import { motion } from "framer-motion";
import { FileCheck, Check, Stethoscope } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FormData } from "../index";
import ProfessionSelect from "@/components/ProfessionSelect";
import { getProfessionByName, getIconPath, type Profession } from "@/data/professions";
import { cn } from "@/lib/utils";

interface Props {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

// Profession Icon component for rendering PNG icons
const ProfessionIcon = ({
  profession,
  className = "w-6 h-6",
  style = {},
}: {
  profession: Profession;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <Stethoscope className={className} style={{ color: profession.color, ...style }} />;
  }

  return (
    <img
      src={getIconPath(profession.iconFile)}
      alt={profession.name}
      className={cn(className, "object-contain")}
      style={style}
      onError={() => setHasError(true)}
    />
  );
};

const RegistrationTypeStep = ({ formData, updateFormData }: Props) => {
  const registrationTypes = [
    {
      value: "1A",
      formType: "Form 1A",
      label: "Regular Registration",
      description: "Indian nationals who have passed a recognised qualification from India on or before 2021.",
    },
    {
      value: "1B",
      formType: "Form 1B",
      label: "Provisional Registration",
      description: "Working allied and healthcare professionals who do not possess any recognized qualification",
    },
    {
      value: "1C",
      formType: "Form 1C",
      label: "Interim Registration",
      description: "Students pursuing a recognized qualification",
    },
    {
      value: "2A",
      formType: "Form 2A",
      label: "Temporary Registration",
      description: "Foreign nationals with foreign qualification",
    },
    {
      value: "2B",
      formType: "Form 2B",
      label: "Regular Registration",
      description: "Indian nationals with foreign qualification",
    },
    {
      value: "2C",
      formType: "Form 2C",
      label: "Temporary Registration",
      description: "Indian nationals with foreign qualification",
    },
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
          Registration Type for Allied and Healthcare Professionals
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Select your registration type and the allied or healthcare profession you wish to register for.
        </p>
      </div>

      {/* Registration Type Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-foreground">
          Type of Registration <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="group" aria-labelledby="registration-type-label">
          {registrationTypes.map((type, index) => (
            <motion.button
              key={type.value}
              type="button"
              role="radio"
              aria-checked={formData.registrationType === type.value}
              aria-describedby={`desc-${type.value}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateFormData("registrationType", type.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  updateFormData("registrationType", type.value);
                }
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${formData.registrationType === type.value
                  ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                  : "border-border bg-card hover:border-accent/50 hover:bg-muted/50"
                }`}
            >
              <div className="flex items-start justify-between mb-1">
                <span
                  className={`text-xs font-bold uppercase tracking-wide ${formData.registrationType === type.value ? "text-accent" : "text-primary"
                    }`}
                >
                  {type.formType}
                </span>
                {formData.registrationType === type.value && (
                  <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p
                className={`font-semibold mb-1 ${formData.registrationType === type.value ? "text-accent" : "text-foreground"
                  }`}
              >
                {type.label}
              </p>
              <p id={`desc-${type.value}`} className="text-xs text-muted-foreground leading-relaxed">{type.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Allied and Healthcare Profession Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold text-foreground">
          Select Allied and Healthcare Profession <span className="text-destructive">*</span>
        </Label>
        <ProfessionSelect
          value={formData.profession}
          onValueChange={(value) => updateFormData("profession", value)}
          placeholder="Search or select your allied and healthcare profession..."
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
                <p className="font-medium text-foreground">
                  <span className="text-primary font-bold">
                    {registrationTypes.find((t) => t.value === formData.registrationType)?.formType}
                  </span>{" "}
                  - {registrationTypes.find((t) => t.value === formData.registrationType)?.label}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${selectedProfession.color}15` }}
              >
                <ProfessionIcon profession={selectedProfession} className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Allied and Healthcare Profession</span>
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
