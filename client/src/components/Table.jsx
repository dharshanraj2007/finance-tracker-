import clsx from 'clsx';

const Table = ({ columns = [], data = [], emptyMessage = "No entries found", className }) => {
  return (
    <div className={clsx("overflow-x-auto w-full", className)}>
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-fintech-dark text-fintech-textMuted text-xs uppercase tracking-wider border-b border-fintech-border">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={clsx(
                  "px-6 py-4 font-semibold text-xs tracking-wider",
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                )}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-fintech-border bg-fintech-card/10">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-fintech-textMuted">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <span className="text-sm font-medium">{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr 
                key={row._id || rowIdx} 
                className="hover:bg-fintech-dark/30 transition-colors duration-150"
              >
                {columns.map((col, colIdx) => (
                  <td 
                    key={colIdx} 
                    className={clsx(
                      "px-6 py-4 text-sm text-fintech-text font-medium",
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    )}
                  >
                    {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
