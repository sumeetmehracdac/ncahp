import { MapPin, Plus, Trash2, Upload, FileCheck, X, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionCard from '../components/SectionCard';
import { FormFieldGroup, FormRow } from '../components/FormFieldGroup';
import { ProvisionalFormData, PracticeLocation, indianStates } from '../types';

interface Props {
  formData: ProvisionalFormData;
  updateFormData: <K extends keyof ProvisionalFormData>(field: K, value: ProvisionalFormData[K]) => void;
  sectionRef: React.RefObject<HTMLDivElement>;
}

const institutionTypes = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'clinic', label: 'Clinic/Nursing Home' },
  { value: 'laboratory', label: 'Diagnostic Laboratory' },
  { value: 'diagnosticCenter', label: 'Diagnostic Center' },
  { value: 'other', label: 'Other Healthcare Facility' },
];

export default function PracticeLocationSection({ formData, updateFormData, sectionRef }: Props) {
  const addLocation = () => {
    const newLocation: PracticeLocation = {
      id: Date.now().toString(),
      institutionName: '',
      institutionType: 'hospital',
      address: '',
      city: '',
      state: '',
      pincode: '',
      registrationNumber: '',
      proof: null,
    };
    updateFormData('practiceLocations', [...formData.practiceLocations, newLocation]);
  };

  const removeLocation = (id: string) => {
    if (formData.practiceLocations.length > 1) {
      updateFormData('practiceLocations', formData.practiceLocations.filter(l => l.id !== id));
    }
  };

  const updateLocation = (id: string, field: keyof PracticeLocation, value: string | File | null) => {
    const updated = formData.practiceLocations.map(l =>
      l.id === id ? { ...l, [field]: value } : l
    );
    updateFormData('practiceLocations', updated);
  };

  return (
    <SectionCard
      ref={sectionRef}
      id="practice"
      number={6}
      title="Practice Location"
      tagline="Details of hospital/institution/laboratory/clinic for practice"
      icon={<MapPin className="w-5 h-5" />}
    >
      {/* Info Card */}
      <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-900">Where will you practice?</p>
            <p className="text-sm text-amber-800 mt-1">
              Provide details of the healthcare institution(s) where you intend to practice.
              You can add multiple locations if applicable.
            </p>
          </div>
        </div>
      </div>

      {/* Location Entries */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {formData.practiceLocations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative p-6 bg-muted/30 rounded-xl border border-border"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      {location.institutionName || `Practice Location ${index + 1}`}
                    </h4>
                    {location.city && location.state && (
                      <p className="text-sm text-muted-foreground">{location.city}, {location.state}</p>
                    )}
                  </div>
                </div>
                {formData.practiceLocations.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLocation(location.id)}
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
                  <FormFieldGroup label="Institution/Hospital Name" required>
                    <Input
                      placeholder="Enter institution name"
                      value={location.institutionName}
                      onChange={(e) => updateLocation(location.id, 'institutionName', e.target.value)}
                      className="h-11"
                    />
                  </FormFieldGroup>
                  <FormFieldGroup label="Institution Type" required>
                    <Select
                      value={location.institutionType}
                      onValueChange={(value) => updateLocation(location.id, 'institutionType', value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {institutionTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldGroup>
                </FormRow>

                <FormFieldGroup label="Complete Address" required>
                  <Input
                    placeholder="Building, Street, Area, Landmark"
                    value={location.address}
                    onChange={(e) => updateLocation(location.id, 'address', e.target.value)}
                    className="h-11"
                  />
                </FormFieldGroup>

                <FormRow columns={4}>
                  <FormFieldGroup label="City" required>
                    <Input
                      placeholder="City"
                      value={location.city}
                      onChange={(e) => updateLocation(location.id, 'city', e.target.value)}
                      className="h-11"
                    />
                  </FormFieldGroup>
                  <FormFieldGroup label="State" required>
                    <Select
                      value={location.state}
                      onValueChange={(value) => updateLocation(location.id, 'state', value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldGroup>
                  <FormFieldGroup label="Pincode" required>
                    <Input
                      placeholder="6-digit"
                      value={location.pincode}
                      onChange={(e) => updateLocation(location.id, 'pincode', e.target.value)}
                      className="h-11"
                      maxLength={6}
                    />
                  </FormFieldGroup>
                  <FormFieldGroup label="Registration No." hint="If available">
                    <Input
                      placeholder="Institution Reg. No."
                      value={location.registrationNumber}
                      onChange={(e) => updateLocation(location.id, 'registrationNumber', e.target.value)}
                      className="h-11"
                    />
                  </FormFieldGroup>
                </FormRow>

                {/* Proof Upload */}
                <FormFieldGroup label="Upload Proof of Practice" hint="Appointment letter/NOC/Agreement (PDF, JPG, PNG)">
                  {location.proof ? (
                    <div className="flex items-center justify-between p-3 bg-success/10 border border-success/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium">{location.proof.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => updateLocation(location.id, 'proof', null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">Click to upload proof</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (file) updateLocation(location.id, 'proof', file);
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
          onClick={addLocation}
          className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Practice Location
        </Button>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{formData.practiceLocations.length}</span> location(s) added
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {formData.practiceLocations.filter(l => l.proof).length}
          </span> proof(s) uploaded
        </p>
      </div>
    </SectionCard>
  );
}
