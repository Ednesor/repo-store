export interface RegisterPayload {
    nombre: string;
    apellido: string;
    email: string;
    celular: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}