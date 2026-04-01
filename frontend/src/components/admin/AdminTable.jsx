export default function AdminTable({ columns, data, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/5 border-b border-white/10">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-white/50 text-xs uppercase tracking-wider px-4 py-3 font-medium"
              >
                {col.label}
              </th>
            ))}
            <th className="text-right text-white/50 text-xs uppercase tracking-wider px-4 py-3 font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="text-center text-white/30 py-8">
                No data found
              </td>
            </tr>
          )}
          {data.map((row) => (
            <tr key={row._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-white/80">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(row)}
                  className="text-blue-400 hover:text-blue-300 text-xs mr-3 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(row)}
                  className="text-red-400 hover:text-red-300 text-xs transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
