import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../shared/services/api';
import type { Pedido } from '../../../shared/types/domain.types';

interface Props {
    id?: string;
    enabled?: boolean;
}

export function useOrders({ id, enabled = true }: Props = {}) {
    const queryClient = useQueryClient();

    const fetchOrders = useQuery<Pedido[]>({
        queryKey: ['pedidos'],
        queryFn: async () => {
            const { data: responseData } = await api.get('/pedidos/mis-pedidos');
            const pedidosArray = responseData.data || [];
            return pedidosArray.sort((a: Pedido, b: Pedido) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        },
        enabled: enabled && !id
    });

    const fetchOrderById = useQuery<Pedido>({
        queryKey: ['pedidos', id],
        queryFn: async () => {
            const { data } = await api.get(`/pedidos/mis-pedidos/${id}`);
            return data;
        },
        enabled: enabled && !!id,
    });

    const cancel = useMutation({
        mutationFn: async ({ pedidoId, motivo }: { pedidoId: number; motivo: string }) => {
            try {
                const response = await api.patch(`/pedidos/mis-pedidos/${pedidoId}/cancelar`, 
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

    return {
        // Datos
        orders: fetchOrders.data || [],
        singleOrder: fetchOrderById.data,

        // Carga
        isLoading: fetchOrders.isLoading || fetchOrderById.isLoading,
        isError: fetchOrders.isError || fetchOrderById.isError,

        // Acciones
        cancel: cancel.mutateAsync,
        isCanceling: cancel.isPending,
        cancelError: cancel.error,
        resetCancel: cancel.reset
    };
}