import { useQuery, keepPreviousData } from '@tanstack/react-query'
import api from '../../../shared/services/api'
import type { Producto } from '../../../shared/types/domain.types'

export const useCatalogProducts = (categoriaIds: number[] = []) => {
    return useQuery<Producto[]>({
        queryKey: ['productos', categoriaIds],
        queryFn: async () => {
            const response = await api.get('/productos/', {
                params: {
                    // Le mandamos el array. Si está vacío, le mandamos undefined para que no ensucie la URL.
                    categoria_ids: categoriaIds.length > 0 ? categoriaIds : undefined,
                    //TODO : BUG GRAVE - `include_only_active` no existe en el backend. El backend espera `disponible: true` (boolean). Este parámetro está siendo completamente ignorado, por lo que el catálogo muestra TODOS los productos (incluyendo los deshabilitados).
                    include_only_active: true
                }
            });
            return response.data.data;
        },
        /*
        keepPreviousData, en caso de que el usuario seleccione otra categoría, 
        mantener los datos que se tienen hasta que estén cargados los nuevos datos
        */
        placeholderData: keepPreviousData
    })
}