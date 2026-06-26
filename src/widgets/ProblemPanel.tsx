import { ProblemDescription } from "@/features/challenge/ui/ProblemDescription";
import { SchemaViewer, ColumnDef } from "@/features/challenge/ui/SchemaViewer";
import { DataViewer } from "@/features/challenge/ui/DataViewer";
import { TableColumn } from "@/shared/ui";

export interface ProblemPanelProps {
  challenge: {
    title: string;
    database: string;
    description: string;
  };
  schema: {
    tables: Record<string, ColumnDef[]>;
  };
  dataViewer: {
    initialData: Record<string, Record<string, any>[]>;
    initialTablesSchema: Record<string, ColumnDef[]>;
    expectedColumns?: TableColumn[];
    expectedData?: Record<string, any>[];
    userColumns?: TableColumn[];
    userData?: Record<string, any>[];
    activeTabId?: string;
    onTabChange?: (id: string) => void;
  };
}

export function ProblemPanel({ challenge, schema, dataViewer }: ProblemPanelProps) {
  return (
    <div className="w-full lg:w-1/2 h-full flex flex-col bg-surface-container-lowest border-r border-[#ebebeb] overflow-y-auto">
      <div className="p-lg flex-grow flex flex-col gap-lg">
        <ProblemDescription {...challenge} />
        <SchemaViewer {...schema} />
        <DataViewer {...dataViewer} />
      </div>
    </div>
  );
}

