import { useForm } from "@tanstack/react-form";
import type { LoginPayload } from "../../types";

interface LoginFormProps {
    onSubmit: (values: LoginPayload) => void;
    isSubmitting: boolean; 
}

export default function LoginForm({ onSubmit, isSubmitting }: LoginFormProps) {
    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        onSubmit: async ({ value }) => {
            onSubmit(value);
        },
    });

    return (
        <form 
            className="space-y-md" 
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
        >
            <div className="bg-surface-container border border-outline-variant/30 rounded-lg p-3 mb-4 space-y-2">
                <p className="text-body-sm font-bold text-on-surface-variant text-center">Acceso Rápido (Testing)</p>
                <div className="flex flex-wrap gap-2 justify-center">
                    <button type="button" onClick={() => { form.setFieldValue('email', 'admin@foodstore.com'); form.setFieldValue('password', 'admin123'); }} className="px-3 py-1 bg-primary/10 text-primary text-label-sm rounded-full hover:bg-primary/20 transition-colors">Admin</button>
                    <button type="button" onClick={() => { form.setFieldValue('email', 'pedidos@foodstore.com'); form.setFieldValue('password', 'pedidos123'); }} className="px-3 py-1 bg-tertiary/10 text-tertiary text-label-sm rounded-full hover:bg-tertiary/20 transition-colors">Pedidos</button>
                    <button type="button" onClick={() => { form.setFieldValue('email', 'stock@foodstore.com'); form.setFieldValue('password', 'stock123'); }} className="px-3 py-1 bg-secondary/10 text-secondary text-label-sm rounded-full hover:bg-secondary/20 transition-colors">Stock</button>
                    <button type="button" onClick={() => { form.setFieldValue('email', 'cliente@foodstore.com'); form.setFieldValue('password', 'cliente123'); }} className="px-3 py-1 bg-primary-container/30 text-on-primary-container text-label-sm rounded-full hover:bg-primary-container/50 transition-colors border border-primary/20">Cliente</button>
                </div>
            </div>
            <form.Field
                name="email"
                children={(field) => (
                    <div className="space-y-xs group">
                        <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                        <div className="relative">
                            <input 
                                className="w-full h-12 px-md bg-surface-container-low border border-surface-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all duration-200 font-body-md text-body-md group-focus-within:scale-[1.01]" 
                                id="email" 
                                placeholder="chef@retailprecision.com" 
                                type="email"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            />

            <form.Field
                name="password"
                children={(field) => (
                    <div className="space-y-xs group">
                        <div className="flex justify-between items-center px-1">
                            <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">Password</label>
                        </div>
                        <div className="relative">
                            <input 
                                className="w-full h-12 px-md bg-surface-container-low border border-surface-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all duration-200 font-body-md text-body-md group-focus-within:scale-[1.01]" 
                                id="password" 
                                placeholder="••••••••" 
                                type="password"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            />

            <div className="flex items-center gap-sm py-xs">
                <input className="w-4 h-4 rounded border-surface-variant text-primary-container focus:ring-primary-container" id="remember" type="checkbox" />
                <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer" htmlFor="remember">Remember me for 30 days</label>
            </div>

            <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-primary-container text-on-primary-container font-headline-md text-headline-md rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Logging In...' : 'Log In'}
                {!isSubmitting && <span className="material-symbols-outlined">arrow_forward</span>}
            </button>
        </form>
    );
}
