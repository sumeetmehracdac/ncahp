// Profession data with PNG icons from src/assets/profession-icons
// 57 Allied Healthcare Professions organized into 10 categories

export interface Profession {
  id: string;
  name: string;
  iconFile: string;
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
    iconFile: string;
    color: string;
  }>;
}

// Exactly 57 professions from the official list organized by 10 categories
// Each profession has an explicit iconFile mapping to the actual filename in profession-icons folder
export const professionCategories: ProfessionCategory[] = [
  {
    id: "cat1",
    name: "Medical Laboratory and Life Sciences",
    shortName: "Medical Laboratory & Life Sciences",
    professions: [
      { id: "p1", name: "Biotechnologist", iconFile: "biotechnologist.png", color: "hsl(280, 70%, 55%)" },
      { id: "p2", name: "Biochemist (nonclinical)", iconFile: "biochemist-nonclinical-.png", color: "hsl(200, 75%, 45%)" },
      { id: "p3", name: "Cell Geneticist", iconFile: "cell-geneticist.png", color: "hsl(320, 65%, 50%)" },
      { id: "p4", name: "Microbiologist (nonclinical)", iconFile: "microbiologist-nonclinical-.png", color: "hsl(160, 70%, 45%)" },
      { id: "p5", name: "Molecular Biologist (nonclinical)", iconFile: "molecular-biologist-nonclinical-.png", color: "hsl(210, 70%, 50%)" },
      { id: "p6", name: "Molecular Geneticist", iconFile: "molecular-geneticist.png", color: "hsl(300, 65%, 52%)" },
      { id: "p7", name: "Cytotechnologist", iconFile: "cytotechnologist.png", color: "hsl(250, 70%, 55%)" },
      { id: "p8", name: "Forensic Science Technologist", iconFile: "forensic-science-technologist.png", color: "hsl(10, 75%, 50%)" },
      { id: "p9", name: "Histotechnologist", iconFile: "histotechnologist.png", color: "hsl(340, 70%, 55%)" },
      { id: "p10", name: "Hemato Technologist", iconFile: "hemato-technologist.png", color: "hsl(0, 75%, 50%)" },
      { id: "p11", name: "Medical Lab Technologist", iconFile: "medical-lab-technologist.png", color: "hsl(190, 70%, 45%)" },
    ],
  },
  {
    id: "cat2",
    name: "Trauma, Burn Care and Surgical/Anesthesia related technology",
    shortName: "Trauma & Surgical Technology",
    professions: [
      { id: "p12", name: "Advance Care Paramedic", iconFile: "advance-care-paramedic.png", color: "hsl(0, 80%, 55%)" },
      { id: "p13", name: "Burn Care Technologist", iconFile: "burn-care-technologist.png", color: "hsl(25, 90%, 50%)" },
      { id: "p14", name: "Emergency Medical Technologist (Paramedic)", iconFile: "emergency-medical-technologist-paramedic-.png", color: "hsl(350, 85%, 50%)" },
      { id: "p15", name: "Anaesthesia Assistants and Technologists", iconFile: "anaesthesia-assistants-and-technologists.png", color: "hsl(210, 60%, 50%)" },
      { id: "p16", name: "Operation Theatre (OT) Technologists", iconFile: "operation-theatre-ot-technologists.png", color: "hsl(165, 55%, 45%)" },
      { id: "p17", name: "Endoscopy and Laparoscopy Technologists", iconFile: "endoscopy-and-laparoscopy-technologists.png", color: "hsl(240, 50%, 55%)" },
    ],
  },
  {
    id: "cat3",
    name: "Physiotherapy Professional",
    shortName: "Physiotherapy",
    professions: [
      { id: "p18", name: "Physiotherapist", iconFile: "physiotherapist.png", color: "hsl(142, 70%, 40%)" },
    ],
  },
  {
    id: "cat4",
    name: "Nutrition Science Professional",
    shortName: "Nutrition Science",
    professions: [
      { id: "p19", name: "Dietician (including Clinical Dietician, Food Service Dietician)", iconFile: "dietician-including-clinical-dietician-food-service-dietician-.png", color: "hsl(5, 75%, 55%)" },
      { id: "p20", name: "Nutritionist (including Public Health Nutritionist, Sports Nutritionist)", iconFile: "nutritionist-including-public-health-nutritionist-sports-nutritionist-.png", color: "hsl(85, 70%, 45%)" },
    ],
  },
  {
    id: "cat5",
    name: "Ophthalmic Sciences Professional",
    shortName: "Ophthalmic Sciences",
    professions: [
      { id: "p21", name: "Optometrist", iconFile: "optometrist.png", color: "hsl(200, 80%, 50%)" },
      { id: "p22", name: "Ophthalmic Assistant", iconFile: "ophthalmic-assistant.png", color: "hsl(185, 60%, 45%)" },
      { id: "p23", name: "Vision Technician", iconFile: "vision-technician.png", color: "hsl(215, 65%, 50%)" },
    ],
  },
  {
    id: "cat6",
    name: "Occupational Therapy Professional",
    shortName: "Occupational Therapy",
    professions: [
      { id: "p24", name: "Occupational Therapist", iconFile: "occupational-therapist.png", color: "hsl(35, 80%, 50%)" },
    ],
  },
  {
    id: "cat7",
    name: "Community Care, Behavioural Health Sciences and other Professionals",
    shortName: "Community & Behavioural Health",
    professions: [
      { id: "p25", name: "Environment Protection Officer", iconFile: "environment-protection-officer.png", color: "hsl(120, 60%, 40%)" },
      { id: "p26", name: "Ecologist", iconFile: "environment-protection-officer.png", color: "hsl(100, 55%, 42%)" }, // Using similar icon
      { id: "p27", name: "Community Health promoters", iconFile: "health-educator-and-counsellors-including-disease-counsellors-diabetes-educators-lactation-consultants.png", color: "hsl(195, 65%, 48%)" }, // Using similar icon
      { id: "p28", name: "Occupational Health and Safety Officer (Inspector)", iconFile: "environment-protection-officer.png", color: "hsl(45, 90%, 50%)" }, // Using similar icon
      { id: "p29", name: "Psychologist (Except Clinical Psychologist covered under RCI for PWD)", iconFile: "psychologist-except-clinical-psychologist-covered-under-rci-for-pwd-.png", color: "hsl(280, 55%, 55%)" },
      { id: "p30", name: "Behavioural Analyst", iconFile: "behavioural-analyst.png", color: "hsl(270, 55%, 55%)" },
      { id: "p31", name: "Integrated Behaviour Health Counsellor", iconFile: "integrated-behaviour-health-counsellor.png", color: "hsl(200, 60%, 50%)" },
      { id: "p32", name: "Health Educator and Counsellors (including Disease Counsellors, Diabetes Educators, Lactation Consultants)", iconFile: "health-educator-and-counsellors-including-disease-counsellors-diabetes-educators-lactation-consultants.png", color: "hsl(220, 55%, 50%)" },
      { id: "p33", name: "Social workers (including Clinical Social Worker, Psychiatric Social Worker, Medical Social Worker)", iconFile: "social-workers-including-clinical-social-worker-psychiatric-social-worker-medical-social-worker.png", color: "hsl(340, 60%, 55%)" },
      { id: "p34", name: "Human Immunodeficiency Virus (HIV) Counsellors or Family Planning Counsellors", iconFile: "human-immunodeficiency-virus-hiv-counsellors-or-family-planning-counsellors.png", color: "hsl(350, 70%, 55%)" },
      { id: "p35", name: "Mental Health Support Workers", iconFile: "mental-health-support-workers.png", color: "hsl(265, 55%, 55%)" },
      { id: "p36", name: "Podiatrist", iconFile: "podiatrist.png", color: "hsl(25, 65%, 50%)" },
      { id: "p37", name: "Palliative Care Professionals", iconFile: "palliative-care-professionals.png", color: "hsl(180, 50%, 45%)" },
      { id: "p38", name: "Movement Therapist (including Art, Dance and Movement Therapist or Recreational Therapist)", iconFile: "movement-therapist-including-art-dance-and-movement-therapist-or-recreational-therapist-.png", color: "hsl(300, 55%, 55%)" },
      { id: "p39", name: "Acupuncture Professionals", iconFile: "acupuncture-professionals.png", color: "hsl(55, 80%, 48%)" },
    ],
  },
  {
    id: "cat8",
    name: "Medical Radiology, Imaging and Therapeutic Technology Professional",
    shortName: "Radiology & Imaging",
    professions: [
      { id: "p40", name: "Medical Physicist", iconFile: "medical-physicist.png", color: "hsl(250, 60%, 55%)" },
      { id: "p41", name: "Nuclear Medicine Technologist", iconFile: "nuclear-medicine-technologist.png", color: "hsl(65, 85%, 45%)" },
      { id: "p42", name: "Radiology and Imaging Technologist (Diagnostic Medical Radiographer, Magnetic Resonance Imaging (MRI), Computed Tomography (CT), Mammographer, Diagnostic Medical Sonographers)", iconFile: "radiology-and-imaging-technologist-diagnostic-medical-radiographer-magnetic-resonance-imaging-mri-computed-tomography-ct-mammographer-diagnostic-medical-sonographers-.png", color: "hsl(190, 70%, 45%)" },
      { id: "p43", name: "Radiotherapy Technologist", iconFile: "radiotherapy-technologist.png", color: "hsl(35, 90%, 50%)" },
      { id: "p44", name: "Dosimetrist", iconFile: "dosimetrist.png", color: "hsl(30, 45%, 55%)" },
    ],
  },
  {
    id: "cat9",
    name: "Medical Technologists and Physician Associate",
    shortName: "Medical Technologists",
    professions: [
      { id: "p45", name: "Biomedical Engineer", iconFile: "biomedical-engineer.png", color: "hsl(210, 70%, 50%)" },
      { id: "p46", name: "Medical Equipment Technologist", iconFile: "medical-equipment-technologist.png", color: "hsl(225, 50%, 50%)" },
      { id: "p47", name: "Physician Associates", iconFile: "physician-associates.png", color: "hsl(175, 60%, 42%)" },
      { id: "p48", name: "Cardiovascular Technologists", iconFile: "cardiovascular-technologists.png", color: "hsl(0, 75%, 50%)" },
      { id: "p49", name: "Perfusionist", iconFile: "perfusionist.png", color: "hsl(355, 65%, 55%)" },
      { id: "p50", name: "Respiratory Technologist", iconFile: "respiratory-technologist.png", color: "hsl(195, 70%, 50%)" },
      { id: "p51", name: "Electrocardiogram (ECG) Technologist or Echocardiogram (ECHO) Technologist", iconFile: "electrocardiogram-ecg-technologist-or-echocardiogram-echo-technologist.png", color: "hsl(5, 70%, 50%)" },
      { id: "p52", name: "Electroencephalogram (EEG) or Electroneurodiagnostic (END) or Electromyography (EMG) Technologists or Neuro Lab Technologists or Sleep Lab Technologists", iconFile: "electroencephalogram-eeg-or-electroneurodiagnostic-end-or-electromyography-emg-technologists-or-neuro-lab-technologists-or-sleep-lab-technologists.png", color: "hsl(270, 55%, 55%)" },
      { id: "p53", name: "Dialysis Therapy Technologists or Urology Technologists", iconFile: "dialysis-therapy-technologists-or-urology-technologists.png", color: "hsl(185, 65%, 45%)" },
    ],
  },
  {
    id: "cat10",
    name: "Health Information Management and Health Informatic Professional",
    shortName: "Health Information Management",
    professions: [
      { id: "p54", name: "Health Information Management Professional (Including Medical Records Analyst)", iconFile: "health-information-management-professional-including-medical-records-analyst-.png", color: "hsl(210, 65%, 50%)" },
      { id: "p55", name: "Health Information Management Technologist", iconFile: "health-information-management-technologist.png", color: "hsl(200, 55%, 48%)" },
      { id: "p56", name: "Clinical Coder", iconFile: "clinical-coder.png", color: "hsl(230, 55%, 52%)" },
      { id: "p57", name: "Medical Secretary and Medical Transcriptionist", iconFile: "medical-secretary.png", color: "hsl(160, 50%, 45%)" },
    ],
  },
];

// Base path for profession icons
const ICON_BASE_PATH = "/src/assets/profession-icons/";

// Flattened list of all professions with category info (exactly 57 professions)
export const allProfessions: Profession[] = professionCategories.flatMap((cat) =>
  cat.professions.map((prof) => ({
    ...prof,
    categoryId: cat.id,
    categoryName: cat.name,
  })),
);

// Helper to get full icon path
export const getIconPath = (iconFile: string): string => {
  return `${ICON_BASE_PATH}${iconFile}`;
};

// Helper to get profession by name
export const getProfessionByName = (name: string): Profession | undefined => {
  return allProfessions.find((p) => p.name === name);
};

// Helper to get profession icon path by name
export const getProfessionIconPath = (name: string): string | null => {
  const profession = getProfessionByName(name);
  return profession ? getIconPath(profession.iconFile) : null;
};

// Helper to get profession color by name
export const getProfessionColor = (name: string): string => {
  const profession = getProfessionByName(name);
  return profession?.color || "hsl(180, 60%, 45%)";
};
