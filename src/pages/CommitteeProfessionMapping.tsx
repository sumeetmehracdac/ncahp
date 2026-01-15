import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  X,
  Users,
  Link2,
  Link2Off,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
  Building2,
  ArrowRight,
  Check,
  Trash2,
  Edit3,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { professionCategories, allProfessions, getIconPath } from "@/data/professions";

// Sample committees data
interface Committee {
  id: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
}

const sampleCommittees: Committee[] = [
  { id: "c1", name: "National Advisory Committee", shortName: "NAC", description: "Provides strategic guidance and policy recommendations", color: "hsl(220, 70%, 50%)" },
  { id: "c2", name: "Ethics and Standards Committee", shortName: "ESC", description: "Oversees professional ethics and practice standards", color: "hsl(280, 65%, 55%)" },
  { id: "c3", name: "Professional Education Committee", shortName: "PEC", description: "Manages curriculum and educational standards", color: "hsl(160, 60%, 45%)" },
  { id: "c4", name: "Registration Review Committee", shortName: "RRC", description: "Reviews and approves professional registrations", color: "hsl(35, 80%, 50%)" },
  { id: "c5", name: "Disciplinary Action Committee", shortName: "DAC", description: "Handles professional misconduct cases", color: "hsl(0, 70%, 55%)" },
  { id: "c6", name: "Continuing Education Committee", shortName: "CEC", description: "Manages ongoing professional development programs", color: "hsl(200, 70%, 50%)" },
  { id: "c7", name: "Research & Innovation Committee", shortName: "RIC", description: "Promotes research and technological advancement", color: "hsl(320, 60%, 55%)" },
  { id: "c8", name: "State Coordination Committee", shortName: "SCC", description: "Coordinates with state-level regulatory bodies", color: "hsl(45, 75%, 50%)" },
  { id: "c9", name: "Quality Assurance Committee", shortName: "QAC", description: "Ensures service quality and compliance", color: "hsl(170, 65%, 45%)" },
  { id: "c10", name: "Grievance Redressal Committee", shortName: "GRC", description: "Addresses professional and public grievances", color: "hsl(10, 70%, 55%)" },
];

// Mapping type: committeeId -> Set of professionIds
type MappingsType = Record<string, Set<string>>;

const CommitteeProfessionMapping = () => {
  const { toast } = useToast();

  // State
  const [committees, setCommittees] = useState<Committee[]>(sampleCommittees);
  const [mappings, setMappings] = useState<MappingsType>({});
  const [selectedCommittee, setSelectedCommittee] = useState<string | null>(null);
  const [searchProfession, setSearchProfession] = useState("");
  const [searchCommittee, setSearchCommittee] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(professionCategories.map(c => c.id)));
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showOnlyMapped, setShowOnlyMapped] = useState(false);

  // Dialog states
  const [isAddCommitteeOpen, setIsAddCommitteeOpen] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(null);
  const [newCommitteeName, setNewCommitteeName] = useState("");
  const [newCommitteeDesc, setNewCommitteeDesc] = useState("");

  // Get mapped profession IDs for selected committee
  const selectedMappings = useMemo(() => {
    if (!selectedCommittee) return new Set<string>();
    return mappings[selectedCommittee] || new Set<string>();
  }, [selectedCommittee, mappings]);

  // Filter professions
  const filteredCategories = useMemo(() => {
    const searchLower = searchProfession.toLowerCase();
    return professionCategories.map(category => {
      // Check if category name or shortName matches the search
      const categoryMatchesSearch =
        category.name.toLowerCase().includes(searchLower) ||
        category.shortName.toLowerCase().includes(searchLower);

      const filteredProfessions = category.professions.filter(prof => {
        // Include profession if either profession name matches OR category matches
        const professionMatchesSearch = prof.name.toLowerCase().includes(searchLower);
        const matchesSearch = professionMatchesSearch || categoryMatchesSearch;
        const isMapped = selectedMappings.has(prof.id);
        const matchesMappedFilter = !showOnlyMapped || isMapped;
        return matchesSearch && matchesMappedFilter;
      });
      return { ...category, professions: filteredProfessions };
    }).filter(cat => cat.professions.length > 0);
  }, [searchProfession, selectedMappings, showOnlyMapped]);

  // Filter committees
  const filteredCommittees = useMemo(() => {
    return committees.filter(c =>
      c.name.toLowerCase().includes(searchCommittee.toLowerCase()) ||
      c.shortName.toLowerCase().includes(searchCommittee.toLowerCase())
    );
  }, [committees, searchCommittee]);

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Toggle profession mapping
  const toggleProfessionMapping = useCallback((professionId: string) => {
    if (!selectedCommittee) {
      toast({
        title: "Select a committee first",
        description: "Please select a committee to map professions to.",
        variant: "destructive",
      });
      return;
    }

    setMappings(prev => {
      const current = prev[selectedCommittee] || new Set<string>();
      const updated = new Set(current);

      if (updated.has(professionId)) {
        updated.delete(professionId);
      } else {
        updated.add(professionId);
      }

      return { ...prev, [selectedCommittee]: updated };
    });
  }, [selectedCommittee, toast]);

  // Map entire category
  const mapEntireCategory = useCallback((categoryId: string, shouldMap: boolean) => {
    if (!selectedCommittee) return;

    const category = professionCategories.find(c => c.id === categoryId);
    if (!category) return;

    setMappings(prev => {
      const current = prev[selectedCommittee] || new Set<string>();
      const updated = new Set(current);

      category.professions.forEach(prof => {
        if (shouldMap) {
          updated.add(prof.id);
        } else {
          updated.delete(prof.id);
        }
      });

      return { ...prev, [selectedCommittee]: updated };
    });

    toast({
      title: shouldMap ? "Category mapped" : "Category unmapped",
      description: `${category.shortName} (${category.professions.length} professions)`,
    });
  }, [selectedCommittee, toast]);

  // Get mapping count for a committee
  const getMappingCount = (committeeId: string) => {
    return mappings[committeeId]?.size || 0;
  };

  // Check if all professions in a category are mapped
  const isCategoryFullyMapped = (categoryId: string) => {
    const category = professionCategories.find(c => c.id === categoryId);
    if (!category || !selectedCommittee) return false;
    const current = mappings[selectedCommittee] || new Set();
    return category.professions.every(p => current.has(p.id));
  };

  // Check if some professions in a category are mapped
  const isCategoryPartiallyMapped = (categoryId: string) => {
    const category = professionCategories.find(c => c.id === categoryId);
    if (!category || !selectedCommittee) return false;
    const current = mappings[selectedCommittee] || new Set();
    const mappedCount = category.professions.filter(p => current.has(p.id)).length;
    return mappedCount > 0 && mappedCount < category.professions.length;
  };

  // Add new committee
  const handleAddCommittee = () => {
    if (!newCommitteeName.trim()) return;

    const newCommittee: Committee = {
      id: `c${Date.now()}`,
      name: newCommitteeName,
      shortName: newCommitteeName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3),
      description: newCommitteeDesc || "New committee",
      color: `hsl(${Math.random() * 360}, 65%, 50%)`,
    };

    setCommittees(prev => [...prev, newCommittee]);
    setNewCommitteeName("");
    setNewCommitteeDesc("");
    setIsAddCommitteeOpen(false);

    toast({
      title: "Committee added",
      description: newCommittee.name,
    });
  };

  // Delete committee
  const handleDeleteCommittee = (committeeId: string) => {
    setCommittees(prev => prev.filter(c => c.id !== committeeId));
    if (selectedCommittee === committeeId) {
      setSelectedCommittee(null);
    }
    setMappings(prev => {
      const { [committeeId]: removed, ...rest } = prev;
      return rest;
    });

    toast({
      title: "Committee deleted",
    });
  };

  // Get selected committee object
  const selectedCommitteeData = committees.find(c => c.id === selectedCommittee);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />

        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <Link2 className="h-6 w-6" />
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                Many-to-Many Mapping
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
              Committee-Profession Mapping
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Define which allied and healthcare professions fall under each regulatory committee's purview.
              Create seamless connections for effective governance.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Building2 className="h-5 w-5 text-white/70" />
                <span className="font-semibold">{committees.length}</span>
                <span className="text-white/70">Committees</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Users className="h-5 w-5 text-white/70" />
                <span className="font-semibold">{allProfessions.length}</span>
                <span className="text-white/70">Professions</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Link2 className="h-5 w-5 text-white/70" />
                <span className="font-semibold">
                  {Object.values(mappings).reduce((sum, set) => sum + set.size, 0)}
                </span>
                <span className="text-white/70">Active Mappings</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-6">

          {/* Left Panel - Committees */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-4"
          >
            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden sticky top-4">
              {/* Committee Header */}
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Committees
                  </h2>
                  <Button
                    size="sm"
                    onClick={() => setIsAddCommitteeOpen(true)}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>

                {/* Committee Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search committees..."
                    value={searchCommittee}
                    onChange={(e) => setSearchCommittee(e.target.value)}
                    className="pl-9 bg-background"
                  />
                </div>
              </div>

              {/* Committee List */}
              <ScrollArea className="h-[calc(100vh-400px)] min-h-[400px]">
                <div className="p-3 space-y-2">
                  <AnimatePresence mode="popLayout">
                    {filteredCommittees.map((committee, index) => {
                      const isSelected = selectedCommittee === committee.id;
                      const mappingCount = getMappingCount(committee.id);

                      return (
                        <motion.div
                          key={committee.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2, delay: index * 0.02 }}
                          onClick={() => setSelectedCommittee(committee.id)}
                          className={`
                            group relative p-4 rounded-xl cursor-pointer transition-all duration-200
                            border-2
                            ${isSelected
                              ? 'bg-primary/5 border-primary shadow-md shadow-primary/10'
                              : 'bg-background border-transparent hover:border-border hover:bg-muted/50'
                            }
                          `}
                        >
                          {/* Selection indicator */}
                          <div className={`
                            absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-200
                            ${isSelected ? 'bg-primary' : 'bg-transparent'}
                          `} />

                          <div className="flex items-start gap-3">
                            {/* Committee Icon */}
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                              style={{ backgroundColor: committee.color }}
                            >
                              {committee.shortName}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm leading-tight mb-1 truncate">
                                {committee.name}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {committee.description}
                              </p>

                              {/* Mapping count badge */}
                              {mappingCount > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="mt-2 text-xs font-medium"
                                >
                                  <Link2 className="h-3 w-3 mr-1" />
                                  {mappingCount} mapped
                                </Badge>
                              )}
                            </div>


                          </div>

                          {/* Selected checkmark */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md"
                            >
                              <Check className="h-3.5 w-3.5 text-primary-foreground" />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </div>
          </motion.div>

          {/* Right Panel - Professions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
              {/* Profession Header */}
              <div className="p-4 border-b bg-muted/30">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Allied & Healthcare Professions
                    <Badge variant="outline" className="ml-2">
                      {allProfessions.length} total
                    </Badge>
                  </h2>

                  <div className="flex items-center gap-2">
                    {/* View Toggle */}
                    <div className="flex items-center bg-muted rounded-lg p-1">
                      <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setViewMode("grid")}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Filter: Show Mapped Only */}
                    <Button
                      variant={showOnlyMapped ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setShowOnlyMapped(!showOnlyMapped)}
                      className="gap-1.5"
                      disabled={!selectedCommittee}
                    >
                      <Filter className="h-4 w-4" />
                      {showOnlyMapped ? "Showing Mapped" : "Show Mapped"}
                    </Button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search professions..."
                    value={searchProfession}
                    onChange={(e) => setSearchProfession(e.target.value)}
                    className="pl-9 bg-background"
                  />
                </div>

                {/* Selected Committee Indicator */}
                {selectedCommitteeData && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: selectedCommitteeData.color }}
                    >
                      {selectedCommitteeData.shortName}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Mapping to: {selectedCommitteeData.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedMappings.size} of {allProfessions.length} professions mapped
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {Math.round((selectedMappings.size / allProfessions.length) * 100)}% coverage
                    </Badge>
                  </motion.div>
                )}

                {!selectedCommittee && (
                  <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-dashed">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Select a committee from the left panel to start mapping professions
                    </p>
                  </div>
                )}
              </div>

              {/* Profession Categories */}
              <ScrollArea className="h-[calc(100vh-400px)] min-h-[500px]">
                <div className="p-4 space-y-4">
                  {filteredCategories.map((category) => {
                    const isExpanded = expandedCategories.has(category.id);
                    const isFullyMapped = isCategoryFullyMapped(category.id);
                    const isPartiallyMapped = isCategoryPartiallyMapped(category.id);
                    const mappedInCategory = category.professions.filter(p => selectedMappings.has(p.id)).length;

                    return (
                      <Collapsible
                        key={category.id}
                        open={isExpanded}
                        onOpenChange={() => toggleCategory(category.id)}
                      >
                        <div className="rounded-xl border bg-background overflow-hidden">
                          {/* Category Header */}
                          <CollapsibleTrigger className="w-full">
                            <div className={`
                              flex items-center justify-between p-4 
                              hover:bg-muted/50 transition-colors
                              ${isExpanded ? 'border-b' : ''}
                            `}>
                              <div className="flex items-center gap-3">
                                <div className={`
                                  w-8 h-8 rounded-lg flex items-center justify-center
                                  ${isFullyMapped ? 'bg-green-100 text-green-600' :
                                    isPartiallyMapped ? 'bg-amber-100 text-amber-600' :
                                      'bg-muted text-muted-foreground'}
                                `}>
                                  {isExpanded ? (
                                    <ChevronDown className="h-5 w-5" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5" />
                                  )}
                                </div>

                                <div className="text-left">
                                  <h3 className="font-medium text-sm">
                                    {category.shortName}
                                  </h3>
                                  <p className="text-xs text-muted-foreground">
                                    {category.professions.length} professions
                                    {selectedCommittee && mappedInCategory > 0 && (
                                      <span className="text-primary ml-1">
                                        • {mappedInCategory} mapped
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>

                              {/* Category Actions */}
                              {selectedCommittee && (
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                  {isFullyMapped ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => mapEntireCategory(category.id, false)}
                                      className="text-xs gap-1"
                                    >
                                      <Link2Off className="h-3 w-3" />
                                      Unmap All
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => mapEntireCategory(category.id, true)}
                                      className="text-xs gap-1"
                                    >
                                      <Link2 className="h-3 w-3" />
                                      Map All
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </CollapsibleTrigger>

                          {/* Category Content */}
                          <CollapsibleContent>
                            <div className={`
                              p-4
                              ${viewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
                                : "space-y-2"
                              }
                            `}>
                              {category.professions.map((profession) => {
                                const isMapped = selectedMappings.has(profession.id);

                                return (
                                  <motion.div
                                    key={profession.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toggleProfessionMapping(profession.id)}
                                    className={`
                                      group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer
                                      transition-all duration-200 border-2
                                      ${isMapped
                                        ? 'bg-primary/5 border-primary shadow-sm'
                                        : 'bg-muted/30 border-transparent hover:border-border hover:bg-muted/50'
                                      }
                                      ${!selectedCommittee ? 'opacity-60 cursor-not-allowed' : ''}
                                    `}
                                  >
                                    {/* Profession Icon */}
                                    <div
                                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-white shadow-sm"
                                      style={{ borderColor: profession.color, borderWidth: '2px' }}
                                    >
                                      <img
                                        src={getIconPath(profession.iconFile)}
                                        alt={profession.name}
                                        className="w-7 h-7 object-contain"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                                        }}
                                      />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium leading-tight line-clamp-2">
                                        {profession.name}
                                      </p>
                                    </div>

                                    {/* Mapping Checkbox */}
                                    <div className={`
                                      w-6 h-6 rounded-full flex items-center justify-center shrink-0
                                      transition-all duration-200
                                      ${isMapped
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted group-hover:bg-muted-foreground/20'
                                      }
                                    `}>
                                      {isMapped ? (
                                        <Check className="h-4 w-4" />
                                      ) : (
                                        <Circle className="h-4 w-4 text-muted-foreground" />
                                      )}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Add Committee Dialog */}
      <Dialog open={isAddCommitteeOpen} onOpenChange={setIsAddCommitteeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add New Committee
            </DialogTitle>
            <DialogDescription>
              Create a new committee for profession mapping.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Committee Name</label>
              <Input
                placeholder="e.g., Technical Standards Committee"
                value={newCommitteeName}
                onChange={(e) => setNewCommitteeName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Input
                placeholder="Brief description of the committee's role"
                value={newCommitteeDesc}
                onChange={(e) => setNewCommitteeDesc(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCommitteeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCommittee} disabled={!newCommitteeName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Committee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default CommitteeProfessionMapping;
