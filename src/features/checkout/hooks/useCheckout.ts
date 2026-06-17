import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../shared/services/api';
import { isAxiosError } from 'axios';


interface PedidoPayload {
  direccion_id?: number | null;
  forma_pago_codigo: string;
  notas?: string | null;
  items: {
    producto_id: number;
    cantidad: number;
    personalizacion?: number[] | null;
  }[];
}

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pedido: PedidoPayload) => {
      try {
        const response = await api.post('/pedidos/', pedido);
        return response.data;
      } catch (error) {
        let errorMessage = 'Lo sentimos, hubo un problema al procesar tu orden. Intentá de nuevo.';
        if (isAxiosError(error) && error.response?.data?.mensaje) {
          errorMessage = error.response.data.mensaje;
        } else if (isAxiosError(error) && error.response?.data?.detail) {
          if (typeof error.response.data.detail === 'string') {
            errorMessage = error.response.data.detail;
          } else if (Array.isArray(error.response.data.detail)) {
            errorMessage = error.response.data.detail[0].msg;
          }
        }
        throw new Error(errorMessage, { cause: error });
      }
    },
    onSuccess: () => {
      // Acá invalidamos el caché 
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    }
  });
}