import { Briefcase, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form2BData, Form2BInternship } from "../../types/form2B";

interface Props {
  formData: Form2BData;
  updateFormData: <K extends keyof Form2BData>(field: K, value: Form2BData[K]) => void;
}

const InternshipStep2B = ({ formData, updateFormData }: Props) => {
  const addInternship = () => {
    const newInternship: Form2BInternship = {
      id: Date.now().toString(),
      designation: '',
      organizationNameAddress: '',
      country: '',
      startDate: '',
      completionDate: '',
      totalHours: '',
      coreDuties: '',
      certificate: null
    };
    updateFormData("internships", [...formData.internships, newInternship]);
  };

  const removeInternship = (id: string) => {
    const updated = formData.internships.filter(i => i.id !== id);
    updateFormData("internships", updated);
  };

  const updateInternship = (id: string, field: keyof Form2BInternship, value: string | File | null) => {
    const updated = formData.internships.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    );
    updateFormData("internships", updated);
  };

  return (
    <div className="space-y-8">
      <div className="text-center pb-6 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-2">Internship / Clinical Training</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Add details of your internship or clinical training (if any).</p>
      </div>

      <div className="space-y-6">
        {formData.internships.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">No internship records added yet</p>
            <Button type="button" variant="outline" onClick={addInternship} className="gap-2">
              <Plus className="w-4 h-4" /> Add Internship
            </Button>
          </div>
        ) : (
          <>
            {formData.internships.map((intern, index) => (
              <div key={intern.id} className="p-5 border border-border rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Internship {index + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeInternship(intern.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Designation</Label>
                    <Input value={intern.designation} onChange={(e) => updateInternship(intern.id, 'designation', e.target.value)} placeholder="e.g., Intern" />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input value={intern.country} onChange={(e) => updateInternship(intern.id, 'country', e.target.value)} placeholder="Country of internship" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Organization Name & Address</Label>
                    <Input value={intern.organizationNameAddress} onChange={(e) => updateInternship(intern.id, 'organizationNameAddress', e.target.value)} placeholder="Hospital/Clinic name and address" />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" value={intern.startDate} onChange={(e) => updateInternship(intern.id, 'startDate', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Completion Date</Label>
                    <Input type="date" value={intern.completionDate} onChange={(e) => updateInternship(intern.id, 'completionDate', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Hours</Label>
                    <Input type="number" value={intern.totalHours} onChange={(e) => updateInternship(intern.id, 'totalHours', e.target.value)} placeholder="e.g., 1000" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Core Duties</Label>
                    <Textarea value={intern.coreDuties} onChange={(e) => updateInternship(intern.id, 'coreDuties', e.target.value)} placeholder="Describe your responsibilities" rows={3} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Certificate</Label>
                    <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateInternship(intern.id, 'certificate', e.target.files?.[0] || null)} />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addInternship} className="w-full gap-2">
              <Plus className="w-4 h-4" /> Add Another Internship
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default InternshipStep2B;
