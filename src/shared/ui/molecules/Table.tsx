export interface TableColumn {
  key: string;
  header: string;
}

export interface TableProps {
  columns: TableColumn[];
  data: Record<string, React.ReactNode>[];
  className?: string;
}

export function Table({ columns, data, className = "" }: TableProps) {
  return (
    <div className={`border border-[#ebebeb] rounded-lg overflow-hidden bg-white ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#fafafa] border-b border-[#ebebeb]">
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.key}
                className={`p-2 text-label-sm font-label-sm text-secondary uppercase tracking-wider font-normal ${
                  index < columns.length - 1 ? "border-r border-[#ebebeb]" : ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-code-md font-code-md text-[#171717]">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex < data.length - 1 ? "border-b border-[#ebebeb]" : ""}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={col.key}
                  className={`p-2 ${
                    colIndex < columns.length - 1 ? "border-r border-[#ebebeb]" : ""
                  }`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
