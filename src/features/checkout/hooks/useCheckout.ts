import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../shared/services/api';

/*
por el momento se hardcodea 
Mandamos direccion_id: null.
Mandamos forma_pago_codigo: 'EFECTIVO'.
Concatenamos toda la info del cliente (Nombre, Dirección, Teléfono) en el campo notas, 
que sí es de texto libre. 
De esta forma, el cocinero y el repartidor igual van a poder leer para quién es y a dónde va el pedido, 
sin romper la estructura relacional de la base de datos.
*/
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
      const response = await api.post('/pedidos/', pedido);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Pedido guardado en la base de datos:', data);
      // Acá invalidamos el caché 
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
    onError: (error: any) => {
      console.error('Hubo un error al guardar el pedido:', error);
      
      let errorMessage = 'Lo sentimos, hubo un problema al procesar tu orden. Intentá de nuevo.';
      
      if (error.response?.data?.mensaje) {
        errorMessage = error.response.data.mensaje;
      } else if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail[0].msg;
        }
      }

      alert(errorMessage);
    }
  });
}