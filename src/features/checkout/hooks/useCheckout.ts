import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../shared/services/api';

interface PedidoPayload {
  nombre: string;
  direccion: string;
  telefono: string;
  items: any[];
  total: number;
  fecha: string;
}

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pedido: PedidoPayload) => {
      const response = await api.post('/pedidos', pedido);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Pedido guardado en la base de datos:', data);
      // Acá invalidamos el caché 
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
    onError: (error) => {
      console.error('Hubo un error al guardar el pedido:', error);
      alert('Lo sentimos, hubo un problema al procesar tu orden. Intentá de nuevo.');
    }
  });
}