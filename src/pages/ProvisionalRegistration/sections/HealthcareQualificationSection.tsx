import { useState } from 'react';
import { Stethoscope, Plus, Trash2, Upload, FileCheck, X, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionCard from '../components/SectionCard';
import { FormFieldGroup, FormRow, FormDivider } from '../components/FormFieldGroup';
import { ProvisionalFormData, HealthcareQualification } from '../types';
import ProfessionSelect from '@/components/ProfessionSelect';

interface Props {
  formData: ProvisionalFormData;
  updateFormData: <K extends keyof ProvisionalFormData>(field: K, value: ProvisionalFormData[K]) => void;
  sectionRef: React.RefObject<HTMLDivElement>;
}

export default function HealthcareQualificationSection({ formData, updateFormData, sectionRef }: Props) {
  const addQualification = () => {
    const newQual: HealthcareQualification = {
      id: Date.now().toString(),
      qualificationName: '',
      institutionName: '',
      university: '',
      country: 'India',
      durationMonths: '',
      admissionDate: '',
      passingDate: '',
      certificate: null,
    };
    updateFormData('healthcareQualifications', [...formData.healthcareQualifications, newQual]);
  };

  const removeQualification = (id: string) => {
    if (formData.healthcareQualifications.length > 1) {
      updateFormData('healthcareQualifications', formData.healthcareQualifications.filter(q => q.id !== id));
    }
  };

  const updateQualification = (id: string, field: keyof HealthcareQualification, value: string | File | null) => {
    const updated = formData.healthcareQualifications.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    );
    updateFormData('healthcareQualifications', updated);
  };

  return (
    <SectionCard
      ref={sectionRef}
      id="healthcare"
      number={3}
      title="Primary Healthcare Qualifications"
      tagline="Essential healthcare qualifications for registration of practice under a specific profession"
      icon={<Stethoscope className="w-5 h-5" />}
    >
      {/* Profession Selection - Featured */}
      <div className="mb-8 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Select Your Profession</h3>
            <p className="text-sm text-muted-foreground">
              Choose the allied and healthcare profession you wish to register under
            </p>
          </div>
        </div>
        <ProfessionSelect
          value={formData.profession}
          onValueChange={(value) => updateFormData('profession', value)}
        />
      </div>

      <FormDivider label="Qualification Details" />

      {/* Qualifications List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {formData.healthcareQualifications.map((qual, index) => (
            <motion.div
              key={qual.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="relative p-6 bg-muted/30 rounded-xl border border-border"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <h4 className="font-medium text-foreground">
                    {qual.qualificationName || `Qualification ${index + 1}`}
                  </h4>
                </div>
                {formData.healthcareQualifications.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQualification(qual.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <FormRow columns={2}>
                  <FormFieldGroup label="Qualification/Degree Name" required>
                    <Input
                      placeholder="e.g., B.Sc. Nursing, DMLT, BPT"
                      value={qual.qualificationName}
                      onChange={(e) => updateQualification(qual.id, 'qualificationName', e.target.value)}
                      className="h-11"
                    />
                  </FormFieldGroup>
                  <FormFieldGroup label="Institution Name" required>
                    <Input
                      placeholder="Enter institution name"
                      value={qual.institutionName}
                      onChange={(e) => updateQualification(qual.id, 'institutionName', e.target.value)}
                      className="h-11"
                    />
                  </FormFieldGroup>
                </FormRow>

                <FormRow columns={3}>
                  <FormFieldGroup label="University/Board" required>
                    <Input
                      placeholder="Enter university name"
                      value={qual.university}
                      onChange={(e) => updateQualification(qual.id, 'university', e.target.value)}
                      className="h-11"
                    />
                  </FormFieldGroup>
                  <FormFieldGroup label="Country" required>
                    <Select
                      value={qual.country}
                      onValueChange={(value) => updateQualification(qual.id, 'country', value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormFieldGroup>
                  <FormFieldGroup label="Duration (Months)" required>
                    <Input
                      type="number"
                      placeholder="e.g., 48"
                      value={qual.durationMonths}
                      onChange={(e) => updateQualification(qual.id, 'durationMonths', e.target.value)}
                      className="h-11"
                      min="1"
                    />
                  </FormFieldGroup>
                </FormRow>

                <FormRow columns={2}>
                  <FormFieldGroup label="Date of Admission" required>
                    <Input
                      type="date"
                      value={qual.admissionDate}
                      onChange={(e) => updateQualification(qual.id, 'admissionDate', e.target.value)}
                      className="h-11"
                    />
                  </FormFieldGroup>
                  <FormFieldGroup label="Date of Passing" required>
                    <Input
                      type="date"
                      value={qual.passingDate}
                      onChange={(e) => updateQualification(qual.id, 'passingDate', e.target.value)}
                      className="h-11"
                    />
                  </FormFieldGroup>
                </FormRow>

                {/* Certificate Upload */}
                <FormFieldGroup label="Upload Degree/Diploma Certificate" required hint="PDF, JPG, PNG (Max 5MB)">
                  {qual.certificate ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-3 bg-success/10 border border-success/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium">{qual.certificate.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQualification(qual.id, 'certificate', null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ) : (
                    <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Upload className="w-5 h-5" />
                        <span className="text-sm">Click to upload certificate</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (file) updateQualification(qual.id, 'certificate', file);
                        }}
                      />
                    </label>
                  )}
                </FormFieldGroup>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add More Button */}
        <Button
          type="button"
          variant="outline"
          onClick={addQualification}
          className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Qualification
        </Button>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{formData.healthcareQualifications.length}</span> qualification(s) added
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {formData.healthcareQualifications.filter(q => q.certificate).length}
          </span> certificate(s) uploaded
        </p>
      </div>
    </SectionCard>
  );
}
