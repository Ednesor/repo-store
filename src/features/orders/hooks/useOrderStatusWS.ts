import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { OrderSocket } from '../../../shared/services/websocket/orderSocket';

export function useOrderStatusWS(pedidoId: number | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!pedidoId) return;

    // Patrón Singleton: Pedimos LA ÚNICA instancia de OrderSocket que existe en toda la app.
    const socket = OrderSocket.getInstance();
    
    // Le decimos al backend: "Che, avisame de las cosas que pasen en la sala de este pedido"
    socket.joinRoom(pedidoId);

    // Cuando recibimos una señal de cambio, NO actualizamos la UI a mano (ej: setStatus("EN_CAMINO")).
    // Hacemos algo mejor: "invalidamos" el caché de React Query. 
    // Esto fuerza a React Query a ir a buscar el pedido de nuevo al backend automáticamente.
    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', pedidoId] });
    };

    // Nos suscribimos a todos los eventos posibles que la cocina pueda mandar.
    const unsubs = [
      socket.on("NUEVO_PEDIDO", invalidate),
      socket.on("PEDIDO_CONFIRMADO", invalidate),
      socket.on("PEDIDO_EN_PREPARACION", invalidate),
      socket.on("PEDIDO_CANCELADO", invalidate),
      socket.on("ESTADO_ACTUALIZADO", invalidate),
    ];

    // Cleanup Function: Se ejecuta cuando el usuario se va de la página de detalle del pedido.
    return () => {
      // Nos desuscribimos de los eventos de este componente para no tener "fugas de memoria"
      unsubs.forEach((off) => off());
      // Le decimos al backend "ya no me importa este pedido, dejá de mandarme sus eventos"
      socket.leaveRoom();
    };
  }, [pedidoId, queryClient]);
}
