import { Tabs, Table, TableColumn } from "@/shared/ui";

export interface DataViewerProps {
  columns: TableColumn[];
  initialData: Record<string, React.ReactNode>[];
  expectedData: Record<string, React.ReactNode>[];
}

export function DataViewer({ columns, initialData, expectedData }: DataViewerProps) {
  return (
    <Tabs
      tabs={[
        {
          id: "initial",
          label: "Initial Data",
          content: <Table columns={columns} data={initialData} />,
        },
        {
          id: "expected",
          label: "Expected Result",
          content: <Table columns={columns} data={expectedData} />,
        },
      ]}
    />
  );
}
