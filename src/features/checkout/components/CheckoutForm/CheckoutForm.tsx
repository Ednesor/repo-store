import { useForm } from '@tanstack/react-form';
import { useCheckout } from '../../hooks/useCheckout';
import { useCartStore } from '../../../../store/useCartStore';

interface CheckoutFormProps {
    onSuccess: () => void;
}


/*
hardcodeamos el efectivo y direccion en null por el momento 
luego con el tiempo se agregarán los pagos y direcciones del usuario
*/
export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
    const { items } = useCartStore();
    const checkoutMutation = useCheckout();

    const form = useForm({
        defaultValues: {
            nombre: '',
            direccion: '',
            telefono: '',
        },
        onSubmit: async ({ value }) => {
            const notas_cliente = `Nombre: ${value.nombre} | Dirección: ${value.direccion} | Tel: ${value.telefono}`;
            
            //TODO : Deuda técnica - El método de pago está hardcodeado a "EFECTIVO" y `direccion_id` a null. Cuando se implementen los módulos de pagos y direcciones en el backend, estos valores deben venir del usuario autenticado en lugar de estar fijos.
            //TODO : BUG GRAVE - Los datos del cliente (nombre, dirección, teléfono) se concatenan en el campo `notas` del pedido en lugar de usar los campos diseñados para eso (`direccion_id` y los datos del usuario autenticado). Esto es un workaround frágil que mezcla datos estructurados con texto libre.
            const pedido = {
                direccion_id: null,
                forma_pago_codigo: 'EFECTIVO',
                notas: notas_cliente,
                items: items.map(item => ({
                    producto_id: item.producto.id,
                    cantidad: item.cantidad,
                    personalizacion: item.personalizacion.length > 0 ? item.personalizacion : null
                }))
            };

            checkoutMutation.mutate(pedido, {
                onSuccess: () => {
                    onSuccess();
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
                name="nombre"
                validators={{
                    onChange: ({ value }) => {
                        if (!value) return 'El nombre es obligatorio';
                        if (value.trim().length < 3) return 'Debe tener al menos 3 letras';
                        if (value.length > 50) return 'No puede superar los 50 caracteres';
                        return undefined;
                    },
                    onSubmit: ({ value }) => {
                        if (!value) return 'El nombre es obligatorio';
                        if (value.trim().length < 3) return 'Debe tener al menos 3 letras';
                        if (value.length > 50) return 'No puede superar los 50 caracteres';
                        return undefined;
                    },
                }}
                children={(field) => (
                    <div className="flex flex-col gap-2">
                        <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Nombre completo</label>
                        <input
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={`w-full bg-surface border rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${field.state.meta.errors.length > 0 ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'}`}
                            placeholder="Ej: Juan Pérez"
                        />
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
                name="direccion"
                validators={{
                    onChange: ({ value }) => {
                        if (!value) return 'La dirección es obligatoria';
                        if (value.trim().length < 5) return 'La dirección es muy corta';
                        if (value.length > 100) return 'No puede superar los 100 caracteres';
                        return undefined;
                    },
                    onSubmit: ({ value }) => {
                        if (!value) return 'La dirección es obligatoria';
                        if (value.trim().length < 5) return 'La dirección es muy corta';
                        if (value.length > 100) return 'No puede superar los 100 caracteres';
                        return undefined;
                    },
                }}
                children={(field) => (
                    <div className="flex flex-col gap-2">
                        <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Dirección de envío</label>
                        <input
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={`w-full bg-surface border rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${field.state.meta.errors.length > 0 ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'}`}
                            placeholder="Ej: Calle Falsa 123"
                        />
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
                name="telefono"
                validators={{
                    onChange: ({ value }) => {
                        if (!value) return 'El teléfono es obligatorio';
                        if (!/^\d+$/.test(value)) return 'Solo se permiten números';
                        if (value.length < 8) return 'Debe tener al menos 8 números';
                        if (value.length > 15) return 'No puede tener más de 15 números';
                        return undefined;
                    },
                    onSubmit: ({ value }) => {
                        if (!value) return 'El teléfono es obligatorio';
                        if (!/^\d+$/.test(value)) return 'Solo se permiten números';
                        if (value.length < 8) return 'Debe tener al menos 8 números';
                        if (value.length > 15) return 'No puede tener más de 15 números';
                        return undefined;
                    },
                }}
                children={(field) => (
                    <div className="flex flex-col gap-2">
                        <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Teléfono</label>
                        <input
                            type="tel"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={`w-full bg-surface border rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${field.state.meta.errors.length > 0 ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'}`}
                            placeholder="Ej: 1122334455"
                        />
                        {field.state.meta.errors.length > 0 && (
                            <p className="text-error text-body-sm flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                {field.state.meta.errors.join(', ')}
                            </p>
                        )}
                    </div>
                )}
            />

            {checkoutMutation.isError && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-body-sm mt-2 mb-2">
                    {checkoutMutation.error instanceof Error ? checkoutMutation.error.message : 'Error al procesar el pedido'}
                </div>
            )}
            {/* Usamos Subscribe para que el botón escuche los cambios de estado del form */}
            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                    <button
                        type="submit"
                        disabled={!canSubmit || checkoutMutation.isPending}
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
