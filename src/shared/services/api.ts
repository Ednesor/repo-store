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
    const currentPath = window.location.pathname;
    if (currentPath !== '/login' && currentPath !== '/register') {
      window.location.href = "/login";
    }
  }
  return Promise.reject(error);
})

export default api