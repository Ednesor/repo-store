import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../services/api';

export default function Navbar() {
    useCartStore((state) => state.items);
    const getTotalItems = useCartStore((state) => state.getTotalItems);
    const totalItems = getTotalItems();


    const { isAuthenticated, user, clearSession } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Error al desloguear", error);
        } finally {
            clearSession();
            setIsMenuOpen(false);
            navigate('/login');
        }
    };


    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full bg-surface/95 backdrop-blur-md border-b border-outline-variant">
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop h-20 flex justify-between items-center">
                <div className="flex-shrink-0">
                    <Link to="/" className="text-headline-md font-headline-md font-bold text-primary tracking-tight hover:text-primary-container transition-colors">
                        Retail Precision
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/" className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors">
                        CATÁLOGO
                    </Link>

                    <Link to="/mis-pedidos" className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors">
                        MIS PEDIDOS
                    </Link>

                    <Link
                        to="/cart"
                        className="relative flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-2 bg-error text-on-error text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Si NO está logueado, es un link a /login */}
                    {!isAuthenticated ? (
                        <Link to="/login" className="text-on-surface-variant hover:text-primary transition-colors duration-200 ml-2">
                            <span className="material-symbols-outlined text-[24px]">person</span>
                        </Link>
                    ) : (
                        // Si ESTÁ logueado, metemos un contenedor relativo para armar el menú desplegable
                        <div className="relative ml-2">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors duration-200"
                            >
                                <span className="material-symbols-outlined text-[24px]">person</span>
                                <span className="text-label-md font-bold">{user?.nombre}</span>
                            </button>

                            {/* El Dropdown que solo aparece si isMenuOpen es true */}
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-md shadow-lg py-1 z-50">
                                    <div className="px-4 py-2 border-b border-outline-variant/30 text-body-sm text-on-surface-variant">
                                        {user?.email}
                                    </div>

                                    <Link
                                        to="/perfil"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-4 py-2 text-label-md text-on-surface hover:bg-surface-container transition-colors"
                                    >
                                        Ver perfil
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-label-md text-error hover:bg-error/10 transition-colors"
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}