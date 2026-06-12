import api from "./api";
import type { Direccion, DireccionCreate, DireccionUpdate } from "../types/domain.types";

export const getDirecciones = () => api.get<Direccion[]>('/direcciones').then(res => res.data);
export const createDireccion = (data: DireccionCreate) => api.post<Direccion>('/direcciones', data).then(res => res.data);
export const updateDireccion = (id: number, data: DireccionUpdate) => api.patch<Direccion>(`/direcciones/${id}`, data).then(res => res.data);
export const deleteDireccion = (id: number) => api.delete(`/direcciones/${id}`).then(res => res.data);
export const setPrincipal = (id: number) => api.patch<Direccion>(`/direcciones/${id}/principal`).then(res => res.data);
