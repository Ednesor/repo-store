import { useCatalogProducts } from '../hooks/useCatalogProducts';
import { useCartStore, getCantidadDeProducto } from '../../../store/useCartStore';
import ProductCard from '../components/ProductCard';
import { useState, useMemo } from 'react';
import type { Producto } from '../../../shared/types/domain.types';
import ProductModal from '../components/ProductModal';

export default function CatalogPage() {
  const { data: productos = [], isLoading, isError } = useCatalogProducts();
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);

  // null significa que el modal está cerrado. 
  // Si tiene un Producto, abrimos el modal con esos datos.
  const [openModal, setOpenModal] = useState<Producto | null>(null);
  const [filter, setFilter] = useState('Recomendados');

  const sortedProductos = useMemo(() => {
    let sorted = [...productos];
    if (filter === 'Precio: Menor a Mayor') {
      sorted.sort((a, b) => a.precio_base - b.precio_base);
    } else if (filter === 'Precio: Mayor a Menor') {
      sorted.sort((a, b) => b.precio_base - a.precio_base);
    }
    return sorted;
  }, [productos, filter]);

  if (isLoading) return <div className="text-body-lg text-on-surface-variant flex justify-center py-20">Cargando el menú...</div>;
  if (isError) return <div className="text-body-lg text-error flex justify-center py-20">Error al cargar los productos</div>;

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface">Gourmet Menu</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">Explore our chef-crafted selections.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-48 ml-auto">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full appearance-none px-4 py-2 bg-surface border border-outline-variant rounded-md text-body-sm font-body-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none pr-10 cursor-pointer"
            >
              <option value="Recomendados">Recomendados</option>
              <option value="Precio: Menor a Mayor">Precio: Menor a Mayor</option>
              <option value="Precio: Mayor a Menor">Precio: Mayor a Menor</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" style={{ fontSize: '20px' }}>expand_more</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProductos.map((p) => (
          <ProductCard
            key={p.id}
            producto={p}
            cantidadEnCarrito={getCantidadDeProducto(items, p.id)}
            onSelect={() => setOpenModal(p)}
          />
        ))}
      </div>

      <ProductModal
        producto={openModal}
        onClose={() => setOpenModal(null)}
        onAddToCart={(producto, cantidad, personalizacion) => {
          addItem(producto, cantidad, personalizacion);
        }}
      />
    </div>
  );
}
