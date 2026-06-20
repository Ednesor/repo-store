import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentFeedbackPage() {
    const { id } = useParams(); // Rescata el :id de la URL (/payment/feedback/:id)
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Sacamos los parámetros que nos puenteó el backend desde MP
    const status = searchParams.get('status');
    const paymentId = searchParams.get('payment_id');

    // MP devuelve 'approved' cuando el pago es exitoso
    const isSuccess = status === 'approved' || status === 'success';
    const isFailure = status === 'rejected' || status === 'failure' || status === 'null';
    const isPending = status === 'pending' || status === 'in_process';

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
            <h1 className={`text-4xl font-bold mb-4 ${
                isSuccess ? 'text-green-600' : 
                isFailure ? 'text-red-600' : 'text-orange-500'
            }`}>
                {isSuccess && '¡Pago Exitoso!'}
                {isFailure && 'Pago Rechazado o Fallido'}
                {isPending && 'Pago en Proceso'}
                {!isSuccess && !isFailure && !isPending && 'Estado del Pago'}
            </h1>

            <p className="text-xl font-medium mb-2">Pedido #{id}</p>

            {paymentId && paymentId !== 'null' && (
                <p className="text-md text-gray-500 mb-6">Comprobante MP: {paymentId}</p>
            )}

            <p className="mb-8 text-lg">
                {isPending && 'Tu pago está siendo procesado por MercadoPago. Te avisaremos cuando se acredite.'}
                {isFailure && 'Hubo un problema con tu pago o fue rechazado. Por favor, verificá tus datos o intentá con otro medio de pago.'}
                {isSuccess && '¡Tu pedido ya se está preparando!'}
                {(!status) && 'No se pudo obtener el estado del pago.'}
            </p>

            <button
                onClick={() => navigate('/mis-pedidos')}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
            >
                Ir a mis pedidos
            </button>
        </div>
    );
}
