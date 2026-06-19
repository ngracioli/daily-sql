"use client";

import { SqlEditor } from "@/features/editor/ui/SqlEditor";
import { ExecutionConsole } from "@/features/editor/ui/ExecutionConsole";

export interface EditorPanelProps {
  sqlValue: string;
  onSqlChange: (value: string | undefined) => void;
  onExecute: () => void;
  consoleOutput?: string;
  isExecuting?: boolean;
}

export function EditorPanel({
  sqlValue,
  onSqlChange,
  onExecute,
  consoleOutput,
  isExecuting,
}: EditorPanelProps) {
  return (
    <div className="w-full lg:w-1/2 h-full flex flex-col bg-[#fafafa]">
      <SqlEditor value={sqlValue} onChange={onSqlChange} />
      <ExecutionConsole
        onExecute={onExecute}
        output={consoleOutput}
        isExecuting={isExecuting}
      />
    </div>
  );
}
