import { useForm } from '@tanstack/react-form';
import { useCheckout } from '../../hooks/useCheckout';
import { useCartStore } from '../../../../store/useCartStore';
import { useDirecciones } from '../../../user/hooks/useDirecciones';
import { useNavigate } from 'react-router-dom';

interface CheckoutFormProps {
    onSuccess: () => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
    const { items, clearCart } = useCartStore();
    const checkoutMutation = useCheckout();
    const { direcciones, isLoading } = useDirecciones();
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            direccion_id: '' as number | string,
            forma_pago_codigo: 'EFECTIVO',
            notas: '',
        },
        onSubmit: async ({ value }) => {
            const pedido = {
                direccion_id: Number(value.direccion_id),
                forma_pago_codigo: value.forma_pago_codigo,
                notas: value.notas || null,
                items: items.map(item => ({
                    producto_id: item.producto.id,
                    cantidad: item.cantidad,
                    personalizacion: item.personalizacion.length > 0 ? item.personalizacion : null
                }))
            };

            checkoutMutation.mutate(pedido, {
                onSuccess: (response) => {
                    clearCart();
                    if (value.forma_pago_codigo === 'MERCADOPAGO') {
                        const pedidoId = response?.data?.id || response?.id;
                        navigate(`/payment/${pedidoId}`);
                    } else {
                        onSuccess();
                    }
                }
            });
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="flex flex-col gap-6"
        >
            <form.Field
                name="direccion_id"
                validators={{
                    onChange: ({ value }) => {
                        if (!value) return 'Debes seleccionar una dirección de envío';
                        return undefined;
                    },
                    onSubmit: ({ value }) => {
                        if (!value) return 'Debes seleccionar una dirección de envío';
                        return undefined;
                    },
                }}
                children={(field) => (
                    <div className="flex flex-col gap-2">
                        <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Dirección de envío</label>
                        {isLoading ? (
                            <div className="p-4 bg-surface-variant rounded-lg text-body-md text-on-surface-variant animate-pulse">
                                Cargando tus direcciones...
                            </div>
                        ) : direcciones.length === 0 ? (
                            <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-body-md">
                                No tienes direcciones guardadas. Ve a tu perfil para agregar una antes de continuar.
                            </div>
                        ) : (
                            <select
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className={`w-full bg-surface border rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${field.state.meta.errors.length > 0 ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'}`}
                            >
                                <option value="" disabled>Selecciona una dirección</option>
                                {direcciones.map(dir => (
                                    <option key={dir.id} value={dir.id}>
                                        {dir.alias ? `${dir.alias} - ${dir.linea1}` : dir.linea1} ({dir.ciudad})
                                    </option>
                                ))}
                            </select>
                        )}

                        {field.state.meta.errors.length > 0 && (
                            <p className="text-error text-body-sm flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                {field.state.meta.errors.join(', ')}
                            </p>
                        )}
                    </div>
                )}
            />

            <form.Field
                name="forma_pago_codigo"
                children={(field) => (
                    <div className="flex flex-col gap-2">
                        <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Método de Pago</label>
                        <select
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full bg-surface border rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-outline-variant focus:border-primary"
                        >
                            <option value="EFECTIVO">Efectivo (al recibir)</option>
                            <option value="MERCADOPAGO">Mercado Pago</option>
                        </select>
                    </div>
                )}
            />

            <form.Field
                name="notas"
                children={(field) => (
                    <div className="flex flex-col gap-2">
                        <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Notas adicionales (opcional)</label>
                        <textarea
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={`w-full bg-surface border rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-outline-variant focus:border-primary`}
                            placeholder="Ej: Sin cebolla, tocar timbre 2 veces..."
                            rows={3}
                        />
                    </div>
                )}
            />

            {checkoutMutation.isError && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-body-sm mt-2 mb-2">
                    {checkoutMutation.error instanceof Error ? checkoutMutation.error.message : 'Error al procesar el pedido'}
                </div>
            )}

            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                    <button
                        type="submit"
                        disabled={!canSubmit || checkoutMutation.isPending || direcciones.length === 0}
                        className="w-full bg-primary text-on-primary text-label-md font-label-md py-4 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors mt-4 shadow-sm disabled:bg-surface-variant disabled:text-on-surface-variant disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {(checkoutMutation.isPending || isSubmitting) ? (
                            <>
                                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                                Procesando...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                Confirmar Pedido
                            </>
                        )}
                    </button>

                )}
            />
        </form>
    );
}
