import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartState, CartItem } from './cart.types'


// ======Calcula el total sumando los subtotales de todos los items======
const calcularTotal = (items: CartItem[]): number => {
  return items.reduce((suma, item) => suma + item.subtotal, 0)
}



// ======Compara dos arrays de personalización.======
const mismaPersonalizacion = (p1: number[] = [], p2: number[] = []): boolean => {
  if (p1.length !== p2.length) return false

  //Ordena los arrays para que no importe el orden en que se agreguen los ingredientes
  const sorted1 = [...p1].sort() 
  const sorted2 = [...p2].sort() 

  // Compara si son iguales
  return sorted1.every((val, index) => val === sorted2[index])
}




// --------------------------------------------------------------------------
// Creación del Store
// --------------------------------------------------------------------------
export const useCartStore = create<CartState>()(

  persist(
    (set, get) => ({
      // Estado Inicial
      items: [],
      total: 0,

      // Agregar al carrito
      addItem: (producto, cantidad, personalizacion = []) =>
        // set recibe una función (con el estado actual) y devuelve el nuevo estado
        set((state) => {
          // Buscamos si YA EXISTE este producto exacto (mismo ID y misma personalización)
          // devuelve el indice en el que se encuentra en caso contrario devuelve -1
          const indexExistente = state.items.findIndex(
            (i) => i.producto.id === producto.id && mismaPersonalizacion(i.personalizacion, personalizacion)
          )

          // creamos una copia del array para no modificar el estado original
          const nuevosItems = [...state.items]

          if (indexExistente >= 0) {
            // Si existe, lo actualizamos. Sacamos el item viejo, creamos uno nuevo con más cantidad.
            const itemViejo = nuevosItems[indexExistente]
            const nuevaCantidad = Math.min(itemViejo.cantidad + cantidad, producto.stock_cantidad)

            nuevosItems[indexExistente] = {
              ...itemViejo,
              cantidad: nuevaCantidad,
              subtotal: nuevaCantidad * itemViejo.precioUnitario // Recalculamos subtotal
            }
          } else {
            // Si NO existe es un nuevo item
            const nuevoItem: CartItem = {
              producto,
              cantidad,
              personalizacion,
              precioUnitario: producto.precio_base, // Guardamos una "foto" del precio, por si actualizan el precio en el back-end
              subtotal: producto.precio_base * cantidad
            }
            nuevosItems.push(nuevoItem) // agregamos el nuevo item al array
          }

          // Devolvemos el nuevo estado
          return {
            items: nuevosItems,
            total: calcularTotal(nuevosItems)
          }
        }),

      // Eliminar del carrito
      removeItem: (productoId, personalizacion = []) =>
        set((state) => {
          // Filtramos dejando pasar a todos los que NO coincidan con el producto a eliminar
          const nuevosItems = state.items.filter(
            (i) => !(i.producto.id === productoId && mismaPersonalizacion(i.personalizacion, personalizacion))
          )
          return {
            items: nuevosItems,
            total: calcularTotal(nuevosItems)
          }
        }),

      // Actualizar cantidad directa (cuando el usuario tipea o suma/resta)
      updateQuantity: (productoId, cantidad, personalizacion = []) =>
        set((state) => {
          let nuevosItems = state.items.map((i) => {
            if (i.producto.id === productoId && mismaPersonalizacion(i.personalizacion, personalizacion)) {
              // indenpendientemente de lo que manden tomaremos el maximo de stock
              const cantidadSegura = Math.min(cantidad, i.producto.stock_cantidad)
              return { ...i, cantidad: cantidadSegura, subtotal: cantidadSegura * i.precioUnitario }
            }
            return i
          })
          // Si al actualizar alguien pone "0", el item se borra solo.
          nuevosItems = nuevosItems.filter(i => i.cantidad > 0)
          return { items: nuevosItems, total: calcularTotal(nuevosItems) }
        }),

      // Limpiar todo
      clearCart: () => set({ items: [], total: 0 }),

      // Métodos de obtención de datos (Getters)
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((suma, item) => suma + item.cantidad, 0);
      },

      getCantidadDeProducto: (productoId) => {
        const { items } = get();
        return items
          .filter((item) => item.producto.id === productoId)
          .reduce((suma, item) => suma + item.cantidad, 0);
      },
    }),
    {
      name: 'cart-storage'
    }
  )

)