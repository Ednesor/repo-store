import axios, { AxiosError, type AxiosResponse } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  /*
  Axio devolvia "?categoria_ids[]=1&categoria_ids[]=2."
  y el backend esperaba "categoria_ids=1&categoria_ids=2."
  */
  paramsSerializer: {
    indexes: null
  }
})

/*
uso para seguridad-token
*/
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
)

api.interceptors.response.use((response: AxiosResponse) => {
  return response;
}, async (error: AxiosError) => {
  if (error.response?.status === 401) {
    console.error("Sesion expirada (401), por favor inicia sesión nuevamente");
    //TODO : Deuda técnica - Seguridad: Atrapar el 401 no es suficiente si no se redirige al usuario a `/login` (ej: `window.location.href = '/login'`). 
    // Además, el repo-store carece por completo de manejo de estado global (Zustand/Context) para saber si hay una sesión activa, 
    // lo que permite a usuarios anónimos navegar por rutas privadas y romper la app.
  }
  return Promise.reject(error);
})

export default api