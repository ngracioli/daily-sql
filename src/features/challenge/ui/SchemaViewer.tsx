export interface ColumnDef {
  name: string;
  type: string;
}

export interface SchemaViewerProps {
  tableName: string;
  columns: ColumnDef[];
}

export function SchemaViewer({ tableName, columns }: SchemaViewerProps) {
  return (
    <div className="flex flex-col gap-sm">
      <h2 className="text-label-sm font-label-sm text-[#171717] uppercase tracking-wider font-medium">
        Schema
      </h2>
      <div className="bg-[#fafafa] border border-[#ebebeb] rounded-lg p-md">
        <p className="text-code-md font-code-md text-[#171717] mb-2 font-bold">
          Table: {tableName}
        </p>
        <ul className="text-code-md font-code-md text-on-surface-variant space-y-1">
          {columns.map((col) => (
            <li key={col.name}>
              <span className="text-secondary">{col.name}:</span> {col.type}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
