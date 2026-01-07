import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, GitBranch, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const INITIAL_DATA = [
  { id: 1, name: 'General Physician', code: 'GP', isActive: true },
  { id: 2, name: 'Surgeon', code: 'SURG', isActive: true },
  { id: 3, name: 'Pediatrician', code: 'PEDI', isActive: true },
  { id: 4, name: 'Orthodontist', code: 'ORTHO_D', isActive: true },
  { id: 5, name: 'Staff Nurse', code: 'SN', isActive: true },
  { id: 6, name: 'Clinical Pharmacist', code: 'CLIN_PH', isActive: true },
];

const SubcategoryManager = () => {
  const [subcategories, setSubcategories] = useState(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [errors, setErrors] = useState({});

  const filteredItems = subcategories.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.code.toLowerCase().includes(searchQuery.toLowerCase()));

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.code.trim()) newErrors.code = 'Required';
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
    if (editingItem) { setSubcategories(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...formData } : item)); toast.success('Updated'); }
    else { setSubcategories(prev => [...prev, { id: Date.now(), ...formData, isActive: true }]); toast.success('Added'); }
    setIsDialogOpen(false);
  };

  const handleDelete = () => { setSubcategories(prev => prev.filter(item => item.id !== deleteItem.id)); toast.success('Deleted'); setIsDeleteDialogOpen(false); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
        <Button onClick={() => handleOpenDialog()} className="gap-2"><Plus className="w-4 h-4" />Add Sub-Category</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className="bg-card border rounded-xl p-4 hover:shadow-card-hover transition-all">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-500/20 to-zinc-600/10 border border-zinc-400/20 flex items-center justify-center"><GitBranch className="w-5 h-5 text-accent" /></div>
                <div className="flex-1"><h4 className="font-medium">{item.name}</h4><span className="text-xs font-mono text-muted-foreground">{item.code}</span></div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t">
                <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(item)} className="flex-1 h-8 text-xs"><Edit2 className="w-3 h-3 mr-1" />Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => { setDeleteItem(item); setIsDeleteDialogOpen(true); }} className="h-8 w-8 p-0 text-destructive"><Trash2 className="w-3 h-3" /></Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editingItem ? 'Edit' : 'Add'} Sub-Category</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Name *</Label><Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} /></div>
            <div><Label>Code *</Label><Input value={formData.code} onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))} className="font-mono" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button onClick={handleSave}><Save className="w-4 h-4 mr-1" />Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
};
export default SubcategoryManager;
