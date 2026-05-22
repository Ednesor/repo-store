# Retail Precision - Store App (Parcial 2 - PROG4)

Aplicación web e-commerce completa con arquitectura orientada a features y diseño *premium* responsivo. Construida con React, TypeScript y Tailwind CSS v4.

## Funcionalidades Principales

- **Catálogo de Productos**: Listado con grilla responsiva, filtros de ordenamiento y diseño limpio.
- **Personalización de Pedido**: Modal *split-screen* donde el cliente puede seleccionar cantidades y remover ingredientes específicos antes de agregar al carrito.
- **Carrito de Compras (Zustand)**: Gestión global de estado para el carrito, calculando totales, subtotales y controlando stock máximo disponible.
- **Checkout Seguro**: Formulario de finalización de compra con validaciones (TanStack Form) e integración directa con el servidor.
- **Historial de Pedidos**: Tabla estructurada para la visualización del histórico de compras del cliente.

## Requisitos Previos

- Node.js 18+
- pnpm 8+

## Instalación

1. Clona el repositorio.
2. Instala las dependencias:

```bash
pnpm install
```

## Configuración del Entorno

Copia el archivo de ejemplo y ajusta la URL de la API:

```bash
cp .env.example .env
```

Edita `.env` con la URL de tu backend:

```env
VITE_API_URL=http://localhost:3000
```

## Desarrollo

Levanta el servidor de desarrollo:

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Arquitectura por Features

El proyecto sigue una arquitectura guiada por **features** (módulos por dominio). Cada feature es autocontenido e incluye todo lo necesario para su funcionalidad.

```
src/
├── features/           # Módulos por dominio
│   ├── catalog/         # Listado y detalle de productos
│   │   ├── components/  # Componentes específicos del catálogo
│   │   ├── hooks/       # Hooks personalizados (TanStack Query)
│   │   └── pages/       # Páginas del catálogo
│   ├── checkout/        # Carrito y proceso de compra
│   │   ├── components/   
│   │   ├── hooks/       
│   │   └── pages/       
│   └── orders/          # Historial de pedidos
│       ├── components/  
│       ├── hooks/       
│       └── pages/       
├── shared/              # Código compartido entre features
│   ├── components/      # Componentes reutilizables (Navbar, Footer, Modal)
│   ├── services/       # Instancia Axios configurada
│   └── types/          # Interfaces del dominio (Producto, Pedido)
├── store/              # Estado global (Zustand)
│   ├── useCartStore.ts # Lógica y almacenamiento del carrito
│   └── cart.types.ts   # Tipos del estado global
└── router/             # Configuración de rutas
    └── index.tsx       # Definición de rutas (React Router)
```

## Stack Tecnológico

- **React 19** — Librería de UI
- **TypeScript** — Tipado estático estricto
- **Vite** — Build tool y servidor de desarrollo ultra rápido
- **Tailwind CSS v4** — Estilos utility-first modernos nativos vía `@theme`
- **TanStack Query (React Query)** — Gestión de estado asíncrono, cacheo y peticiones
- **TanStack Form** — Gestión y validación de formularios
- **Zustand** — Estado global ligero, seguro y predecible
- **React Router 7** — Enrutamiento y navegación SPA
- **Axios** — Cliente HTTP