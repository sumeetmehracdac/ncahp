import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { BudgetMasterData, OtherCostItem, YearwiseCost } from '../../types';

interface BudgetOtherCostProps {
    data: BudgetMasterData;
    updateData: <K extends keyof BudgetMasterData>(field: K, value: BudgetMasterData[K]) => void;
}

const createEmptyOtherCost = (): OtherCostItem => ({
    id: crypto.randomUUID(),
    otherCostType: '',
    detailedJustification: '',
    yearwiseCost: { year1: 0, year2: 0, year3: 0 },
    grossTotal: 0,
    institute: '',
});

const BudgetOtherCost = ({ data, updateData }: BudgetOtherCostProps) => {
    const [formData, setFormData] = useState<OtherCostItem>(createEmptyOtherCost());
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const updateField = <K extends keyof OtherCostItem>(field: K, value: OtherCostItem[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateYearCost = (year: keyof YearwiseCost, value: number) => {
        setFormData(prev => {
            const newCosts = { ...prev.yearwiseCost, [year]: value };
            const grossTotal = newCosts.year1 + newCosts.year2 + newCosts.year3;
            return { ...prev, yearwiseCost: newCosts, grossTotal };
        });
    };

    const handleSave = () => {
        if (!formData.otherCostType.trim()) return;

        if (editingId) {
            updateData('otherCost', data.otherCost.map(item =>
                item.id === editingId ? { ...formData, id: editingId } : item
            ));
            setEditingId(null);
        } else {
            updateData('otherCost', [...data.otherCost, { ...formData, id: crypto.randomUUID() }]);
        }
        setFormData(createEmptyOtherCost());
    };

    const handleEdit = (item: OtherCostItem) => {
        setFormData(item);
        setEditingId(item.id);
    };

    const handleCancelEdit = () => {
        setFormData(createEmptyOtherCost());
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        updateData('otherCost', data.otherCost.filter(item => item.id !== id));
    };

    const handleReset = () => {
        setFormData(createEmptyOtherCost());
        setEditingId(null);
    };

    const totalBudget = data.otherCost.reduce((sum, item) => sum + item.grossTotal, 0);

    return (
        <div className="space-y-8">
            {/* Form Section */}
            <div className="space-y-6">
                {/* Type of Other Cost */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Type of Other Cost <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        placeholder="Specify the type of other cost"
                        value={formData.otherCostType}
                        onChange={(e) => updateField('otherCostType', e.target.value)}
                    />
                </div>

                {/* Detailed Justification */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Detailed Justification</Label>
                    <Textarea
                        placeholder="Provide detailed justification..."
                        value={formData.detailedJustification}
                        onChange={(e) => updateField('detailedJustification', e.target.value)}
                        rows={3}
                        className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">{formData.detailedJustification.length} / 500 characters</p>
                </div>

                {/* Year-wise Cost Table */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Year-wise Other Cost Detail</Label>
                    <div className="border border-border rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-primary text-white hover:bg-primary">
                                    <TableHead className="text-white font-semibold">Year</TableHead>
                                    <TableHead className="text-white font-semibold">Total Cost (₹)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="hover:bg-muted/50">
                                    <TableCell className="font-medium">Year-1</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={formData.yearwiseCost.year1 || ''}
                                            onChange={(e) => updateYearCost('year1', parseFloat(e.target.value) || 0)}
                                            className="w-40"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow className="hover:bg-muted/50">
                                    <TableCell className="font-medium">Year-2</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={formData.yearwiseCost.year2 || ''}
                                            onChange={(e) => updateYearCost('year2', parseFloat(e.target.value) || 0)}
                                            className="w-40"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow className="hover:bg-muted/50">
                                    <TableCell className="font-medium">Year-3</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={formData.yearwiseCost.year3 || ''}
                                            onChange={(e) => updateYearCost('year3', parseFloat(e.target.value) || 0)}
                                            className="w-40"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow className="bg-muted/50 font-semibold">
                                    <TableCell>Gross Total:</TableCell>
                                    <TableCell className="text-primary font-bold">₹{formData.grossTotal.toLocaleString('en-IN')}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <Button onClick={handleSave} className="gap-2 bg-primary hover:bg-primary-dark">
                        {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingId ? 'Update' : 'Add Other Cost'}
                    </Button>
                    {editingId && (
                        <Button variant="outline" onClick={handleCancelEdit} className="gap-2">
                            <X className="w-4 h-4" />
                            Cancel
                        </Button>
                    )}
                    <Button variant="outline" onClick={handleReset}>Reset</Button>
                </div>
            </div>

            {/* Saved Items */}
            {data.otherCost.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-display font-semibold text-foreground">Other Cost Detail Saved as Draft</h3>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-64" />
                            </div>
                            <div className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-lg">
                                Total: ₹{totalBudget.toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-primary text-white hover:bg-primary">
                                    <TableHead className="text-white font-semibold">Other Cost</TableHead>
                                    <TableHead className="text-white font-semibold text-right">Gross Total (₹)</TableHead>
                                    <TableHead className="text-white font-semibold">Institute</TableHead>
                                    <TableHead className="text-white font-semibold text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence>
                                    {data.otherCost.map((item) => (
                                        <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">{item.otherCostType}</TableCell>
                                            <TableCell className="text-right font-medium">{item.grossTotal.toLocaleString('en-IN')}</TableCell>
                                            <TableCell>{item.institute || '-'}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default BudgetOtherCost;
