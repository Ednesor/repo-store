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
  es_removible?: boolean;
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
  categorias?: Categoria[];
  ingredientes?: Ingrediente[];
  unidad_venta?: UnidadMedida;
}

export interface PedidoItem {
  producto: Producto;
  cantidad: number;
  personalizacion: number[];
  precioUnitario: number;
  subtotal: number;
}

export interface DetallePedidoRead {
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  nombre_snapshot: string;
  precio_snapshot: number;
  subtotal_snapshot: number;
  personalizacion?: number[] | null;
  created_at: string;
}

export interface Pedido {
  id: number;
  estado_codigo: string;
  forma_pago_codigo: string;
  subtotal: number;
  descuento: number;
  costo_envio: number;
  total: number;
  notas: string | null;
  created_at: string;
  items: DetallePedidoRead[];
}