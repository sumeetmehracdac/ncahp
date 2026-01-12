import { motion } from 'framer-motion';
import { FileCheck, Stethoscope, ChevronRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormData } from '../index';

// Profession categories mapped to professions
const professionCategories = {
  'Medical Laboratory & Life Sciences': [
    'Biotechnologist', 'Biochemist (non-clinical)', 'Cell Geneticist', 'Clinical Embryologist',
    'Medical Microbiologist', 'Molecular Biologist', 'Molecular Geneticist', 'Cytotechnologist',
    'Forensic Science Technologist', 'Histotechnologist', 'Hemato Technologist', 
    'Immunology Technologist', 'Medical Laboratory Technologist', 'Medical Laboratory Assistant',
    'Medical Laboratory Technician', 'Blood Bank Technician', 'Research Assistant'
  ],
  'Trauma, Burn Care & Surgical Technology': [
    'Advance Care Paramedic', 'Burn Care Technologist', 'Emergency Medical Technologist (Paramedic)',
    'Anaesthesia Assistants and Technologists', 'Operation Theatre (OT) Technologists',
    'Endoscopy and Laparoscopy Technologists'
  ],
  'Physiotherapy': ['Physiotherapist'],
  'Nutrition Science': [
    'Dietician (including Clinical & Food Service Dietician)',
    'Nutritionist (including Public Health & Sports Nutritionist)'
  ],
  'Ophthalmic Sciences': ['Optometrist', 'Ophthalmic Assistant', 'Vision Technician'],
  'Occupational Therapy': ['Occupational Therapist'],
  'Community Care & Behavioural Health Sciences': [
    'Environment Protection Officer', 'Ecologist', 'Community Health Practitioner',
    'Occupational Health & Safety Officer', 'Physiologist (except Clinical)', 'Behavioural Analyst',
    'Integrated Behaviour Health Counsellor', 'Rehabilitation and Counselling Consultant',
    'Social Worker (Clinical/Medical/Psychiatric)', 'Medical Immunology Technologist',
    'Family Counsellor', 'Mental Health Support Worker', 'Podiatrist', 'Community Care Professional',
    'Movement Therapist', 'Yoga Therapy Assistant', 'Recreational Therapist', 'Acupuncture Professional'
  ],
  'Medical Radiology & Imaging Technology': [
    'Medical Physicist', 'Nuclear Medicine Technologist', 'Radiology & Imaging Technologist',
    'Diagnostic Medical Sonographer', 'Radiotherapy Technologist', 'Densitometrist'
  ],
  'Medical Technologists & Physician Associate': [
    'Biomedical Engineer', 'Medical Equipment Technologist', 'Physician Associate',
    'Cardiovascular Technologist', 'Perfusionist', 'Respiratory Technologist',
    'ECG Technologist', 'EEG Technologist', 'ENMG Technologist', 'Electroneurophysiology Technologist',
    'Gastrointestinal Technologist', 'Sleep Lab Technologist', 'Dialysis Therapy Technologist',
    'Lithotripsy Technologist'
  ],
  'Health Information Management': [
    'Health Information Management Professional',
    'Health Information Management Technologist',
    'Clinical Coder', 'Medical Secretary and Medical Transcriptionist'
  ]
};

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
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`font-semibold ${
                  formData.registrationType === type.value ? 'text-primary' : 'text-foreground'
                }`}>
                  {type.label}
                </span>
                {formData.registrationType === type.value && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <ChevronRight className="w-3 h-3 text-white" />
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
        <Select
          value={formData.profession}
          onValueChange={(value) => updateFormData('profession', value)}
        >
          <SelectTrigger className="h-12 text-base bg-background">
            <SelectValue placeholder="Choose your profession" />
          </SelectTrigger>
          <SelectContent className="max-h-80 bg-white">
            {Object.entries(professionCategories).map(([category, professions]) => (
              <div key={category}>
                <div className="px-3 py-2 text-xs font-semibold text-primary bg-primary/5 sticky top-0">
                  {category}
                </div>
                {professions.map((profession) => (
                  <SelectItem key={profession} value={profession} className="py-2.5">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-muted-foreground" />
                      <span>{profession}</span>
                    </div>
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selection Summary */}
      {formData.registrationType && formData.profession && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/5 to-teal-50 rounded-xl p-5 border border-primary/20"
        >
          <h4 className="font-semibold text-foreground mb-3">Your Selection</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Registration Type</span>
              <p className="font-medium text-foreground capitalize">{formData.registrationType} Registration</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Profession</span>
              <p className="font-medium text-foreground">{formData.profession}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RegistrationTypeStep;
