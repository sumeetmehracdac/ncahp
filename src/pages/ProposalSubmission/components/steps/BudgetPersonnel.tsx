import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { BudgetMasterData, ResearchPersonnelItem, PersonnelEmolument, PERSONNEL_DESIGNATIONS } from '../../types';

interface BudgetPersonnelProps {
    data: BudgetMasterData;
    updateData: <K extends keyof BudgetMasterData>(field: K, value: BudgetMasterData[K]) => void;
}

const createEmptyEmolument = (year: string): PersonnelEmolument => ({
    year,
    monthlyEmolument: 0,
    hra: 'No HRA',
    workMonths: 0,
    total: 0,
    medicalAllowance: 0,
    grandTotal: 0,
});

const createEmptyPersonnel = (): ResearchPersonnelItem => ({
    id: crypto.randomUUID(),
    designation: '',
    numberOfPersons: 0,
    detailedJustification: '',
    yearwiseEmoluments: [
        createEmptyEmolument('Year-1'),
        createEmptyEmolument('Year-2'),
        createEmptyEmolument('Year-3'),
    ],
    grossTotal: 0,
    institute: '',
});

const BudgetPersonnel = ({ data, updateData }: BudgetPersonnelProps) => {
    const [formData, setFormData] = useState<ResearchPersonnelItem>(createEmptyPersonnel());
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const updateField = <K extends keyof ResearchPersonnelItem>(field: K, value: ResearchPersonnelItem[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateEmolument = (yearIndex: number, field: keyof PersonnelEmolument, value: number | string) => {
        setFormData(prev => {
            const newEmoluments = [...prev.yearwiseEmoluments];
            newEmoluments[yearIndex] = { ...newEmoluments[yearIndex], [field]: value };

            // Recalculate totals
            const emol = newEmoluments[yearIndex];
            emol.total = emol.monthlyEmolument * emol.workMonths;
            emol.grandTotal = emol.total + emol.medicalAllowance;

            // Recalculate gross total
            const grossTotal = newEmoluments.reduce((sum, e) => sum + e.grandTotal, 0);

            return { ...prev, yearwiseEmoluments: newEmoluments, grossTotal };
        });
    };

    const handleSave = () => {
        if (!formData.designation.trim()) return;

        if (editingId) {
            updateData('personnel', data.personnel.map(item =>
                item.id === editingId ? { ...formData, id: editingId } : item
            ));
            setEditingId(null);
        } else {
            updateData('personnel', [...data.personnel, { ...formData, id: crypto.randomUUID() }]);
        }
        setFormData(createEmptyPersonnel());
    };

    const handleEdit = (item: ResearchPersonnelItem) => {
        setFormData(item);
        setEditingId(item.id);
    };

    const handleCancelEdit = () => {
        setFormData(createEmptyPersonnel());
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        updateData('personnel', data.personnel.filter(item => item.id !== id));
    };

    const handleReset = () => {
        setFormData(createEmptyPersonnel());
        setEditingId(null);
    };

    const filteredItems = data.personnel.filter(item =>
        item.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalBudget = data.personnel.reduce((sum, item) => sum + item.grossTotal, 0);

    return (
        <div className="space-y-8">
            {/* Form Section */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Designation */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Designation <span className="text-destructive">*</span>
                        </Label>
                        <Select value={formData.designation} onValueChange={(v) => updateField('designation', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select designation" />
                            </SelectTrigger>
                            <SelectContent>
                                {PERSONNEL_DESIGNATIONS.map((d) => (
                                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Number of Persons */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Number of Persons</Label>
                        <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={formData.numberOfPersons || ''}
                            onChange={(e) => updateField('numberOfPersons', parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>

                {/* Detailed Justification */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Detailed Justification</Label>
                    <Textarea
                        placeholder="Provide detailed justification..."
                        value={formData.detailedJustification}
                        onChange={(e) => updateField('detailedJustification', e.target.value)}
                        rows={2}
                        className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">{formData.detailedJustification.length} / 500 characters</p>
                </div>

                {/* Year-wise Emoluments Table */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Year-wise Monthly Emolument</Label>
                    <div className="border border-border rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-primary text-white hover:bg-primary">
                                    <TableHead className="text-white font-semibold">Year</TableHead>
                                    <TableHead className="text-white font-semibold">Monthly Emolument (₹)</TableHead>
                                    <TableHead className="text-white font-semibold">HRA</TableHead>
                                    <TableHead className="text-white font-semibold">Work Months</TableHead>
                                    <TableHead className="text-white font-semibold text-right">Total (₹)</TableHead>
                                    <TableHead className="text-white font-semibold">Medical Allow. (₹)</TableHead>
                                    <TableHead className="text-white font-semibold text-right">Grand Total (₹)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {formData.yearwiseEmoluments.map((emol, idx) => (
                                    <TableRow key={emol.year} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">{emol.year}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={emol.monthlyEmolument || ''}
                                                onChange={(e) => updateEmolument(idx, 'monthlyEmolument', parseFloat(e.target.value) || 0)}
                                                className="w-28"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={emol.hra}
                                                onValueChange={(v) => updateEmolument(idx, 'hra', v as 'No HRA' | 'HRA')}
                                            >
                                                <SelectTrigger className="w-28">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="No HRA">No HRA</SelectItem>
                                                    <SelectItem value="HRA">HRA</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={emol.workMonths || ''}
                                                onChange={(e) => updateEmolument(idx, 'workMonths', parseInt(e.target.value) || 0)}
                                                className="w-20"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{emol.total.toLocaleString('en-IN')}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={emol.medicalAllowance || ''}
                                                onChange={(e) => updateEmolument(idx, 'medicalAllowance', parseFloat(e.target.value) || 0)}
                                                className="w-28"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-primary">{emol.grandTotal.toLocaleString('en-IN')}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="bg-muted/50 font-semibold">
                                    <TableCell colSpan={6} className="text-right">Total:</TableCell>
                                    <TableCell className="text-right text-primary">₹{formData.grossTotal.toLocaleString('en-IN')}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <Button onClick={handleSave} className="gap-2 bg-primary hover:bg-primary-dark">
                        {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingId ? 'Update' : 'Add Personnel'}
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
            {data.personnel.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-display font-semibold text-foreground">Research Personnel Budget Detail</h3>
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
                                    <TableHead className="text-white font-semibold">Designation</TableHead>
                                    <TableHead className="text-white font-semibold text-center">No. of Persons</TableHead>
                                    <TableHead className="text-white font-semibold text-right">Gross Total (₹)</TableHead>
                                    <TableHead className="text-white font-semibold">Institute</TableHead>
                                    <TableHead className="text-white font-semibold text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence>
                                    {filteredItems.map((item) => (
                                        <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">{PERSONNEL_DESIGNATIONS.find(d => d.value === item.designation)?.label || item.designation}</TableCell>
                                            <TableCell className="text-center">{item.numberOfPersons}</TableCell>
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

export default BudgetPersonnel;
