import { create } from 'zustand';

/**
 * Store global minúsculo (con Zustand) para saber si nuestro cliente WebSocket
 * está conectado o no con el servidor FastAPI.
 * Lo sacamos fuera del hook de react para poder leerlo desde cualquier componente
 * sin forzar a ese componente a suscribirse a los mensajes en tiempo real.
 */
interface WsState {
  isConnected: boolean;
  setConnected: (status: boolean) => void;
}

export const useWsStore = create<WsState>()((set) => ({
  isConnected: false,
  setConnected: (status) => set({ isConnected: status }),
}));
