import { Briefcase, Plus, Trash2, Upload, FileCheck, X, Building, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionCard from '../components/SectionCard';
import { FormFieldGroup, FormRow } from '../components/FormFieldGroup';
import { ProvisionalFormData, WorkExperience } from '../types';

interface Props {
  formData: ProvisionalFormData;
  updateFormData: <K extends keyof ProvisionalFormData>(field: K, value: ProvisionalFormData[K]) => void;
  sectionRef: React.RefObject<HTMLDivElement>;
}

const organizationTypes = [
  { value: 'government', label: 'Government Hospital' },
  { value: 'private', label: 'Private Hospital' },
  { value: 'clinic', label: 'Clinic/Nursing Home' },
  { value: 'laboratory', label: 'Diagnostic Laboratory' },
  { value: 'research', label: 'Research Institute' },
  { value: 'academic', label: 'Academic Institution' },
  { value: 'ngo', label: 'NGO/Non-Profit' },
  { value: 'other', label: 'Other' },
];

export default function WorkExperienceSection({ formData, updateFormData, sectionRef }: Props) {
  const addExperience = () => {
    const newEntry: WorkExperience = {
      id: Date.now().toString(),
      designation: '',
      organizationName: '',
      organizationType: '',
      organizationAddress: '',
      startDate: '',
      endDate: '',
      isCurrentEmployment: false,
      responsibilities: '',
      certificate: null,
    };
    updateFormData('workExperiences', [...formData.workExperiences, newEntry]);
  };

  const removeExperience = (id: string) => {
    updateFormData('workExperiences', formData.workExperiences.filter(e => e.id !== id));
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: string | boolean | File | null) => {
    const updated = formData.workExperiences.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    );
    updateFormData('workExperiences', updated);
  };

  const handleNoExperience = (checked: boolean) => {
    updateFormData('hasNoExperience', checked);
    if (checked) {
      updateFormData('workExperiences', []);
    }
  };

  const calculateTotalExperience = () => {
    let totalMonths = 0;
    formData.workExperiences.forEach(exp => {
      if (exp.startDate) {
        const start = new Date(exp.startDate);
        const end = exp.isCurrentEmployment ? new Date() : (exp.endDate ? new Date(exp.endDate) : new Date());
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        totalMonths += Math.max(0, months);
      }
    });
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return { years, months, totalMonths };
  };

  const experience = calculateTotalExperience();

  return (
    <SectionCard
      ref={sectionRef}
      id="experience"
      number={5}
      title="Work Experience"
      tagline="Professional experience history"
      icon={<Briefcase className="w-5 h-5" />}
    >
      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800 font-medium">Optional Section</p>
          <p className="text-sm text-blue-700 mt-1">
            Add your professional work experience in allied and healthcare sector.
            If you're a fresh graduate, check the box below.
          </p>
        </div>
      </div>

      {/* No Experience Checkbox */}
      <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg mb-6">
        <Checkbox
          id="noExperience"
          checked={formData.hasNoExperience}
          onCheckedChange={(checked) => handleNoExperience(checked as boolean)}
        />
        <Label htmlFor="noExperience" className="text-sm cursor-pointer">
          I am a fresh graduate with no prior work experience
        </Label>
      </div>

      <AnimatePresence mode="wait">
        {!formData.hasNoExperience && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Experience Summary Card */}
            {formData.workExperiences.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Experience</p>
                    <p className="text-2xl font-display font-bold text-primary">
                      {experience.years > 0 && `${experience.years} year${experience.years > 1 ? 's' : ''}`}
                      {experience.years > 0 && experience.months > 0 && ', '}
                      {experience.months > 0 && `${experience.months} month${experience.months > 1 ? 's' : ''}`}
                      {experience.totalMonths === 0 && '0 months'}
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {formData.workExperiences.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 border-2 border-dashed border-border rounded-xl"
              >
                <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Work Experience Added</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click the button below to add your professional experience
                </p>
                <Button onClick={addExperience} className="bg-primary hover:bg-primary-dark">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </motion.div>
            )}

            {/* Experience Entries */}
            <AnimatePresence mode="popLayout">
              {formData.workExperiences.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="relative p-6 bg-muted/30 rounded-xl border border-border"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">
                          {entry.designation || `Position ${index + 1}`}
                        </h4>
                        {entry.organizationName && (
                          <p className="text-sm text-muted-foreground">{entry.organizationName}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(entry.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <FormRow columns={2}>
                      <FormFieldGroup label="Designation/Position" required>
                        <Input
                          placeholder="e.g., Staff Nurse, Lab Technician"
                          value={entry.designation}
                          onChange={(e) => updateExperience(entry.id, 'designation', e.target.value)}
                          className="h-11"
                        />
                      </FormFieldGroup>
                      <FormFieldGroup label="Organization/Institution Name" required>
                        <Input
                          placeholder="Enter organization name"
                          value={entry.organizationName}
                          onChange={(e) => updateExperience(entry.id, 'organizationName', e.target.value)}
                          className="h-11"
                        />
                      </FormFieldGroup>
                    </FormRow>

                    <FormRow columns={2}>
                      <FormFieldGroup label="Organization Type" required>
                        <Select
                          value={entry.organizationType}
                          onValueChange={(value) => updateExperience(entry.id, 'organizationType', value)}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {organizationTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormFieldGroup>
                      <FormFieldGroup label="Organization Address">
                        <Input
                          placeholder="City, State"
                          value={entry.organizationAddress}
                          onChange={(e) => updateExperience(entry.id, 'organizationAddress', e.target.value)}
                          className="h-11"
                        />
                      </FormFieldGroup>
                    </FormRow>

                    <FormRow columns={3}>
                      <FormFieldGroup label="Start Date" required>
                        <Input
                          type="date"
                          value={entry.startDate}
                          onChange={(e) => updateExperience(entry.id, 'startDate', e.target.value)}
                          className="h-11"
                        />
                      </FormFieldGroup>
                      <FormFieldGroup label="End Date" required={!entry.isCurrentEmployment}>
                        <Input
                          type="date"
                          value={entry.endDate}
                          onChange={(e) => updateExperience(entry.id, 'endDate', e.target.value)}
                          className="h-11"
                          disabled={entry.isCurrentEmployment}
                        />
                      </FormFieldGroup>
                      <div className="flex items-end pb-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`current-${entry.id}`}
                            checked={entry.isCurrentEmployment}
                            onCheckedChange={(checked) => {
                              updateExperience(entry.id, 'isCurrentEmployment', checked as boolean);
                              if (checked) updateExperience(entry.id, 'endDate', '');
                            }}
                          />
                          <Label htmlFor={`current-${entry.id}`} className="text-sm cursor-pointer">
                            Currently working here
                          </Label>
                        </div>
                      </div>
                    </FormRow>

                    <FormFieldGroup label="Key Responsibilities">
                      <Textarea
                        placeholder="Brief description of your key responsibilities and achievements..."
                        value={entry.responsibilities}
                        onChange={(e) => updateExperience(entry.id, 'responsibilities', e.target.value)}
                        className="min-h-[80px]"
                      />
                    </FormFieldGroup>

                    {/* Certificate Upload */}
                    <FormFieldGroup label="Upload Experience Certificate" hint="Experience/Relieving letter (PDF, JPG, PNG)">
                      {entry.certificate ? (
                        <div className="flex items-center justify-between p-3 bg-success/10 border border-success/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-success" />
                            <span className="text-sm font-medium">{entry.certificate.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => updateExperience(entry.id, 'certificate', null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-colors">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Click to upload</span>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              if (file) updateExperience(entry.id, 'certificate', file);
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
            {formData.workExperiences.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={addExperience}
                className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Position
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </SectionCard>
  );
}
