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
