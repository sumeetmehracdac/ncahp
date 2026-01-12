import {
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
  ClipboardList,
  Syringe,
  Flame,
  Ambulance,
  HeartPulse,
  Stethoscope,
  MonitorDot,
  Camera,
  Activity,
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
  Heart,
  Footprints,
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
  BrainCircuit,
  Gauge,
  Pill,
  Moon,
  Pipette,
  type LucideIcon
} from 'lucide-react';

export interface Profession {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  categoryId: string;
  categoryName: string;
}

export interface ProfessionCategory {
  id: string;
  name: string;
  shortName: string;
  professions: Array<{
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
  }>;
}

// Exactly 57 professions from the ZIP file with curated icons organized by category
export const professionCategories: ProfessionCategory[] = [
  {
    id: 'cat1',
    name: 'Medical Laboratory & Life Sciences',
    shortName: 'Lab & Life Sciences',
    professions: [
      { id: 'p1', name: 'Biotechnologist', icon: Dna, color: 'hsl(280, 70%, 55%)' },
      { id: 'p2', name: 'Biochemist (non-clinical)', icon: FlaskConical, color: 'hsl(200, 75%, 45%)' },
      { id: 'p3', name: 'Cell Geneticist', icon: Atom, color: 'hsl(320, 65%, 50%)' },
      { id: 'p4', name: 'Clinical Embryologist', icon: Baby, color: 'hsl(340, 70%, 60%)' },
      { id: 'p5', name: 'Medical Microbiologist', icon: Bug, color: 'hsl(140, 60%, 40%)' },
      { id: 'p6', name: 'Molecular Biologist', icon: Dna, color: 'hsl(260, 65%, 55%)' },
      { id: 'p7', name: 'Molecular Geneticist', icon: Atom, color: 'hsl(290, 60%, 50%)' },
      { id: 'p8', name: 'Cytotechnologist', icon: Microscope, color: 'hsl(175, 55%, 40%)' },
      { id: 'p9', name: 'Forensic Science Technologist', icon: Fingerprint, color: 'hsl(220, 50%, 45%)' },
      { id: 'p10', name: 'Histotechnologist', icon: Slice, color: 'hsl(10, 65%, 50%)' },
      { id: 'p11', name: 'Hemato Technologist', icon: Droplets, color: 'hsl(0, 70%, 50%)' },
      { id: 'p12', name: 'Immunology Technologist', icon: Shield, color: 'hsl(45, 80%, 50%)' },
      { id: 'p13', name: 'Medical Laboratory Technologist', icon: Microscope, color: 'hsl(190, 65%, 45%)' },
      { id: 'p14', name: 'Medical Laboratory Technician', icon: TestTube, color: 'hsl(180, 60%, 42%)' },
      { id: 'p15', name: 'Blood Bank Technician', icon: Syringe, color: 'hsl(355, 75%, 55%)' },
    ],
  },
  {
    id: 'cat2',
    name: 'Trauma, Burn Care & Surgical Technology',
    shortName: 'Trauma & Surgery',
    professions: [
      { id: 'p16', name: 'Advance Care Paramedic', icon: Ambulance, color: 'hsl(0, 80%, 55%)' },
      { id: 'p17', name: 'Burn Care Technologist', icon: Flame, color: 'hsl(25, 90%, 50%)' },
      { id: 'p18', name: 'Emergency Medical Technologist (Paramedic)', icon: HeartPulse, color: 'hsl(350, 85%, 50%)' },
      { id: 'p19', name: 'Anaesthesia Assistants and Technologists', icon: Stethoscope, color: 'hsl(210, 60%, 50%)' },
      { id: 'p20', name: 'Operation Theatre (OT) Technologists', icon: MonitorDot, color: 'hsl(165, 55%, 45%)' },
      { id: 'p21', name: 'Endoscopy and Laparoscopy Technologists', icon: Camera, color: 'hsl(240, 50%, 55%)' },
    ],
  },
  {
    id: 'cat3',
    name: 'Physiotherapy',
    shortName: 'Physiotherapy',
    professions: [
      { id: 'p22', name: 'Physiotherapist', icon: Activity, color: 'hsl(142, 70%, 40%)' },
    ],
  },
  {
    id: 'cat4',
    name: 'Nutrition Science',
    shortName: 'Nutrition',
    professions: [
      { id: 'p23', name: 'Dietician', icon: Apple, color: 'hsl(5, 75%, 55%)' },
      { id: 'p24', name: 'Nutritionist', icon: Salad, color: 'hsl(85, 70%, 45%)' },
    ],
  },
  {
    id: 'cat5',
    name: 'Ophthalmic Sciences',
    shortName: 'Ophthalmic',
    professions: [
      { id: 'p25', name: 'Optometrist', icon: Eye, color: 'hsl(200, 80%, 50%)' },
      { id: 'p26', name: 'Ophthalmic Assistant', icon: Glasses, color: 'hsl(185, 60%, 45%)' },
      { id: 'p27', name: 'Vision Technician', icon: Scan, color: 'hsl(215, 65%, 50%)' },
    ],
  },
  {
    id: 'cat6',
    name: 'Occupational Therapy',
    shortName: 'Occupational Therapy',
    professions: [
      { id: 'p28', name: 'Occupational Therapist', icon: Hand, color: 'hsl(35, 80%, 50%)' },
    ],
  },
  {
    id: 'cat7',
    name: 'Community Care & Behavioural Health',
    shortName: 'Community & Behavioural',
    professions: [
      { id: 'p29', name: 'Environment Protection Officer', icon: Leaf, color: 'hsl(120, 60%, 40%)' },
      { id: 'p30', name: 'Ecologist', icon: TreeDeciduous, color: 'hsl(100, 55%, 42%)' },
      { id: 'p31', name: 'Community Health Practitioner', icon: Users, color: 'hsl(195, 65%, 48%)' },
      { id: 'p32', name: 'Occupational Health & Safety Officer', icon: HardHat, color: 'hsl(45, 90%, 50%)' },
      { id: 'p33', name: 'Physiologist (except Clinical)', icon: PersonStanding, color: 'hsl(170, 55%, 45%)' },
      { id: 'p34', name: 'Behavioural Analyst', icon: Brain, color: 'hsl(280, 55%, 55%)' },
      { id: 'p35', name: 'Integrated Behaviour Health Counsellor', icon: MessageCircle, color: 'hsl(200, 60%, 50%)' },
      { id: 'p36', name: 'Rehabilitation and Counselling Consultant', icon: Building2, color: 'hsl(220, 50%, 50%)' },
      { id: 'p37', name: 'Social Worker', icon: Handshake, color: 'hsl(340, 60%, 55%)' },
      { id: 'p38', name: 'Medical Immunodology Technologist', icon: Shield, color: 'hsl(50, 75%, 48%)' },
      { id: 'p39', name: 'Family Counsellor', icon: Heart, color: 'hsl(350, 70%, 55%)' },
      { id: 'p40', name: 'Mental Health Support Worker', icon: Brain, color: 'hsl(265, 55%, 55%)' },
      { id: 'p41', name: 'Podiatrist', icon: Footprints, color: 'hsl(25, 65%, 50%)' },
    ],
  },
  {
    id: 'cat8',
    name: 'Medical Radiology & Imaging',
    shortName: 'Radiology & Imaging',
    professions: [
      { id: 'p42', name: 'Medical Physicist', icon: Atom, color: 'hsl(250, 60%, 55%)' },
      { id: 'p43', name: 'Nuclear Medicine Technologist', icon: Radiation, color: 'hsl(65, 85%, 45%)' },
      { id: 'p44', name: 'Radiology & Imaging Technologist', icon: ScanLine, color: 'hsl(190, 70%, 45%)' },
      { id: 'p45', name: 'Diagnostic Medical Sonographer', icon: AudioWaveform, color: 'hsl(205, 65%, 50%)' },
      { id: 'p46', name: 'Radiotherapy Technologist', icon: Sun, color: 'hsl(35, 90%, 50%)' },
      { id: 'p47', name: 'Densitometrist', icon: Bone, color: 'hsl(30, 45%, 55%)' },
    ],
  },
  {
    id: 'cat9',
    name: 'Medical Technologists & Physician Associate',
    shortName: 'Med Tech & Physician',
    professions: [
      { id: 'p48', name: 'Biomedical Engineer', icon: Cpu, color: 'hsl(210, 70%, 50%)' },
      { id: 'p49', name: 'Medical Equipment Technologist', icon: Settings, color: 'hsl(225, 50%, 50%)' },
      { id: 'p50', name: 'Physician Associate', icon: UserCog, color: 'hsl(175, 60%, 42%)' },
      { id: 'p51', name: 'Cardiovascular Technologist', icon: HeartPulse, color: 'hsl(0, 75%, 50%)' },
      { id: 'p52', name: 'Perfusionist', icon: Waves, color: 'hsl(355, 65%, 55%)' },
      { id: 'p53', name: 'Respiratory Technologist', icon: Wind, color: 'hsl(195, 70%, 50%)' },
      { id: 'p54', name: 'Electroencephalogram (EEG) Technologist', icon: BrainCircuit, color: 'hsl(270, 55%, 55%)' },
      { id: 'p55', name: 'Gastrointestinal Technologist', icon: Pill, color: 'hsl(20, 70%, 50%)' },
      { id: 'p56', name: 'Sleep Lab Technologist', icon: Moon, color: 'hsl(240, 45%, 55%)' },
      { id: 'p57', name: 'Dialysis Therapy Technologist', icon: Pipette, color: 'hsl(185, 65%, 45%)' },
    ],
  },
];

// Flattened list of all professions with category info (exactly 57 professions)
export const allProfessions: Profession[] = professionCategories.flatMap(cat =>
  cat.professions.map(prof => ({
    ...prof,
    categoryId: cat.id,
    categoryName: cat.name,
  }))
);

// Helper to get profession by name
export const getProfessionByName = (name: string): Profession | undefined => {
  return allProfessions.find(p => p.name === name);
};

// Helper to get profession icon component by name
export const getProfessionIcon = (name: string): LucideIcon | null => {
  const profession = getProfessionByName(name);
  return profession?.icon || null;
};

// Helper to get profession color by name
export const getProfessionColor = (name: string): string => {
  const profession = getProfessionByName(name);
  return profession?.color || 'hsl(180, 60%, 45%)';
};
