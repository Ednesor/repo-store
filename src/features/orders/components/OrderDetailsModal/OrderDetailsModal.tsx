import Modal from '../../../../shared/components/Modal';
import type { Pedido } from '../../../../shared/types/domain.types';

interface OrderDetailsModalProps {
    pedido: Pedido | null;
    onClose: () => void;
}

export default function OrderDetailsModal({ pedido, onClose }: OrderDetailsModalProps) {
    if (!pedido) return null;

    return (
        <Modal isOpen={!!pedido} onClose={onClose} className="max-w-2xl">
            <div className="flex flex-col h-full bg-surface">

                <div className="flex justify-between items-center p-6 border-b border-outline-variant bg-surface-container-low">
                    <div>
                        <h2 className="text-headline-sm font-semibold text-on-surface">Detalle del Pedido #{pedido.id}</h2>
                        <p className="text-body-sm text-on-surface-variant mt-1">
                            Creado el {new Date(pedido.created_at).toLocaleString()}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>


                <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-6">


                    <div className="flex justify-between items-center bg-surface-variant/30 p-4 rounded-lg border border-outline-variant">
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
                        <h3 className="text-title-md font-semibold text-on-surface mb-4">Productos</h3>
                        <ul className="flex flex-col gap-4">
                            {pedido.items?.map((item, index) => (
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

                                        {item.personalizacion_snapshot && item.personalizacion_snapshot.length > 0 && (
                                            <div className="mt-1">
                                                <p className="text-label-sm text-error font-semibold">
                                                    Sin:
                                                </p>
                                                <ul className="text-body-sm text-error/80 pl-2 list-disc list-inside">
                                                    {item.personalizacion_snapshot.map((ing, iIdx) => (
                                                        <li key={iIdx}>{ing}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <span className="font-semibold text-on-surface">
                                        ${item.subtotal_snapshot}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-2 mt-2">
                        <div className="flex justify-between text-body-md text-on-surface-variant">
                            <span>Subtotal</span>
                            <span>${pedido.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-body-md text-on-surface-variant">
                            <span>Descuento</span>
                            <span>-${pedido.descuento}</span>
                        </div>
                        <div className="flex justify-between text-body-md text-on-surface-variant">
                            <span>Costo de Envío</span>
                            <span>${pedido.costo_envio}</span>
                        </div>
                        <div className="border-t border-outline-variant mt-2 pt-2 flex justify-between text-title-lg font-bold text-on-surface">
                            <span>Total</span>
                            <span className="text-primary">${pedido.total}</span>
                        </div>
                    </div>

                    {pedido.notas && (
                        <div className="bg-secondary-container/20 p-4 rounded-lg border border-secondary-container/30">
                            <h4 className="text-label-sm uppercase tracking-wider text-on-surface-variant mb-2">Notas del Cliente</h4>
                            <p className="text-body-md text-on-surface">{pedido.notas}</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
