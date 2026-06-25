import { Tabs, Table, TableColumn } from "@/shared/ui";

export interface DataViewerProps {
  initialColumns: TableColumn[];
  initialData: Record<string, any>[];
  expectedColumns?: TableColumn[];
  expectedData?: Record<string, any>[];
  userColumns?: TableColumn[];
  userData?: Record<string, any>[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
}

export function DataViewer({
  initialColumns,
  initialData,
  expectedColumns,
  expectedData,
  userColumns,
  userData,
  activeTabId,
  onTabChange,
}: DataViewerProps) {
  const tabs = [
    {
      id: "initial",
      label: "Initial Data",
      content: <Table columns={initialColumns} data={initialData} />,
    },
    {
      id: "expected",
      label: "Expected Result",
      content: expectedColumns && expectedData ? (
        <Table columns={expectedColumns} data={expectedData} />
      ) : (
        <Table columns={initialColumns} data={initialData} />
      ),
    },
    {
      id: "user",
      label: "Your Result",
      content: userColumns && userData ? (
        <Table columns={userColumns} data={userData} />
      ) : (
        <div className="p-8 border border-dashed border-[#ebebeb] rounded-lg bg-[#fafafa] text-center">
          <p className="text-label-sm font-label-sm text-secondary italic">
            No query execution data yet. Execute your query to see results here.
          </p>
        </div>
      ),
    },
  ];

  return (
    <Tabs
      tabs={tabs}
      activeTabId={activeTabId}
      onTabChange={onTabChange}
    />
  );
}
