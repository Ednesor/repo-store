import { useState } from 'react';

export function useCatalogFilters() {
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);

  const handleCategoriaToggle = (categoriaId: number) => {
    setCategoriasSeleccionadas((prev) => {
      if (prev.includes(categoriaId)) {
        return prev.filter((id) => id !== categoriaId);
      }
      return [...prev, categoriaId];
    });
  };

  return {
    categoriasSeleccionadas,
    handleCategoriaToggle
  };
}
