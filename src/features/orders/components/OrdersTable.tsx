import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { Pedido } from '../../../shared/types/domain.types';

interface OrdersTableProps {
  pedidos: Pedido[];
}

export default function OrdersTable({ pedidos }: OrdersTableProps) {
  const columns = [
    {
      header: 'ID Pedido',
      accessorKey: 'id',
      cell: (info: any) => <span className="font-mono text-label-md text-on-surface-variant bg-surface-container-highest px-2 py-1 rounded">{info.getValue().slice(0, 8)}</span>,
    },
    {
      header: 'Fecha',
      accessorKey: 'fecha',
      cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      header: 'Cliente',
      accessorKey: 'nombre',
    },
    {
      header: 'Total',
      accessorKey: 'total',
      cell: (info: any) => <span className="font-semibold text-primary">${info.getValue()}</span>,
    }
  ];

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
    </div>
  );
}
