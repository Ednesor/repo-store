import type { DireccionUpdate } from "../../../shared/types/domain.types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDirecciones, createDireccion, updateDireccion, deleteDireccion, setPrincipal } from "../../../shared/services/direccionesApi";

export function useDirecciones() {
    const queryClient = useQueryClient();

    // --- QUERIES (GET) ---
    const fetchDirecciones = useQuery({
        queryKey: ["direcciones"],
        queryFn: getDirecciones
    });

    // --- MUTATIONS (POST, PATCH, DELETE) ---
    const create = useMutation({
        mutationFn: createDireccion,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["direcciones"] })
    });

    const update = useMutation({
        mutationFn: ({ id, data }: { id: number, data: DireccionUpdate }) => updateDireccion(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["direcciones"] })
    });

    const remove = useMutation({
        mutationFn: deleteDireccion,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["direcciones"] })
    });

    const markAsPrincipal = useMutation({
        mutationFn: setPrincipal,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["direcciones"] })
    });

    return {
        // Datos
        direcciones: fetchDirecciones.data || [],
        isLoading: fetchDirecciones.isLoading,
        isError: fetchDirecciones.isError,

        // Acciones
        create: create.mutateAsync,
        update: update.mutateAsync,
        remove: remove.mutateAsync,
        setPrincipal: markAsPrincipal.mutateAsync
    };
}
