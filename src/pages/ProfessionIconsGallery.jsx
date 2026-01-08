import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Package,
  Grid3X3,
  List,
  Filter,
  Check,
  Sparkles,
  FileImage,
  FileCode,
  ChevronDown,
  ExternalLink,
  Microscope,
  FlaskConical,
  Dna,
  Baby,
  Bug,
  Atom,
  TestTube,
  Fingerprint,
  Slice,
  Droplets,
  Shield,
  Beaker,
  ClipboardList,
  Syringe,
  GraduationCap,
  Flame,
  Ambulance,
  HeartPulse,
  Stethoscope,
  MonitorDot,
  Scissors,
  Camera,
  Activity,
  Accessibility,
  Apple,
  Salad,
  Eye,
  Glasses,
  Scan,
  Hand,
  Brain,
  Leaf,
  TreeDeciduous,
  Users,
  HardHat,
  PersonStanding,
  MessageCircle,
  Building2,
  Handshake,
  Scale,
  Heart,
  Footprints,
  Home,
  Move,
  Flower2,
  Sparkle,
  Zap,
  RadioTower,
  Radiation,
  ScanLine,
  AudioWaveform,
  Sun,
  Bone,
  Cpu,
  Settings,
  UserCog,
  Waves,
  Wind,
  Timer,
  BrainCircuit,
  Gauge,
  Pill,
  Moon,
  Pipette,
  FileText,
  Keyboard,
  Database
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import TopUtilityBar from '@/components/layout/TopUtilityBar';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// All 57+ professions organized by category with carefully curated Lucide icons
const professionCategories = [
  {
    id: 'cat1',
    name: 'Medical Laboratory & Life Sciences',
    color: 'hsl(175, 55%, 38%)',
    bgGradient: 'from-teal-500/20 to-cyan-500/20',
    professions: [
      { id: 'p1', name: 'Biotechnologist', icon: Dna, keywords: ['biotech', 'genetics', 'dna'] },
      { id: 'p2', name: 'Biochemist (non-clinical)', icon: FlaskConical, keywords: ['chemistry', 'lab'] },
      { id: 'p3', name: 'Cell Geneticist', icon: Atom, keywords: ['cells', 'genetics'] },
      { id: 'p4', name: 'Clinical Embryologist', icon: Baby, keywords: ['embryo', 'fertility', 'ivf'] },
      { id: 'p5', name: 'Medical Microbiologist', icon: Bug, keywords: ['bacteria', 'virus', 'microbes'] },
      { id: 'p6', name: 'Molecular Biologist', icon: Dna, keywords: ['molecular', 'dna', 'rna'] },
      { id: 'p7', name: 'Molecular Geneticist', icon: Atom, keywords: ['genetics', 'molecular'] },
      { id: 'p8', name: 'Cytotechnologist', icon: Microscope, keywords: ['cells', 'cytology'] },
      { id: 'p9', name: 'Forensic Science Technologist', icon: Fingerprint, keywords: ['forensic', 'crime', 'evidence'] },
      { id: 'p10', name: 'Histotechnologist', icon: Slice, keywords: ['tissue', 'histology', 'pathology'] },
      { id: 'p11', name: 'Hemato Technologist', icon: Droplets, keywords: ['blood', 'hematology'] },
      { id: 'p12', name: 'Immunology Technologist', icon: Shield, keywords: ['immune', 'antibodies'] },
      { id: 'p13', name: 'Medical Laboratory Technologist', icon: Microscope, keywords: ['lab', 'testing'] },
      { id: 'p14', name: 'Medical Laboratory Assistant', icon: ClipboardList, keywords: ['lab', 'assistant'] },
      { id: 'p15', name: 'Medical Laboratory Technician', icon: TestTube, keywords: ['lab', 'technician'] },
      { id: 'p16', name: 'Blood Bank Technician', icon: Syringe, keywords: ['blood', 'transfusion', 'bank'] },
      { id: 'p17', name: 'Research Assistant', icon: GraduationCap, keywords: ['research', 'academic'] },
    ],
  },
  {
    id: 'cat2',
    name: 'Trauma, Burn Care & Surgical / Anaesthesia-related Technology',
    color: 'hsl(0, 84%, 60%)',
    bgGradient: 'from-red-500/20 to-orange-500/20',
    professions: [
      { id: 'p18', name: 'Advance Care Paramedic', icon: Ambulance, keywords: ['emergency', 'paramedic', 'ems'] },
      { id: 'p19', name: 'Burn Care Technologist', icon: Flame, keywords: ['burn', 'wound', 'care'] },
      { id: 'p20', name: 'Emergency Medical Technologist (Paramedic)', icon: HeartPulse, keywords: ['emt', 'emergency'] },
      { id: 'p21', name: 'Anaesthesia Assistants and Technologists', icon: Stethoscope, keywords: ['anesthesia', 'surgery'] },
      { id: 'p22', name: 'Operation Theatre (OT) Technologists', icon: MonitorDot, keywords: ['surgery', 'operation'] },
      { id: 'p23', name: 'Endoscopy and Laparoscopy Technologists', icon: Camera, keywords: ['endoscopy', 'laparoscopy'] },
    ],
  },
  {
    id: 'cat3',
    name: 'Physiotherapy Professional',
    color: 'hsl(142, 76%, 36%)',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    professions: [
      { id: 'p24', name: 'Physiotherapist', icon: Activity, keywords: ['physio', 'physical therapy', 'rehab'] },
    ],
  },
  {
    id: 'cat4',
    name: 'Nutrition Science Professional',
    color: 'hsl(82, 78%, 42%)',
    bgGradient: 'from-lime-500/20 to-green-500/20',
    professions: [
      { id: 'p25', name: 'Dietician', icon: Apple, keywords: ['diet', 'nutrition', 'food'] },
      { id: 'p26', name: 'Nutritionist', icon: Salad, keywords: ['nutrition', 'health', 'food'] },
    ],
  },
  {
    id: 'cat5',
    name: 'Ophthalmic Sciences Professional',
    color: 'hsl(199, 89%, 48%)',
    bgGradient: 'from-sky-500/20 to-blue-500/20',
    professions: [
      { id: 'p27', name: 'Optometrist', icon: Eye, keywords: ['vision', 'eye', 'optometry'] },
      { id: 'p28', name: 'Ophthalmic Assistant', icon: Glasses, keywords: ['eye', 'ophthalmology'] },
      { id: 'p29', name: 'Vision Technician', icon: Scan, keywords: ['vision', 'eye test'] },
    ],
  },
  {
    id: 'cat6',
    name: 'Occupational Therapy Professional',
    color: 'hsl(280, 65%, 50%)',
    bgGradient: 'from-purple-500/20 to-violet-500/20',
    professions: [
      { id: 'p30', name: 'Occupational Therapist', icon: Hand, keywords: ['occupational', 'therapy', 'rehab'] },
    ],
  },
  {
    id: 'cat7',
    name: 'Community Care, Behavioural Health Sciences & Other Professionals',
    color: 'hsl(260, 60%, 58%)',
    bgGradient: 'from-violet-500/20 to-purple-500/20',
    professions: [
      { id: 'p31', name: 'Environment Protection Officer', icon: Leaf, keywords: ['environment', 'protection'] },
      { id: 'p32', name: 'Ecologist', icon: TreeDeciduous, keywords: ['ecology', 'nature', 'environment'] },
      { id: 'p33', name: 'Community Health Practitioner', icon: Users, keywords: ['community', 'health', 'public'] },
      { id: 'p34', name: 'Occupational Health & Safety Officer', icon: HardHat, keywords: ['safety', 'workplace'] },
      { id: 'p35', name: 'Physiologist (except Clinical)', icon: PersonStanding, keywords: ['physiology', 'body'] },
      { id: 'p36', name: 'Behavioural Analyst', icon: Brain, keywords: ['behavior', 'psychology', 'analysis'] },
      { id: 'p37', name: 'Integrated Behaviour Health Counsellor', icon: MessageCircle, keywords: ['counseling', 'mental health'] },
      { id: 'p38', name: 'Rehabilitation and Counselling Consultant', icon: Building2, keywords: ['rehab', 'counseling'] },
      { id: 'p39', name: 'Social Worker', icon: Handshake, keywords: ['social work', 'welfare', 'community'] },
      { id: 'p40', name: 'Medical Immunodology Technologist', icon: Shield, keywords: ['immunology', 'immune'] },
      { id: 'p41', name: 'Family Counsellor', icon: Heart, keywords: ['family', 'counseling', 'therapy'] },
      { id: 'p42', name: 'Mental Health Support Worker', icon: Brain, keywords: ['mental health', 'support'] },
      { id: 'p43', name: 'Podiatrist', icon: Footprints, keywords: ['feet', 'podiatry'] },
      { id: 'p44', name: 'Community Care Professional', icon: Home, keywords: ['community', 'care', 'home'] },
      { id: 'p45', name: 'Movement Therapist', icon: Move, keywords: ['movement', 'therapy', 'dance'] },
      { id: 'p46', name: 'Yoga Therapy Assistant', icon: Flower2, keywords: ['yoga', 'therapy', 'wellness'] },
      { id: 'p47', name: 'Recreational Therapist', icon: Sparkle, keywords: ['recreation', 'therapy', 'leisure'] },
      { id: 'p48', name: 'Acupuncture Professional', icon: Zap, keywords: ['acupuncture', 'alternative medicine'] },
    ],
  },
  {
    id: 'cat8',
    name: 'Medical Radiology, Imaging & Therapeutic Technology',
    color: 'hsl(38, 92%, 50%)',
    bgGradient: 'from-amber-500/20 to-yellow-500/20',
    professions: [
      { id: 'p49', name: 'Medical Physicist', icon: Atom, keywords: ['physics', 'medical', 'radiation'] },
      { id: 'p50', name: 'Nuclear Medicine Technologist', icon: Radiation, keywords: ['nuclear', 'medicine', 'imaging'] },
      { id: 'p51', name: 'Radiology & Imaging Technologist', icon: ScanLine, keywords: ['radiology', 'xray', 'imaging'] },
      { id: 'p52', name: 'Diagnostic Medical Sonographer', icon: AudioWaveform, keywords: ['ultrasound', 'sonography'] },
      { id: 'p53', name: 'Radiotherapy Technologist', icon: Sun, keywords: ['radiotherapy', 'cancer', 'treatment'] },
      { id: 'p54', name: 'Densitometrist', icon: Bone, keywords: ['bone density', 'dexa'] },
    ],
  },
  {
    id: 'cat9',
    name: 'Medical Technologists & Physician Associate',
    color: 'hsl(340, 75%, 55%)',
    bgGradient: 'from-pink-500/20 to-rose-500/20',
    professions: [
      { id: 'p55', name: 'Biomedical Engineer', icon: Cpu, keywords: ['biomedical', 'engineering', 'devices'] },
      { id: 'p56', name: 'Medical Equipment Technologist', icon: Settings, keywords: ['equipment', 'maintenance'] },
      { id: 'p57', name: 'Physician Associate', icon: UserCog, keywords: ['physician', 'assistant', 'pa'] },
      { id: 'p58', name: 'Cardiovascular Technologist', icon: HeartPulse, keywords: ['cardio', 'heart', 'vascular'] },
      { id: 'p59', name: 'Perfusionist', icon: Waves, keywords: ['perfusion', 'heart-lung', 'bypass'] },
      { id: 'p60', name: 'Respiratory Technologist', icon: Wind, keywords: ['respiratory', 'lungs', 'breathing'] },
      { id: 'p61', name: 'Electrocardiogram (ECG) Technologist', icon: Activity, keywords: ['ecg', 'ekg', 'heart'] },
      { id: 'p62', name: 'Electroencephalogram (EEG) Technologist', icon: BrainCircuit, keywords: ['eeg', 'brain', 'neuro'] },
      { id: 'p63', name: 'Electroneuromyography (ENMG) Technologist', icon: Zap, keywords: ['enmg', 'nerve', 'muscle'] },
      { id: 'p64', name: 'Electroneurophysiology Technologist', icon: BrainCircuit, keywords: ['neuro', 'physiology'] },
      { id: 'p65', name: 'Gastrointestinal Technologist', icon: Pill, keywords: ['gi', 'gastro', 'digestive'] },
      { id: 'p66', name: 'Sleep Lab Technologist', icon: Moon, keywords: ['sleep', 'polysomnography'] },
      { id: 'p67', name: 'Dialysis Therapy Technologist', icon: Pipette, keywords: ['dialysis', 'kidney', 'renal'] },
      { id: 'p68', name: 'Lithotripsy Technologist', icon: Gauge, keywords: ['lithotripsy', 'kidney stones'] },
    ],
  },
  {
    id: 'cat10',
    name: 'Health Information Management & Informatics',
    color: 'hsl(210, 80%, 50%)',
    bgGradient: 'from-blue-500/20 to-indigo-500/20',
    professions: [
      { id: 'p69', name: 'Health Information Management Professional', icon: Database, keywords: ['him', 'records', 'data'] },
      { id: 'p70', name: 'Health Information Management Technologist', icon: FileText, keywords: ['him', 'technology'] },
      { id: 'p71', name: 'Clinical Coder', icon: Keyboard, keywords: ['coding', 'icd', 'medical coding'] },
      { id: 'p72', name: 'Medical Secretary and Medical Transcriptionist', icon: ClipboardList, keywords: ['secretary', 'transcription'] },
    ],
  },
];

// Flatten all professions for easy access
const allProfessions = professionCategories.flatMap(cat =>
  cat.professions.map(prof => ({
    ...prof,
    categoryId: cat.id,
    categoryName: cat.name,
    categoryColor: cat.color,
  }))
);

const ProfessionIconsGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isDownloading, setIsDownloading] = useState(false);
  const iconRefs = useRef({});

  // Filter professions based on search and category filters
  const filteredProfessions = useMemo(() => {
    let result = allProfessions;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        prof =>
          prof.name.toLowerCase().includes(query) ||
          prof.keywords.some(kw => kw.includes(query)) ||
          prof.categoryName.toLowerCase().includes(query)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(prof => selectedCategories.includes(prof.categoryId));
    }

    return result;
  }, [searchQuery, selectedCategories]);

  // Toggle icon selection
  const toggleIconSelection = (professionId) => {
    setSelectedIcons(prev =>
      prev.includes(professionId)
        ? prev.filter(id => id !== professionId)
        : [...prev, professionId]
    );
  };

  // Select all visible icons
  const selectAllVisible = () => {
    const visibleIds = filteredProfessions.map(p => p.id);
    setSelectedIcons(visibleIds);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedIcons([]);
  };

  // Generate SVG string from Lucide icon component
  const generateSvgString = (IconComponent, color = 'currentColor') => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">`;
    
    // Create a temporary container to render the icon
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></svg>`;
    
    return svgContent;
  };

  // Download single icon as SVG
  const downloadSvg = async (profession) => {
    const IconComponent = profession.icon;
    const svgElement = document.getElementById(`icon-${profession.id}`);
    
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const fileName = `${profession.name.replace(/[^a-zA-Z0-9]/g, '_')}.svg`;
      saveAs(svgBlob, fileName);
      toast.success(`Downloaded ${fileName}`);
    }
  };

  // Download single icon as PNG
  const downloadPng = async (profession) => {
    const svgElement = document.getElementById(`icon-${profession.id}`);
    
    if (svgElement) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 256;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 256, 256);
        canvas.toBlob((blob) => {
          const fileName = `${profession.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
          saveAs(blob, fileName);
          toast.success(`Downloaded ${fileName}`);
          URL.revokeObjectURL(url);
        }, 'image/png');
      };
      img.src = url;
    }
  };

  // Bulk download selected icons
  const downloadBulk = async (format) => {
    const iconsToDownload = selectedIcons.length > 0
      ? allProfessions.filter(p => selectedIcons.includes(p.id))
      : filteredProfessions;

    if (iconsToDownload.length === 0) {
      toast.error('No icons to download');
      return;
    }

    setIsDownloading(true);
    const zip = new JSZip();

    try {
      for (const profession of iconsToDownload) {
        const svgElement = document.getElementById(`icon-${profession.id}`);
        
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const fileName = profession.name.replace(/[^a-zA-Z0-9]/g, '_');

          if (format === 'svg' || format === 'both') {
            zip.file(`svg/${fileName}.svg`, svgData);
          }

          if (format === 'png' || format === 'both') {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 256;
            canvas.height = 256;

            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            await new Promise((resolve) => {
              const img = new Image();
              img.onload = () => {
                ctx.drawImage(img, 0, 0, 256, 256);
                canvas.toBlob((blob) => {
                  blob.arrayBuffer().then(buffer => {
                    zip.file(`png/${fileName}.png`, buffer);
                    URL.revokeObjectURL(url);
                    resolve();
                  });
                }, 'image/png');
              };
              img.src = url;
            });
          }
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `NCAHP_Profession_Icons_${format.toUpperCase()}.zip`);
      toast.success(`Downloaded ${iconsToDownload.length} icons as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download icons');
    } finally {
      setIsDownloading(false);
    }
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
          <div className="absolute inset-0" style={{ background: 'rgba(4, 20, 30, 0.12)' }} />

          <div className="relative container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white/90 text-sm font-medium">NCAHP Profession Icons</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
                Profession Icons Gallery
              </h1>
              <p className="text-white/80 max-w-2xl mx-auto text-lg font-medium drop-shadow-sm">
                Download curated icons for all 72 Allied Healthcare Professions in SVG & PNG formats
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
                <div className="text-2xl font-bold text-white">{allProfessions.length}</div>
                <div className="text-white/70 text-sm">Professions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
                <div className="text-2xl font-bold text-white">{professionCategories.length}</div>
                <div className="text-white/70 text-sm">Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
                <div className="text-2xl font-bold text-white">2</div>
                <div className="text-white/70 text-sm">Formats (SVG/PNG)</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Search and Filters */}
              <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search professions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Categories
                      {selectedCategories.length > 0 && (
                        <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                          {selectedCategories.length}
                        </Badge>
                      )}
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72 max-h-80 overflow-y-auto">
                    {professionCategories.map(cat => (
                      <DropdownMenuCheckboxItem
                        key={cat.id}
                        checked={selectedCategories.includes(cat.id)}
                        onCheckedChange={(checked) => {
                          setSelectedCategories(prev =>
                            checked
                              ? [...prev, cat.id]
                              : prev.filter(id => id !== cat.id)
                          );
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="truncate text-sm">{cat.name}</span>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* View Mode and Actions */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-lg p-0.5 bg-muted/50">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 px-3"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {selectedIcons.length > 0 && (
                  <Badge variant="secondary" className="py-1.5">
                    {selectedIcons.length} selected
                  </Badge>
                )}

                <Button variant="outline" size="sm" onClick={selectAllVisible}>
                  Select All
                </Button>

                {selectedIcons.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearSelection}>
                    Clear
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 gap-2"
                      disabled={isDownloading}
                    >
                      <Package className="w-4 h-4" />
                      {isDownloading ? 'Downloading...' : 'Bulk Download'}
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem onSelect={() => downloadBulk('svg')}>
                      <FileCode className="w-4 h-4 mr-2" />
                      Download as SVG
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem onSelect={() => downloadBulk('png')}>
                      <FileImage className="w-4 h-4 mr-2" />
                      Download as PNG
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem onSelect={() => downloadBulk('both')}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Both (SVG + PNG)
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Icons Gallery */}
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Showing {filteredProfessions.length} of {allProfessions.length} professions
            </p>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredProfessions.map((profession, index) => {
                  const IconComponent = profession.icon;
                  const isSelected = selectedIcons.includes(profession.id);

                  return (
                    <motion.div
                      key={profession.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className={cn(
                        'group relative bg-card border rounded-2xl p-4 transition-all cursor-pointer hover:shadow-lg hover:border-primary/30',
                        isSelected && 'ring-2 ring-primary border-primary bg-primary/5'
                      )}
                      onClick={() => toggleIconSelection(profession.id)}
                    >
                      {/* Selection Indicator */}
                      <div
                        className={cn(
                          'absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                          isSelected
                            ? 'bg-primary border-primary text-white'
                            : 'border-muted-foreground/30 group-hover:border-primary/50'
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>

                      {/* Icon */}
                      <div
                        className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${profession.categoryColor}15, ${profession.categoryColor}25)`,
                        }}
                      >
                        <IconComponent
                          id={`icon-${profession.id}`}
                          className="w-8 h-8"
                          style={{ color: profession.categoryColor }}
                          strokeWidth={1.5}
                        />
                      </div>

                      {/* Name */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="text-xs font-medium text-center line-clamp-2 text-foreground/80">
                              {profession.name}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{profession.name}</p>
                            <p className="text-xs text-muted-foreground">{profession.categoryName}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Download Actions - Show on Hover */}
                      <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadSvg(profession);
                          }}
                        >
                          <FileCode className="w-3 h-3 mr-1" />
                          SVG
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPng(profession);
                          }}
                        >
                          <FileImage className="w-3 h-3 mr-1" />
                          PNG
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filteredProfessions.map((profession, index) => {
                  const IconComponent = profession.icon;
                  const isSelected = selectedIcons.includes(profession.id);

                  return (
                    <motion.div
                      key={profession.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.01 }}
                      className={cn(
                        'group flex items-center gap-4 bg-card border rounded-xl p-3 transition-all cursor-pointer hover:shadow-md hover:border-primary/30',
                        isSelected && 'ring-2 ring-primary border-primary bg-primary/5'
                      )}
                      onClick={() => toggleIconSelection(profession.id)}
                    >
                      {/* Selection Checkbox */}
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                          isSelected
                            ? 'bg-primary border-primary text-white'
                            : 'border-muted-foreground/30'
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>

                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${profession.categoryColor}15, ${profession.categoryColor}25)`,
                        }}
                      >
                        <IconComponent
                          id={`icon-${profession.id}`}
                          className="w-6 h-6"
                          style={{ color: profession.categoryColor }}
                          strokeWidth={1.5}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {profession.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {profession.categoryName}
                        </p>
                      </div>

                      {/* Download Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadSvg(profession);
                          }}
                        >
                          <FileCode className="w-3.5 h-3.5" />
                          SVG
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPng(profession);
                          }}
                        >
                          <FileImage className="w-3.5 h-3.5" />
                          PNG
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {filteredProfessions.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No professions found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Categories Summary */}
        <div className="bg-muted/30 border-t">
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-xl font-semibold mb-6 text-center">Browse by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {professionCategories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedCategories([cat.id]);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className={cn(
                    'p-4 rounded-xl border bg-card text-left transition-all hover:shadow-md',
                    selectedCategories.includes(cat.id) && 'ring-2 ring-primary'
                  )}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: `${cat.color}20` }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {cat.professions.length} profession{cat.professions.length !== 1 ? 's' : ''}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfessionIconsGallery;
