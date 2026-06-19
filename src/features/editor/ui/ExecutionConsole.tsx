import { Button, Icon } from "@/shared/ui";

export interface ExecutionConsoleProps {
  onExecute: () => void;
  output?: string;
  isExecuting?: boolean;
}

export function ExecutionConsole({ onExecute, output, isExecuting }: ExecutionConsoleProps) {
  return (
    <div className="h-64 flex flex-col p-lg gap-lg bg-surface-container-lowest">
      <div className="flex justify-end">
        <Button onClick={onExecute} disabled={isExecuting} className="flex items-center gap-2">
          <Icon name="play_arrow" className="text-[18px]" />
          {isExecuting ? "Executing..." : "Execute Query"}
        </Button>
      </div>
      <div className="flex flex-col gap-sm flex-grow">
        <span className="text-label-sm font-label-sm text-secondary uppercase tracking-wider">
          Console
        </span>
        <div className="flex-grow bg-[#fafafa] border border-[#ebebeb] rounded-lg flex items-center justify-center shadow-[inset_0_0_0_1px_#ebebeb] overflow-auto p-4">
          {output ? (
            <pre className="text-code-md font-code-md text-[#171717] w-full h-full whitespace-pre-wrap">
              {output}
            </pre>
          ) : (
            <span className="text-code-md font-code-md text-on-surface-variant italic">
              Waiting for query execution...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
