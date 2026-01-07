import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Award,
  Save,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

const INITIAL_DATA = [
  { id: 1, name: 'Bachelor of Medicine and Bachelor of Surgery', code: 'MBBS', abbreviation: 'MBBS', description: 'Primary medical qualification', isActive: true },
  { id: 2, name: 'Bachelor of Dental Surgery', code: 'BDS', abbreviation: 'BDS', description: 'Dental surgery qualification', isActive: true },
  { id: 3, name: 'Bachelor of Pharmacy', code: 'BPHARM', abbreviation: 'B.Pharm', description: 'Pharmacy qualification', isActive: true },
  { id: 4, name: 'Bachelor of Physiotherapy', code: 'BPT', abbreviation: 'BPT', description: 'Physiotherapy qualification', isActive: true },
  { id: 5, name: 'Bachelor of Science in Nursing', code: 'BSCNURSING', abbreviation: 'B.Sc Nursing', description: 'Nursing qualification', isActive: true },
  { id: 6, name: 'Master of Surgery', code: 'MS', abbreviation: 'M.S.', description: 'Postgraduate surgical degree', isActive: true },
];

const DegreeManager = () => {
  const [degrees, setDegrees] = useState(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', abbreviation: '', description: '' });
  const [errors, setErrors] = useState({});

  const filteredItems = degrees.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.code.trim()) newErrors.code = 'Code is required';
    if (!formData.abbreviation.trim()) newErrors.abbreviation = 'Abbreviation is required';
    if (formData.code && !/^[A-Z0-9_]+$/.test(formData.code)) {
      newErrors.code = 'Code must be uppercase alphanumeric';
    }
    const isDuplicate = degrees.some(
      item => item.code === formData.code && item.id !== editingItem?.id
    );
    if (isDuplicate) newErrors.code = 'This code already exists';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ 
        name: item.name, 
        code: item.code, 
        abbreviation: item.abbreviation,
        description: item.description || '' 
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', code: '', abbreviation: '', description: '' });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingItem) {
      setDegrees(prev => prev.map(item =>
        item.id === editingItem.id ? { ...item, ...formData } : item
      ));
      toast.success('Degree updated successfully');
    } else {
      const newItem = { id: Date.now(), ...formData, isActive: true };
      setDegrees(prev => [...prev, newItem]);
      toast.success('Degree added successfully');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    setDegrees(prev => prev.filter(item => item.id !== deleteItem.id));
    toast.success('Degree deleted successfully');
    setIsDeleteDialogOpen(false);
    setDeleteItem(null);
  };

  const handleToggleActive = (item) => {
    setDegrees(prev => prev.map(i =>
      i.id === item.id ? { ...i, isActive: !i.isActive } : i
    ));
    toast.success(`${item.abbreviation} ${item.isActive ? 'deactivated' : 'activated'}`);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search degrees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Degree
        </Button>
      </div>

      {/* Items Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "group relative bg-card border rounded-xl p-4 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5",
                item.isActive ? "border-border" : "border-border/50 opacity-60"
              )}
            >
              <div className={cn(
                "absolute top-3 right-3 w-2 h-2 rounded-full",
                item.isActive ? "bg-success" : "bg-muted-foreground"
              )} />

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{item.abbreviation}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{item.name}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-muted rounded text-xs font-mono text-muted-foreground">
                    {item.code}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenDialog(item)}
                  className="flex-1 h-8 text-xs"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleActive(item)}
                  className={cn(
                    "flex-1 h-8 text-xs",
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No degrees found</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add your first degree
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              {editingItem ? 'Edit Degree' : 'Add Degree'}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the degree details below.' : 'Enter the details for the new degree.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                placeholder="e.g., Bachelor of Medicine and Bachelor of Surgery"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="abbreviation">Abbreviation <span className="text-destructive">*</span></Label>
                <Input
                  id="abbreviation"
                  placeholder="e.g., MBBS"
                  value={formData.abbreviation}
                  onChange={(e) => setFormData(prev => ({ ...prev, abbreviation: e.target.value }))}
                  className={errors.abbreviation ? 'border-destructive' : ''}
                />
                {errors.abbreviation && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{errors.abbreviation}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code <span className="text-destructive">*</span></Label>
                <Input
                  id="code"
                  placeholder="e.g., MBBS"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className={cn("font-mono", errors.code ? 'border-destructive' : '')}
                />
                {errors.code && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{errors.code}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the degree..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              {editingItem ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Degree</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteItem?.abbreviation}"? This action cannot be undone.
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

export default DegreeManager;
