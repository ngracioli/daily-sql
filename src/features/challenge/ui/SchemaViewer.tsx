export interface ColumnDef {
  name: string;
  type: string;
}

export interface SchemaViewerProps {
  tables: Record<string, ColumnDef[]>;
}

export function SchemaViewer({ tables }: SchemaViewerProps) {
  return (
    <div className="flex flex-col gap-sm">
      <h2 className="text-label-sm font-label-sm text-[#171717] uppercase tracking-wider font-medium">
        Schema
      </h2>
      <div className="flex flex-col gap-md">
        {Object.entries(tables).map(([tableName, columns]) => (
          <div key={tableName} className="bg-[#fafafa] border border-[#ebebeb] rounded-lg p-md">
            <p className="text-code-md font-code-md text-[#171717] mb-2 font-bold">
              Table: {tableName}
            </p>
            <ul className="text-code-sm font-code-sm text-on-surface-variant grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              {columns.map((col) => (
                <li key={col.name} className="flex justify-between border-b border-dashed border-[#ebebeb] pb-0.5">
                  <span className="font-mono text-[#171717]">{col.name}</span>
                  <span className="text-secondary italic text-[11px]">{col.type}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

