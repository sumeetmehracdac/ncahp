import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Clock,
  Save,
  AlertCircle,
  GraduationCap,
  Award,
  Stethoscope,
  Timer,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock data from other managers
const DEGREE_TYPES = [
  { id: 1, name: "Bachelor's Degree", code: 'BACHELOR' },
  { id: 2, name: "Master's Degree", code: 'MASTER' },
  { id: 3, name: 'Diploma', code: 'DIPLOMA' },
  { id: 4, name: 'Doctorate', code: 'DOCTORATE' },
  { id: 5, name: 'Certificate', code: 'CERT' },
];

const DEGREES = [
  { id: 1, abbreviation: 'MBBS', name: 'Bachelor of Medicine and Bachelor of Surgery' },
  { id: 2, abbreviation: 'BDS', name: 'Bachelor of Dental Surgery' },
  { id: 3, abbreviation: 'B.Pharm', name: 'Bachelor of Pharmacy' },
  { id: 4, abbreviation: 'BPT', name: 'Bachelor of Physiotherapy' },
  { id: 5, abbreviation: 'B.Sc Nursing', name: 'Bachelor of Science in Nursing' },
  { id: 6, abbreviation: 'M.S.', name: 'Master of Surgery' },
];

const SPECIALISATIONS = [
  { id: 1, name: 'Cardiology', code: 'CARDIO' },
  { id: 2, name: 'Neurology', code: 'NEURO' },
  { id: 3, name: 'Orthopedics', code: 'ORTHO' },
  { id: 4, name: 'Pediatrics', code: 'PEDIA' },
  { id: 5, name: 'Dermatology', code: 'DERM' },
  { id: 6, name: 'Ophthalmology', code: 'OPTH' },
  { id: 7, name: 'General Practice', code: 'GP' },
];

const INITIAL_QUALIFICATIONS = [
  {
    id: 1,
    degreeTypeId: 1,
    degreeId: 1,
    specialisationId: 7,
    duration: { years: 5, months: 6, hours: 0 },
    isActive: true
  },
  {
    id: 2,
    degreeTypeId: 2,
    degreeId: 6,
    specialisationId: 1,
    duration: { years: 3, months: 0, hours: 0 },
    isActive: true
  },
  {
    id: 3,
    degreeTypeId: 3,
    degreeId: 5,
    specialisationId: 7,
    duration: { years: 2, months: 0, hours: 0 },
    isActive: true
  },
];

const QualificationManager = () => {
  const [qualifications, setQualifications] = useState(INITIAL_QUALIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [formData, setFormData] = useState({
    degreeTypeId: '',
    degreeId: '',
    specialisationId: '',
    duration: { years: 0, months: 0, hours: 0 }
  });
  const [errors, setErrors] = useState({});

  const getQualificationLabel = (qual) => {
    const degreeType = DEGREE_TYPES.find(d => d.id === qual.degreeTypeId);
    const degree = DEGREES.find(d => d.id === qual.degreeId);
    const specialisation = SPECIALISATIONS.find(s => s.id === qual.specialisationId);
    return {
      degreeType: degreeType?.name || 'Unknown',
      degree: degree?.abbreviation || 'Unknown',
      degreeFull: degree?.name || 'Unknown',
      specialisation: specialisation?.name || 'Unknown',
    };
  };

  const formatDuration = (duration) => {
    const parts = [];
    if (duration.years > 0) parts.push(`${duration.years} yr${duration.years > 1 ? 's' : ''}`);
    if (duration.months > 0) parts.push(`${duration.months} mo${duration.months > 1 ? 's' : ''}`);
    if (duration.hours > 0) parts.push(`${duration.hours} hr${duration.hours > 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(' ') : 'Not specified';
  };

  const filteredItems = qualifications.filter(item => {
    const labels = getQualificationLabel(item);
    const searchLower = searchQuery.toLowerCase();
    return (
      labels.degree.toLowerCase().includes(searchLower) ||
      labels.degreeType.toLowerCase().includes(searchLower) ||
      labels.specialisation.toLowerCase().includes(searchLower)
    );
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.degreeTypeId) newErrors.degreeTypeId = 'Degree type is required';
    if (!formData.degreeId) newErrors.degreeId = 'Degree is required';
    if (!formData.specialisationId) newErrors.specialisationId = 'Specialisation is required';
    
    const { years, months, hours } = formData.duration;
    if (years === 0 && months === 0 && hours === 0) {
      newErrors.duration = 'At least one duration value is required';
    }
    
    // Check for duplicate combination
    const isDuplicate = qualifications.some(item =>
      item.degreeTypeId === parseInt(formData.degreeTypeId) &&
      item.degreeId === parseInt(formData.degreeId) &&
      item.specialisationId === parseInt(formData.specialisationId) &&
      item.id !== editingItem?.id
    );
    if (isDuplicate) newErrors.degreeId = 'This qualification combination already exists';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        degreeTypeId: item.degreeTypeId.toString(),
        degreeId: item.degreeId.toString(),
        specialisationId: item.specialisationId.toString(),
        duration: { ...item.duration }
      });
    } else {
      setEditingItem(null);
      setFormData({
        degreeTypeId: '',
        degreeId: '',
        specialisationId: '',
        duration: { years: 0, months: 0, hours: 0 }
      });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const qualData = {
      degreeTypeId: parseInt(formData.degreeTypeId),
      degreeId: parseInt(formData.degreeId),
      specialisationId: parseInt(formData.specialisationId),
      duration: formData.duration,
      isActive: true
    };

    if (editingItem) {
      setQualifications(prev => prev.map(item =>
        item.id === editingItem.id ? { ...item, ...qualData } : item
      ));
      toast.success('Qualification updated successfully');
    } else {
      const newItem = { id: Date.now(), ...qualData };
      setQualifications(prev => [...prev, newItem]);
      toast.success('Qualification added successfully');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    setQualifications(prev => prev.filter(item => item.id !== deleteItem.id));
    toast.success('Qualification deleted successfully');
    setIsDeleteDialogOpen(false);
    setDeleteItem(null);
  };

  const handleToggleActive = (item) => {
    setQualifications(prev => prev.map(i =>
      i.id === item.id ? { ...i, isActive: !i.isActive } : i
    ));
    const labels = getQualificationLabel(item);
    toast.success(`${labels.degree} qualification ${item.isActive ? 'deactivated' : 'activated'}`);
  };

  const handleDurationChange = (field, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    let maxValue = field === 'hours' ? 9999 : field === 'months' ? 11 : 99;
    setFormData(prev => ({
      ...prev,
      duration: {
        ...prev.duration,
        [field]: Math.min(numValue, maxValue)
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-foreground text-sm">Build Qualifications</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Combine degree type, degree, specialisation, and duration to create complete qualification entries. 
              Duration supports flexible formats: years, months, and/or hours.
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search qualifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Qualification
        </Button>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => {
            const labels = getQualificationLabel(item);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "group relative bg-card border rounded-xl p-5 transition-all duration-200 hover:shadow-card-hover",
                  item.isActive ? "border-border" : "border-border/50 opacity-60"
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Main Info */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {/* Degree Type */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/20 to-teal-600/10 border border-teal-500/20 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="text-sm font-medium text-foreground">{labels.degreeType}</p>
                      </div>
                    </div>
                    
                    {/* Degree */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
                        <Award className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Degree</p>
                        <p className="text-sm font-medium text-foreground">{labels.degree}</p>
                      </div>
                    </div>
                    
                    {/* Specialisation */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20 flex items-center justify-center">
                        <Stethoscope className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Specialisation</p>
                        <p className="text-sm font-medium text-foreground">{labels.specialisation}</p>
                      </div>
                    </div>
                    
                    {/* Duration */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center">
                        <Timer className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm font-medium text-foreground">{formatDuration(item.duration)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:ml-4">
                    <div className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      item.isActive 
                        ? "bg-success/10 text-success" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(item)}
                      className="h-8 text-xs"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(item)}
                      className={cn(
                        "h-8 text-xs",
                        item.isActive ? "text-warning hover:text-warning" : "text-success hover:text-success"
                      )}
                    >
                      {item.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setDeleteItem(item); setIsDeleteDialogOpen(true); }}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No qualifications found</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Create your first qualification
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              {editingItem ? 'Edit Qualification' : 'Create Qualification'}
            </DialogTitle>
            <DialogDescription>
              Combine degree type, degree, specialisation and duration to define a complete qualification.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Degree Type */}
            <div className="space-y-2">
              <Label>Degree Type <span className="text-destructive">*</span></Label>
              <Select
                value={formData.degreeTypeId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, degreeTypeId: value }))}
              >
                <SelectTrigger className={errors.degreeTypeId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select degree type" />
                </SelectTrigger>
                <SelectContent>
                  {DEGREE_TYPES.map(type => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.degreeTypeId && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.degreeTypeId}
                </p>
              )}
            </div>

            {/* Degree */}
            <div className="space-y-2">
              <Label>Degree <span className="text-destructive">*</span></Label>
              <Select
                value={formData.degreeId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, degreeId: value }))}
              >
                <SelectTrigger className={errors.degreeId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select degree" />
                </SelectTrigger>
                <SelectContent>
                  {DEGREES.map(degree => (
                    <SelectItem key={degree.id} value={degree.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium">{degree.abbreviation}</span>
                        <span className="text-muted-foreground">- {degree.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.degreeId && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.degreeId}
                </p>
              )}
            </div>

            {/* Specialisation */}
            <div className="space-y-2">
              <Label>Specialisation <span className="text-destructive">*</span></Label>
              <Select
                value={formData.specialisationId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, specialisationId: value }))}
              >
                <SelectTrigger className={errors.specialisationId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select specialisation" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALISATIONS.map(spec => (
                    <SelectItem key={spec.id} value={spec.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-cyan-600" />
                        {spec.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialisationId && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.specialisationId}
                </p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <Label>Duration <span className="text-destructive">*</span></Label>
              <p className="text-xs text-muted-foreground -mt-1">
                Specify duration in any combination of years, months, and/or hours
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Years</Label>
                  <Input
                    type="number"
                    min="0"
                    max="99"
                    value={formData.duration.years || ''}
                    onChange={(e) => handleDurationChange('years', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Months</Label>
                  <Input
                    type="number"
                    min="0"
                    max="11"
                    value={formData.duration.months || ''}
                    onChange={(e) => handleDurationChange('months', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Hours</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.duration.hours || ''}
                    onChange={(e) => handleDurationChange('hours', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              {errors.duration && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.duration}
                </p>
              )}
              {(formData.duration.years > 0 || formData.duration.months > 0 || formData.duration.hours > 0) && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <Timer className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-foreground font-medium">
                    {formatDuration(formData.duration)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Qualification</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteItem && (
                <>
                  Are you sure you want to delete the qualification "{getQualificationLabel(deleteItem).degree} - {getQualificationLabel(deleteItem).specialisation}"? 
                  This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QualificationManager;
