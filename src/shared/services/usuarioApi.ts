import api from "./api";
import type { User } from "../../store/useAuthStore";

export interface UserUpdateClient {
    nombre?: string;
    apellido?: string;
    celular?: string;
}

export const updateProfile = (data: UserUpdateClient) => 
    api.patch<User>('/usuarios/me', data).then(res => res.data);
