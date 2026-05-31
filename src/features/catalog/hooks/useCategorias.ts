import { useQuery } from "@tanstack/react-query";
import api from "../../../shared/services/api";
import type { Categoria } from "../../../shared/types/domain.types";

export const useCategorias = () => {
    return useQuery<Categoria[]>(
        {
            queryKey: ['categorias'],
            queryFn: async () => {
                const response = await api.get('/categorias?is_principal=true');
                return response.data.data;
            }
        }
    )
}