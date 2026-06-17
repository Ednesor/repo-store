import { useParams } from 'react-router-dom';
import { PaymentButton } from '../components/PaymentButton/PaymentButton'; 
import { useOrders } from '../../orders/hooks/useOrders';

export default function PaymentPage() {
    const { id } = useParams<{ id: string }>();

    const { singleOrder, isLoading, isError } = useOrders({ id });

    if (isLoading) {
        return (
            <div className="w-full flex justify-center mt-10 px-4">
                <div className="flex flex-col items-center justify-center p-8 w-[90vw] max-w-[500px] bg-white border border-outline-variant rounded-2xl shadow-sm min-h-[300px]">
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-4">sync</span>
                    <p className="text-on-surface-variant">Cargando detalles de tu pedido...</p>
                </div>
            </div>
        );
    }

    if (isError || !singleOrder) {
        return (
            <div className="w-full flex justify-center mt-10 px-4">
                <div className="flex flex-col items-center justify-center p-8 w-[90vw] max-w-[500px] bg-white border border-error/20 rounded-2xl shadow-sm text-center">
                    <span className="material-symbols-outlined text-4xl text-error mb-4">error</span>
                    <h2 className="text-xl font-bold text-on-surface mb-2">Oops...</h2>
                    <p className="text-on-surface-variant mb-6">No pudimos encontrar tu pedido. Es posible que haya expirado o haya un problema de conexión.</p>
                    <button 
                        onClick={() => window.history.back()}
                        className="bg-primary text-on-primary px-6 py-2 rounded-lg font-medium hover:bg-primary-container hover:text-on-primary-container transition-colors w-full"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center mt-10 px-4">
            <div className="flex flex-col items-center justify-center p-8 w-[90vw] max-w-[500px] bg-white border border-outline-variant rounded-2xl shadow-sm gap-6">
                <h1 className="text-2xl font-bold text-on-surface text-center">
                    Completá tu pago
                </h1>
                
                <p className="text-on-surface-variant text-center">
                    Estás a un paso de confirmar tu pedido <strong>#{singleOrder.id}</strong>.
                </p>

                <div className="w-full bg-surface-variant/30 p-4 rounded-lg flex justify-between items-center">
                    <span className="font-medium text-on-surface">Total a pagar:</span>
                    <span className="text-xl font-bold text-primary">
                        ${singleOrder.total.toLocaleString('es-AR')}
                    </span>
                </div>

                <PaymentButton pedidoId={singleOrder.id} monto={singleOrder.total} />
            </div>
        </div>
    );
}
