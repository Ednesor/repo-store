import { useMutation } from "@tanstack/react-query";
import { updateProfile as updateProfileService } from "../../../shared/services/usuarioApi";
import { useAuthStore } from "../../../store/useAuthStore";

export function useProfile() {
    const { setSession } = useAuthStore();

    const update = useMutation({
        mutationFn: updateProfileService,
        onSuccess: (updatedUser) => {
            setSession(updatedUser);
        }
    });

    return {
        updateProfile: update.mutateAsync,
        isUpdating: update.isPending
    };
}
