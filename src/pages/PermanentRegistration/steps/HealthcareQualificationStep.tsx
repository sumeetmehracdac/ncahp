import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  Plus, 
  Trash2, 
  Upload,
  FileCheck,
  Calendar,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormData, HealthcareQualification } from '../index';

interface Props {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const HealthcareQualificationStep = ({ formData, updateFormData }: Props) => {
  const addHealthcareQualification = () => {
    const newEntry: HealthcareQualification = {
      id: Date.now().toString(),
      qualificationName: '',
      institutionName: '',
      university: '',
      durationMonths: '',
      admissionDate: '',
      passingDate: '',
      certificate: null
    };
    updateFormData('healthcareQualifications', [...formData.healthcareQualifications, newEntry]);
  };

  const addOtherQualification = () => {
    const newEntry: HealthcareQualification = {
      id: Date.now().toString(),
      qualificationName: '',
      institutionName: '',
      university: '',
      durationMonths: '',
      admissionDate: '',
      passingDate: '',
      certificate: null
    };
    updateFormData('otherQualifications', [...formData.otherQualifications, newEntry]);
  };

  const removeQualification = (type: 'healthcare' | 'other', id: string) => {
    if (type === 'healthcare') {
      if (formData.healthcareQualifications.length > 1) {
        updateFormData('healthcareQualifications', formData.healthcareQualifications.filter(e => e.id !== id));
      }
    } else {
      updateFormData('otherQualifications', formData.otherQualifications.filter(e => e.id !== id));
    }
  };

  const updateQualification = (
    type: 'healthcare' | 'other',
    id: string,
    field: keyof HealthcareQualification,
    value: string | File | null
  ) => {
    const key = type === 'healthcare' ? 'healthcareQualifications' : 'otherQualifications';
    updateFormData(
      key,
      formData[key].map(e => e.id === id ? { ...e, [field]: value } : e)
    );
  };

  const handleCertificateUpload = (
    type: 'healthcare' | 'other',
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      updateQualification(type, id, 'certificate', file);
    }
  };

  const renderQualificationForm = (
    entries: HealthcareQualification[],
    type: 'healthcare' | 'other',
    addFn: () => void
  ) => (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white border border-border rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-primary">
                {type === 'healthcare' ? 'Allied Healthcare Qualification' : 'Additional Qualification'} #{index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeQualification(type, entry.id)}
                disabled={type === 'healthcare' && entries.length === 1}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Qualification Name */}
              <div className="lg:col-span-2 space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Qualification Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="e.g., B.Sc. Medical Laboratory Technology"
                  value={entry.qualificationName}
                  onChange={(e) => updateQualification(type, entry.id, 'qualificationName', e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Institution Name */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Institution Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Name of college/institute"
                  value={entry.institutionName}
                  onChange={(e) => updateQualification(type, entry.id, 'institutionName', e.target.value)}
                  className="h-10"
                />
              </div>

              {/* University */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  University <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Affiliated university"
                  value={entry.university}
                  onChange={(e) => updateQualification(type, entry.id, 'university', e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Duration */}
              {type === 'healthcare' && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Duration (months incl. internship)
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g., 48"
                    min="1"
                    value={entry.durationMonths}
                    onChange={(e) => updateQualification(type, entry.id, 'durationMonths', e.target.value)}
                    className="h-10"
                  />
                </div>
              )}

              {/* Admission Date */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Date of Admission
                </Label>
                <Input
                  type="date"
                  value={entry.admissionDate}
                  onChange={(e) => updateQualification(type, entry.id, 'admissionDate', e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Passing Date */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Date of Passing
                </Label>
                <Input
                  type="date"
                  value={entry.passingDate}
                  onChange={(e) => updateQualification(type, entry.id, 'passingDate', e.target.value)}
                  className="h-10"
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
                    onChange={(e) => handleCertificateUpload(type, entry.id, e)}
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
        onClick={addFn}
        className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add {type === 'healthcare' ? 'Healthcare' : 'Another'} Qualification
      </Button>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <Stethoscope className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Allied Healthcare Qualifications
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Enter details of your allied healthcare qualification(s) for which registration is being applied.
        </p>
      </div>

      {/* Tabs for Healthcare and Other Qualifications */}
      <Tabs defaultValue="healthcare" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="healthcare" className="gap-2">
            <Stethoscope className="w-4 h-4" />
            Healthcare Qualifications
          </TabsTrigger>
          <TabsTrigger value="other" className="gap-2">
            <Plus className="w-4 h-4" />
            Other Qualifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="healthcare" className="mt-0">
          <div className="mb-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <p className="text-sm text-foreground">
              <strong>Required:</strong> Enter at least one allied healthcare qualification with duration (including internship period in months), 
              admission date, passing date, and attach the certificate.
            </p>
          </div>
          {renderQualificationForm(formData.healthcareQualifications, 'healthcare', addHealthcareQualification)}
        </TabsContent>

        <TabsContent value="other" className="mt-0">
          <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Optional:</strong> Add any other relevant qualifications you may have (not required for registration).
            </p>
          </div>
          {formData.otherQualifications.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-border">
              <p className="text-muted-foreground mb-4">No other qualifications added yet</p>
              <Button variant="outline" onClick={addOtherQualification}>
                <Plus className="w-4 h-4 mr-2" />
                Add Other Qualification
              </Button>
            </div>
          ) : (
            renderQualificationForm(formData.otherQualifications, 'other', addOtherQualification)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthcareQualificationStep;
