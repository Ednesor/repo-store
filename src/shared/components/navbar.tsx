import { Link } from 'react-router-dom';
import { useCartStore, getTotalItems } from '../../store/useCartStore';

export default function Navbar() {
    const items = useCartStore((state) => state.items);
    const totalItems = getTotalItems(items);

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
                    
                    <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 ml-2">
                        <span className="material-symbols-outlined text-[24px]">person</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
