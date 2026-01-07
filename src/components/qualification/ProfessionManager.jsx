import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Users, Save, FolderTree, GitBranch, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const CATEGORIES = [{ id: 1, name: 'Medical' }, { id: 2, name: 'Dental' }, { id: 3, name: 'Nursing' }, { id: 4, name: 'Pharmacy' }];
const SUBCATEGORIES = { 1: [{ id: 1, name: 'General Physician' }, { id: 2, name: 'Surgeon' }], 2: [{ id: 4, name: 'Orthodontist' }], 3: [{ id: 5, name: 'Staff Nurse' }], 4: [{ id: 6, name: 'Clinical Pharmacist' }] };
const QUALIFICATIONS = [{ id: 1, label: 'MBBS - General Practice (5 yrs 6 mos)' }, { id: 2, label: 'M.S. - Cardiology (3 yrs)' }, { id: 3, label: 'B.Sc Nursing - General Practice (2 yrs)' }];

const INITIAL_PROFESSIONS = [
  { id: 1, name: 'Medical Officer', categoryId: 1, subcategoryId: 1, qualificationId: 1, isActive: true },
  { id: 2, name: 'Cardiac Surgeon', categoryId: 1, subcategoryId: 2, qualificationId: 2, isActive: true },
];

const ProfessionManager = () => {
  const [professions, setProfessions] = useState(INITIAL_PROFESSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', categoryId: '', subcategoryId: '', qualificationId: '' });
  const [errors, setErrors] = useState({});

  const getLabel = (id, list) => list.find(i => i.id === id)?.name || list.find(i => i.id === id)?.label || 'Unknown';
  const getAvailableSubcategories = () => formData.categoryId ? (SUBCATEGORIES[formData.categoryId] || []) : [];

  const filteredItems = professions.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.categoryId) newErrors.categoryId = 'Required';
    if (!formData.subcategoryId) newErrors.subcategoryId = 'Required';
    if (!formData.qualificationId) newErrors.qualificationId = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (item = null) => {
    if (item) { setEditingItem(item); setFormData({ name: item.name, categoryId: item.categoryId.toString(), subcategoryId: item.subcategoryId.toString(), qualificationId: item.qualificationId.toString() }); }
    else { setEditingItem(null); setFormData({ name: '', categoryId: '', subcategoryId: '', qualificationId: '' }); }
    setErrors({}); setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const data = { name: formData.name, categoryId: parseInt(formData.categoryId), subcategoryId: parseInt(formData.subcategoryId), qualificationId: parseInt(formData.qualificationId), isActive: true };
    if (editingItem) { setProfessions(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item)); toast.success('Updated'); }
    else { setProfessions(prev => [...prev, { id: Date.now(), ...data }]); toast.success('Created'); }
    setIsDialogOpen(false);
  };

  const handleDelete = () => { setProfessions(prev => prev.filter(item => item.id !== deleteItem.id)); toast.success('Deleted'); setIsDeleteDialogOpen(false); };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"><Users className="w-4 h-4 text-primary" /></div>
          <div><h4 className="font-medium text-sm">Define Professions</h4><p className="text-sm text-muted-foreground mt-1">Create professions by combining one category, one sub-category, and one qualification.</p></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search professions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
        <Button onClick={() => handleOpenDialog()} className="gap-2"><Plus className="w-4 h-4" />Add Profession</Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: index * 0.05 }} className="bg-card border rounded-xl p-5 hover:shadow-card-hover transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary-dark/10 border border-primary/20 flex items-center justify-center"><Users className="w-6 h-6 text-primary" /></div>
                  <div><h4 className="font-semibold text-lg text-foreground">{item.name}</h4><div className="flex flex-wrap gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded text-xs"><FolderTree className="w-3 h-3" />{getLabel(item.categoryId, CATEGORIES)}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded text-xs"><GitBranch className="w-3 h-3" />{getLabel(item.subcategoryId, SUBCATEGORIES[item.categoryId] || [])}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded text-xs"><Clock className="w-3 h-3" />{getLabel(item.qualificationId, QUALIFICATIONS)}</span>
                  </div></div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(item)} className="h-8 text-xs"><Edit2 className="w-3 h-3 mr-1" />Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => { setDeleteItem(item); setIsDeleteDialogOpen(true); }} className="h-8 w-8 p-0 text-destructive"><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && <div className="text-center py-12"><Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" /><p className="text-muted-foreground">No professions found</p></div>}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" />{editingItem ? 'Edit' : 'Create'} Profession</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Profession Name *</Label><Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className={errors.name ? 'border-destructive' : ''} placeholder="e.g., Medical Officer" /></div>
            <div><Label>Category *</Label><Select value={formData.categoryId} onValueChange={(v) => setFormData(prev => ({ ...prev, categoryId: v, subcategoryId: '' }))}><SelectTrigger className={errors.categoryId ? 'border-destructive' : ''}><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{CATEGORIES.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Sub-Category *</Label><Select value={formData.subcategoryId} onValueChange={(v) => setFormData(prev => ({ ...prev, subcategoryId: v }))} disabled={!formData.categoryId}><SelectTrigger className={errors.subcategoryId ? 'border-destructive' : ''}><SelectValue placeholder="Select sub-category" /></SelectTrigger><SelectContent>{getAvailableSubcategories().map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Qualification *</Label><Select value={formData.qualificationId} onValueChange={(v) => setFormData(prev => ({ ...prev, qualificationId: v }))}><SelectTrigger className={errors.qualificationId ? 'border-destructive' : ''}><SelectValue placeholder="Select qualification" /></SelectTrigger><SelectContent>{QUALIFICATIONS.map(q => <SelectItem key={q.id} value={q.id.toString()}>{q.label}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button onClick={handleSave}><Save className="w-4 h-4 mr-1" />{editingItem ? 'Update' : 'Create'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Profession</AlertDialogTitle><AlertDialogDescription>Delete "{deleteItem?.name}"?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
};
export default ProfessionManager;
