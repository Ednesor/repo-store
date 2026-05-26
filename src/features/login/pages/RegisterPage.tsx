import { useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import type { RegisterPayload } from "../types";

export default function RegisterPage() {
    const navigate = useNavigate();
    const registerMutation = useRegister();

    const handleRegister = (values: RegisterPayload) => {
        registerMutation.mutate(values, {
            onSuccess: () => navigate('/login'),
            onError: () => alert("Error al registrarse")
        });
    };

    return (
        <div 
            className="w-full flex items-center justify-center py-xl mb-20 relative"
            style={{
                backgroundColor: '#fff8f5',
                backgroundImage: 'radial-gradient(at 0% 0%, rgba(194, 65, 12, 0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(56, 95, 0, 0.05) 0px, transparent 50%)'
            }}
        >
            <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Registration Card */}
                <div className="bg-surface-container-lowest rounded-xl shadow-[0_10px_40px_-10px_rgba(28,25,23,0.15)] overflow-hidden">
                    <div className="px-lg py-lg">
                        {/* Header Section */}
                        <div className="text-center mb-lg">
                            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Begin Your Journey</h1>
                            <p className="font-body-md text-body-md text-on-surface-variant">Join our community of gourmet artisans and curators.</p>
                        </div>
                        
                        <RegisterForm 
                            onSubmit={handleRegister} 
                            isSubmitting={registerMutation.isPending} 
                        />
                        
                        {/* Footer Links */}
                        <div className="mt-lg text-center pt-lg border-t border-outline-variant">
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Already have an account? 
                                <a className="text-primary font-bold hover:underline ml-1" href="/login">Log In</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
