import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { useCatalogProducts } from '../../catalog/hooks/useCatalogProducts';
import { useOrderStatusWS } from '../hooks/useOrderStatusWS';
import { useWsStore } from '../../../store/wsStore';
import type { DetallePedidoRead } from '../../../shared/types/domain.types';

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Hook unificado para órdenes, pasando el ID del pedido sacado de la URL
    const { singleOrder: pedido, isLoading, isError } = useOrders({ id });
    
    // Traemos el catálogo para cruzar los IDs de personalización con los nombres de ingredientes reales.
    // Como ahora la API es paginada (devuelve { items: [], total: N ... }), 
    // necesitamos sacarle la propiedad .items o que sea un array vacío por defecto.
    const { data: catalogResponse } = useCatalogProducts();
    const productos = catalogResponse || [];

    // Acá integramos la magia en tiempo real. 
    // Al invocar este hook, si el pedidoId existe, nos suscribimos al canal de WebSocket de este pedido.
    // Si la cocina aprieta un botón para cambiar el estado, se invalidará la caché de React Query
    // y la variable 'pedido' (de la línea 15) se va a actualizar sola sin recargar la página.
    useOrderStatusWS(id ? Number(id) : undefined);
    
    // Estado global para saber si el WebSocket está vivo o desconectado
    const isConnected = useWsStore((state) => state.isConnected);

    if (isLoading) {
        return (
            <div className="w-full flex flex-col justify-center items-center py-20 gap-4">
                <span className="material-symbols-outlined animate-spin text-[48px] text-primary">progress_activity</span>
                <p className="text-body-lg text-on-surface-variant">Cargando detalles del pedido...</p>
            </div>
        );
    }

    if (isError || !pedido) {
        return (
            <div className="w-full flex flex-col justify-center items-center py-20 gap-4">
                <span className="material-symbols-outlined text-[48px] text-error">error</span>
                <p className="text-body-lg text-on-surface">No pudimos cargar los detalles del pedido.</p>
                <button 
                    onClick={() => navigate('/mis-pedidos')}
                    className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-colors font-medium"
                >
                    Volver a mis pedidos
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col h-full bg-surface rounded-2xl shadow-sm border border-outline-variant overflow-hidden mt-8">
            <div className="flex justify-between items-center p-6 border-b border-outline-variant bg-surface-container-low">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-headline-sm font-semibold text-on-surface">Detalle del Pedido #{pedido.id}</h2>
                        {isConnected ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                En vivo
                            </span>
                        ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                Desconectado
                            </span>
                        )}
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                        Creado el {new Date(pedido.created_at).toLocaleString()}
                    </p>
                </div>
                <button onClick={() => navigate('/mis-pedidos')} className="px-4 py-2 bg-surface-variant text-on-surface-variant rounded-full hover:bg-surface-variant/80 transition-colors flex items-center gap-2 font-medium">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Volver
                </button>
            </div>

            <div className="p-6 flex flex-col gap-6">

                <div className="flex justify-between items-center bg-surface-variant/30 p-4 rounded-xl border border-outline-variant">
                    <div>
                        <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Estado</p>
                        <span className="font-semibold text-primary">{pedido.estado_codigo}</span>
                    </div>
                    <div className="text-right">
                        <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Forma de Pago</p>
                        <span className="font-semibold text-on-surface">{pedido.forma_pago_codigo}</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-title-md font-semibold text-on-surface mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">shopping_bag</span>
                        Productos
                    </h3>
                    <ul className="flex flex-col gap-4">
                        {pedido.items?.map((item: DetallePedidoRead, index: number) => (
                            <li key={index} className="flex justify-between items-start pb-4 border-b border-outline-variant last:border-0">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-on-surface text-body-lg">
                                            {item.cantidad}x {item.nombre_snapshot}
                                        </span>
                                    </div>
                                    <p className="text-body-sm text-on-surface-variant">
                                        Precio unitario: ${item.precio_snapshot}
                                    </p>
                                    {item.personalizacion && item.personalizacion.length > 0 && (
                                        <p className="text-label-sm text-error mt-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">remove_circle_outline</span>
                                            Sin: {productos.length > 0
                                                // Mapeamos los IDs de los ingredientes restados para buscar sus nombres.
                                                // 1. Buscamos el producto en el catálogo.
                                                // 2. Buscamos el ingrediente dentro de ese producto.
                                                // 3. Devolvemos su nombre.
                                                ? item.personalizacion
                                                    .map(id => productos.find(p => p.id === item.producto_id)?.ingredientes?.find((i: { id: number; nombre: string }) => i.id === id)?.nombre)
                                                    .filter(Boolean) // Quitamos los nulos o undefined
                                                    .join(', ') // Unimos todos con comas
                                                // Fallback por si los productos todavía no cargaron del catálogo
                                                : `${item.personalizacion.length} ingredientes`}
                                        </p>
                                    )}
                                </div>
                                <span className="font-semibold text-on-surface text-title-sm">
                                    ${item.subtotal_snapshot}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col gap-3 mt-4">
                    <div className="flex justify-between text-body-md text-on-surface-variant">
                        <span>Subtotal</span>
                        <span className="font-medium">${pedido.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-body-md text-on-surface-variant">
                        <span>Descuento</span>
                        <span className="font-medium text-error">-${pedido.descuento}</span>
                    </div>
                    <div className="flex justify-between text-body-md text-on-surface-variant">
                        <span>Costo de Envío</span>
                        <span className="font-medium">${pedido.costo_envio}</span>
                    </div>
                    <div className="border-t border-outline-variant mt-3 pt-3 flex justify-between text-title-lg font-bold text-on-surface items-center">
                        <span>Total Final</span>
                        <span className="text-primary text-headline-sm">${pedido.total}</span>
                    </div>
                </div>

                {pedido.notas && (
                    <div className="bg-secondary-container/20 p-5 rounded-xl border border-secondary-container/30 mt-2">
                        <h4 className="text-label-sm uppercase tracking-wider text-on-surface-variant mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">speaker_notes</span>
                            Notas del Cliente
                        </h4>
                        <p className="text-body-md text-on-surface leading-relaxed">{pedido.notas}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
