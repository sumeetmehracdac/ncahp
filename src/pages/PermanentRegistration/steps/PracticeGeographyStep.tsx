import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Upload,
  FileCheck,
  Info,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormData, PracticeState, indianStates } from '../index';

interface Props {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const PracticeGeographyStep = ({ formData, updateFormData }: Props) => {
  const addPracticeState = () => {
    const newState: PracticeState = {
      state: '',
      proofDocument: null,
      institutionName: '',
      institutionAddress: ''
    };
    updateFormData('practiceStates', [...formData.practiceStates, newState]);
  };

  const removePracticeState = (index: number) => {
    updateFormData('practiceStates', formData.practiceStates.filter((_, i) => i !== index));
  };

  const updatePracticeState = (index: number, field: keyof PracticeState, value: string | File | null) => {
    updateFormData(
      'practiceStates',
      formData.practiceStates.map((state, i) =>
        i === index ? { ...state, [field]: value } : state
      )
    );
  };

  const handleProofUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updatePracticeState(index, 'proofDocument', file);
    }
  };

  const handleToggleChange = (checked: boolean) => {
    updateFormData('practiceInOtherState', checked);
    if (checked && formData.practiceStates.length === 0) {
      addPracticeState();
    }
    if (!checked) {
      updateFormData('practiceStates', []);
    }
  };

  // Filter out already selected states
  const getAvailableStates = (currentIndex: number) => {
    const selectedStates = formData.practiceStates
      .filter((_, i) => i !== currentIndex)
      .map(s => s.state)
      .filter(s => s !== '');
    
    return indianStates.filter(
      state => !selectedStates.includes(state) && state !== formData.stateOfResidence
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">
          Practice Location Intent
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Declare if you intend to practice your profession in states other than your state of residence.
        </p>
      </div>

      {/* Current State of Registration */}
      <div className="bg-slate-50 rounded-xl p-5 border border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Your State of Registration</span>
            <p className="font-semibold text-foreground">{formData.stateOfResidence || 'Not selected'}</p>
          </div>
        </div>
      </div>

      {/* Intent Toggle */}
      <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Label htmlFor="practice-toggle" className="text-base font-semibold text-foreground cursor-pointer">
              Do you intend to practice in a state other than your state of residence?
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              If yes, you'll need to provide proof of practice for each additional state.
            </p>
          </div>
          <Switch
            id="practice-toggle"
            checked={formData.practiceInOtherState}
            onCheckedChange={handleToggleChange}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      {/* Practice States */}
      <AnimatePresence>
        {formData.practiceInOtherState && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Info Banner */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Proof of Practice Required</p>
                <p>
                  For each state selected, you must upload valid proof of practice such as 
                  employment letter, clinic registration, or practice address proof.
                </p>
              </div>
            </div>

            {/* State Selection Cards */}
            {formData.practiceStates.map((practiceState, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-xl p-5 border border-border shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-primary">
                    Additional Practice State #{index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePracticeState(index)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* State Selection */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Select State <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={practiceState.state}
                      onValueChange={(value) => updatePracticeState(index, 'state', value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Choose a state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-white">
                        {getAvailableStates(index).map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Institution Name */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Clinic/Lab/Hospital/Institution Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="Name of clinic, lab, hospital or institution"
                      value={practiceState.institutionName}
                      onChange={(e) => updatePracticeState(index, 'institutionName', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Institution Address */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Clinic/Lab/Hospital/Institution Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="Complete address of the institution"
                      value={practiceState.institutionAddress}
                      onChange={(e) => updatePracticeState(index, 'institutionAddress', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Proof Upload */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Proof of Practice <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleProofUpload(index, e)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className={`flex items-center gap-3 h-11 px-4 rounded-md border transition-all cursor-pointer ${
                        practiceState.proofDocument 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-input hover:border-primary/50'
                      }`}>
                        {practiceState.proofDocument ? (
                          <>
                            <FileCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-green-700 truncate">
                              {practiceState.proofDocument.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">Upload proof document</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add More Button */}
            <Button
              type="button"
              variant="outline"
              onClick={addPracticeState}
              className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-primary/5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another State
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Not Practicing in Other States Message */}
      {!formData.practiceInOtherState && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200"
        >
          <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Single State Practice</p>
            <p>
              You've indicated that you will practice only in <strong>{formData.stateOfResidence}</strong>. 
              Your registration will be processed through the {formData.stateOfResidence} State Council.
            </p>
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {formData.practiceInOtherState && formData.practiceStates.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-slate-50 to-primary/5 rounded-xl p-4 border border-border"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Additional states: <strong className="text-foreground">{formData.practiceStates.filter(s => s.state !== '').length}</strong>
            </span>
            <span className="text-sm text-muted-foreground">
              Proofs attached: <strong className="text-primary">{formData.practiceStates.filter(s => s.proofDocument !== null).length}</strong>
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PracticeGeographyStep;
