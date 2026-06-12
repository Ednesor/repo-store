import type { Producto } from '../shared/types/domain.types';

export interface CartItem {
  producto: Producto;
  cantidad: number;
  personalizacion: number[];
  precioUnitario: number;
  subtotal: number;
}

export interface CartState {
  items: CartItem[];
  total: number;

  addItem: (producto: Producto, cantidad: number, personalizacion?: number[]) => void;
  removeItem: (productoId: number, personalizacion?: number[]) => void;
  updateQuantity: (productoId: number, cantidad: number, personalizacion?: number[]) => void;
  clearCart: () => void;

  getTotalItems: () => number;
  getCantidadDeProducto: (productoId: number) => number;
  calcularTotal: (items: CartItem[]) => number;
  mismaPersonalizacion: (p1?: number[], p2?: number[]) => boolean;
}
