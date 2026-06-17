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

// El estado de autenticación ahora guarda también el refreshToken.
// ¿Por qué? Porque el accessToken vive re poco (ej: 15 mins) por seguridad.
// Si expira, usamos este refreshToken silenciosamente en el interceptor (api.ts) 
// para pedir uno nuevo sin que el usuario tenga que volver a poner la contraseña.
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    refreshToken: string | null;
    setSession: (user: User, refreshToken?: string) => void;
    clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            refreshToken: null,
            setSession: (user, refreshToken) => set({ 
                user, 
                isAuthenticated: true, 
                refreshToken: refreshToken !== undefined ? refreshToken : get().refreshToken 
            }),
            clearSession: () => set({ user: null, isAuthenticated: false, refreshToken: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
)