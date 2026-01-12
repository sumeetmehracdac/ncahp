import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Upload,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormData, EducationEntry } from '../index';

interface Props {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const EducationHistoryStep = ({ formData, updateFormData }: Props) => {
  const educationLabels: Record<number, string> = {
    0: 'Matriculation (10th) or Equivalent',
    1: 'Senior Secondary (12th) or Equivalent',
    2: 'Diploma (if any)',
  };

  const addEducationEntry = () => {
    const newEntry: EducationEntry = {
      id: Date.now().toString(),
      schoolName: '',
      board: '',
      yearOfPassing: '',
      certificate: null
    };
    updateFormData('educationHistory', [...formData.educationHistory, newEntry]);
  };

  const removeEducationEntry = (id: string) => {
    if (formData.educationHistory.length > 1) {
      updateFormData('educationHistory', formData.educationHistory.filter(e => e.id !== id));
    }
  };

  const updateEducationEntry = (id: string, field: keyof EducationEntry, value: string | File | null) => {
    updateFormData(
      'educationHistory',
      formData.educationHistory.map(e =>
        e.id === id ? { ...e, [field]: value } : e
      )
    );
  };

  const handleCertificateUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateEducationEntry(id, 'certificate', file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Educational Qualifications
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Enter your educational history prior to allied healthcare qualifications (from 10th grade onwards).
        </p>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Required Documents</p>
          <p>Please attach certificates for each qualification. All documents must be self-attested on every page.</p>
        </div>
      </div>

      {/* Education Entries Table */}
      <div className="space-y-4">
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-muted-foreground">
          <div className="col-span-4">School/Institution Name</div>
          <div className="col-span-3">Board/University</div>
          <div className="col-span-2">Year of Passing</div>
          <div className="col-span-2">Certificate</div>
          <div className="col-span-1"></div>
        </div>

        <AnimatePresence mode="popLayout">
          {formData.educationHistory.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white border border-border rounded-xl p-4 shadow-sm"
            >
              {/* Row Label for predefined entries */}
              {index < 3 && (
                <div className="mb-3 pb-2 border-b border-border">
                  <span className="text-sm font-medium text-primary">
                    {educationLabels[index]} {index < 1 && <span className="text-destructive">*</span>}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* School Name */}
                <div className="md:col-span-4 space-y-1.5">
                  <Label className="md:hidden text-xs text-muted-foreground">School/Institution</Label>
                  <Input
                    placeholder="Name of school/institution"
                    value={entry.schoolName}
                    onChange={(e) => updateEducationEntry(entry.id, 'schoolName', e.target.value)}
                    className="h-10"
                  />
                </div>

                {/* Board */}
                <div className="md:col-span-3 space-y-1.5">
                  <Label className="md:hidden text-xs text-muted-foreground">Board/University</Label>
                  <Input
                    placeholder="Board/University"
                    value={entry.board}
                    onChange={(e) => updateEducationEntry(entry.id, 'board', e.target.value)}
                    className="h-10"
                  />
                </div>

                {/* Year of Passing */}
                <div className="md:col-span-2 space-y-1.5">
                  <Label className="md:hidden text-xs text-muted-foreground">Year of Passing</Label>
                  <Input
                    type="number"
                    placeholder="Year"
                    min="1950"
                    max={new Date().getFullYear()}
                    value={entry.yearOfPassing}
                    onChange={(e) => updateEducationEntry(entry.id, 'yearOfPassing', e.target.value)}
                    className="h-10"
                  />
                </div>

                {/* Certificate Upload */}
                <div className="md:col-span-2 space-y-1.5">
                  <Label className="md:hidden text-xs text-muted-foreground">Certificate</Label>
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
                      className={`w-full h-10 gap-2 ${
                        entry.certificate 
                          ? 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100' 
                          : ''
                      }`}
                    >
                      {entry.certificate ? (
                        <>
                          <FileCheck className="w-4 h-4" />
                          <span className="truncate max-w-16">{entry.certificate.name.slice(0, 8)}...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Attach
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Delete Button */}
                <div className="md:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducationEntry(entry.id)}
                    disabled={formData.educationHistory.length === 1}
                    className="h-10 w-10 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add More Button */}
        <Button
          type="button"
          variant="outline"
          onClick={addEducationEntry}
          className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Another Qualification
        </Button>
      </div>

      {/* Summary */}
      {formData.educationHistory.some(e => e.schoolName !== '') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-slate-50 to-primary/5 rounded-xl p-4 border border-border"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Qualifications entered: <strong className="text-foreground">{formData.educationHistory.filter(e => e.schoolName !== '').length}</strong>
            </span>
            <span className="text-sm text-muted-foreground">
              Certificates attached: <strong className="text-primary">{formData.educationHistory.filter(e => e.certificate !== null).length}</strong>
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EducationHistoryStep;
