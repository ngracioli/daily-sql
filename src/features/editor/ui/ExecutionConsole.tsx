import { Button, Icon, Tabs } from "@/shared/ui";

export interface QueryHistoryEntry {
  id: string;
  query: string;
  success: boolean;
  timestamp: string;
  executionTimeMs?: number;
}

export interface ExecutionConsoleProps {
  onExecute: () => void;
  output?: string;
  isExecuting?: boolean;
  history: QueryHistoryEntry[];
  onRestoreQuery: (query: string) => void;
}

export function ExecutionConsole({
  onExecute,
  output,
  isExecuting,
  history,
  onRestoreQuery,
}: ExecutionConsoleProps) {
  const tabs = [
    {
      id: "console",
      label: "Console Output",
      content: (
        <div className="bg-[#fafafa] border border-[#ebebeb] rounded-lg flex items-center justify-center shadow-[inset_0_0_0_1px_#ebebeb] overflow-auto p-4 min-h-[160px] h-[160px]">
          {output ? (
            <pre className="text-code-md font-code-md text-[#171717] w-full h-full whitespace-pre-wrap text-left font-mono">
              {output}
            </pre>
          ) : (
            <span className="text-code-md font-code-md text-on-surface-variant italic">
              Waiting for query execution...
            </span>
          )}
        </div>
      ),
    },
    {
      id: "history",
      label: `History (${history.length})`,
      content: (
        <div className="bg-[#fafafa] border border-[#ebebeb] rounded-lg flex flex-col shadow-[inset_0_0_0_1px_#ebebeb] overflow-y-auto p-4 min-h-[160px] h-[160px]">
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-code-md font-code-md text-on-surface-variant italic">
                No past executions for this challenge.
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-sm">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-sm border border-[#ebebeb] rounded-lg bg-surface-container-lowest hover:bg-[#f6f6f6] transition-colors"
                >
                  <div className="flex items-center gap-md min-w-0 flex-grow pr-md">
                    {entry.success ? (
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex-shrink-0">
                        <Icon name="check" className="text-[14px]" />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex-shrink-0">
                        <Icon name="close" className="text-[14px]" />
                      </span>
                    )}
                    <div className="flex flex-col min-w-0 flex-grow text-left">
                      <code className="text-code-sm font-code-sm text-secondary truncate bg-neutral-100 px-1.5 py-0.5 rounded font-mono">
                        {entry.query.replace(/\s+/g, " ")}
                      </code>
                      <span className="text-[10px] text-neutral-400 mt-0.5">
                        {entry.timestamp} {entry.executionTimeMs !== undefined && `• ${entry.executionTimeMs}ms`}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="py-1 px-3 text-label-sm font-label-sm flex items-center gap-1 hover:bg-neutral-200 flex-shrink-0"
                    onClick={() => onRestoreQuery(entry.query)}
                  >
                    <Icon name="restore" className="text-[14px]" />
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="h-80 flex flex-col p-lg gap-lg bg-surface-container-lowest border-t border-[#ebebeb]">
      <div className="flex justify-between items-center">
        <span className="text-label-sm font-label-sm text-secondary uppercase tracking-wider">
          Execution Panel
        </span>
        <Button onClick={onExecute} disabled={isExecuting} className="flex items-center gap-2">
          <Icon name="play_arrow" className="text-[18px]" />
          {isExecuting ? "Executing..." : "Execute Query"}
        </Button>
      </div>
      <div className="flex-grow flex flex-col overflow-hidden">
        <Tabs tabs={tabs} defaultTabId="console" />
      </div>
    </div>
  );
}

