import { create } from 'zustand';

interface LabState {
  currentExperiment: string | null;
  setCurrentExperiment: (id: string | null) => void;
  isLabOpen: boolean;
  setLabOpen: (open: boolean) => void;
  physicsBotOpen: boolean;
  setPhysicsBotOpen: (open: boolean) => void;
}

export const useAppStore = create<LabState>((set) => ({
  currentExperiment: null,
  setCurrentExperiment: (id) => set({ currentExperiment: id }),
  isLabOpen: false,
  setLabOpen: (open) => set({ isLabOpen: open }),
  physicsBotOpen: false,
  setPhysicsBotOpen: (open) => set({ physicsBotOpen: open }),
}));
