import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../shared/services/api';
import type { Pedido } from '../../../shared/types/domain.types';

export function useOrders() {
    return useQuery<Pedido[]>({
        queryKey: ['pedidos'],
        queryFn: async () => {
            const { data: responseData } = await api.get('/pedidos/publico/mis-pedidos');
            const pedidosArray = responseData.data || [];
            return pedidosArray.sort((a: Pedido, b: Pedido) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
    });
}

export function useOrderById(id: string) {
    return useQuery<Pedido>({
        queryKey: ['pedidos', id],
        queryFn: async () => {
            const { data } = await api.get(`/pedidos/publico/mis-pedidos/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

export function useCancelOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ pedidoId, motivo }: { pedidoId: number; motivo: string }) => {
            try {
                const response = await api.patch(`/pedidos/publico/mis-pedidos/${pedidoId}/cancelar`, 
                    { estado_hacia: 'CANCELADO', motivo }
                );
                return response.data;
            } catch (error) {
                console.error(error);
                throw new Error('No se pudo cancelar el pedido. Puede que ya no esté en un estado válido.', { cause: error });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pedidos'] });
        }
    });
}