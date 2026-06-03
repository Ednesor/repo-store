import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import Router from './router'

//TODO : Deuda técnica - QueryClient se crea sin opciones de default (staleTime, retry, refetchOnWindowFocus). Esto resulta en peticiones redundantes al cambiar de foco de ventana y reintentos agresivos ante fallos.
//TODO : Feature pendiente - A diferencia de repo-admin (que tiene `AuthInitializer` y `useAuthStore`), repo-store NO inicializa estado de autenticación al cargar la app. Está planificado agregarlo cuando se implemente la seguridad en el store.
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  </StrictMode>,
)