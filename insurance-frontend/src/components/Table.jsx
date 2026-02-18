import React from "react";

export default function Table({ columns = [], data = [], emptyMessage = "No data", onRowClick, rowKey }) {
  const getRowKey = (row, i) => {
    if (rowKey && row[rowKey] != null) return row[rowKey];
    return row.id ?? row.car_id ?? row.policy_id ?? row.acc_id ?? row.payment_id ?? row.customer_id ?? i;
  };
  if (!data.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-8 text-center text-slate-500">
        {emptyMessage}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-semibold text-slate-700">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={getRowKey(row, i)}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-slate-100 last:border-0 ${
                onRowClick ? "cursor-pointer hover:bg-primary/5" : ""
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-slate-700">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
