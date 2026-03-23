import { create } from 'zustand';

interface WorkflowManagementState {
  selectedScheme: string;
  selectedTrack: 'proposal' | 'monitoring';
  setSelectedScheme: (scheme: string) => void;
  setSelectedTrack: (track: 'proposal' | 'monitoring') => void;
}

export const useWMStore = create<WorkflowManagementState>((set) => ({
  selectedScheme: 'all',
  selectedTrack: 'proposal',
  setSelectedScheme: (scheme) => set({ selectedScheme: scheme }),
  setSelectedTrack: (track) => set({ selectedTrack: track }),
}));
