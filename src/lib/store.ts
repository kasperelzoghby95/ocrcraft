import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name?: string | null;
}

interface AppStore {
  user: User | null;
  setUser: (user: User | null) => void;
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
  addUploadedFile: (file: File) => void;
  removeUploadedFile: (index: number) => void;
  clearFiles: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  uploadedFiles: [],
  setUploadedFiles: (files) => set({ uploadedFiles: files }),
  addUploadedFile: (file) =>
    set((state) => ({ uploadedFiles: [...state.uploadedFiles, file] })),
  removeUploadedFile: (index) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter((_, i) => i !== index),
    })),
  clearFiles: () => set({ uploadedFiles: [] }),
}));
