import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Plus, Trash2, Upload, FileCheck, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormData, HealthcareQualification } from '../index';

interface Props {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const HealthcareQualificationStep = ({ formData, updateFormData }: Props) => {
  const addQualification = () => {
    const newEntry: HealthcareQualification = {
      id: Date.now().toString(),
      qualificationName: '',
      institutionName: '',
      university: '',
      country: '',
      durationMonths: '',
      admissionDate: '',
      passingDate: '',
      certificate: null,
      transcript: null
    };
    updateFormData('healthcareQualifications', [...formData.healthcareQualifications, newEntry]);
  };

  const removeQualification = (id: string) => {
    if (formData.healthcareQualifications.length > 1) {
      updateFormData('healthcareQualifications', formData.healthcareQualifications.filter(e => e.id !== id));
    }
  };

  const updateQualification = (id: string, field: keyof HealthcareQualification, value: string | File | null) => {
    updateFormData(
      'healthcareQualifications',
      formData.healthcareQualifications.map(e => e.id === id ? { ...e, [field]: value } : e)
    );
  };

  return (
    <div className="space-y-8">

      <div className="mb-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
        <p className="text-sm text-foreground">
          <strong>Required:</strong> Enter at least one allied healthcare qualification with country, duration (including internship period in months),
          admission date, passing date, and attach the certificate and transcript.
        </p>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {formData.healthcareQualifications.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white border border-border rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-primary">
                  Allied Healthcare Qualification #{index + 1}
                </span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeQualification(entry.id)}
                  disabled={formData.healthcareQualifications.length === 1}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Qualification Name <span className="text-destructive">*</span></Label>
                  <Input placeholder="e.g., B.Sc. Medical Laboratory Technology" value={entry.qualificationName}
                    onChange={(e) => updateQualification(entry.id, 'qualificationName', e.target.value)} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Institution Name <span className="text-destructive">*</span></Label>
                  <Input placeholder="Name of college/institute" value={entry.institutionName}
                    onChange={(e) => updateQualification(entry.id, 'institutionName', e.target.value)} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">University <span className="text-destructive">*</span></Label>
                  <Input placeholder="Affiliated university" value={entry.university}
                    onChange={(e) => updateQualification(entry.id, 'university', e.target.value)} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Country <span className="text-destructive">*</span></Label>
                  <Input placeholder="Country" value={entry.country}
                    onChange={(e) => updateQualification(entry.id, 'country', e.target.value)} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Duration (months incl. internship)
                  </Label>
                  <Input type="number" placeholder="e.g., 48" min="1" value={entry.durationMonths}
                    onChange={(e) => updateQualification(entry.id, 'durationMonths', e.target.value)} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Year of Admission
                  </Label>
                  <Input type="date" value={entry.admissionDate}
                    onChange={(e) => updateQualification(entry.id, 'admissionDate', e.target.value)} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Year of Passing
                  </Label>
                  <Input type="date" value={entry.passingDate}
                    onChange={(e) => updateQualification(entry.id, 'passingDate', e.target.value)} className="h-10" />
                </div>
              </div>

              {/* File Uploads: Certificate + Transcript */}
              <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
                {(['certificate', 'transcript'] as const).map((fileField) => (
                  <div key={fileField} className="relative">
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) updateQualification(entry.id, fileField, f); }}
                      className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Button type="button" variant="outline" size="sm"
                      className={`gap-2 ${entry[fileField] ? 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100' : ''}`}>
                      {entry[fileField] ? (
                        <><FileCheck className="w-4 h-4" />{(entry[fileField] as File).name.slice(0, 15)}...</>
                      ) : (
                        <><Upload className="w-4 h-4" />Upload {fileField === 'certificate' ? 'Certificate' : 'Transcript'}</>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button type="button" variant="outline" onClick={addQualification}
          className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5">
          <Plus className="w-5 h-5 mr-2" /> Add Healthcare Qualification
        </Button>
      </div>
    </div>
  );
};

export default HealthcareQualificationStep;
