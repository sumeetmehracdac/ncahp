import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderTree, GitBranch, Link2, Plus, X, Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const CATEGORIES = [
  { id: 1, name: 'Medical', code: 'MED' },
  { id: 2, name: 'Dental', code: 'DENT' },
  { id: 3, name: 'Nursing', code: 'NURS' },
  { id: 4, name: 'Pharmacy', code: 'PHARM' },
];

const SUBCATEGORIES = [
  { id: 1, name: 'General Physician', code: 'GP' },
  { id: 2, name: 'Surgeon', code: 'SURG' },
  { id: 3, name: 'Pediatrician', code: 'PEDI' },
  { id: 4, name: 'Orthodontist', code: 'ORTHO_D' },
  { id: 5, name: 'Staff Nurse', code: 'SN' },
  { id: 6, name: 'Clinical Pharmacist', code: 'CLIN_PH' },
];

const INITIAL_MAPPINGS = { 1: [1, 2, 3], 2: [4], 3: [5], 4: [6] };

const CategorySubcategoryMapping = () => {
  const [mappings, setMappings] = useState(INITIAL_MAPPINGS);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getMappedSubcategories = (categoryId) => mappings[categoryId] || [];

  const toggleSubcategory = (subcategoryId) => {
    if (!selectedCategory) return;
    setMappings(prev => {
      const current = prev[selectedCategory] || [];
      const updated = current.includes(subcategoryId) ? current.filter(id => id !== subcategoryId) : [...current, subcategoryId];
      return { ...prev, [selectedCategory]: updated };
    });
    toast.success('Mapping updated');
  };

  const filteredSubcategories = SUBCATEGORIES.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-500/5 to-amber-600/10 border border-amber-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center"><Link2 className="w-4 h-4 text-amber-600" /></div>
          <div><h4 className="font-medium text-sm">Map Categories to Sub-Categories</h4><p className="text-sm text-muted-foreground mt-1">Select a category, then choose which sub-categories belong to it. One category can have many sub-categories.</p></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-muted/50 border-b flex items-center gap-2"><FolderTree className="w-4 h-4 text-primary" /><span className="font-medium text-sm">Categories</span></div>
          <div className="p-3 space-y-2">
            {CATEGORIES.map(cat => (
              <motion.button key={cat.id} whileHover={{ scale: 1.01 }} onClick={() => setSelectedCategory(cat.id)} className={cn("w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left", selectedCategory === cat.id ? "border-primary bg-primary/5 shadow-sm" : "border-transparent hover:bg-muted")}>
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", selectedCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted")}><FolderTree className="w-4 h-4" /></div>
                  <div><span className="font-medium text-sm">{cat.name}</span><span className="block text-xs text-muted-foreground font-mono">{cat.code}</span></div>
                </div>
                <Badge variant="secondary" className="text-xs">{getMappedSubcategories(cat.id).length}</Badge>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Subcategories */}
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-muted/50 border-b flex items-center justify-between">
            <div className="flex items-center gap-2"><GitBranch className="w-4 h-4 text-primary" /><span className="font-medium text-sm">Sub-Categories</span></div>
            <Input placeholder="Filter..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-7 w-32 text-xs" />
          </div>
          <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
            {!selectedCategory ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Select a category to map sub-categories</div>
            ) : (
              filteredSubcategories.map(sub => {
                const isLinked = getMappedSubcategories(selectedCategory).includes(sub.id);
                return (
                  <motion.button key={sub.id} whileHover={{ scale: 1.01 }} onClick={() => toggleSubcategory(sub.id)} className={cn("w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left", isLinked ? "border-success/50 bg-success/5" : "border-transparent hover:bg-muted")}>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isLinked ? "bg-success text-success-foreground" : "bg-muted")}>{isLinked ? <Check className="w-4 h-4" /> : <GitBranch className="w-4 h-4" />}</div>
                      <span className="font-medium text-sm">{sub.name}</span>
                    </div>
                    {isLinked && <Badge className="bg-success/20 text-success text-xs">Linked</Badge>}
                  </motion.button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CategorySubcategoryMapping;
