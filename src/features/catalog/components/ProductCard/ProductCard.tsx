import type { Producto } from "../../../../shared/types/domain.types";

interface ProductCardProps {
    producto: Producto;
    cantidadEnCarrito: number;
    onSelect: (producto: Producto) => void;
}

export default function ProductCard({ producto, cantidadEnCarrito, onSelect }: ProductCardProps) {
    const sinStock = cantidadEnCarrito >= producto.stock_cantidad;
    // TODO: Usar url de cloudinary e inyectar las transformaciones 'f_auto,q_auto,c_fill' antes de renderizar (Rúbrica: Cloudinary en ProductCard)
    const imagen = producto.imagenes_url?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop';

    return (
        <article
            className="group bg-surface border border-outline-variant rounded-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            onClick={() => !sinStock && onSelect(producto)}
        >
            <div className="relative w-full pb-[100%] overflow-hidden bg-surface-container-low">
                <img
                    alt={producto.nombre}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={imagen}
                />

                {/* Etiqueta Opcional */}
                {producto.disponible && (
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className="px-2 py-1 bg-surface-variant text-on-surface-variant text-[10px] font-semibold uppercase tracking-wider rounded">
                            {producto.stock_cantidad < 10 ? 'Últimos' : 'Disponible'}
                        </span>
                    </div>
                )}

                <button
                    aria-label="Add to Favorites"
                    className="absolute top-3 right-3 p-2 bg-surface/80 backdrop-blur rounded-full text-on-surface hover:text-primary hover:bg-surface transition-all opacity-0 group-hover:opacity-100 shadow-sm cursor-pointer"
                    onClick={(e) => e.stopPropagation()} // Prevenir que abra el modal
                >
                    <span className="material-symbols-outlined text-[20px]">favorite_border</span>
                </button>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="text-label-md font-label-md text-on-surface-variant mb-1">
                    {producto.categorias?.[0]?.nombre || 'Categoría'}
                </div>
                <h3 className="text-body-lg font-headline-md font-semibold text-on-surface mb-2 leading-tight">
                    {producto.nombre}
                </h3>

                <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="text-body-md font-body-md font-medium text-on-surface">
                        <span className="text-on-surface-variant text-sm">$</span>{producto.precio_base}
                    </div>

                    <button
                        aria-label="Add to Cart"
                        disabled={sinStock}
                        onClick={(e) => {
                            e.stopPropagation(); // Evitar abrir el modal
                            if (!sinStock) onSelect(producto);
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer ${sinStock
                            ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
                            : 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                </div>
            </div>
        </article>
    );
}