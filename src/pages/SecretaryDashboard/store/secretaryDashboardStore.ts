import { create } from "zustand";
import { Application, ApplicationBucket } from "../types";
import { MOCK_APPLICATIONS } from "../data/mockApplications";

interface State {
  applications: Application[];
  moveTo: (ids: string[], bucket: ApplicationBucket, patch?: Partial<Application>) => void;
  generateCertificate: (id: string) => void;
}

export const useSecretaryDashboardStore = create<State>((set) => ({
  applications: MOCK_APPLICATIONS,
  moveTo: (ids, bucket, patch) =>
    set((s) => ({
      applications: s.applications.map((a) =>
        ids.includes(a.applicationId) ? { ...a, ...patch, bucket } : a,
      ),
    })),
  generateCertificate: (id) =>
    set((s) => ({
      applications: s.applications.map((a) => {
        if (a.applicationId !== id) return a;
        const certNo = `CERT/UP/${new Date().getFullYear()}/${String(
          Math.floor(10000 + Math.random() * 89999),
        )}`;
        return {
          ...a,
          bucket: "certificate" as const,
          certificateNo: certNo,
          certificateIssuedAt: new Date().toISOString(),
        };
      }),
    })),
}));
