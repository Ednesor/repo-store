# Store App

Tienda pública orientada a clientes, construida con React + TypeScript + Tailwind CSS.

## Requisitos Previos

- Node.js 18+
- pnpm 8+

## Instalación

```bash
pnpm install
```

## Configuración del Entorno

Copia el archivo de ejemplo y ajusta la URL de la API:

```bash
cp .env.example .env
```

Edita `.env` con la URL de tu backend:

```
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
│   │   ├── hooks/       # Hooks personalizados del catálogo
│   │   ├── pages/       # Páginas del catálogo
│   │   ├── services/    # Servicios API del catálogo
│   │   └── types.ts     # Tipos y interfaces del dominio
│   └── checkout/        # Carrito y proceso de compra
│       ├── components/   # Componentes del checkout
│       ├── pages/       # Páginas del checkout
│       └── types.ts     # Tipos del checkout
├── shared/              # Código compartido entre features
│   ├── components/      # Componentes reutilizables
│   ├── services/       # Instancia Axios configurada
│   └── utils/          # Funciones utilitarias
├── store/              # Estado global (Zustand)
│   └── useCartStore.ts # Store del carrito
└── router/             # Configuración de rutas
    └── index.tsx       # Definición de rutas
```

### Beneficios de esta Arquitectura

- **Cohesión**: Cada feature contiene todo su código relevante
- **Escalabilidad**: Agregar nuevas features es sencillo y no afecta las existentes
- **Mantenibilidad**: Cambios en un dominio específico no impactan a otros
- **Testabilidad**: Cada feature puede probarse de forma independiente
- **Trabajo en equipo**: Múltiples desarrolladores pueden trabajar en features distintas sin conflictos

## Stack Tecnológico

- **Vite** — Build tool y servidor de desarrollo
- **React 19** — Librería de UI
- **TypeScript** — Tipado estático
- **TanStack Query** — Gestión de estado asíncrono y caché
- **React Router 7** — Enrutamiento
- **Axios** — Cliente HTTP
- **Zustand** — Estado global ligero
- **Tailwind CSS 4** — Estilos utility-first