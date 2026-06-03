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
    //TODO : Feature pendiente - El interceptor de 401 solo loguea a consola pero no redirige a /login. Cuando se implemente el AuthStore en el store, agregar `window.location.href = '/login'` o similar.
    console.error("Sesion expirada (401), por favor inicia sesión nuevamente");
  }
  return Promise.reject(error);
})

export default api