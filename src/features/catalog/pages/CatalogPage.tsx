import { useCatalogProducts } from '../hooks/useCatalogProducts';
import { useCartStore } from '../../../store/useCartStore';
import ProductCard from '../components/ProductCard/ProductCard';
import { useState } from 'react';
import type { Producto } from '../../../shared/types/domain.types';
import ProductModal from '../components/ProductModal/ProductModal';
import CatalogSidebar from '../components/CatalogSidebar/CatalogSidebar';
import { useCategorias } from '../hooks/useCategorias';
import { useCatalogFilters } from '../hooks/useCatalogFilters';

export default function CatalogPage() {
  const { categoriasSeleccionadas, handleCategoriaToggle } = useCatalogFilters();

  const { data: categorias = [] } = useCategorias();
  const { data: productos = [], isLoading, isError } = useCatalogProducts(categoriasSeleccionadas);
  useCartStore((state) => state.items);
  const getCantidadDeProducto = useCartStore((state) => state.getCantidadDeProducto);
  const addItem = useCartStore((state) => state.addItem);

  // null significa que el modal está cerrado. 
  // Si tiene un Producto, abrimos el modal con esos datos.
  const [openModal, setOpenModal] = useState<Producto | null>(null);

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');

  if (isLoading) return <div className="text-body-lg text-on-surface-variant flex justify-center py-20">Cargando el menú...</div>;
  if (isError) return <div className="text-body-lg text-error flex justify-center py-20">Error al cargar los productos</div>;

  const sortedProductos = [...productos].sort((a, b) => {
    if (sortOrder === 'asc') return Number(a.precio_base) - Number(b.precio_base);
    if (sortOrder === 'desc') return Number(b.precio_base) - Number(a.precio_base);
    return 0;
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface">Gourmet Menu</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">Explore our chef-crafted selections.</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="bg-surface-container-low border border-outline-variant text-on-surface text-body-md rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | 'none')}
          >
            <option value="none">Relevancia</option>
            <option value="asc">Menor precio</option>
            <option value="desc">Mayor precio</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">

        <CatalogSidebar
          categoriasDisponibles={categorias}
          categoriasSeleccionadas={categoriasSeleccionadas}
          onCategoriaToggle={handleCategoriaToggle}
        />

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProductos.map((p) => (
            <ProductCard
              key={p.id}
              producto={p}
              cantidadEnCarrito={getCantidadDeProducto(p.id)}
              onSelect={() => setOpenModal(p)}
            />
          ))}
        </div>

      </div>


      <ProductModal
        key={openModal?.id || 'closed'}
        producto={openModal}
        onClose={() => setOpenModal(null)}
        onAddToCart={(producto, cantidad, personalizacion) => {
          addItem(producto, cantidad, personalizacion);
        }}
      />
    </div>
  );
}
