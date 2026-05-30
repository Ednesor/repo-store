import { useState } from 'react';
import type { Producto } from '../../../../shared/types/domain.types';
import { useCartStore } from '../../../../store/useCartStore';
import Modal from '../../../../shared/components/Modal';

interface ProductModalProps {
    producto: Producto | null;
    onClose: () => void;
    onAddToCart: (producto: Producto, cantidad: number, personalizacion: number[]) => void;
}

interface IngredientOptionProps {
    ingrediente: { id: number; nombre: string };
    isRemoved: boolean;
    onToggle: (id: number) => void;
}

function IngredientOption({ ingrediente, isRemoved, onToggle }: IngredientOptionProps) {
    if (!ingrediente) return null;
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => onToggle(ingrediente.id)}
                className={`flex justify-center items-center w-5 h-5 rounded-sm border cursor-pointer ${isRemoved ? 'border-outline-variant text-transparent' : 'bg-primary border-primary text-on-primary'}`}
            >
                {!isRemoved && <span className="material-symbols-outlined text-[14px]">check</span>}
            </button>
            <span className={`text-body-md ${isRemoved ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                {ingrediente.nombre}
            </span>
        </div>
    );
}

export default function ProductModal({ producto, onClose, onAddToCart }: ProductModalProps) {
    const [cantidad, setCantidad] = useState(1);
    const [ingredientesRemovidos, setIngredientesRemovidos] = useState<number[]>([]);

    const getCantidadDeProducto = useCartStore(state => state.getCantidadDeProducto);

    // Si no hay producto, el modal no se renderiza (retorna null)
    if (!producto) return null;

    // Ahora usamos es_removible que provee el backend
    const ingredientesRemovibles = producto.ingredientes?.filter(ing => ing.es_removible) || [];

    // Calculamos cuántos ya llevó, para saber el límite real que le podemos vender ahora
    const cantidadYaEnCarrito = getCantidadDeProducto(producto.id);
    const stockDisponible = producto.stock_cantidad - cantidadYaEnCarrito;
    const sinStock = stockDisponible <= 0;

    const imagen = producto.imagenes_url?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop';

    return (
        <Modal isOpen={!!producto} onClose={onClose} className="max-w-4xl">
            <div className="flex flex-col md:flex-row h-full max-h-[85vh] overflow-hidden bg-surface">
                {/* Imagen del Producto */}
                <div className="w-full md:w-1/2 bg-surface-container-low overflow-hidden min-h-[250px] md:min-h-full relative">
                    <img alt={producto.nombre} className="absolute inset-0 w-full h-full object-cover" src={imagen} />
                    <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-surface/80 backdrop-blur rounded-full text-on-surface hover:text-primary transition md:hidden z-10 shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Detalles del Producto */}
                <div className="w-full md:w-1/2 flex flex-col h-full overflow-y-auto filter-scroll relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-surface-container-low rounded-full text-on-surface hover:text-primary transition hidden md:block z-10">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>

                    <div className="p-6 md:p-8 flex-grow flex flex-col gap-6">
                        <div className="flex flex-col gap-2 pt-2 md:pt-0">
                            <h1 className="text-headline-lg font-headline-lg text-on-surface font-bold leading-tight">{producto.nombre}</h1>
                            <p className="text-body-lg text-on-surface-variant leading-relaxed">
                                {producto.descripcion}
                            </p>
                        </div>

                        <div className="flex items-end border-b border-outline-variant pb-4">
                            <span className="text-headline-lg font-semibold text-on-surface tracking-tight">${producto.precio_base}</span>
                        </div>

                        {ingredientesRemovibles.length > 0 && (
                            <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant mt-2">
                                <h3 className="text-headline-md font-semibold text-on-surface mb-4">Ingredientes Clave</h3>
                                <p className="text-body-sm text-on-surface-variant mb-4">Desmarca los que no desees en tu pedido.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4">
                                    {ingredientesRemovibles.map(ingrediente => (
                                        <IngredientOption
                                            key={ingrediente.id}
                                            ingrediente={ingrediente}
                                            isRemoved={ingredientesRemovidos.includes(ingrediente.id)}
                                            onToggle={(id: number) => {
                                                setIngredientesRemovidos(prev =>
                                                    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                                                )
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {producto.ingredientes?.some(i => i.es_alergeno) && (
                            <div className="flex items-start gap-2 p-3 bg-error-container/20 rounded-lg border border-error-container/30">
                                <span className="material-symbols-outlined text-[18px] text-error mt-0.5">warning</span>
                                <p className="text-body-sm text-on-surface-variant">
                                    AVISO: Este plato contiene alérgenos. Consulta los ingredientes cuidadosamente.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-outline-variant bg-surface flex flex-col gap-4 sticky bottom-0 z-10">
                        <div className="flex items-center gap-md">
                            <div className="flex items-center h-[42px] border border-outline-variant rounded bg-white overflow-hidden w-full sm:w-[130px]">
                                <button
                                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                    className="w-10 h-full flex justify-center items-center text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[16px]">remove</span>
                                </button>
                                <input
                                    type="number"
                                    value={cantidad}
                                    onChange={(e) => {
                                        // Convertimos a número lo que tipea
                                        let nuevoValor = parseInt(e.target.value, 10);
                                        // Si borra todo o pone letras, forzamos a 1
                                        if (isNaN(nuevoValor) || nuevoValor < 1) nuevoValor = 1;
                                        // Si se pasa del stock, lo frenamos en el máximo
                                        if (nuevoValor > stockDisponible) nuevoValor = stockDisponible;
                                        setCantidad(nuevoValor);
                                    }}
                                    className="w-full text-center border-none text-body-md font-semibold bg-transparent focus:ring-0 p-0 text-on-surface"
                                    min="1"
                                    max={stockDisponible}
                                />
                                <button
                                    onClick={() => setCantidad(Math.min(stockDisponible, cantidad + 1))}
                                    className="w-10 h-full flex justify-center items-center text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                </button>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 text-body-sm text-on-surface-variant font-normal">
                                <span className={`w-2 h-2 rounded-full ${sinStock ? 'bg-error' : 'bg-green-500'}`}></span>
                                {sinStock ? 'Sin stock' : 'Disponible'}
                            </div>
                        </div>
                        <button
                            disabled={sinStock}
                            onClick={() => {
                                onAddToCart(producto, cantidad, ingredientesRemovidos);
                                onClose();
                            }}
                            className={`w-full h-[44px] rounded flex justify-center items-center gap-2 text-body-md font-semibold transition-colors duration-200 cursor-pointer ${sinStock ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' : 'bg-primary hover:bg-primary-container text-on-primary'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                            Añadir al Pedido - ${(producto.precio_base * cantidad).toFixed(2)}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
