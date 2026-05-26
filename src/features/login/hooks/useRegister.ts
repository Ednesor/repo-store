import { useMutation } from '@tanstack/react-query';
import api from '../../../shared/services/api';
import type { RegisterPayload } from '../types';

export const useRegister = () => {
    return useMutation({
        mutationFn: async (data: RegisterPayload) => {
            const response = await api.post('/auth/register', data);
            return response.data;
        }
    });
};
