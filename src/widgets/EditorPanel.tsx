"use client";

import { SqlEditor } from "@/features/editor/ui/SqlEditor";
import { ExecutionConsole, QueryHistoryEntry } from "@/features/editor/ui/ExecutionConsole";

export interface EditorPanelProps {
  sqlValue: string;
  onSqlChange: (value: string | undefined) => void;
  onExecute: () => void;
  consoleOutput?: string;
  isExecuting?: boolean;
  tableName?: string;
  columns?: string[];
  history: QueryHistoryEntry[];
  onRestoreQuery: (query: string) => void;
}

export function EditorPanel({
  sqlValue,
  onSqlChange,
  onExecute,
  consoleOutput,
  isExecuting,
  tableName,
  columns,
  history,
  onRestoreQuery,
}: EditorPanelProps) {
  return (
    <div className="w-full lg:w-1/2 h-full flex flex-col bg-[#fafafa]">
      <SqlEditor
        value={sqlValue}
        onChange={onSqlChange}
        tableName={tableName}
        columns={columns}
      />
      <ExecutionConsole
        onExecute={onExecute}
        output={consoleOutput}
        isExecuting={isExecuting}
        history={history}
        onRestoreQuery={onRestoreQuery}
      />
    </div>
  );
}

