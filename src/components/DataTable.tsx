import React from "react";

export interface DataTableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableAction<T> {
  icon: React.ReactNode;
  label: string;
  onClick: (row: T) => void;
  disabled?: boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  actions?: DataTableAction<T>[];
  loading?: boolean;
  error?: string | null;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: number | string }>({
  columns,
  data,
  actions,
  loading,
  error,
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }
  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key as string} className="px-4 py-3">
                {col.label}
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className="px-4 py-3">ACTIONS</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
            key={row.id}
            className={`border-b ${onRowClick ? 'cursor-pointer hover:bg-gray-100' : ''}`}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
              {columns.map((col) => (
                <td key={col.key as string} className="px-4 py-3">
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
              {actions && actions.length > 0 && (
                <td className="px-4 py-3 flex gap-2">
                  {actions.map((action, idx) => (
                    <button
                      key={idx}
                      title={action.label}
                      onClick={() => action.onClick(row)}
                      disabled={action.disabled}
                      className={`${
                        action.disabled
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      {action.icon}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}