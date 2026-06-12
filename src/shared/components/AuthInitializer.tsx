import { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../services/api';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { setSession, clearSession } = useAuthStore();

    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await api.get('/usuarios/me');
                setSession(response.data);
            } catch {
                // Si falla (ej: 401), limpiamos la sesión
                clearSession();
            }
        };

        verifySession();
    }, [setSession, clearSession]);

    return <>{children}</>;
}
