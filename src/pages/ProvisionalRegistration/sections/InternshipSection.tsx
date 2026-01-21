import { ClipboardList, Plus, Trash2, Upload, FileCheck, X, Building2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionCard from '../components/SectionCard';
import { FormFieldGroup, FormRow, FormDivider } from '../components/FormFieldGroup';
import { ProvisionalFormData, InternshipEntry } from '../types';

interface Props {
  formData: ProvisionalFormData;
  updateFormData: <K extends keyof ProvisionalFormData>(field: K, value: ProvisionalFormData[K]) => void;
  sectionRef: React.RefObject<HTMLDivElement>;
}

const organizationTypes = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'fieldwork', label: 'Field Work' },
  { value: 'other', label: 'Other' },
];

export default function InternshipSection({ formData, updateFormData, sectionRef }: Props) {
  const addInternship = () => {
    const newEntry: InternshipEntry = {
      id: Date.now().toString(),
      designation: '',
      organizationName: '',
      organizationType: 'hospital',
      organizationAddress: '',
      country: 'India',
      startDate: '',
      endDate: '',
      coreDuties: '',
      supervisorName: '',
      certificate: null,
    };
    updateFormData('internships', [...formData.internships, newEntry]);
  };

  const removeInternship = (id: string) => {
    updateFormData('internships', formData.internships.filter(i => i.id !== id));
  };

  const updateInternship = (id: string, field: keyof InternshipEntry, value: string | File | null) => {
    const updated = formData.internships.map(i =>
      i.id === id ? { ...i, [field]: value } : i
    );
    updateFormData('internships', updated);
  };

  const handleNoInternship = (checked: boolean) => {
    updateFormData('hasNoInternship', checked);
    if (checked) {
      updateFormData('internships', []);
    }
  };

  return (
    <SectionCard
      ref={sectionRef}
      id="internship"
      number={4}
      title="Internship/Clinical/Field Work"
      tagline="Details of internship, clinical training and field work"
      icon={<ClipboardList className="w-5 h-5" />}
    >
      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800 font-medium">Optional Section</p>
          <p className="text-sm text-blue-700 mt-1">
            Add details of any internship, clinical training, or field work completed as part of your qualification.
            If not applicable, please check the box below.
          </p>
        </div>
      </div>

      {/* No Internship Checkbox */}
      <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg mb-6">
        <Checkbox
          id="noInternship"
          checked={formData.hasNoInternship}
          onCheckedChange={(checked) => handleNoInternship(checked as boolean)}
        />
        <Label htmlFor="noInternship" className="text-sm cursor-pointer">
          I have not completed any internship/clinical training/field work
        </Label>
      </div>

      <AnimatePresence mode="wait">
        {!formData.hasNoInternship && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Empty State */}
            {formData.internships.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 border-2 border-dashed border-border rounded-xl"
              >
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Internships Added</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click the button below to add your internship or training details
                </p>
                <Button onClick={addInternship} className="bg-primary hover:bg-primary-dark">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Internship
                </Button>
              </motion.div>
            )}

            {/* Internship Entries */}
            <AnimatePresence mode="popLayout">
              {formData.internships.map((entry, index) => (
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
                      <h4 className="font-medium text-foreground">
                        {entry.organizationName || `Internship ${index + 1}`}
                      </h4>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInternship(entry.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <FormRow columns={2}>
                      <FormFieldGroup label="Designation/Role" required>
                        <Input
                          placeholder="e.g., Intern, Trainee"
                          value={entry.designation}
                          onChange={(e) => updateInternship(entry.id, 'designation', e.target.value)}
                          className="h-11"
                        />
                      </FormFieldGroup>
                      <FormFieldGroup label="Organization/Institution Name" required>
                        <Input
                          placeholder="Enter organization name"
                          value={entry.organizationName}
                          onChange={(e) => updateInternship(entry.id, 'organizationName', e.target.value)}
                          className="h-11"
                        />
                      </FormFieldGroup>
                    </FormRow>

                    <FormRow columns={3}>
                      <FormFieldGroup label="Organization Type" required>
                        <Select
                          value={entry.organizationType}
                          onValueChange={(value) => updateInternship(entry.id, 'organizationType', value)}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {organizationTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormFieldGroup>
                      <FormFieldGroup label="Start Date" required>
                        <Input
                          type="date"
                          value={entry.startDate}
                          onChange={(e) => updateInternship(entry.id, 'startDate', e.target.value)}
                          className="h-11"
                        />
                      </FormFieldGroup>
                      <FormFieldGroup label="End Date" required>
                        <Input
                          type="date"
                          value={entry.endDate}
                          onChange={(e) => updateInternship(entry.id, 'endDate', e.target.value)}
                          className="h-11"
                        />
                      </FormFieldGroup>
                    </FormRow>

                    <FormFieldGroup label="Organization Address">
                      <Input
                        placeholder="Enter complete address"
                        value={entry.organizationAddress}
                        onChange={(e) => updateInternship(entry.id, 'organizationAddress', e.target.value)}
                        className="h-11"
                      />
                    </FormFieldGroup>

                    <FormRow columns={2}>
                      <FormFieldGroup label="Supervisor Name">
                        <Input
                          placeholder="Name of supervising officer"
                          value={entry.supervisorName}
                          onChange={(e) => updateInternship(entry.id, 'supervisorName', e.target.value)}
                          className="h-11"
                        />
                      </FormFieldGroup>
                      <FormFieldGroup label="Country">
                        <Select
                          value={entry.country}
                          onValueChange={(value) => updateInternship(entry.id, 'country', value)}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormFieldGroup>
                    </FormRow>

                    <FormFieldGroup label="Core Duties/Responsibilities">
                      <Textarea
                        placeholder="Brief description of your duties and responsibilities during the internship..."
                        value={entry.coreDuties}
                        onChange={(e) => updateInternship(entry.id, 'coreDuties', e.target.value)}
                        className="min-h-[80px]"
                      />
                    </FormFieldGroup>

                    {/* Certificate Upload */}
                    <FormFieldGroup label="Upload Certificate" hint="Internship completion certificate (PDF, JPG, PNG)">
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
                            onClick={() => updateInternship(entry.id, 'certificate', null)}
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
                              if (file) updateInternship(entry.id, 'certificate', file);
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
            {formData.internships.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={addInternship}
                className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Internship
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      {!formData.hasNoInternship && formData.internships.length > 0 && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{formData.internships.length}</span> internship(s) added
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {formData.internships.filter(i => i.certificate).length}
            </span> certificate(s) uploaded
          </p>
        </div>
      )}
    </SectionCard>
  );
}
