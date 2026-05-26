import { useForm } from "@tanstack/react-form";
import type { RegisterPayload } from "../../types";

interface RegisterFormProps {
    onSubmit: (values: RegisterPayload) => void;
    isSubmitting: boolean; 
}

export default function RegisterForm({ onSubmit, isSubmitting }: RegisterFormProps) {
    const form = useForm({
        defaultValues: {
            nombre: '',
            apellido: '',
            email: '',
            celular: '',
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
            <div className="flex gap-4">
                <form.Field
                    name="nombre"
                    children={(field) => (
                        <div className="space-y-xs group w-1/2">
                            <label className="font-label-md text-label-md text-on-surface-variant px-1" htmlFor="nombre">First Name</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">badge</span>
                                <input 
                                    className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-fixed transition-all placeholder:text-outline font-body-md text-body-md" 
                                    id="nombre" 
                                    placeholder="John" 
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                />
                <form.Field
                    name="apellido"
                    children={(field) => (
                        <div className="space-y-xs group w-1/2">
                            <label className="font-label-md text-label-md text-on-surface-variant px-1" htmlFor="apellido">Last Name</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">badge</span>
                                <input 
                                    className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-fixed transition-all placeholder:text-outline font-body-md text-body-md" 
                                    id="apellido" 
                                    placeholder="Doe" 
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                />
            </div>

            <form.Field
                name="email"
                children={(field) => (
                    <div className="space-y-xs group">
                        <label className="font-label-md text-label-md text-on-surface-variant px-1" htmlFor="email">Email Address</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">mail</span>
                            <input 
                                className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-fixed transition-all placeholder:text-outline font-body-md text-body-md" 
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
                name="celular"
                children={(field) => (
                    <div className="space-y-xs group">
                        <label className="font-label-md text-label-md text-on-surface-variant px-1" htmlFor="celular">Phone Number</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">call</span>
                            <input 
                                className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-fixed transition-all placeholder:text-outline font-body-md text-body-md" 
                                id="celular" 
                                placeholder="+1 234 567 8900" 
                                type="text"
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
                        <label className="font-label-md text-label-md text-on-surface-variant px-1" htmlFor="password">Password</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
                            <input 
                                className="w-full pl-12 pr-12 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-fixed transition-all placeholder:text-outline font-body-md text-body-md" 
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

            <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary-container text-on-primary-container font-label-md text-body-md rounded-lg hover:bg-primary transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg mt-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                {!isSubmitting && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
            </button>
        </form>
    );
}
