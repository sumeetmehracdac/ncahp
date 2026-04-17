export type FormCode = "1A" | "1B" | "1C" | "2A" | "3A" | "3B" | "3C" | "4A";

export type RegistrationCategory =
  | "Regular Registration"
  | "Provisional Registration"
  | "Temporary Registration"
  | "Interim Registration";

export interface FormMeta {
  code: FormCode;
  formLabel: string; // e.g. "Form 3A"
  category: RegistrationCategory;
  description: string;
}

export type ApplicationBucket =
  | "new"
  | "evaluated_recommended"
  | "evaluated_not_recommended"
  | "forwarded"
  | "uid"
  | "certificate";

export interface Application {
  applicationId: string;
  applicantName: string;
  formCode: FormCode;
  submittedAt: string; // ISO
  bucket: ApplicationBucket;
  uid?: string;
  certificateNo?: string;
  certificateIssuedAt?: string;
  forwardedAt?: string;
  rejectionReason?: string;
  district?: string;
  profession?: string;
}

export const FORM_META: Record<FormCode, FormMeta> = {
  "1A": {
    code: "1A",
    formLabel: "Form 1A",
    category: "Regular Registration",
    description: "Indian nationals with Indian qualification",
  },
  "1B": {
    code: "1B",
    formLabel: "Form 1B",
    category: "Regular Registration",
    description: "Indian nationals with foreign qualifications",
  },
  "1C": {
    code: "1C",
    formLabel: "Form 1C",
    category: "Interim Registration",
    description: "Students pursuing a recognised qualification",
  },
  "2A": {
    code: "2A",
    formLabel: "Form 2A",
    category: "Provisional Registration",
    description:
      "Working Allied & Healthcare Indian Professionals without recognised qualification",
  },
  "3A": {
    code: "3A",
    formLabel: "Form 3A",
    category: "Temporary Registration",
    description: "Indian Nationals with Foreign Qualification",
  },
  "3B": {
    code: "3B",
    formLabel: "Form 3B",
    category: "Temporary Registration",
    description: "Foreign Nationals with Indian Qualification",
  },
  "3C": {
    code: "3C",
    formLabel: "Form 3C",
    category: "Temporary Registration",
    description: "Foreign Nationals with Foreign Qualification",
  },
  "4A": {
    code: "4A",
    formLabel: "Form 4A",
    category: "Interim Registration",
    description: "Students pursuing a recognised qualification",
  },
};

export const ALL_FORM_CODES: FormCode[] = ["1A", "1B", "1C", "2A", "3A", "3B", "3C", "4A"];
export const ALL_CATEGORIES: RegistrationCategory[] = [
  "Regular Registration",
  "Provisional Registration",
  "Temporary Registration",
  "Interim Registration",
];
