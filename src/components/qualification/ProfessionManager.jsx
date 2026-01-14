import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Users, Save, FolderTree, Clock, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { professionCategories, allProfessions, getIconPath } from '@/data/professions';

// Qualifications for profession linking
const QUALIFICATIONS = [
  { id: 1, label: 'MBBS - General Practice (5 yrs 6 mos)' },
  { id: 2, label: 'M.S. - Cardiology (3 yrs)' },
  { id: 3, label: 'B.Sc Nursing - General Practice (2 yrs)' },
  { id: 4, label: 'B.Sc MLT - Medical Laboratory (3 yrs)' },
  { id: 5, label: 'Diploma in Physiotherapy (2 yrs)' },
];

// Profession Icon component
const ProfessionIcon = ({ iconFile, color, className = "w-6 h-6" }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <Stethoscope className={className} style={{ color }} />;
  }

  return (
    <img
      src={getIconPath(iconFile)}
      alt="Profession icon"
      className={cn(className, "object-contain")}
      onError={() => setHasError(true)}
    />
  );
};

const INITIAL_PROFESSIONS = [
  { id: 1, professionId: 'p11', qualificationId: 1, isActive: true },
  { id: 2, professionId: 'p18', qualificationId: 5, isActive: true },
];

const ProfessionManager = () => {
  const [professionLinks, setProfessionLinks] = useState(INITIAL_PROFESSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [formData, setFormData] = useState({ professionId: '', qualificationId: '' });
  const [errors, setErrors] = useState({});

  const getProfession = (professionId) => allProfessions.find(p => p.id === professionId);
  const getQualification = (id) => QUALIFICATIONS.find(q => q.id === id);
  const getCategory = (categoryId) => professionCategories.find(c => c.id === categoryId);

  const filteredItems = professionLinks.filter(item => {
    const profession = getProfession(item.professionId);
    return profession?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.professionId) newErrors.professionId = 'Required';
    if (!formData.qualificationId) newErrors.qualificationId = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        professionId: item.professionId,
        qualificationId: item.qualificationId.toString(),
      });
    } else {
      setEditingItem(null);
      setFormData({ professionId: '', qualificationId: '' });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const data = {
      professionId: formData.professionId,
      qualificationId: parseInt(formData.qualificationId),
      isActive: true,
    };
    if (editingItem) {
      setProfessionLinks(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item));
      toast.success('Profession link updated');
    } else {
      setProfessionLinks(prev => [...prev, { id: Date.now(), ...data }]);
      toast.success('Profession link created');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    setProfessionLinks(prev => prev.filter(item => item.id !== deleteItem.id));
    toast.success('Profession link deleted');
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Link Professions to Qualifications</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Associate allied healthcare professions with their required qualifications.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search professions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Link Profession
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => {
            const profession = getProfession(item.professionId);
            const qualification = getQualification(item.qualificationId);
            const category = profession ? getCategory(profession.categoryId) : null;

            if (!profession) return null;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border rounded-xl p-5 hover:shadow-card-hover transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${profession.color}15` }}
                    >
                      <ProfessionIcon
                        iconFile={profession.iconFile}
                        color={profession.color}
                        className="w-6 h-6"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-foreground">{profession.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded text-xs">
                          <FolderTree className="w-3 h-3" />
                          {category?.shortName || 'Unknown Category'}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded text-xs">
                          <Clock className="w-3 h-3" />
                          {qualification?.label || 'Unknown Qualification'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(item)} className="h-8 text-xs">
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeleteItem(item);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="h-8 w-8 p-0 text-destructive"
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
          <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No profession links found</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {editingItem ? 'Edit' : 'Create'} Profession Link
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Allied Healthcare Profession *</Label>
              <Select
                value={formData.professionId}
                onValueChange={(v) => setFormData(prev => ({ ...prev, professionId: v }))}
              >
                <SelectTrigger className={errors.professionId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select profession" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {professionCategories.map(cat => (
                    <React.Fragment key={cat.id}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                        {cat.shortName}
                      </div>
                      {cat.professions.map(prof => (
                        <SelectItem key={prof.id} value={prof.id}>
                          {prof.name}
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Qualification *</Label>
              <Select
                value={formData.qualificationId}
                onValueChange={(v) => setFormData(prev => ({ ...prev, qualificationId: v }))}
              >
                <SelectTrigger className={errors.qualificationId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select qualification" />
                </SelectTrigger>
                <SelectContent>
                  {QUALIFICATIONS.map(q => (
                    <SelectItem key={q.id} value={q.id.toString()}>
                      {q.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" />
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profession Link</AlertDialogTitle>
            <AlertDialogDescription>
              Delete this profession-qualification link? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfessionManager;
