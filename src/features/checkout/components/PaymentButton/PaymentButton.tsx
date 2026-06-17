import { useState } from 'react';
import { isAxiosError } from 'axios';
import api from '../../../../shared/services/api';

const VITE_MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;

interface PaymentButtonProps {
    pedidoId: number;
    monto: number;
}

export function PaymentButton({ pedidoId, monto }: PaymentButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mpConfigured = !!VITE_MP_PUBLIC_KEY;

    const handlePagar = async () => {
        if (!mpConfigured) {
            setError('MercadoPago no está configurado. Configure VITE_MP_PUBLIC_KEY en el .env');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await api.post('/pagos/crear', {
                pedido_id: pedidoId,
            });
            
            const { init_point } = res.data;

            if (init_point) {
                window.location.href = init_point; // Redirección ninja
            } else {
                setError('El backend no devolvió el link de pago (init_point)');
            }

        } catch (err) {
            let detail = 'Error al iniciar el pago';
            if (isAxiosError(err) && err.response?.data?.detail) {
                detail = err.response.data.detail;
            }
            setError(detail);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full max-w-[350px]">
            <button
                onClick={handlePagar}
                disabled={loading}
                className="w-full bg-[#009EE3] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#008ACA] transition-colors disabled:opacity-50 flex justify-center items-center shadow-md"
            >
                {loading ? 'Conectando...' : `Pagar $${monto.toLocaleString('es-AR')} con Mercado Pago`}
            </button>

            {error && (
                <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-md border border-red-200">
                    {error}
                </p>
            )}
        </div>
    );
}
