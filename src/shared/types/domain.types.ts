export interface UnidadMedida {
  id: number;
  nombre: string;
  simbolo: string;
  tipo: string;
}

export interface Ingrediente {
  id: number;
  nombre: string;
  descripcion: string;
  es_alergeno: boolean;
}

export interface ProductoIngrediente {
  producto_id: number;
  ingrediente_id: number;
  cantidad: number;
  unidad_medida_id: number;
  es_removible: boolean;
  ingrediente?: Ingrediente;
}

export interface Categoria {
  id: number;
  parent_id: number | null;
  nombre: string;
  descripcion: string;
  imagen_url: string;
}

export interface Producto {
  id: number;
  unidad_venta_id: number | null;
  nombre: string;
  descripcion: string;
  precio_base: number;
  imagenes_url: string[];
  stock_cantidad: number;
  disponible: boolean;
  
  // Relaciones (dependiendo del endpoint, podrían venir populadas)
  categoria?: Categoria[];
  ingredientes?: ProductoIngrediente[];
  unidad_venta?: UnidadMedida;
}

export interface PedidoItem {
  producto: Producto;
  cantidad: number;
  personalizacion: number[];
  precioUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  items: PedidoItem[];
  total: number;
  fecha: string;
}