import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  Target,
  Award,
  Users,
  Upload,
  ChevronRight,
  IndianRupee,
  FileCheck,
  X,
  Search,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProposalDetailsData, FUNDING_AGENCIES, COPIDetail } from "../types";

// Mock CO-PI data for demonstration
const MOCK_COPI_LIST: COPIDetail[] = [
  { id: "1", name: "Dr. Arun Kumar", designation: "Professor", department: "Cardiology", institution: "AIIMS Delhi" },
  {
    id: "2",
    name: "Dr. Priya Sharma",
    designation: "Associate Professor",
    department: "Neurology",
    institution: "AIIMS Delhi",
  },
  { id: "3", name: "Dr. Rajesh Verma", designation: "Professor", department: "Oncology", institution: "AIIMS Delhi" },
  {
    id: "4",
    name: "Dr. Sunita Rao",
    designation: "Assistant Professor",
    department: "Pediatrics",
    institution: "AIIMS Delhi",
  },
  {
    id: "5",
    name: "Dr. Vikram Singh",
    designation: "Professor",
    department: "Orthopedics",
    institution: "AIIMS Delhi",
  },
  {
    id: "6",
    name: "Dr. Meera Patel",
    designation: "Associate Professor",
    department: "Psychiatry",
    institution: "AIIMS Delhi",
  },
  { id: "7", name: "Dr. Amit Gupta", designation: "Professor", department: "Radiology", institution: "AIIMS Delhi" },
  {
    id: "8",
    name: "Dr. Neha Kapoor",
    designation: "Assistant Professor",
    department: "Dermatology",
    institution: "AIIMS Delhi",
  },
];

interface ProposalDetailsFormProps {
  data: ProposalDetailsData;
  updateData: <K extends keyof ProposalDetailsData>(field: K, value: ProposalDetailsData[K]) => void;
  onContinue: () => void;
}

const ProposalDetailsForm = ({ data, updateData, onContinue }: ProposalDetailsFormProps) => {
  const [copiDialogOpen, setCopiDialogOpen] = useState(false);
  const [copiSearch, setCopiSearch] = useState("");
  const endorsementRef = useRef<HTMLInputElement>(null);
  const proposalRef = useRef<HTMLInputElement>(null);

  const filteredCOPIs = MOCK_COPI_LIST.filter(
    (copi) =>
      copi.name.toLowerCase().includes(copiSearch.toLowerCase()) ||
      copi.department.toLowerCase().includes(copiSearch.toLowerCase()),
  );

  const toggleCOPI = (copi: COPIDetail) => {
    const isSelected = data.coPIs.some((c) => c.id === copi.id);
    if (isSelected) {
      updateData(
        "coPIs",
        data.coPIs.filter((c) => c.id !== copi.id),
      );
    } else {
      updateData("coPIs", [...data.coPIs, copi]);
    }
  };

  const removeCOPI = (id: string) => {
    updateData(
      "coPIs",
      data.coPIs.filter((c) => c.id !== id),
    );
  };

  const handleFileUpload = (field: "endorsementLetter" | "originalProposal", file: File | null) => {
    updateData(field, file);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary backdrop-blur-sm rounded-2xl p-6 text-white shadow-xl border border-primary-dark/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <FileCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Proposal Submission Form</h1>
            <p className="text-white/80 mt-1">Fill in the details for your research proposal</p>
          </div>
        </div>
      </motion.div>

      {/* Main Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-border overflow-hidden"
      >
        <div className="p-6 space-y-8">
          {/* Financial & Administrative Details */}
          <div className="space-y-6">
            <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-accent" />
              Financial & Administrative Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Outlay */}
              <div className="space-y-2">
                <Label htmlFor="totalOutlay" className="text-sm font-medium">
                  Total Outlay <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="totalOutlay"
                    type="text"
                    placeholder="Enter amount in INR"
                    value={data.totalOutlay}
                    onChange={(e) => updateData("totalOutlay", e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Work Order Number */}
              <div className="space-y-2">
                <Label htmlFor="workOrderNumber" className="text-sm font-medium">
                  Administrator Approval / Work Order No. <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="workOrderNumber"
                  type="text"
                  placeholder="Enter work order number"
                  value={data.workOrderNumber}
                  onChange={(e) => updateData("workOrderNumber", e.target.value)}
                />
              </div>

              {/* Work Order Date */}
              <div className="space-y-2">
                <Label htmlFor="workOrderDate" className="text-sm font-medium">
                  Administrator Approval / Work Order Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="workOrderDate"
                  type="date"
                  value={data.workOrderDate}
                  onChange={(e) => updateData("workOrderDate", e.target.value)}
                />
              </div>

              {/* Funding Agency */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Funding Agency <span className="text-destructive">*</span>
                </Label>
                <Select value={data.fundingAgency} onValueChange={(value) => updateData("fundingAgency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select funding agency" />
                  </SelectTrigger>
                  <SelectContent>
                    {FUNDING_AGENCIES.map((agency) => (
                      <SelectItem key={agency.value} value={agency.value}>
                        {agency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Project Timeline */}
          <div className="space-y-6">
            <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              Project Timeline
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium">
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={data.startDate}
                  onChange={(e) => updateData("startDate", e.target.value)}
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium">
                  End Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={data.endDate}
                  onChange={(e) => updateData("endDate", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Project Description */}
          <div className="space-y-6">
            <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Project Description
            </h2>

            <div className="space-y-6">
              {/* Project Title */}
              <div className="space-y-2">
                <Label htmlFor="projectTitle" className="text-sm font-medium">
                  Project Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="projectTitle"
                  type="text"
                  placeholder="Enter the title of your research project"
                  value={data.projectTitle}
                  onChange={(e) => updateData("projectTitle", e.target.value)}
                />
              </div>

              {/* Objective */}
              <div className="space-y-2">
                <Label htmlFor="objective" className="text-sm font-medium">
                  Objective <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="objective"
                  placeholder="Describe the objectives of your research proposal..."
                  value={data.objective}
                  onChange={(e) => updateData("objective", e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">{data.objective.length} / 2000 characters</p>
              </div>

              {/* Deliverables */}
              <div className="space-y-2">
                <Label htmlFor="deliverables" className="text-sm font-medium">
                  Deliverables / Outcome <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="deliverables"
                  placeholder="Describe the expected deliverables and outcomes..."
                  value={data.deliverables}
                  onChange={(e) => updateData("deliverables", e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">{data.deliverables.length} / 2000 characters</p>
              </div>
            </div>
          </div>

          {/* Co-Principal Investigators */}
          <div className="space-y-6">
            <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Co-Principal Investigators (CO-PI)
            </h2>

            {/* Selected CO-PIs Display */}
            <div className="min-h-[120px] bg-muted/30 rounded-xl border-2 border-dashed border-border p-4">
              {data.coPIs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  No CO-PIs selected. Click below to add.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {data.coPIs.map((copi) => (
                    <motion.div
                      key={copi.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1.5"
                    >
                      <span className="text-sm font-medium">{copi.name}</span>
                      <span className="text-xs text-muted-foreground">({copi.department})</span>
                      <button
                        onClick={() => removeCOPI(copi.id)}
                        className="ml-1 p-0.5 hover:bg-primary/20 rounded-full transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Add CO-PI Button */}
            <Dialog open={copiDialogOpen} onOpenChange={setCopiDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Users className="w-4 h-4" />
                  Add CO-PI
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>Select Co-Principal Investigators</DialogTitle>
                </DialogHeader>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or department..."
                    value={copiSearch}
                    onChange={(e) => setCopiSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex-1 overflow-y-auto mt-4 space-y-2">
                  {filteredCOPIs.map((copi) => {
                    const isSelected = data.coPIs.some((c) => c.id === copi.id);
                    return (
                      <button
                        key={copi.id}
                        onClick={() => toggleCOPI(copi)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">{copi.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {copi.designation} • {copi.department}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{copi.institution}</p>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="pt-4 border-t border-border flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setCopiDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setCopiDialogOpen(false)} className="bg-primary hover:bg-primary-dark">
                    Done ({data.coPIs.length} selected)
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Document Upload */}
          <div className="space-y-6">
            <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
              <Upload className="w-5 h-5 text-accent" />
              Document Upload
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Endorsement Letter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Endorsement Letter <span className="text-destructive">*</span>
                </Label>
                <div
                  onClick={() => endorsementRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all"
                >
                  <input
                    ref={endorsementRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFileUpload("endorsementLetter", e.target.files?.[0] || null)}
                  />
                  {data.endorsementLetter ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <FileCheck className="w-5 h-5" />
                      <span className="font-medium">{data.endorsementLetter.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload endorsement letter</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX (max 10MB)</p>
                    </>
                  )}
                </div>
              </div>

              {/* Original Proposal */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Original Proposal Submitted to Funding Agency <span className="text-destructive">*</span>
                </Label>
                <div
                  onClick={() => proposalRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all"
                >
                  <input
                    ref={proposalRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFileUpload("originalProposal", e.target.files?.[0] || null)}
                  />
                  {data.originalProposal ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <FileCheck className="w-5 h-5" />
                      <span className="font-medium">{data.originalProposal.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload original proposal</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX (max 10MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          onClick={onContinue}
          className="gap-2 bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/25 px-8"
        >
          Continue to Budget Details
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProposalDetailsForm;
