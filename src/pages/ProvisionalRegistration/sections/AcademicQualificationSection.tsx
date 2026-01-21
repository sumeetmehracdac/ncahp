import { GraduationCap, Upload, FileCheck, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionCard from '../components/SectionCard';
import { FormFieldGroup, FormRow } from '../components/FormFieldGroup';
import { ProvisionalFormData, AcademicQualification } from '../types';

interface Props {
  formData: ProvisionalFormData;
  updateFormData: <K extends keyof ProvisionalFormData>(field: K, value: ProvisionalFormData[K]) => void;
  sectionRef: React.RefObject<HTMLDivElement>;
}

export default function AcademicQualificationSection({ formData, updateFormData, sectionRef }: Props) {
  const updateQualification = (level: 'matriculation' | 'seniorSecondary', field: keyof AcademicQualification, value: string | File | null) => {
    const updated = formData.academicQualifications.map(q => 
      q.level === level ? { ...q, [field]: value } : q
    );
    updateFormData('academicQualifications', updated);
  };

  const handleFileUpload = (level: 'matriculation' | 'seniorSecondary', file: File | null) => {
    updateQualification(level, 'certificate', file);
  };

  const getQualification = (level: 'matriculation' | 'seniorSecondary') => {
    return formData.academicQualifications.find(q => q.level === level) || {
      id: '', level, schoolName: '', boardUniversity: '', yearOfPassing: '', percentage: '', certificate: null
    };
  };

  const renderQualificationForm = (level: 'matriculation' | 'seniorSecondary', title: string) => {
    const qual = getQualification(level);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">
              {level === 'matriculation' ? 'Class 10th / SSC / Equivalent' : 'Class 12th / HSC / Equivalent'}
            </p>
          </div>
        </div>

        <FormRow columns={2}>
          <FormFieldGroup label="School/Institution Name" required>
            <Input
              placeholder="Enter school name"
              value={qual.schoolName}
              onChange={(e) => updateQualification(level, 'schoolName', e.target.value)}
              className="h-11"
            />
          </FormFieldGroup>
          <FormFieldGroup label="Board/University" required>
            <Input
              placeholder="e.g., CBSE, ICSE, State Board"
              value={qual.boardUniversity}
              onChange={(e) => updateQualification(level, 'boardUniversity', e.target.value)}
              className="h-11"
            />
          </FormFieldGroup>
        </FormRow>

        <FormRow columns={2}>
          <FormFieldGroup label="Year of Passing" required>
            <Input
              type="number"
              placeholder="e.g., 2020"
              value={qual.yearOfPassing}
              onChange={(e) => updateQualification(level, 'yearOfPassing', e.target.value)}
              className="h-11"
              min="1950"
              max={new Date().getFullYear()}
            />
          </FormFieldGroup>
          <FormFieldGroup label="Percentage/CGPA" required>
            <Input
              placeholder="e.g., 85% or 8.5 CGPA"
              value={qual.percentage}
              onChange={(e) => updateQualification(level, 'percentage', e.target.value)}
              className="h-11"
            />
          </FormFieldGroup>
        </FormRow>

        {/* Certificate Upload */}
        <div className="mt-6">
          <FormFieldGroup label="Upload Certificate" required hint="Upload mark sheet or certificate (PDF, JPG, PNG - Max 5MB)">
            <div className="relative">
              {qual.certificate ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between p-4 bg-success/10 border border-success/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-success" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{qual.certificate.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(qual.certificate.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFileUpload(level, null)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file && file.size <= 5 * 1024 * 1024) {
                        handleFileUpload(level, file);
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </FormFieldGroup>
        </div>
      </div>
    );
  };

  return (
    <SectionCard
      ref={sectionRef}
      id="academic"
      number={2}
      title="Academic Qualification"
      tagline="Details of Matriculation and Senior Secondary qualification"
      icon={<GraduationCap className="w-5 h-5" />}
    >
      <Tabs defaultValue="matriculation" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="matriculation" className="flex items-center gap-2">
            <span className="hidden sm:inline">Matriculation</span>
            <span className="sm:hidden">10th</span>
            {getQualification('matriculation').certificate && (
              <span className="w-2 h-2 bg-success rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="seniorSecondary" className="flex items-center gap-2">
            <span className="hidden sm:inline">Senior Secondary</span>
            <span className="sm:hidden">12th</span>
            {getQualification('seniorSecondary').certificate && (
              <span className="w-2 h-2 bg-success rounded-full" />
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="matriculation">
          {renderQualificationForm('matriculation', 'Matriculation (Class 10th)')}
        </TabsContent>
        
        <TabsContent value="seniorSecondary">
          {renderQualificationForm('seniorSecondary', 'Senior Secondary (Class 12th)')}
        </TabsContent>
      </Tabs>

      {/* Summary */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {formData.academicQualifications.filter(q => q.certificate).length}
          </span> of 2 certificates uploaded
        </p>
      </div>
    </SectionCard>
  );
}
