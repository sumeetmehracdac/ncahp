import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { BudgetMasterData, EquipmentItem } from '../../types';

interface BudgetEquipmentProps {
    data: BudgetMasterData;
    updateData: <K extends keyof BudgetMasterData>(field: K, value: BudgetMasterData[K]) => void;
}

const createEmptyEquipment = (): EquipmentItem => ({
    id: crypto.randomUUID(),
    genericName: '',
    make: '',
    model: '',
    quantity: 1,
    isImported: false,
    costInINR: 0,
    spareTimePercent: 0,
    detailedJustification: '',
    institute: '',
});

const BudgetEquipment = ({ data, updateData }: BudgetEquipmentProps) => {
    const [formData, setFormData] = useState<EquipmentItem>(createEmptyEquipment());
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const updateField = <K extends keyof EquipmentItem>(field: K, value: EquipmentItem[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!formData.genericName.trim()) return;

        if (editingId) {
            // Update existing
            updateData('equipment', data.equipment.map(item =>
                item.id === editingId ? { ...formData, id: editingId } : item
            ));
            setEditingId(null);
        } else {
            // Add new
            updateData('equipment', [...data.equipment, { ...formData, id: crypto.randomUUID() }]);
        }
        setFormData(createEmptyEquipment());
    };

    const handleEdit = (item: EquipmentItem) => {
        setFormData(item);
        setEditingId(item.id);
    };

    const handleCancelEdit = () => {
        setFormData(createEmptyEquipment());
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        updateData('equipment', data.equipment.filter(item => item.id !== id));
    };

    const handleReset = () => {
        setFormData(createEmptyEquipment());
        setEditingId(null);
    };

    const filteredItems = data.equipment.filter(item =>
        item.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.make.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCost = data.equipment.reduce((sum, item) => sum + (item.costInINR * item.quantity), 0);

    return (
        <div className="space-y-8">
            {/* Form Section */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Generic Name */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Generic Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            placeholder="Enter equipment name"
                            value={formData.genericName}
                            onChange={(e) => updateField('genericName', e.target.value)}
                        />
                    </div>

                    {/* Make */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Make <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            placeholder="Manufacturer"
                            value={formData.make}
                            onChange={(e) => updateField('make', e.target.value)}
                        />
                    </div>

                    {/* Model */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Model</Label>
                        <Input
                            placeholder="Model number"
                            value={formData.model}
                            onChange={(e) => updateField('model', e.target.value)}
                        />
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Quantity <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            type="number"
                            min="1"
                            placeholder="1"
                            value={formData.quantity}
                            onChange={(e) => updateField('quantity', parseInt(e.target.value) || 1)}
                        />
                    </div>

                    {/* Is Imported */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Is Imported?</Label>
                        <div className="flex items-center gap-3 pt-2">
                            <Switch
                                checked={formData.isImported}
                                onCheckedChange={(checked) => updateField('isImported', checked)}
                            />
                            <span className={`text-sm font-medium px-2 py-0.5 rounded ${formData.isImported
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                {formData.isImported ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>

                    {/* Cost in INR */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Cost in INR <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                            <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={formData.costInINR || ''}
                                onChange={(e) => updateField('costInINR', parseFloat(e.target.value) || 0)}
                                className="pl-8"
                            />
                        </div>
                    </div>

                    {/* Spare Time % */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Spare Time for Other Users (%)</Label>
                        <div className="relative">
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="0"
                                value={formData.spareTimePercent || ''}
                                onChange={(e) => updateField('spareTimePercent', parseFloat(e.target.value) || 0)}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                        </div>
                    </div>

                    {/* Institute */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Institute</Label>
                        <Input
                            placeholder="Associated institute"
                            value={formData.institute}
                            onChange={(e) => updateField('institute', e.target.value)}
                        />
                    </div>
                </div>

                {/* Detailed Justification */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Detailed Justification <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                        placeholder="Provide detailed justification for this equipment..."
                        value={formData.detailedJustification}
                        onChange={(e) => updateField('detailedJustification', e.target.value)}
                        rows={3}
                        className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                        {formData.detailedJustification.length} / 500 characters
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <Button onClick={handleSave} className="gap-2 bg-primary hover:bg-primary-dark">
                        {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingId ? 'Update' : 'Add Equipment'}
                    </Button>
                    {editingId && (
                        <Button variant="outline" onClick={handleCancelEdit} className="gap-2">
                            <X className="w-4 h-4" />
                            Cancel
                        </Button>
                    )}
                    <Button variant="outline" onClick={handleReset}>
                        Reset
                    </Button>
                </div>
            </div>

            {/* Saved Items Section */}
            {data.equipment.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-display font-semibold text-foreground">
                            Equipment Budget Detail
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>
                            <div className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-lg">
                                Total: ₹{totalCost.toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-primary text-white hover:bg-primary">
                                    <TableHead className="text-white font-semibold">Generic Name</TableHead>
                                    <TableHead className="text-white font-semibold">Make</TableHead>
                                    <TableHead className="text-white font-semibold">Model</TableHead>
                                    <TableHead className="text-white font-semibold text-center">Qty</TableHead>
                                    <TableHead className="text-white font-semibold text-center">Imported</TableHead>
                                    <TableHead className="text-white font-semibold text-right">Cost (₹)</TableHead>
                                    <TableHead className="text-white font-semibold">Institute</TableHead>
                                    <TableHead className="text-white font-semibold text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence>
                                    {filteredItems.map((item) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="hover:bg-muted/50"
                                        >
                                            <TableCell className="font-medium">{item.genericName}</TableCell>
                                            <TableCell>{item.make}</TableCell>
                                            <TableCell>{item.model || '-'}</TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell className="text-center">
                                                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${item.isImported
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {item.isImported ? 'Yes' : 'No'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {(item.costInINR * item.quantity).toLocaleString('en-IN')}
                                            </TableCell>
                                            <TableCell>{item.institute || '-'}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(item)}
                                                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.id)}
                                                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                    >
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

export default BudgetEquipment;
