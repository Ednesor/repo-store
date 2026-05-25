import { useState } from 'react';
import Modal from '../../../../shared/components/Modal';

interface CancelOrderModalProps {
    pedidoId: number | null;
    onClose: () => void;
    onConfirm: (motivo: string) => void;
    isPending: boolean;
}

export default function CancelOrderModal({ pedidoId, onClose, onConfirm, isPending }: CancelOrderModalProps) {
    const [motivo, setMotivo] = useState('');
    const [error, setError] = useState('');

    if (!pedidoId) return null;

    const handleConfirm = () => {
        if (!motivo.trim()) {
            setError('El motivo es obligatorio para cancelar el pedido.');
            return;
        }
        if (motivo.trim().length < 5) {
            setError('Por favor ingresá un motivo más descriptivo.');
            return;
        }
        onConfirm(motivo);
    };

    return (
        <Modal isOpen={!!pedidoId} onClose={onClose} className="w-[90vw] sm:w-[450px]">
            <div className="flex flex-col h-full bg-surface">
                <div className="flex justify-between items-center p-6 border-b border-outline-variant bg-surface-container-low">
                    <h2 className="text-headline-sm font-semibold text-on-surface">
                        Cancelar Pedido #{pedidoId}
                    </h2>
                    <button onClick={onClose} disabled={isPending} className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    <p className="text-body-md text-on-surface-variant">
                        ¿Estás seguro de que deseás cancelar este pedido? Esta acción no se puede deshacer.
                    </p>

                    <div className="flex flex-col gap-2">
                        <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                            Motivo de cancelación (obligatorio)
                        </label>
                        <textarea
                            value={motivo}
                            onChange={(e) => {
                                setMotivo(e.target.value);
                                if (error) setError('');
                            }}
                            className={`w-full bg-surface border rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none h-24 ${error ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'
                                }`}
                            placeholder="Ej: Me equivoqué en los productos, demora demasiado, etc."
                        />
                        {error && (
                            <p className="text-error text-body-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={onClose}
                            disabled={isPending}
                            className="text-orange-600 hover:bg-orange-100 px-4 py-1.5 rounded-lg transition-colors font-bold text-sm tracking-wide"
                        >
                            Volver
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isPending}
                            className="px-4 py-2 rounded-lg bg-error text-on-error hover:bg-error/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                    Cancelando...
                                </>
                            ) : (
                                'Confirmar Cancelación'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
