import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../shared/services/api';
import type { Pedido } from '../../../shared/types/domain.types';

export function useOrders() {
    return useQuery<Pedido[]>({
        queryKey: ['pedidos'],
        queryFn: async () => {
            const { data } = await api.get('/pedidos/', {
                params: { usuario_id: 1 }
            });
            // Ordenamos los pedidos para que los más recientes aparezcan primero
            return data.sort((a: Pedido, b: Pedido) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
    });
}

export function useCancelOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ pedidoId, motivo }: { pedidoId: number; motivo: string }) => {
            const response = await api.patch(`/pedidos/${pedidoId}/estado`, 
                { estado_hacia: 'CANCELADO', motivo },
                { params: { usuario_id: 1 } }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pedidos'] });
        },
        onError: (error) => {
            console.error('Error al cancelar el pedido:', error);
            alert('No se pudo cancelar el pedido. Puede que ya no esté en un estado válido.');
        }
    });
}