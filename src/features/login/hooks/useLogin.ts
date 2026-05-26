import { useMutation } from '@tanstack/react-query';
import api from '../../../shared/services/api';

export const useLogin = () => {
    return useMutation({
        mutationFn: async (formData: URLSearchParams) => {
            const response = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            return response.data;
        }
    });
};
