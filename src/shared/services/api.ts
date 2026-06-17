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

import { useAuthStore } from '../../store/useAuthStore';
import { type InternalAxiosRequestConfig } from 'axios';

// IMPORTANTE: Este flag nos dice si YA estamos intentando refrescar el token.
// Si fallan 5 peticiones casi al mismo tiempo por el 401, no queremos hacer 5 peticiones a /auth/refresh
let isRefreshing = false;

// Esta es nuestra "sala de espera". Si el token se está refrescando, todas las peticiones
// que lleguen con 401 se van a guardar acá en pausa hasta que termine el refresco.
interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}
let failedQueue: QueueItem[] = [];

// Esta función agarra todas las peticiones en pausa y las manda a ejecutar de nuevo
// (con el nuevo token) o las rechaza a todas si el refresh falló.
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use((response: AxiosResponse) => {
  return response;
}, async (error: AxiosError) => {
  // Guardamos la petición original que falló para poder reintentarla luego
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  // Si el error es 401 (No Autorizado) y NO lo habíamos reintentado antes
  if (error.response?.status === 401 && !originalRequest._retry) {
    const currentPath = window.location.pathname;
    
    if (currentPath === '/login' || currentPath === '/register') {
      return Promise.reject(error); // Si ya está en login, no hacemos la danza del refresh
    }

    // Si ya estamos refrescando, metemos esta petición en la cola y esperamos a que se resuelva
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          // Acá se reanuda la petición original, pero como ya pasó por el interceptor de request,
          // va a agarrar el nuevo access token automáticamente del localStorage.
          return api(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    // Marcamos esta petición como "ya reintentada" para evitar bucles infinitos
    originalRequest._retry = true;
    isRefreshing = true;

    // Traemos nuestro token de refresco desde Zustand
    const { refreshToken, clearSession, setSession, user } = useAuthStore.getState();

    // Si ni siquiera tenemos un refresh token guardado, chau sesión.
    if (!refreshToken) {
      isRefreshing = false;
      clearSession();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      // Usamos AXIOS PURO, no "api", porque "api" dispararía interceptores y haríamos recursión.
      // Acá pegamos al backend para renovar todo.
      const response = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        { refresh_token: refreshToken },
        { withCredentials: true }
      );
      
      const newRefreshToken = response.data.refresh_token;
      
      if (user && newRefreshToken) {
        setSession(user, newRefreshToken); // Actualizamos el estado con el nuevo token
      }
      
      // Listo! Se resolvió el refresh, liberamos todas las peticiones que estaban en pausa
      processQueue(null, newRefreshToken);
      return api(originalRequest); // Y reintentamos la original que falló
    } catch (refreshError) {
      // Si el refresh_token expiró (Suele durar 7-30 días), la API tirará error acá.
      // Borramos la cola (todas fallan), limpiamos sesión y lo pateamos al login.
      processQueue(refreshError, null);
      clearSession();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      // Sea que haya fallado o funcionado, ya dejamos de refrescar
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
})

export default api