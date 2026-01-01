import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Check, 
  ChevronRight, 
  Layers, 
  FolderTree, 
  Users, 
  Sparkles,
  Filter,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import TopUtilityBar from '@/components/layout/TopUtilityBar';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from '@/hooks/use-toast';

// Sample data - 13 Professions
const professions = [
  { id: 'p1', name: 'Medical Laboratory Technologist', icon: '🔬' },
  { id: 'p2', name: 'Optometrist', icon: '👁️' },
  { id: 'p3', name: 'Physiotherapist', icon: '🏃' },
  { id: 'p4', name: 'Occupational Therapist', icon: '🧠' },
  { id: 'p5', name: 'Radiographer', icon: '📡' },
  { id: 'p6', name: 'Speech Therapist', icon: '🗣️' },
  { id: 'p7', name: 'Dietitian/Nutritionist', icon: '🥗' },
  { id: 'p8', name: 'Audiologist', icon: '👂' },
  { id: 'p9', name: 'Perfusionist', icon: '❤️' },
  { id: 'p10', name: 'Respiratory Therapist', icon: '🫁' },
  { id: 'p11', name: 'Orthoptist', icon: '👀' },
  { id: 'p12', name: 'Prosthetist & Orthotist', icon: '🦿' },
  { id: 'p13', name: 'Dialysis Technician', icon: '💉' },
];

// Sample data - 25 Categories
const categories = [
  { id: 'c1', name: 'Diagnostic Services', color: 'hsl(175, 55%, 38%)' },
  { id: 'c2', name: 'Therapeutic Services', color: 'hsl(250, 45%, 55%)' },
  { id: 'c3', name: 'Rehabilitation', color: 'hsl(142, 76%, 36%)' },
  { id: 'c4', name: 'Clinical Support', color: 'hsl(38, 92%, 50%)' },
  { id: 'c5', name: 'Patient Care', color: 'hsl(0, 84%, 60%)' },
  { id: 'c6', name: 'Laboratory Services', color: 'hsl(199, 89%, 48%)' },
  { id: 'c7', name: 'Imaging Services', color: 'hsl(280, 65%, 50%)' },
  { id: 'c8', name: 'Nutrition & Dietetics', color: 'hsl(82, 78%, 42%)' },
  { id: 'c9', name: 'Cardiopulmonary', color: 'hsl(340, 75%, 55%)' },
  { id: 'c10', name: 'Sensory Services', color: 'hsl(25, 95%, 53%)' },
  { id: 'c11', name: 'Mobility & Movement', color: 'hsl(190, 90%, 40%)' },
  { id: 'c12', name: 'Mental Health Support', color: 'hsl(260, 60%, 58%)' },
  { id: 'c13', name: 'Surgical Support', color: 'hsl(350, 80%, 45%)' },
  { id: 'c14', name: 'Emergency Services', color: 'hsl(0, 100%, 50%)' },
  { id: 'c15', name: 'Pediatric Services', color: 'hsl(300, 60%, 60%)' },
  { id: 'c16', name: 'Geriatric Services', color: 'hsl(45, 80%, 45%)' },
  { id: 'c17', name: 'Community Health', color: 'hsl(120, 50%, 45%)' },
  { id: 'c18', name: 'Research & Development', color: 'hsl(210, 80%, 50%)' },
  { id: 'c19', name: 'Quality Assurance', color: 'hsl(170, 70%, 40%)' },
  { id: 'c20', name: 'Education & Training', color: 'hsl(55, 90%, 45%)' },
  { id: 'c21', name: 'Administrative', color: 'hsl(220, 40%, 50%)' },
  { id: 'c22', name: 'Preventive Care', color: 'hsl(150, 65%, 40%)' },
  { id: 'c23', name: 'Palliative Care', color: 'hsl(270, 50%, 55%)' },
  { id: 'c24', name: 'Home Healthcare', color: 'hsl(35, 85%, 50%)' },
  { id: 'c25', name: 'Telemedicine', color: 'hsl(200, 75%, 45%)' },
];

// Sample data - 57 Sub-categories mapped to categories
const subCategories: Record<string, Array<{ id: string; name: string }>> = {
  c1: [
    { id: 's1', name: 'Blood Analysis' },
    { id: 's2', name: 'Pathology Testing' },
    { id: 's3', name: 'Molecular Diagnostics' },
  ],
  c2: [
    { id: 's4', name: 'Physical Therapy' },
    { id: 's5', name: 'Occupational Therapy' },
    { id: 's6', name: 'Speech-Language Therapy' },
  ],
  c3: [
    { id: 's7', name: 'Post-Surgical Rehab' },
    { id: 's8', name: 'Stroke Recovery' },
    { id: 's9', name: 'Sports Injury Rehab' },
  ],
  c4: [
    { id: 's10', name: 'Patient Monitoring' },
    { id: 's11', name: 'Vital Signs Management' },
    { id: 's12', name: 'Clinical Documentation' },
  ],
  c5: [
    { id: 's13', name: 'Bedside Care' },
    { id: 's14', name: 'Patient Education' },
    { id: 's15', name: 'Medication Administration' },
  ],
  c6: [
    { id: 's16', name: 'Hematology' },
    { id: 's17', name: 'Microbiology' },
    { id: 's18', name: 'Biochemistry' },
  ],
  c7: [
    { id: 's19', name: 'X-Ray Imaging' },
    { id: 's20', name: 'MRI Scanning' },
    { id: 's21', name: 'CT Imaging' },
    { id: 's22', name: 'Ultrasound' },
  ],
  c8: [
    { id: 's23', name: 'Clinical Nutrition' },
    { id: 's24', name: 'Diet Planning' },
    { id: 's25', name: 'Nutritional Counseling' },
  ],
  c9: [
    { id: 's26', name: 'Cardiac Care' },
    { id: 's27', name: 'Respiratory Support' },
    { id: 's28', name: 'Perfusion Services' },
  ],
  c10: [
    { id: 's29', name: 'Vision Assessment' },
    { id: 's30', name: 'Hearing Assessment' },
    { id: 's31', name: 'Vestibular Testing' },
  ],
  c11: [
    { id: 's32', name: 'Gait Training' },
    { id: 's33', name: 'Balance Therapy' },
    { id: 's34', name: 'Prosthetic Fitting' },
  ],
  c12: [
    { id: 's35', name: 'Cognitive Therapy' },
    { id: 's36', name: 'Behavioral Support' },
  ],
  c13: [
    { id: 's37', name: 'Intraoperative Support' },
    { id: 's38', name: 'Anesthesia Assistance' },
  ],
  c14: [
    { id: 's39', name: 'Trauma Response' },
    { id: 's40', name: 'Critical Care' },
  ],
  c15: [
    { id: 's41', name: 'Neonatal Care' },
    { id: 's42', name: 'Child Development' },
  ],
  c16: [
    { id: 's43', name: 'Elderly Care' },
    { id: 's44', name: 'Fall Prevention' },
  ],
  c17: [
    { id: 's45', name: 'Health Screening' },
    { id: 's46', name: 'Outreach Programs' },
  ],
  c18: [
    { id: 's47', name: 'Clinical Trials' },
    { id: 's48', name: 'Data Analysis' },
  ],
  c19: [
    { id: 's49', name: 'Standards Compliance' },
    { id: 's50', name: 'Auditing' },
  ],
  c20: [
    { id: 's51', name: 'Staff Training' },
    { id: 's52', name: 'Patient Education' },
  ],
  c21: [
    { id: 's53', name: 'Record Management' },
  ],
  c22: [
    { id: 's54', name: 'Wellness Programs' },
  ],
  c23: [
    { id: 's55', name: 'End-of-Life Care' },
  ],
  c24: [
    { id: 's56', name: 'Home Visits' },
  ],
  c25: [
    { id: 's57', name: 'Remote Consultations' },
  ],
};

type Mapping = {
  professionId: string;
  categoryId: string;
  subCategoryIds: string[];
};

const CategoryMapping = () => {
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [searchProfession, setSearchProfession] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [showMappedOnly, setShowMappedOnly] = useState(false);

  // Get current mapping for selected profession
  const currentProfessionMappings = useMemo(() => {
    return mappings.filter(m => m.professionId === selectedProfession);
  }, [mappings, selectedProfession]);

  // Get mapped category IDs for current profession
  const mappedCategoryIds = useMemo(() => {
    return currentProfessionMappings.map(m => m.categoryId);
  }, [currentProfessionMappings]);

  // Filter professions based on search
  const filteredProfessions = useMemo(() => {
    let result = professions;
    if (searchProfession) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchProfession.toLowerCase())
      );
    }
    if (showMappedOnly) {
      const mappedProfessionIds = [...new Set(mappings.map(m => m.professionId))];
      result = result.filter(p => mappedProfessionIds.includes(p.id));
    }
    return result;
  }, [searchProfession, showMappedOnly, mappings]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (searchCategory) {
      return categories.filter(c => 
        c.name.toLowerCase().includes(searchCategory.toLowerCase())
      );
    }
    return categories;
  }, [searchCategory]);

  // Get sub-categories for selected categories
  const availableSubCategories = useMemo(() => {
    const subs: Array<{ id: string; name: string; categoryId: string; categoryName: string; categoryColor: string }> = [];
    selectedCategories.forEach(catId => {
      const category = categories.find(c => c.id === catId);
      const catSubs = subCategories[catId] || [];
      catSubs.forEach(sub => {
        subs.push({
          ...sub,
          categoryId: catId,
          categoryName: category?.name || '',
          categoryColor: category?.color || 'hsl(175, 55%, 38%)',
        });
      });
    });
    return subs;
  }, [selectedCategories]);

  // Get selected sub-categories for current profession and categories
  const getSelectedSubCategories = useCallback((categoryId: string) => {
    const mapping = currentProfessionMappings.find(m => m.categoryId === categoryId);
    return mapping?.subCategoryIds || [];
  }, [currentProfessionMappings]);

  // Handle category toggle
  const toggleCategory = useCallback((categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  }, []);

  // Handle sub-category toggle
  const toggleSubCategory = useCallback((categoryId: string, subCategoryId: string) => {
    if (!selectedProfession) return;

    setMappings(prev => {
      const existingMappingIndex = prev.findIndex(
        m => m.professionId === selectedProfession && m.categoryId === categoryId
      );

      if (existingMappingIndex >= 0) {
        const mapping = prev[existingMappingIndex];
        const newSubIds = mapping.subCategoryIds.includes(subCategoryId)
          ? mapping.subCategoryIds.filter(id => id !== subCategoryId)
          : [...mapping.subCategoryIds, subCategoryId];

        if (newSubIds.length === 0) {
          return prev.filter((_, i) => i !== existingMappingIndex);
        }

        const newMappings = [...prev];
        newMappings[existingMappingIndex] = { ...mapping, subCategoryIds: newSubIds };
        return newMappings;
      }

      return [...prev, {
        professionId: selectedProfession,
        categoryId,
        subCategoryIds: [subCategoryId],
      }];
    });
  }, [selectedProfession]);

  // Select all sub-categories for a category
  const selectAllSubCategories = useCallback((categoryId: string) => {
    if (!selectedProfession) return;
    const allSubIds = (subCategories[categoryId] || []).map(s => s.id);
    
    setMappings(prev => {
      const existingMappingIndex = prev.findIndex(
        m => m.professionId === selectedProfession && m.categoryId === categoryId
      );

      if (existingMappingIndex >= 0) {
        const newMappings = [...prev];
        newMappings[existingMappingIndex] = {
          ...newMappings[existingMappingIndex],
          subCategoryIds: allSubIds,
        };
        return newMappings;
      }

      return [...prev, {
        professionId: selectedProfession,
        categoryId,
        subCategoryIds: allSubIds,
      }];
    });
  }, [selectedProfession]);

  // Calculate mapping progress
  const mappingProgress = useMemo(() => {
    const mappedProfessions = [...new Set(mappings.map(m => m.professionId))].length;
    return Math.round((mappedProfessions / professions.length) * 100);
  }, [mappings]);

  // Get mapping count for a profession
  const getMappingCount = useCallback((professionId: string) => {
    return mappings.filter(m => m.professionId === professionId).length;
  }, [mappings]);

  // Save mappings
  const handleSave = () => {
    toast({
      title: "Mappings Saved",
      description: `Successfully saved ${mappings.length} mapping configurations.`,
    });
  };

  // Reset mappings
  const handleReset = () => {
    setMappings([]);
    setSelectedCategories([]);
    setSelectedProfession(null);
    toast({
      title: "Reset Complete",
      description: "All mappings have been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopUtilityBar />
      <Header />
      <Navbar />

      <main className="flex-1">
        {/* Hero Header */}
        <div className="relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-95"
            style={{
              background: 'linear-gradient(135deg, hsl(175, 79%, 27%) 0%, hsl(180, 84%, 16%) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6bTAgMTJ2Nmg2di02aC02em0wIDEydjZoNnYtNmgtNnptLTEyLTEydjZoNnYtNmgtNnptMCAxMnY2aDZ2LTZoLTZ6bTAtMjR2Nmg2di02aC02em0wIDM2djZoNnYtNmgtNnptLTEyLTEydjZoNnYtNmgtNnptMCAxMnY2aDZ2LTZoLTZ6bTAtMjR2Nmg2di02aC02em0wLTEydjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          
          <div className="relative container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white/90 text-sm font-medium">Profession Mapping System</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
                Category & Sub-Category Mapping
              </h1>
              <p className="text-white/80 max-w-2xl mx-auto text-lg">
                Map professions to their relevant categories and sub-categories with an intuitive visual interface
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 max-w-md mx-auto"
            >
              <div className="flex items-center justify-between text-white/80 text-sm mb-2">
                <span>Mapping Progress</span>
                <span className="font-semibold">{mappingProgress}% Complete</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mappingProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-card border-b border-border sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMappedOnly(!showMappedOnly)}
                  className={cn(
                    "transition-all",
                    showMappedOnly && "bg-primary/10 border-primary text-primary"
                  )}
                >
                  {showMappedOnly ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showMappedOnly ? 'Show All' : 'Mapped Only'}
                </Button>
                <Badge variant="secondary" className="py-1.5">
                  <Layers className="w-3 h-3 mr-1" />
                  {mappings.length} Mappings
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button size="sm" onClick={handleSave} className="bg-primary hover:bg-primary-dark">
                  <Save className="w-4 h-4 mr-2" />
                  Save Mappings
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Three Column Mapping Interface */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Column 1: Professions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-3"
            >
              <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">Professions</h2>
                      <p className="text-xs text-muted-foreground">{professions.length} available</p>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search professions..."
                      value={searchProfession}
                      onChange={(e) => setSearchProfession(e.target.value)}
                      className="pl-9 bg-background"
                    />
                  </div>
                </div>
                <ScrollArea className="h-[500px]">
                  <div className="p-2">
                    <AnimatePresence mode="popLayout">
                      {filteredProfessions.map((profession, index) => {
                        const isSelected = selectedProfession === profession.id;
                        const mappingCount = getMappingCount(profession.id);
                        const isMapped = mappingCount > 0;

                        return (
                          <motion.button
                            key={profession.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            onClick={() => {
                              setSelectedProfession(profession.id);
                              setSelectedCategories(mappedCategoryIds);
                            }}
                            className={cn(
                              "w-full text-left p-3 rounded-xl mb-2 transition-all duration-200 group",
                              "hover:shadow-md hover:-translate-y-0.5",
                              isSelected 
                                ? "bg-primary text-primary-foreground shadow-primary" 
                                : "bg-background hover:bg-muted border border-transparent hover:border-border"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{profession.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  "font-medium text-sm truncate",
                                  isSelected ? "text-primary-foreground" : "text-foreground"
                                )}>
                                  {profession.name}
                                </p>
                                {isMapped && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <CheckCircle2 className={cn(
                                      "w-3 h-3",
                                      isSelected ? "text-primary-foreground/80" : "text-success"
                                    )} />
                                    <span className={cn(
                                      "text-xs",
                                      isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                                    )}>
                                      {mappingCount} {mappingCount === 1 ? 'category' : 'categories'}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <ChevronRight className={cn(
                                "w-4 h-4 transition-transform",
                                isSelected ? "text-primary-foreground translate-x-1" : "text-muted-foreground group-hover:translate-x-1"
                              )} />
                            </div>
                          </motion.button>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </div>
            </motion.div>

            {/* Column 2: Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-4"
            >
              <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-accent/5 to-accent/10 border-b border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <FolderTree className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">Categories</h2>
                      <p className="text-xs text-muted-foreground">
                        {selectedProfession 
                          ? `Select categories for mapping`
                          : 'Select a profession first'}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search categories..."
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      className="pl-9 bg-background"
                      disabled={!selectedProfession}
                    />
                  </div>
                </div>
                <ScrollArea className="h-[500px]">
                  <div className="p-2">
                    {!selectedProfession ? (
                      <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
                        <div className="p-4 bg-muted rounded-full mb-4">
                          <ArrowRight className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">
                          Select a profession from the left panel to start mapping categories
                        </p>
                      </div>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {filteredCategories.map((category, index) => {
                          const isSelected = selectedCategories.includes(category.id);
                          const isMapped = mappedCategoryIds.includes(category.id);
                          const subCount = (subCategories[category.id] || []).length;

                          return (
                            <motion.button
                              key={category.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2, delay: index * 0.02 }}
                              onClick={() => toggleCategory(category.id)}
                              className={cn(
                                "w-full text-left p-3 rounded-xl mb-2 transition-all duration-200",
                                "hover:shadow-md hover:-translate-y-0.5 border",
                                isSelected 
                                  ? "border-accent bg-accent/5 shadow-sm" 
                                  : "border-transparent bg-background hover:bg-muted hover:border-border"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div 
                                  className={cn(
                                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                                    isSelected 
                                      ? "border-accent bg-accent" 
                                      : "border-border"
                                  )}
                                >
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <div 
                                  className="w-3 h-3 rounded-full shrink-0"
                                  style={{ backgroundColor: category.color }}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm text-foreground truncate">
                                    {category.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {subCount} sub-categories
                                  </p>
                                </div>
                                {isMapped && (
                                  <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
                                    Mapped
                                  </Badge>
                                )}
                              </div>
                            </motion.button>
                          );
                        })}
                      </AnimatePresence>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>

            {/* Column 3: Sub-categories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-success/5 to-success/10 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <Layers className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">Sub-Categories</h2>
                      <p className="text-xs text-muted-foreground">
                        {selectedCategories.length > 0 
                          ? `${availableSubCategories.length} sub-categories available`
                          : 'Select categories to see sub-categories'}
                      </p>
                    </div>
                  </div>
                </div>
                <ScrollArea className="h-[500px]">
                  <div className="p-2">
                    {selectedCategories.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
                        <div className="p-4 bg-muted rounded-full mb-4">
                          <Layers className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">
                          {selectedProfession 
                            ? 'Select one or more categories to see available sub-categories'
                            : 'Select a profession and categories to start mapping'}
                        </p>
                      </div>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {selectedCategories.map((categoryId) => {
                          const category = categories.find(c => c.id === categoryId);
                          const subs = subCategories[categoryId] || [];
                          const selectedSubs = getSelectedSubCategories(categoryId);
                          const allSelected = subs.length > 0 && selectedSubs.length === subs.length;

                          return (
                            <motion.div
                              key={categoryId}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="mb-4"
                            >
                              <div className="flex items-center justify-between mb-2 px-2">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: category?.color }}
                                  />
                                  <span className="text-sm font-medium text-foreground">
                                    {category?.name}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {selectedSubs.length}/{subs.length}
                                  </Badge>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => selectAllSubCategories(categoryId)}
                                  disabled={!selectedProfession || allSelected}
                                  className="text-xs h-7"
                                >
                                  Select All
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {subs.map((sub) => {
                                  const isSelected = selectedSubs.includes(sub.id);

                                  return (
                                    <motion.button
                                      key={sub.id}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => toggleSubCategory(categoryId, sub.id)}
                                      disabled={!selectedProfession}
                                      className={cn(
                                        "p-3 rounded-lg text-left transition-all duration-200 border",
                                        "hover:shadow-sm",
                                        isSelected 
                                          ? "border-success bg-success/5" 
                                          : "border-border bg-background hover:bg-muted"
                                      )}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className={cn(
                                          "w-4 h-4 rounded border flex items-center justify-center transition-all",
                                          isSelected 
                                            ? "bg-success border-success" 
                                            : "border-border"
                                        )}>
                                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        <span className={cn(
                                          "text-sm",
                                          isSelected ? "font-medium text-foreground" : "text-muted-foreground"
                                        )}>
                                          {sub.name}
                                        </span>
                                      </div>
                                    </motion.button>
                                  );
                                })}
                              </div>
                              <Separator className="mt-4" />
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          </div>

          {/* Mapping Summary */}
          {selectedProfession && currentProfessionMappings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8"
            >
              <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-primary/5 via-accent/5 to-success/5 border-b border-border">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    Current Mapping Summary
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Showing mappings for: <span className="font-medium text-foreground">
                      {professions.find(p => p.id === selectedProfession)?.name}
                    </span>
                  </p>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-3">
                    {currentProfessionMappings.map((mapping) => {
                      const category = categories.find(c => c.id === mapping.categoryId);
                      const subs = mapping.subCategoryIds.map(sId => {
                        const allSubs = subCategories[mapping.categoryId] || [];
                        return allSubs.find(s => s.id === sId);
                      }).filter(Boolean);

                      return (
                        <motion.div
                          key={mapping.categoryId}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-background rounded-xl p-3 border border-border"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category?.color }}
                            />
                            <span className="font-medium text-sm text-foreground">
                              {category?.name}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {subs.map((sub) => (
                              <Badge 
                                key={sub?.id} 
                                variant="secondary"
                                className="text-xs bg-muted"
                              >
                                {sub?.name}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryMapping;
