import { useOrders } from '../hooks/useOrders';
import OrdersTable from '../components/OrdersTable';

export default function OrdersPage() {
  const { data: pedidos, isLoading, isError } = useOrders();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-on-surface-variant">
         <span className="material-symbols-outlined text-[48px] animate-spin">sync</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center mt-10">
        <h2 className="text-headline-md font-headline-md text-error mb-4">Error al cargar los pedidos</h2>
        <p className="text-body-lg text-on-surface-variant">Por favor, intenta nuevamente más tarde.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg">
      <div className="mb-8 border-b border-outline-variant pb-sm">
        <h1 className="text-headline-xl-mobile md:text-headline-xl font-headline-xl-mobile md:font-headline-xl text-on-surface">Mis Pedidos</h1>
        <p className="text-body-md font-body-md text-on-surface-variant mt-2">Historial de órdenes procesadas en el sistema.</p>
      </div>
      
      <OrdersTable pedidos={pedidos || []} />
    </div>
  );
}
