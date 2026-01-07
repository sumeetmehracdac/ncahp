import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  GraduationCap,
  Save,
  X,
  AlertCircle,
  CheckCircle2
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

// Mock initial data
const INITIAL_DATA = [
  { id: 1, name: 'Bachelor\'s Degree', code: 'BACHELOR', description: 'Undergraduate academic degree', isActive: true },
  { id: 2, name: 'Master\'s Degree', code: 'MASTER', description: 'Postgraduate academic degree', isActive: true },
  { id: 3, name: 'Diploma', code: 'DIPLOMA', description: 'Certificate of competency', isActive: true },
  { id: 4, name: 'Doctorate', code: 'DOCTORATE', description: 'Highest academic degree', isActive: true },
  { id: 5, name: 'Certificate', code: 'CERT', description: 'Short-term certification course', isActive: true },
];

const DegreeTypeManager = () => {
  const [degreeTypes, setDegreeTypes] = useState(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [errors, setErrors] = useState({});

  const filteredItems = degreeTypes.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.code.trim()) newErrors.code = 'Code is required';
    if (formData.code && !/^[A-Z0-9_]+$/.test(formData.code)) {
      newErrors.code = 'Code must be uppercase alphanumeric';
    }
    // Check for duplicate code
    const isDuplicate = degreeTypes.some(
      item => item.code === formData.code && item.id !== editingItem?.id
    );
    if (isDuplicate) newErrors.code = 'This code already exists';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, code: item.code, description: item.description || '' });
    } else {
      setEditingItem(null);
      setFormData({ name: '', code: '', description: '' });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingItem) {
      setDegreeTypes(prev => prev.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData }
          : item
      ));
      toast.success('Degree type updated successfully');
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        isActive: true
      };
      setDegreeTypes(prev => [...prev, newItem]);
      toast.success('Degree type added successfully');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    setDegreeTypes(prev => prev.filter(item => item.id !== deleteItem.id));
    toast.success('Degree type deleted successfully');
    setIsDeleteDialogOpen(false);
    setDeleteItem(null);
  };

  const handleToggleActive = (item) => {
    setDegreeTypes(prev => prev.map(i =>
      i.id === item.id ? { ...i, isActive: !i.isActive } : i
    ));
    toast.success(`${item.name} ${item.isActive ? 'deactivated' : 'activated'}`);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search degree types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Degree Type
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
              {/* Status indicator */}
              <div className={cn(
                "absolute top-3 right-3 w-2 h-2 rounded-full",
                item.isActive ? "bg-success" : "bg-muted-foreground"
              )} />

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-teal-600/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-muted rounded text-xs font-mono text-muted-foreground">
                    {item.code}
                  </span>
                  {item.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
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
          <GraduationCap className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No degree types found</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add your first degree type
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              {editingItem ? 'Edit Degree Type' : 'Add Degree Type'}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the degree type details below.' : 'Enter the details for the new degree type.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                placeholder="e.g., Bachelor's Degree"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code <span className="text-destructive">*</span></Label>
              <Input
                id="code"
                placeholder="e.g., BACHELOR"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className={cn("font-mono", errors.code ? 'border-destructive' : '')}
              />
              {errors.code && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.code}
                </p>
              )}
              <p className="text-xs text-muted-foreground">Use uppercase letters, numbers, and underscores only</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the degree type..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
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
            <AlertDialogTitle>Delete Degree Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteItem?.name}"? This action cannot be undone.
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

export default DegreeTypeManager;
