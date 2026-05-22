import { useCartStore, getCantidadDeProducto, getTotalItems } from '../../../store/useCartStore';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { items, removeItem, total, updateQuantity } = useCartStore();
  const navigate = useNavigate();
  const totalItems = getTotalItems(items);

  const subtotal = total; 
  const finalTotal = subtotal; 

  return (
    <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      <div className="lg:col-span-8 flex flex-col gap-lg">
        <div className="flex justify-between items-end border-b border-outline-variant pb-sm">
          <h1 className="text-headline-xl-mobile md:text-headline-xl font-headline-xl-mobile md:font-headline-xl text-on-surface">Your Order</h1>
          <span className="text-body-md font-body-md text-on-surface-variant">{totalItems} Items</span>
        </div>
        
        {items.length === 0 ? (
          <p className="mt-4 text-body-lg text-on-surface-variant text-center py-10">Tu carrito está vacío</p>
        ) : (
          items.map((item) => {
             const imagen = item.producto.imagenes_url?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop';
             return (
              <div key={item.producto.id + item.personalizacion.join('-')} className="flex flex-col sm:flex-row gap-gutter py-md border-b border-outline-variant">
                <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant">
                  <img alt={item.producto.nombre} className="w-full h-full object-cover" src={imagen} />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-headline-md font-headline-md text-on-surface">{item.producto.nombre}</h3>
                      <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
                          {item.producto.descripcion.substring(0, 60)}...
                      </p>
                    </div>
                    <p className="text-headline-md font-headline-md text-on-surface font-semibold">${item.subtotal}</p>
                  </div>
                  <div className="flex justify-between items-center mt-md sm:mt-0">
                    <div className="flex items-center border border-outline-variant rounded bg-surface h-8">
                      <button 
                        onClick={() => updateQuantity(item.producto.id, item.cantidad - 1, item.personalizacion)}
                        className="px-3 h-full flex items-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <span className="px-3 h-full flex items-center text-label-md font-label-md text-on-surface border-x border-outline-variant min-w-[40px] justify-center">{item.cantidad}</span>
                      <button 
                        onClick={() => updateQuantity(item.producto.id, item.cantidad + 1, item.personalizacion)}
                        disabled={getCantidadDeProducto(items, item.producto.id) >= item.producto.stock_cantidad}
                        className="px-3 h-full flex items-center text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.producto.id, item.personalizacion)}
                      className="text-body-sm font-body-sm text-outline hover:text-error transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span> Remove
                    </button>
                  </div>
                </div>
              </div>
             );
          })
        )}
      </div>

      <div className="lg:col-span-4 mt-lg lg:mt-0">
        <div className="bg-surface border border-outline-variant rounded-lg p-md sticky top-28 shadow-sm">
          <h2 className="text-headline-md font-headline-md text-on-surface border-b border-outline-variant pb-sm mb-md">Order Summary</h2>
          <div className="flex flex-col gap-sm text-body-md font-body-md text-on-surface-variant mb-md">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-on-surface">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-on-surface">$0.00</span>
            </div>
            <div className="flex justify-between items-center text-primary mt-base">
              <span className="text-label-md font-label-md flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">local_offer</span> Have a promo code?</span>
              <button className="underline decoration-primary hover:text-primary-container">Apply</button>
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-outline-variant pt-md mb-lg">
            <span className="text-headline-md font-headline-md text-on-surface font-bold">Total</span>
            <span className="text-headline-md font-headline-md text-on-surface font-bold">${finalTotal.toFixed(2)}</span>
          </div>
          <button 
            disabled={items.length === 0}
            onClick={() => navigate('/checkout')}
            className="w-full bg-primary-container text-on-primary text-label-md font-label-md py-3 rounded-lg hover:bg-primary transition-colors flex justify-center items-center gap-2 disabled:bg-surface-variant disabled:text-on-surface-variant disabled:cursor-not-allowed"
          >
            Proceed to Checkout
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
          <p className="text-center text-body-sm font-body-sm text-outline mt-sm">
            Secure checkout powered by Retail Precision
          </p>
        </div>
      </div>
    </div>
  )
}