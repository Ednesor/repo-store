import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import LoginForm from "../components/LoginForm/LoginForm";
import type { LoginPayload } from "../types";

export default function LoginPage() {
    const navigate = useNavigate();
    const loginMutation = useLogin();

    const handleLogin = (values: LoginPayload) => {
        const formData = new URLSearchParams();
        formData.append('username', values.email);
        formData.append('password', values.password);

        loginMutation.mutate(formData, {
            onSuccess: () => navigate('/')
        });
    };

    return (
        <div className="w-full flex justify-center mb-20 relative py-xl overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-fixed blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-surface-container-high blur-3xl"></div>
            </div>

            <div className="w-full max-w-[448px] bg-surface-container-lowest shadow-[0_10px_40px_-10px_rgba(68,41,31,0.15)] rounded-xl p-lg z-10 border border-outline-variant/20">
                <div className="text-center mb-lg">
                    <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Welcome Back</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">Sign in</p>
                </div>
                
                {loginMutation.isError && (
                    <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-body-sm text-center">
                        Credenciales incorrectas. Intentá de nuevo.
                    </div>
                )}
                
                <LoginForm 
                    onSubmit={handleLogin} 
                    isSubmitting={loginMutation.isPending} 
                />
                
                <div className="mt-lg text-center">
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        New to Retail Precision? 
                        <a className="text-primary-container font-bold hover:underline decoration-2 underline-offset-4 ml-1" href="/register">Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
