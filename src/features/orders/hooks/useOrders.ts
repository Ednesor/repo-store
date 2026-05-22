import { useQuery } from '@tanstack/react-query';
import api from '../../../shared/services/api';
import type { Pedido } from '../../../shared/types/domain.types';

export function useOrders() {
    return useQuery<Pedido[]>({
        queryKey: ['pedidos'],
        queryFn: async () => {
            const { data } = await api.get('/pedidos');
            // Ordenamos los pedidos para que los más recientes aparezcan primero
            return data.sort((a: Pedido, b: Pedido) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        }
    });
}
