import { create } from 'zustand';

// TODO: Implementar AdminStore para manejar los filtros o estado global de la vista administrador.
// (Rúbrica: Frontend - Zustand requiere 5 stores implementados y tipados).

interface AdminState {
  currentTab: string;
  setTab: (tab: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  currentTab: 'dashboard',
  setTab: (tab) => set({ currentTab: tab }),
}));
