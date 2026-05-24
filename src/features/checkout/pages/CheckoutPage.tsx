import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../../store/useCartStore';
import CheckoutForm from '../components/CheckoutForm/CheckoutForm';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { total, clearCart } = useCartStore();
    const [pedidoExitoso, setPedidoExitoso] = useState(false);

    if (pedidoExitoso) {
        return (
            <div className="w-full flex justify-center mt-10 px-4">
                <div className="flex flex-col items-center justify-center p-8 w-[90vw] max-w-[500px] bg-surface border border-outline-variant rounded-xl shadow-sm">
                    <span className="material-symbols-outlined text-[64px] text-primary mb-4">check_circle</span>
                    <h1 className="text-headline-xl-mobile md:text-headline-xl font-headline-xl-mobile md:font-headline-xl text-on-surface mb-4 text-center">¡Pedido Confirmado!</h1>
                    <p className="text-body-lg text-on-surface-variant mb-8 text-center">Tu orden ya está en la cocina y pronto estará en camino.</p>
                    <button onClick={() => navigate('/')} className="bg-primary text-on-primary font-bold py-3 px-8 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-colors w-full">
                        Volver al Menú
                    </button>
                </div>
            </div>
        );
    }

    if (total === 0) {
        return (
            <div className="p-8 text-center mt-10">
                <h1 className="text-headline-lg font-headline-lg mb-4 text-on-surface">Tu carrito está vacío</h1>
                <button onClick={() => navigate('/')} className="text-primary font-bold hover:underline">
                    Volver a comprar
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-8 flex flex-col gap-lg">
                <div className="flex justify-between items-end border-b border-outline-variant pb-sm">
                    <h1 className="text-headline-xl-mobile md:text-headline-xl font-headline-xl-mobile md:font-headline-xl text-on-surface">Finalizar Compra</h1>
                </div>
                
                <div className="bg-surface border border-outline-variant p-6 rounded-xl shadow-sm">
                    <CheckoutForm 
                        onSuccess={() => {
                            clearCart();
                            setPedidoExitoso(true);
                        }} 
                    />
                </div>
            </div>

            <div className="lg:col-span-4 mt-lg lg:mt-0">
                <div className="bg-surface border border-outline-variant rounded-lg p-md sticky top-28 shadow-sm">
                    <h2 className="text-headline-md font-headline-md text-on-surface border-b border-outline-variant pb-sm mb-md">Resumen del Pedido</h2>
                    <div className="flex flex-col gap-sm text-body-md font-body-md text-on-surface-variant mb-md">
                        <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="text-on-surface">${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                        <span>Costo de Envío</span>
                        <span className="text-on-surface">$0.00</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-outline-variant pt-md mb-lg">
                        <span className="text-headline-md font-headline-md text-on-surface font-bold">Total a pagar</span>
                        <span className="text-headline-md font-headline-md text-on-surface font-bold">${total.toFixed(2)}</span>
                    </div>
                    <p className="text-center text-body-sm font-body-sm text-outline mt-sm">
                        Proceso de pago seguro por Retail Precision
                    </p>
                </div>
            </div>
        </div>
    );
}
