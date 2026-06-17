import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { Pedido } from '../../../../shared/types/domain.types';
import CancelOrderModal from '../CancelOrderModal/CancelOrderModal';
import { useOrders } from '../../hooks/useOrders';

interface OrdersTableProps {
  pedidos: Pedido[];
}

export default function OrdersTable({ pedidos }: OrdersTableProps) {
  const navigate = useNavigate();
  const [pedidoToCancel, setPedidoToCancel] = useState<number | null>(null);
  const { cancel, isCanceling, cancelError, resetCancel } = useOrders();
  const columnHelper = createColumnHelper<Pedido>();

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID Pedido',
      cell: (info) => <span className="font-mono text-label-md text-on-surface-variant bg-surface-container-highest px-2 py-1 rounded">#{info.getValue()}</span>,
    }),
    columnHelper.accessor('created_at', {
      header: 'Fecha',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('estado_codigo', {
      header: 'Estado',
      cell: (info) => (
        <span className="font-semibold px-2 py-1 bg-surface-container-low rounded-lg text-sm border border-outline-variant">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('total', {
      header: 'Total',
      cell: (info) => <span className="font-semibold text-primary">${info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: (info) => {
        const pedido = info.row.original;
        const canCancel = pedido.estado_codigo === 'PENDIENTE' || pedido.estado_codigo === 'CONFIRMADO';

        return (
          <div className="flex gap-2 items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/pedidos/${pedido.id}`);
              }}
              className="text-orange-600 border border-orange-600 hover:bg-orange-100 px-4 py-1.5 rounded-lg transition-colors font-bold text-sm tracking-wide"              title="Ver Detalles"
            >
              Ver
            </button>

            {pedido.estado_codigo === 'PENDIENTE' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/payment/${pedido.id}`);
                }}
                className="text-primary border border-primary hover:bg-primary/10 px-4 py-1.5 rounded-lg transition-colors font-bold text-sm tracking-wide"
              >
                Reintentar Pago
              </button>
            )}

            {canCancel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPedidoToCancel(pedido.id);
                }}
                disabled={isCanceling && pedidoToCancel === pedido.id}
                className="text-error border border-error hover:bg-error-container px-4 py-1.5 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Cancelar Pedido"
              >
                Cancelar Pedido
              </button>
            )}
          </div>
        );
      }
    })
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: pedidos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (pedidos.length === 0) {
    return (
      <div className="text-center py-12 bg-surface rounded-xl border border-outline-variant shadow-sm flex flex-col items-center">
        <span className="material-symbols-outlined text-[48px] text-outline mb-4">receipt_long</span>
        <p className="text-body-lg text-on-surface-variant">No hay pedidos registrados aún.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-surface rounded-xl shadow-sm border border-outline-variant overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-surface-container-low border-b border-outline-variant">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="p-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-4 text-body-sm font-body-sm text-on-surface">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CancelOrderModal
        key={pedidoToCancel || 'closed'}
        pedidoId={pedidoToCancel}
        onClose={() => {
          setPedidoToCancel(null);
          resetCancel();
        }}
        onConfirm={async (motivo) => {
          if (pedidoToCancel) {
            try {
              await cancel({ pedidoId: pedidoToCancel, motivo });
              setPedidoToCancel(null);
            } catch (err) {
              console.error(err);
            }
          }
        }}
        isPending={isCanceling}
      />
      {cancelError && (
        <div className="m-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-body-sm text-center">
          {cancelError instanceof Error ? cancelError.message : 'No se pudo cancelar el pedido. Puede que ya no esté en un estado válido.'}
        </div>
      )}
    </div>
  );
}
