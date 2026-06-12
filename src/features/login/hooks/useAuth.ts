import { useMutation } from '@tanstack/react-query';
import api from '../../../shared/services/api';
import type { RegisterPayload } from '../types';

export function useAuth() {
    const login = useMutation({
        mutationFn: async (formData: URLSearchParams) => {
            const response = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            return response.data;
        }
    });

    const register = useMutation({
        mutationFn: async (data: RegisterPayload) => {
            const response = await api.post('/auth/register', data);
            return response.data;
        }
    });

    return {
        // Acciones
        login: login.mutateAsync,
        register: register.mutateAsync,

        // Estados
        isLoggingIn: login.isPending,
        isRegistering: register.isPending,
        loginError: login.error,
        registerError: register.error
    };
}
