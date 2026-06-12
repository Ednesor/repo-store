import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Rol {
    codigo: string;
    nombre: string;
}

export interface User {
    id: number;
    email: string;
    nombre: string;
    apellido?: string;
    celular?: string;
    roles: Rol[];
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setSession: (user: User) => void;
    clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setSession: (user) => set({ user, isAuthenticated: true }),
            clearSession: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
)