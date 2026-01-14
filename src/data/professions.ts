// Profession data with PNG icons from src/assets/profession-icons
// 57 Allied Healthcare Professions organized into 10 categories

export interface Profession {
  id: string;
  name: string;
  iconPath: string;
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
    iconPath: string;
    color: string;
  }>;
}

// Helper to convert profession name to icon filename
const toIconPath = (name: string): string => {
  const filename = name
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `/src/assets/profession-icons/${filename}.png`;
};

// Exactly 57 professions from the official list organized by 10 categories
export const professionCategories: ProfessionCategory[] = [
  {
    id: "cat1",
    name: "Medical Laboratory and Life Sciences",
    shortName: "Medical Laboratory & Life Sciences",
    professions: [
      { id: "p1", name: "Biotechnologist", iconPath: toIconPath("Biotechnologist"), color: "hsl(280, 70%, 55%)" },
      { id: "p2", name: "Biochemist (nonclinical)", iconPath: toIconPath("Biochemist (nonclinical)"), color: "hsl(200, 75%, 45%)" },
      { id: "p3", name: "Cell Geneticist", iconPath: toIconPath("Cell Geneticist"), color: "hsl(320, 65%, 50%)" },
      { id: "p4", name: "Microbiologist (nonclinical)", iconPath: toIconPath("Microbiologist (nonclinical)"), color: "hsl(160, 70%, 45%)" },
      { id: "p5", name: "Molecular Biologist (nonclinical)", iconPath: toIconPath("Molecular Biologist (nonclinical)"), color: "hsl(210, 70%, 50%)" },
      { id: "p6", name: "Molecular Geneticist", iconPath: toIconPath("Molecular Geneticist"), color: "hsl(300, 65%, 52%)" },
      { id: "p7", name: "Cytotechnologist", iconPath: toIconPath("Cytotechnologist"), color: "hsl(250, 70%, 55%)" },
      { id: "p8", name: "Forensic Science Technologist", iconPath: toIconPath("Forensic Science Technologist"), color: "hsl(10, 75%, 50%)" },
      { id: "p9", name: "Histotechnologist", iconPath: toIconPath("Histotechnologist"), color: "hsl(340, 70%, 55%)" },
      { id: "p10", name: "Hemato Technologist", iconPath: toIconPath("Hemato Technologist"), color: "hsl(0, 75%, 50%)" },
      { id: "p11", name: "Medical Lab Technologist", iconPath: toIconPath("Medical Lab Technologist"), color: "hsl(190, 70%, 45%)" },
    ],
  },
  {
    id: "cat2",
    name: "Trauma, Burn Care and Surgical/Anesthesia related technology",
    shortName: "Trauma & Surgical Technology",
    professions: [
      { id: "p12", name: "Advance Care Paramedic", iconPath: toIconPath("Advance Care Paramedic"), color: "hsl(0, 80%, 55%)" },
      { id: "p13", name: "Burn Care Technologist", iconPath: toIconPath("Burn Care Technologist"), color: "hsl(25, 90%, 50%)" },
      { id: "p14", name: "Emergency Medical Technologist (Paramedic)", iconPath: toIconPath("Emergency Medical Technologist (Paramedic)"), color: "hsl(350, 85%, 50%)" },
      { id: "p15", name: "Anaesthesia Assistants and Technologists", iconPath: toIconPath("Anaesthesia Assistants and Technologists"), color: "hsl(210, 60%, 50%)" },
      { id: "p16", name: "Operation Theatre (OT) Technologists", iconPath: toIconPath("Operation Theatre (OT) Technologists"), color: "hsl(165, 55%, 45%)" },
      { id: "p17", name: "Endoscopy and Laparoscopy Technologists", iconPath: toIconPath("Endoscopy and Laparoscopy Technologists"), color: "hsl(240, 50%, 55%)" },
    ],
  },
  {
    id: "cat3",
    name: "Physiotherapy Professional",
    shortName: "Physiotherapy",
    professions: [
      { id: "p18", name: "Physiotherapist", iconPath: toIconPath("Physiotherapist"), color: "hsl(142, 70%, 40%)" },
    ],
  },
  {
    id: "cat4",
    name: "Nutrition Science Professional",
    shortName: "Nutrition Science",
    professions: [
      { id: "p19", name: "Dietician (including Clinical Dietician, Food Service Dietician)", iconPath: toIconPath("Dietician (including Clinical Dietician, Food Service Dietician)"), color: "hsl(5, 75%, 55%)" },
      { id: "p20", name: "Nutritionist (including Public Health Nutritionist, Sports Nutritionist)", iconPath: toIconPath("Nutritionist (including Public Health Nutritionist, Sports Nutritionist)"), color: "hsl(85, 70%, 45%)" },
    ],
  },
  {
    id: "cat5",
    name: "Ophthalmic Sciences Professional",
    shortName: "Ophthalmic Sciences",
    professions: [
      { id: "p21", name: "Optometrist", iconPath: toIconPath("Optometrist"), color: "hsl(200, 80%, 50%)" },
      { id: "p22", name: "Ophthalmic Assistant", iconPath: toIconPath("Ophthalmic Assistant"), color: "hsl(185, 60%, 45%)" },
      { id: "p23", name: "Vision Technician", iconPath: toIconPath("Vision Technician"), color: "hsl(215, 65%, 50%)" },
    ],
  },
  {
    id: "cat6",
    name: "Occupational Therapy Professional",
    shortName: "Occupational Therapy",
    professions: [
      { id: "p24", name: "Occupational Therapist", iconPath: toIconPath("Occupational Therapist"), color: "hsl(35, 80%, 50%)" },
    ],
  },
  {
    id: "cat7",
    name: "Community Care, Behavioural Health Sciences and other Professionals",
    shortName: "Community & Behavioural Health",
    professions: [
      { id: "p25", name: "Environment Protection Officer", iconPath: toIconPath("Environment Protection Officer"), color: "hsl(120, 60%, 40%)" },
      { id: "p26", name: "Ecologist", iconPath: toIconPath("Ecologist"), color: "hsl(100, 55%, 42%)" },
      { id: "p27", name: "Community Health promoters", iconPath: toIconPath("Community Health promoters"), color: "hsl(195, 65%, 48%)" },
      { id: "p28", name: "Occupational Health and Safety Officer (Inspector)", iconPath: toIconPath("Occupational Health and Safety Officer (Inspector)"), color: "hsl(45, 90%, 50%)" },
      { id: "p29", name: "Psychologist (Except Clinical Psychologist covered under RCI for PWD)", iconPath: toIconPath("Psychologist (Except Clinical Psychologist covered under RCI for PWD)"), color: "hsl(280, 55%, 55%)" },
      { id: "p30", name: "Behavioural Analyst", iconPath: toIconPath("Behavioural Analyst"), color: "hsl(270, 55%, 55%)" },
      { id: "p31", name: "Integrated Behaviour Health Counsellor", iconPath: toIconPath("Integrated Behaviour Health Counsellor"), color: "hsl(200, 60%, 50%)" },
      { id: "p32", name: "Health Educator and Counsellors (including Disease Counsellors, Diabetes Educators, Lactation Consultants)", iconPath: toIconPath("Health Educator and Counsellors (including Disease Counsellors, Diabetes Educators, Lactation Consultants)"), color: "hsl(220, 55%, 50%)" },
      { id: "p33", name: "Social workers (including Clinical Social Worker, Psychiatric Social Worker, Medical Social Worker)", iconPath: toIconPath("Social workers (including Clinical Social Worker, Psychiatric Social Worker, Medical Social Worker)"), color: "hsl(340, 60%, 55%)" },
      { id: "p34", name: "Human Immunodeficiency Virus (HIV) Counsellors or Family Planning Counsellors", iconPath: toIconPath("Human Immunodeficiency Virus (HIV) Counsellors or Family Planning Counsellors"), color: "hsl(350, 70%, 55%)" },
      { id: "p35", name: "Mental Health Support Workers", iconPath: toIconPath("Mental Health Support Workers"), color: "hsl(265, 55%, 55%)" },
      { id: "p36", name: "Podiatrist", iconPath: toIconPath("Podiatrist"), color: "hsl(25, 65%, 50%)" },
      { id: "p37", name: "Palliative Care Professionals", iconPath: toIconPath("Palliative Care Professionals"), color: "hsl(180, 50%, 45%)" },
      { id: "p38", name: "Movement Therapist (including Art, Dance and Movement Therapist or Recreational Therapist)", iconPath: toIconPath("Movement Therapist (including Art, Dance and Movement Therapist or Recreational Therapist)"), color: "hsl(300, 55%, 55%)" },
      { id: "p39", name: "Acupuncture Professionals", iconPath: toIconPath("Acupuncture Professionals"), color: "hsl(55, 80%, 48%)" },
    ],
  },
  {
    id: "cat8",
    name: "Medical Radiology, Imaging and Therapeutic Technology Professional",
    shortName: "Radiology & Imaging",
    professions: [
      { id: "p40", name: "Medical Physicist", iconPath: toIconPath("Medical Physicist"), color: "hsl(250, 60%, 55%)" },
      { id: "p41", name: "Nuclear Medicine Technologist", iconPath: toIconPath("Nuclear Medicine Technologist"), color: "hsl(65, 85%, 45%)" },
      { id: "p42", name: "Radiology and Imaging Technologist (Diagnostic Medical Radiographer, Magnetic Resonance Imaging (MRI), Computed Tomography (CT), Mammographer, Diagnostic Medical Sonographers)", iconPath: toIconPath("Radiology and Imaging Technologist (Diagnostic Medical Radiographer, Magnetic Resonance Imaging (MRI), Computed Tomography (CT), Mammographer, Diagnostic Medical Sonographers)"), color: "hsl(190, 70%, 45%)" },
      { id: "p43", name: "Radiotherapy Technologist", iconPath: toIconPath("Radiotherapy Technologist"), color: "hsl(35, 90%, 50%)" },
      { id: "p44", name: "Dosimetrist", iconPath: toIconPath("Dosimetrist"), color: "hsl(30, 45%, 55%)" },
    ],
  },
  {
    id: "cat9",
    name: "Medical Technologists and Physician Associate",
    shortName: "Medical Technologists",
    professions: [
      { id: "p45", name: "Biomedical Engineer", iconPath: toIconPath("Biomedical Engineer"), color: "hsl(210, 70%, 50%)" },
      { id: "p46", name: "Medical Equipment Technologist", iconPath: toIconPath("Medical Equipment Technologist"), color: "hsl(225, 50%, 50%)" },
      { id: "p47", name: "Physician Associates", iconPath: toIconPath("Physician Associates"), color: "hsl(175, 60%, 42%)" },
      { id: "p48", name: "Cardiovascular Technologists", iconPath: toIconPath("Cardiovascular Technologists"), color: "hsl(0, 75%, 50%)" },
      { id: "p49", name: "Perfusionist", iconPath: toIconPath("Perfusionist"), color: "hsl(355, 65%, 55%)" },
      { id: "p50", name: "Respiratory Technologist", iconPath: toIconPath("Respiratory Technologist"), color: "hsl(195, 70%, 50%)" },
      { id: "p51", name: "Electrocardiogram (ECG) Technologist or Echocardiogram (ECHO) Technologist", iconPath: toIconPath("Electrocardiogram (ECG) Technologist or Echocardiogram (ECHO) Technologist"), color: "hsl(5, 70%, 50%)" },
      { id: "p52", name: "Electroencephalogram (EEG) or Electroneurodiagnostic (END) or Electromyography (EMG) Technologists or Neuro Lab Technologists or Sleep Lab Technologists", iconPath: toIconPath("Electroencephalogram (EEG) or Electroneurodiagnostic (END) or Electromyography (EMG) Technologists or Neuro Lab Technologists or Sleep Lab Technologists"), color: "hsl(270, 55%, 55%)" },
      { id: "p53", name: "Dialysis Therapy Technologists or Urology Technologists", iconPath: toIconPath("Dialysis Therapy Technologists or Urology Technologists"), color: "hsl(185, 65%, 45%)" },
    ],
  },
  {
    id: "cat10",
    name: "Health Information Management and Health Informatic Professional",
    shortName: "Health Information Management",
    professions: [
      { id: "p54", name: "Health Information Management Professional (Including Medical Records Analyst)", iconPath: toIconPath("Health Information Management Professional (Including Medical Records Analyst)"), color: "hsl(210, 65%, 50%)" },
      { id: "p55", name: "Health Information Management Technologist", iconPath: toIconPath("Health Information Management Technologist"), color: "hsl(200, 55%, 48%)" },
      { id: "p56", name: "Clinical Coder", iconPath: toIconPath("Clinical Coder"), color: "hsl(230, 55%, 52%)" },
      { id: "p57", name: "Medical Secretary and Medical Transcriptionist", iconPath: toIconPath("Medical Secretary and Medical Transcriptionist"), color: "hsl(160, 50%, 45%)" },
    ],
  },
];

// Flattened list of all professions with category info (exactly 57 professions)
export const allProfessions: Profession[] = professionCategories.flatMap((cat) =>
  cat.professions.map((prof) => ({
    ...prof,
    categoryId: cat.id,
    categoryName: cat.name,
  })),
);

// Helper to get profession by name
export const getProfessionByName = (name: string): Profession | undefined => {
  return allProfessions.find((p) => p.name === name);
};

// Helper to get profession icon path by name
export const getProfessionIconPath = (name: string): string | null => {
  const profession = getProfessionByName(name);
  return profession?.iconPath || null;
};

// Helper to get profession color by name
export const getProfessionColor = (name: string): string => {
  const profession = getProfessionByName(name);
  return profession?.color || "hsl(180, 60%, 45%)";
};
