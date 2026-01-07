import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, FolderTree, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const INITIAL_DATA = [
  { id: 1, name: 'Medical', code: 'MED', description: 'Medical professionals', isActive: true },
  { id: 2, name: 'Dental', code: 'DENT', description: 'Dental professionals', isActive: true },
  { id: 3, name: 'Nursing', code: 'NURS', description: 'Nursing professionals', isActive: true },
  { id: 4, name: 'Pharmacy', code: 'PHARM', description: 'Pharmacy professionals', isActive: true },
  { id: 5, name: 'Allied Health', code: 'ALLIED', description: 'Allied health professionals', isActive: true },
];

const CategoryManager = () => {
  const [categories, setCategories] = useState(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [errors, setErrors] = useState({});

  const filteredItems = categories.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.code.trim()) newErrors.code = 'Code is required';
    const isDuplicate = categories.some(item => item.code === formData.code && item.id !== editingItem?.id);
    if (isDuplicate) newErrors.code = 'This code already exists';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (item = null) => {
    if (item) { setEditingItem(item); setFormData({ name: item.name, code: item.code, description: item.description || '' }); }
    else { setEditingItem(null); setFormData({ name: '', code: '', description: '' }); }
    setErrors({}); setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!validateForm()) return;
    if (editingItem) { setCategories(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...formData } : item)); toast.success('Category updated'); }
    else { setCategories(prev => [...prev, { id: Date.now(), ...formData, isActive: true }]); toast.success('Category added'); }
    setIsDialogOpen(false);
  };

  const handleDelete = () => { setCategories(prev => prev.filter(item => item.id !== deleteItem.id)); toast.success('Category deleted'); setIsDeleteDialogOpen(false); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2"><Plus className="w-4 h-4" />Add Category</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.05 }} className={cn("group relative bg-card border rounded-xl p-4 transition-all hover:shadow-card-hover", item.isActive ? "border-border" : "opacity-60")}>
              <div className={cn("absolute top-3 right-3 w-2 h-2 rounded-full", item.isActive ? "bg-success" : "bg-muted-foreground")} />
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-500/20 to-slate-600/10 border border-slate-400/20 flex items-center justify-center"><FolderTree className="w-5 h-5 text-accent" /></div>
                <div className="flex-1 min-w-0"><h4 className="font-medium text-foreground">{item.name}</h4><span className="inline-block mt-1 px-2 py-0.5 bg-muted rounded text-xs font-mono">{item.code}</span></div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(item)} className="flex-1 h-8 text-xs"><Edit2 className="w-3 h-3 mr-1" />Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => { setDeleteItem(item); setIsDeleteDialogOpen(true); }} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"><Trash2 className="w-3 h-3" /></Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><FolderTree className="w-5 h-5 text-accent" />{editingItem ? 'Edit' : 'Add'} Category</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Name *</Label><Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className={errors.name ? 'border-destructive' : ''} /></div>
            <div className="space-y-2"><Label>Code *</Label><Input value={formData.code} onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))} className={cn("font-mono", errors.code && 'border-destructive')} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button onClick={handleSave}><Save className="w-4 h-4 mr-1" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Category</AlertDialogTitle><AlertDialogDescription>Delete "{deleteItem?.name}"?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default CategoryManager;
