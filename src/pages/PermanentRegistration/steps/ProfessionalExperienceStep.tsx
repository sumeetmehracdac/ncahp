import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Upload,
  FileCheck,
  Calendar,
  MapPin,
  ClipboardList,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormData, ExperienceEntry } from '../index';

interface Props {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const ProfessionalExperienceStep = ({ formData, updateFormData }: Props) => {
  const addExperience = () => {
    const newEntry: ExperienceEntry = {
      id: Date.now().toString(),
      designation: '',
      organizationName: '',
      organizationCountry: 'India',
      organizationAddress: '',
      startDate: '',
      completionDate: '',
      coreDuties: '',
      certificate: null
    };
    updateFormData('experiences', [...formData.experiences, newEntry]);
  };

  const removeExperience = (id: string) => {
    updateFormData('experiences', formData.experiences.filter(e => e.id !== id));
  };

  const updateExperience = (id: string, field: keyof ExperienceEntry, value: string | File | null) => {
    updateFormData(
      'experiences',
      formData.experiences.map(e => e.id === id ? { ...e, [field]: value } : e)
    );
  };

  const handleCertificateUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateExperience(id, 'certificate', file);
    }
  };

  // Calculate total experience
  const calculateTotalExperience = () => {
    let totalMonths = 0;
    formData.experiences.forEach(exp => {
      if (exp.startDate && exp.completionDate) {
        const start = new Date(exp.startDate);
        const end = new Date(exp.completionDate);
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        if (months > 0) totalMonths += months;
      }
    });
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return { years, months, totalMonths };
  };

  const totalExp = calculateTotalExperience();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Allied and Healthcare Professional Experience
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Enter details of your work experience in the allied and healthcare sector (if any).
        </p>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
        <p className="font-medium mb-1">Optional Section</p>
          <p>Add your experience if you have worked in a relevant allied and healthcare setting after completing your qualification. 
          Skip if not applicable.</p>
        </div>
      </div>

      {/* Experience Entries */}
      {formData.experiences.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-border"
        >
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No experience added</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Click below to add your work experience in the allied and healthcare sector.
          </p>
          <Button onClick={addExperience} className="bg-primary hover:bg-primary-dark">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Total Experience Summary */}
          {totalExp.totalMonths > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary/10 to-teal-50 rounded-xl p-4 border border-primary/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Total Experience</span>
                  <p className="font-semibold text-foreground">
                    {totalExp.years > 0 && `${totalExp.years} year${totalExp.years > 1 ? 's' : ''}`}
                    {totalExp.years > 0 && totalExp.months > 0 && ', '}
                    {totalExp.months > 0 && `${totalExp.months} month${totalExp.months > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {formData.experiences.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-border rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-primary">
                    Experience #{index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(entry.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Designation */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Designation</Label>
                    <Input
                      placeholder="e.g., Lab Technician, Physiotherapist"
                      value={entry.designation}
                      onChange={(e) => updateExperience(entry.id, 'designation', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Organization Name */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Organization Name</Label>
                    <Input
                      placeholder="Hospital/Clinic/Lab name"
                      value={entry.organizationName}
                      onChange={(e) => updateExperience(entry.id, 'organizationName', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Organization Country */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Country</Label>
                    <Input
                      placeholder="e.g., India"
                      value={entry.organizationCountry}
                      onChange={(e) => updateExperience(entry.id, 'organizationCountry', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Organization Address */}
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Organization Address
                    </Label>
                    <Input
                      placeholder="Complete address of the organization"
                      value={entry.organizationAddress}
                      onChange={(e) => updateExperience(entry.id, 'organizationAddress', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Start Date */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Date of Start
                    </Label>
                    <Input
                      type="date"
                      value={entry.startDate}
                      onChange={(e) => updateExperience(entry.id, 'startDate', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Completion Date */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Date of Completion
                    </Label>
                    <Input
                      type="date"
                      value={entry.completionDate}
                      onChange={(e) => updateExperience(entry.id, 'completionDate', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Core Duties */}
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <ClipboardList className="w-3 h-3" />
                      Core Duties / Responsibilities
                    </Label>
                    <Textarea
                      placeholder="Describe your main responsibilities and duties in this role..."
                      value={entry.coreDuties}
                      onChange={(e) => updateExperience(entry.id, 'coreDuties', e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>

                {/* Certificate Upload */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Attach Experience Certificate</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleCertificateUpload(entry.id, e)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`gap-2 ${
                          entry.certificate 
                            ? 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100' 
                            : ''
                        }`}
                      >
                        {entry.certificate ? (
                          <>
                            <FileCheck className="w-4 h-4" />
                            {entry.certificate.name.slice(0, 15)}...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Upload Certificate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Button
            type="button"
            variant="outline"
            onClick={addExperience}
            className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Another Experience
          </Button>
        </div>
      )}

      {/* Summary */}
      {formData.experiences.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-slate-50 to-primary/5 rounded-xl p-4 border border-border"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Positions entered: <strong className="text-foreground">{formData.experiences.length}</strong>
            </span>
            <span className="text-sm text-muted-foreground">
              Certificates attached: <strong className="text-primary">{formData.experiences.filter(e => e.certificate !== null).length}</strong>
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfessionalExperienceStep;
