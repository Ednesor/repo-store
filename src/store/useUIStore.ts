import { create } from 'zustand';

// TODO: Implementar UIStore para manejar el estado de modales, alertas y menús laterales.
// (Rúbrica: Frontend - Zustand requiere 5 stores implementados y tipados).

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
