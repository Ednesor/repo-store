import {useQuery} from '@tanstack/react-query'
import api from '../../../shared/services/api'
import type { Producto } from '../../../shared/types/domain.types'

export const useCatalogProducts = () => {
    return useQuery<Producto[]>({
        queryKey: ['productos'],
        queryFn: async () => {
            const {data} = await api.get<Producto[]>('/productos');
            return data;
        }
    })
}