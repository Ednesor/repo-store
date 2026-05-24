import type { Categoria } from '../../../../shared/types/domain.types';

interface CatalogSidebarProps {
    categoriasDisponibles: Categoria[];
    categoriasSeleccionadas: number[]; 
    onCategoriaToggle: (categoriaId: number) => void;
}

export default function CatalogSidebar({
    categoriasDisponibles,
    categoriasSeleccionadas,
    onCategoriaToggle
}: CatalogSidebarProps) {

    return (
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">

            <div>
                <h3 className="font-bold mb-2">Categorías</h3>
                <div className="flex flex-col gap-2">
                    {categoriasDisponibles.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                // Está chequeado si el ID está en el array que nos mandó el padre
                                checked={categoriasSeleccionadas.includes(cat.id)}
                                // Le avisamos al padre que el usuario hizo click en este ID
                                onChange={() => onCategoriaToggle(cat.id)}
                            />
                            <span>{cat.nombre}</span>
                        </label>
                    ))}
                </div>
            </div>

        </aside>
    );
}
