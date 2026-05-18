import { useCartStore } from '../../../store/useCartStore'

export default function CartPage() {
  const { items, removeItem, total } = useCartStore()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Carrito de Compras</h1>
      {items.length === 0 ? (
        <p className="mt-2 text-gray-600">Tu carrito está vacío</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between items-center border-b pb-2">
              <span>{item.name} x{item.quantity}</span>
              <div className="flex items-center gap-4">
                <span>${item.price * item.quantity}</span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {items.length > 0 && (
        <p className="mt-4 font-bold">Total: ${total()}</p>
      )}
    </div>
  )
}