import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
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
import { FormData, InternshipEntry } from '../index';

interface Props {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const InternshipStep = ({ formData, updateFormData }: Props) => {
  const addInternship = () => {
    const newEntry: InternshipEntry = {
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
    updateFormData('internships', [...formData.internships, newEntry]);
  };

  const removeInternship = (id: string) => {
    updateFormData('internships', formData.internships.filter(e => e.id !== id));
  };

  const updateInternship = (id: string, field: keyof InternshipEntry, value: string | File | null) => {
    updateFormData(
      'internships',
      formData.internships.map(e => e.id === id ? { ...e, [field]: value } : e)
    );
  };

  const handleCertificateUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateInternship(id, 'certificate', file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Internship / Clinical Training
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Enter details of any internship or clinical training you have completed (if applicable).
        </p>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Optional Section</p>
          <p>If you have completed internship or clinical training as part of your qualification, please add the details here. 
          You can skip this step if not applicable.</p>
        </div>
      </div>

      {/* Internship Entries */}
      {formData.internships.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-border"
        >
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No internships added</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Click below to add details of your internship or clinical training experience.
          </p>
          <Button onClick={addInternship} className="bg-primary hover:bg-primary-dark">
            <Plus className="w-4 h-4 mr-2" />
            Add Internship
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {formData.internships.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-border rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-primary">
                    Internship / Clinical Training #{index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInternship(entry.id)}
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
                      placeholder="e.g., Intern, Trainee"
                      value={entry.designation}
                      onChange={(e) => updateInternship(entry.id, 'designation', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Organization Name */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Organization Name</Label>
                    <Input
                      placeholder="Hospital/Lab/Institute name"
                      value={entry.organizationName}
                      onChange={(e) => updateInternship(entry.id, 'organizationName', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Organization Country */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Organization Country</Label>
                    <Input
                      placeholder="e.g., India"
                      value={entry.organizationCountry}
                      onChange={(e) => updateInternship(entry.id, 'organizationCountry', e.target.value)}
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
                      onChange={(e) => updateInternship(entry.id, 'organizationAddress', e.target.value)}
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
                      onChange={(e) => updateInternship(entry.id, 'startDate', e.target.value)}
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
                      onChange={(e) => updateInternship(entry.id, 'completionDate', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Core Duties */}
                  <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <ClipboardList className="w-3 h-3" />
                      Core Duties Performed
                    </Label>
                    <Textarea
                      placeholder="Describe the main responsibilities and duties during your internship..."
                      value={entry.coreDuties}
                      onChange={(e) => updateInternship(entry.id, 'coreDuties', e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>

                {/* Certificate Upload */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Attach Certificate</Label>
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
            onClick={addInternship}
            className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Another Internship
          </Button>
        </div>
      )}

      {/* Summary */}
      {formData.internships.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-slate-50 to-primary/5 rounded-xl p-4 border border-border"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Internships entered: <strong className="text-foreground">{formData.internships.length}</strong>
            </span>
            <span className="text-sm text-muted-foreground">
              Certificates attached: <strong className="text-primary">{formData.internships.filter(e => e.certificate !== null).length}</strong>
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InternshipStep;
